'use strict';

// ── CONSTANTES ────────────────────────────────────────
const API = 'https://okfngn48kc.execute-api.us-east-1.amazonaws.com/prod';
const IS_MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;
const IS_IOS = /iPhone|iPod/.test(navigator.userAgent);

const PLACES = {
  texas:{flag:'🏴',symbol:'⭐',name:'Texas',color:'#BF0A30'},
  newyork:{flag:'🗽',symbol:'🍎',name:'New York',color:'#003087'},
  florida:{flag:'🌴',symbol:'🌞',name:'Florida',color:'#F1B820'},
  newjersey:{flag:'🏙️',symbol:'💎',name:'New Jersey',color:'#0032A0'},
  pennsylvania:{flag:'🔔',symbol:'🦅',name:'Pennsylvania',color:'#1B4F8A'},
  illinois:{flag:'🌾',symbol:'💙',name:'Illinois',color:'#003776'},
  massachusetts:{flag:'🦞',symbol:'🎓',name:'Massachusetts',color:'#0E2B5C'},
  connecticut:{flag:'⚓',symbol:'🌿',name:'Connecticut',color:'#1B3A6B'},
  california:{flag:'🐻',symbol:'🌊',name:'California',color:'#003DA5'},
  georgia:{flag:'🍑',symbol:'🌸',name:'Georgia',color:'#BA0C2F'},
  ohio:{flag:'🌰',symbol:'🔴',name:'Ohio',color:'#BA0C2F'},
  virginia:{flag:'🌿',symbol:'🏛️',name:'Virginia',color:'#1B3A6B'},
  northcarolina:{flag:'🌲',symbol:'🔵',name:'North Carolina',color:'#1B3A6B'},
  arizona:{flag:'🌵',symbol:'☀️',name:'Arizona',color:'#CC0000'},
  colorado:{flag:'⛰️',symbol:'❄️',name:'Colorado',color:'#003DA5'},
  washington:{flag:'🌲',symbol:'🦅',name:'Washington',color:'#003DA5'},
  puertorico:{flag:'🇵🇷',symbol:'☕',name:'Puerto Rico',color:'#ED0000'},
  spain:{flag:'🇪🇸',symbol:'🌻',name:'España',color:'#AA151B'},
  mexico:{flag:'🇲🇽',symbol:'🌮',name:'México',color:'#006847'},
  colombia:{flag:'🇨🇴',symbol:'🌺',name:'Colombia',color:'#FCD116'},
  dominicanrepublic:{flag:'🇩🇴',symbol:'🌴',name:'Rep. Dominicana',color:'#002D62'},
  canada:{flag:'🇨🇦',symbol:'🍁',name:'Canadá',color:'#FF0000'},
  other:{flag:'🌍',symbol:'✨',name:'Otro país',color:'#555555'}
};

// ── INIT ─────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  initHero();
  cargarMensajes();
  registrarVisita();
  actualizarPreview();
  initCarrusel();
  initContadores();
  cargarFirmas();
});

// ── HERO ─────────────────────────────────────────────
function initHero() {
  const hero     = document.querySelector('.hero');
  const splitTop = document.getElementById('splitTop');
  const splitBot = document.getElementById('splitBot');
  const heroImg  = document.querySelector('.hero-img');
  const heroOvl  = document.querySelector('.hero-overlay');
  const content  = document.getElementById('heroContent');
  if (!hero) return;

  if (IS_MOBILE) {
    // Móvil: todo visible de inmediato, sin animaciones que bloqueen
    hero.style.cursor = 'default';
    if (splitTop) splitTop.style.display = 'none';
    if (splitBot) splitBot.style.display = 'none';
    if (heroImg)  { heroImg.style.opacity='1'; heroImg.style.animation='none'; }
    if (heroOvl)  { heroOvl.style.opacity='1'; heroOvl.style.animation='none'; }
    if (content) {
      ['hero-eyebrow','hero-title','hero-sub','hero-actions'].forEach(c => {
        const el = content.querySelector('.'+c);
        if (el) { el.style.opacity='1'; el.style.animation='none'; el.classList.add('show'); }
      });
    }
    return;
  }

  // Desktop: secuencia cinematográfica
  if (heroImg) heroImg.classList.add('reveal');
  if (heroOvl) heroOvl.classList.add('reveal');
  if (splitTop) { splitTop.classList.add('animate'); splitBot.classList.add('animate'); }
  if (content) {
    ['hero-eyebrow','hero-title','hero-sub','hero-actions'].forEach(c => {
      const el = content.querySelector('.'+c);
      if (el) el.classList.add('show');
    });
  }
  hero.addEventListener('click', skipHero, { once: true });
}

function skipHero() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  hero.classList.add('skipped');
  hero.style.cursor = 'default';
  const heroImg = document.querySelector('.hero-img');
  const heroOvl = document.querySelector('.hero-overlay');
  const content = document.getElementById('heroContent');
  if (heroImg) heroImg.classList.add('reveal');
  if (heroOvl) heroOvl.classList.add('reveal');
  if (content) {
    ['hero-eyebrow','hero-title','hero-sub','hero-actions'].forEach(c => {
      const el = content.querySelector('.'+c);
      if (el) el.classList.add('show');
    });
  }
}

// ── IDIOMA ────────────────────────────────────────────
let currentLang = 'es';
function toggleLang() {
  currentLang = currentLang === 'es' ? 'en' : 'es';
  document.getElementById('langToggle').textContent = currentLang === 'es' ? 'EN' : 'ES';
  document.documentElement.lang = currentLang;
  applyLang();
}
function applyLang() {
  document.querySelectorAll('[data-es]').forEach(el => {
    const text = el.getAttribute('data-'+currentLang);
    if (!text) return;
    if (el.tagName==='INPUT'||el.tagName==='TEXTAREA') el.placeholder=text;
    else if (['A','BUTTON','P','H1','H2','H3','SPAN','CITE','DIV'].includes(el.tagName)) el.innerHTML=text;
  });
}

// ── SISTEMA DE PANELES ────────────────────────────────
function showPanel(name) {
  const panels = ['historia','timeline','sabiasque','prensa'];
  const explora = document.getElementById('explora');

  panels.forEach(p => {
    const el = document.getElementById('panel-'+p);
    if (!el) return;
    if (p === name) { el.style.display='block'; el.classList.add('active'); }
    else { el.style.display='none'; el.classList.remove('active'); }
  });

  if (explora) {
    if (name) explora.classList.add('panel-open');
    else explora.classList.remove('panel-open');
    // Scroll compatible iOS
    try {
      const top = explora.getBoundingClientRect().top + window.pageYOffset - 60;
      window.scrollTo({ top: top, behavior: IS_IOS ? 'auto' : 'smooth' });
    } catch(e) {
      explora.scrollIntoView();
    }
  }
}

// ── TIMELINE TABS ─────────────────────────────────────
function setTLTab(btn, panelId) {
  document.querySelectorAll('.tl-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tl-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
}

// ── CARRUSEL ¿SABÍAS QUE? ─────────────────────────────
let sqIndex = 0;
let sqTotal = 0;

function initCarrusel() {
  const cards = document.querySelectorAll('.sq-card');
  sqTotal = cards.length;
  const dotsEl = document.getElementById('sqDots');
  if (!dotsEl || sqTotal === 0) return;
  const vis = getVisible();
  const pages = Math.ceil(sqTotal / vis);
  dotsEl.innerHTML = '';
  for (let i = 0; i < pages; i++) {
    const d = document.createElement('div');
    d.className = 'sq-dot' + (i===0?' active':'');
    d.onclick = () => goCarrusel(i);
    dotsEl.appendChild(d);
  }
  renderCarrusel();
}

function getVisible() {
  return window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 3;
}

function moveCarrusel(dir) {
  const vis = getVisible();
  const pages = Math.ceil(sqTotal / vis);
  sqIndex = Math.max(0, Math.min(sqIndex + dir, pages - 1));
  renderCarrusel();
  updateDots();
}

function goCarrusel(idx) { sqIndex = idx; renderCarrusel(); updateDots(); }

function renderCarrusel() {
  const vis = getVisible();
  const carousel = document.getElementById('sqCarousel');
  if (!carousel) return;
  const cards = carousel.querySelectorAll('.sq-card');
  const offset = sqIndex * vis;
  cards.forEach((c, i) => { c.style.display = (i>=offset && i<offset+vis) ? 'flex' : 'none'; });
}

function updateDots() {
  document.querySelectorAll('.sq-dot').forEach((d,i) => d.classList.toggle('active', i===sqIndex));
}

// ── MODAL PRENSA ──────────────────────────────────────
function openPrensaModal(vidId, titleEs, titleEn, descEs, descEn) {
  const modal = document.getElementById('prensaModal');
  const iframe = document.getElementById('prensaModalIframe');
  const title  = document.getElementById('prensaModalTitle');
  const desc   = document.getElementById('prensaModalDesc');
  const link   = document.getElementById('prensaModalLink');
  if (!modal) return;
  iframe.src = 'https://www.youtube.com/embed/' + vidId + '?autoplay=1';
  title.textContent = currentLang==='en' ? titleEn : titleEs;
  desc.textContent  = currentLang==='en' ? descEn  : descEs;
  link.href = 'https://www.youtube.com/watch?v=' + vidId;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closePrensaModal(e) {
  if (e && e.target !== document.getElementById('prensaModal') && !e.target.classList.contains('prensa-modal-close')) return;
  const modal  = document.getElementById('prensaModal');
  const iframe = document.getElementById('prensaModalIframe');
  if (!modal) return;
  modal.style.display = 'none';
  iframe.src = '';
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closePrensaModal({ target: document.getElementById('prensaModal') });
    cerrarFrase({ target: document.getElementById('fraseModal') });
    cerrarCompartir({ target: document.getElementById('compartirModal') });
    cerrarCardModal({ target: document.getElementById('cardModal') });
  }
});

// ── CONTADORES ────────────────────────────────────────
async function initContadores() {
  try {
    const res  = await fetch(API + '/mensajes');
    const data = await res.json();
    if (!data.ok) return;
    const msgs    = data.mensajes || [];
    const estados = new Set(msgs.filter(m=>m.lugar_key).map(m=>m.lugar_key)).size;
    animateCount('cntMensajes', msgs.length);
    animateCount('cntEstados', estados);
  } catch(e) {}
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el || target===0) { if(el) el.textContent='0'; return; }
  let current = 0;
  const step = Math.max(1, Math.floor(target/30));
  const timer = setInterval(() => {
    current = Math.min(current+step, target);
    el.textContent = current.toLocaleString();
    if (current>=target) clearInterval(timer);
  }, 40);
}

// ── VISITANTES ────────────────────────────────────────
async function registrarVisita() {
  try {
    const res  = await fetch(API+'/visita', {method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
    const data = await res.json();
    const badge = document.getElementById('visitasBadge');
    if (badge && data.visitas) {
      badge.textContent = data.visitas.toLocaleString() + ' visitas';
      animateCount('cntPersonas', data.visitas);
    }
  } catch(e) {}
}

// ── COMPARTIR ─────────────────────────────────────────
function compartirWA() {
  const msg = encodeURIComponent('🇵🇷 Gabriel Hernández Ramos negoció $1,550 millones para los policías de Puerto Rico en 117 días. Su pensión: $487 al mes. Hoy necesita nuestra ayuda: https://unidosporgabriel.org');
  window.open('https://wa.me/?text='+msg, '_blank');
}
function compartirFB() {
  window.open('https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent('https://unidosporgabriel.org'), '_blank');
}
function copiarLink() {
  navigator.clipboard.writeText('https://unidosporgabriel.org').then(() => {
    const btn = document.getElementById('btnCopy') || document.getElementById('btnCopyModal');
    if (btn) { const orig=btn.textContent; btn.textContent='✅ Copiado'; setTimeout(()=>{btn.textContent=orig;},2000); }
  }).catch(()=>{});
}
function abrirCompartir() {
  const overlay = document.getElementById('compartirModal');
  if (overlay) { overlay.style.display='flex'; document.body.style.overflow='hidden'; }
}
function cerrarCompartir(e) {
  if (e && e.target!==document.getElementById('compartirModal') && !e.target.classList.contains('compartir-modal-close')) return;
  const overlay = document.getElementById('compartirModal');
  if (overlay) { overlay.style.display='none'; document.body.style.overflow=''; }
}

// ── REGISTRO ─────────────────────────────────────────
const form    = document.getElementById('registroForm');
const success = document.getElementById('formSuccess');
if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled=true; btn.textContent='...';
    try {
      await fetch(API+'/registro', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({nombre:form.nombre.value.trim(),email:form.email.value.trim(),ciudad:form.ciudad.value.trim(),estado:form.estado.value.trim()})
      });
    } catch(e) {}
    form.style.display='none'; success.style.display='block';
  });
}

// ── MURO TABS ─────────────────────────────────────────
function setTab(tab) {
  const pA = document.getElementById('panelAnonimo');
  const pR = document.getElementById('panelRegistrado');
  const tA = document.getElementById('tabAnonimo');
  const tR = document.getElementById('tabRegistrado');
  if (pA) pA.style.display = tab==='anonimo' ? 'block' : 'none';
  if (pR) pR.style.display = tab==='registrado' ? 'block' : 'none';
  if (tA) tA.classList.toggle('active', tab==='anonimo');
  if (tR) tR.classList.toggle('active', tab==='registrado');
  actualizarPreview();
}

// ── PREVIEW ───────────────────────────────────────────
function actualizarPreview() {
  const pR = document.getElementById('panelRegistrado');
  const isReg = pR && pR.style.display !== 'none';
  const nombre  = (document.getElementById(isReg?'muroNombreR':'muroNombreA')||{}).value?.trim()||'';
  const mensaje = (document.getElementById(isReg?'muroMensajeR':'muroMensajeA')||{}).value?.trim()||'';
  const placeKey = isReg ? (document.getElementById('muroLugarKey')||{}).value||'' : '';
  const p = PLACES[placeKey];
  const bar=document.getElementById('previewBar');
  if (!bar) return;
  if (p) {
    bar.style.background=p.color;
    const pf=document.getElementById('previewFlag'); if(pf) pf.textContent=p.flag;
    const ps=document.getElementById('previewSymbol'); if(ps) ps.textContent=p.symbol;
    const pp=document.getElementById('previewPlace'); if(pp) pp.textContent=p.name;
  } else {
    bar.style.background='#555';
    const pf=document.getElementById('previewFlag'); if(pf) pf.textContent='🌍';
    const ps=document.getElementById('previewSymbol'); if(ps) ps.textContent='';
    const pp=document.getElementById('previewPlace'); if(pp) pp.textContent=isReg?'Tu lugar':'—';
  }
  const msgEl=document.getElementById('previewMsg'); if(msgEl) msgEl.textContent=mensaje||'Tu mensaje aparecerá aquí...';
  const nameEl=document.getElementById('previewName'); if(nameEl) nameEl.textContent=nombre||'Tu nombre';
}

// Input listeners
window.addEventListener('load', () => {
  ['muroNombreA','muroMensajeA','muroNombreR','muroMensajeR','muroLugarKey'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', actualizarPreview);
  });
  ['A','R'].forEach(s => {
    const ta=document.getElementById('muroMensaje'+s);
    const cc=document.getElementById('charCount'+s);
    if(ta&&cc) ta.addEventListener('input',()=>{ cc.textContent=300-ta.value.length; });
  });
});

// ── ENVIAR MENSAJE ────────────────────────────────────
async function enviarMensaje(registrado) {
  const sfx     = registrado?'R':'A';
  const nombre  = (document.getElementById('muroNombre'+sfx)||{}).value?.trim()||'';
  const mensaje = (document.getElementById('muroMensaje'+sfx)||{}).value?.trim()||'';
  const placeKey = registrado ? (document.getElementById('muroLugarKey')||{}).value||'' : '';
  const p = PLACES[placeKey];
  const errEl = document.getElementById('muroError');
  if (errEl) errEl.style.display='none';
  if (!nombre) { mostrarError('Por favor escribe tu nombre.'); return; }
  if (!mensaje) { mostrarError('Por favor escribe tu mensaje.'); return; }
  try {
    const res  = await fetch(API+'/mensaje', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nombre,mensaje,lugar:p?p.name:'',lugar_key:placeKey,registrado})});
    const data = await res.json();
    if (!data.ok) { mostrarError(data.error||'No se pudo publicar.'); return; }
    const ni=document.getElementById('muroNombre'+sfx); if(ni) ni.value='';
    const mi=document.getElementById('muroMensaje'+sfx); if(mi) mi.value='';
    if (registrado) { const li=document.getElementById('muroLugarKey'); if(li) li.value=''; }
    actualizarPreview();
    await cargarMensajes();
    await initContadores();
  } catch(e) { mostrarError('Error de conexión.'); }
}

function mostrarError(msg) {
  const el = document.getElementById('muroError');
  if (el) { el.textContent=msg; el.style.display='block'; }
}

// ── CARGAR Y RENDERIZAR MENSAJES ─────────────────────
async function cargarMensajes() {
  try {
    const res  = await fetch(API+'/mensajes');
    const data = await res.json();
    if (data.ok) renderTarjetas(data.mensajes||[]);
  } catch(e) {}
}

function renderTarjetas(mensajes) {
  const grid  = document.getElementById('muroCardsGrid');
  const label = document.getElementById('muroCountLabel');
  if (!grid) return;
  grid.innerHTML = '';
  if (label) label.textContent = mensajes.length+(mensajes.length===1?' persona ha dejado su mensaje':' personas han dejado su mensaje');
  buildFiltros(mensajes);
  // En iOS limitar animaciones — máx 20 tarjetas visibles
  const limite = IS_IOS ? 20 : mensajes.length;
  mensajes.slice(0, limite).forEach(m => renderUnaCard(m, grid));
}

function renderUnaCard(m, grid) {
  const p = PLACES[m.lugar_key]||null;
  const card = document.createElement('div');
  card.className = 'wall-card';
  card.dataset.lugar = m.lugar_key||'';
  card.addEventListener('click', () => abrirCardModal(m, p), {passive:true});
  // Sin clases de animación en iOS
  const symClass = IS_IOS ? '' : (getSYMClass(m.lugar_key));
  if (p) {
    card.innerHTML = `<div class="card-accent-bar" style="background:${p.color};"></div><div class="card-header"><div class="card-flag">${p.flag}</div><div class="card-symbol ${symClass}">${p.symbol}</div><div><div class="card-place">${p.name}</div></div></div><div class="card-body"><div class="card-msg">"${escHtml(m.mensaje)}"</div></div><div class="card-footer"><span>${escHtml(m.nombre)}</span>${IS_MOBILE?'':'<button class="card-heart" onclick="toggleHeart(event,this)">❤</button>'}</div>`;
  } else {
    card.innerHTML = `<div class="card-accent-bar" style="background:#445;"></div><div class="card-header"><div class="card-flag">💙</div><div><div class="card-place">Apoyo</div></div></div><div class="card-body"><div class="card-msg">"${escHtml(m.mensaje)}"</div></div><div class="card-footer"><span>${escHtml(m.nombre)}</span></div>`;
  }
  grid.appendChild(card);
}

function getSYMClass(key) {
  const map = {texas:'sym-texas',puertorico:'sym-puertorico',newyork:'sym-newyork',florida:'sym-florida',illinois:'sym-illinois',california:'sym-california'};
  return map[key]||'sym-default';
}

function toggleHeart(e, btn) {
  e.stopPropagation();
  btn.classList.toggle('liked');
  btn.classList.toggle('pulsing', !btn.classList.contains('liked'));
}

// ── MODAL TARJETA ─────────────────────────────────────
function abrirCardModal(m, p) {
  const modal = document.getElementById('cardModal');
  if (!modal) return;
  document.getElementById('cardModalHeader').innerHTML = p ? `<span style="font-size:1.5rem;">${p.flag}</span><span>${p.name}</span>` : `<span style="font-size:1.5rem;">💙</span><span>Apoyo</span>`;
  document.getElementById('cardModalMsg').textContent = '"'+m.mensaje+'"';
  document.getElementById('cardModalFooter').textContent = '— '+m.nombre;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function cerrarCardModal(e) {
  if (e && e.target!==document.getElementById('cardModal') && !e.target.classList.contains('prensa-modal-close')) return;
  const modal = document.getElementById('cardModal');
  if (modal) { modal.style.display='none'; document.body.style.overflow=''; }
}

// ── FILTROS ───────────────────────────────────────────
function buildFiltros(mensajes) {
  const wrap = document.getElementById('muroFiltros');
  if (!wrap || IS_MOBILE) return;
  const lugares = [...new Set(mensajes.filter(m=>m.lugar_key).map(m=>m.lugar_key))];
  if (lugares.length < 2) { wrap.innerHTML=''; return; }
  wrap.innerHTML = '<button class="muro-filtro-btn active" onclick="filtrarMuro(null,this)">Todos</button>';
  lugares.forEach(key => {
    const p = PLACES[key]; if(!p) return;
    const btn = document.createElement('button');
    btn.className = 'muro-filtro-btn';
    btn.textContent = p.flag+' '+p.name;
    btn.onclick = (e) => filtrarMuro(key, e.currentTarget);
    wrap.appendChild(btn);
  });
}
function filtrarMuro(key, btn) {
  document.querySelectorAll('.muro-filtro-btn').forEach(b=>b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('#muroCardsGrid .wall-card').forEach(card=>{
    card.style.display = (!key||card.dataset.lugar===key)?'':'none';
  });
}

// ── NOTIFICACIÓN FLOTANTE — solo desktop ──────────────
let notifMensajes = [];
let notifTimer = null;

function initNotificaciones(mensajes) {
  if (IS_MOBILE) return; // No en móvil — causa crashes iOS
  notifMensajes = mensajes.filter(m=>m.nombre).slice(0,8);
  if (notifMensajes.length === 0) return;
  if (notifTimer) clearTimeout(notifTimer);
  notifTimer = setTimeout(mostrarNotif, 6000);
}

let notifIdx = 0;
function mostrarNotif() {
  if (IS_MOBILE || notifMensajes.length===0) return;
  const m = notifMensajes[notifIdx % notifMensajes.length];
  notifIdx++;
  const notif = document.getElementById('notifFlotante');
  const texto = document.getElementById('notifTexto');
  if (!notif||!texto) return;
  const p = PLACES[m.lugar_key];
  texto.textContent = m.nombre + (p?' desde '+p.name:'') + ' dejó un mensaje';
  notif.style.display = 'flex';
  // Timer único — no recursivo
  setTimeout(() => {
    if (notif) notif.style.display='none';
    notifTimer = setTimeout(mostrarNotif, 10000);
  }, 4000);
}

// ── FIRMA COLECTIVA ───────────────────────────────────
async function firmarApoyo() {
  const input = document.getElementById('firmaNombre');
  const nombre = input ? input.value.trim() : '';
  if (!nombre) return;
  try {
    const res = await fetch(API+'/registro', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nombre,email:'',ciudad:'',estado:'firma-colectiva'})});
    const data = await res.json();
    if (data.ok) {
      if (input) input.value='';
      const msg=document.getElementById('firmaMsg');
      if (msg) { msg.style.display='block'; setTimeout(()=>{msg.style.display='none';},3000); }
      cargarFirmas();
    }
  } catch(e) {}
}

async function cargarFirmas() {
  try {
    const res  = await fetch(API+'/visitas');
    const data = await res.json();
    if (data.visitas) animateCount('firmaNum', data.visitas);
  } catch(e) {}
}

// ── FRASES CLICABLES ─────────────────────────────────
const FRASES_DATA = [
  { cita_es:'&ldquo;Suicidaron mi retiro.&rdquo;', cita_en:'&ldquo;They destroyed my retirement.&rdquo;', titulo_es:'El costo de 20 años de servicio', titulo_en:'The cost of 20 years of service', contexto_es:'Gabriel dijo esto ante la Cámara de Representantes de Puerto Rico en mayo de 2022. Había servido 20 años. La Ley 3 de 2013 recortó más del 35% de sus beneficios y el sistema fue declarado insolvente en 2017. Su pensión: $487.81 al mes — que no puede recibir hasta los 65. Tiene 48.', contexto_en:'Gabriel said this before the Puerto Rico House of Representatives in May 2022. He had served 20 years. Law 3 of 2013 cut over 35% of his benefits and the system was declared insolvent in 2017. His pension: $487.81 per month — which he cannot receive until age 65. He is 48.', fuente_es:'Fuente: Vista pública, Cámara de Representantes de Puerto Rico, mayo 2022', fuente_en:'Source: Public hearing, Puerto Rico House of Representatives, May 2022' },
  { cita_es:'&ldquo;Mi credibilidad es mi propia vida.&rdquo;', cita_en:'&ldquo;My credibility is my own life.&rdquo;', titulo_es:'Un hombre que fue solo ante los legisladores', titulo_en:'A man who stood alone before legislators', contexto_es:'Cuando compareció ante la Cámara, Gabriel no llevó abogados ni asesores. Era un oficial retirado que había empezado en redes sociales desde su casa en EE.UU. Su único argumento: lo que decía era verdad porque lo había vivido en carne propia.', contexto_en:'When he appeared before the House, Gabriel brought no lawyers or advisors. He was a retired officer who had started speaking on social media from his home in the US. His only argument: what he said was true because he had lived it firsthand.', fuente_es:'Fuente: Vista pública, Cámara de Representantes de Puerto Rico, mayo 2022', fuente_en:'Source: Public hearing, Puerto Rico House of Representatives, May 2022' },
  { cita_es:'&ldquo;No cobré un centavo.&rdquo;', cita_en:'&ldquo;I didn\'t collect a cent.&rdquo;', titulo_es:'$1,550 millones para otros — $0 para él', titulo_en:'$1.55 billion for others — $0 for himself', contexto_es:'En 117 días negoció $1,550 millones para los policías de la isla — $850M para el fondo de retiro y $700M para el Plan Vital. Documentado en registros de la AAFAF. No cobró honorarios, no tuvo beneficio personal. Volvió a casa y siguió trabajando porque su pensión seguía siendo $487.81 al mes.', contexto_en:'In 117 days he negotiated $1.55 billion for island officers — $850M for the retirement fund and $700M for Plan Vital. Documented in AAFAF records. He received no fees, no personal benefit. He went home and kept working because his pension was still $487.81 per month.', fuente_es:'Fuente: AAFAF — Memorando DSP/Junta de Retiro, 29 junio 2022', fuente_en:'Source: AAFAF — DSP/Retirement Board Memorandum, June 29, 2022' },
  { cita_es:'&ldquo;Sigo aquí.&rdquo;', cita_en:'&ldquo;I\'m still here.&rdquo;', titulo_es:'En 2026, sigue en la lucha', titulo_en:'In 2026, still fighting', contexto_es:'En 2026, mientras seguía activo en su lucha por los policías, su salud requirió cirugía de alto riesgo. La recuperación implica tratamientos, medicamentos y meses sin ingresos plenos. Su pensión sigue siendo $487.81 y sigue sin poder recibirla. La diáspora puertorriqueña en EE.UU. responde.', contexto_en:'In 2026, while still active in his fight for officers, his health required high-risk surgery. Recovery means treatments, medications, and months without full income. His pension is still $487.81 and he still cannot receive it. The Puerto Rican diaspora in the US responds.', fuente_es:'Fuente: Campaña Unidos por Gabriel — unidosporgabriel.org', fuente_en:'Source: Unidos por Gabriel Campaign — unidosporgabriel.org' }
];

function abrirFrase(idx) {
  const d=FRASES_DATA[idx];
  const lang=currentLang;
  const overlay=document.getElementById('fraseModal');
  if (!overlay) return;
  document.getElementById('fraseModalCita').innerHTML   = lang==='en'?d.cita_en:d.cita_es;
  document.getElementById('fraseModalTitulo').textContent= lang==='en'?d.titulo_en:d.titulo_es;
  document.getElementById('fraseModalContexto').textContent=lang==='en'?d.contexto_en:d.contexto_es;
  document.getElementById('fraseModalFuente').textContent= lang==='en'?d.fuente_en:d.fuente_es;
  overlay.style.display='flex';
  document.body.style.overflow='hidden';
}
function cerrarFrase(e) {
  if (e && e.target!==document.getElementById('fraseModal') && !e.target.classList.contains('frase-modal-close')) return;
  const overlay=document.getElementById('fraseModal');
  if (overlay) { overlay.style.display='none'; document.body.style.overflow=''; }
}

// ── UTILIDADES ────────────────────────────────────────
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── NAV SCROLL ────────────────────────────────────────
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY>60 ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.82)';
  }, { passive: true });
}

// ── SMOOTH SCROLL ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth', block:'start' }); }
  });
});

// ── FADE IN SCROLL — limitado en iOS ─────────────────
if (!IS_IOS) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity='1';
        entry.target.style.transform='translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.stat-card,.video-card,.logo-partner,.prensa-card,.explora-tile,.contador-card,.respaldo-card').forEach(el => {
    el.style.opacity='0';
    el.style.transform='translateY(20px)';
    el.style.transition='opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}
