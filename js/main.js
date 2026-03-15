/* ============================================================
   JEE BOOKS PDF — main.js
   Search filter + Mobile menu
   ============================================================ */

(function () {
  'use strict';

  /* ── MOBILE NAV ──────────────────────────────────────────── */
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on nav link click (mobile)
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
      });
    });
  }

  /* ── SEARCH FILTER ───────────────────────────────────────── */
  const searchInput = document.getElementById('searchInput');
  const noResults   = document.getElementById('noResults');
  const noResultsQ  = document.getElementById('noResultsQuery');

  if (searchInput) {
    // Read ?q= from URL on page load (for WebSite SearchAction)
    const urlParams = new URLSearchParams(window.location.search);
    const qParam = urlParams.get('q');
    if (qParam) {
      searchInput.value = qParam;
      filterBooks(qParam);
    }

    searchInput.addEventListener('input', function () {
      filterBooks(this.value);
    });
  }

  function filterBooks(query) {
    const q = query.trim().toLowerCase();
    const cards = document.querySelectorAll('.book-card[data-title]');
    let visibleCount = 0;

    cards.forEach(function (card) {
      const title   = (card.dataset.title   || '').toLowerCase();
      const subject = (card.dataset.subject || '').toLowerCase();
      const matches = !q || title.includes(q) || subject.includes(q);

      card.classList.toggle('hidden', !matches);
      if (matches) visibleCount++;
    });

    // Show/hide section headings when all cards in section are hidden
    document.querySelectorAll('.books-section').forEach(function (section) {
      const sectionCards = section.querySelectorAll('.book-card');
      const allHidden = Array.from(sectionCards).every(function (c) {
        return c.classList.contains('hidden');
      });
      section.style.display = (q && allHidden) ? 'none' : '';
    });

    // No results message
    if (noResults) {
      if (q && visibleCount === 0) {
        noResults.hidden = false;
        if (noResultsQ) noResultsQ.textContent = query;
      } else {
        noResults.hidden = true;
      }
    }
  }

  /* ── SMOOTH ANCHOR SCROLL for hash links ────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
