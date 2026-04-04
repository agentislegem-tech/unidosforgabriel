const API = 'https://okfngn48kc.execute-api.us-east-1.amazonaws.com/prod';

const PLACES = {
  texas:          { flag:'🏴', symbol:'⭐', name:'Texas',              color:'#BF0A30' },
  newyork:        { flag:'🗽', symbol:'🍎', name:'New York',           color:'#003087' },
  florida:        { flag:'🌴', symbol:'🌞', name:'Florida',            color:'#F1B820' },
  newjersey:      { flag:'🏙️', symbol:'💎', name:'New Jersey',        color:'#0032A0' },
  pennsylvania:   { flag:'🔔', symbol:'🦅', name:'Pennsylvania',       color:'#1B4F8A' },
  illinois:       { flag:'🌾', symbol:'💙', name:'Illinois',           color:'#003776' },
  massachusetts:  { flag:'🦞', symbol:'🎓', name:'Massachusetts',      color:'#0E2B5C' },
  connecticut:    { flag:'⚓', symbol:'🌿', name:'Connecticut',         color:'#1B3A6B' },
  california:     { flag:'🐻', symbol:'🌊', name:'California',         color:'#003DA5' },
  georgia:        { flag:'🍑', symbol:'🌸', name:'Georgia',            color:'#BA0C2F' },
  ohio:           { flag:'🌰', symbol:'🔴', name:'Ohio',               color:'#BA0C2F' },
  virginia:       { flag:'🌿', symbol:'🏛️', name:'Virginia',          color:'#1B3A6B' },
  northcarolina:  { flag:'🌲', symbol:'🔵', name:'North Carolina',     color:'#1B3A6B' },
  arizona:        { flag:'🌵', symbol:'☀️', name:'Arizona',            color:'#CC0000' },
  colorado:       { flag:'⛰️', symbol:'❄️', name:'Colorado',          color:'#003DA5' },
  washington:     { flag:'🌲', symbol:'🦅', name:'Washington',         color:'#003DA5' },
  puertorico:     { flag:'🇵🇷', symbol:'☕', name:'Puerto Rico',       color:'#ED0000' },
  spain:          { flag:'🇪🇸', symbol:'🌻', name:'España',            color:'#AA151B' },
  mexico:         { flag:'🇲🇽', symbol:'🌮', name:'México',            color:'#006847' },
  colombia:       { flag:'🇨🇴', symbol:'🌺', name:'Colombia',          color:'#FCD116' },
  dominicanrepublic:{ flag:'🇩🇴', symbol:'🌴', name:'Rep. Dominicana', color:'#002D62' },
  canada:         { flag:'🇨🇦', symbol:'🍁', name:'Canadá',            color:'#FF0000' },
  other:          { flag:'🌍', symbol:'✨', name:'Otro país',           color:'#555555' }
};

// ── SPLIT REVEAL ────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const splitTop = document.getElementById('splitTop');
  const splitBot = document.getElementById('splitBot');
  const content  = document.getElementById('heroContent');
  if (splitTop) setTimeout(() => { splitTop.classList.add('animate'); splitBot.classList.add('animate'); }, 200);
  if (content) setTimeout(() => {
    ['hero-eyebrow','hero-title','hero-sub','hero-actions'].forEach(c => {
      const el = content.querySelector('.' + c);
      if (el) el.classList.add('show');
    });
  }, 400);

  cargarMensajes();
  registrarVisita();
  actualizarPreview();
});

// ── IDIOMA ───────────────────────────────────────────────────
let currentLang = 'es';
function toggleLang() {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  document.getElementById('langToggle').textContent = currentLang === 'es' ? 'EN' : 'ES';
  document.documentElement.lang = currentLang;
  applyLang();
}
function applyLang() {
  document.querySelectorAll('[data-es]').forEach(el => {
    const text = el.getAttribute('data-' + currentLang);
    if (!text) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = text;
    else if (['A','BUTTON','P','H1','H2','H3','SPAN','CITE','DIV'].includes(el.tagName)) el.innerHTML = text;
  });
}

// ── REGISTRO ─────────────────────────────────────────────────
const form    = document.getElementById('registroForm');
const success = document.getElementById('formSuccess');
if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = '...';
    const data = { nombre: form.nombre.value.trim(), email: form.email.value.trim(), ciudad: form.ciudad.value.trim(), estado: form.estado.value.trim() };
    try { await fetch(API + '/registro', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }); } catch(e) {}
    form.style.display = 'none'; success.style.display = 'block';
  });
}

// ── TIMELINE ─────────────────────────────────────────────────
function toggleTL(el) {
  el.classList.toggle('open');
}

// ── MURO TABS ────────────────────────────────────────────────
function setTab(tab) {
  document.getElementById('panelAnonimo').style.display   = tab === 'anonimo'    ? 'block' : 'none';
  document.getElementById('panelRegistrado').style.display = tab === 'registrado' ? 'block' : 'none';
  document.getElementById('tabAnonimo').classList.toggle('active', tab === 'anonimo');
  document.getElementById('tabRegistrado').classList.toggle('active', tab === 'registrado');
  actualizarPreview();
}

// ── PREVIEW EN TIEMPO REAL ────────────────────────────────────
function actualizarPreview() {
  const isReg = document.getElementById('panelRegistrado') && document.getElementById('panelRegistrado').style.display !== 'none';
  const nombre  = isReg ? (document.getElementById('muroNombreR') ? document.getElementById('muroNombreR').value.trim() : '') : (document.getElementById('muroNombreA') ? document.getElementById('muroNombreA').value.trim() : '');
  const mensaje = isReg ? (document.getElementById('muroMensajeR') ? document.getElementById('muroMensajeR').value.trim() : '') : (document.getElementById('muroMensajeA') ? document.getElementById('muroMensajeA').value.trim() : '');
  const placeKey = isReg && document.getElementById('muroLugarKey') ? document.getElementById('muroLugarKey').value : '';
  const p = PLACES[placeKey];

  const bar    = document.getElementById('previewBar');
  const flag   = document.getElementById('previewFlag');
  const sym    = document.getElementById('previewSymbol');
  const place  = document.getElementById('previewPlace');
  const msgEl  = document.getElementById('previewMsg');
  const nameEl = document.getElementById('previewName');

  if (p) { bar.style.background = p.color; flag.textContent = p.flag; sym.textContent = p.symbol; place.textContent = p.name; }
  else { bar.style.background = '#ccc'; flag.textContent = '🌍'; sym.textContent = ''; place.textContent = isReg ? 'Tu lugar' : '—'; }

  msgEl.textContent  = mensaje || 'Tu mensaje aparecerá aquí...';
  nameEl.textContent = nombre  || 'Tu nombre';
}

// Escuchar cambios en tiempo real
setTimeout(() => {
  ['muroNombreA','muroMensajeA','muroNombreR','muroMensajeR','muroLugarKey'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', actualizarPreview);
  });
  // Contador de caracteres
  ['A','R'].forEach(s => {
    const ta = document.getElementById('muroMensaje' + s);
    const cc = document.getElementById('charCount' + s);
    if (ta && cc) ta.addEventListener('input', () => { cc.textContent = 300 - ta.value.length; });
  });
}, 100);

// ── ENVIAR MENSAJE ───────────────────────────────────────────
async function enviarMensaje(registrado) {
  const sfx     = registrado ? 'R' : 'A';
  const nombre  = document.getElementById('muroNombre' + sfx).value.trim();
  const mensaje = document.getElementById('muroMensaje' + sfx).value.trim();
  const placeKey = registrado ? document.getElementById('muroLugarKey').value : '';
  const p        = PLACES[placeKey];
  const errEl    = document.getElementById('muroError');

  errEl.style.display = 'none';

  if (!nombre) { mostrarError('Por favor escribe tu nombre.'); return; }
  if (!mensaje) { mostrarError('Por favor escribe tu mensaje.'); return; }

  const payload = {
    nombre, mensaje,
    lugar:      p ? p.name : '',
    lugar_key:  placeKey,
    registrado
  };

  try {
    const res  = await fetch(API + '/mensaje', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!data.ok) { mostrarError(data.error || 'No se pudo publicar el mensaje.'); return; }
    document.getElementById('muroNombre' + sfx).value = '';
    document.getElementById('muroMensaje' + sfx).value = '';
    if (registrado) document.getElementById('muroLugarKey').value = '';
    actualizarPreview();
    await cargarMensajes();
  } catch(e) { mostrarError('Error de conexión. Intenta de nuevo.'); }
}

function mostrarError(msg) {
  const el = document.getElementById('muroError');
  el.textContent = msg; el.style.display = 'block';
}

// ── CARGAR Y RENDERIZAR MENSAJES ─────────────────────────────
async function cargarMensajes() {
  try {
    const res  = await fetch(API + '/mensajes');
    const data = await res.json();
    if (data.ok) renderTarjetas(data.mensajes || []);
  } catch(e) {}
}

function renderTarjetas(mensajes) {
  const grid  = document.getElementById('muroCardsGrid');
  const label = document.getElementById('muroCountLabel');
  if (!grid) return;
  grid.innerHTML = '';
  if (label) label.textContent = mensajes.length + (mensajes.length === 1 ? ' persona ha dejado su mensaje' : ' personas han dejado su mensaje');
  mensajes.forEach(m => {
    const p   = PLACES[m.lugar_key] || null;
    const card = document.createElement('div');
    card.className = 'wall-card' + (p ? '' : ' wall-card-anon');
    card.title = 'Mensaje de ' + m.nombre;
    if (p) {
      card.innerHTML = `
        <div class="card-accent-bar" style="background:${p.color};"></div>
        <div class="card-header">
          <div class="card-flag">${p.flag}</div>
          <div class="card-symbol">${p.symbol}</div>
          <div><div class="card-place">${p.name}</div></div>
        </div>
        <div class="card-body"><div class="card-msg">"${escHtml(m.mensaje)}"</div></div>
        <div class="card-footer">${escHtml(m.nombre)}</div>`;
    } else {
      card.innerHTML = `
        <div class="card-accent-bar" style="background:#aaa;"></div>
        <div class="card-header">
          <div class="card-flag">💙</div>
          <div><div class="card-place">Apoyo</div></div>
        </div>
        <div class="card-body"><div class="card-msg">"${escHtml(m.mensaje)}"</div></div>
        <div class="card-footer">${escHtml(m.nombre)}</div>`;
    }
    grid.appendChild(card);
  });
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── CONTADOR VISITANTES ───────────────────────────────────────
async function registrarVisita() {
  try {
    const res  = await fetch(API + '/visita', { method:'POST', headers:{'Content-Type':'application/json'}, body:'{}' });
    const data = await res.json();
    const badge = document.getElementById('visitasBadge');
    if (badge && data.visitas) badge.textContent = data.visitas.toLocaleString() + ' visitas';
  } catch(e) {}
}

// ── NAV SCROLL ───────────────────────────────────────────────
const nav = document.querySelector('.nav');
if (nav) window.addEventListener('scroll', () => { nav.style.background = window.scrollY > 60 ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.82)'; }, { passive:true });

// ── SMOOTH SCROLL ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth', block:'start' }); }
  });
});

// ── FADE IN SCROLL ────────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.style.opacity='1'; entry.target.style.transform='translateY(0)'; }
  });
}, { threshold:0.1 });

document.querySelectorAll('.stat-card, .video-card, .logo-partner, .prensa-card, .tl-item, .wall-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
