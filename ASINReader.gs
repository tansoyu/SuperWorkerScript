function doGet(e) {
	var method = e.parameter.m, result = {};
  try {
    if (method === 'READ_EXISTING_ASINS') {
      result = readExistingASINs(e.parameter.spreadId);
    } else if (method === 'APPEND_CA_SELLERS') {
      var code = appendCASellers(e.parameter);
      result.code = code;
    }
  } catch (e) {
    result = {
     code: FAIL,
     message: e.message 
    };
  }
	return ContentService.createTextOutput(JSON.stringify(result));
}

function readExistingASINs(spreadId) {
  var spread = SpreadsheetApp.openById(spreadId);
  var sheet = spread.getSheetByName('KEEPA分析账户统计');
  return readExistingSellers_(sheet);
}

function readExistingSellers_(sheet) {
  var numRows = sheet.getMaxRows();
  var range = sheet.getRange(CA_SELLER_NAME_START_ROW, CA_SELLER_NAME_START_COLUMN, numRows - 1, 1);
  var values = range.getValues();
  return formatASINResult(values);
}

function formatASINResult(values) {
  var result = [];
  for (var i in values) {
    var name = values[i][0].trim();
    if (!name) continue;
    result.push(name); 
  }
  return result;
}

function appendCASellers(params) {
  var sellers = params.sellers.split(',');
  var spread = SpreadsheetApp.openById(params.spreadId);
  var sheet = spread.getSheetByName('KEEPA分析账户统计');
  sellers = removeExistingSellers_(sellers, sheet);
  if (sellers.length == 0) return;
  var index = findFirstBlankRow_(sheet, CA_SELLER_NAME_START_ROW, CA_SELLER_NAME_START_COLUMN);
  var range = sheet.getRange(index + CA_SELLER_NAME_START_ROW, CA_SELLER_NAME_START_COLUMN, sellers.length, 3);
  var values = [];
  for (var i in sellers) {
    values.push([sellers[i], params.operator, params.date]);
  }
  range.setValues(values);
  return SUCCESS;
}

function removeExistingSellers_(sellers, sheet) {
  var currentArr = readExistingSellers_(sheet);
  Logger.log(sellers);
  sellers = sellers.filter(item => {
    return currentArr.indexOf(item) === -1
    });
  Logger.log(sellers);
  return sellers;
}

function findFirstBlankRow_(sheet, row, column) {
  var numRows = sheet.getMaxRows();
  var range = sheet.getRange(row, column, numRows - 1, 1);
  var values = range.getValues();
  var index = 0;
  for (var i in values) {
    if (values[i][0].trim().length > 0) index = i;
  }
  return parseInt(index) + 1;
}
