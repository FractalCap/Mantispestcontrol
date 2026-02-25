document.addEventListener('DOMContentLoaded', () => {
  // Ensure page starts at the top
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // --- Hamburger Menu Logic ---
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('menu');

  if (hamburger && menu) {
    hamburger.addEventListener('click', () => {
      menu.classList.toggle('active');
      const isActive = menu.classList.contains('active');
      hamburger.setAttribute('aria-expanded', isActive);
      document.body.classList.toggle('no-scroll', isActive);
      
      // Toggle icon
      const icon = hamburger.querySelector('i');
      if (isActive) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (menu.classList.contains('active') && !menu.contains(e.target) && !hamburger.contains(e.target)) {
        closeMenu();
      }
    });

    function closeMenu() {
      menu.classList.remove('active');
      document.body.classList.remove('no-scroll');
      hamburger.setAttribute('aria-expanded', 'false');
      
      // Reset icon
      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    }
  }

  // --- Scroll Spy & Active State Logic ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.menu a');

  // Option 1: Intersection Observer (Modern & Efficient)
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -30% 0px', // Activate when section is in the middle-ish
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        if (id) {
            const activeLink = document.querySelector(`.menu a[href="#${id}"]`);
            if (activeLink) {
                navLinks.forEach(link => link.classList.remove('active'));
                activeLink.classList.add('active');
            }
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });

  // Fallback / Enhancement: Add click listener to set active state immediately
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
  });
});

// Function to handle "Our Essence" Wizard
function showStep(stepId) {
    // 1. Hide all steps content
    const steps = document.querySelectorAll('.essence-step');
    steps.forEach(step => {
        step.style.display = 'none';
        step.classList.remove('active');
    });

    // 2. Show selected step content
    const activeStep = document.getElementById('step-' + stepId);
    if (activeStep) {
        activeStep.style.display = 'block';
        // Small timeout to allow display:block to apply before adding active class for animation
        setTimeout(() => {
            activeStep.classList.add('active');
        }, 10);
    }

    // 3. Update Navigation Tabs
    const navItems = document.querySelectorAll('.essence-nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNav = document.getElementById('nav-' + stepId);
    if (activeNav) {
        activeNav.classList.add('active');
    }
}
