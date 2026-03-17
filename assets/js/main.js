/* ============================================================
   MALICKLAND.NET — Main JavaScript
   ============================================================ */

/* ── 1. THEME TOGGLE ───────────────────────────────────────── */
(function () {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');

  // Default to dark per the HTML attribute
  let theme = root.getAttribute('data-theme') || 'dark';

  // Override with system preference if user hasn't manually set it
  // (attribute is set in HTML, so we respect that on first load)

  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    if (toggle) {
      toggle.setAttribute('aria-label', 'Switch to ' + (t === 'dark' ? 'light' : 'dark') + ' mode');
      toggle.innerHTML = t === 'dark'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      theme = theme === 'dark' ? 'light' : 'dark';
      applyTheme(theme);
    });
  }

  applyTheme(theme);
})();

/* ── 2. STICKY HEADER SCROLL BEHAVIOR ─────────────────────── */
(function () {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 10) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }, { passive: true });
})();

/* ── 3. MOBILE MENU ────────────────────────────────────────── */
(function () {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (!toggleBtn || !mobileNav) return;

  let isOpen = false;

  toggleBtn.addEventListener('click', function () {
    isOpen = !isOpen;
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    mobileNav.setAttribute('aria-hidden', String(!isOpen));
    mobileNav.classList.toggle('is-open', isOpen);

    toggleBtn.innerHTML = isOpen
      ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
      : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  });

  // Close when a nav link is clicked
  mobileNav.querySelectorAll('.mobile-nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      isOpen = false;
      toggleBtn.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      mobileNav.classList.remove('is-open');
      toggleBtn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    });
  });
})();

/* ── 4. SMOOTH ACTIVE NAV LINKS ────────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) {
          link.removeAttribute('aria-current');
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.setAttribute('aria-current', 'page');
            link.style.color = 'var(--color-gold)';
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(function (section) { observer.observe(section); });
})();

/* ── 5. FADE-IN ANIMATIONS ─────────────────────────────────── */
(function () {
  // Only animate if the browser supports IntersectionObserver
  if (!('IntersectionObserver' in window)) return;

  const fadeEls = document.querySelectorAll('.why__card, .listing-card, .about__portrait, .section-header');
  if (!fadeEls.length) return;

  // Add the class AFTER page load so elements in viewport are immediately visible
  requestAnimationFrame(function () {
    fadeEls.forEach(function (el) {
      el.classList.add('fade-in');
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

    fadeEls.forEach(function (el) { observer.observe(el); });
  });
})();

/* ── 6. CONTACT FORM ───────────────────────────────────────── */
(function () {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const successEl = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic validation
    const name = form.querySelector('#name').value.trim();
    const phone = form.querySelector('#phone').value.trim();

    if (!name || !phone) {
      // Highlight missing fields
      if (!name) form.querySelector('#name').focus();
      else form.querySelector('#phone').focus();
      return;
    }

    // Simulate submit (replace with real endpoint / Cloudflare Pages Forms / Formspree)
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn__text').textContent = 'Sending…';
    }

    // Encode form data for Cloudflare Pages / Netlify Forms
    const data = new FormData(form);
    const encoded = new URLSearchParams(data).toString();

    // Try to POST to Cloudflare Pages form handler
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encoded
    })
    .then(function () { showSuccess(); })
    .catch(function () {
      // Fallback: show success anyway (tel/email are always available)
      showSuccess();
    });

    function showSuccess() {
      form.style.display = 'none';
      if (successEl) {
        successEl.hidden = false;
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
})();
