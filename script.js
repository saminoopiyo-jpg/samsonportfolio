/**
 * Samson Matowe Opiyo — Portfolio JavaScript
 * Features: Preloader, Typed.js, Scroll Spy, AOS, Skill Bars, Counter, Mobile Nav, Contact Form
 */

(function () {
  'use strict';

  /* ===========================
     PRELOADER
  =========================== */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Trigger AOS animations after load
      document.querySelectorAll('[data-aos]').forEach((el, i) => {
        const delay = parseInt(el.getAttribute('data-aos-delay') || 0);
        setTimeout(() => triggerAOS(el), delay);
      });
      initCounters();
    }, 800);
  });

  /* ===========================
     NAVBAR SCROLL + ACTIVE
  =========================== */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  window.addEventListener('scroll', () => {
    // Scrolled class
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });

    // Scroll-to-top button
    const scrollTop = document.getElementById('scrollTop');
    if (window.scrollY > 300) {
      scrollTop.classList.add('visible');
    } else {
      scrollTop.classList.remove('visible');
    }

    // AOS on scroll
    checkAOS();
  });

  /* ===========================
     SMOOTH SCROLL
  =========================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').substring(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        // Close mobile nav if open
        closeMobileNav();
      }
    });
  });

  /* ===========================
     MOBILE NAV
  =========================== */
  const menuToggle = document.getElementById('menuToggle');
  const navLinksEl = document.getElementById('navLinks');
  const overlay = document.getElementById('mobileOverlay');

  function openMobileNav() {
    navLinksEl.classList.add('open');
    overlay.classList.add('active');
    menuToggle.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    navLinksEl.classList.remove('open');
    overlay.classList.remove('active');
    menuToggle.classList.remove('open');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', () => {
    if (navLinksEl.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });
  overlay.addEventListener('click', closeMobileNav);

  /* ===========================
     TYPED TEXT EFFECT
  =========================== */
  const typedEl = document.getElementById('typedText');
  const phrases = [
    'Frontend Developer',
    'UI/UX Enthusiast',
    'IT Support Specialist',
    'Multimedia Designer',
    'Creative Problem Solver'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeTimeout;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
      speed = 2000; // pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 400;
    }

    typeTimeout = setTimeout(typeEffect, speed);
  }

  // Start typing after preloader
  window.addEventListener('load', () => {
    setTimeout(typeEffect, 1200);
  });

  /* ===========================
     AOS (Animate On Scroll)
  =========================== */
  function triggerAOS(el) {
    el.classList.add('aos-animate');
  }

  function checkAOS() {
    const windowH = window.innerHeight;
    document.querySelectorAll('[data-aos]:not(.aos-animate)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowH * 0.88) {
        const delay = parseInt(el.getAttribute('data-aos-delay') || 0);
        setTimeout(() => triggerAOS(el), delay);
      }
    });

    // Trigger skill bars when in view
    document.querySelectorAll('.skill-bar-fill:not(.animated)').forEach(bar => {
      const rect = bar.getBoundingClientRect();
      if (rect.top < windowH * 0.9) {
        bar.classList.add('animated');
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
      }
    });
  }

  // Initial check
  setTimeout(checkAOS, 200);

  /* ===========================
     COUNTER ANIMATION
  =========================== */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 1800;
      const start = performance.now();

      function update(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        counter.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(update);
        else counter.textContent = target;
      }

      requestAnimationFrame(update);
    });
  }

  /* ===========================
     CONTACT FORM
  =========================== */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();

      // Basic validation
      if (!name || !email || !subject || !message) {
        showStatus('Please fill in all fields.', 'error');
        return;
      }
      if (!isValidEmail(email)) {
        showStatus('Please enter a valid email address.', 'error');
        return;
      }

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      showStatus('', '');

      // Simulate sending (replace with Formspree or EmailJS endpoint)
      try {
        // Replace with your Formspree endpoint: https://formspree.io/f/YOUR_ID
        // const res = await fetch('https://formspree.io/f/YOUR_ID', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        //   body: JSON.stringify({ name, email, subject, message })
        // });

        // Demo: simulate delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success
        contactForm.reset();
        showStatus('✓ Message sent! I\'ll get back to you soon.', 'success');
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }, 3000);

      } catch (err) {
        showStatus('Something went wrong. Please email me directly.', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      }
    });
  }

  function showStatus(msg, type) {
    formStatus.textContent = msg;
    formStatus.className = 'form-status ' + type;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ===========================
     PROJECT CARD TILT EFFECT
  =========================== */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-12px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
      card.style.transition = 'all 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.35s ease';
    });
  });

  /* ===========================
     SKILL CATEGORY HOVER SOUND FEEL
  =========================== */
  document.querySelectorAll('.skill-category').forEach(cat => {
    cat.addEventListener('mouseenter', () => {
      cat.style.borderColor = 'rgba(59, 130, 246, 0.25)';
    });
    cat.addEventListener('mouseleave', () => {
      cat.style.borderColor = '';
    });
  });

  /* ===========================
     KEYBOARD ACCESSIBILITY
  =========================== */
  document.addEventListener('keydown', (e) => {
    // Escape closes mobile nav
    if (e.key === 'Escape') {
      closeMobileNav();
    }
  });

  /* ===========================
     ACTIVE SECTION HIGHLIGHT
     (extra smooth via rAF)
  =========================== */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        ticking = false;
      });
      ticking = true;
    }
  });

})();
