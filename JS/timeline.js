/* 
   Timeline JavaScript
   This file handles the interactive timeline functionality on the about page
*/

class TimelineManager {
  constructor() {
    this.timelineItems = [];
    this.activeItem = null;
    this.modal = null;
    
    this.init();
  }

  // Initialize timeline functionality
  init() {
    this.setupModal();
    this.setupTimelineItems();
    this.setupKeyboardNavigation();
    this.setupClickHandlers();
  }

  // Set up modal
  setupModal() {
    this.modal = document.getElementById('experience-modal');
    if (!this.modal) return;

    // Set up modal close button
    const closeBtn = this.modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Set up backdrop click to close
    const backdrop = this.modal.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Set up escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.closeModal();
      }
    });
  }

  // Set up timeline items
  setupTimelineItems() {
    this.timelineItems = document.querySelectorAll('.timeline-item');
    
    if (this.timelineItems.length === 0) {
      return; // No timeline on this page
    }

    // Set up each timeline item
    this.timelineItems.forEach((item, index) => {
      const pill = item.querySelector('.timeline-pill');
      
      if (pill) {
        // Add accessibility attributes
        pill.setAttribute('role', 'button');
        pill.setAttribute('tabindex', '0');
        pill.setAttribute('aria-expanded', 'false');
        
        // Add click event listener to toggle details
        pill.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleDetails(item);
        });
        
        // Add hover to show details
        item.addEventListener('mouseenter', () => {
          item.classList.add('active');
          const pill = item.querySelector('.timeline-pill');
          if (pill) {
            pill.setAttribute('aria-expanded', 'true');
          }
        });
        
        // Keep details visible on hover, hide on mouse leave (unless clicked)
        item.addEventListener('mouseleave', () => {
          // Only hide if not explicitly clicked
          if (!item.classList.contains('clicked')) {
            item.classList.remove('active');
            const pill = item.querySelector('.timeline-pill');
            if (pill) {
              pill.setAttribute('aria-expanded', 'false');
            }
          }
        });
        
        // Add keyboard event listener
        pill.addEventListener('keydown', (e) => {
          this.handleKeyboardInteraction(e, item);
        });
      }
    });
  }

  // Show modal with experience details
  showModal(item) {
    if (!this.modal) return;

    const pill = item.querySelector('.timeline-pill');
    const details = item.querySelector('.timeline-details');
    
    if (!pill || !details) return;

    // Extract data from the timeline item
    const company = pill.querySelector('.company')?.textContent || '';
    const role = pill.querySelector('.role')?.textContent || '';
    const period = pill.querySelector('.period')?.textContent || '';
    const location = pill.querySelector('.location')?.textContent || '';
    const detailItems = details.querySelectorAll('.detail-list li');

    // Populate modal content
    this.populateModal(company, role, period, location, detailItems);

    // Show modal
    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    
    // Focus the close button for accessibility
    const closeBtn = this.modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.focus();
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    this.activeItem = item;
  }

  // Populate modal with experience data
  populateModal(company, role, period, location, detailItems) {
    const modalTitle = this.modal.querySelector('#modal-title');
    const modalCompany = this.modal.querySelector('.modal-company');
    const modalRole = this.modal.querySelector('.modal-role');
    const modalPeriod = this.modal.querySelector('.modal-period');
    const modalLocation = this.modal.querySelector('.modal-location');
    const modalDetails = this.modal.querySelector('.modal-details');

    if (modalTitle) modalTitle.textContent = company;
    if (modalCompany) modalCompany.textContent = company;
    if (modalRole) modalRole.textContent = role;
    if (modalPeriod) modalPeriod.textContent = period;
    if (modalLocation) modalLocation.textContent = location;

    if (modalDetails) {
      modalDetails.innerHTML = '';
      detailItems.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item.textContent;
        modalDetails.appendChild(li);
      });
    }
  }

  // Close modal
  closeModal() {
    if (!this.modal) return;

    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');
    
    // Restore body scroll
    document.body.style.overflow = '';

    this.activeItem = null;
  }


  // Toggle details visibility
  toggleDetails(item) {
    const isActive = item.classList.contains('active');
    const pill = item.querySelector('.timeline-pill');
    
    // Remove clicked class from all items
    this.timelineItems.forEach(i => i.classList.remove('clicked'));
    
    if (isActive) {
      item.classList.remove('active');
      item.classList.remove('clicked');
      if (pill) {
        pill.setAttribute('aria-expanded', 'false');
      }
    } else {
      // Close other items
      this.timelineItems.forEach(i => {
        i.classList.remove('active');
        i.classList.remove('clicked');
      });
      item.classList.add('active');
      item.classList.add('clicked');
      if (pill) {
        pill.setAttribute('aria-expanded', 'true');
      }
    }
  }

  // Handle keyboard interactions
  handleKeyboardInteraction(e, item) {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        this.toggleDetails(item);
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        this.focusNextItem(item);
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        this.focusPreviousItem(item);
        break;
        
      case 'Home':
        e.preventDefault();
        this.focusFirstItem();
        break;
        
      case 'End':
        e.preventDefault();
        this.focusLastItem();
        break;
    }
  }

  // Set up keyboard navigation
  setupKeyboardNavigation() {
    // This method is kept for future keyboard navigation enhancements
    // The modal escape key handling is now in setupModal()
  }

  // Set up click handlers
  setupClickHandlers() {
    // This method is kept for future click handling enhancements
    // Modal click handling is now in setupModal()
  }

  // Focus next timeline item
  focusNextItem(currentItem) {
    const currentIndex = Array.from(this.timelineItems).indexOf(currentItem);
    const nextIndex = (currentIndex + 1) % this.timelineItems.length;
    const nextPill = this.timelineItems[nextIndex].querySelector('.timeline-pill');
    
    if (nextPill) {
      nextPill.focus();
    }
  }

  // Focus previous timeline item
  focusPreviousItem(currentItem) {
    const currentIndex = Array.from(this.timelineItems).indexOf(currentItem);
    const prevIndex = (currentIndex - 1 + this.timelineItems.length) % this.timelineItems.length;
    const prevPill = this.timelineItems[prevIndex].querySelector('.timeline-pill');
    
    if (prevPill) {
      prevPill.focus();
    }
  }

  // Focus first timeline item
  focusFirstItem() {
    const firstPill = this.timelineItems[0]?.querySelector('.timeline-pill');
    if (firstPill) {
      firstPill.focus();
    }
  }

  // Focus last timeline item
  focusLastItem() {
    const lastPill = this.timelineItems[this.timelineItems.length - 1]?.querySelector('.timeline-pill');
    if (lastPill) {
      lastPill.focus();
    }
  }


  // Add CSS for timeline animations
  addTimelineStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .timeline-pill {
        transition: all 0.3s ease;
      }
      
      .timeline-pill:hover {
        transform: scale(1.02);
      }
      
      .timeline-pill:focus {
        outline: 2px solid var(--color-primary-400);
        outline-offset: 2px;
      }
      
      .current-indicator {
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
}

// Initialize timeline when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.timelineManager = new TimelineManager();
  window.timelineManager.addTimelineStyles();
});

// Make it available globally
window.TimelineManager = TimelineManager;