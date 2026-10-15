/**
 * Monthly Budget - Google Apps Script template
 *
 * How to use:
 * 1. Open your Google Sheet where you want to use the budget app.
 * 2. Extensions -> Apps Script
 * 3. Create a new project (or replace the default Code.gs) and paste the contents of this file.
 * 4. Save the project. Run the onOpen function once from the Apps Script editor to authorize permissions,
 *    or reload the spreadsheet to trigger the onOpen menu automatically.
 * 5. Use the 'Monthly Budget' menu in the sheet to insert a sample transaction or run the helper functions.
 *
 * Notes:
 * - This script expects a sheet named "Transactions". If it doesn't exist the script will create it and
 *   add header columns: Date, Category, Amount, Note.
 * - You can call insertTransaction(date, category, amount, note) from other scripts or Apps Script webhooks.
 */

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Monthly Budget')
    .addItem('Insert sample transaction','insertSampleTransaction')
    .addItem('Export transactions as CSV (to Drive)','exportTransactionsCsv')
    .addToUi();
}

function insertSampleTransaction() {
  insertTransaction(new Date(), 'Groceries', 12.34, 'Sample');
}

/**
 * Append a transaction row to the Transactions sheet.
 * @param {Date} date
 * @param {string} category
 * @param {number} amount
 * @param {string} note
 */
function insertTransaction(date, category, amount, note) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Transactions');
  if (!sheet) {
    sheet = ss.insertSheet('Transactions');
    sheet.appendRow(['Date','Category','Amount','Note']);
  }
  var tz = ss.getSpreadsheetTimeZone();
  var dateStr = Utilities.formatDate(new Date(date), tz, 'yyyy-MM-dd');
  sheet.appendRow([dateStr, category, amount, note || '']);
}

/**
 * Export the Transactions sheet as CSV and save it to the user's Google Drive. Shows an alert with the file URL.
 */
function exportTransactionsCsv() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Transactions');
  if (!sheet) {
    SpreadsheetApp.getUi().alert('No Transactions sheet found.');
    return;
  }
  var data = sheet.getDataRange().getValues();
  var csvLines = data.map(function(row){
    return row.map(function(cell){
      var text = cell === null || cell === undefined ? '' : String(cell);
      // Escape double quotes
      text = text.replace(/"/g, '""');
      return '"' + text + '"';
    }).join(',');
  });
  var csv = csvLines.join('\n');
  var file = DriveApp.createFile('transactions.csv', csv, MimeType.CSV);
  SpreadsheetApp.getUi().alert('CSV exported to your Drive: ' + file.getUrl());
}
