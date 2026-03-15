// Academic Halt — Main Script v2

document.addEventListener('DOMContentLoaded', function () {

  // ── Mobile Nav Toggle ──────────────────────────────────────
  const navToggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mobileNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
      // Swap icon
      navToggle.innerHTML = isOpen
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
      });
    });

    // Close on outside tap
    document.addEventListener('click', function (e) {
      if (mobileNav.classList.contains('open') &&
          !mobileNav.contains(e.target) &&
          !navToggle.contains(e.target)) {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Highlight active nav link ──────────────────────────────
  var currentPath = window.location.pathname;
  document.querySelectorAll('.nav-links a, .mobile-nav-links a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    var isActive = false;
    if (href === '/' || href === '/index.html') {
      isActive = (currentPath === '/' || currentPath === '/index.html');
    } else if (href.length > 1) {
      isActive = currentPath.startsWith(href.replace(/\/$/, ''));
    }
    if (isActive) a.classList.add('active');
  });

  // ── FAQ Accordion ──────────────────────────────────────────
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var answer = this.nextElementSibling;
      var isOpen = this.classList.contains('open');
      // Close all open ones
      document.querySelectorAll('.faq-question.open').forEach(function (q) {
        q.classList.remove('open');
        if (q.nextElementSibling) q.nextElementSibling.classList.remove('open');
      });
      // Open clicked if it was closed
      if (!isOpen) {
        this.classList.add('open');
        if (answer) answer.classList.add('open');
      }
    });
  });

  // ── Render Books Grid (category pages) ────────────────────
  var bookGrid = document.getElementById('books-grid');
  if (bookGrid && typeof BOOKS_DATA !== 'undefined') {
    var cat = bookGrid.getAttribute('data-category');
    if (cat) {
      var books = getBooksByCategory(cat);
      if (books.length === 0) {
        bookGrid.innerHTML = '<div class="no-results"><div class="icon">📚</div><h3>Books coming soon!</h3><p>We are adding more books for this category. Check back soon.</p></div>';
      } else {
        bookGrid.innerHTML = books.map(bookCardHTML).join('');
      }
    }
  }

  // ── Render Homepage Sections ───────────────────────────────
  var featuredGrid = document.getElementById('featured-books-grid');
  if (featuredGrid && typeof BOOKS_DATA !== 'undefined') {
    var featured = getFeaturedBooks().slice(0, 6);
    featuredGrid.innerHTML = featured.map(bookCardHTML).join('');
  }

  var latestGrid = document.getElementById('latest-books-grid');
  if (latestGrid && typeof BOOKS_DATA !== 'undefined') {
    var latest = getLatestBooks(6);
    latestGrid.innerHTML = latest.map(bookCardHTML).join('');
  }

  // ── Category counts ────────────────────────────────────────
  document.querySelectorAll('[data-cat-count]').forEach(function (el) {
    var cat = el.getAttribute('data-cat-count');
    if (typeof getCategoryBookCount === 'function') {
      var n = getCategoryBookCount(cat);
      el.textContent = n + (n === 1 ? ' book' : ' books');
    }
  });

  // ── Scroll-in animation (only after content renders) ──────
  // FIX: don't set opacity:0 upfront — only animate elements already in DOM
  // Use a small delay so dynamically inserted cards get picked up
  setTimeout(function () {
    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-up');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });

      // Only animate cards not already visible in viewport
      document.querySelectorAll('.book-card, .cat-card, .blog-card, .info-card').forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var inViewport = rect.top < window.innerHeight && rect.bottom > 0;
        if (!inViewport) {
          el.style.opacity = '0';
          observer.observe(el);
        }
        // Elements already in viewport stay visible (no opacity:0)
      });
    }
  }, 100);

  // ── Toast helper ───────────────────────────────────────────
  window.showToast = function (msg) {
    var toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () { toast.classList.remove('show'); }, 3000);
  };

  // ── Download button feedback ───────────────────────────────
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-book-title]');
    if (btn) {
      showToast('⬇️  Preparing: ' + btn.getAttribute('data-book-title'));
    }
  });

});

// ── Book Card HTML ───────────────────────────────────────────
function bookCardHTML(book) {
  var catPath = book.category;
  var slug    = book.slug;
  var coverHTML = book.coverImage
    ? '<img src="' + book.coverImage + '" alt="' + escapeAttr(book.title) + ' cover" loading="lazy">'
    : '<div class="book-cover-placeholder">' + (book.emoji || '📚') + '</div>';

  return '<div class="book-card">'
    + '<a href="/' + catPath + '/' + slug + '.html" class="book-cover-wrap">' + coverHTML + '</a>'
    + '<div class="book-body">'
    +   '<div class="book-badge"><span class="badge">' + book.categoryLabel + '</span></div>'
    +   '<a href="/' + catPath + '/' + slug + '.html"><div class="book-title">' + book.title + '</div></a>'
    +   '<div class="book-subject">' + book.subject + '</div>'
    +   '<div class="book-desc">'  + book.description + '</div>'
    +   '<div class="book-actions">'
    +     '<a href="/' + catPath + '/' + slug + '.html" class="btn btn-outline btn-sm">View Details</a>'
    +     '<a href="' + (book.pdfLink || '#') + '" target="_blank" rel="noopener" class="btn btn-accent btn-sm" data-book-title="' + escapeAttr(book.title) + '">Download PDF</a>'
    +   '</div>'
    + '</div>'
    + '</div>';
}

function escapeAttr(str) {
  return String(str).replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
