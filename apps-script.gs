// YEAR 11 ECONOMICS SCAFFOLD - Google Apps Script
// -----------------------------------------------
// SETUP INSTRUCTIONS:
// 1. Go to script.google.com (school Google account)
// 2. Click "New project"
// 3. Delete all existing code and paste this file
// 4. Change TEACHER_PASSWORD below to something only you know
// 5. Click Deploy > New deployment
//    - Type: Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 6. Click Deploy, copy the Web App URL
// 7. Paste that URL into config.js on your other computer
// -----------------------------------------------

// CHANGE THIS PASSWORD before deploying!
var TEACHER_PASSWORD = 'teacher2026';

// The sheet tab name that stores submissions:
var SHEET_NAME = 'Submissions';

// -----------------------------------------------

function doPost(e) {
  try {
    var raw  = e.postData ? e.postData.contents : '';
    var data = JSON.parse(raw);

    var ss    = getOrCreateSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(getHeaders());
      sheet.getRange(1, 1, 1, getHeaders().length)
           .setFontWeight('bold')
           .setBackground('#1a237e')
           .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    var headers = getHeaders();
    var row = headers.map(function(h) {
      if (h === 'Submitted At') return new Date(data.timestamp || new Date());
      return data[headerToKey(h)] !== undefined ? data[headerToKey(h)] : '';
    });

    sheet.appendRow(row);

    return response({ success: true });

  } catch (err) {
    return response({ success: false, error: err.toString() });
  }
}


function doGet(e) {
  try {
    var pw     = (e.parameter && e.parameter.password) ? e.parameter.password : '';
    var action = (e.parameter && e.parameter.action)   ? e.parameter.action   : 'read';

    if (pw !== TEACHER_PASSWORD) {
      return response({ success: false, error: 'Unauthorized' });
    }

    if (action === 'read') {
      return readSubmissions();
    }

    return response({ success: false, error: 'Unknown action' });

  } catch (err) {
    return response({ success: false, error: err.toString() });
  }
}


function readSubmissions() {
  var ss    = getOrCreateSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    return response({ success: true, submissions: [] });
  }

  var values = sheet.getDataRange().getValues();
  if (values.length <= 1) {
    return response({ success: true, submissions: [] });
  }

  var headers = values[0];
  var nameMap = {};
  var studentCounter = 2;
  var submissions = values.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h, i) {
      obj[headerToKey(h)] = row[i] instanceof Date
        ? row[i].toISOString()
        : String(row[i]);
    });
    var name = (obj.studentName || '').trim();
    if (name && name !== 'Simon Anderson') {
      if (!nameMap[name]) {
        nameMap[name] = 'Student ' + studentCounter++;
      }
      obj.studentName = nameMap[name];
    } else if (!name) {
      obj.studentName = 'Unknown Student';
    }
    obj.timestamp   = obj['timestamp']   || '';
    return obj;
  });

  return response({ success: true, submissions: submissions });
}


function headerToKey(header) {
  var map = {
    'Submitted At':          'timestamp',
    'Student Name':          'studentName',
    'Class Code':            'classCode',
    'Cash Rate':             'cash-rate',
    'Last Rate Change':      'last-change',
    'Direction':             'direction',
    'Rate History':          'rate-history',
    'Inflation (CPI)':       'inflation-rate',
    'RBA Target Band':       'rba-target',
    'RBA Rationale':         'rba-rationale',
    'RBA Outlook':           'rba-outlook',
    'Equity Market':         'equity-market',
    'Debt Market':           'debt-market',
    'Forex Market':          'forex-market',
    'Derivatives Market':    'derivatives-market',
    'RBA (Institution)':     'inst-rba',
    'ASIC':                  'inst-asic',
    'APRA':                  'inst-apra',
    'ASX':                   'inst-asx',
    'Transmission':          'transmission-notes',
    'Unemployment %':        'unemployment',
    'Unemp Date':            'unemp-date',
    'Underemployment %':     'underemployment',
    'Underemp Date':         'underemp-date',
    'WPI %':                 'wpi',
    'WPI Date':              'wpi-date',
    'Participation %':       'participation',
    'Part Date':             'part-date',
    'Unemp Trend':           'unemp-trend',
    'Unemp Trend Notes':     'unemp-trend-notes',
    'Underemp Trend':        'underemp-trend',
    'Underemp Trend Notes':  'underemp-trend-notes',
    'WPI Trend':             'wpi-trend',
    'WPI Trend Notes':       'wpi-trend-notes',
    'Workforce Summary':     'workforce-summary',
    'Fair Work Commission':  'fw-commission',
    'Trade Unions':          'trade-unions',
    'Employer Associations': 'employer-assoc',
    'Federal Government':    'fed-govt',
    'Min Wage':              'min-wage',
    'Labour Demand':         'labour-demand',
    'Labour Supply':         'labour-supply',
    'Unemployment Types':    'unemployment-types',
    'Art1 Title':            'art1-title',
    'Art1 Source':           'art1-source',
    'Art1 Date':             'art1-date',
    'Art1 URL':              'art1-url',
    'Art1 Summary':          'art1-summary',
    'Art1 Stats':            'art1-stats',
    'Art1 Course Link':      'art1-link',
    'Art1 Reliability':      'art1-reliability',
    'Art2 Title':            'art2-title',
    'Art2 Source':           'art2-source',
    'Art2 Date':             'art2-date',
    'Art2 URL':              'art2-url',
    'Art2 Summary':          'art2-summary',
    'Art2 Stats':            'art2-stats',
    'Art2 Course Link':      'art2-link',
    'Art2 Reliability':      'art2-reliability',
    'Article Synthesis':     'article-synthesis',
    'Notes Financial':       'notes-financial',
    'Notes Labour':          'notes-labour',
    'Notes Articles':        'notes-articles'
  };
  return map[header] || header.toLowerCase().replace(/\s+/g, '-');
}


function getHeaders() {
  return [
    'Submitted At', 'Student Name', 'Class Code',
    'Cash Rate', 'Last Rate Change', 'Direction', 'Rate History',
    'Inflation (CPI)', 'RBA Target Band', 'RBA Rationale', 'RBA Outlook',
    'Equity Market', 'Debt Market', 'Forex Market', 'Derivatives Market',
    'RBA (Institution)', 'ASIC', 'APRA', 'ASX', 'Transmission',
    'Unemployment %', 'Unemp Date', 'Underemployment %', 'Underemp Date',
    'WPI %', 'WPI Date', 'Participation %', 'Part Date',
    'Unemp Trend', 'Unemp Trend Notes',
    'Underemp Trend', 'Underemp Trend Notes',
    'WPI Trend', 'WPI Trend Notes', 'Workforce Summary',
    'Fair Work Commission', 'Trade Unions', 'Employer Associations',
    'Federal Government', 'Min Wage', 'Labour Demand', 'Labour Supply',
    'Unemployment Types',
    'Art1 Title', 'Art1 Source', 'Art1 Date', 'Art1 URL',
    'Art1 Summary', 'Art1 Stats', 'Art1 Course Link', 'Art1 Reliability',
    'Art2 Title', 'Art2 Source', 'Art2 Date', 'Art2 URL',
    'Art2 Summary', 'Art2 Stats', 'Art2 Course Link', 'Art2 Reliability',
    'Article Synthesis',
    'Notes Financial', 'Notes Labour', 'Notes Articles'
  ];
}


function response(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}


function getOrCreateSpreadsheet() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('SPREADSHEET_ID');
  if (id) {
    try {
      return SpreadsheetApp.openById(id);
    } catch (e) {
      // ID is stale, create a new one below
    }
  }
  var ss = SpreadsheetApp.create('Econ Submissions 2026');
  props.setProperty('SPREADSHEET_ID', ss.getId());
  return ss;
}
