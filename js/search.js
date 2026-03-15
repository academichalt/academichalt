// Academic Halt — Search System v2

document.addEventListener('DOMContentLoaded', function () {
  var searchInput   = document.getElementById('search-input');
  var searchResults = document.getElementById('search-results');

  if (!searchInput || !searchResults) return;
  if (typeof BOOKS_DATA === 'undefined') return;

  var debounceTimer = null;

  searchInput.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      var query = searchInput.value.trim().toLowerCase();
      if (query.length < 2) {
        closeResults();
        return;
      }
      performSearch(query);
    }, 160);
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeResults();
    if (e.key === 'Enter') {
      var first = searchResults.querySelector('.search-result-item');
      if (first) { first.click(); }
    }
  });

  // Close when clicking outside
  document.addEventListener('click', function (e) {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      closeResults();
    }
  });

  function closeResults() {
    searchResults.classList.remove('show');
    searchResults.innerHTML = '';
  }

  function performSearch(query) {
    var results = BOOKS_DATA.filter(function (book) {
      return (
        book.title.toLowerCase().indexOf(query) > -1 ||
        book.subject.toLowerCase().indexOf(query) > -1 ||
        book.categoryLabel.toLowerCase().indexOf(query) > -1 ||
        (book.description && book.description.toLowerCase().indexOf(query) > -1)
      );
    }).slice(0, 8);

    if (results.length === 0) {
      searchResults.innerHTML =
        '<div style="padding:20px;text-align:center;color:var(--text-muted);font-family:var(--font-display);font-size:14px;">'
        + 'No books found for "<strong>' + esc(query) + '</strong>"'
        + '</div>';
    } else {
      searchResults.innerHTML = results.map(function (book) {
        var coverHTML = book.coverImage
          ? '<img src="' + book.coverImage + '" alt="' + esc(book.title) + '" style="width:36px;height:48px;object-fit:cover;border-radius:4px;flex-shrink:0;">'
          : '<div style="width:36px;height:48px;background:linear-gradient(135deg,#dbeafe,#eff6ff);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">' + (book.emoji || '📚') + '</div>';
        return '<a href="/' + book.category + '/' + book.slug + '.html" class="search-result-item">'
          + coverHTML
          + '<div>'
          + '<div class="search-result-title">' + highlight(book.title, query) + '</div>'
          + '<div class="search-result-cat">' + book.categoryLabel + ' · ' + book.subject + '</div>'
          + '</div>'
          + '</a>';
      }).join('');
    }

    searchResults.classList.add('show');
  }

  function highlight(text, query) {
    // Escape regex chars in query
    var escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(
      new RegExp('(' + escaped + ')', 'gi'),
      '<mark style="background:#dbeafe;border-radius:2px;padding:0 2px;color:var(--primary);">$1</mark>'
    );
  }

  function esc(str) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }
});
