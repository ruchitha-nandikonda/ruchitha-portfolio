/* 
   Animations JavaScript
   This file handles scroll animations, hover effects, and interactive animations
*/

class AnimationManager {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.observer = null;
    this.animatedElements = [];
    
    this.init();
  }

  // Initialize animation system
  init() {
    this.setupIntersectionObserver();
    this.setupScrollAnimations();
    this.setupHoverAnimations();
    this.setupFloatingElements();
  }

  // Set up intersection observer for scroll animations
  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateElement(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      }, this.observerOptions);
      
      // Observe elements that should animate on scroll
      this.observeElements();
    }
  }

  // Find and observe elements for scroll animations
  observeElements() {
    const elementsToAnimate = document.querySelectorAll(`
      .project-card,
      .progress-card,
      .principle-card,
      .timeline-item,
      .about-image,
      .about-text,
      .contact-form,
      .info-card,
      .hero-title,
      .hero-description,
      .section-title
    `);
    
    elementsToAnimate.forEach((element, index) => {
      // Add animation delay based on element index
      element.style.setProperty('--animation-delay', `${index * 0.1}s`);
      
      // Add initial state
      element.classList.add('animate-on-scroll');
      
      // Observe the element
      if (this.observer) {
        this.observer.observe(element);
      }
    });
  }

  // Animate an element when it comes into view
  animateElement(element) {
    element.classList.add('animated');
    
    // Add specific animation classes based on element type
    if (element.classList.contains('project-card')) {
      this.animateProjectCard(element);
    } else if (element.classList.contains('hero-title')) {
      this.animateHeroTitle(element);
    } else if (element.classList.contains('timeline-item')) {
      this.animateTimelineItem(element);
    }
  }

  // Animate project cards with stagger effect
  animateProjectCard(card) {
    card.style.animation = 'fadeInUp 0.6s ease-out forwards';
    card.style.animationDelay = card.style.getPropertyValue('--animation-delay');
  }

  // Animate hero title with typewriter effect
  animateHeroTitle(title) {
    const greeting = title.querySelector('.hero-greeting');
    const subtitle = title.querySelector('.hero-subtitle');
    
    if (greeting) {
      greeting.style.animation = 'fadeInUp 0.8s ease-out forwards';
    }
    
    if (subtitle) {
      subtitle.style.animation = 'fadeInUp 0.8s ease-out 0.3s forwards';
    }
  }

  // Animate timeline items
  animateTimelineItem(item) {
    item.style.animation = 'slideInLeft 0.6s ease-out forwards';
    item.style.animationDelay = item.style.getPropertyValue('--animation-delay');
  }

  // Set up scroll-based animations
  setupScrollAnimations() {
    // Parallax effect for floating stars
    const floatingStars = document.querySelectorAll('.floating-star');
    
    if (floatingStars.length > 0) {
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        floatingStars.forEach((star, index) => {
          const speed = 0.5 + (index * 0.2);
          const yPos = -(scrollY * speed);
          star.style.transform = `translateY(${yPos}px)`;
        });
      });
    }
  }

  // Set up hover animations
  setupHoverAnimations() {
    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        this.animateCardHover(card, true);
      });
      
      card.addEventListener('mouseleave', () => {
        this.animateCardHover(card, false);
      });
    });

    // Button hover effects
    const buttons = document.querySelectorAll('button, .resume-btn');
    buttons.forEach(button => {
      button.addEventListener('mouseenter', () => {
        this.animateButtonHover(button, true);
      });
      
      button.addEventListener('mouseleave', () => {
        this.animateButtonHover(button, false);
      });
    });
  }

  // Animate card hover effects
  animateCardHover(card, isHovering) {
    const image = card.querySelector('img');
    
    if (isHovering) {
      card.style.transform = 'translateY(-8px)';
      if (image) {
        image.style.transform = 'scale(1.05)';
      }
    } else {
      card.style.transform = 'translateY(0)';
      if (image) {
        image.style.transform = 'scale(1)';
      }
    }
  }

  // Animate button hover effects
  animateButtonHover(button, isHovering) {
    if (isHovering) {
      button.style.transform = 'translateY(-2px)';
    } else {
      button.style.transform = 'translateY(0)';
    }
  }

  // Set up floating elements animation
  setupFloatingElements() {
    const floatingElements = document.querySelectorAll('.floating-star');
    
    floatingElements.forEach((element, index) => {
      // Add random animation delay
      const delay = Math.random() * 2;
      element.style.animationDelay = `${delay}s`;
      
      // Add slight random movement
      setInterval(() => {
        if (!document.hidden) {
          const randomX = (Math.random() - 0.5) * 10;
          const randomY = (Math.random() - 0.5) * 10;
          
          element.style.transform += ` translate(${randomX}px, ${randomY}px)`;
          
          // Reset position after animation
          setTimeout(() => {
            element.style.transform = element.style.transform.replace(/translate\([^)]*\)/g, '');
          }, 2000);
        }
      }, 5000 + (index * 1000));
    });
  }

  // Utility function to add CSS animations
  addKeyframes() {
    const style = document.createElement('style');
    style.textContent = `
      .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
      }
      
      .animate-on-scroll.animated {
        opacity: 1;
        transform: translateY(0);
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideInLeft {
        from {
          opacity: 0;
          transform: translateX(-30px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      @keyframes pulse {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
      
      @keyframes float {
        0%, 100% {
          transform: translateY(0px) rotate(0deg);
        }
        50% {
          transform: translateY(-10px) rotate(5deg);
        }
      }
    `;
    
    document.head.appendChild(style);
  }

  // Handle reduced motion preferences
  handleReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Disable animations for users who prefer reduced motion
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
    }
  }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.animationManager = new AnimationManager();
  window.animationManager.addKeyframes();
  window.animationManager.handleReducedMotion();
});

// Make it available globally
window.AnimationManager = AnimationManager;