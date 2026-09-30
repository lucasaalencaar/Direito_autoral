// ── NAV SCROLL ──
const navbar  = document.getElementById('navbar');
const backTop = document.createElement('button');
backTop.id = 'backTop';
backTop.innerHTML = '↑';
backTop.title = 'Voltar ao topo';
document.body.appendChild(backTop);

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    backTop.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    backTop.classList.remove('visible');
  }
});

backTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── NAV MOBILE TOGGLE ──
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// fecha menu ao clicar em link
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ── ACTIVE NAV LINK ──
const sections = document.querySelectorAll('section[id], header[id]');
const allLinks = document.querySelectorAll('.nav-links a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      allLinks.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(sec => observer.observe(sec));

// ── SMOOTH REVEAL ──
const revealEls = document.querySelectorAll(
  '.aspecto-card, .mini-card, .lei-card, .ref-item, .exemplo-card'
);

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity .4s ease, transform .4s ease';
  revealObs.observe(el);
});

// ── ANO NO FOOTER ──
const copy = document.querySelector('.footer-copy');
if (copy) {
  copy.textContent = `© ${new Date().getFullYear()} · Fins educacionais e informativos`;
}
