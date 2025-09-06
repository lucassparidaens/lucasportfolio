/* ===================================
   LUCAS AI PORTFOLIO - MAIN JAVASCRIPT
   Modular JavaScript Architecture
   =================================== */

// Main Application Module
window.App = (function() {
    'use strict';

    // DOM Elements Cache
    const domElements = {
        // Navigation
        navbar: () => document.querySelector('.navbar'),
        navbarToggle: () => document.getElementById('navbar-toggle'),
        navbarMenu: () => document.getElementById('navbar-menu'),
        navbarLinks: () => document.querySelectorAll('.navbar__link'),
        
        // Hero
        heroScrollText: () => document.getElementById('scroll-text'),
        scrollTextWords: () => document.querySelectorAll('.scroll-text__word'),
        
        // Footer Scroll Text
        footerScrollText: () => document.getElementById('footer-scroll-text'),
        footerScrollTextWords: () => document.querySelectorAll('.footer-scroll-text__word'),
        
        // Skills Book
        skillsBook: () => document.querySelector('.skills-menu-book'),
        bookPages: () => document.getElementById('bookPages'),
        prevPageBtn: () => document.getElementById('prevPage'),
        nextPageBtn: () => document.getElementById('nextPage'),
        currentPageSpan: () => document.querySelector('.current-page'),
        totalPagesSpan: () => document.querySelector('.total-pages'),
        
        // Partners
        partnersContainer: () => document.querySelector('.partners__content'),
        partnersRows: () => document.querySelectorAll('.partners__row'),
        
        // Footer AI States
        footerAiInitial: () => document.getElementById('footer-ai-initial'),
        footerAiChat: () => document.getElementById('footer-ai-chat'),
        footerInitialInput: () => document.getElementById('footer-initial-input'),
        footerInitialSend: () => document.getElementById('footer-initial-send'),
        footerChatInput: () => document.getElementById('footer-chat-input'),
        footerSendBtn: () => document.getElementById('footer-send-btn'),
        footerChatMessages: () => document.getElementById('footer-chat-messages'),
        footerNavPills: () => document.querySelectorAll('.footer__pill'),
        
        // Contact Form
        contactForm: () => document.getElementById('contact-form'),
        
        // Modals
        aboutModal: () => document.getElementById('about-modal'),
        modalClose: () => document.querySelector('.modal__close')
    };

    // Utility Functions
    const utils = {
        debounce: function(func, wait, immediate) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func(...args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func(...args);
            };
        },
        
        throttle: function(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        generateId: function() {
            return Math.random().toString(36).substr(2, 9);
        },

        formatTime: function() {
            return new Date().toLocaleTimeString('nl-NL', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
        }
    };

    // Navigation Module
    const Navigation = {
        init: function() {
            // Wait for navigation component to load before setting up
            const checkNavigation = () => {
                const toggle = domElements.navbarToggle();
                const menu = domElements.navbarMenu();
                
                if (toggle && menu) {
                    console.log('Navigation elements found, setting up...');
                    this.setupMobileMenu();
                    this.setupSmoothScrolling();
                    this.setupActiveStates();
                } else {
                    console.log('Navigation elements not ready, retrying...');
                    setTimeout(checkNavigation, 100);
                }
            };
            
            checkNavigation();
        },

        setupMobileMenu: function() {
            const toggle = domElements.navbarToggle();
            const menu = domElements.navbarMenu();
            
            if (!toggle || !menu) {
                console.log('❌ Mobile menu elements not found, retrying...');
                setTimeout(() => this.setupMobileMenu(), 100);
                return;
            }
            
            // Prevent duplicate event listeners
            if (toggle.dataset.mobileMenuSetup === 'true') {
                console.log('⚠️ Mobile menu already setup, skipping...');
                return;
            }
            toggle.dataset.mobileMenuSetup = 'true';
            
            console.log('✅ Mobile menu setup complete');

            const closeMobileMenu = () => {
                menu.classList.remove('navbar__menu--open');
                toggle.classList.remove('navbar__toggle--active');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('no-scroll');
            };

            const openMobileMenu = () => {
                menu.classList.add('navbar__menu--open');
                toggle.classList.add('navbar__toggle--active');
                toggle.setAttribute('aria-expanded', 'true');
                document.body.classList.add('no-scroll');
            };

            // Toggle menu on button click
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = menu.classList.contains('navbar__menu--open');
                
                if (isOpen) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            });

            // Close menu when clicking outside or on menu overlay
            document.addEventListener('click', (e) => {
                const isClickInsideMenu = menu.contains(e.target) && !e.target.classList.contains('navbar__link');
                const isClickOnToggle = toggle.contains(e.target);
                
                if (!isClickInsideMenu && !isClickOnToggle) {
                    closeMobileMenu();
                }
            });

            // Close menu when clicking on menu links
            const menuLinks = menu.querySelectorAll('.navbar__link');
            menuLinks.forEach(link => {
                link.addEventListener('click', () => {
                    setTimeout(closeMobileMenu, 100);
                });
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && menu.classList.contains('navbar__menu--open')) {
                    closeMobileMenu();
                }
            });

            // Prevent scroll on body when menu is open
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && menu.classList.contains('navbar__menu--open')) {
                    closeMobileMenu();
                }
            });
        },

        setupSmoothScrolling: function() {
            const links = domElements.navbarLinks();
            
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    
                    if (href.startsWith('#') || href.startsWith('.')) {
                        e.preventDefault();
                        
                        const targetId = href.replace('#', '').replace('.', '');
                        const targetElement = document.getElementById(targetId) || 
                                            document.querySelector(`.${targetId}`);
                        
                        if (targetElement) {
                            const headerOffset = 100;
                            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                            const offsetPosition = elementPosition - headerOffset;
                            
                            this.smoothScrollTo(offsetPosition);
                            
                            // Close mobile menu if open
                            const menu = domElements.navbarMenu();
                            const toggle = domElements.navbarToggle();
                            if (menu && menu.classList.contains('navbar__menu--open')) {
                                menu.classList.remove('navbar__menu--open');
                                toggle.classList.remove('navbar__toggle--active');
                                document.body.classList.remove('no-scroll');
                            }
                        }
                    }
                });
            });
        },

        smoothScrollTo: function(targetY) {
            const startY = window.pageYOffset;
            const distance = targetY - startY;
            const duration = Math.min(Math.abs(distance) / 2, 800);
            let startTime = null;

            function easeInOutCubic(t) {
                return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            }

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = easeInOutCubic(progress);
                
                window.scrollTo(0, startY + distance * ease);
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }

            requestAnimationFrame(animation);
        },

        setupActiveStates: function() {
            const links = domElements.navbarLinks();
            const sections = document.querySelectorAll('section[id]');
            
            if (!links.length || !sections.length) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const activeId = entry.target.id;
                        
                        links.forEach(link => {
                            const href = link.getAttribute('href');
                            if (href === `#${activeId}`) {
                                link.classList.add('navbar__link--active');
                            } else {
                                link.classList.remove('navbar__link--active');
                            }
                        });
                    }
                });
            }, {
                threshold: 0.3,
                rootMargin: '-100px 0px -50% 0px'
            });

            sections.forEach(section => observer.observe(section));
        }
    };

    // Scroll Text Effects Module
    const ScrollTextEffect = {
        init: function() {
            this.setupScrollEffect();
            this.setupFooterScrollEffect();
            this.setupSaturationOnScroll();
        },

        setupScrollEffect: function() {
            const scrollText = domElements.heroScrollText();
            const words = domElements.scrollTextWords();
            
            if (!scrollText || !words.length) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateWords(words);
                    }
                });
            }, {
                threshold: 0.5
            });

            observer.observe(scrollText);
        },

        setupFooterScrollEffect: function() {
            const footerScrollText = domElements.footerScrollText();
            const footerWords = domElements.footerScrollTextWords();
            
            if (!footerScrollText || !footerWords.length) return;

            // Add scroll listener for continuous effect
            let ticking = false;
            const handleScroll = () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        this.updateFooterScrollColors(footerScrollText, footerWords);
                        ticking = false;
                    });
                    ticking = true;
                }
            };
            
            window.addEventListener('scroll', handleScroll, { passive: true });
        },

        updateFooterScrollColors: function(footerScrollText, footerWords) {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const textRect = footerScrollText.getBoundingClientRect();
            const textTop = textRect.top + scrollPosition;
            const textHeight = textRect.height;

            // Calculate progress through the footer text section
            const sectionStart = textTop - windowHeight * 0.8; // Start lighting when footer is 80% visible
            const sectionEnd = textTop + textHeight;
            const progress = Math.max(0, Math.min(1, (scrollPosition - sectionStart) / (sectionEnd - sectionStart)));

            // Update word colors based on scroll progress
            footerWords.forEach((word, index) => {
                const wordProgress = progress * footerWords.length;
                const wordIndex = index + 1;

                // Remove all color classes
                word.classList.remove('color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'footer-scroll-text__word--active');

                if (wordProgress >= wordIndex) {
                    // Fully revealed words
                    word.classList.add('footer-scroll-text__word--active');
                } else if (wordProgress >= wordIndex - 1) {
                    // Words being revealed
                    const intensity = Math.ceil((wordProgress - (wordIndex - 1)) * 5);
                    word.classList.add(`color-${Math.max(1, intensity)}`);
                }
                // Not yet revealed words stay at default very light color (set in CSS)
            });
        },

        animateWords: function(words) {
            words.forEach((word, index) => {
                setTimeout(() => {
                    // Reset all words
                    words.forEach(w => {
                        w.classList.remove('color-1', 'color-2', 'color-3', 'color-4', 'color-5');
                        w.classList.remove('scroll-text__word--active');
                    });
                    
                    // Add progressive color to current and previous words
                    for (let i = 0; i <= index; i++) {
                        const colorClass = Math.min(index - i + 1, 5);
                        words[i].classList.add(`color-${colorClass}`);
                        
                        if (i === index) {
                            words[i].classList.add('scroll-text__word--active');
                        }
                    }
                }, index * 200);
            });
        }
        ,
        setupSaturationOnScroll: function() {
            const scrollText = domElements.heroScrollText();
            if (!scrollText) return;

            const updateSaturation = () => {
                const rect = scrollText.getBoundingClientRect();
                const vh = window.innerHeight || document.documentElement.clientHeight;
                // Start effect when top enters 80% viewport, end when bottom leaves 20%
                const start = vh * 0.2;
                const end = vh * 0.8;
                const centerY = rect.top + rect.height / 2;
                const progressRaw = (end - centerY) / (end - start);
                const progress = Math.max(0, Math.min(1, progressRaw));
                document.documentElement.style.setProperty('--scroll-saturation', progress.toFixed(3));
            };

            let ticking = false;
            const onScroll = () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        updateSaturation();
                        ticking = false;
                    });
                    ticking = true;
                }
            };

            // Initialize and bind events
            updateSaturation();
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('resize', updateSaturation);

            // Ensure update when the element enters viewport
            const io = new IntersectionObserver(() => updateSaturation(), { threshold: [0, 0.25, 0.5, 0.75, 1] });
            io.observe(scrollText);
        }
    };

    // Footer AI Module - Moved to footer-chat.js
    const FooterAI = {
        init: function() {
            // Functionality moved to footer-chat.js
            console.log('Footer AI functionality loaded from footer-chat.js');
        }
    };

    // Initialize application
    function start() {
        console.log('🚀 Lucas Portfolio - Modular Architecture Initialized');
        
        // Initialize core modules
        Navigation.init();
        ScrollTextEffect.init();
        FooterAI.init();
        
        // Set up mutation observer to re-initialize navigation when component loads
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const addedNodes = Array.from(mutation.addedNodes);
                    const hasNavigation = addedNodes.some(node => 
                        node.nodeType === Node.ELEMENT_NODE && 
                        (node.querySelector && (
                            node.querySelector('#navbar-toggle') || 
                            node.querySelector('#navbar-menu')
                        ))
                    );
                    
                    if (hasNavigation) {
                        console.log('Navigation component detected, re-initializing...');
                        setTimeout(() => Navigation.init(), 50);
                    }
                }
            });
        });
        
        // Start observing for dynamically loaded navigation
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Load additional modules when available
        setTimeout(() => {
            if (window.SkillsBook) window.SkillsBook.init();
            if (window.Partners) window.Partners.init();
        }, 100);
    }

    // Public API
    return {
        start: start,
        utils: utils,
        domElements: domElements,
        Navigation: Navigation,
        ScrollTextEffect: ScrollTextEffect,
        FooterAI: FooterAI
    };

})();
