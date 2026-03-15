// ── ACADEMIC HALT SEARCH SYSTEM ──
// Books data is loaded from content/books/*.md at build time or via this static array.
// For GitHub Pages (no build step), add books here manually or generate via CMS commit hook.

let BOOKS_DATA = [];

async function loadBooks() {
  try {
    const res = await fetch('/content/books/index.json');
    if (res.ok) BOOKS_DATA = await res.json();
  } catch {
    // fallback to inline data if JSON not available
    BOOKS_DATA = window.STATIC_BOOKS || [];
  }
}

function searchBooks(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return BOOKS_DATA.filter(book =>
    book.title.toLowerCase().includes(q) ||
    book.subject.toLowerCase().includes(q) ||
    book.category.toLowerCase().includes(q)
  ).slice(0, 8);
}

function renderResults(results, container) {
  if (!results.length) {
    container.innerHTML = '<div class="no-results">No books found. Try a different search.</div>';
    return;
  }
  container.innerHTML = results.map(book => `
    <div class="result-item">
      <div>
        <a href="/${book.category}/${book.slug}.html">${book.title}</a>
        <br><span>${book.subject} · ${categoryLabel(book.category)}</span>
      </div>
    </div>
  `).join('');
}

function categoryLabel(slug) {
  const map = {
    'class-9': 'Class 9', 'class-10': 'Class 10',
    'class-11': 'Class 11', 'class-12': 'Class 12',
    'jee-main': 'JEE Main', 'jee-advanced': 'JEE Advanced',
    'neet': 'NEET', 'upsc': 'UPSC'
  };
  return map[slug] || slug;
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadBooks();

  const input = document.getElementById('search-input');
  const resultsBox = document.getElementById('search-results');
  if (!input || !resultsBox) return;

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const q = input.value.trim();
      if (q.length < 2) { resultsBox.classList.remove('visible'); return; }
      const results = searchBooks(q);
      renderResults(results, resultsBox);
      resultsBox.classList.add('visible');
    }, 200);
  });

  document.addEventListener('click', (e) => {
    if (!input.contains(e.target) && !resultsBox.contains(e.target)) {
      resultsBox.classList.remove('visible');
    }
  });

  const searchForm = document.getElementById('search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (q) window.location.href = `/search.html?q=${encodeURIComponent(q)}`;
    });
  }
});
