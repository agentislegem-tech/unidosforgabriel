const API = 'https://okfngn48kc.execute-api.us-east-1.amazonaws.com/prod';

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
});

// ── HERO CINEMATIC ────────────────────────────────────
function initHero() {
  const hero     = document.querySelector('.hero');
  const splitTop = document.getElementById('splitTop');
  const splitBot = document.getElementById('splitBot');
  const heroImg  = document.querySelector('.hero-img');
  const heroOvl  = document.querySelector('.hero-overlay');
  const content  = document.getElementById('heroContent');
  if (!hero) return;

  // Fase 1 — Foto y overlay emergen (desktop: 0.8s delay, 2.5s duración)
  if (heroImg) setTimeout(() => heroImg.classList.add('reveal'), 50);
  if (heroOvl) setTimeout(() => heroOvl.classList.add('reveal'), 50);

  // Fase 2 — Cortinas se abren (desktop: 2.8s)
  if (splitTop) setTimeout(() => {
    splitTop.classList.add('animate');
    splitBot.classList.add('animate');
  }, 50);

  // Fase 3 — Texto emerge línea por línea (desktop: 5.2s en adelante)
  if (content) setTimeout(() => {
    ['hero-eyebrow','hero-title','hero-sub','hero-actions'].forEach(c => {
      const el = content.querySelector('.'+c);
      if (el) el.classList.add('show');
    });
  }, 50);

  // Skip al hacer clic en el hero
  hero.addEventListener('click', skipHero, { once: true });
}

function skipHero() {
  const hero    = document.querySelector('.hero');
  const heroImg = document.querySelector('.hero-img');
  const heroOvl = document.querySelector('.hero-overlay');
  const content = document.getElementById('heroContent');
  if (!hero) return;
  hero.classList.add('skipped');
  if (heroImg) { heroImg.classList.add('reveal'); }
  if (heroOvl) { heroOvl.classList.add('reveal'); }
  if (content) {
    ['hero-eyebrow','hero-title','hero-sub','hero-actions'].forEach(c => {
      const el = content.querySelector('.'+c);
      if (el) el.classList.add('show');
    });
  }
  // Después del skip, el clic en el hero no debe bloquear los botones
  setTimeout(() => {
    const h = document.querySelector('.hero');
    if (h) h.style.cursor = 'default';
  }, 100);
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
    if (el) el.classList.toggle('active', p === name);
  });
  if (name) {
    if (explora) explora.classList.add('panel-open');
    setTimeout(() => { if (explora) explora.scrollIntoView({behavior:'smooth',block:'start'}); }, 50);
  } else {
    if (explora) explora.classList.remove('panel-open');
    setTimeout(() => { if (explora) explora.scrollIntoView({behavior:'smooth',block:'start'}); }, 50);
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
let sqVisible = 3;

function initCarrusel() {
  const cards = document.querySelectorAll('.sq-card');
  sqTotal = cards.length;
  const dotsEl = document.getElementById('sqDots');
  if (!dotsEl) return;
  const pages = Math.ceil(sqTotal / getVisible());
  dotsEl.innerHTML = '';
  for (let i = 0; i < pages; i++) {
    const d = document.createElement('div');
    d.className = 'sq-dot' + (i === 0 ? ' active' : '');
    d.onclick = () => goCarrusel(i);
    dotsEl.appendChild(d);
  }
  renderCarrusel();
  window.addEventListener('resize', () => { sqIndex = 0; initCarrusel(); });
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

function goCarrusel(idx) {
  sqIndex = idx;
  renderCarrusel();
  updateDots();
}

function renderCarrusel() {
  const vis = getVisible();
  const carousel = document.getElementById('sqCarousel');
  if (!carousel) return;
  const cards = carousel.querySelectorAll('.sq-card');
  const offset = sqIndex * vis;
  cards.forEach((c, i) => {
    c.style.display = (i >= offset && i < offset + vis) ? 'flex' : 'none';
  });
}

function updateDots() {
  const vis = getVisible();
  document.querySelectorAll('.sq-dot').forEach((d, i) => {
    d.classList.toggle('active', i === sqIndex);
  });
}

// ── PRENSA MODAL ──────────────────────────────────────
function openPrensaModal(vidId, titleEs, titleEn, descEs, descEn) {
  const modal = document.getElementById('prensaModal');
  const iframe = document.getElementById('prensaModalIframe');
  const title  = document.getElementById('prensaModalTitle');
  const desc   = document.getElementById('prensaModalDesc');
  const link   = document.getElementById('prensaModalLink');
  if (!modal) return;
  iframe.src = 'https://www.youtube.com/embed/' + vidId + '?autoplay=1';
  title.textContent = currentLang === 'en' ? titleEn : titleEs;
  desc.textContent  = currentLang === 'en' ? descEn : descEs;
  link.href = 'https://www.youtube.com/watch?v=' + vidId;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closePrensaModal(e) {
  if (e && e.target !== document.getElementById('prensaModal') && !e.target.classList.contains('prensa-modal-close')) return;
  const modal = document.getElementById('prensaModal');
  const iframe = document.getElementById('prensaModalIframe');
  if (!modal) return;
  modal.style.display = 'none';
  iframe.src = '';
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closePrensaModal({target: document.getElementById('prensaModal')}); });

// ── CONTADORES ────────────────────────────────────────
async function initContadores() {
  try {
    const res  = await fetch(API + '/mensajes');
    const data = await res.json();
    if (!data.ok) return;
    const msgs = data.mensajes || [];
    const total = msgs.length;
    const estados = new Set(msgs.filter(m => m.lugar_key).map(m => m.lugar_key)).size;
    animateCount('cntMensajes', total);
    animateCount('cntEstados', estados);
  } catch(e) {}
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el || target === 0) { if (el) el.textContent = '0'; return; }
  let current = 0;
  const step = Math.max(1, Math.floor(target / 30));
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString();
    if (current >= target) clearInterval(timer);
  }, 40);
}

// ── VISITANTES ────────────────────────────────────────
async function registrarVisita() {
  try {
    const res  = await fetch(API + '/visita', {method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});
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
  const msg = encodeURIComponent('🇵🇷 Gabriel Hernández Ramos negoció $1,550 millones para los policías de Puerto Rico en 117 días. Su pensión: $487 al mes. Hoy necesita nuestra ayuda. Dona aquí: https://unidosporgabriel.org');
  window.open('https://wa.me/?text=' + msg, '_blank');
}

function compartirFB() {
  window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent('https://unidosporgabriel.org'), '_blank');
}

function copiarLink() {
  navigator.clipboard.writeText('https://unidosporgabriel.org').then(() => {
    const btn = document.getElementById('btnCopy');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '✅ Copiado';
      setTimeout(() => { btn.textContent = orig; }, 2000);
    }
  });
}

// ── REGISTRO ─────────────────────────────────────────
const form    = document.getElementById('registroForm');
const success = document.getElementById('formSuccess');
if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = '...';
    const data = {nombre:form.nombre.value.trim(),email:form.email.value.trim(),ciudad:form.ciudad.value.trim(),estado:form.estado.value.trim()};
    try { await fetch(API+'/registro',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)}); } catch(e) {}
    form.style.display='none'; success.style.display='block';
  });
}

// ── MURO TABS ─────────────────────────────────────────
function setTab(tab) {
  document.getElementById('panelAnonimo').style.display   = tab==='anonimo'    ?'block':'none';
  document.getElementById('panelRegistrado').style.display= tab==='registrado' ?'block':'none';
  document.getElementById('tabAnonimo').classList.toggle('active', tab==='anonimo');
  document.getElementById('tabRegistrado').classList.toggle('active', tab==='registrado');
  actualizarPreview();
}

// ── PREVIEW ───────────────────────────────────────────
function actualizarPreview() {
  const isReg = document.getElementById('panelRegistrado') && document.getElementById('panelRegistrado').style.display !== 'none';
  const nombre  = isReg ? (document.getElementById('muroNombreR')||{}).value?.trim()||'' : (document.getElementById('muroNombreA')||{}).value?.trim()||'';
  const mensaje = isReg ? (document.getElementById('muroMensajeR')||{}).value?.trim()||'' : (document.getElementById('muroMensajeA')||{}).value?.trim()||'';
  const placeKey = isReg && document.getElementById('muroLugarKey') ? document.getElementById('muroLugarKey').value : '';
  const p = PLACES[placeKey];
  const bar=document.getElementById('previewBar'), flag=document.getElementById('previewFlag');
  const sym=document.getElementById('previewSymbol'), place=document.getElementById('previewPlace');
  const msgEl=document.getElementById('previewMsg'), nameEl=document.getElementById('previewName');
  if (!bar) return;
  if (p) { bar.style.background=p.color; flag.textContent=p.flag; sym.textContent=p.symbol; place.textContent=p.name; }
  else { bar.style.background='#ccc'; flag.textContent='🌍'; sym.textContent=''; place.textContent=isReg?'Tu lugar':'—'; }
  if(msgEl) msgEl.textContent = mensaje||'Tu mensaje aparecerá aquí...';
  if(nameEl) nameEl.textContent = nombre||'Tu nombre';
}

setTimeout(() => {
  ['muroNombreA','muroMensajeA','muroNombreR','muroMensajeR','muroLugarKey'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', actualizarPreview);
  });
  ['A','R'].forEach(s => {
    const ta=document.getElementById('muroMensaje'+s), cc=document.getElementById('charCount'+s);
    if(ta&&cc) ta.addEventListener('input',()=>{cc.textContent=300-ta.value.length;});
  });
}, 100);

// ── ENVIAR MENSAJE ────────────────────────────────────
async function enviarMensaje(registrado) {
  const sfx=registrado?'R':'A';
  const nombre  = document.getElementById('muroNombre'+sfx).value.trim();
  const mensaje = document.getElementById('muroMensaje'+sfx).value.trim();
  const placeKey= registrado?document.getElementById('muroLugarKey').value:'';
  const p=PLACES[placeKey];
  const errEl=document.getElementById('muroError');
  errEl.style.display='none';
  if(!nombre){mostrarError('Por favor escribe tu nombre.');return;}
  if(!mensaje){mostrarError('Por favor escribe tu mensaje.');return;}
  const payload={nombre,mensaje,lugar:p?p.name:'',lugar_key:placeKey,registrado};
  try {
    const res=await fetch(API+'/mensaje',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await res.json();
    if(!data.ok){mostrarError(data.error||'No se pudo publicar.');return;}
    document.getElementById('muroNombre'+sfx).value='';
    document.getElementById('muroMensaje'+sfx).value='';
    if(registrado) document.getElementById('muroLugarKey').value='';
    actualizarPreview();
    await cargarMensajes();
    await initContadores();
  } catch(e){mostrarError('Error de conexión.');}
}

function mostrarError(msg){const el=document.getElementById('muroError');el.textContent=msg;el.style.display='block';}

// ── CARGAR MENSAJES ───────────────────────────────────
async function cargarMensajes() {
  try {
    const res=await fetch(API+'/mensajes');
    const data=await res.json();
    if(data.ok) renderTarjetas(data.mensajes||[]);
  } catch(e){}
}

function renderTarjetas(mensajes) {
  const grid=document.getElementById('muroCardsGrid');
  const label=document.getElementById('muroCountLabel');
  if(!grid) return;
  grid.innerHTML='';
  if(label) label.textContent=mensajes.length+(mensajes.length===1?' persona ha dejado su mensaje':' personas han dejado su mensaje');
  mensajes.forEach(m => {
    const p=PLACES[m.lugar_key]||null;
    const card=document.createElement('div');
    card.className='wall-card'+(p?'':' wall-card-anon');
    if(p){
      card.innerHTML=`<div class="card-accent-bar" style="background:${p.color};"></div><div class="card-header"><div class="card-flag">${p.flag}</div><div class="card-symbol">${p.symbol}</div><div><div class="card-place">${p.name}</div></div></div><div class="card-body"><div class="card-msg">"${escHtml(m.mensaje)}"</div></div><div class="card-footer">${escHtml(m.nombre)}</div>`;
    } else {
      card.innerHTML=`<div class="card-accent-bar" style="background:#aaa;"></div><div class="card-header"><div class="card-flag">💙</div><div><div class="card-place">Apoyo</div></div></div><div class="card-body"><div class="card-msg">"${escHtml(m.mensaje)}"</div></div><div class="card-footer">${escHtml(m.nombre)}</div>`;
    }
    grid.appendChild(card);
  });
}

function escHtml(str){return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

// ── NAV SCROLL ────────────────────────────────────────
const nav=document.querySelector('.nav');
if(nav) window.addEventListener('scroll',()=>{nav.style.background=window.scrollY>60?'rgba(0,0,0,0.95)':'rgba(0,0,0,0.82)';},{passive:true});

// ── SMOOTH SCROLL ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
  anchor.addEventListener('click',function(e){
    const target=document.querySelector(this.getAttribute('href'));
    if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});}
  });
});

// ── FADE IN SCROLL ────────────────────────────────────
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.style.opacity='1';entry.target.style.transform='translateY(0)';}});
},{threshold:0.1});
document.querySelectorAll('.stat-card,.video-card,.logo-partner,.prensa-card,.explora-tile,.sq-card,.contador-card,.respaldo-card').forEach(el=>{
  el.style.opacity='0';el.style.transform='translateY(20px)';
  el.style.transition='opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
