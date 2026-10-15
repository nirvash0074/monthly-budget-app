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
 * - This script expects sheets named "Transactions" and "Categories". If they don't exist the script will create them.
 * - Transactions header columns: Date, Category, Amount, Note.
 * - Categories header columns: Category, Monthly Budget, Description.
 * - You can call insertTransaction(date, category, amount, note) and insertCategory(name, monthlyBudget, description)
 *   from other scripts or Apps Script webhooks.
 */

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Monthly Budget')
    .addItem('Insert sample transaction','insertSampleTransaction')
    .addItem('Export transactions as CSV (to Drive)','exportTransactionsCsv')
    .addSeparator()
    .addItem('Insert sample category','insertSampleCategory')
    .addItem('List categories (alert)','listCategories')
    .addItem('Export categories as CSV (to Drive)','exportCategoriesCsv')
    .addToUi();
}

// --- Transactions ---
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

// --- Categories ---
function insertSampleCategory() {
  insertCategory('Groceries', 300, 'Monthly groceries budget');
  SpreadsheetApp.getUi().alert('Inserted sample category: Groceries');
}

/**
 * Insert a category row into the Categories sheet.
 * @param {string} name
 * @param {number} monthlyBudget
 * @param {string} description
 */
function insertCategory(name, monthlyBudget, description) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Categories');
  if (!sheet) {
    sheet = ss.insertSheet('Categories');
    sheet.appendRow(['Category','Monthly Budget','Description']);
  }
  sheet.appendRow([name, monthlyBudget || 0, description || '']);
}

/**
 * Return categories as an array of objects: {category, monthlyBudget, description}
 */
function getCategories() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Categories');
  if (!sheet) return [];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  var rows = data.slice(1);
  return rows.map(function(r){
    return {
      category: r[0],
      monthlyBudget: r[1],
      description: r[2]
    };
  });
}

/**
 * Show a simple alert listing categories (limited to first 20 to avoid very long alerts)
 */
function listCategories() {
  var cats = getCategories();
  if (!cats || cats.length === 0) {
    SpreadsheetApp.getUi().alert('No categories found.');
    return;
  }
  var lines = cats.slice(0,20).map(function(c){
    return c.category + ' — ' + (c.monthlyBudget || 0) + (c.description ? ' ('+c.description+')' : '');
  });
  var more = cats.length > 20 ? '\n... and ' + (cats.length - 20) + ' more' : '';
  SpreadsheetApp.getUi().alert('Categories:\n' + lines.join('\n') + more);
}

/**
 * Export the Categories sheet as CSV and save it to the user's Google Drive. Shows an alert with the file URL.
 */
function exportCategoriesCsv() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Categories');
  if (!sheet) {
    SpreadsheetApp.getUi().alert('No Categories sheet found.');
    return;
  }
  var data = sheet.getDataRange().getValues();
  var csvLines = data.map(function(row){
    return row.map(function(cell){
      var text = cell === null || cell === undefined ? '' : String(cell);
      text = text.replace(/"/g, '""');
      return '"' + text + '"';
    }).join(',');
  });
  var csv = csvLines.join('\n');
  var file = DriveApp.createFile('categories.csv', csv, MimeType.CSV);
  SpreadsheetApp.getUi().alert('CSV exported to your Drive: ' + file.getUrl());
}
