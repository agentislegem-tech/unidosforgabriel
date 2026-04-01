// ===== SPLIT REVEAL HERO =====
window.addEventListener('DOMContentLoaded', () => {
  const splitTop = document.getElementById('splitTop');
  const splitBot = document.getElementById('splitBot');
  const content  = document.getElementById('heroContent');

  setTimeout(() => {
    splitTop.classList.add('animate');
    splitBot.classList.add('animate');
  }, 200);

  setTimeout(() => {
    content.querySelector('.hero-eyebrow').classList.add('show');
    content.querySelector('.hero-title').classList.add('show');
    content.querySelector('.hero-sub').classList.add('show');
    content.querySelector('.hero-actions').classList.add('show');
  }, 400);
});

// ===== LANGUAGE TOGGLE =====
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
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = text;
    } else if (['A','BUTTON','P','H1','H2','SPAN','CITE','DIV'].includes(el.tagName)) {
      el.innerHTML = text;
    }
  });
}

// ===== REGISTRO FORM =====
const form    = document.getElementById('registroForm');
const success = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = '...';
    const data = {
      nombre: form.nombre.value.trim(),
      email:  form.email.value.trim(),
      ciudad: form.ciudad.value.trim(),
      estado: form.estado.value.trim(),
      fecha:  new Date().toISOString()
    };
    try {
      const endpoint = form.dataset.endpoint || '';
      if (endpoint) {
        await fetch(endpoint, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
        });
      }
    } catch (err) { console.log('Error registro:', err); }
    form.style.display = 'none';
    success.style.display = 'block';
  });
}

// ===== MURO DE MENSAJES =====
const muroForm = document.getElementById('muroForm');
const muroWall = document.getElementById('muroWall');
const MURO_ENDPOINT = muroForm ? muroForm.dataset.endpoint || '' : '';

function renderMensajes(mensajes) {
  if (!muroWall) return;
  muroWall.innerHTML = '';
  if (!mensajes || mensajes.length === 0) return;
  mensajes.forEach(m => {
    const card = document.createElement('div');
    card.className = 'muro-msg';
    card.innerHTML = `<p class="muro-msg-texto">"${m.mensaje}"</p><p class="muro-msg-autor">— ${m.nombre}</p>${m.lugar ? `<p class="muro-msg-lugar">📍 ${m.lugar}</p>` : ''}`;
    muroWall.appendChild(card);
  });
}

async function cargarMensajes() {
  if (!MURO_ENDPOINT) return;
  try {
    const base = MURO_ENDPOINT.replace('/mensaje', '/mensajes');
    const res  = await fetch(base);
    const data = await res.json();
    if (data.ok) renderMensajes(data.mensajes);
  } catch (err) { console.log('Error cargando mensajes:', err); }
}

if (muroForm) {
  cargarMensajes();
  muroForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = muroForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    const nuevo = {
      nombre:  document.getElementById('muroNombre').value.trim(),
      lugar:   document.getElementById('muroLugar').value.trim(),
      mensaje: document.getElementById('muroMensaje').value.trim()
    };
    try {
      if (MURO_ENDPOINT) {
        await fetch(MURO_ENDPOINT, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(nuevo)
        });
      }
    } catch (err) { console.log('Error enviando mensaje:', err); }
    muroForm.reset();
    btn.disabled = false;
    await cargarMensajes();
  });
}

// ===== NAV SCROLL =====
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 60 ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.82)';
}, { passive: true });

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ===== FADE IN ON SCROLL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.stat-card, .video-card, .logo-partner, .prensa-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
