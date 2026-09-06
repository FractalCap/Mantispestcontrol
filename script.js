document.addEventListener('DOMContentLoaded', () => {
  // Ensure page starts at the top
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Hamburger Menu Logic ---
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('menu');

  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('active');
    document.body.classList.remove('no-scroll');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    }
  }

  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      menu.classList.toggle('active');
      const isActive = menu.classList.contains('active');
      hamburger.setAttribute('aria-expanded', String(isActive));
      document.body.classList.toggle('no-scroll', isActive);

      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !isActive);
        icon.classList.toggle('fa-xmark', isActive);
      }
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (menu.classList.contains('active') && !menu.contains(e.target) && !hamburger.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // --- Sticky header state + scroll progress bar ---
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('scrollProgress');
  let ticking = false;

  function onScroll() {
    const y = window.scrollY || window.pageYOffset;

    if (header) header.classList.toggle('scrolled', y > 24);

    if (progress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (y / docHeight) * 100 : 0;
      progress.style.width = Math.min(100, Math.max(0, pct)) + '%';
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  // --- Reveal on scroll ---
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('is-in'));
    } else {
      const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            obs.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

      revealEls.forEach(el => revealObserver.observe(el));
    }
  }

  // --- Formulario de cotización -> WhatsApp ---
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!quoteForm.reportValidity()) return;

      const data = new FormData(quoteForm);
      const get = (k) => (data.get(k) || '').toString().trim();

      const lines = [
        'Solicitud de cotización — Mantis Pest Control',
        '',
        `Nombre: ${get('nombre')}`,
        `Teléfono: ${get('telefono')}`,
        get('email') ? `Correo: ${get('email')}` : null,
        `Línea de interés: ${get('servicio')}`,
        '',
        `Necesidad: ${get('mensaje')}`
      ].filter(Boolean);

      const url = 'https://wa.me/573112354546?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');
    });
  }

  // --- Scroll Spy ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.menu a');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector(`.menu a[href="#${id}"]`);
        if (activeLink) {
          navLinks.forEach(link => link.classList.remove('active'));
          activeLink.classList.add('active');
        }
      });
    }, { root: null, rootMargin: '-25% 0px -45% 0px', threshold: 0 });

    sections.forEach(section => spyObserver.observe(section));
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
});

// --- "Nuestra Esencia" wizard ---
function showStep(stepId) {
  document.querySelectorAll('.essence-step').forEach(step => {
    step.style.display = 'none';
    step.classList.remove('active');
  });

  const activeStep = document.getElementById('step-' + stepId);
  if (activeStep) {
    activeStep.style.display = 'block';
    // Force reflow so the entry animation replays each time
    void activeStep.offsetWidth;
    activeStep.classList.add('active');
  }

  document.querySelectorAll('.essence-nav-item').forEach(item => item.classList.remove('active'));
  const activeNav = document.getElementById('nav-' + stepId);
  if (activeNav) activeNav.classList.add('active');
}
