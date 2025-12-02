/* 
   Navigation JavaScript
   This file handles navigation behavior, active states, and scroll effects
*/

class NavigationManager {
  constructor() {
    this.header = null;
    this.navLinks = [];
    this.sections = [];
    this.scrollThreshold = 20;
    
    this.init();
  }

  // Initialize navigation functionality
  init() {
    this.setupElements();
    this.setupScrollListener();
    this.setupSmoothScrolling();
    this.setupActiveStates();
  }

  // Set up DOM elements
  setupElements() {
    this.header = document.querySelector('.header');
    this.navLinks = document.querySelectorAll('.nav-link');
    
    // Get all sections that correspond to navigation links
    this.sections = Array.from(this.navLinks).map(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        return document.querySelector(href);
      }
      return null;
    }).filter(section => section !== null);
  }

  // Set up scroll listener for header background
  setupScrollListener() {
    let ticking = false;
    
    const updateHeader = () => {
      const scrollY = window.scrollY;
      
      if (this.header) {
        if (scrollY > this.scrollThreshold) {
          this.header.classList.add('scrolled');
        } else {
          this.header.classList.remove('scrolled');
        }
      }
      
      // Update active navigation states
      this.updateActiveNavigation();
      
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    });
  }

  // Set up smooth scrolling for navigation links
  setupSmoothScrolling() {
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      // Only handle hash links (internal navigation)
      if (href && href.startsWith('#')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          
          const targetId = href.substring(1);
          const targetSection = document.getElementById(targetId);
          
          if (targetSection) {
            this.scrollToSection(targetSection);
          }
        });
      }
    });
  }

  // Smooth scroll to a specific section
  scrollToSection(section) {
    const headerHeight = this.header ? this.header.offsetHeight : 0;
    const targetPosition = section.offsetTop - headerHeight - 20;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  // Set up active states for navigation
  setupActiveStates() {
    // Set initial active state based on current page
    this.updateActiveNavigation();
  }

  // Update active navigation based on scroll position
  updateActiveNavigation() {
    if (this.sections.length === 0) return;
    
    const scrollPosition = window.scrollY + 100; // Offset for header
    let activeSection = null;
    
    // Find the current section
    this.sections.forEach(section => {
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          activeSection = section;
        }
      }
    });
    
    // Update navigation active states
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.remove('active');
      
      if (activeSection && href === `#${activeSection.id}`) {
        link.classList.add('active');
      }
    });
  }

  // Handle navigation for different pages
  handlePageNavigation() {
    const currentPage = window.location.pathname;
    
    this.navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.remove('active');
      
      // Check if this link matches the current page
      if (href === currentPage || 
          (currentPage === '/' && href === 'index.html') ||
          (currentPage.includes(href.replace('.html', '')))) {
        link.classList.add('active');
      }
    });
  }

  // Mobile menu toggle (if needed in future)
  setupMobileMenu() {
    // This can be expanded for mobile hamburger menu functionality
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navContainer = document.querySelector('.nav-container');
    
    if (mobileToggle && navContainer) {
      mobileToggle.addEventListener('click', () => {
        navContainer.classList.toggle('mobile-open');
        mobileToggle.classList.toggle('active');
      });
    }
  }

  // Handle keyboard navigation
  setupKeyboardNavigation() {
    this.navLinks.forEach((link, index) => {
      link.addEventListener('keydown', (e) => {
        switch (e.key) {
          case 'ArrowRight':
          case 'ArrowDown':
            e.preventDefault();
            const nextIndex = (index + 1) % this.navLinks.length;
            this.navLinks[nextIndex].focus();
            break;
            
          case 'ArrowLeft':
          case 'ArrowUp':
            e.preventDefault();
            const prevIndex = (index - 1 + this.navLinks.length) % this.navLinks.length;
            this.navLinks[prevIndex].focus();
            break;
            
          case 'Home':
            e.preventDefault();
            this.navLinks[0].focus();
            break;
            
          case 'End':
            e.preventDefault();
            this.navLinks[this.navLinks.length - 1].focus();
            break;
        }
      });
    });
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.navigationManager = new NavigationManager();
  
  // Handle page-specific navigation states
  window.navigationManager.handlePageNavigation();
});

// Handle navigation updates on page changes (for SPAs)
window.addEventListener('popstate', () => {
  if (window.navigationManager) {
    window.navigationManager.handlePageNavigation();
  }
});

// Make it available globally
window.NavigationManager = NavigationManager;