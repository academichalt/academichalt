// Academic Halt - Internal Linking Engine
'use strict';

// Generates related content links based on current page metadata
const InternalLinker = {
  async init() {
    const meta = this.getPageMeta();
    if (!meta.subject && !meta.exam && !meta.category) return;

    let resources = [];
    try {
      const res = await fetch('/data/resources.json');
      const data = await res.json();
      resources = data.resources || [];
    } catch (e) {
      return;
    }

    const related = this.findRelated(resources, meta);
    this.renderRelatedSection(related, meta);
    this.addInlineLinks(resources);
  },

  getPageMeta() {
    return {
      subject: document.querySelector('[data-subject]')?.dataset.subject || '',
      exam: document.querySelector('[data-exam]')?.dataset.exam || '',
      category: document.querySelector('[data-category]')?.dataset.category || '',
      slug: window.location.pathname.replace(/\//g, ''),
    };
  },

  findRelated(resources, meta, limit = 8) {
    return resources
      .filter(r => {
        const slug = r.slug || '';
        if (slug === meta.slug) return false;
        let score = 0;
        if (meta.exam && r.exam === meta.exam) score += 3;
        if (meta.subject && r.subject === meta.subject) score += 2;
        if (meta.category && r.category === meta.category) score += 1;
        r._score = score;
        return score > 0;
      })
      .sort((a, b) => b._score - a._score)
      .slice(0, limit);
  },

  renderRelatedSection(related, meta) {
    const container = document.getElementById('relatedResources');
    if (!container || !related.length) return;

    container.innerHTML = `
      <div class="section-header">
        <span class="section-header__label">Related Resources</span>
        <h2>You May Also Like</h2>
        <p>More study materials for ${meta.exam || meta.subject || 'your exam preparation'}</p>
      </div>
      <div class="grid-4">
        ${related.map(r => `
          <a href="/${r.slug || r.title.toLowerCase().replace(/\s+/g,'-')}/" class="resource-card" style="text-decoration:none">
            <div class="resource-card__body">
              <span class="resource-card__category">${r.category}</span>
              <h3 class="resource-card__title">${r.title}</h3>
              <p class="resource-card__desc">${r.description || ''}</p>
              <div class="resource-card__meta">
                <span>📚 ${r.subject}</span>
                ${r.exam ? `<span>🎯 ${r.exam}</span>` : ''}
              </div>
            </div>
          </a>
        `).join('')}
      </div>
    `;
  },

  addInlineLinks(resources) {
    // Auto-link keywords in article body
    const body = document.getElementById('articleBody');
    if (!body) return;

    const linkMap = {};
    resources.slice(0, 200).forEach(r => {
      if (r.title.length > 5) {
        linkMap[r.title.toLowerCase()] = `/${r.slug || r.title.toLowerCase().replace(/\s+/g,'-')}/`;
      }
    });

    // Only link the first occurrence of each term
    const linked = new Set();
    let html = body.innerHTML;

    Object.entries(linkMap).forEach(([term, url]) => {
      if (linked.size > 10) return; // Max 10 inline links
      if (linked.has(url)) return;

      const regex = new RegExp(`(?<!<[^>]*)\\b(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'i');
      if (regex.test(html)) {
        html = html.replace(regex, `<a href="${url}" class="content-link">$1</a>`);
        linked.add(url);
      }
    });

    body.innerHTML = html;
  },

  // Breadcrumb generator
  generateBreadcrumbs(crumbs) {
    const nav = document.getElementById('breadcrumbNav');
    if (!nav) return;

    const items = [{ label: 'Home', url: '/' }, ...crumbs];

    nav.innerHTML = `
      <nav aria-label="Breadcrumb">
        <ol class="breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
          ${items.map((item, i) => `
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
              ${i < items.length - 1
                ? `<a href="${item.url}" class="breadcrumb__link" itemprop="item"><span itemprop="name">${item.label}</span></a><span class="breadcrumb__sep">›</span>`
                : `<span class="breadcrumb__current" itemprop="name">${item.label}</span>`
              }
              <meta itemprop="position" content="${i + 1}">
            </li>
          `).join('')}
        </ol>
      </nav>
    `;
  },
};

// Expose
window.InternalLinker = InternalLinker;

document.addEventListener('DOMContentLoaded', () => {
  InternalLinker.init();
});
