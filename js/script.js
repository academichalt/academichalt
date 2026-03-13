// Academic Halt - Main JavaScript
'use strict';

// ============ HEADER / NAV ============
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('show');
    document.body.style.overflow = mobileNav.classList.contains('show') ? 'hidden' : '';
  });
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('show');
      document.body.style.overflow = '';
    }
  });
}

// Active nav link
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
  if (link.getAttribute('href') === currentPath) link.classList.add('active');
});

// ============ BACK TO TOP ============
const btt = document.getElementById('backToTop');
if (btt) {
  window.addEventListener('scroll', () => {
    btt.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ============ FAQ ============
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const answer = q.nextElementSibling;
    const isOpen = q.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-question').forEach(x => {
      x.classList.remove('open');
      x.nextElementSibling.classList.remove('show');
    });
    if (!isOpen) {
      q.classList.add('open');
      answer.classList.add('show');
    }
  });
});

// ============ TABS ============
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabGroup = btn.closest('[data-tabs]');
    if (!tabGroup) return;
    const target = btn.dataset.tab;
    tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    tabGroup.querySelectorAll('.tab-pane').forEach(p => {
      p.style.display = p.dataset.pane === target ? 'block' : 'none';
    });
    btn.classList.add('active');
  });
});

// ============ NEWSLETTER ============
function handleNewsletter(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  const original = btn.textContent;
  btn.textContent = '✓ Subscribed!';
  btn.style.background = '#22c55e';
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
    e.target.reset();
  }, 3000);
}

// ============ LAZY LOADING ============
if ('IntersectionObserver' in window) {
  const lazyImages = document.querySelectorAll('img[data-src]');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px 0px' });
  lazyImages.forEach(img => imgObserver.observe(img));
}

// ============ COUNTER ANIMATION ============
function animateCount(el, target, duration = 1500) {
  const start = 0;
  const startTime = performance.now();
  const step = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
  };
  requestAnimationFrame(step);
}

// Counter observer
const counterEls = document.querySelectorAll('[data-count]');
if (counterEls.length) {
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCount(el, parseInt(el.dataset.count), 1500);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterObserver.observe(el));
}

// ============ SCROLL ANIMATIONS ============
const fadeEls = document.querySelectorAll('[data-animate]');
if (fadeEls.length && 'IntersectionObserver' in window) {
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    fadeObserver.observe(el);
  });
}

// ============ FOOTER YEAR ============
const fyEl = document.getElementById('footerYear');
if (fyEl) fyEl.textContent = new Date().getFullYear();

// ============ COPY TO CLIPBOARD ============
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard!');
  });
}

// ============ TOAST ============
function showToast(msg, type = 'success', duration = 3000) {
  const existing = document.getElementById('toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.style.cssText = `
    position:fixed;bottom:24px;left:50%;transform:translateX(-50%);
    background:${type === 'success' ? '#22c55e' : '#ef4444'};color:#fff;
    padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;
    box-shadow:0 4px 20px rgba(0,0,0,0.2);z-index:9999;
    animation:fadeInUp 0.3s ease;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ============ DOWNLOAD HANDLER ============
function handleDownload(url, title) {
  // Track download
  console.log('Download:', title, url);
  showToast('Download starting... 📥');
  if (url && url !== '#') {
    window.open(url, '_blank');
  }
}

// ============ RESOURCE RATING ============
document.querySelectorAll('.star-rating').forEach(container => {
  const stars = container.querySelectorAll('.star');
  stars.forEach((star, idx) => {
    star.addEventListener('mouseenter', () => {
      stars.forEach((s, i) => s.style.color = i <= idx ? '#f59e0b' : '#d1d5db');
    });
    star.addEventListener('mouseleave', () => {
      const rated = parseInt(container.dataset.rated) || 0;
      stars.forEach((s, i) => s.style.color = i < rated ? '#f59e0b' : '#d1d5db');
    });
    star.addEventListener('click', () => {
      container.dataset.rated = idx + 1;
      showToast(`Rated ${idx + 1} star${idx > 0 ? 's' : ''}! ⭐`);
    });
  });
});

// ============ SHARE ============
function shareResource(title, url) {
  if (navigator.share) {
    navigator.share({ title, url });
  } else {
    copyToClipboard(url || window.location.href);
  }
}

// ============ PRINT ============
function printResource() {
  window.print();
}

// Export utilities
window.AH = {
  handleDownload,
  shareResource,
  copyToClipboard,
  showToast,
  printResource,
  handleNewsletter,
};
