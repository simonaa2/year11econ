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
    { name: 'Simon Anderson',            password: 'simon47'   },
    { name: 'Student 2',                 password: 'student2'  },
    { name: 'Student 3',                 password: 'student3'  },
    { name: 'Student 4',                 password: 'student4'  },
    { name: 'Student 5',                 password: 'student5'  },
    { name: 'Student 6',                 password: 'student6'  },
    { name: 'Student 7',                 password: 'student7'  },
    // Add more students here...
  ],

  // Fallback class code (only used if STUDENTS list is empty):
  CLASS_CODE: 'ECON2026',

  // Teacher dashboard password:
  TEACHER_PASSWORD: 'teacher2026',
};
