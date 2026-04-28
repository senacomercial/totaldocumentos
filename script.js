// Meta CAPI + Pixel Lead event
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/[.$?*|{}()[\]\\/+^]/g, '\\$&') + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : undefined;
}

function sendLeadEvent() {
  const eventId = 'lead_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);

  // Browser pixel (client-side deduplication via event_id)
  if (typeof fbq === 'function') {
    fbq('track', 'Lead', {}, { eventID: eventId });
  }

  // Server-side via Cloudflare Worker (CAPI)
  fetch('https://totaldocs-capi.agenciaacvip.workers.dev/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event_name: 'Lead',
      event_id: eventId,
      event_source_url: window.location.href,
      fbc: getCookie('_fbc'),
      fbp: getCookie('_fbp')
    })
  }).catch(() => {}); // fire-and-forget, don't block navigation
}

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('active');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('active'));
});

// Navbar shadow on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 10
    ? '0 2px 16px rgba(0,0,0,.1)'
    : '0 1px 4px rgba(0,0,0,.06)';
});

// Animate elements into view
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(
  '.risk-card, .metodo-card, .semaforo-list li, .faq-item, .report-card'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
  observer.observe(el);
});
