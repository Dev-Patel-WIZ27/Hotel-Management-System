/**
 * StayEase – Smart Hotel Check-In Portal
 * Main Application Logic
 * Author: Dev-Patel-WIZ27
 * Version: 2.1.0
 */

// ─── App State ───────────────────────────────────────────────
const state = {
  currentScreen: 1,
  totalScreens: 8,
  bookingRef: '',
  checkinDate: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dob: '',
  nationality: '',
  idType: '',
  idNumber: '',
  idExpiry: '',
  idCountry: '',
  selectedRoom: '',
  selectedRoomPrice: '',
  selectedRoomEmoji: '',
  signed: false,
};

// ─── Toast System ─────────────────────────────────────────────
function showToast(message, type = '') {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast-item ${type}`;
  el.textContent = message;
  container.appendChild(el);
  setTimeout(() => {
    el.classList.add('removing');
    el.addEventListener('animationend', () => el.remove());
  }, 3000);
}

// ─── Navigation ───────────────────────────────────────────────
function goToScreenNum(n) {
  document.querySelector('.screen.active')?.classList.remove('active');
  document.getElementById(`screen-${n}`)?.classList.add('active');
  state.currentScreen = n;

  updateSidebarNav(n);
  updateMobileProgress(n);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextScreen() { goToScreenNum(state.currentScreen + 1); }
function goBack() { if (state.currentScreen > 1) goToScreenNum(state.currentScreen - 1); }

function sidebarNav(n) {
  // Only allow jumping to completed or current steps
  if (n <= state.currentScreen) goToScreenNum(n);
  else showToast('⚠️ Please complete previous steps first', 'error');
}

function updateSidebarNav(n) {
  document.querySelectorAll('.nav-item').forEach(item => {
    const step = parseInt(item.dataset.step);
    item.classList.remove('active');
    if (step === n) item.classList.add('active');
    const dot = document.getElementById(`nav-dot-${step}`);
    if (dot && step < n) dot.classList.add('done');
  });
}

function updateMobileProgress(n) {
  const pct = ((n - 1) / (state.totalScreens - 1)) * 100;
  const fill = document.getElementById('mobile-progress-fill');
  if (fill) fill.style.width = `${pct}%`;
}

// ─── Screen 1 → 2: Start Check-in ─────────────────────────────
function startCheckin() {
  const ref = document.getElementById('booking-ref').value.trim();
  const date = document.getElementById('checkin-date-input').value;

  if (!ref) {
    showToast('⚠️ Please enter your Booking Reference', 'error');
    document.getElementById('booking-ref').focus();
    return;
  }
  if (!date) {
    showToast('⚠️ Please select your Check-in Date', 'error');
    return;
  }

  state.bookingRef = ref.toUpperCase();
  state.checkinDate = new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });

  document.getElementById('bsc-ref').textContent = state.bookingRef;
  document.getElementById('bsc-checkin').textContent = state.checkinDate;

  goToScreenNum(2);
}

document.getElementById('booking-ref').addEventListener('keydown', e => {
  if (e.key === 'Enter') startCheckin();
});

// ─── Screen 3: Save Personal Details ──────────────────────────
function savePersonal() {
  const fn = document.getElementById('first-name').value.trim();
  const ln = document.getElementById('last-name').value.trim();
  const em = document.getElementById('guest-email').value.trim();
  const ph = document.getElementById('guest-phone').value.trim();
  const dob = document.getElementById('guest-dob').value;
  const nat = document.getElementById('guest-nationality').value;

  if (!fn || !ln) { showToast('⚠️ Please enter your full name', 'error'); return; }
  if (!em || !em.includes('@')) { showToast('⚠️ Please enter a valid email', 'error'); return; }
  if (!ph || ph.replace(/\D/g, '').length < 7) { showToast('⚠️ Please enter a valid phone number', 'error'); return; }
  if (!dob) { showToast('⚠️ Please enter your date of birth', 'error'); return; }
  if (!nat) { showToast('⚠️ Please select your nationality', 'error'); return; }

  state.firstName = fn;
  state.lastName = ln;
  state.email = em;
  state.phone = ph;
  state.dob = new Date(dob).toLocaleDateString('en-GB');
  state.nationality = nat;

  showToast('✅ Personal details saved!', 'success');
  setTimeout(() => goToScreenNum(4), 500);
}

// ─── Screen 4: Save ID Details ─────────────────────────────────
function saveIDDetails() {
  const type = document.getElementById('id-type').value;
  const num = document.getElementById('id-number').value.trim();
  const exp = document.getElementById('id-expiry').value;
  const country = document.getElementById('id-country').value;

  if (!type) { showToast('⚠️ Please select a document type', 'error'); return; }
  if (!num) { showToast('⚠️ Please enter your document number', 'error'); return; }
  if (!exp) { showToast('⚠️ Please enter the expiry date', 'error'); return; }
  if (!country) { showToast('⚠️ Please select issuing country', 'error'); return; }

  state.idType = type;
  state.idNumber = num;
  state.idExpiry = new Date(exp).toLocaleDateString('en-GB');
  state.idCountry = country;

  showToast('✅ ID details saved!', 'success');
  setTimeout(() => goToScreenNum(5), 500);
}

// ─── Signature Canvas ──────────────────────────────────────────
const sigCanvas = document.getElementById('sig-canvas');
const sigCtx = sigCanvas.getContext('2d');
let sigDrawing = false;
let sigHasData = false;
let sigLastX = 0, sigLastY = 0;

function resizeSigCanvas() {
  const box = document.getElementById('sig-box');
  const rect = sigCanvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  sigCanvas.width = rect.width * dpr;
  sigCanvas.height = rect.height * dpr;
  sigCtx.scale(dpr, dpr);
  sigCtx.strokeStyle = '#1e3a5f';
  sigCtx.lineWidth = 2;
  sigCtx.lineCap = 'round';
  sigCtx.lineJoin = 'round';
}

function getSigPos(e) {
  const rect = sigCanvas.getBoundingClientRect();
  if (e.touches) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

sigCanvas.addEventListener('mousedown', e => {
  sigDrawing = true;
  const p = getSigPos(e);
  sigLastX = p.x; sigLastY = p.y;
  if (!sigHasData) {
    sigHasData = true;
    document.getElementById('sig-placeholder').classList.add('hidden');
    document.getElementById('sig-size-label').textContent = 'Signing...';
  }
});
sigCanvas.addEventListener('mousemove', e => {
  if (!sigDrawing) return;
  const p = getSigPos(e);
  sigCtx.beginPath();
  sigCtx.moveTo(sigLastX, sigLastY);
  sigCtx.lineTo(p.x, p.y);
  sigCtx.stroke();
  sigLastX = p.x; sigLastY = p.y;
});
sigCanvas.addEventListener('mouseup',   () => { sigDrawing = false; });
sigCanvas.addEventListener('mouseleave',() => { sigDrawing = false; });
sigCanvas.addEventListener('touchstart', e => { e.preventDefault(); sigDrawing = true; const p = getSigPos(e); sigLastX = p.x; sigLastY = p.y; if (!sigHasData) { sigHasData = true; document.getElementById('sig-placeholder').classList.add('hidden'); } }, { passive: false });
sigCanvas.addEventListener('touchmove', e => { if (!sigDrawing) return; e.preventDefault(); const p = getSigPos(e); sigCtx.beginPath(); sigCtx.moveTo(sigLastX, sigLastY); sigCtx.lineTo(p.x, p.y); sigCtx.stroke(); sigLastX = p.x; sigLastY = p.y; }, { passive: false });
sigCanvas.addEventListener('touchend',  () => { sigDrawing = false; });

function clearSig() {
  resizeSigCanvas();
  sigHasData = false;
  state.signed = false;
  document.getElementById('sig-placeholder').classList.remove('hidden');
  document.getElementById('sig-size-label').textContent = 'Canvas ready';
  showToast('Signature cleared');
}

// ─── Screen 5: Save Signature ──────────────────────────────────
function saveSignature() {
  if (!sigHasData) { showToast('✍️ Please draw your signature first', 'error'); return; }
  if (!document.getElementById('consent-1').checked) { showToast('⚠️ Please agree to the Terms & Conditions', 'error'); return; }
  if (!document.getElementById('consent-2').checked) { showToast('⚠️ Please confirm your information is accurate', 'error'); return; }
  if (!document.getElementById('consent-3').checked) { showToast('⚠️ Please acknowledge the Privacy Policy', 'error'); return; }

  state.signed = true;
  populateReview();
  showToast('✅ Signature confirmed!', 'success');
  setTimeout(() => goToScreenNum(6), 500);
}

// ─── Screen 6: Populate Review ─────────────────────────────────
function populateReview() {
  document.getElementById('rv-ref').textContent      = state.bookingRef   || '—';
  document.getElementById('rv-date').textContent     = state.checkinDate  || '—';
  document.getElementById('rv-name').textContent     = `${state.firstName} ${state.lastName}`.trim() || '—';
  document.getElementById('rv-email').textContent    = state.email        || '—';
  document.getElementById('rv-phone').textContent    = state.phone        || '—';
  document.getElementById('rv-dob').textContent      = state.dob          || '—';
  document.getElementById('rv-nationality').textContent = state.nationality || '—';
  document.getElementById('rv-id-type').textContent  = state.idType       || '—';
  document.getElementById('rv-id-number').textContent= state.idNumber     || '—';
  document.getElementById('rv-id-expiry').textContent= state.idExpiry     || '—';
  document.getElementById('rv-id-country').textContent = state.idCountry  || '—';
}

function proceedToRoom() { goToScreenNum(7); }

// ─── Screen 7: Room Selection ──────────────────────────────────
let pickedRoomTile = null;

function filterRooms(cat, btn) {
  document.querySelectorAll('.rfb-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.room-tile').forEach(t => {
    t.classList.toggle('hidden', cat !== 'all' && t.dataset.cat !== cat);
  });
}

function pickRoom(el, name, price, emoji) {
  if (pickedRoomTile) pickedRoomTile.classList.remove('selected');
  el.classList.add('selected');
  pickedRoomTile = el;

  state.selectedRoom      = name;
  state.selectedRoomPrice = price;
  state.selectedRoomEmoji = emoji;

  const bar = document.getElementById('sel-room-bar');
  bar.style.display = 'flex';
  document.getElementById('srb-emoji').textContent = emoji;
  document.getElementById('srb-name').textContent  = name;
  document.getElementById('srb-price').textContent = price;

  document.getElementById('room-action-no-selection').style.display = 'none';
}

function confirmCheckin() {
  if (!state.selectedRoom) { showToast('🛏️ Please select a room type', 'error'); return; }

  // Populate success screen
  document.getElementById('suc-name').textContent = `${state.firstName} ${state.lastName}`.trim() || '—';
  document.getElementById('suc-room').textContent = state.selectedRoom;
  document.getElementById('suc-ref').textContent  = state.bookingRef;
  document.getElementById('suc-date').textContent = state.checkinDate;

  document.getElementById('sel-room-bar').style.display = 'none';
  document.getElementById('room-action-no-selection').style.display = 'flex';

  goToScreenNum(8);
  spawnConfetti();
}

// ─── Confetti ─────────────────────────────────────────────────
function spawnConfetti() {
  const area  = document.getElementById('confetti-area');
  const colors = ['#0ea5e9','#6366f1','#22d3ee','#f59e0b','#34d399','#f472b6'];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-particle';
    p.style.left       = `${Math.random() * 100}%`;
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDelay    = `${Math.random() * 0.8}s`;
    p.style.animationDuration = `${1.2 + Math.random() * 0.8}s`;
    p.style.opacity    = Math.random().toFixed(1);
    p.style.width      = `${6 + Math.random() * 6}px`;
    p.style.height     = `${6 + Math.random() * 6}px`;
    area.appendChild(p);
  }
  setTimeout(() => area.innerHTML = '', 3000);
}

// ─── Reset ────────────────────────────────────────────────────
function resetAll() {
  Object.assign(state, {
    currentScreen: 1, bookingRef: '', checkinDate: '',
    firstName: '', lastName: '', email: '', phone: '', dob: '', nationality: '',
    idType: '', idNumber: '', idExpiry: '', idCountry: '',
    selectedRoom: '', selectedRoomPrice: '', selectedRoomEmoji: '', signed: false,
  });

  // Clear inputs
  ['booking-ref','first-name','last-name','guest-email','guest-phone',
   'id-number','checkin-date-input'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['guest-dob','guest-nationality','id-type','id-expiry','id-country'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  // Clear signature
  clearSig();

  // Clear consents
  ['consent-1','consent-2','consent-3'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.checked = false;
  });

  // Clear room selection
  if (pickedRoomTile) { pickedRoomTile.classList.remove('selected'); pickedRoomTile = null; }
  document.getElementById('sel-room-bar').style.display = 'none';
  document.getElementById('room-action-no-selection').style.display = 'flex';

  // Reset nav dots
  for (let i = 2; i <= 7; i++) {
    const d = document.getElementById(`nav-dot-${i}`);
    if (d) d.classList.remove('done');
  }

  goToScreenNum(1);
  showToast('✨ Ready for a new check-in', 'success');
}

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Set default check-in date to today
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('checkin-date-input').value = today;

  resizeSigCanvas();
  goToScreenNum(1);
});

window.addEventListener('resize', resizeSigCanvas);
