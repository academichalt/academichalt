// Academic Halt — Search System

document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  if (!searchInput || !searchResults) return;
  if (typeof BOOKS_DATA === 'undefined') return;

  let debounceTimer;

  searchInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      const query = searchInput.value.trim().toLowerCase();
      if (query.length < 2) {
        searchResults.classList.remove('show');
        searchResults.innerHTML = '';
        return;
      }
      performSearch(query);
    }, 160);
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      searchResults.classList.remove('show');
      searchInput.blur();
    }
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.remove('show');
    }
  });

  function performSearch(query) {
    const results = BOOKS_DATA.filter(function (book) {
      return (
        book.title.toLowerCase().includes(query) ||
        book.subject.toLowerCase().includes(query) ||
        book.categoryLabel.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query)
      );
    }).slice(0, 8);

    if (results.length === 0) {
      searchResults.innerHTML = `
        <div style="padding:20px;text-align:center;color:var(--text-muted);font-family:var(--font-display);font-size:14px;">
          No books found for "<strong>${escapeHTML(query)}</strong>"
        </div>`;
    } else {
      searchResults.innerHTML = results.map(function (book) {
        const coverHTML = book.coverImage
          ? `<img src="${book.coverImage}" alt="${book.title}">`
          : `<div style="width:36px;height:48px;background:linear-gradient(135deg,#dbeafe,#eff6ff);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">${book.emoji || '📚'}</div>`;
        return `
          <a href="/${book.category}/${book.slug}.html" class="search-result-item">
            ${coverHTML}
            <div>
              <div class="search-result-title">${highlightMatch(book.title, query)}</div>
              <div class="search-result-cat">${book.categoryLabel} · ${book.subject}</div>
            </div>
          </a>`;
      }).join('');
    }

    searchResults.classList.add('show');
  }

  function highlightMatch(text, query) {
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp('(' + escaped + ')', 'gi'), '<mark style="background:#dbeafe;border-radius:2px;padding:0 2px;">$1</mark>');
  }

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }
});
