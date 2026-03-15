/* ══════════════════════════════════════════════════════════════
   main.js — Portfolio interactivity
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── Particle Network Canvas ─────────────────────────── */
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let mouse = { x: null, y: null };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.speedY = (Math.random() - 0.5) * 0.6;
      this.opacity = Math.random() * 0.4 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 120, 212, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    const maxDist = 150;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 120, 212, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      // Connect to mouse
      if (mouse.x !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const opacity = (1 - dist / 200) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 170, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    drawConnections();
    animationId = requestAnimationFrame(animateParticles);
  }

  // Only run particles on non-reduced-motion devices
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!prefersReducedMotion.matches) {
    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      mouse.x = null;
      mouse.y = null;
    });
  }

  /* ─── Typewriter for hero name ────────────────────────── */
  const heroNameEl = document.getElementById('heroName');
  const nameText = 'Faraz Islam';
  let charIndex = 0;

  function typeWriter() {
    if (charIndex < nameText.length) {
      heroNameEl.textContent += nameText.charAt(charIndex);
      charIndex++;
      setTimeout(typeWriter, 80);
    }
  }

  // Start typewriter after a small delay
  setTimeout(typeWriter, 600);

  /* ─── Navbar scroll effect ────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('backToTop');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar background
    navbar.classList.toggle('scrolled', scrollY > 50);

    // Back to top button
    backToTopBtn.classList.toggle('visible', scrollY > 500);

    // Active nav node
    updateActiveNav();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─── Active navigation highlight ─────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navNodes = document.querySelectorAll('.nav-node[data-section]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navNodes.forEach((node) => {
          node.classList.toggle('active', node.dataset.section === id);
        });
      }
    });
  }

  /* ─── Mobile menu ─────────────────────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    navToggle.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  /* ─── Scroll reveal ───────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');

          // Animate skill bars when skills section is revealed
          if (entry.target.classList.contains('skill-category') || entry.target.closest('.skills-grid')) {
            animateSkillBars(entry.target);
          }
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ─── Skill bar animation ─────────────────────────────── */
  function animateSkillBars(container) {
    const chips = container.querySelectorAll('.skill-chip');
    chips.forEach((chip, i) => {
      setTimeout(() => {
        chip.classList.add('animated');
      }, i * 100);
    });
  }

  /* ─── Contact form ────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    // Basic validation
    if (!name || !email || !subject || !message) {
      showFormMessage('Please fill in all fields.', 'error');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormMessage('Please enter a valid email address.', 'error');
      return;
    }

    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Sending...';
    btn.disabled = true;

    // Submit to Formspree
    fetch(contactForm.action, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(contactForm),
    })
      .then((response) => {
        if (response.ok) {
          btn.innerHTML = '\u2713 Message Sent!';
          btn.style.background = '#3FB950';
          btn.style.boxShadow = '0 0 20px rgba(63, 185, 80, 0.35)';
          contactForm.reset();
          showFormMessage('Thanks! I\u2019ll get back to you soon.', 'success');
        } else {
          throw new Error('Form submission failed');
        }
      })
      .catch(() => {
        showFormMessage('Something went wrong. Please try again or email me directly.', 'error');
      })
      .finally(() => {
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.boxShadow = '';
        }, 3000);
      });
  });

  function showFormMessage(msg, type) {
    // Remove existing messages
    const existing = contactForm.querySelector('.form-message');
    if (existing) existing.remove();

    const el = document.createElement('p');
    el.className = 'form-message';
    el.textContent = msg;
    el.style.cssText = `
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 0.88rem;
      margin-top: 12px;
      text-align: center;
      background: ${type === 'error' ? 'rgba(248, 81, 73, 0.15)' : 'rgba(63, 185, 80, 0.15)'};
      color: ${type === 'error' ? '#F85149' : '#3FB950'};
      border: 1px solid ${type === 'error' ? 'rgba(248, 81, 73, 0.3)' : 'rgba(63, 185, 80, 0.3)'};
    `;

    contactForm.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }

  /* ─── Footer year ─────────────────────────────────────── */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ─── Smooth scroll for anchor links ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const topOffset = target.offsetTop - 70;
        window.scrollTo({ top: topOffset, behavior: 'smooth' });
      }
    });
  });

  /* ─── Tilt effect on project cards ────────────────────── */
  if (!prefersReducedMotion.matches) {
    const cards = document.querySelectorAll('.project-card, .cert-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ─── Skill Category Filters ────────────────────────────── */
  const filterBtns = document.querySelectorAll('.skill-filter');
  const skillCategories = document.querySelectorAll('.skill-category');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      skillCategories.forEach(cat => {
        if (filter === 'all' || cat.dataset.category === filter) {
          cat.classList.remove('filter-hidden');
        } else {
          cat.classList.add('filter-hidden');
        }
      });
    });
  });

  /* ─── Experience Show More / Less ───────────────────────── */
  const showMoreExp = document.getElementById('showMoreExp');
  const timeline = showMoreExp ? showMoreExp.closest('.timeline') : null;

  if (showMoreExp && timeline) {
    showMoreExp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showMoreExp.click(); }
    });
    showMoreExp.addEventListener('click', () => {
      const isExpanded = timeline.classList.toggle('exp-expanded');
      showMoreExp.classList.toggle('expanded', isExpanded);
      showMoreExp.setAttribute('aria-expanded', String(isExpanded));
      const textEl = showMoreExp.querySelector('.exp-toggle-text');
      const countEl = showMoreExp.querySelector('.exp-toggle-count');

      if (isExpanded) {
        textEl.textContent = 'Show Less';
        countEl.textContent = '';
        timeline.querySelectorAll('.exp-extra.reveal').forEach(el => el.classList.add('active'));
      } else {
        textEl.textContent = 'Show Earlier Roles';
        countEl.textContent = '(2 more)';
        document.getElementById('experience').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* ─── Projects Show More / Less ─────────────────────────── */
  const showMoreCard = document.getElementById('showMoreProjects');
  const projectsGrid = showMoreCard ? showMoreCard.closest('.projects-grid') : null;

  if (showMoreCard && projectsGrid) {
    showMoreCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showMoreCard.click(); }
    });
    showMoreCard.addEventListener('click', () => {
      const isExpanded = projectsGrid.classList.toggle('projects-expanded');
      showMoreCard.setAttribute('aria-expanded', String(isExpanded));
      const textEl = showMoreCard.querySelector('.show-more-text');
      const countEl = showMoreCard.querySelector('.show-more-count');

      if (isExpanded) {
        textEl.textContent = 'Show Less';
        countEl.textContent = '';
        // Trigger reveal animations on newly visible cards
        projectsGrid.querySelectorAll('.project-extra.reveal').forEach(el => el.classList.add('active'));
      } else {
        textEl.textContent = 'Show More';
        countEl.textContent = '9 more projects';
        // Scroll back to projects section top
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  /* ─── Animated Stat Counters ──────────────────────────── */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  if (statNumbers.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10);
          const duration = 1500;
          const start = performance.now();

          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            el.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => countObserver.observe(el));
  }

  /* ─── Keyboard navigation for pipeline nav ────────────── */
  const navPipeline = document.querySelector('.nav-pipeline');
  if (navPipeline) {
    const navItems = navPipeline.querySelectorAll('.nav-node');
    navItems.forEach((item, index) => {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' && index < navItems.length - 1) {
          e.preventDefault();
          navItems[index + 1].focus();
        } else if (e.key === 'ArrowLeft' && index > 0) {
          e.preventDefault();
          navItems[index - 1].focus();
        }
      });
    });
  }
})();
