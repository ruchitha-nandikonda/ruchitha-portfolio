/* 
   Theme management JavaScript
   This file handles dark/light mode switching and persistence
*/

class ThemeManager {
  constructor() {
    this.theme = this.getInitialTheme();
    this.themeToggle = null;
    this.themeIcon = null;
    
    this.init();
  }

  // Get the initial theme from localStorage or system preference
  getInitialTheme() {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  }

  // Initialize theme management
  init() {
    this.applyTheme();
    this.setupToggleButton();
    this.listenForSystemChanges();
  }

  // Apply the current theme to the document
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
    
    // Update the theme icon if it exists
    if (this.themeIcon) {
      this.updateThemeIcon();
    }
  }

  // Set up the theme toggle button
  setupToggleButton() {
    this.themeToggle = document.querySelector('.theme-toggle');
    this.themeIcon = document.querySelector('.theme-icon');
    
    if (this.themeToggle) {
      // Update initial icon
      this.updateThemeIcon();
      
      // Add click event listener
      this.themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
      
      // Add keyboard support
      this.themeToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleTheme();
        }
      });
    }
  }

  // Toggle between light and dark themes
  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    
    // Add a small animation to the toggle button
    if (this.themeToggle) {
      this.themeToggle.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.themeToggle.style.transform = 'scale(1)';
      }, 100);
    }
  }

  // Update the theme icon based on current theme
  updateThemeIcon() {
    if (this.themeIcon) {
      this.themeIcon.textContent = this.theme === 'light' ? '🌙' : '☀️';
      
      // Update aria-label for accessibility
      if (this.themeToggle) {
        const newLabel = `Switch to ${this.theme === 'light' ? 'dark' : 'light'} mode`;
        this.themeToggle.setAttribute('aria-label', newLabel);
      }
    }
  }

  // Listen for system theme changes
  listenForSystemChanges() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      mediaQuery.addEventListener('change', (e) => {
        // Only update if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
          this.theme = e.matches ? 'dark' : 'light';
          this.applyTheme();
        }
      });
    }
  }

  // Get current theme
  getCurrentTheme() {
    return this.theme;
  }

  // Set theme programmatically
  setTheme(newTheme) {
    if (newTheme === 'light' || newTheme === 'dark') {
      this.theme = newTheme;
      this.applyTheme();
    }
  }
}

// Initialize theme management when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});

// Make it available globally
window.ThemeManager = ThemeManager;