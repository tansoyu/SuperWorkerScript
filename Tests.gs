function test_appendCASellers() {
  var spreadId = '10umm2B5rqIX-wbxY6l7Elakzp2dYODh0f520N2NtrwQ',
  sellers = 'ELYSIUM 🇨🇦,INNA FOX STORE,SHOPİNGZON,a,b,c',
  operator = 'Super Worker',
  date = '2021-01-21';
  var params = {
    spreadId: spreadId,
    sellers: sellers,
    operator: operator,
    date: date
  };
  appendCASellers(params);
}

function test_checkDuplicated() {
  var spreadId = '10umm2B5rqIX-wbxY6l7Elakzp2dYODh0f520N2NtrwQ';
  var spread = SpreadsheetApp.openById(spreadId);
  var sheet = spread.getSheetByName('KEEPA分析账户统计');
  var rows = sheet.getMaxRows();

  var range = sheet.getRange(2, 2, rows - 1, 1);
  var values = range.getValues();
  var sellers = {};
  for (var i in values) {
    var seller = values[i][0].trim();
    if (!seller) continue;
    if (typeof sellers[seller] === 'undefined') {
      sellers[seller] = 1;
    } else {
      sellers[seller]++;
    }
  }
  for (var seller in sellers) {
    if (sellers[seller] > 1) Logger.log(seller); 
  }
}