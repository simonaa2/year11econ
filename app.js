// ===================================================
// STUDENT SCAFFOLD — app.js
// ===================================================

// Guard: must be logged in
const studentName = sessionStorage.getItem('studentName');
const classCode   = sessionStorage.getItem('classCode');
if (!studentName || classCode !== CONFIG.CLASS_CODE) {
  window.location.href = 'index.html';
}

// ===== STUDENT IDENTITY =====
document.getElementById('student-name-display').textContent = studentName;
document.getElementById('student-avatar').textContent = studentName.charAt(0).toUpperCase();

// ===== COUNTDOWN =====
function updateCountdown() {
  const due  = new Date(CONFIG.DUE_DATE);
  const diff = due - new Date();
  const el   = document.getElementById('countdown');
  if (!el) return;
  if (diff <= 0) {
    el.textContent = '⏰ Due Now!';
    el.style.webkitTextFillColor = '#ef4444';
    el.style.color = '#ef4444';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  el.textContent = `${d}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ===== TABS =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const content = document.getElementById(`tab-content-${target}`);
    if (content) {
      content.classList.add('active');
      // Re-trigger card animations
      content.querySelectorAll('.scaffold-card').forEach(card => {
        card.style.animation = 'none';
        void card.offsetHeight;
        card.style.animation = '';
      });
    }
  });
});

// ===== LOCAL AUTO-SAVE =====
const SAVE_KEY = `econ_scaffold_${studentName.replace(/\s+/g,'_').toLowerCase()}`;

function collectAllData() {
  const data = { studentName, classCode, timestamp: new Date().toISOString() };

  // All text inputs and textareas with IDs
  document.querySelectorAll('input[type="text"][id], input[type="url"][id], textarea[id]').forEach(el => {
    data[el.id] = el.value;
  });

  // Radio buttons
  ['direction', 'unemp-trend', 'underemp-trend', 'wpi-trend'].forEach(name => {
    const checked = document.querySelector(`input[name="${name}"]:checked`);
    data[name] = checked ? checked.value : '';
  });

  return data;
}

function restoreData(data) {
  Object.entries(data).forEach(([key, value]) => {
    const el = document.getElementById(key);
    if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.type !== 'radio') {
      el.value = value;
    }
  });
  // Radios
  ['direction', 'unemp-trend', 'underemp-trend', 'wpi-trend'].forEach(name => {
    if (data[name]) {
      const radio = document.querySelector(`input[name="${name}"][value="${data[name]}"]`);
      if (radio) radio.checked = true;
    }
  });
}

// Restore on load
try {
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) restoreData(JSON.parse(saved));
} catch(e) {}

// Save on input
let saveTimer;
function triggerSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(collectAllData()));
      const ind = document.getElementById('save-indicator');
      if (ind) {
        ind.textContent = '💾 Saved ' + new Date().toLocaleTimeString('en-AU', {hour:'2-digit',minute:'2-digit'});
      }
    } catch(e) {}
  }, 600);
}

document.addEventListener('input', triggerSave);
document.addEventListener('change', triggerSave);

// ===== CHECKLIST STYLING =====
function styleCheckItem(item) {
  const cb = item.querySelector('input[type="checkbox"]');
  if (cb.checked) {
    item.style.borderColor = 'var(--green)';
    item.style.background  = 'rgba(34,197,94,0.05)';
  } else {
    item.style.borderColor = '';
    item.style.background  = '';
  }
}

document.querySelectorAll('.check-item').forEach(item => {
  item.addEventListener('change', () => setTimeout(() => styleCheckItem(item), 30));
  styleCheckItem(item);
});

// ===== SUBMISSION =====
async function submitResearch() {
  const btn = document.getElementById('submit-btn');
  const overlay = document.getElementById('submit-overlay');
  const spinner = document.getElementById('submit-spinner');
  const successEl = document.getElementById('submit-success');
  const failEl = document.getElementById('submit-fail');

  // Show overlay / spinner
  overlay.style.display = 'flex';
  spinner.style.display = 'flex';
  successEl.style.display = 'none';
  failEl.style.display = 'none';
  btn.disabled = true;

  const data = collectAllData();

  // Check if script URL is configured
  if (!CONFIG.SCRIPT_URL || CONFIG.SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
    spinner.style.display = 'none';
    failEl.style.display = 'flex';
    document.getElementById('submit-fail-msg').textContent =
      'The teacher has not yet connected the Google Sheet. Please check back later or tell your teacher.';
    btn.disabled = false;
    return;
  }

  try {
    // We use text/plain content-type to avoid CORS preflight issues with Apps Script
    await fetch(CONFIG.SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(data),
    });

    // Show success (we can't read the response body in no-cors mode, so we optimistically succeed)
    spinner.style.display = 'none';
    successEl.style.display = 'flex';
    document.getElementById('submit-success-name').textContent =
      `${data.studentName} — your research has been received.`;
    document.getElementById('submit-ts').textContent =
      'Submitted: ' + new Date().toLocaleString('en-AU');

    // Update submit status below button
    const status = document.getElementById('submit-status');
    if (status) {
      status.textContent = '✅ Submitted at ' + new Date().toLocaleTimeString('en-AU');
      status.style.color = 'var(--green)';
    }

    // Save last submit time
    localStorage.setItem(SAVE_KEY + '_submitted', new Date().toISOString());

  } catch (err) {
    spinner.style.display = 'none';
    failEl.style.display = 'flex';
    document.getElementById('submit-fail-msg').textContent =
      'Could not connect to the server. Make sure you have internet access. Error: ' + err.message;
  } finally {
    btn.disabled = false;
  }
}

// Show previous submission time if exists
const prevSubmit = localStorage.getItem(SAVE_KEY + '_submitted');
if (prevSubmit) {
  const status = document.getElementById('submit-status');
  if (status) {
    const d = new Date(prevSubmit);
    status.textContent = '✅ Last submitted: ' + d.toLocaleString('en-AU');
    status.style.color = 'var(--green)';
  }
}

// ===== WORD COUNT =====
const writingArea = document.getElementById('partb-response');
const wordCountEl = document.getElementById('word-count');

function updateWordCount() {
  if (!writingArea || !wordCountEl) return;
  const words = writingArea.value.trim().split(/\s+/).filter(w => w.length > 0);
  const count  = writingArea.value.trim() === '' ? 0 : words.length;
  wordCountEl.textContent = count;
  wordCountEl.style.color = count >= 400 && count <= 700
    ? 'var(--green)'
    : count > 700 ? 'var(--amber)' : 'var(--blue)';
}

if (writingArea) {
  writingArea.addEventListener('input', updateWordCount);
  updateWordCount();
}

// ===== KEY TERMS TRACKER =====
function updateTerms() {
  if (!writingArea) return;
  const text   = writingArea.value.toLowerCase();
  const chips  = document.querySelectorAll('.term-chip');
  let   found  = 0;
  const total  = chips.length;

  chips.forEach(chip => {
    const term = chip.dataset.term.toLowerCase();
    const hit  = text.includes(term);
    chip.classList.toggle('found', hit);
    if (hit) found++;
  });

  const bar   = document.getElementById('terms-bar');
  const count = document.getElementById('terms-count');
  if (bar)   bar.style.width = (found / total * 100) + '%';
  if (count) count.textContent = `${found} / ${total} terms used`;
}

if (writingArea) {
  writingArea.addEventListener('input', updateTerms);
  // Run once after data restore
  setTimeout(updateTerms, 200);
}
