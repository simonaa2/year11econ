// ===================================================
// ECONOMICS SCAFFOLD — CONFIGURATION
// ===================================================

const CONFIG = {
  // Google Apps Script Web App URL (from your setup):
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwGMpiAOYdTLbsAmidzndnrWdUz-dPgsD62VlLutFeOdQDrA5oFDP9kuAhho_NiX3to/exec',

  // App details:
  APP_TITLE:    'Year 11 Economics 2026',
  APP_SUBTITLE: 'Labour & Financial Markets — Research Scaffold',
  DUE_DATE:     '2026-06-19T09:50:00+10:00',

  // -----------------------------------------------
  // STUDENT ROSTER
  // Add each student as: { name: 'Full Name', password: 'password' }
  // Name must match exactly what they type on the login page.
  // Passwords can be anything — e.g. first name + last 2 digits of DOB.
  // Leave the array empty [] to use the old class-code system instead.
  // -----------------------------------------------
  STUDENTS: [
    { name: 'Simon Anderson',            password: 'simon01'    },
    { name: 'Cooper McMahon',            password: 'cooper01'   },
    { name: 'Alessandro Moretto Martins',password: 'alex01'     },
    { name: 'Noah Scully',               password: 'noah01'     },
    { name: 'William Falconer',          password: 'william01'  },
    { name: 'Jake Ianni',                password: 'jake01'     },
    { name: 'Zac McGrath',               password: 'zac01'      },
    // Add more students here...
  ],

  // Fallback class code (only used if STUDENTS list is empty):
  CLASS_CODE: 'ECON2026',

  // Teacher dashboard password:
  TEACHER_PASSWORD: 'teacher2026',
};
