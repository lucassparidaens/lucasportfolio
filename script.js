// ===================================
// LUCAS AI PORTFOLIO - SCRIPT
// Vanilla JavaScript for all interactions
// ===================================

// Content Data removed - skills now handled by static HTML

const CHATBOT_RESPONSES = {
  greeting: [
    "Hi there! I'm Lucas's AI assistant. I can help you learn about his experience, projects, and skills.",
    "Hello! I'm here to help you discover what Lucas can do for your project.",
    "Hey! Feel free to ask me anything about Lucas's background and expertise."
  ],
  experience: [
    "Lucas has 7+ years of experience combining marketing and web development. He spent 3 years as a marketing specialist before becoming an independent web developer and marketing consultant for the past 4 years.",
    "With a background in MBO 4 Marketing & Communication, Lucas bridges the gap between technical development and marketing strategy."
  ],
  projects: [
    "Lucas has worked on diverse projects including Gamestoelen.nl (e-commerce), Pettech.nl (tech solutions), Getdjoice.com (SaaS platform), and mobile apps like Dakkie.",
    "His portfolio spans e-commerce platforms, content marketing campaigns, and innovative tech solutions across various industries."
  ],
  skills: [
    "Lucas specializes in web development (HTML, CSS, JavaScript, Shopify, Magento), marketing automation (Klaviyo, Meta Ads, Google Ads), and AI tools (ChatGPT, Claude, Cursor).",
    "He's also skilled in design (Figma, Photoshop), logistics optimization, and building professional chatbots."
  ],
  contact: [
    "You can reach Lucas through the contact form on this page. He typically responds within 24 hours and is available for remote, hybrid, or on-site work.",
    "Lucas is based in Tilburg and is immediately available for new projects. Just fill out the contact form below!"
  ],
  location: [
    "Lucas is based in Tilburg, Netherlands. He's fluent in Dutch and English, with basic Spanish skills.",
    "Being in Tilburg puts Lucas in the heart of the Netherlands, easily accessible for projects throughout the country."
  ],
  fun: [
    "When Lucas isn't coding, you'll find him in the gym, practicing MMA/BJJ/kickboxing, or watching football. He's passionate about health and fitness!",
    "Lucas loves exploring new AI tools and techniques, always staying on the cutting edge of technology."
  ],
  easter: [
    "🎉 You found the easter egg! Lucas loves adding fun interactions to his projects. Check out the confetti button in the Fun section!",
    "🥚 Easter egg activated! Lucas believes great websites should be both functional AND fun!"
  ],
  default: [
    "That's an interesting question! Could you be more specific about what you'd like to know about Lucas?",
    "I'd love to help! Try asking about Lucas's experience, projects, skills, or how to contact him.",
    "You can also use the quick prompts on the right to get started!"
  ]
};

// Application State
let isTyping = false;

// DOM Elements Cache
const domElements = {
  // Navigation
  navPills: document.querySelectorAll('.nav-pills__item'),
  navbarToggle: document.getElementById('navbar-toggle'),
  navbarMenu: document.getElementById('navbar-menu'),
  navbarLinks: document.querySelectorAll('.navbar__link'),
  
  // Scroll Text Effect
  scrollText: document.getElementById('scroll-text'),
  scrollTextWords: document.querySelectorAll('.scroll-text__word'),
  
  // Spline
  splineOverlay: document.querySelector('.spline-click-overlay'),
  

  
  // Chatbot
  chatInput: document.getElementById('chatbot-input'),
  chatSend: document.getElementById('chatbot-send'),
  chatMessages: document.getElementById('chatbot-messages'),
  quickPrompts: document.querySelectorAll('.quick-prompt'),
  heroChatInput: document.querySelector('.chat-input__field'),
  heroChatBtn: document.querySelector('.chat-input__btn'),
  
  // Contact
  contactForm: document.getElementById('contact-form'),
  
  // Modal
  modal: document.getElementById('about-modal'),
  modalClose: document.querySelector('.modal__close'),
  modalBackdrop: document.querySelector('.modal__backdrop'),
  
  // Fun
  confettiBtn: document.getElementById('confetti-btn'),
  waveBtn: document.getElementById('wave-btn'),
  
  // Theme
  densityToggle: document.getElementById('density-toggle'),
  
  // Footer Chat
  footerChatInput: document.getElementById('footer-chat-input'),
  footerSendBtn: document.getElementById('footer-send-btn'),
  footerChatMessages: document.getElementById('footer-chat-messages'),
  footerQuickActions: document.getElementById('footer-quick-actions'),
  footerTyping: document.getElementById('footer-typing'),
  footerQuickBtns: document.querySelectorAll('.footer__quick-btn'),
  
  // Hero CTA Buttons
  heroCTAPrimary: document.querySelector('.hero__cta-primary'),
  heroCTASecondary: document.querySelector('.hero__cta-secondary'),
  
  // Partners Animation
  partnersContainer: document.querySelector('.partners__animation-container'),
  partnersRows: document.querySelectorAll('.partners__row'),
  
  // Skills Book
  skillsBook: document.querySelector('.menu-book'),
  bookPages: document.querySelectorAll('.book-page'),
  prevPageBtn: document.getElementById('prevPage'),
  nextPageBtn: document.getElementById('nextPage'),
  currentPageSpan: document.querySelector('.current-page'),
  totalPagesSpan: document.querySelector('.total-pages')
};

// Utility Functions
const utils = {
  // Enhanced smooth scroll to element
  scrollToElement: (elementId) => {
    const element = document.getElementById(elementId.replace('#', ''));
    if (element) {
      // Dynamic header height based on screen size
      const isMobile = window.innerWidth <= 768;
      const headerHeight = isMobile ? 70 : 100;
      const elementPosition = element.offsetTop - headerHeight;
      
      // Enhanced smooth scrolling with custom easing
      const startPosition = window.pageYOffset;
      const distance = elementPosition - startPosition;
      const duration = Math.min(Math.abs(distance) * 0.5, 1000); // Dynamic duration, max 1s
      let start = null;

      function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Easing function (ease-out-cubic)
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        
        window.scrollTo(0, startPosition + distance * easeOutCubic);
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }
      
      // Fallback for browsers that don't support requestAnimationFrame
      if ('requestAnimationFrame' in window) {
        requestAnimationFrame(animation);
      } else {
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }
  },

  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Random element from array
  randomFromArray: (array) => {
    return array[Math.floor(Math.random() * array.length)];
  },

  // Animate element into view
  animateIn: (element) => {
    if (element && !element.classList.contains('animate-in')) {
      element.classList.add('animate-in');
    }
  },

  // Create confetti
  createConfetti: () => {
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 5000);
    }
  }
};

// Navigation Module
const Navigation = {
  init() {
    this.setupNavPills();
    this.setupActiveStates();
    this.setupHashNavigation();
    this.setupMobileMenu();
    this.setupNavbarLinks();
    this.setupHeroCTAs();
  },

  setupNavPills() {
    domElements.navPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const target = pill.getAttribute('href');
        
        // Update active state
        domElements.navPills.forEach(p => p.classList.remove('nav-pills__item--active'));
        pill.classList.add('nav-pills__item--active');
        
        // Scroll to section
        utils.scrollToElement(target);
        
        // Update URL hash
        history.pushState(null, null, target);
      });
    });
  },

  setupActiveStates() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const activeNavItem = document.querySelector(`[href="#${sectionId}"]`);
          
          if (activeNavItem) {
            domElements.navPills.forEach(pill => pill.classList.remove('nav-pills__item--active'));
            activeNavItem.classList.add('nav-pills__item--active');
          }
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -60% 0px'
    });

    // Observe all sections
    document.querySelectorAll('.section[id]').forEach(section => {
      observer.observe(section);
    });
  },

  setupHashNavigation() {
    // Handle initial hash
    if (window.location.hash) {
      setTimeout(() => {
        utils.scrollToElement(window.location.hash);
      }, 100);
    }

    // Handle back/forward navigation
    window.addEventListener('popstate', () => {
      if (window.location.hash) {
        utils.scrollToElement(window.location.hash);
      }
    });
  },

  setupMobileMenu() {
    if (domElements.navbarToggle && domElements.navbarMenu) {
      domElements.navbarToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar__container') && 
            domElements.navbarMenu.classList.contains('navbar__menu--open')) {
          this.closeMobileMenu();
        }
      });

      // Close menu on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && 
            domElements.navbarMenu.classList.contains('navbar__menu--open')) {
          this.closeMobileMenu();
        }
      });
    }
  },

  setupNavbarLinks() {
    domElements.navbarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        
        // Update active state
        this.updateActiveNavLink(link);
        
        // Close mobile menu if open
        this.closeMobileMenu();
        
        // Scroll to section
        utils.scrollToElement(target);
        
        // Update URL hash
        history.pushState(null, null, target);
      });
    });
  },

  toggleMobileMenu() {
    const isOpen = domElements.navbarMenu.classList.contains('navbar__menu--open');
    
    if (isOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  },

  openMobileMenu() {
    domElements.navbarMenu.classList.add('navbar__menu--open');
    domElements.navbarToggle.classList.add('navbar__toggle--active');
    domElements.navbarToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  },

  closeMobileMenu() {
    domElements.navbarMenu.classList.remove('navbar__menu--open');
    domElements.navbarToggle.classList.remove('navbar__toggle--active');
    domElements.navbarToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  },

  updateActiveNavLink(activeLink) {
    domElements.navbarLinks.forEach(link => {
      link.classList.remove('navbar__link--active');
    });
    activeLink.classList.add('navbar__link--active');
  },

  setupHeroCTAs() {
    // Setup primary CTA (Start een gesprek)
    if (domElements.heroCTAPrimary) {
      domElements.heroCTAPrimary.addEventListener('click', (e) => {
        e.preventDefault();
        utils.scrollToElement('.footer');
        
        // Focus the footer chat input after scrolling
        setTimeout(() => {
          if (domElements.footerChatInput) {
            domElements.footerChatInput.focus();
          }
        }, 800);
      });
    }

    // Setup secondary CTA (Bekijk mijn werk)
    if (domElements.heroCTASecondary) {
      domElements.heroCTASecondary.addEventListener('click', (e) => {
        e.preventDefault();
        utils.scrollToElement('#projects');
      });
    }
  }

};

// Spline Module
const Spline = {
  init() {
    this.setupClickInteraction();
  },

  setupClickInteraction() {
    if (domElements.splineOverlay) {
      domElements.splineOverlay.addEventListener('click', () => {
        Modal.open();
      });

      // Ensure spline viewer can't be interacted with
      document.addEventListener('DOMContentLoaded', () => {
        const splineViewer = document.querySelector('spline-viewer');
        if (splineViewer) {
          splineViewer.style.pointerEvents = 'none';
          
          // Disable specific spline interactions
          splineViewer.addEventListener('wheel', (e) => e.stopPropagation(), true);
          splineViewer.addEventListener('mousedown', (e) => e.stopPropagation(), true);
          splineViewer.addEventListener('mousemove', (e) => e.stopPropagation(), true);
          splineViewer.addEventListener('touchstart', (e) => e.stopPropagation(), true);
          splineViewer.addEventListener('touchmove', (e) => e.stopPropagation(), true);
        }
      });
    }
  }
};

// Scroll Text Effect Module
const ScrollTextEffect = {
  init() {
    this.setupScrollEffect();
  },

  setupScrollEffect() {
    if (!domElements.scrollText || !domElements.scrollTextWords.length) return;

    // Intersection Observer for when text comes into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.startScrollColorEffect();
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -20% 0px'
    });

    observer.observe(domElements.scrollText);

    // Add scroll listener for continuous effect with optimized throttling
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateScrollColors();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
  },

  startScrollColorEffect() {
    // Initial animation - reveal words one by one
    domElements.scrollTextWords.forEach((word, index) => {
      setTimeout(() => {
        word.classList.add('scroll-text__word--highlight');
        setTimeout(() => {
          word.classList.remove('scroll-text__word--highlight');
          word.classList.add('color-1');
        }, 200);
      }, index * 100);
    });
  },

  updateScrollColors() {
    if (!domElements.scrollText) return;

    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const textRect = domElements.scrollText.getBoundingClientRect();
    const textTop = textRect.top + scrollPosition;
    const textHeight = textRect.height;

    // Calculate progress through the text section
    const sectionStart = textTop - windowHeight;
    const sectionEnd = textTop + textHeight;
    const progress = Math.max(0, Math.min(1, (scrollPosition - sectionStart) / (sectionEnd - sectionStart)));

    // Update word colors based on scroll progress
    domElements.scrollTextWords.forEach((word, index) => {
      const wordProgress = progress * domElements.scrollTextWords.length;
      const wordIndex = index + 1;

      // Remove all color classes
      word.classList.remove('color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'scroll-text__word--active');

      if (wordProgress >= wordIndex) {
        // Fully revealed words
        word.classList.add('scroll-text__word--active');
      } else if (wordProgress >= wordIndex - 1) {
        // Words being revealed
        const intensity = Math.ceil((wordProgress - (wordIndex - 1)) * 5);
        word.classList.add(`color-${Math.max(1, intensity)}`);
      } else {
        // Not yet revealed words stay very light
        word.style.color = 'rgba(15, 23, 42, 0.1)';
      }
    });

    // Add special effects for different scroll positions
    if (progress > 0.8) {
      domElements.scrollText.style.transform = `scale(${1 + (progress - 0.8) * 0.1})`;
    } else {
      domElements.scrollText.style.transform = 'scale(1)';
    }
  }
};

// Skills Module removed - now using static HTML/CSS structure

// Chatbot Module
const Chatbot = {
  init() {
    this.setupInputHandlers();
    this.setupQuickPrompts();
    this.setupHeroChatInput();
    this.setupFooterChatInput();
  },

  setupInputHandlers() {
    if (domElements.chatInput) {
      domElements.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }

    if (domElements.chatSend) {
      domElements.chatSend.addEventListener('click', () => {
        this.sendMessage();
      });
    }
  },

  setupQuickPrompts() {
    domElements.quickPrompts.forEach(prompt => {
      prompt.addEventListener('click', () => {
        const message = prompt.dataset.prompt;
        domElements.chatInput.value = message;
        this.sendMessage();
      });
    });
  },

  setupHeroChatInput() {
    if (domElements.heroChatInput) {
      domElements.heroChatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const inputValue = domElements.heroChatInput.value;
          
          // Smooth scroll to footer AI section
          utils.scrollToElement('.footer');
          
          // Focus footer input with proper timing
          setTimeout(() => {
            if (domElements.footerChatInput) {
              domElements.footerChatInput.value = inputValue;
              domElements.footerChatInput.focus();
              domElements.heroChatInput.value = '';
            }
          }, 800);
        }
      });
    }

    if (domElements.heroChatBtn) {
      domElements.heroChatBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const inputValue = domElements.heroChatInput ? domElements.heroChatInput.value || '' : '';
        
        // Smooth scroll to footer AI section
        utils.scrollToElement('.footer');
        
        setTimeout(() => {
          if (domElements.footerChatInput) {
            domElements.footerChatInput.value = inputValue;
            domElements.footerChatInput.focus();
            if (domElements.heroChatInput) {
              domElements.heroChatInput.value = '';
            }
          }
        }, 800);
      });
    }
  },

  setupFooterChatInput() {
    // Setup input handlers
    if (domElements.footerChatInput) {
      domElements.footerChatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.sendFooterMessage();
        }
      });
    }

    if (domElements.footerSendBtn) {
      domElements.footerSendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.sendFooterMessage();
      });
    }

    // Setup quick action buttons
    if (domElements.footerQuickBtns) {
      domElements.footerQuickBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          const message = btn.getAttribute('data-message');
          if (message) {
            this.addUserMessage(message);
            this.handleAIResponse(message);
          }
        });
      });
    }
  },

  sendFooterMessage() {
    const message = domElements.footerChatInput.value.trim();
    if (!message) return;

    // Add user message
    this.addUserMessage(message);
    
    // Clear input
    domElements.footerChatInput.value = '';
    
    // Generate AI response
    this.handleAIResponse(message);
  },

  addUserMessage(message) {
    const messageHtml = `
      <div class="footer__message footer__message--user">
        <div class="footer__message-avatar">👤</div>
        <div class="footer__message-bubble">
          <p>${this.escapeHtml(message)}</p>
          <div class="footer__message-time">${this.getCurrentTime()}</div>
        </div>
      </div>
    `;
    
    domElements.footerChatMessages.insertAdjacentHTML('beforeend', messageHtml);
    this.scrollToBottom();
  },

  addAIMessage(message) {
    const messageHtml = `
      <div class="footer__message footer__message--ai">
        <div class="footer__message-avatar">🤖</div>
        <div class="footer__message-bubble">
          <p>${message}</p>
          <div class="footer__message-time">${this.getCurrentTime()}</div>
        </div>
      </div>
    `;
    
    domElements.footerChatMessages.insertAdjacentHTML('beforeend', messageHtml);
    this.scrollToBottom();
  },

  showTypingIndicator() {
    if (domElements.footerTyping) {
      domElements.footerTyping.style.display = 'flex';
      this.scrollToBottom();
    }
  },

  hideTypingIndicator() {
    if (domElements.footerTyping) {
      domElements.footerTyping.style.display = 'none';
    }
  },

  handleAIResponse(message) {
    // Show typing indicator
    this.showTypingIndicator();
    
    // Simulate thinking time
    const thinkingTime = Math.random() * 2000 + 1000; // 1-3 seconds
    
    setTimeout(() => {
      this.hideTypingIndicator();
      
      const response = this.generateAIResponse(message);
      this.addAIMessage(response);
    }, thinkingTime);
  },

  generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Advanced response system
    const responses = {
      // Experience & Background
      experience: [
        "Lucas heeft meer dan 7 jaar ervaring in web development en marketing! 🚀",
        "Hij begon 3 jaar geleden als marketing specialist en runde daarna 4 jaar zijn eigen web/app development en marketing consultancy.",
        "Van MBO Marketing & Communicatie tot zelfstandig ondernemer - een echte groeier! 📈"
      ],
      
      // Skills & Expertise  
      skills: [
        "Lucas is een echte veelzijdige developer! 💻",
        "**Web Development:** HTML, CSS, JavaScript, Shopify, Magento 1 & 2",
        "**Marketing:** Klaviyo, Meta Ads, Google Ads, TikTok Ads, SEO/Content",
        "**Design:** Figma, Photoshop, Illustrator, After Effects",
        "**AI & Tools:** ChatGPT, Claude, Cursor, Stitch",
        "**E-commerce:** Bol.com, Amazon, Mediamarkt Saturn expertise",
        "En hij spreekt vloeiend Nederlands, Engels en basis Spaans! 🌍"
      ],
      
      // Projects & Portfolio
      projects: [
        "Lucas heeft aan coole projecten gewerkt! 🎯",
        "**E-commerce Sites:** Gamestoelen.nl, Gamestoelenexpert.nl, Pettech.nl",
        "**Platforms:** Getdjoice.com, Freakygoodz.com",
        "**Brands:** Margriet, Dakkie",
        "Van concept tot live website - hij doet het allemaal! ⚡"
      ],
      
      // Contact & Collaboration
      contact: [
        "Super makkelijk om contact op te nemen! 📧",
        "Hij is direct beschikbaar voor nieuwe projecten en reageert binnen 24 uur.",
        "Werkt remote, hybrid of on-site - wat jij wilt!",
        "Scroll naar beneden voor het contactformulier of klik op de social links. 👇"
      ],
      
      // Personal & Interests
      personal: [
        "Lucas is niet alleen een techie! 🥋",
        "Hij woont in Tilburg en is gepassioneerd over MMA, BJJ, kickboksen en fitness.",
        "Ook een grote football fan en geïnteresseerd in healthcare en mental health.",
        "Oh, en hij heeft een rijbewijs - kan overal naartoe! 🚗"
      ],
      
      // Technical Deep Dive
      technical: [
        "Lucas is echt technisch onderlegd! 🔧",
        "Hij specialiseert zich in marketplace integraties (Bol.com, Amazon, Kaufland)",
        "Expert in marketing automation en chatbot development",
        "Ook ervaring met logistics, supply chain optimalisatie en Apple producten",
        "Van frontend tot backend, van marketing tot AI - hij snapt de hele stack! 🎯"
      ]
    };
    
    // Context-aware responses
    if (lowerMessage.includes('ervaring') || lowerMessage.includes('experience') || lowerMessage.includes('achtergrond')) {
      return this.formatResponse(responses.experience);
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('vaardig') || lowerMessage.includes('kunnen') || lowerMessage.includes('technology')) {
      return this.formatResponse(responses.skills);
    } else if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('werk') || lowerMessage.includes('websites')) {
      return this.formatResponse(responses.projects);
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('bereik') || lowerMessage.includes('samenwerk')) {
      return this.formatResponse(responses.contact);
    } else if (lowerMessage.includes('hobby') || lowerMessage.includes('sport') || lowerMessage.includes('interesse') || lowerMessage.includes('personal')) {
      return this.formatResponse(responses.personal);
    } else if (lowerMessage.includes('technical') || lowerMessage.includes('technisch') || lowerMessage.includes('development') || lowerMessage.includes('programming')) {
      return this.formatResponse(responses.technical);
    } else if (lowerMessage.includes('hallo') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hey daar! 👋 Leuk dat je interesse hebt in Lucas's werk. Waar kan ik je mee helpen? Vraag me alles over zijn projecten, skills of achtergrond!";
    } else if (lowerMessage.includes('bedankt') || lowerMessage.includes('thanks') || lowerMessage.includes('dank')) {
      return "Graag gedaan! 😊 Heb je nog meer vragen over Lucas? Ik weet veel over zijn projecten en ervaring!";
    } else if (lowerMessage.includes('prijs') || lowerMessage.includes('kosten') || lowerMessage.includes('tarief')) {
      return "Voor specifieke prijzen en tarieven kun je het beste direct contact opnemen via het formulier hieronder. Lucas bespreekt graag de mogelijkheden! 💬";
    } else if (lowerMessage.includes('beschikbaar') || lowerMessage.includes('tijd') || lowerMessage.includes('wanneer')) {
      return "Lucas is direct beschikbaar voor nieuwe projecten! 🚀 Hij reageert binnen 24 uur en kan remote, hybrid of on-site werken. Perfect timing! ⏰";
    } else {
      // General helpful response
      const generalResponses = [
        "Interessante vraag! 🤔 Lucas is expert in web development, marketing en AI. Specifiek over welk gebied wil je meer weten?",
        "Ik help je graag verder! 💡 Je kunt me vragen stellen over Lucas's projecten, skills, ervaring of werkwijze.",
        "Goed dat je vraagt! 👍 Lucas heeft veel ervaring in e-commerce, marketing automation en web development. Waar ben je specifiek naar op zoek?",
        "Leuke vraag! 😊 Ik kan je veel vertellen over Lucas's achtergrond, projecten en expertise. Wat wil je precies weten?"
      ];
      return generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }
  },

  formatResponse(responseArray) {
    return responseArray.join('<br><br>');
  },

  scrollToBottom() {
    if (domElements.footerChatMessages) {
      setTimeout(() => {
        domElements.footerChatMessages.scrollTop = domElements.footerChatMessages.scrollHeight;
      }, 100);
    }
  },

  getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('nl-NL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  sendMessage() {
    const message = domElements.chatInput.value.trim();
    if (!message || isTyping) return;

    // Add user message
    this.addMessage(message, 'user');
    
    // Clear input
    domElements.chatInput.value = '';

    // Show typing indicator and respond
    this.showTyping();
    setTimeout(() => {
      this.hideTyping();
      this.respondToMessage(message);
    }, utils.randomFromArray([400, 500, 600, 700]));
  },

  addMessage(content, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot__message ${sender === 'user' ? 'chatbot__message--user' : 'chatbot__message--ai'}`;
    
    const avatar = sender === 'user' ? '👤' : '🤖';
    
    messageDiv.innerHTML = `
      <div class="chatbot__avatar">${avatar}</div>
      <div class="chatbot__bubble">${content}</div>
    `;

    domElements.chatMessages.appendChild(messageDiv);
    domElements.chatMessages.scrollTop = domElements.chatMessages.scrollHeight;
  },

  showTyping() {
    isTyping = true;
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot__message chatbot__message--ai typing-indicator';
    typingDiv.innerHTML = `
      <div class="chatbot__avatar">🤖</div>
      <div class="chatbot__bubble">
        <span class="typing-dots">
          <span></span><span></span><span></span>
        </span>
      </div>
    `;

    domElements.chatMessages.appendChild(typingDiv);
    domElements.chatMessages.scrollTop = domElements.chatMessages.scrollHeight;
  },

  hideTyping() {
    isTyping = false;
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  },

  respondToMessage(message) {
    const lowerMessage = message.toLowerCase();
    let response;

    // Easter egg
    if (lowerMessage.includes('easter')) {
      response = utils.randomFromArray(CHATBOT_RESPONSES.easter);
      // Trigger confetti
      setTimeout(() => utils.createConfetti(), 500);
    }
    // Command handling
    else if (lowerMessage.startsWith('/')) {
      response = this.handleCommand(lowerMessage);
    }
    // Keyword detection
    else if (lowerMessage.includes('experience') || lowerMessage.includes('background') || lowerMessage.includes('work')) {
      response = utils.randomFromArray(CHATBOT_RESPONSES.experience);
    }
    else if (lowerMessage.includes('project')) {
      response = utils.randomFromArray(CHATBOT_RESPONSES.projects);
    }
    else if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tech')) {
      response = utils.randomFromArray(CHATBOT_RESPONSES.skills);
    }
    else if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('hire')) {
      response = utils.randomFromArray(CHATBOT_RESPONSES.contact);
    }
    else if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('tilburg')) {
      response = utils.randomFromArray(CHATBOT_RESPONSES.location);
    }
    else if (lowerMessage.includes('fun') || lowerMessage.includes('hobby') || lowerMessage.includes('interest')) {
      response = utils.randomFromArray(CHATBOT_RESPONSES.fun);
    }
    else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = utils.randomFromArray(CHATBOT_RESPONSES.greeting);
    }
    else {
      response = utils.randomFromArray(CHATBOT_RESPONSES.default);
    }

    this.addMessage(response, 'ai');
  },

  handleCommand(command) {
    switch (command) {
      case '/skills':
        setTimeout(() => utils.scrollToElement('#skills'), 500);
        return "Here are Lucas's skills! Check out the interactive keyboard below.";
      case '/projects':
        setTimeout(() => utils.scrollToElement('#projects'), 500);
        return "Take a look at Lucas's project portfolio below!";
      case '/contact':
        setTimeout(() => utils.scrollToElement('#contact'), 500);
        return "You can contact Lucas using the form below!";
      case '/me':
        setTimeout(() => utils.scrollToElement('#me'), 500);
        return "Learn more about Lucas's background and experience!";
      case '/fun':
        setTimeout(() => utils.scrollToElement('#fun'), 500);
        return "Check out some fun interactive elements!";
      case '/help':
        return "Available commands: /skills, /projects, /contact, /me, /fun, /help";
      default:
        return "Unknown command. Type /help for available commands.";
    }
  }
};

// Modal Module
const Modal = {
  init() {
    this.setupEventListeners();
  },

  setupEventListeners() {
    if (domElements.modalClose) {
      domElements.modalClose.addEventListener('click', () => this.close());
    }

    if (domElements.modalBackdrop) {
      domElements.modalBackdrop.addEventListener('click', () => this.close());
    }

    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  },

  open() {
    if (domElements.modal) {
      domElements.modal.classList.add('modal--open');
      domElements.modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      // Focus management
      const closeButton = domElements.modalClose;
      if (closeButton) {
        closeButton.focus();
      }
    }
  },

  close() {
    if (domElements.modal) {
      domElements.modal.classList.remove('modal--open');
      domElements.modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      
      // Return focus to spline overlay
      if (domElements.splineOverlay) {
        domElements.splineOverlay.focus();
      }
    }
  },

  isOpen() {
    return domElements.modal && domElements.modal.classList.contains('modal--open');
  }
};

// Contact Module
const Contact = {
  init() {
    this.setupFormHandler();
  },

  setupFormHandler() {
    if (domElements.contactForm) {
      domElements.contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }
  },

  handleSubmit() {
    // Get form data
    const formData = new FormData(domElements.contactForm);
    const data = Object.fromEntries(formData);

    // Simulate form submission
    const submitBtn = domElements.contactForm.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Verzenden...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = 'Bericht Verzonden! ✅';
      
      // Reset form after delay
      setTimeout(() => {
        domElements.contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 3000);
    }, 1500);

    // In a real application, you would send data to a server
    console.log('Form submitted:', data);
  }
};

// Fun Module
const Fun = {
  init() {
    this.setupFunButtons();
  },

  setupFunButtons() {
    if (domElements.confettiBtn) {
      domElements.confettiBtn.addEventListener('click', () => {
        utils.createConfetti();
      });
    }

    if (domElements.waveBtn) {
      domElements.waveBtn.addEventListener('click', () => {
        this.triggerWaveAnimation();
      });
    }
  },

  triggerWaveAnimation() {
    // Create wave effect
    const wave = document.createElement('div');
    wave.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, rgba(91, 141, 239, 0.3) 0%, transparent 70%);
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      animation: wave 1s ease-out forwards;
      pointer-events: none;
      z-index: 1000;
    `;

    document.body.appendChild(wave);

    setTimeout(() => {
      wave.remove();
    }, 1000);
  }
};

// Theme Module
const Theme = {
  init() {
    this.setupDensityToggle();
    this.loadSavedPreferences();
  },

  setupDensityToggle() {
    if (domElements.densityToggle) {
      domElements.densityToggle.addEventListener('click', () => {
        this.toggleDensity();
      });
    }
  },

  toggleDensity() {
    const body = document.body;
    const isCompact = body.classList.contains('theme--compact');
    
    if (isCompact) {
      body.classList.remove('theme--compact');
      domElements.densityToggle.querySelector('.theme-toggle__text').textContent = 'Compact';
      localStorage.setItem('theme-density', 'comfy');
    } else {
      body.classList.add('theme--compact');
      domElements.densityToggle.querySelector('.theme-toggle__text').textContent = 'Comfy';
      localStorage.setItem('theme-density', 'compact');
    }
  },

  loadSavedPreferences() {
    const savedDensity = localStorage.getItem('theme-density');
    if (savedDensity === 'compact') {
      document.body.classList.add('theme--compact');
      if (domElements.densityToggle) {
        domElements.densityToggle.querySelector('.theme-toggle__text').textContent = 'Comfy';
      }
    }
  }
};

// Animations Module
const Animations = {
  init() {
    this.setupScrollAnimations();
    this.addAnimationStyles();
  },

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          utils.animateIn(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
      .section__title,
      .profile-card,
      .project-card,
      .chatbot__container,
      .contact__form
    `);

    animatedElements.forEach(el => observer.observe(el));
  },

  addAnimationStyles() {
    // Add CSS animation for typing dots
    const style = document.createElement('style');
    style.textContent = `
      .typing-dots {
        display: inline-flex;
        gap: 2px;
      }
      
      .typing-dots span {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: currentColor;
        animation: typingDot 1.4s ease-in-out infinite both;
      }
      
      .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
      .typing-dots span:nth-child(2) { animation-delay: -0.16s; }
      .typing-dots span:nth-child(3) { animation-delay: 0s; }
      
      @keyframes typingDot {
        0%, 80%, 100% {
          transform: scale(0.8);
          opacity: 0.5;
        }
        40% {
          transform: scale(1);
          opacity: 1;
        }
      }
      
      @keyframes wave {
        0% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(3);
          opacity: 0;
        }
      }
      
      @keyframes ripple {
        0% {
          transform: scale(0);
          opacity: 1;
        }
        100% {
          transform: scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }
};

// Performance Module
const Performance = {
  init() {
    this.setupLazyLoading();
    this.optimizeImages();
  },

  setupLazyLoading() {
    // Lazy load images
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  },

  optimizeImages() {
    // Placeholder avatar if not found
    const avatar = document.querySelector('.header__avatar img');
    if (avatar) {
      avatar.onerror = function() {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM1QjhERUYiLz4KPHR4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWkiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5M8J+QqzwvdGV4dD4KPC9zdmc+';
      };
    }
  }
};

// Error Handling
const ErrorHandler = {
  init() {
    this.setupGlobalErrorHandling();
  },

  setupGlobalErrorHandling() {
    window.addEventListener('error', (e) => {
      console.error('JavaScript error:', e.error);
      // Don't show errors to users, just log them
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      e.preventDefault();
    });
  }
};

// Skills Book Module
const SkillsBook = {
  currentPage: 1,
  totalPages: 6,

  init() {
    this.setupNavigation();
    this.setupKeyboardControls();
    this.setupTouchControls();
    this.updatePageIndicator();
    this.updateNavigationButtons();
  },

  setupNavigation() {
    if (!domElements.prevPageBtn || !domElements.nextPageBtn) return;

    domElements.prevPageBtn.addEventListener('click', () => {
      this.previousPage();
    });

    domElements.nextPageBtn.addEventListener('click', () => {
      this.nextPage();
    });
  },

  setupKeyboardControls() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.previousPage();
      } else if (e.key === 'ArrowRight') {
        this.nextPage();
      }
    });
  },

  setupTouchControls() {
    if (!domElements.skillsBook) return;

    let startX = 0;
    let endX = 0;

    domElements.skillsBook.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    domElements.skillsBook.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      this.handleSwipe();
    });

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = startX - endX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe left - next page
          this.nextPage();
        } else {
          // Swipe right - previous page
          this.previousPage();
        }
      }
    };

    this.handleSwipe = handleSwipe;
  },

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  },

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  },

  goToPage(pageNumber) {
    if (pageNumber < 1 || pageNumber > this.totalPages) return;

    const oldPage = this.currentPage;
    this.currentPage = pageNumber;

    // Update pages
    domElements.bookPages.forEach((page, index) => {
      const pageNum = index + 1;
      
      // Remove all classes
      page.classList.remove('book-page--active', 'book-page--next', 'book-page--prev');
      
      if (pageNum === this.currentPage) {
        // Current page
        page.classList.add('book-page--active');
      } else if (pageNum === this.currentPage + 1) {
        // Next page preview
        page.classList.add('book-page--next');
      } else {
        // Previous pages
        page.classList.add('book-page--prev');
      }
    });

    // Add flip animation to current page
    const currentPageElement = domElements.bookPages[this.currentPage - 1];
    if (currentPageElement) {
      currentPageElement.style.animation = 'none';
      setTimeout(() => {
        currentPageElement.style.animation = '';
      }, 10);
    }

    this.updatePageIndicator();
    this.updateNavigationButtons();
    this.animatePageTurn(oldPage, this.currentPage);
  },

  animatePageTurn(from, to) {
    // Add subtle book movement
    if (domElements.skillsBook) {
      domElements.skillsBook.style.transform = 'rotateY(2deg) scale(0.98)';
      
      setTimeout(() => {
        domElements.skillsBook.style.transform = '';
      }, 300);
    }

    // Play page flip sound (if available)
    this.playPageFlipSound();
  },

  playPageFlipSound() {
    // Create a subtle audio cue
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
      // Audio not supported or blocked
    }
  },

  updatePageIndicator() {
    if (domElements.currentPageSpan) {
      domElements.currentPageSpan.textContent = this.currentPage;
    }
    if (domElements.totalPagesSpan) {
      domElements.totalPagesSpan.textContent = this.totalPages;
    }
  },

  updateNavigationButtons() {
    if (domElements.prevPageBtn) {
      domElements.prevPageBtn.disabled = this.currentPage === 1;
    }
    if (domElements.nextPageBtn) {
      domElements.nextPageBtn.disabled = this.currentPage === this.totalPages;
    }
  },

  // Auto-advance pages (optional feature)
  startAutoAdvance(intervalMs = 5000) {
    this.autoAdvanceInterval = setInterval(() => {
      if (this.currentPage < this.totalPages) {
        this.nextPage();
      } else {
        this.goToPage(1); // Loop back to first page
      }
    }, intervalMs);
  },

  stopAutoAdvance() {
    if (this.autoAdvanceInterval) {
      clearInterval(this.autoAdvanceInterval);
      this.autoAdvanceInterval = null;
    }
  }
};

// Partners Animation Module
const Partners = {
  init() {
    this.setupHoverEffects();
    this.setupIntersectionObserver();
  },

  setupHoverEffects() {
    if (!domElements.partnersContainer) return;

    // Add subtle mouse parallax effect
    domElements.partnersContainer.addEventListener('mousemove', (e) => {
      const rect = domElements.partnersContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const centerX = rect.width / 2;
      const moveX = (x - centerX) / centerX;

      domElements.partnersRows.forEach((row, index) => {
        const speed = 0.3 + (index * 0.1);
        const offset = moveX * speed * 5; // Subtle movement
        
        // Apply transform while preserving existing animation
        const currentTransform = getComputedStyle(row).transform;
        if (currentTransform && currentTransform !== 'none') {
          row.style.transform = `${currentTransform} translateX(${offset}px)`;
        }
      });
    });

    // Reset on mouse leave
    domElements.partnersContainer.addEventListener('mouseleave', () => {
      domElements.partnersRows.forEach((row) => {
        row.style.transform = '';
      });
    });

    // Enhanced hover effects for individual items
    domElements.partnersRows.forEach((row) => {
      const items = row.querySelectorAll('.partners__item');
      items.forEach((item) => {
        item.addEventListener('mouseenter', () => {
          item.style.transform = 'scale(1.1) translateY(-5px)';
          item.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', () => {
          item.style.transform = '';
          item.style.zIndex = '';
        });
      });
    });
  },

  setupIntersectionObserver() {
    if (!domElements.partnersContainer) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Resume animations when in view
          domElements.partnersRows.forEach((row) => {
            row.style.animationPlayState = 'running';
          });
        } else {
          // Pause animations when out of view for performance
          domElements.partnersRows.forEach((row) => {
            row.style.animationPlayState = 'paused';
          });
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    observer.observe(domElements.partnersContainer);
  }
};

// Main Application Initialization
const App = {
  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.start());
    } else {
      this.start();
    }
  },

  start() {
    try {
      // Initialize all modules
      ErrorHandler.init();
      Navigation.init();
      Spline.init();
      ScrollTextEffect.init();
      Chatbot.init();
      Modal.init();
      Contact.init();
      Fun.init();
      Theme.init();
      Animations.init();
      Performance.init();
      Partners.init();
      SkillsBook.init();

      console.log('🚀 Lucas AI Portfolio loaded successfully!');
    } catch (error) {
      console.error('Failed to initialize application:', error);
    }
  }
};

// Start the application
App.init();
