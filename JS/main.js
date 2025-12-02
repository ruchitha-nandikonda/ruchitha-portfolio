/* 
   Main JavaScript file
   This file coordinates all other scripts and handles global functionality
*/

class PortfolioApp {
  constructor() {
    this.isLoaded = false;
    this.managers = {};
    
    this.init();
  }

  // Initialize the portfolio application
  init() {
    this.setupGlobalEventListeners();
    this.setupUtilities();
    this.setupAccessibility();
    this.handlePageLoad();
  }

  // Set up global event listeners
  setupGlobalEventListeners() {
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange();
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleGlobalKeyboard(e);
    });

    // Handle clicks for analytics or other global actions
    document.addEventListener('click', (e) => {
      this.handleGlobalClick(e);
    });
  }

  // Set up utility functions
  setupUtilities() {
    // Smooth scroll polyfill for older browsers
    this.setupSmoothScrollPolyfill();
    
    // Set up intersection observer polyfill if needed
    this.setupIntersectionObserverPolyfill();
    
    // Set up performance monitoring
    this.setupPerformanceMonitoring();
  }

  // Set up accessibility features
  setupAccessibility() {
    // Skip to main content link
    this.createSkipLink();
    
    // Focus management
    this.setupFocusManagement();
    
    // Announce page changes for screen readers
    this.setupPageAnnouncements();
  }

  // Handle page load completion with proper timing
  handlePageLoad() {
    // Use multiple event listeners to ensure proper initialization
    const initializeApp = () => {
      this.isLoaded = true;
      
      // Store references to managers
      this.managers = {
        theme: window.themeManager,
        navigation: window.navigationManager,
        animation: window.animationManager,
        timeline: window.timelineManager,
        contactForm: window.contactFormManager
      };
      
      // Set up resume download functionality
      this.setupResumeDownload();
      
      // Set up project card interactions
      this.setupProjectCards();
      
      // Set up impact card interactions (collapsible)
      this.setupImpactCards();
      
      // Initialize page-specific functionality
      this.initializePageSpecific();
      
      // Handle viewport changes for mobile browsers
      this.setupViewportHandling();
      
      // Announce that the page is ready
      this.announcePageReady();
    };

    // Handle different loading states
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeApp);
    } else if (document.readyState === 'interactive') {
      // DOM is ready but resources might still be loading
      setTimeout(initializeApp, 0);
    } else {
      // Document is fully loaded
      initializeApp();
    }

    // Also listen for full page load
    window.addEventListener('load', () => {
      // Re-initialize viewport handling after full load
      this.setupViewportHandling();
    });
  }

  // Handle visibility changes (tab switching, etc.)
  handleVisibilityChange() {
    if (document.hidden) {
      // Page is hidden - pause animations, etc.
      this.pauseAnimations();
    } else {
      // Page is visible - resume animations
      this.resumeAnimations();
    }
  }

  // Handle window resize with debouncing and viewport updates
  handleResize() {
    // Update any size-dependent calculations
    if (this.managers.animation && this.managers.animation.handleResize) {
      this.managers.animation.handleResize();
    }
    
    // Update navigation if needed
    if (this.managers.navigation && this.managers.navigation.handleResize) {
      this.managers.navigation.handleResize();
    }

    // Update viewport-dependent elements
    this.updateViewportElements();
  }

  // Set up viewport handling for mobile browsers
  setupViewportHandling() {
    // Set CSS custom properties for viewport dimensions
    const updateViewportProperties = () => {
      const vh = window.innerHeight * 0.01;
      const vw = window.innerWidth * 0.01;
      
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      document.documentElement.style.setProperty('--vw', `${vw}px`);
      
      // Update viewport-dependent elements
      this.updateViewportElements();
    };

    // Initial update
    updateViewportProperties();

    // Update on resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateViewportProperties, 100);
    });

    // Update on orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(updateViewportProperties, 500);
    });
  }

  // Update elements that depend on viewport dimensions
  updateViewportElements() {
    // Update hero section height if needed
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
      const currentHeight = window.innerHeight;
      heroSection.style.setProperty('--viewport-height', `${currentHeight}px`);
    }

    // Update any modals or overlays
    const modals = document.querySelectorAll('.modal, .project-modal-overlay');
    modals.forEach(modal => {
      if (modal.style.maxHeight && modal.style.maxHeight.includes('vh')) {
        const maxHeight = window.innerHeight * 0.8;
        modal.style.maxHeight = `${maxHeight}px`;
      }
    });
  }

  // Handle global keyboard shortcuts
  handleGlobalKeyboard(e) {
    // Escape key - close any open modals/dropdowns
    if (e.key === 'Escape') {
      this.closeAllModals();
    }
    
    // Ctrl/Cmd + K - focus search (if implemented)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      this.focusSearch();
    }
    
    // Alt + T - toggle theme
    if (e.altKey && e.key === 't') {
      e.preventDefault();
      if (this.managers.theme) {
        this.managers.theme.toggleTheme();
      }
    }
  }

  // Handle global clicks
  handleGlobalClick(e) {
    // Track external link clicks
    if (e.target.matches('a[href^="http"]')) {
      this.trackExternalLink(e.target.href);
    }
    
    // Handle resume download clicks
    if (e.target.matches('.resume-btn, .resume-btn *')) {
      e.preventDefault();
      this.downloadResume();
    }
  }

  // Set up resume download functionality
  setupResumeDownload() {
    const resumeButtons = document.querySelectorAll('.resume-btn');
    
    resumeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.downloadResume();
      });
    });
  }

  // Handle resume download
  downloadResume() {
    const resumeUrl = '/Ruchitha Nandikonda.pdf';
    
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Ruchitha Nandikonda.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success notification
    this.showNotification('Resume download started!', 'success');
  }

  // Set up project card interactions
  setupProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    console.log('Setting up project cards. Found:', projectCards.length);
    
    projectCards.forEach(card => {
      console.log('Setting up card:', card.querySelector('.project-title')?.textContent);
      
      // Add keyboard navigation
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          console.log('Keyboard triggered on card');
          this.handleProjectCardClick(card);
        }
      });
      
      // Add click handler (only if no onclick is already set)
      const onclickAttr = card.getAttribute('onclick');
      if (!onclickAttr || !onclickAttr.includes('window.open')) {
        card.addEventListener('click', () => {
          console.log('Card clicked:', card.querySelector('.project-title')?.textContent);
          this.handleProjectCardClick(card);
        });
      }
      
      // Make card focusable
      card.setAttribute('tabindex', '0');
      card.style.cursor = 'pointer';
    });
  }

  // Set up impact card interactions (collapsible functionality)
  setupImpactCards() {
    const impactCards = document.querySelectorAll('.impact-card');
    
    console.log('Setting up impact cards. Found:', impactCards.length);
    
    impactCards.forEach(card => {
      // Add click handler for toggling
      card.addEventListener('click', () => {
        this.toggleImpactCard(card);
      });
      
      // Add keyboard navigation
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggleImpactCard(card);
        }
      });
      
      // Make card focusable
      card.setAttribute('tabindex', '0');
    });
  }

  // Toggle impact card expansion
  toggleImpactCard(card) {
    const isExpanded = card.classList.contains('expanded');
    
    // Close all other cards first (optional - remove if you want multiple open)
    document.querySelectorAll('.impact-card').forEach(otherCard => {
      if (otherCard !== card) {
        otherCard.classList.remove('expanded');
      }
    });
    
    // Toggle current card
    if (isExpanded) {
      card.classList.remove('expanded');
    } else {
      card.classList.add('expanded');
    }
    
    console.log('Toggled impact card:', card.querySelector('.impact-title')?.textContent, 'Expanded:', !isExpanded);
  }

  // Handle project card clicks
  handleProjectCardClick(card) {
    // Check if card has an onclick handler (for external links)
    const onclickAttr = card.getAttribute('onclick');
    if (onclickAttr && onclickAttr.includes('window.open')) {
      // External link - let the onclick handler take care of it
      // The onclick will execute before this, so we just return
      return;
    }
    
    // Get project title for the notification
    const title = card.querySelector('.project-title')?.textContent || 'Project';
    const projectId = card.getAttribute('data-project') || 'unknown';
    console.log('Handling click for:', title, 'ID:', projectId);
    
    // Create a detailed project modal or navigate to project page
    this.showProjectModal(title, projectId, card);
  }

  // Show project details in a modal
  showProjectModal(title, projectId, card) {
    console.log('Creating modal for:', title);
    
    // Get project-specific content
    const projectData = this.getProjectData(projectId);
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'project-modal-overlay';
    modal.innerHTML = `
      <div class="project-modal">
        <div class="project-modal-header">
          <h2>${title}</h2>
          <button class="project-modal-close" aria-label="Close modal">&times;</button>
        </div>
        <div class="project-modal-content">
          <p>${projectData.description}</p>
          <div class="project-modal-details">
            <h3>Key Features:</h3>
            <ul>
              ${projectData.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
      .project-modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 2rem;
        animation: fadeIn 0.3s ease-out;
      }
      
      .project-modal {
        background: white;
        border-radius: 2rem;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        animation: slideUp 0.3s ease-out;
      }
      
      [data-theme="dark"] .project-modal {
        background: var(--color-slate-800);
        color: var(--color-slate-100);
      }
      
      .project-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2rem 2rem 1rem;
        border-bottom: 1px solid var(--color-slate-100);
      }
      
      [data-theme="dark"] .project-modal-header {
        border-bottom-color: var(--color-slate-700);
      }
      
      .project-modal-header h2 {
        font-family: var(--font-telma);
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-purple-700);
        margin: 0;
      }
      
      [data-theme="dark"] .project-modal-header h2 {
        color: var(--color-purple-300);
      }
      
      .project-modal-close {
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        color: var(--color-slate-400);
        transition: color var(--transition-fast);
        padding: 0;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .project-modal-close:hover {
        color: var(--color-slate-600);
      }
      
      .project-modal-content {
        padding: 2rem;
      }
      
      .project-modal-content p {
        font-family: var(--font-chillax);
        color: var(--color-slate-600);
        line-height: 1.6;
        margin-bottom: 1.5rem;
      }
      
      [data-theme="dark"] .project-modal-content p {
        color: var(--color-slate-200);
      }
      
      .project-modal-details h3 {
        font-family: var(--font-chillax);
        font-weight: 600;
        color: var(--color-slate-800);
        margin-bottom: 1rem;
      }
      
      [data-theme="dark"] .project-modal-details h3 {
        color: var(--color-slate-100);
      }
      
      .project-modal-details ul {
        list-style: none;
        padding: 0;
        margin-bottom: 2rem;
      }
      
      .project-modal-details li {
        font-family: var(--font-chillax);
        color: var(--color-slate-600);
        margin-bottom: 0.5rem;
        padding-left: 1.5rem;
        position: relative;
      }
      
      [data-theme="dark"] .project-modal-details li {
        color: var(--color-slate-200);
      }
      
      .project-modal-details li::before {
        content: '•';
        color: var(--color-primary-500);
        position: absolute;
        left: 0;
      }
      
      .project-modal-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }
      
      .btn-primary, .btn-secondary {
        padding: 0.75rem 1.5rem;
        border-radius: 1rem;
        font-family: var(--font-chillax);
        font-weight: 500;
        cursor: pointer;
        transition: all var(--transition-fast);
        border: none;
      }
      
      .btn-primary {
        background: var(--color-primary-700);
        color: white;
      }
      
      .btn-primary:hover {
        background: var(--color-primary-500);
        transform: translateY(-1px);
      }
      
      .btn-secondary {
        background: var(--color-slate-100);
        color: var(--color-slate-700);
      }
      
      [data-theme="dark"] .btn-secondary {
        background: var(--color-slate-700);
        color: var(--color-slate-200);
      }
      
      .btn-secondary:hover {
        background: var(--color-slate-200);
        transform: translateY(-1px);
      }
      
      [data-theme="dark"] .btn-secondary:hover {
        background: var(--color-slate-600);
      }
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { 
          opacity: 0;
          transform: translateY(30px) scale(0.95);
        }
        to { 
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      @media (max-width: 768px) {
        .project-modal {
          margin: 1rem;
          border-radius: 1.5rem;
        }
        
        .project-modal-header,
        .project-modal-content {
          padding: 1.5rem;
        }
        
        .project-modal-actions {
          flex-direction: column;
        }
        
        .btn-primary, .btn-secondary {
          width: 100%;
          text-align: center;
        }
      }
    `;
    
    if (!document.querySelector('#project-modal-styles')) {
      style.id = 'project-modal-styles';
      document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(modal);
    console.log('Modal added to page');
    
    // Close modal functionality
    const closeModal = () => {
      console.log('Closing modal');
      modal.style.animation = 'fadeIn 0.3s ease-out reverse';
      setTimeout(() => {
        if (modal.parentNode) {
          modal.remove();
          console.log('Modal removed');
        }
      }, 300);
    };
    
    // Event listeners
    modal.querySelector('.project-modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    // Keyboard support
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleKeyDown);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    
    // Button actions
    modal.querySelector('.btn-primary').addEventListener('click', () => {
      this.showNotification('Live demo would open here!', 'info');
    });
    
    modal.querySelector('.btn-secondary').addEventListener('click', () => {
      this.showNotification('Code repository would open here!', 'info');
    });
  }
  
  // Get project-specific data
  getProjectData(projectId) {
    const projects = {
      'smartcart': {
        description: 'SmartCart solves the problem of overspending on groceries by syncing your pantry, meal plans, and local deals. Users upload grocery receipts, which are automatically read using AWS Textract. The backend updates the pantry, checks local deals, and generates the most cost-efficient shopping list.',
        features: [
          'React + TypeScript frontend with Tailwind CSS',
          'Spring Boot backend with Java',
          'AWS DynamoDB for pantry and deal storage',
          'AWS Textract OCR for automated receipt processing',
          'Python scripts for data wrangling and automation',
          'Terraform for cloud infrastructure as code',
          'Docker containerization for consistent deployments',
          'Cost-optimized shopping list generation engine'
        ],
        demoUrl: 'https://smartcart-phi.vercel.app/',
        codeUrl: 'https://github.com/ruchitha-nandikonda/smartcart'
      },
      'lucid-loom': {
        description: 'Lucid Loom is an AI-driven platform that analyzes user dreams and generates insights through Groq and DALL-E. Built with React, Tailwind, FastAPI, and PostgreSQL. Deployed using Docker — frontend on Vercel and backend on Railway.',
        features: [
          'React 19 with Tailwind CSS and Vite',
          'FastAPI backend with Python and SQLAlchemy',
          'PostgreSQL database for user data and dreams',
          'JWT authentication with OTP email verification',
          'Groq API (Llama 3.1) for dream interpretation',
          'OpenAI DALL-E 3 for creative dream imagery',
          'Interactive analytics dashboard with Recharts',
          'Real-time updates using WebSockets',
          'Docker containerization and deployment',
          'Frontend on Vercel, backend on Railway'
        ],
        demoUrl: 'https://lucid-loom.vercel.app/',
        codeUrl: 'https://github.com/ruchitha-nandikonda/lucid-loom'
      },
      'quick-mic-drop': {
        description: 'AI-powered feedback platform that reduced processing time by 98%. Students share feedback in under 1 minute—managers act seconds later.',
        features: [
          'Mobile-first UI with step-by-step form',
          'AI sentiment scoring with GPT-4o-mini',
          'Real-time dashboards and analytics',
          'Instant escalations for safety issues',
          'Google Apps Script automation'
        ],
        demoUrl: '#',
        codeUrl: '#'
      },
      'it-incidents': {
        description: 'Power BI dashboard transforming raw incident logs into actionable insights: resolution time, reassignment patterns, priority trends, and geo hotspots.',
        features: [
          'Interactive Power BI dashboards',
          'SLA gap analysis and tracking',
          'Reassignment pattern visualization',
          'Geographic incident hotspots',
          'Priority and urgency trend analysis'
        ],
        demoUrl: '#',
        codeUrl: '#'
      },
      'agile-hrms': {
        description: 'Complete HR management system built with Agile methodology. Led sprints balancing speed & quality from application to payroll.',
        features: [
          'Full employee lifecycle management',
          'Agile development with Scrum',
          'Automated testing and QA processes',
          'Performance tracking and analytics',
          'Self-service employee portal'
        ],
        demoUrl: '#',
        codeUrl: '#'
      }
    };
    
    return projects[projectId] || {
      description: 'This project showcases modern development techniques and user-centered design principles.',
      features: [
        'Responsive design across all devices',
        'Modern development techniques',
        'User-friendly interface',
        'Performance optimized'
      ],
      demoUrl: '#',
      codeUrl: '#'
    };
  }

  // Initialize page-specific functionality
  initializePageSpecific() {
    const currentPage = this.getCurrentPage();
    
    switch (currentPage) {
      case 'index':
        this.initializeHomePage();
        break;
      case 'about':
        this.initializeAboutPage();
        break;
      case 'contact':
        this.initializeContactPage();
        break;
    }
  }

  // Get current page identifier
  getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    return filename.replace('.html', '') || 'index';
  }

  // Initialize home page specific functionality
  initializeHomePage() {
    // Add any home page specific interactions
    console.log('Home page initialized');
  }

  // Initialize about page specific functionality
  initializeAboutPage() {
    // Add any about page specific interactions
    console.log('About page initialized');
  }

  // Initialize contact page specific functionality
  initializeContactPage() {
    // Add any contact page specific interactions
    console.log('Contact page initialized');
  }

  // Create skip to main content link
  createSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    
    // Add styles for skip link
    const style = document.createElement('style');
    style.textContent = `
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--color-primary-700);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        font-family: var(--font-chillax);
        font-size: 0.875rem;
      }
      
      .skip-link:focus {
        top: 6px;
      }
    `;
    
    document.head.appendChild(style);
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Set up focus management
  setupFocusManagement() {
    // Track focus for better accessibility
    let focusedElement = null;
    
    document.addEventListener('focusin', (e) => {
      focusedElement = e.target;
    });
    
    // Restore focus when needed
    window.restoreFocus = () => {
      if (focusedElement) {
        focusedElement.focus();
      }
    };
  }

  // Set up page announcements for screen readers
  setupPageAnnouncements() {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    
    const style = document.createElement('style');
    style.textContent = `
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(announcer);
    
    window.announceToScreenReader = (message) => {
      announcer.textContent = message;
    };
  }

  // Announce that the page is ready
  announcePageReady() {
    setTimeout(() => {
      if (window.announceToScreenReader) {
        window.announceToScreenReader('Page loaded and ready for interaction');
      }
    }, 1000);
  }

  // Show notification to user
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        font-family: var(--font-chillax);
        font-size: 0.875rem;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
      }
      
      .notification-info {
        background: #dbeafe;
        color: #1e40af;
        border: 1px solid #93c5fd;
      }
      
      .notification-success {
        background: #dcfce7;
        color: #166534;
        border: 1px solid #bbf7d0;
      }
      
      .notification-error {
        background: #fef2f2;
        color: #dc2626;
        border: 1px solid #fecaca;
      }
      
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    
    if (!document.querySelector('#notification-styles')) {
      style.id = 'notification-styles';
      document.head.appendChild(style);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideInRight 0.3s ease-out reverse';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 5000);
  }

  // Close all modals/dropdowns
  closeAllModals() {
    // Close timeline items
    if (this.managers.timeline && this.managers.timeline.closeAllTimelineItems) {
      this.managers.timeline.closeAllTimelineItems();
    }
    
    // Close any other modals that might be open
    const modals = document.querySelectorAll('.modal, .dropdown');
    modals.forEach(modal => {
      modal.classList.remove('active', 'open');
    });
  }

  // Focus search (placeholder for future search functionality)
  focusSearch() {
    const searchInput = document.querySelector('#search');
    if (searchInput) {
      searchInput.focus();
    }
  }

  // Track external link clicks (placeholder for analytics)
  trackExternalLink(url) {
    console.log('External link clicked:', url);
    // In a real implementation, this would send data to analytics
  }

  // Pause animations when page is hidden
  pauseAnimations() {
    document.body.style.animationPlayState = 'paused';
  }

  // Resume animations when page is visible
  resumeAnimations() {
    document.body.style.animationPlayState = 'running';
  }

  // Set up smooth scroll polyfill
  setupSmoothScrollPolyfill() {
    // Check if smooth scroll is supported
    if (!('scrollBehavior' in document.documentElement.style)) {
      // Load polyfill if needed
      console.log('Smooth scroll not supported, would load polyfill');
    }
  }

  // Set up intersection observer polyfill
  setupIntersectionObserverPolyfill() {
    if (!('IntersectionObserver' in window)) {
      console.log('IntersectionObserver not supported, would load polyfill');
    }
  }

  // Set up performance monitoring
  setupPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      if ('performance' in window) {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
      }
    });
  }
}

// Simple global function for project clicks
function openProjectModal(projectId, projectTitle) {
  console.log('Opening modal for:', projectTitle);
  
  // Create modal HTML
  const modalHTML = `
    <div id="project-modal" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 2rem;
    ">
      <div style="
        background: white;
        border-radius: 2rem;
        max-width: 600px;
        width: 100%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
        position: relative;
      ">
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2rem 2rem 1rem;
          border-bottom: 1px solid #e2e8f0;
        ">
          <h2 style="
            font-family: 'Telma', serif;
            font-size: 1.5rem;
            font-weight: 700;
            color: #7c3aed;
            margin: 0;
          ">${projectTitle}</h2>
          <button onclick="closeProjectModal()" style="
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #94a3b8;
            padding: 0;
            width: 2rem;
            height: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
          ">&times;</button>
        </div>
        <div style="padding: 2rem;">
          <p style="
            font-family: 'Chillax', sans-serif;
            color: #475569;
            line-height: 1.6;
            margin-bottom: 1.5rem;
          ">This is the ${projectTitle} project. More details coming soon!</p>
        </div>
      </div>
    </div>
  `;
  
  // Add modal to page
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.remove();
  }
}

// Handle demo button clicks
function handleDemoClick(projectId) {
  const demoUrls = {
    'quick-mic-drop': 'https://script.google.com/your-demo-url',
    'it-incidents': '#demo-not-available',
    'agile-hrms': '#demo-not-available'
  };
  
  const url = demoUrls[projectId];
  if (url && url !== '#demo-not-available') {
    // For now, show a message instead of opening external URL
    showNotification('Demo would open: ' + url, 'info');
  } else {
    showNotification('Live demo coming soon! This project is currently in development.', 'info');
  }
}

// Handle code button clicks
function handleCodeClick(projectId) {
  const codeUrls = {
    'smartcart': 'https://github.com/ruchitha-nandikonda/smartcart',
    'lucid-loom': 'https://github.com/ruchitha-nandikonda/lucid-loom',
    'quick-mic-drop': 'https://github.com/ruchitha-nandikonda/quick-mic-drop',
    'it-incidents': 'https://github.com/ruchitha-nandikonda/it-incidents-dashboard',
    'agile-hrms': 'https://github.com/ruchitha-nandikonda/agile-hrms'
  };
  
  const url = codeUrls[projectId];
  if (url) {
    // For now, show a message instead of opening external URL
    showNotification('Code repository would open: ' + url, 'info');
  } else {
    showNotification('Code repository coming soon!', 'info');
  }
}

// Enhanced notification system
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    font-family: 'Chillax', sans-serif;
    font-size: 0.875rem;
    z-index: 1001;
    animation: slideInRight 0.3s ease-out;
    max-width: 300px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  `;
  
  // Style based on type
  if (type === 'info') {
    notification.style.background = '#dbeafe';
    notification.style.color = '#1e40af';
    notification.style.border = '1px solid #93c5fd';
  } else if (type === 'success') {
    notification.style.background = '#dcfce7';
    notification.style.color = '#166534';
    notification.style.border = '1px solid #bbf7d0';
  }
  
  notification.textContent = message;
  
  // Add animation styles if not already added
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add to page
  document.body.appendChild(notification);
  
  // Remove after 4 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideInRight 0.3s ease-out reverse';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 4000);
}
// Initialize the portfolio application
document.addEventListener('DOMContentLoaded', () => {
  window.portfolioApp = new PortfolioApp();
});

// Make it available globally
window.PortfolioApp = PortfolioApp;




