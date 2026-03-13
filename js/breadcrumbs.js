// Academic Halt - Breadcrumb System
'use strict';

const BreadcrumbSystem = {
  init() {
    const el = document.getElementById('breadcrumbNav');
    if (!el) return;

    const crumbs = this.buildFromPath(window.location.pathname);
    this.render(el, crumbs);
    this.addSchema(crumbs);
  },

  buildFromPath(path) {
    const segments = path.replace(/^\/|\/$/g, '').split('/').filter(Boolean);
    const labelMap = {
      'study-material': 'Study Materials',
      'notes': 'Notes',
      'books': 'Books',
      'videos': 'Videos',
      'question-papers': 'Question Papers',
      'mock-tests': 'Mock Tests',
      'blog': 'Blog',
      'class-12': 'Class 12',
      'class-11': 'Class 11',
      'class-10': 'Class 10',
      'upsc': 'UPSC',
      'jee': 'JEE',
      'neet': 'NEET',
      'ssc': 'SSC',
      'gate': 'GATE',
      'cat': 'CAT',
      'about': 'About',
      'contact': 'Contact',
    };

    let url = '';
    return segments.map(seg => {
      url += '/' + seg;
      const label = labelMap[seg] || this.formatLabel(seg);
      return { label, url };
    });
  },

  formatLabel(slug) {
    return slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
      .replace(/\bPdf\b/i, 'PDF')
      .replace(/\bNcert\b/i, 'NCERT');
  },

  render(el, crumbs) {
    const all = [{ label: 'Home', url: '/' }, ...crumbs];
    el.innerHTML = `
      <ol class="breadcrumb">
        ${all.map((c, i) => `
          <li>
            ${i < all.length - 1
              ? `<a href="${c.url}" class="breadcrumb__link">${c.label}</a><span class="breadcrumb__sep">›</span>`
              : `<span class="breadcrumb__current">${c.label}</span>`
            }
          </li>
        `).join('')}
      </ol>
    `;
  },

  addSchema(crumbs) {
    const all = [{ label: 'Home', url: 'https://www.academichalt.com/' }, ...crumbs.map(c => ({ ...c, url: 'https://www.academichalt.com' + c.url }))];
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': all.map((c, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'name': c.label,
        'item': c.url,
      })),
    };
    let existing = document.getElementById('breadcrumb-schema');
    if (!existing) {
      existing = document.createElement('script');
      existing.id = 'breadcrumb-schema';
      existing.type = 'application/ld+json';
      document.head.appendChild(existing);
    }
    existing.textContent = JSON.stringify(schema);
  },
};

document.addEventListener('DOMContentLoaded', () => BreadcrumbSystem.init());
window.BreadcrumbSystem = BreadcrumbSystem;
