# Google Sheets admission records

The CMS sends each **approved** student application to the Google Apps Script Web App URL saved in **Admin Panel → Student Forms**.

1. Create a Google Sheet and open **Extensions → Apps Script**.
2. Replace the default code with the script below, then save it.
3. Select **Deploy → New deployment → Web app**. Set access to the appropriate audience (for a public CMS integration, select **Anyone**) and deploy.
4. Copy the deployment URL ending in `/exec` into **Student Forms → Google Sheets sync** in the CMS.

```javascript
const SHEET_NAME = 'Approved Applications';

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const app = payload.application;
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Application ID', 'Student Name', 'Father Name', 'Phone', 'Previous School',
      'Class', 'Program', 'Message', 'Submitted At', 'Approved At', 'Status'
    ]);
  }

  sheet.appendRow([
    app.id, app.studentName, app.fatherName, app.phone, app.prevSchool,
    app.currentClass, app.program, app.message || '', app.submittedAt,
    app.actionedAt, app.status
  ]);

  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

If you update the Apps Script code later, create a new deployment or update the active deployment, then keep the CMS URL current. The CMS stores a local audit record even if Google Apps Script is temporarily unavailable.
