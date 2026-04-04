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

// ── FRASES CLICABLES ─────────────────────────────────
const FRASES_DATA = [
  {
    cita_es: '&ldquo;Suicidaron mi retiro.&rdquo;',
    cita_en: '&ldquo;They destroyed my retirement.&rdquo;',
    titulo_es: 'El costo de 20 años de servicio',
    titulo_en: 'The cost of 20 years of service',
    contexto_es: 'Gabriel dijo esto ante la Cámara de Representantes de Puerto Rico en mayo de 2022. Había servido 20 años en la Policía de Puerto Rico. Al retirarse en 2019, descubrió que la Ley 3 de 2013 había recortado más del 35% de sus beneficios, y que el sistema de retiro había sido declarado insolvente en 2017. Su pensión: $487.81 al mes — que por ley no puede recibir hasta los 65 años. Tiene 48.',
    contexto_en: 'Gabriel said this before the Puerto Rico House of Representatives in May 2022. He had served 20 years on the Puerto Rico Police. Upon retiring in 2019, he discovered that Law 3 of 2013 had cut over 35% of his benefits, and that the retirement system had been declared insolvent in 2017. His pension: $487.81 per month — which by law he cannot receive until age 65. He is 48.',
    fuente_es: 'Fuente: Vista pública, Cámara de Representantes de Puerto Rico, mayo 2022',
    fuente_en: 'Source: Public hearing, Puerto Rico House of Representatives, May 2022'
  },
  {
    cita_es: '&ldquo;Mi credibilidad es mi propia vida.&rdquo;',
    cita_en: '&ldquo;My credibility is my own life.&rdquo;',
    titulo_es: 'Un hombre que fue solo ante los legisladores',
    titulo_en: 'A man who stood alone before legislators',
    contexto_es: 'Cuando compareció ante la Cámara de Representantes de Puerto Rico, Gabriel Hernández no llevó abogados ni asesores. No representaba a ningún gremio oficial. Era un oficial retirado que había comenzado a hablar en redes sociales desde su casa en los Estados Unidos. Su argumento era simple: lo que decía era verdad porque lo había vivido en carne propia. Esa fue su única credencial — y fue suficiente.',
    contexto_en: 'When he appeared before the Puerto Rico House of Representatives, Gabriel Hernández brought no lawyers or advisors. He represented no official union. He was a retired officer who had begun speaking on social media from his home in the United States. His argument was simple: what he said was true because he had lived it firsthand. That was his only credential — and it was enough.',
    fuente_es: 'Fuente: Vista pública, Cámara de Representantes de Puerto Rico, mayo 2022',
    fuente_en: 'Source: Public hearing, Puerto Rico House of Representatives, May 2022'
  },
  {
    cita_es: '&ldquo;No cobré un centavo.&rdquo;',
    cita_en: '&ldquo;I didn\'t collect a cent.&rdquo;',
    titulo_es: '$1,550 millones para otros — $0 para él',
    titulo_en: '$1.55 billion for others — $0 for himself',
    contexto_es: 'En 117 días, Gabriel Hernández negoció con la Junta de Supervisión Fiscal y el Gobierno de Puerto Rico la asignación de $1,550 millones de dólares para los policías de la isla: $850 millones para el fondo de retiro y $700 millones para el Plan Vital. Este acuerdo está documentado en registros oficiales de la AAFAF. Gabriel no cobró honorarios, no recibió contrato, no tuvo beneficio económico personal. Volvió a casa y siguió trabajando porque su propia pensión seguía siendo $487.81 al mes.',
    contexto_en: 'In 117 days, Gabriel Hernández negotiated with the Fiscal Oversight Board and the Government of Puerto Rico the allocation of $1.55 billion for the island\'s police officers: $850 million for the retirement fund and $700 million for Plan Vital. This agreement is documented in official AAFAF records. Gabriel received no fees, no contract, no personal financial benefit. He went home and kept working because his own pension was still $487.81 per month.',
    fuente_es: 'Fuente: AAFAF — Memorando DSP/Junta de Retiro, 29 de junio de 2022',
    fuente_en: 'Source: AAFAF — DSP/Retirement Board Memorandum, June 29, 2022'
  },
  {
    cita_es: '&ldquo;Sigo aquí.&rdquo;',
    cita_en: '&ldquo;I\'m still here.&rdquo;',
    titulo_es: 'En 2026, sigue en la lucha — desde el hospital',
    titulo_en: 'In 2026, still fighting — from the hospital',
    contexto_es: 'En 2026, mientras seguía activo en su lucha por los derechos de los policías de Puerto Rico — manifestaciones, declaraciones públicas, presión institucional — su salud requirió intervención quirúrgica de alto riesgo. La recuperación implica tratamientos, medicamentos, seguimiento médico y meses sin poder trabajar plenamente. Su pensión sigue siendo $487.81 al mes, y sigue sin poder recibirla. La campaña Unidos por Gabriel surgió de la diáspora puertorriqueña en los Estados Unidos para responder a esa realidad.',
    contexto_en: 'In 2026, while still active in his fight for Puerto Rico police rights — protests, public statements, institutional pressure — his health required high-risk surgery. Recovery means treatments, medications, ongoing medical care, and months unable to work fully. His pension is still $487.81 per month, and he still cannot receive it. The Unidos por Gabriel campaign emerged from the Puerto Rican diaspora in the United States to respond to that reality.',
    fuente_es: 'Fuente: Campaña Unidos por Gabriel — unidosporgabriel.org',
    fuente_en: 'Source: Unidos por Gabriel Campaign — unidosporgabriel.org'
  }
];

function abrirFrase(idx) {
  const d = FRASES_DATA[idx];
  const lang = currentLang;
  const overlay = document.getElementById('fraseModal');
  if (!overlay) return;
  document.getElementById('fraseModalCita').innerHTML = lang === 'en' ? d.cita_en : d.cita_es;
  document.getElementById('fraseModalTitulo').textContent = lang === 'en' ? d.titulo_en : d.titulo_es;
  document.getElementById('fraseModalContexto').textContent = lang === 'en' ? d.contexto_en : d.contexto_es;
  document.getElementById('fraseModalFuente').textContent = lang === 'en' ? d.fuente_en : d.fuente_es;
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function cerrarFrase(e) {
  if (e && e.target !== document.getElementById('fraseModal') && !e.target.classList.contains('frase-modal-close')) return;
  const overlay = document.getElementById('fraseModal');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
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

function abrirCompartir() {
  const overlay = document.getElementById('compartirModal');
  if (overlay) { overlay.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}

function cerrarCompartir(e) {
  if (e && e.target !== document.getElementById('compartirModal') && !e.target.classList.contains('compartir-modal-close')) return;
  const overlay = document.getElementById('compartirModal');
  if (overlay) { overlay.style.display = 'none'; document.body.style.overflow = ''; }
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

// ══════════════════════════════════════════════════════
// PUSH 2 — MURO OSCURO + FIRMA + NOTIFICACIÓN
// ══════════════════════════════════════════════════════

// Mapa de clases de animación por lugar
const SYM_CLASS = {
  texas:'sym-texas', puertorico:'sym-puertorico', newyork:'sym-newyork',
  florida:'sym-florida', illinois:'sym-illinois', california:'sym-california'
};

// ── RENDERIZAR TARJETAS (versión oscura) ──────────────
function renderTarjetas(mensajes) {
  const grid  = document.getElementById('muroCardsGrid');
  const label = document.getElementById('muroCountLabel');
  if (!grid) return;
  grid.innerHTML = '';
  if (label) label.textContent = mensajes.length + (mensajes.length===1?' persona ha dejado su mensaje':' personas han dejado su mensaje');
  buildFiltros(mensajes);
  mensajes.forEach(m => renderUnaCard(m, grid, false));
}

function renderUnaCard(m, grid, isNew) {
  const p = PLACES[m.lugar_key] || null;
  const card = document.createElement('div');
  card.className = 'wall-card' + (isNew ? ' card-new' : '');
  card.dataset.lugar = m.lugar_key || '';
  card.onclick = () => abrirCardModal(m, p);
  const symClass = SYM_CLASS[m.lugar_key] || 'sym-default';
  if (p) {
    card.innerHTML = `
      <div class="card-accent-bar" style="background:${p.color};"></div>
      <div class="card-header">
        <div class="card-flag">${p.flag}</div>
        <div class="card-symbol ${symClass}">${p.symbol}</div>
        <div><div class="card-place">${p.name}</div></div>
      </div>
      <div class="card-body"><div class="card-msg">"${escHtml(m.mensaje)}"</div></div>
      <div class="card-footer">
        <span>${escHtml(m.nombre)}</span>
        <button class="card-heart pulsing" onclick="toggleHeart(event,this)" aria-label="Me gusta">❤</button>
      </div>`;
  } else {
    card.innerHTML = `
      <div class="card-accent-bar" style="background:#445;"></div>
      <div class="card-header"><div class="card-flag">💙</div><div><div class="card-place">Apoyo</div></div></div>
      <div class="card-body"><div class="card-msg">"${escHtml(m.mensaje)}"</div></div>
      <div class="card-footer">
        <span>${escHtml(m.nombre)}</span>
        <button class="card-heart pulsing" onclick="toggleHeart(event,this)" aria-label="Me gusta">❤</button>
      </div>`;
  }
  grid.appendChild(card);
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
  const header = document.getElementById('cardModalHeader');
  const msg    = document.getElementById('cardModalMsg');
  const footer = document.getElementById('cardModalFooter');
  header.innerHTML = p
    ? `<span style="font-size:1.5rem;">${p.flag}</span><span>${p.name}</span>`
    : `<span style="font-size:1.5rem;">💙</span><span>Apoyo</span>`;
  msg.textContent = '"' + m.mensaje + '"';
  footer.textContent = '— ' + m.nombre;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function cerrarCardModal(e) {
  if (e && e.target !== document.getElementById('cardModal') && !e.target.classList.contains('prensa-modal-close')) return;
  const modal = document.getElementById('cardModal');
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}

// ── FILTROS POR LUGAR ─────────────────────────────────
let filtroActivo = null;
function buildFiltros(mensajes) {
  const wrap = document.getElementById('muroFiltros');
  if (!wrap) return;
  const lugares = [...new Set(mensajes.filter(m=>m.lugar_key).map(m=>m.lugar_key))];
  if (lugares.length < 2) { wrap.innerHTML=''; return; }
  wrap.innerHTML = '<button class="muro-filtro-btn active" onclick="filtrarMuro(null,this)" data-es="Todos" data-en="All">Todos</button>';
  lugares.forEach(key => {
    const p = PLACES[key];
    if (!p) return;
    const btn = document.createElement('button');
    btn.className = 'muro-filtro-btn';
    btn.textContent = p.flag + ' ' + p.name;
    btn.onclick = (e) => filtrarMuro(key, e.target);
    wrap.appendChild(btn);
  });
}

function filtrarMuro(key, btn) {
  filtroActivo = key;
  document.querySelectorAll('.muro-filtro-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('#muroCardsGrid .wall-card').forEach(card => {
    card.style.display = (!key || card.dataset.lugar === key) ? '' : 'none';
  });
}

// ── NOTIFICACIÓN FLOTANTE ─────────────────────────────
let notifMensajes = [];
let notifIdx = 0;

function initNotificaciones(mensajes) {
  notifMensajes = mensajes.filter(m => m.nombre).slice(0, 10);
  if (notifMensajes.length === 0) return;
  setTimeout(mostrarNotif, 5000);
}

function mostrarNotif() {
  if (notifMensajes.length === 0) return;
  const m = notifMensajes[notifIdx % notifMensajes.length];
  notifIdx++;
  const notif = document.getElementById('notifFlotante');
  const texto = document.getElementById('notifTexto');
  if (!notif || !texto) return;
  const p = PLACES[m.lugar_key];
  const lugar = p ? ' desde ' + p.name : '';
  texto.textContent = m.nombre + lugar + ' dejó un mensaje';
  notif.style.display = 'flex';
  setTimeout(() => { notif.style.display = 'none'; setTimeout(mostrarNotif, 8000); }, 4000);
}

// ── FIRMA COLECTIVA ───────────────────────────────────
const API_FIRMA = 'https://okfngn48kc.execute-api.us-east-1.amazonaws.com/prod';

async function firmarApoyo() {
  const input = document.getElementById('firmaNombre');
  const nombre = input ? input.value.trim() : '';
  if (!nombre) return;
  try {
    const res = await fetch(API_FIRMA + '/registro', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({nombre, email:'', ciudad:'', estado:'firma-colectiva'})
    });
    const data = await res.json();
    if (data.ok) {
      input.value = '';
      const msg = document.getElementById('firmaMsg');
      if (msg) { msg.style.display='block'; setTimeout(()=>msg.style.display='none',3000); }
      cargarFirmas();
    }
  } catch(e) {}
}

async function cargarFirmas() {
  try {
    const res = await fetch(API_FIRMA + '/visitas');
    const data = await res.json();
    const num = document.getElementById('firmaNum');
    if (num && data.visitas) {
      animateCount('firmaNum', data.visitas);
    }
  } catch(e) {}
}

// Sobreescribir cargarMensajes para incluir notificaciones y firma
const _cargarMensajesOrig = cargarMensajes;
async function cargarMensajes() {
  try {
    const res = await fetch(API + '/mensajes');
    const data = await res.json();
    if (data.ok) {
      renderTarjetas(data.mensajes || []);
      initNotificaciones(data.mensajes || []);
    }
  } catch(e) {}
}

cargarFirmas();
