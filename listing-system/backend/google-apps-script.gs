/**
 * MalickLand — Google Apps Script Backend
 *
 * SETUP:
 *  1. Create a new Google Apps Script project at script.google.com
 *  2. Paste this entire file into Code.gs
 *  3. Set SHEET_ID and DRIVE_FOLDER_ID below (or use PropertiesService — see comments)
 *  4. Deploy → New Deployment → Web App
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  5. Copy the Web App URL → paste into Listing Manager config
 *
 * This script handles two request types (POST body: { type: 'listing' | 'lead', ...data }):
 *   type=listing → saves to "Listings" sheet + uploads images to Drive
 *   type=lead    → saves to "Leads" sheet + sends email notification
 */

// ─── CONFIGURATION ────────────────────────────────────────────────────────────
// Option A: Hard-code values here (simple)
const CONFIG = {
  SHEET_ID:         'YOUR_GOOGLE_SHEET_ID',        // From sheet URL: /spreadsheets/d/{ID}/
  DRIVE_FOLDER_ID:  'YOUR_GOOGLE_DRIVE_FOLDER_ID', // Parent folder for listing images
  NOTIFY_EMAIL:     'phil@malickland.net',          // Email to receive lead notifications
  SITE_URL:         'https://malickland.net',
};

// Option B: Use Script Properties (more secure — set via File > Project properties > Script properties)
// const CONFIG = {
//   SHEET_ID:        PropertiesService.getScriptProperties().getProperty('SHEET_ID'),
//   DRIVE_FOLDER_ID: PropertiesService.getScriptProperties().getProperty('DRIVE_FOLDER_ID'),
//   NOTIFY_EMAIL:    PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL'),
//   SITE_URL:        'https://malickland.net',
// };

// Sheet names
const SHEET_LISTINGS = 'Listings';
const SHEET_LEADS    = 'Leads';


// ─── MAIN ENTRY POINT ─────────────────────────────────────────────────────────
function doPost(e) {
  try {
    const raw = e.postData.contents;
    const data = JSON.parse(raw);

    if (data.type === 'listing') {
      return saveListing(data);
    } else if (data.type === 'lead') {
      return saveLead(data);
    } else {
      return respond({ success: false, error: 'Unknown type: ' + data.type });
    }
  } catch (err) {
    Logger.log('doPost error: ' + err.message);
    return respond({ success: false, error: err.message });
  }
}

// Also handle GET for health checks / CORS preflight
function doGet(e) {
  return respond({ ok: true, service: 'MalickLand Apps Script', ts: Date.now() });
}


// ─── SAVE LISTING ─────────────────────────────────────────────────────────────
function saveListing(data) {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sheet = getOrCreateSheet(ss, SHEET_LISTINGS, LISTING_HEADERS);

  // Check if listing already exists (update by slug)
  const existing = findRowBySlug(sheet, data.slug);

  // Handle images — upload to Drive, replace base64 with Drive URLs
  let imageUrls = '';
  if (data.images && data.images.length > 0) {
    const folder = getListingFolder(data.slug);
    const urls = [];

    data.images.forEach(function(base64Data, i) {
      try {
        // Extract mime type and data from data URI
        const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
        if (!matches) return;

        const mimeType = matches[1];
        const b64 = matches[2];
        const ext = mimeType.split('/')[1] || 'jpg';
        const filename = 'photo-' + (i + 1) + '.' + ext;

        const blob = Utilities.newBlob(Utilities.base64Decode(b64), mimeType, filename);
        const file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

        // Direct image URL (using export=view for Google Drive)
        const fileId = file.getId();
        urls.push('https://drive.google.com/uc?export=view&id=' + fileId);
      } catch (imgErr) {
        Logger.log('Image upload error (photo ' + (i+1) + '): ' + imgErr.message);
      }
    });

    imageUrls = urls.join(' | ');
  }

  const now = new Date();
  const row = [
    data.id || generateId(),
    data.slug || '',
    data.title || '',
    data.address || '',
    data.city || '',
    data.county || '',
    data.state || 'WV',
    data.zip || '',
    data.price || '',
    data.type || '',
    data.status || 'Active',
    data.beds || '',
    data.baths || '',
    data.sqft || '',
    data.acres || '',
    data.yearBuilt || '',
    data.garage || '',
    data.water || '',
    data.sewer || '',
    data.description || '',
    (data.features || []).join(', '),
    imageUrls,
    CONFIG.SITE_URL + '/listing/' + data.slug,
    data.agentPhone || '(540) 246-1421',
    data.agentEmail || 'phil@malickland.net',
    data.createdAt || now.toISOString(),
    now.toISOString(),  // updatedAt
  ];

  if (existing > 0) {
    // Update existing row
    const lastCol = LISTING_HEADERS.length;
    sheet.getRange(existing, 1, 1, lastCol).setValues([row]);
    Logger.log('Updated listing: ' + data.slug + ' at row ' + existing);
  } else {
    // Append new row
    sheet.appendRow(row);
    Logger.log('Added new listing: ' + data.slug);
  }

  return respond({
    success: true,
    action: existing > 0 ? 'updated' : 'created',
    slug: data.slug,
    url: CONFIG.SITE_URL + '/listing/' + data.slug,
    imageCount: (data.images || []).length,
  });
}


// ─── SAVE LEAD ────────────────────────────────────────────────────────────────
function saveLead(data) {
  const ss = SpreadsheetApp.openById(CONFIG.SHEET_ID);
  const sheet = getOrCreateSheet(ss, SHEET_LEADS, LEAD_HEADERS);
  const now = new Date();

  const row = [
    data.id || generateId(),
    data.name || '',
    data.phone || '',
    data.email || '',
    data.message || '',
    data.listingSlug || '',
    data.listingTitle || '',
    data.listingPrice || '',
    data.country || '',
    data.source || 'listing-page',
    data.createdAt || now.toISOString(),
  ];

  sheet.appendRow(row);
  Logger.log('New lead: ' + data.name + ' for ' + data.listingSlug);

  // Send email notification
  if (CONFIG.NOTIFY_EMAIL) {
    try {
      const subject = '🏡 New Lead: ' + (data.listingTitle || data.listingSlug || 'Listing') + ' — MalickLand';
      const body = [
        'NEW LEAD RECEIVED',
        '─────────────────────',
        'Name:     ' + (data.name || 'N/A'),
        'Phone:    ' + (data.phone || 'N/A'),
        'Email:    ' + (data.email || 'N/A'),
        '',
        'Listing:  ' + (data.listingTitle || data.listingSlug || 'N/A'),
        'Price:    ' + (data.listingPrice ? '$' + Number(data.listingPrice).toLocaleString() : 'N/A'),
        'Listing URL: ' + (data.listingSlug ? CONFIG.SITE_URL + '/listing/' + data.listingSlug : 'N/A'),
        '',
        'Message:',
        data.message || '(none)',
        '',
        '─────────────────────',
        'Received: ' + now.toLocaleString('en-US', { timeZone: 'America/New_York' }),
        'Source:   ' + (data.source || 'listing-page'),
        '',
        'View all leads in Google Sheets: https://docs.google.com/spreadsheets/d/' + CONFIG.SHEET_ID,
      ].join('\n');

      MailApp.sendEmail(CONFIG.NOTIFY_EMAIL, subject, body);
      Logger.log('Lead notification sent to ' + CONFIG.NOTIFY_EMAIL);
    } catch (mailErr) {
      Logger.log('Email notification failed: ' + mailErr.message);
    }
  }

  return respond({ success: true, id: row[0] });
}


// ─── SHEET HELPERS ────────────────────────────────────────────────────────────
const LISTING_HEADERS = [
  'ID', 'Slug', 'Title', 'Address', 'City', 'County', 'State', 'ZIP',
  'Price', 'Type', 'Status', 'Beds', 'Baths', 'Sq Ft', 'Acres',
  'Year Built', 'Garage', 'Water', 'Sewer', 'Description', 'Features',
  'Image URLs', 'Listing URL', 'Agent Phone', 'Agent Email',
  'Created At', 'Updated At',
];

const LEAD_HEADERS = [
  'ID', 'Name', 'Phone', 'Email', 'Message',
  'Listing Slug', 'Listing Title', 'Listing Price',
  'Country', 'Source', 'Received At',
];

function getOrCreateSheet(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    // Add headers
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers]);
    headerRange.setBackground('#1C3A1C');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(11);
    sheet.setFrozenRows(1);
    sheet.setColumnWidths(1, headers.length, 140);
    Logger.log('Created sheet: ' + name);
  }
  return sheet;
}

function findRowBySlug(sheet, slug) {
  if (!slug) return -1;
  const data = sheet.getDataRange().getValues();
  // Find "Slug" column index (column B = index 1)
  for (let r = 1; r < data.length; r++) {
    if (data[r][1] === slug) return r + 1; // 1-indexed row
  }
  return -1;
}

function getListingFolder(slug) {
  const parentFolder = DriveApp.getFolderById(CONFIG.DRIVE_FOLDER_ID);
  const name = 'listing-' + slug;

  // Try to find existing folder
  const it = parentFolder.getFoldersByName(name);
  if (it.hasNext()) return it.next();

  // Create new folder
  return parentFolder.createFolder(name);
}


// ─── UTILS ────────────────────────────────────────────────────────────────────
function generateId() {
  return Utilities.base64Encode(Utilities.getUuid()).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
}

function respond(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}


// ─── TEST FUNCTION (run manually to verify) ──────────────────────────────────
function testSaveListing() {
  const testData = {
    type: 'listing',
    id: 'test-001',
    slug: 'test-123-main-street',
    title: '123 Main Street',
    address: '123 Main Street',
    city: 'Romney',
    county: 'Hampshire County',
    state: 'WV',
    zip: '26757',
    price: 185000,
    type: 'Residential',
    status: 'Active',
    beds: 3,
    baths: 2,
    sqft: 1800,
    acres: 0.5,
    description: 'Test listing from Apps Script',
    features: ['Mountain Views', 'Central A/C'],
    images: [],
    createdAt: new Date().toISOString(),
  };
  const result = saveListing(testData);
  Logger.log(result.getContent());
}

function testSaveLead() {
  const testData = {
    type: 'lead',
    name: 'John Doe',
    phone: '(304) 555-1234',
    email: 'john@example.com',
    message: 'Interested in this property',
    listingSlug: 'test-123-main-street',
    listingTitle: '123 Main Street',
    listingPrice: 185000,
  };
  const result = saveLead(testData);
  Logger.log(result.getContent());
}
