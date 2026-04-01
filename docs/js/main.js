// ===== MURO DE MENSAJES =====
const muroForm = document.getElementById('muroForm');
const muroWall = document.getElementById('muroWall');

function renderMensajes() {
  const mensajes = JSON.parse(localStorage.getItem('muroMensajes') || '[]');
  muroWall.innerHTML = '';
  mensajes.slice().reverse().forEach(m => {
    const card = document.createElement('div');
    card.className = 'muro-msg';
    card.innerHTML = `
      <p class="muro-msg-texto">"${m.mensaje}"</p>
      <p class="muro-msg-autor">— ${m.nombre}</p>
      ${m.lugar ? `<p class="muro-msg-lugar">📍 ${m.lugar}</p>` : ''}
    `;
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
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...nuevo, tipo: 'mensaje' })
        });
      }
    } catch(err) { console.log('Endpoint no configurado'); }

    muroForm.reset();
    renderMensajes();
  });
}


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
      // AWS API Gateway endpoint — replace with actual URL when deployed
      const endpoint = form.dataset.endpoint || '';
      if (endpoint) {
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }
    } catch (err) {
      console.log('Endpoint not configured yet');
    }

    form.style.display = 'none';
    success.style.display = 'block';
  });
}

// ===== SMOOTH NAV =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== NAV SCROLL EFFECT =====
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.style.background = 'rgba(0,0,0,0.92)';
  } else {
    nav.style.background = 'rgba(0,0,0,0.75)';
  }
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

document.querySelectorAll('.stat-card, .video-card, .logo-partner').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
