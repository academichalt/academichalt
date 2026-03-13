// Academic Halt - Search System
'use strict';

let resourcesData = [];
let searchIndex = [];

// Load resources data
async function loadResources() {
  try {
    const res = await fetch('/data/resources.json');
    const data = await res.json();
    resourcesData = data.resources || [];
    buildSearchIndex();
  } catch (e) {
    console.warn('Resources data not loaded:', e.message);
    // Use sample data for fallback
    resourcesData = getSampleResources();
    buildSearchIndex();
  }
}

function getSampleResources() {
  return [
    { title: 'Class 12 Chemistry Notes PDF', slug: 'class-12-chemistry-notes-pdf', category: 'Notes', subject: 'Chemistry', exam: 'Class 12', type: 'PDF', description: 'Complete Class 12 Chemistry notes covering all chapters' },
    { title: 'UPSC Polity Notes PDF', slug: 'upsc-polity-notes-pdf', category: 'Notes', subject: 'Polity', exam: 'UPSC', type: 'PDF', description: 'Comprehensive UPSC Indian Polity notes' },
    { title: 'JEE Physics Formula Sheet', slug: 'jee-physics-formula-sheet', category: 'Notes', subject: 'Physics', exam: 'JEE', type: 'PDF', description: 'All important physics formulas for JEE' },
    { title: 'NEET Biology Notes', slug: 'neet-biology-notes', category: 'Notes', subject: 'Biology', exam: 'NEET', type: 'PDF', description: 'Complete NEET Biology study notes' },
    { title: 'SSC CGL Previous Year Papers', slug: 'ssc-cgl-previous-year-papers', category: 'Question Papers', subject: 'General Studies', exam: 'SSC', type: 'PDF', description: 'SSC CGL question papers from last 10 years' },
    { title: 'Class 10 Maths NCERT Solutions', slug: 'class-10-maths-ncert-solutions', category: 'Notes', subject: 'Mathematics', exam: 'Class 10', type: 'PDF', description: 'Complete NCERT solutions for Class 10 Maths' },
    { title: 'GATE Computer Science Notes', slug: 'gate-cs-notes', category: 'Notes', subject: 'Computer Science', exam: 'GATE', type: 'PDF', description: 'GATE CS notes covering algorithms, OS, DBMS' },
    { title: 'CAT Quantitative Aptitude Notes', slug: 'cat-quant-notes', category: 'Notes', subject: 'Quantitative Aptitude', exam: 'CAT', type: 'PDF', description: 'CAT Quant preparation notes with shortcuts' },
    { title: 'Class 12 Physics NCERT', slug: 'class-12-physics-ncert', category: 'Books', subject: 'Physics', exam: 'Class 12', type: 'PDF', description: 'Class 12 Physics NCERT textbook PDF' },
    { title: 'UPSC History Notes', slug: 'upsc-history-notes', category: 'Notes', subject: 'History', exam: 'UPSC', type: 'PDF', description: 'Ancient, Medieval and Modern Indian History for UPSC' },
  ];
}

function buildSearchIndex() {
  searchIndex = resourcesData.map((r, i) => ({
    idx: i,
    searchStr: [r.title, r.subject, r.exam, r.category, r.description || '']
      .join(' ').toLowerCase()
  }));
}

function searchResources(query, limit = 10, filters = {}) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().trim();
  const terms = q.split(/\s+/);

  return resourcesData
    .filter((r, i) => {
      const s = searchIndex[i]?.searchStr || '';
      const matches = terms.every(t => s.includes(t));
      if (!matches) return false;
      if (filters.category && r.category !== filters.category) return false;
      if (filters.exam && r.exam !== filters.exam) return false;
      if (filters.type && r.type !== filters.type) return false;
      return true;
    })
    .slice(0, limit);
}

// ============ HEADER SEARCH ============
const headerSearchInput = document.getElementById('headerSearch');
const headerDropdown = document.getElementById('headerSearchDropdown');
let headerSearchTimer;

if (headerSearchInput && headerDropdown) {
  headerSearchInput.addEventListener('input', e => {
    clearTimeout(headerSearchTimer);
    const q = e.target.value.trim();
    if (q.length < 2) { headerDropdown.classList.remove('show'); return; }
    headerSearchTimer = setTimeout(() => renderHeaderDropdown(q), 200);
  });

  headerSearchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      window.location.href = `/search.html?q=${encodeURIComponent(headerSearchInput.value)}`;
    }
    if (e.key === 'Escape') headerDropdown.classList.remove('show');
  });

  document.addEventListener('click', e => {
    if (!headerSearchInput.contains(e.target)) headerDropdown.classList.remove('show');
  });
}

function renderHeaderDropdown(query) {
  const results = searchResources(query, 8);
  if (!results.length) {
    headerDropdown.innerHTML = `<div class="search-no-results">No results found for "<strong>${query}</strong>"</div>`;
  } else {
    const typeIcons = { 'PDF': '📄', 'Notes': '📝', 'Book': '📚', 'Video': '🎥', 'Question Papers': '📃', 'Mock Test': '✅' };
    headerDropdown.innerHTML = results.map(r => `
      <a href="/${r.slug || r.title.toLowerCase().replace(/\s+/g,'-')}/" class="search-item">
        <div class="search-item__icon">
          <span style="font-size:16px">${typeIcons[r.type] || typeIcons[r.category] || '📖'}</span>
        </div>
        <div>
          <div class="search-item__title">${highlightMatch(r.title, query)}</div>
          <div class="search-item__meta">${r.exam || ''} • ${r.category}</div>
        </div>
      </a>
    `).join('');
  }
  // "See all results" link
  headerDropdown.innerHTML += `<a href="/search.html?q=${encodeURIComponent(query)}" class="search-item" style="border-top:1px solid var(--border);justify-content:center;color:var(--primary);font-weight:600;">See all results for "${query}" →</a>`;
  headerDropdown.classList.add('show');
}

function highlightMatch(text, query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  let highlighted = text;
  terms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlighted = highlighted.replace(regex, '<mark style="background:#dbeafe;color:#1d4ed8;border-radius:2px;padding:0 2px">$1</mark>');
  });
  return highlighted;
}

// ============ FULL SEARCH PAGE ============
function initSearchPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q') || '';
  const searchInput = document.getElementById('mainSearch');
  const resultsGrid = document.getElementById('searchResults');
  const resultCount = document.getElementById('resultCount');

  if (!resultsGrid) return;
  if (searchInput && query) searchInput.value = query;

  function performSearch() {
    const q = searchInput ? searchInput.value.trim() : query;
    const catFilter = document.getElementById('filterCategory')?.value || '';
    const examFilter = document.getElementById('filterExam')?.value || '';
    const typeFilter = document.getElementById('filterType')?.value || '';

    const results = searchResources(q, 100, { category: catFilter || undefined, exam: examFilter || undefined, type: typeFilter || undefined });

    if (resultCount) resultCount.textContent = `${results.length} results`;
    renderSearchResults(results, q);
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => clearTimeout(headerSearchTimer) || (headerSearchTimer = setTimeout(performSearch, 300)));
    ['filterCategory','filterExam','filterType'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', performSearch);
    });
  }

  performSearch();
}

function renderSearchResults(results, query = '') {
  const grid = document.getElementById('searchResults');
  if (!grid) return;

  if (!results.length) {
    grid.innerHTML = `<div style="text-align:center;padding:80px 20px;grid-column:1/-1;">
      <div style="font-size:48px;margin-bottom:16px">🔍</div>
      <h3>No results found</h3>
      <p style="color:var(--text-muted)">Try different keywords or browse by category below.</p>
    </div>`;
    return;
  }

  grid.innerHTML = results.map(r => createResourceCard(r, query)).join('');
}

function createResourceCard(r, query = '') {
  const catColors = {
    'Notes': '#dbeafe', 'Books': '#dcfce7', 'Question Papers': '#fef9c3',
    'Videos': '#f3e8ff', 'Mock Tests': '#ffedd5', 'Study Guides': '#fce7f3'
  };
  const slug = r.slug || r.title.toLowerCase().replace(/\s+/g, '-');
  return `
    <div class="resource-card" data-animate>
      <div class="resource-card__thumb" style="background:${catColors[r.category] || '#f8fafc'}">
        <svg viewBox="0 0 280 157" xmlns="http://www.w3.org/2000/svg">
          <rect width="280" height="157" fill="${catColors[r.category] || '#f1f5f9'}"/>
          <text x="140" y="65" text-anchor="middle" font-size="36" font-family="sans-serif">${getCatEmoji(r.category)}</text>
          <text x="140" y="90" text-anchor="middle" font-size="12" font-family="sans-serif" fill="#64748b">${r.subject || r.category}</text>
          <text x="140" y="108" text-anchor="middle" font-size="10" font-family="sans-serif" fill="#94a3b8">${r.exam || ''}</text>
        </svg>
      </div>
      <div class="resource-card__body">
        <span class="resource-card__category">${r.category}</span>
        <h3 class="resource-card__title"><a href="/${slug}/" style="color:inherit;text-decoration:none">${query ? highlightMatch(r.title, query) : r.title}</a></h3>
        <p class="resource-card__desc">${r.description || 'High-quality study material for exam preparation.'}</p>
        <div class="resource-card__meta">
          <span>📚 ${r.subject || 'General'}</span>
          ${r.exam ? `<span>🎯 ${r.exam}</span>` : ''}
          <span>📄 ${r.type || 'PDF'}</span>
        </div>
        <div class="resource-card__footer">
          <a href="/${slug}/" class="btn btn-primary btn-sm">View Resource</a>
          <button class="btn btn-secondary btn-sm" onclick="AH.handleDownload('#','${r.title}')">⬇ Download</button>
        </div>
      </div>
    </div>
  `;
}

function getCatEmoji(cat) {
  const map = { 'Notes': '📝', 'Books': '📚', 'Question Papers': '📃', 'Videos': '🎥', 'Mock Tests': '✅', 'Study Guides': '📖' };
  return map[cat] || '📄';
}

// ============ HERO SEARCH ============
const heroSearchInput = document.getElementById('heroSearch');
if (heroSearchInput) {
  heroSearchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      window.location.href = `/search.html?q=${encodeURIComponent(heroSearchInput.value)}`;
    }
  });
}
const heroSearchBtn = document.getElementById('heroSearchBtn');
if (heroSearchBtn) {
  heroSearchBtn.addEventListener('click', () => {
    const q = heroSearchInput?.value || '';
    window.location.href = `/search.html?q=${encodeURIComponent(q)}`;
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadResources().then(() => {
    initSearchPage();
  });
});

window.searchResources = searchResources;
window.createResourceCard = createResourceCard;
window.renderSearchResults = renderSearchResults;
