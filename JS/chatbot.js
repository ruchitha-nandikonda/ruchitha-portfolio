// Chatbot Contact Section JavaScript

class ChatbotContact {
  constructor() {
    this.overlay = document.getElementById('chatbotOverlay');
    this.container = document.getElementById('chatbotContainer');
    this.messagesContainer = document.getElementById('chatbotMessages');
    this.optionsContainer = document.getElementById('chatbotOptions');
    this.closeBtn = document.getElementById('chatbotClose');
    
    this.conversationState = 'initial';
    this.email = 'ruchithajobit@gmail.com';
    
    this.init();
  }
  
  init() {
    this.bindEvents();
    this.resetConversation();
  }
  
  bindEvents() {
    // Chatbot trigger button (only on contact page)
    const triggerBtn = document.getElementById('chatbotTriggerBtn');
    if (triggerBtn) {
      triggerBtn.addEventListener('click', () => {
        this.showChatbot();
      });
    }
    
    // Close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        this.hideChatbot();
      });
    }
    
    // Overlay click to close
    if (this.overlay) {
      this.overlay.addEventListener('click', (e) => {
        if (e.target === this.overlay) {
          this.hideChatbot();
        }
      });
    }
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
        this.hideChatbot();
      }
    });
    
    // Option button clicks (legacy support)
    this.optionsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('option-btn')) {
        const option = e.target.getAttribute('data-option');
        this.handleOptionClick(option, e.target.textContent);
      }
    });

    // Message option clicks
    this.messagesContainer.addEventListener('click', (e) => {
      const optionContent = e.target.closest('.option-content');
      if (optionContent) {
        const option = optionContent.getAttribute('data-option');
        const text = optionContent.querySelector('p').textContent;
        
        // Remove all option messages
        this.removeOptionMessages();
        
        this.handleOptionClick(option, text);
      }
    });
  }
  
  showChatbot() {
    this.overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.scrollToBottom();
  }
  
  hideChatbot() {
    this.overlay.classList.remove('active');
    document.body.style.overflow = '';
    // Reset the conversation when chatbot is closed
    this.resetConversation();
  }
  
  resetConversation() {
    this.conversationState = 'initial';
    this.messagesContainer.innerHTML = `
      <div class="message bot-message">
        <div class="message-content">
          <p>Hey!</p>
        </div>
      </div>
      <div class="message bot-message">
        <div class="message-content">
          <p>I'm Ruchitha's Assistant. I'm here to help you connect with Ruchitha.</p>
        </div>
      </div>
      <div class="message bot-message">
        <div class="message-content">
          <p>How can I help you today?</p>
        </div>
      </div>
    `;
    this.showOptions(['hello', 'connect', 'hire', 'Download resume']);
  }
  
  handleOptionClick(option, buttonText) {
    // Add user message
    this.addUserMessage(buttonText);
    
    // Remove all option messages
    this.removeOptionMessages();
    
    // Disable all buttons temporarily
    this.disableAllButtons();
    
    // Handle the conversation flow
    setTimeout(() => {
      this.processOption(option);
    }, 500);
  }
  
  addUserMessage(text) {
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.innerHTML = `
      <div class="message-content">
        <p>${text}</p>
      </div>
    `;
    this.messagesContainer.appendChild(userMessage);
    this.scrollToBottom();
  }
  
  addBotMessage(messages, options = null) {
    if (Array.isArray(messages)) {
      // Create separate message bubbles for each text
      messages.forEach((msg, index) => {
        setTimeout(() => {
          const botMessage = document.createElement('div');
          botMessage.className = 'message bot-message';
          botMessage.innerHTML = `
            <div class="message-content">
              <p>${msg}</p>
            </div>
          `;
          this.messagesContainer.appendChild(botMessage);
          this.scrollToBottom();
          
          // Show options after the last message
          if (index === messages.length - 1 && options) {
            setTimeout(() => {
              this.showOptions(options);
            }, 300);
          }
        }, index * 500); // Delay each message by 500ms
      });
    } else {
      // Single message
      const botMessage = document.createElement('div');
      botMessage.className = 'message bot-message';
      botMessage.innerHTML = `
        <div class="message-content">
          <p>${messages}</p>
        </div>
      `;
      
      this.messagesContainer.appendChild(botMessage);
      this.scrollToBottom();
      
      if (options) {
        setTimeout(() => {
          this.showOptions(options);
        }, 300);
      }
    }
  }
  
  showOptions(options) {
    // Clear the options container (hide it)
    this.optionsContainer.innerHTML = '';
    this.optionsContainer.style.display = 'none';
    
    // Add interactive message options to the chat
    this.addMessageOptions(options);
  }

  addMessageOptions(options) {
    // First, remove any existing option messages to prevent duplicates
    this.removeOptionMessages();
    
    const optionConfigs = {
      hello: 'Just saying hello!',
      connect: 'Want to connect with Ruchitha',
      hire: 'We\'d like to hire you',
      'send-message': 'Send a message',
      'other-options': 'Other options?',
      'back-to-main': 'Back to main menu'
    };
    
    // Add a small delay before showing options
    setTimeout(() => {
      options.forEach((option, index) => {
        setTimeout(() => {
          const optionMessage = document.createElement('div');
          optionMessage.className = 'message option-message';
          optionMessage.innerHTML = `
            <div class="message-content option-content" data-option="${option}">
              <p>${optionConfigs[option] || option}</p>
            </div>
          `;
          this.messagesContainer.appendChild(optionMessage);
          this.scrollToBottom();
        }, index * 200); // Small delay between options
      });
    }, 300);
  }
  
  disableAllButtons() {
    const buttons = this.optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.disabled = true);
  }

  removeOptionMessages() {
    const optionMessages = this.messagesContainer.querySelectorAll('.option-message');
    optionMessages.forEach(msg => msg.remove());
  }
  
  processOption(option) {
    switch (this.conversationState) {
      case 'initial':
        this.handleInitialOptions(option);
        break;
      case 'connect':
        this.handleConnectOptions(option);
        break;
      case 'hire':
        this.handleHireOptions(option);
        break;
    }
  }
  
  handleInitialOptions(option) {
    switch (option) {
      case 'hello':
        this.conversationState = 'initial';
        this.addBotMessage([
          'Hello!',
          'Thanks for saying hi 😁',
          'I hope you\'ve enjoyed browsing my work.',
          'Can I help you with anything else?'
        ], ['connect', 'hire']);
        break;
        
      case 'connect':
        this.conversationState = 'connect';
        this.addBotMessage([
          'Ok, great!',
          'Exciting times 🕺',
          'Here are my details'
        ], ['send-message', 'other-options']);
        break;
        
      case 'hire':
        this.conversationState = 'hire';
        this.addBotMessage([
          'Ok, great!',
          'Exciting times 🕺',
          `You can reach out to me at my mail, and I will get back to you within 24 hours.`
        ], ['hello', 'connect']);
        break;
        
      case 'download resume':
        this.addBotMessage([
          'Great choice!',
          'Here\'s my resume for you to download 📄'
        ]);
        // Create a download link
        setTimeout(() => {
          const downloadMessage = document.createElement('div');
          downloadMessage.className = 'message bot-message';
          downloadMessage.innerHTML = `
            <div class="message-content">
              <p><a href="/Ruchitha Nandikonda.pdf" download="Ruchitha Nandikonda.pdf" style="color: var(--color-purple-700); text-decoration: underline;">📥 Download Resume</a></p>
            </div>
          `;
          this.messagesContainer.appendChild(downloadMessage);
          this.scrollToBottom();
          
          // Show options after download link
          setTimeout(() => {
            this.showOptions(['hello', 'connect', 'hire']);
          }, 500);
        }, 1000);
        break;
    }
  }
  
  handleConnectOptions(option) {
    switch (option) {
      case 'send-message':
        this.addBotMessage('Opening your email client now!');
        setTimeout(() => {
          window.location.href = `mailto:${this.email}`;
        }, 1000);
        setTimeout(() => {
          this.addBotMessage('Is there anything else I can help you with?', ['hello', 'hire']);
        }, 2000);
        break;
        
      case 'other-options':
        this.conversationState = 'initial';
        this.addBotMessage('Sure! What else can I help you with?', ['hello', 'hire']);
        break;
    }
  }
  
  handleHireOptions(option) {
    switch (option) {
      case 'hello':
        this.conversationState = 'initial';
        this.addBotMessage([
          'Hello!',
          'Thanks for saying hi 😁',
          'I hope you\'ve enjoyed browsing my work.',
          'Can I help you with anything else?'
        ], ['connect', 'hire']);
        break;
        
      case 'connect':
        this.conversationState = 'connect';
        this.addBotMessage([
          'Ok, great!',
          'Exciting times 🕺',
          'Here are my details'
        ], ['send-message', 'other-options']);
        break;
    }
  }
  
  scrollToBottom() {
    setTimeout(() => {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }, 100);
  }
}

// Prevent multiple initializations
let chatbotInitialized = false;

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (!chatbotInitialized) {
    new ChatbotContact();
    chatbotInitialized = true;
  }
});

// Also initialize if DOM is already loaded (for dynamic content)
if (document.readyState === 'loading') {
  // DOM is still loading, the event listener above will handle initialization
} else {
  // DOM is already loaded, initialize immediately
  if (!chatbotInitialized) {
    new ChatbotContact();
    chatbotInitialized = true;
  }
}
