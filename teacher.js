// ===================================================
// TEACHER DASHBOARD — teacher.js
// ===================================================

let allSubmissions = [];
let currentSort = 'time';
let teacherPassword = '';

// ===== LOGIN =====
function teacherLogin() {
  const pw = document.getElementById('teacher-pw').value;
  if (!pw) { showTlError('Please enter the password.'); return; }

  if (!CONFIG.SCRIPT_URL || CONFIG.SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
    showTlError('Google Sheet not connected yet. Update SCRIPT_URL in config.js first.');
    return;
  }

  teacherPassword = pw;
  document.getElementById('teacher-login').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  loadSubmissions();
}

function teacherLogout() {
  teacherPassword = '';
  document.getElementById('teacher-login').style.display = 'block';
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('teacher-pw').value = '';
}

function showTlError(msg) {
  const el = document.getElementById('tl-error');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 5000);
}

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('teacher-login').style.display !== 'none') {
    teacherLogin();
  }
});

// ===== LOAD SUBMISSIONS FROM APPS SCRIPT =====
async function loadSubmissions() {
  const container = document.getElementById('students-container');
  container.innerHTML = '<div class="dash-loading"><div class="spinner"></div><span>Loading submissions…</span></div>';

  try {
    const url = `${CONFIG.SCRIPT_URL}?password=${encodeURIComponent(teacherPassword)}&action=read`;
    const response = await fetch(url);
    const result = await response.json();

    if (!result.success) {
      if (result.error === 'Unauthorized') {
        container.innerHTML = '';
        alert('Incorrect password. Please refresh and try again.');
        teacherLogout();
      } else {
        container.innerHTML = `<div class="dash-empty"><div class="dash-empty-icon">⚠️</div><p>${result.error || 'Unknown error'}</p></div>`;
      }
      return;
    }

    allSubmissions = result.submissions || [];
    renderDashboard();

  } catch (err) {
    container.innerHTML = `
      <div class="dash-empty">
        <div class="dash-empty-icon">🔌</div>
        <p>Could not connect to Google Sheet.</p>
        <p style="font-size:0.8rem;margin-top:0.5rem;color:var(--text-dim)">${err.message}</p>
      </div>`;
  }
}

// ===== RENDER =====
function renderDashboard() {
  updateStats();
  renderStudents(allSubmissions);
}

function updateStats() {
  const total = allSubmissions.length;
  const today = allSubmissions.filter(s => {
    const d = new Date(s.timestamp);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;
  const complete = allSubmissions.filter(s => s['art1-title'] && s['art2-title']).length;
  const last = allSubmissions.length
    ? new Date(allSubmissions[allSubmissions.length - 1].timestamp).toLocaleString('en-AU', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})
    : '—';

  document.getElementById('stat-total').textContent = total;
  document.getElementById('stat-today').textContent = today;
  document.getElementById('stat-complete').textContent = complete;
  document.getElementById('stat-last').textContent = last;
}

function sortBy(field) {
  currentSort = field;
  document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`sort-${field}`).classList.add('active');
  filterStudents();
}

function filterStudents() {
  const query = document.getElementById('dash-search').value.toLowerCase();
  let filtered = allSubmissions.filter(s =>
    (s.studentName || '').toLowerCase().includes(query)
  );
  if (currentSort === 'name') {
    filtered.sort((a, b) => (a.studentName || '').localeCompare(b.studentName || ''));
  } else {
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }
  renderStudents(filtered);
}

function renderStudents(submissions) {
  const container = document.getElementById('students-container');

  if (submissions.length === 0) {
    container.innerHTML = `
      <div class="dash-empty">
        <div class="dash-empty-icon">📭</div>
        <p>No submissions yet.</p>
        <p style="font-size:0.8rem;margin-top:0.5rem;color:var(--text-dim)">Students will appear here once they submit their research.</p>
      </div>`;
    return;
  }

  container.innerHTML = `<div class="students-grid">${submissions.map((s, i) => studentCard(s, i)).join('')}</div>`;
}

function studentCard(s, idx) {
  const name = s.studentName || 'Unknown';
  const initials = name.charAt(0).toUpperCase();
  const time = s.timestamp ? new Date(s.timestamp).toLocaleString('en-AU', {day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}) : 'Unknown time';

  // Completion tags
  const fields = [
    { key: 'cash-rate',      label: 'Cash Rate' },
    { key: 'inflation-rate', label: 'Inflation' },
    { key: 'unemployment',   label: 'Unemployment' },
    { key: 'wpi',            label: 'WPI' },
    { key: 'art1-title',     label: 'Article 1' },
    { key: 'art2-title',     label: 'Article 2' },
    { key: 'rba-rationale',  label: 'RBA Rationale' },
    { key: 'article-synthesis', label: 'Synthesis' },
  ];

  const tags = fields.map(f =>
    `<span class="sc-tag ${s[f.key] ? 'filled' : 'empty'}">${f.label}</span>`
  ).join('');

  return `
    <div class="student-card" id="scard-${idx}" onclick="toggleCard(${idx})">
      <div class="sc-card-header">
        <div class="sc-avatar">${initials}</div>
        <div>
          <div class="sc-name">${escHtml(name)}</div>
          <div class="sc-meta">${time} · ${s.classCode || ''}</div>
        </div>
        <div class="sc-expand-icon">▼</div>
      </div>
      <div class="sc-preview">${tags}</div>
      <div class="sc-detail">${renderDetail(s)}</div>
    </div>`;
}

function toggleCard(idx) {
  const card = document.getElementById(`scard-${idx}`);
  card.classList.toggle('expanded');
}

function renderDetail(s) {
  const sections = [
    {
      title: '💰 Financial Markets',
      fields: [
        { label: 'Cash Rate', key: 'cash-rate' },
        { label: 'Last Rate Change', key: 'last-change' },
        { label: 'Direction', key: 'direction' },
        { label: 'Rate History', key: 'rate-history' },
        { label: 'Inflation (CPI)', key: 'inflation-rate' },
        { label: 'RBA Target Band', key: 'rba-target' },
        { label: 'RBA Rationale', key: 'rba-rationale' },
        { label: 'RBA Outlook', key: 'rba-outlook' },
        { label: 'Equity Market', key: 'equity-market' },
        { label: 'Debt Market', key: 'debt-market' },
        { label: 'Forex Market', key: 'forex-market' },
        { label: 'Derivatives Market', key: 'derivatives-market' },
        { label: 'RBA (Institution)', key: 'inst-rba' },
        { label: 'ASIC', key: 'inst-asic' },
        { label: 'APRA', key: 'inst-apra' },
        { label: 'ASX', key: 'inst-asx' },
        { label: 'Transmission Mechanism', key: 'transmission-notes' },
      ]
    },
    {
      title: '👷 Labour Markets',
      fields: [
        { label: 'Unemployment Rate', key: 'unemployment' },
        { label: 'Unemployment Date', key: 'unemp-date' },
        { label: 'Underemployment Rate', key: 'underemployment' },
        { label: 'Underemployment Date', key: 'underemp-date' },
        { label: 'WPI % Change', key: 'wpi' },
        { label: 'WPI Date', key: 'wpi-date' },
        { label: 'Participation Rate', key: 'participation' },
        { label: 'Participation Date', key: 'part-date' },
        { label: 'Unemployment Trend', key: 'unemp-trend' },
        { label: 'Unemployment Trend Notes', key: 'unemp-trend-notes' },
        { label: 'Underemployment Trend', key: 'underemp-trend' },
        { label: 'Underemployment Trend Notes', key: 'underemp-trend-notes' },
        { label: 'WPI Trend', key: 'wpi-trend' },
        { label: 'WPI Trend Notes', key: 'wpi-trend-notes' },
        { label: 'Workforce Summary', key: 'workforce-summary' },
        { label: 'Fair Work Commission', key: 'fw-commission' },
        { label: 'Trade Unions', key: 'trade-unions' },
        { label: 'Employer Associations', key: 'employer-assoc' },
        { label: 'Federal Government', key: 'fed-govt' },
        { label: 'Min Wage', key: 'min-wage' },
        { label: 'Labour Demand Factors', key: 'labour-demand' },
        { label: 'Labour Supply Factors', key: 'labour-supply' },
        { label: 'Types of Unemployment', key: 'unemployment-types' },
      ]
    },
    {
      title: '📰 Media Commentary',
      fields: [
        { label: 'Article 1 Title', key: 'art1-title' },
        { label: 'Article 1 Source', key: 'art1-source' },
        { label: 'Article 1 Date', key: 'art1-date' },
        { label: 'Article 1 URL', key: 'art1-url' },
        { label: 'Article 1 Summary', key: 'art1-summary' },
        { label: 'Article 1 Stats/Quotes', key: 'art1-stats' },
        { label: 'Article 1 Course Link', key: 'art1-link' },
        { label: 'Article 1 Reliability', key: 'art1-reliability' },
        { label: 'Article 2 Title', key: 'art2-title' },
        { label: 'Article 2 Source', key: 'art2-source' },
        { label: 'Article 2 Date', key: 'art2-date' },
        { label: 'Article 2 URL', key: 'art2-url' },
        { label: 'Article 2 Summary', key: 'art2-summary' },
        { label: 'Article 2 Stats/Quotes', key: 'art2-stats' },
        { label: 'Article 2 Course Link', key: 'art2-link' },
        { label: 'Article 2 Reliability', key: 'art2-reliability' },
        { label: 'Synthesis', key: 'article-synthesis' },
      ]
    },
    {
      title: '📝 Notes Page',
      fields: [
        { label: 'Financial Markets Notes', key: 'notes-financial' },
        { label: 'Labour Markets Notes', key: 'notes-labour' },
        { label: 'Articles Notes', key: 'notes-articles' },
      ]
    }
  ];

  return sections.map(sec => `
    <div class="detail-section">
      <div class="detail-section-title">${sec.title}</div>
      <div class="detail-grid">
        ${sec.fields.map(f => {
          const val = s[f.key] || '';
          return `
            <div class="detail-field">
              <div class="df-label">${f.label}</div>
              <div class="df-value ${val ? '' : 'empty'}">${val ? escHtml(val) : 'Not filled in'}</div>
            </div>`;
        }).join('')}
      </div>
    </div>
  `).join('');
}

// ===== CSV EXPORT =====
function exportCSV() {
  if (!allSubmissions.length) { alert('No submissions to export.'); return; }

  const headers = [
    'Timestamp', 'Student Name', 'Class Code',
    'Cash Rate', 'Last Rate Change', 'Direction', 'Rate History',
    'Inflation (CPI)', 'RBA Target', 'RBA Rationale', 'RBA Outlook',
    'Equity Market', 'Debt Market', 'Forex Market', 'Derivatives Market',
    'RBA Institution', 'ASIC', 'APRA', 'ASX',
    'Transmission Notes',
    'Unemployment %', 'Unemp Date', 'Underemployment %', 'Underemp Date',
    'WPI %', 'WPI Date', 'Participation %', 'Part Date',
    'Unemp Trend', 'Unemp Trend Notes',
    'Underemp Trend', 'Underemp Trend Notes',
    'WPI Trend', 'WPI Trend Notes',
    'Workforce Summary',
    'Fair Work Commission', 'Trade Unions', 'Employer Associations', 'Federal Government',
    'Min Wage', 'Labour Demand', 'Labour Supply', 'Unemployment Types',
    'Art1 Title', 'Art1 Source', 'Art1 Date', 'Art1 URL',
    'Art1 Summary', 'Art1 Stats', 'Art1 Course Link', 'Art1 Reliability',
    'Art2 Title', 'Art2 Source', 'Art2 Date', 'Art2 URL',
    'Art2 Summary', 'Art2 Stats', 'Art2 Course Link', 'Art2 Reliability',
    'Article Synthesis',
    'Notes Financial', 'Notes Labour', 'Notes Articles'
  ];

  const keys = [
    'timestamp', 'studentName', 'classCode',
    'cash-rate', 'last-change', 'direction', 'rate-history',
    'inflation-rate', 'rba-target', 'rba-rationale', 'rba-outlook',
    'equity-market', 'debt-market', 'forex-market', 'derivatives-market',
    'inst-rba', 'inst-asic', 'inst-apra', 'inst-asx',
    'transmission-notes',
    'unemployment', 'unemp-date', 'underemployment', 'underemp-date',
    'wpi', 'wpi-date', 'participation', 'part-date',
    'unemp-trend', 'unemp-trend-notes',
    'underemp-trend', 'underemp-trend-notes',
    'wpi-trend', 'wpi-trend-notes',
    'workforce-summary',
    'fw-commission', 'trade-unions', 'employer-assoc', 'fed-govt',
    'min-wage', 'labour-demand', 'labour-supply', 'unemployment-types',
    'art1-title', 'art1-source', 'art1-date', 'art1-url',
    'art1-summary', 'art1-stats', 'art1-link', 'art1-reliability',
    'art2-title', 'art2-source', 'art2-date', 'art2-url',
    'art2-summary', 'art2-stats', 'art2-link', 'art2-reliability',
    'article-synthesis',
    'notes-financial', 'notes-labour', 'notes-articles'
  ];

  const csvRows = [headers.join(',')];
  allSubmissions.forEach(s => {
    csvRows.push(keys.map(k => csvCell(s[k] || '')).join(','));
  });

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `econ_submissions_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function csvCell(val) {
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}
