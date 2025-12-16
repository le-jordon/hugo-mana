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
      searchInput.value = '';
    }
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

