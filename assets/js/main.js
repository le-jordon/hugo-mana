// Theme Toggle
(function() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Get theme from localStorage or system preference
  function getInitialTheme() {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  
  // Set theme
  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeToggleIcon(theme);
  }
  
  // Update theme toggle icon
  function updateThemeToggleIcon(theme) {
    const iconSun = themeToggle?.querySelector('.icon-sun');
    const iconMoon = themeToggle?.querySelector('.icon-moon');
    
    if (theme === 'light') {
      iconSun?.setAttribute('style', 'display: none;');
      iconMoon?.setAttribute('style', 'display: block;');
    } else {
      iconSun?.setAttribute('style', 'display: block;');
      iconMoon?.setAttribute('style', 'display: none;');
    }
  }
  
  // Initialize theme
  const initialTheme = getInitialTheme();
  setTheme(initialTheme);
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'light' : 'dark');
    }
  });
  
  // Toggle theme on button click
  themeToggle?.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  });
})();

// Search Modal
(function() {
  const searchToggle = document.getElementById('search-toggle');
  const searchModal = document.getElementById('search-modal');
  const searchModalBackdrop = document.getElementById('search-modal-backdrop');
  const searchModalClose = document.getElementById('search-modal-close');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  
  let searchIndex = [];
  let searchTimeout = null;
  
  // Load search index
  async function loadSearchIndex() {
    try {
      const response = await fetch('/index.json');
      if (response.ok) {
        searchIndex = await response.json();
      } else {
        console.error('Failed to load search index:', response.status);
      }
    } catch (error) {
      console.error('Failed to load search index:', error);
    }
  }
  
  // Perform search
  function performSearch(query) {
    if (!searchResults) return;
    
    if (!query || query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }
    
    const queryLower = query.toLowerCase().trim();
    const seenPermalinks = new Set();
    const results = searchIndex.filter(item => {
      if (!item || !item.permalink) return false;
      
      // Deduplicate by permalink
      if (seenPermalinks.has(item.permalink)) return false;
      seenPermalinks.add(item.permalink);
      
      const titleMatch = item.title?.toLowerCase().includes(queryLower);
      const summaryMatch = item.summary?.toLowerCase().includes(queryLower);
      const contentMatch = item.content?.toLowerCase().includes(queryLower);
      const tagsMatch = item.tags?.some(tag => tag.toLowerCase().includes(queryLower));
      return titleMatch || summaryMatch || contentMatch || tagsMatch;
    }).slice(0, 10); // Limit to 10 results
    
    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-result-empty">No results found</div>';
      return;
    }
    
    searchResults.innerHTML = results.map(item => `
      <a href="${item.permalink}" class="search-result-item">
        <div class="search-result-title">${highlightMatch(item.title || '', query)}</div>
        ${item.summary ? `<div class="search-result-summary">${highlightMatch(item.summary.substring(0, 150), query)}...</div>` : ''}
        ${item.date ? `<div class="search-result-date">${item.date}</div>` : ''}
      </a>
    `).join('');
  }
  
  // Highlight matching text
  function highlightMatch(text, query) {
    if (!text || !query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
  
  function openSearchModal() {
    if (searchModal) {
      searchModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        searchInput?.focus();
      }, 100);
    }
  }
  
  function closeSearchModal() {
    if (searchModal) {
      searchModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (searchInput) {
        searchInput.value = '';
      }
      if (searchResults) {
        searchResults.innerHTML = '';
      }
    }
  }
  
  // Handle search input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value;
      
      // Debounce search
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        performSearch(query);
      }, 200);
    });
  }
  
  // Open modal
  searchToggle?.addEventListener('click', openSearchModal);
  
  // Close on backdrop click
  searchModalBackdrop?.addEventListener('click', closeSearchModal);
  
  // Close on X button click
  searchModalClose?.addEventListener('click', closeSearchModal);
  
  // Close on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchModal?.getAttribute('aria-hidden') === 'false') {
      closeSearchModal();
    }
  });
  
  // Prevent modal from closing when clicking inside
  searchModal?.querySelector('.search-modal-container')?.addEventListener('click', (e) => {
    e.stopPropagation();
  });
  
  // Initialize - load search index
  loadSearchIndex();
})();

// Scroll to Top
(function() {
  const scrollToTopBtn = document.getElementById('scroll-to-top');
  
  function toggleScrollButton() {
    if (window.scrollY > 300) {
      scrollToTopBtn?.classList.add('visible');
    } else {
      scrollToTopBtn?.classList.remove('visible');
    }
  }
  
  // Show/hide button on scroll
  window.addEventListener('scroll', toggleScrollButton);
  
  // Scroll to top on click
  scrollToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
})();

// Smooth scroll for anchor links
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });
})();

// Make post cards clickable
(function() {
  document.querySelectorAll('.post-card[data-post-url]').forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't navigate if clicking on a link or tag
      if (e.target.closest('a')) {
        return;
      }
      const url = this.getAttribute('data-post-url');
      if (url) {
        window.location.href = url;
      }
    });
  });
})();

