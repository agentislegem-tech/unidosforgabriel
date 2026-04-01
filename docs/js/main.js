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
    } else if (el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'P' || el.tagName === 'H1' || el.tagName === 'H2' || el.tagName === 'SPAN' || el.tagName === 'CITE' || el.tagName === 'DIV') {
      el.innerHTML = text;
    }
  });
}

// ===== REGISTRO FORM =====
const form = document.getElementById('registroForm');
const success = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const data = {
      nombre: form.nombre.value,
      email: form.email.value,
      ciudad: form.ciudad.value,
      estado: form.estado.value,
      fecha: new Date().toISOString()
    };
    try {
      const endpoint = form.dataset.endpoint || '';
      if (endpoint) {
        await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      }
    } catch (err) { console.log('Endpoint no configurado'); }
    form.style.display = 'none';
    success.style.display = 'block';
  });
}

// ===== MURO DE MENSAJES =====
const muroForm = document.getElementById('muroForm');
const muroWall = document.getElementById('muroWall');

function renderMensajes() {
  const mensajes = JSON.parse(localStorage.getItem('muroMensajes') || '[]');
  muroWall.innerHTML = '';
  mensajes.slice().reverse().forEach(m => {
    const card = document.createElement('div');
    card.className = 'muro-msg';
    card.innerHTML = `<p class="muro-msg-texto">"${m.mensaje}"</p><p class="muro-msg-autor">— ${m.nombre}</p>${m.lugar ? `<p class="muro-msg-lugar">📍 ${m.lugar}</p>` : ''}`;
    muroWall.appendChild(card);
  });
}

if (muroForm) {
  renderMensajes();
  muroForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const nuevo = {
      nombre: document.getElementById('muroNombre').value.trim(),
      lugar: document.getElementById('muroLugar').value.trim(),
      mensaje: document.getElementById('muroMensaje').value.trim(),
      fecha: new Date().toISOString()
    };
    const mensajes = JSON.parse(localStorage.getItem('muroMensajes') || '[]');
    mensajes.push(nuevo);
    localStorage.setItem('muroMensajes', JSON.stringify(mensajes));
    try {
      const endpoint = muroForm.dataset.endpoint || '';
      if (endpoint) {
        await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...nuevo, tipo: 'mensaje' }) });
      }
    } catch(err) { console.log('Endpoint no configurado'); }
    muroForm.reset();
    renderMensajes();
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
