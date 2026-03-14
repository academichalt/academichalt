// Academic Halt — Main Script

document.addEventListener('DOMContentLoaded', function () {

  // ── Mobile Nav Toggle ──────────────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // ── Active nav link ────────────────────────────────────────
  const currentPath = window.location.pathname.replace(/\/$/, '');
  document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(function (a) {
    const href = a.getAttribute('href').replace(/\/$/, '');
    if (href === currentPath || (currentPath === '' && href === '/index.html') || (href !== '/' && currentPath.startsWith(href))) {
      a.classList.add('active');
    }
  });

  // ── FAQ Accordion ──────────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const answer = this.nextElementSibling;
      const isOpen = this.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-question.open').forEach(function (q) {
        q.classList.remove('open');
        q.nextElementSibling.classList.remove('open');
      });
      // Toggle clicked
      if (!isOpen) {
        this.classList.add('open');
        answer.classList.add('open');
      }
    });
  });

  // ── Scroll Animations ──────────────────────────────────────
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-up');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.book-card, .cat-card, .blog-card, .info-card').forEach(function (el) {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }

  // ── Render Category Page Books ─────────────────────────────
  const bookGrid = document.getElementById('books-grid');
  if (bookGrid && typeof BOOKS_DATA !== 'undefined') {
    const cat = bookGrid.dataset.category;
    if (cat) {
      const books = getBooksByCategory(cat);
      if (books.length === 0) {
        bookGrid.innerHTML = '<div class="no-results"><div class="icon">📚</div><h3>Books coming soon!</h3><p>We are adding books for this category. Check back soon.</p></div>';
      } else {
        bookGrid.innerHTML = books.map(bookCardHTML).join('');
      }
    }
  }

  // ── Render Homepage Sections ───────────────────────────────
  const featuredGrid = document.getElementById('featured-books-grid');
  if (featuredGrid && typeof BOOKS_DATA !== 'undefined') {
    const featured = getFeaturedBooks().slice(0, 6);
    featuredGrid.innerHTML = featured.map(bookCardHTML).join('');
  }

  const latestGrid = document.getElementById('latest-books-grid');
  if (latestGrid && typeof BOOKS_DATA !== 'undefined') {
    const latest = getLatestBooks(6);
    latestGrid.innerHTML = latest.map(bookCardHTML).join('');
  }

  // ── Category counts ────────────────────────────────────────
  document.querySelectorAll('[data-cat-count]').forEach(function (el) {
    const cat = el.dataset.catCount;
    if (typeof getCategoryBookCount === 'function') {
      el.textContent = getCategoryBookCount(cat) + ' books';
    }
  });

  // ── Toast helper ───────────────────────────────────────────
  window.showToast = function (msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 3000);
  };

  // ── Download button click tracking ────────────────────────
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.download-trigger');
    if (btn) {
      const title = btn.dataset.title || 'book';
      showToast('⬇️ Preparing download for: ' + title);
    }
  });

});

// ── Book Card HTML ───────────────────────────────────────────
function bookCardHTML(book) {
  const catPath = book.category;
  const slug = book.slug;
  const coverHTML = book.coverImage
    ? `<img src="${book.coverImage}" alt="${book.title} cover" loading="lazy">`
    : `<div class="book-cover-placeholder">${book.emoji || '📚'}</div>`;

  return `
    <div class="book-card">
      <a href="/${catPath}/${slug}.html" class="book-cover-wrap">${coverHTML}</a>
      <div class="book-body">
        <div class="book-badge"><span class="badge">${book.categoryLabel}</span></div>
        <a href="/${catPath}/${slug}.html"><div class="book-title">${book.title}</div></a>
        <div class="book-subject">${book.subject}</div>
        <div class="book-desc">${book.description}</div>
        <div class="book-actions">
          <a href="/${catPath}/${slug}.html" class="btn btn-outline btn-sm">View Details</a>
          <a href="${book.pdfLink}" target="_blank" rel="noopener" class="btn btn-accent btn-sm download-trigger" data-title="${book.title}">Download PDF</a>
        </div>
      </div>
    </div>`;
}
