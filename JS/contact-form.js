/* 
   Contact Form JavaScript
   This file handles form validation, submission, and user feedback
*/

class ContactFormManager {
  constructor() {
    this.form = null;
    this.formFields = {};
    this.isSubmitting = false;
    
    this.init();
  }

  // Initialize contact form functionality
  init() {
    this.setupForm();
    this.setupValidation();
    this.setupSubmission();
  }

  // Set up form elements
  setupForm() {
    this.form = document.getElementById('contactForm');
    
    if (!this.form) {
      return; // No contact form on this page
    }

    // Get form fields
    this.formFields = {
      name: this.form.querySelector('#name'),
      email: this.form.querySelector('#email'),
      message: this.form.querySelector('#message'),
      submit: this.form.querySelector('.form-submit')
    };

    // Add form field event listeners
    Object.values(this.formFields).forEach(field => {
      if (field && field !== this.formFields.submit) {
        field.addEventListener('blur', () => this.validateField(field));
        field.addEventListener('input', () => this.clearFieldError(field));
      }
    });
  }

  // Set up form validation
  setupValidation() {
    if (!this.form) return;

    // Prevent default form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmission();
    });

    // Real-time validation
    if (this.formFields.email) {
      this.formFields.email.addEventListener('input', () => {
        this.validateEmail(this.formFields.email);
      });
    }

    if (this.formFields.name) {
      this.formFields.name.addEventListener('input', () => {
        this.validateName(this.formFields.name);
      });
    }

    if (this.formFields.message) {
      this.formFields.message.addEventListener('input', () => {
        this.validateMessage(this.formFields.message);
      });
    }
  }

  // Set up form submission
  setupSubmission() {
    if (!this.form) return;

    // Handle form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmission();
    });
  }

  // Validate individual field
  validateField(field) {
    if (!field) return true;

    const fieldName = field.name;
    let isValid = true;

    switch (fieldName) {
      case 'name':
        isValid = this.validateName(field);
        break;
      case 'email':
        isValid = this.validateEmail(field);
        break;
      case 'message':
        isValid = this.validateMessage(field);
        break;
    }

    return isValid;
  }

  // Validate name field
  validateName(field) {
    const value = field.value.trim();
    
    if (value.length < 2) {
      this.showFieldError(field, 'Name must be at least 2 characters long');
      return false;
    }
    
    if (value.length > 50) {
      this.showFieldError(field, 'Name must be less than 50 characters');
      return false;
    }
    
    this.clearFieldError(field);
    return true;
  }

  // Validate email field
  validateEmail(field) {
    const value = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(value)) {
      this.showFieldError(field, 'Please enter a valid email address');
      return false;
    }
    
    this.clearFieldError(field);
    return true;
  }

  // Validate message field
  validateMessage(field) {
    const value = field.value.trim();
    
    if (value.length < 10) {
      this.showFieldError(field, 'Message must be at least 10 characters long');
      return false;
    }
    
    if (value.length > 1000) {
      this.showFieldError(field, 'Message must be less than 1000 characters');
      return false;
    }
    
    this.clearFieldError(field);
    return true;
  }

  // Show field error
  showFieldError(field, message) {
    // Remove existing error
    this.clearFieldError(field);
    
    // Add error class
    field.classList.add('error');
    
    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    // Insert error message after field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
  }

  // Clear field error
  clearFieldError(field) {
    field.classList.remove('error');
    
    // Remove error message
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  // Validate entire form
  validateForm() {
    let isValid = true;
    
    // Validate all fields
    Object.values(this.formFields).forEach(field => {
      if (field && field !== this.formFields.submit) {
        if (!this.validateField(field)) {
          isValid = false;
        }
      }
    });
    
    return isValid;
  }

  // Handle form submission
  async handleSubmission() {
    if (this.isSubmitting) return;
    
    // Validate form
    if (!this.validateForm()) {
      this.showFormMessage('Please fix the errors above', 'error');
      return;
    }
    
    this.isSubmitting = true;
    this.setSubmitButtonState(true);
    
    try {
      // Get form data
      const formData = this.getFormData();
      
      // Create mailto link (since we don't have a backend)
      const subject = `Hello from ${formData.name}`;
      const body = `${formData.message}\n\nBest regards,\n${formData.name}\n${formData.email}`;
      const mailtoUrl = `mailto:ruchithajobit@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open email client
      window.location.href = mailtoUrl;
      
      // Show success message
      this.showFormMessage('Thank you! Your email client should open now.', 'success');
      
      // Reset form
      this.resetForm();
      
    } catch (error) {
      console.error('Form submission error:', error);
      this.showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
      this.isSubmitting = false;
      this.setSubmitButtonState(false);
    }
  }

  // Get form data
  getFormData() {
    return {
      name: this.formFields.name?.value.trim() || '',
      email: this.formFields.email?.value.trim() || '',
      message: this.formFields.message?.value.trim() || ''
    };
  }

  // Set submit button state
  setSubmitButtonState(isLoading) {
    const submitButton = this.formFields.submit;
    if (!submitButton) return;
    
    if (isLoading) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="submit-icon">⏳</span>Sending...';
    } else {
      submitButton.disabled = false;
      submitButton.innerHTML = '<span class="submit-icon">📤</span>Send message';
    }
  }

  // Show form message
  showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = this.form.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Insert message after submit button
    const submitButton = this.formFields.submit;
    submitButton.parentNode.insertBefore(messageElement, submitButton.nextSibling);
    
    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        if (messageElement.parentNode) {
          messageElement.remove();
        }
      }, 5000);
    }
  }

  // Reset form
  resetForm() {
    if (this.form) {
      this.form.reset();
      
      // Clear any remaining errors
      Object.values(this.formFields).forEach(field => {
        if (field && field !== this.formFields.submit) {
          this.clearFieldError(field);
        }
      });
    }
  }

  // Add form styles
  addFormStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .form-input.error,
      .form-textarea.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }
      
      .field-error {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        font-family: var(--font-chillax);
      }
      
      .form-message {
        margin-top: 1rem;
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        font-family: var(--font-chillax);
        font-size: 0.875rem;
      }
      
      .form-message.success {
        background: #dcfce7;
        color: #166534;
        border: 1px solid #bbf7d0;
      }
      
      .form-message.error {
        background: #fef2f2;
        color: #dc2626;
        border: 1px solid #fecaca;
      }
      
      [data-theme="dark"] .form-message.success {
        background: #064e3b;
        color: #6ee7b7;
        border-color: #047857;
      }
      
      [data-theme="dark"] .form-message.error {
        background: #7f1d1d;
        color: #fca5a5;
        border-color: #dc2626;
      }
      
      [data-theme="dark"] .field-error {
        color: #fca5a5;
      }
    `;
    
    document.head.appendChild(style);
  }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.contactFormManager = new ContactFormManager();
  window.contactFormManager.addFormStyles();
  
  // Initialize resume download functionality
  initResumeDownload();
});

// Resume download functionality
function initResumeDownload() {
  const resumeBtn = document.getElementById('resumeDownloadBtn');
  
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      // Add loading state
      const originalContent = resumeBtn.innerHTML;
      resumeBtn.innerHTML = '<span class="download-icon">⏳</span>Downloading...';
      resumeBtn.disabled = true;
      
      // Download resume PDF
      const resumeUrl = '/Ruchitha Nandikonda.pdf';
      const link = document.createElement('a');
      link.href = resumeUrl;
      link.download = 'Ruchitha Nandikonda.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Reset button state
      setTimeout(() => {
        resumeBtn.innerHTML = originalContent;
        resumeBtn.disabled = false;
      }, 500);
    });
  }
}

// Make it available globally
window.ContactFormManager = ContactFormManager;