/* ================================================================
   Siegward Games — script.js
   Vanilla JS only. No frameworks, no dependencies.
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------
     1. DYNAMIC COPYRIGHT YEAR
     ---------------------------------------------------------------- */
  const yearEl = document.getElementById('copyrightYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }


  /* ---------------------------------------------------------------
     2. STICKY NAV — glass blur activates on scroll
     ---------------------------------------------------------------- */
  const nav = document.getElementById('nav');

  const onScroll = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load in case page is already scrolled


  /* ---------------------------------------------------------------
     3. MOBILE MENU
     ---------------------------------------------------------------- */
  const hamburger  = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuClose  = document.getElementById('mobileMenuClose');

  function openMenu() {
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger)  hamburger.addEventListener('click', openMenu);
  if (menuClose)  menuClose.addEventListener('click', closeMenu);

  // Close when a menu link is clicked
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });


  /* ---------------------------------------------------------------
     4. SMOOTH SCROLL for anchor links
     Offsets for the fixed nav bar height.
     ---------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;

      e.preventDefault();
      const navH   = nav ? nav.offsetHeight : 0;
      const offset = target.getBoundingClientRect().top + window.scrollY - navH - 12;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    });
  });


  /* ---------------------------------------------------------------
     5. SCROLL REVEAL (IntersectionObserver)
     Elements with class "reveal" animate once when they enter view.
     ---------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' }
    );

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback for unsupported browsers
    revealEls.forEach(el => el.classList.add('is-visible'));
  }


  /* ---------------------------------------------------------------
     6. CONTACT FORM — Web3Forms async submission
     ---------------------------------------------------------------
     Setup:
       1. Go to https://web3forms.com/ and get a free access key.
       2. In index.html, replace YOUR_WEB3FORMS_ACCESS_KEY_HERE:
              <input type="hidden" name="access_key" value="YOUR_KEY">
       3. Submissions arrive in your email inbox automatically.
     ---------------------------------------------------------------- */
  const contactForm  = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');
  const submitBtn    = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();

      // Loading state
      submitBtn.disabled = true;
      submitBtn.classList.add('is-loading');
      clearFeedback();

      try {
        const res  = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body:   new FormData(contactForm),
        });
        const data = await res.json();

        if (res.ok && data.success) {
          showFeedback('is-success', '✓ Message sent — we\'ll get back to you soon.');
          contactForm.reset();
        } else {
          throw new Error(data.message || 'Submission failed.');
        }
      } catch (err) {
        console.error('[ContactForm]', err);
        showFeedback('is-error', '✗ Something went wrong. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-loading');
        formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  function showFeedback(type, message) {
    formFeedback.textContent = message;
    formFeedback.className   = `form-feedback is-visible ${type}`;
  }

  function clearFeedback() {
    formFeedback.textContent = '';
    formFeedback.className   = 'form-feedback';
  }



}); // end DOMContentLoaded
