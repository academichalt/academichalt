/**
 * Academic Halt - Resource Loader
 * Handles lazy loading, caching, and pagination for resource grids
 */

(function () {
  'use strict';

  // ============================================================
  // CACHE LAYER — Prevents repeated fetch of resources.json
  // ============================================================
  const ResourceCache = {
    _data: null,
    _loading: null,

    async get() {
      if (this._data) return this._data;
      if (this._loading) return this._loading;

      this._loading = fetch('/data/resources.json')
        .then(r => r.json())
        .then(data => {
          this._data = data;
          this._loading = null;
          return data;
        })
        .catch(err => {
          this._loading = null;
          console.warn('[ResourceLoader] Could not load resources.json:', err.message);
          return { resources: [], meta: {} };
        });

      return this._loading;
    },

    invalidate() {
      this._data = null;
    },
  };

  // ============================================================
  // RESOURCE LOADER CLASS
  // ============================================================
  class ResourceLoader {
    constructor(options = {}) {
      this.gridSelector  = options.gridSelector  || '#resourceGrid';
      this.loadMoreBtn   = options.loadMoreBtn   || '#loadMoreBtn';
      this.pageSize      = options.pageSize      || 16;
      this.filters       = options.filters       || {};  // { exam, subject, category, featured }
      this.query         = options.query         || '';
      this.sortBy        = options.sortBy        || 'default';

      this._all      = [];   // full filtered set
      this._shown    = 0;
      this._grid     = null;
      this._btn      = null;
    }

    // ── init ──────────────────────────────────────────────────
    async init() {
      this._grid = document.querySelector(this.gridSelector);
      this._btn  = document.querySelector(this.loadMoreBtn);
      if (!this._grid) return;

      this._showSkeleton();

      const data = await ResourceCache.get();
      this._all = this._applyFilters(data.resources || []);
      this._sort();

      this._shown = 0;
      this._renderBatch(true);
      this._bindLoadMore();
    }

    // ── public API ────────────────────────────────────────────
    setFilter(key, value) {
      this.filters[key] = value;
      return this;
    }

    setQuery(q) {
      this.query = q.trim().toLowerCase();
      return this;
    }

    setSort(field) {
      this.sortBy = field;
      return this;
    }

    async refresh() {
      const data = await ResourceCache.get();
      this._all = this._applyFilters(data.resources || []);
      this._sort();
      this._shown = 0;
      this._renderBatch(true);
    }

    // ── internals ─────────────────────────────────────────────
    _applyFilters(resources) {
      return resources.filter(r => {
        // Text search
        if (this.query) {
          const terms = this.query.split(/\s+/);
          const haystack = `${r.title} ${r.subject} ${r.exam} ${r.category} ${r.description}`.toLowerCase();
          if (!terms.every(t => haystack.includes(t))) return false;
        }
        // Field filters
        if (this.filters.exam     && r.exam     !== this.filters.exam)     return false;
        if (this.filters.subject  && r.subject  !== this.filters.subject)  return false;
        if (this.filters.category && r.category !== this.filters.category) return false;
        if (this.filters.featured && !r.featured) return false;
        return true;
      });
    }

    _sort() {
      switch (this.sortBy) {
        case 'downloads':
          this._all.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
          break;
        case 'rating':
          this._all.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
          break;
        case 'newest':
          this._all.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
          break;
        case 'az':
          this._all.sort((a, b) => a.title.localeCompare(b.title));
          break;
        default:
          // featured first, then by downloads
          this._all.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return (b.downloads || 0) - (a.downloads || 0);
          });
      }
    }

    _renderBatch(reset = false) {
      const batch = this._all.slice(this._shown, this._shown + this.pageSize);

      if (reset) {
        this._grid.innerHTML = '';
        if (!batch.length) {
          this._grid.innerHTML = this._emptyState();
          if (this._btn) this._btn.style.display = 'none';
          return;
        }
      }

      const fragment = document.createDocumentFragment();
      batch.forEach(r => {
        const el = document.createElement('div');
        el.innerHTML = this._cardHTML(r);
        fragment.appendChild(el.firstElementChild);
      });
      this._grid.appendChild(fragment);

      this._shown += batch.length;

      if (this._btn) {
        this._btn.style.display = this._shown < this._all.length ? 'inline-flex' : 'none';
      }
    }

    _showSkeleton() {
      const count = this.pageSize;
      this._grid.innerHTML = Array.from({ length: count }, () =>
        `<div class="resource-card skeleton"><div class="skeleton-thumb"></div><div class="skeleton-body"><div class="skeleton-line" style="width:60%"></div><div class="skeleton-line" style="width:85%"></div><div class="skeleton-line" style="width:40%"></div></div></div>`
      ).join('');
    }

    _emptyState() {
      return `<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--text-muted)">
        <div style="font-size:48px;margin-bottom:12px">😔</div>
        <p style="font-size:16px;font-weight:600">No resources found</p>
        <p style="font-size:14px;margin-top:8px">Try different filters or search terms</p>
        <a href="/study-material/" class="btn btn-primary" style="margin-top:16px">Browse All Materials</a>
      </div>`;
    }

    _cardHTML(r) {
      const catColors = {
        'Notes':          '#2563eb',
        'Books':          '#16a34a',
        'Question Papers':'#d97706',
        'Mock Tests':     '#9333ea',
        'Videos':         '#dc2626',
        'Study Guides':   '#0891b2',
      };
      const color = catColors[r.category] || '#2563eb';
      const categoryEmoji = { Notes:'📝', Books:'📚', 'Question Papers':'📄', 'Mock Tests':'✅', Videos:'🎥', 'Study Guides':'📖' };
      const emoji = categoryEmoji[r.category] || '📄';
      const downloads = r.downloads > 1000 ? `${(r.downloads / 1000).toFixed(0)}K+` : r.downloads;
      const title = r.title.length > 60 ? r.title.substring(0, 57) + '…' : r.title;

      return `<div class="resource-card" data-id="${r.id}">
        <a href="/${r.slug}/" class="resource-card__thumb" style="background:${color}15;border-color:${color}25;text-decoration:none">
          <img src="${r.thumbnail}" alt="${r.title}" loading="lazy" onerror="this.style.display='none';this.parentElement.innerHTML='<span style=\\'font-size:40px\\'>${emoji}</span>'">
        </a>
        <div class="resource-card__body">
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px">
            <span class="badge" style="background:${color}15;color:${color};font-size:10px">${r.category}</span>
            ${r.featured ? '<span class="badge badge-yellow" style="font-size:10px">⭐ Featured</span>' : ''}
          </div>
          <h3 class="resource-card__title"><a href="/${r.slug}/" style="color:inherit;text-decoration:none">${title}</a></h3>
          <div class="resource-card__meta">
            <span>📚 ${r.subject}</span>
            <span>🎯 ${r.exam}</span>
          </div>
        </div>
        <div class="resource-card__footer">
          <div class="resource-card__stats">
            <span>⬇️ ${downloads}</span>
            <span>⭐ ${r.rating}</span>
            ${r.pages ? `<span>📄 ${r.pages}p</span>` : ''}
          </div>
          <button class="btn btn-primary btn-sm" onclick="AH.handleDownload('${r.download_link}','${r.title.replace(/'/g, "\\'")}')">Download</button>
        </div>
      </div>`;
    }

    _bindLoadMore() {
      if (!this._btn) return;
      this._btn.addEventListener('click', () => this._renderBatch(false));
    }
  }

  // ============================================================
  // TRENDING RESOURCES — for homepage
  // ============================================================
  async function loadTrendingResources(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const loader = new ResourceLoader({
      gridSelector: `#${containerId}`,
      pageSize: options.limit || 8,
      sortBy: 'downloads',
      filters: options.filters || {},
    });
    await loader.init();
  }

  // ============================================================
  // FEATURED RESOURCES STRIP
  // ============================================================
  async function loadFeaturedStrip(containerId) {
    const data = await ResourceCache.get();
    const featured = data.resources.filter(r => r.featured).slice(0, 6);
    const container = document.getElementById(containerId);
    if (!container || !featured.length) return;

    container.innerHTML = featured.map(r => `
      <a href="/${r.slug}/" class="tag" style="white-space:nowrap;text-decoration:none">
        ⭐ ${r.title.substring(0, 35)}${r.title.length > 35 ? '…' : ''}
      </a>
    `).join('');
  }

  // ============================================================
  // RELATED RESOURCES — for resource pages
  // ============================================================
  async function loadRelatedResources(exam, subject, category, currentSlug, containerId) {
    const data = await ResourceCache.get();
    const related = data.resources
      .filter(r => r.slug !== currentSlug && (r.exam === exam || r.subject === subject))
      .sort((a, b) => {
        let scoreA = 0, scoreB = 0;
        if (a.exam === exam)       scoreA += 3;
        if (a.subject === subject) scoreA += 2;
        if (a.category === category) scoreA += 1;
        if (b.exam === exam)       scoreB += 3;
        if (b.subject === subject) scoreB += 2;
        if (b.category === category) scoreB += 1;
        return scoreB - scoreA;
      })
      .slice(0, 8);

    const container = document.getElementById(containerId);
    if (!container || !related.length) return;

    const sectionTitle = document.createElement('div');
    sectionTitle.className = 'section-header';
    sectionTitle.style.marginBottom = '24px';
    sectionTitle.innerHTML = `<span class="section-header__label">More Resources</span><h2>You May Also Like</h2>`;

    const grid = document.createElement('div');
    grid.className = 'grid-4';

    const loader = new ResourceLoader({ gridSelector: null });
    grid.innerHTML = related.map(r => loader._cardHTML(r)).join('');

    container.appendChild(sectionTitle);
    container.appendChild(grid);
  }

  // ============================================================
  // AUTO-INIT — scans page for [data-resource-loader] elements
  // ============================================================
  function autoInit() {
    document.querySelectorAll('[data-resource-loader]').forEach(async el => {
      const options = {
        gridSelector: '#' + (el.id || 'resourceGrid'),
        pageSize:     parseInt(el.dataset.pageSize)  || 16,
        filters: {
          exam:     el.dataset.exam     || '',
          subject:  el.dataset.subject  || '',
          category: el.dataset.category || '',
        },
        sortBy: el.dataset.sort || 'default',
      };

      const loader = new ResourceLoader(options);
      await loader.init();

      // Wire up any sibling filter controls
      const filterControls = document.querySelectorAll('[data-filter-for="' + el.id + '"]');
      filterControls.forEach(ctrl => {
        ctrl.addEventListener('change', async () => {
          loader.setFilter(ctrl.dataset.filterKey, ctrl.value);
          await loader.refresh();
        });
      });
    });

    // Auto-load related resources on resource pages
    const relatedContainer = document.getElementById('relatedResources');
    if (relatedContainer) {
      const meta = document.querySelector('[data-subject]');
      if (meta) {
        const slug = window.location.pathname.replace(/\//g, '');
        loadRelatedResources(
          meta.dataset.exam || '',
          meta.dataset.subject || '',
          meta.dataset.category || '',
          slug,
          'relatedResources'
        );
      }
    }

    // Trending strip on homepage
    if (document.getElementById('trendingGrid')) {
      loadTrendingResources('trendingGrid', { limit: 8 });
    }

    // Featured strip
    if (document.getElementById('featuredStrip')) {
      loadFeaturedStrip('featuredStrip');
    }
  }

  // ============================================================
  // PUBLIC API
  // ============================================================
  window.ResourceLoader = ResourceLoader;
  window.loadTrendingResources = loadTrendingResources;
  window.loadRelatedResources = loadRelatedResources;
  window.loadFeaturedStrip = loadFeaturedStrip;
  window.ResourceCache = ResourceCache;

  // Auto-init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

})();
