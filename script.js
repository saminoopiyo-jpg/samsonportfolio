/**
 * Samson Matowe Opiyo — Portfolio JavaScript
 * Video loop, preloader, scroll spy, mobile nav, Nairobi clock, contact form, live reveals
 */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Hero video — always loop, restart if needed */
  const bgVideo = document.getElementById('bgVideo');
  if (bgVideo) {
    bgVideo.muted = true;
    bgVideo.loop = true;
    bgVideo.playsInline = true;

    const tryPlay = () => {
      const p = bgVideo.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          // Autoplay blocked — try again on first interaction
          const resume = () => {
            bgVideo.play().catch(() => {});
            document.removeEventListener('click', resume);
            document.removeEventListener('touchstart', resume);
          };
          document.addEventListener('click', resume, { once: true });
          document.addEventListener('touchstart', resume, { once: true });
        });
      }
    };

    if (bgVideo.readyState >= 2) tryPlay();
    else bgVideo.addEventListener('canplay', tryPlay, { once: true });

    // Ensure seamless loop
    bgVideo.addEventListener('ended', () => {
      bgVideo.currentTime = 0;
      bgVideo.play().catch(() => {});
    });

    // Pause when tab hidden, resume when visible (saves battery, feels live)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) bgVideo.pause();
      else tryPlay();
    });
  }

  /* Preloader */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) preloader.classList.add('hidden');
      tryPlayVideo();
    }, 500);
  });

  function tryPlayVideo() {
    if (bgVideo) {
      bgVideo.play().catch(() => {});
    }
  }

  /* Navbar: scroll spy + scroll-to-top */
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');
  const scrollTopBtn = document.getElementById('scrollTop');

  function onScroll() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + current);
    });
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  /* Mobile nav */
  const menuToggle = document.getElementById('menuToggle');
  const navLinksEl = document.getElementById('navLinks');
  const overlay = document.getElementById('mobileOverlay');

  function setNav(open) {
    if (!navLinksEl || !menuToggle) return;
    navLinksEl.classList.toggle('open', open);
    if (overlay) overlay.classList.toggle('active', open);
    menuToggle.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => setNav(!navLinksEl.classList.contains('open')));
  }
  if (overlay) overlay.addEventListener('click', () => setNav(false));
  if (navLinksEl) {
    navLinksEl.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setNav(false)));
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') setNav(false);
  });

  /* Nairobi clock — live update */
  const clock = document.getElementById('clock');
  function updateClock() {
    if (!clock) return;
    try {
      clock.textContent = new Intl.DateTimeFormat('en-KE', {
        timeZone: 'Africa/Nairobi',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(new Date()).toLowerCase();
    } catch (e) {
      clock.textContent = new Date().toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  }
  updateClock();
  setInterval(updateClock, 10000);

  /* Contact form */
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (form) {
    const showStatus = (msg, type) => {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.className = 'form-status ' + type;
    };

    const isValidEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !subject || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }
      if (!isValidEmail(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending…';
      }
      showStatus('', '');

      await new Promise(r => setTimeout(r, 900));

      showStatus("Thanks! Your message has been received. I'll reply soon.", 'success');
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send message <i class="fas fa-paper-plane"></i>';
      }
    });
  }

  /* Smooth reveal on scroll — live appearance */
  if (!reduceMotion) {
    const revealEls = document.querySelectorAll(
      '.project-card, .cap-card, .step, .timeline-item, .about-grid, .contact-card'
    );
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = `opacity 0.65s ease ${i * 0.04}s, transform 0.65s ease ${i * 0.04}s`;
      revealObserver.observe(el);
    });
  }
})();
