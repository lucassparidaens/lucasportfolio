// Footer Chat functionality - Two State System
const FooterChat = {
    isInChatMode: false,

    init: function() {
        this.setupInitialInteractions();
        this.setupChatInteractions();
    },

    setupInitialInteractions: function() {
        console.log('Setting up initial interactions...');
        
        const initialInput = document.getElementById('footer-initial-input');
        const initialSend = document.getElementById('footer-initial-send');
        const pills = document.querySelectorAll('.footer__pill');

        console.log('Found elements:', {
            initialInput: !!initialInput,
            initialSend: !!initialSend,
            pillsCount: pills.length
        });

        // Input field interactions
        if (initialInput) {
            console.log('Adding input listeners...');
            initialInput.addEventListener('focus', () => {
                console.log('Input focused!');
                if (!this.isInChatMode) {
                    this.activateChatMode();
                }
            });

            initialInput.addEventListener('keypress', (e) => {
                console.log('Key pressed:', e.key);
                if (e.key === 'Enter' && !this.isInChatMode) {
                    const message = initialInput.value.trim();
                    console.log('Activating chat with message:', message);
                    this.activateChatMode(message);
                }
            });
        } else {
            console.log('Initial input not found!');
        }

        // Send button
        if (initialSend) {
            console.log('Adding send button listener...');
            initialSend.addEventListener('click', (e) => {
                console.log('Send button clicked!');
                e.preventDefault();
                if (!this.isInChatMode) {
                    const message = initialInput ? initialInput.value.trim() : '';
                    console.log('Activating chat with message:', message);
                    this.activateChatMode(message);
                }
            });
        } else {
            console.log('Initial send button not found!');
        }

        // Navigation pills (both initial and chat mode)
        console.log('Adding pill listeners...');
        this.setupPillListeners();
    },

    setupPillListeners: function() {
        // Setup for both initial and chat mode pills
        const allPills = document.querySelectorAll('.footer__pill');
        
        allPills.forEach((pill, index) => {
            pill.addEventListener('click', (e) => {
                console.log('Pill clicked:', index, pill.dataset.action);
                e.preventDefault();
                const action = pill.dataset.action;
                if (action) {
                    const presetMessages = {
                        me: "Vertel me over je achtergrond en ervaring",
                        projects: "Welke projecten heb je gedaan?",
                        skills: "Wat zijn je belangrijkste vaardigheden?",
                        fun: "Wat doe je voor de lol?",
                        contact: "Hoe kan ik contact met je opnemen?"
                    };
                    
                    if (!this.isInChatMode) {
                        console.log('Activating chat with preset message for:', action);
                        this.activateChatMode(presetMessages[action] || '');
                    } else {
                        // Already in chat mode, just send message
                        console.log('Sending preset message in chat mode:', action);
                        this.sendMessage(presetMessages[action] || '');
                    }
                }
            });
        });
    },

    setupChatInteractions: function() {
        const chatInput = document.getElementById('footer-chat-input');
        const chatSend = document.getElementById('footer-chat-send');

        if (chatInput && chatSend) {
            const handleSend = () => {
                const message = chatInput.value.trim();
                if (message) {
                    this.sendMessage(message);
                    chatInput.value = '';
                }
            };

            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSend();
                }
            });

            chatSend.addEventListener('click', handleSend);
        }
    },

    activateChatMode: function(initialMessage = '') {
        console.log('Activating chat mode with message:', initialMessage);
        
        if (this.isInChatMode) {
            console.log('Already in chat mode, returning');
            return;
        }

        const initialState = document.getElementById('footer-initial');
        const chatState = document.getElementById('footer-chat');

        console.log('Found states:', {
            initialState: !!initialState,
            chatState: !!chatState
        });

        if (!initialState || !chatState) {
            console.log('Missing state elements!');
            return;
        }

        this.isInChatMode = true;
        console.log('Set isInChatMode to true');

        // Add hiding animation to initial state
        initialState.classList.add('hiding');
        console.log('Added hiding class to initial state');

        // After animation, switch to chat state
        setTimeout(() => {
            console.log('Switching to chat state...');
            initialState.style.display = 'none';
            chatState.style.display = 'flex';
            
            // Trigger showing animation
            setTimeout(() => {
                chatState.classList.add('showing');
                console.log('Added showing class to chat state');
            }, 50);

            // Add welcome message
            console.log('Adding welcome message...');
            this.addWelcomeMessage();

            // Focus on chat input
            const chatInput = document.getElementById('footer-chat-input');
            if (chatInput) {
                console.log('Found chat input, focusing...');
                setTimeout(() => {
                    chatInput.focus();
                }, 300);

                // Set initial message if provided
                if (initialMessage) {
                    chatInput.value = initialMessage;
                    console.log('Set initial message in chat input:', initialMessage);
                }
            } else {
                console.log('Chat input not found!');
            }

            // Send initial message if provided
            if (initialMessage) {
                console.log('Sending initial message in 800ms...');
                setTimeout(() => {
                    this.sendMessage(initialMessage);
                    if (chatInput) chatInput.value = '';
                }, 800);
            }

            // Re-setup pill listeners for chat mode pills
            setTimeout(() => {
                this.setupPillListeners();
            }, 500);
        }, 300);
    },

    addWelcomeMessage: function() {
        this.addMessage("Hoi! Ik ben Lucas's AI assistent. Vraag me gerust naar zijn ervaring, projecten, vaardigheden, of hoe je contact kunt opnemen! 😊", 'ai');
    },

    sendMessage: function(message) {
        // Add user message
        this.addMessage(message, 'user');
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate and add AI response with realistic delay
        const thinkingTime = Math.random() * 2000 + 1000; // 1-3 seconds
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, 'ai');
        }, thinkingTime);
    },

    addMessage: function(text, sender) {
        const messagesContainer = document.getElementById('footer-chat-messages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `footer__message ${sender === 'user' ? 'footer__message--user' : ''}`;

        const avatar = document.createElement('div');
        avatar.className = 'footer__message-avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🤖';

        const bubble = document.createElement('div');
        bubble.className = 'footer__message-bubble';
        bubble.innerHTML = text; // Using innerHTML to support HTML formatting

        // Add timestamp
        const timestamp = document.createElement('div');
        timestamp.className = 'footer__message-time';
        timestamp.textContent = this.getCurrentTime();
        bubble.appendChild(timestamp);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(bubble);

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    },

    getCurrentTime: function() {
        const now = new Date();
        return now.toLocaleTimeString('nl-NL', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    },

    showTypingIndicator: function() {
        const typingIndicator = document.getElementById('footer-typing');
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
            const messagesContainer = document.getElementById('footer-chat-messages');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    },

    hideTypingIndicator: function() {
        const typingIndicator = document.getElementById('footer-typing');
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
    },

    generateResponse: function(message) {
        const responses = {
            experience: "Lucas heeft <strong>7+ jaar ervaring</strong> in marketing en development! 🚀<br><br><strong>Opleiding:</strong> MBO 4 Marketing & Communicatie<br><strong>Werkervaring:</strong><br>• 3 jaar marketing specialist in loondienst<br>• 4 jaar zelfstandig ondernemer in web/app development & marketing<br><br><strong>Talenkennis:</strong> Nederlands & Vlaams (vloeiend), Engels (vloeiend), Spaans (middelmatig niveau)",
            
            projects: "Lucas heeft aan geweldige projecten gewerkt! 🎯<br><br><strong>Portfolio highlights:</strong><br>• <strong>E-commerce:</strong> Gamestoelen.nl, Gamestoelenexpert.nl<br>• <strong>Tech Solutions:</strong> Pettech.nl, Getdjoice.com<br>• <strong>Lifestyle:</strong> Freakygoodz.com<br>• <strong>Content & Apps:</strong> Margriet magazine, Dakkie app<br><br>Van concept tot live implementatie - hij realiseert complete digitale oplossingen! ⚡",
            
            skills: "Lucas is een complete digital expert! 💻<br><br><strong>💻 Web Development:</strong><br>• HTML, CSS, JavaScript<br>• Shopify, Magento 1 & 2<br>• Swift & Flutter (basis)<br>• Visual Studio Code<br><br><strong>🛒 Marketplace Expertise:</strong><br>• Bol.com, Amazon, Kaufland<br>• Mediamarkt Saturn, Cdiscount<br><br><strong>🎨 UX/UI & Design:</strong><br>• Figma, Adobe Creative Suite<br>• Photoshop, Illustrator, InDesign, After Effects<br>• Canva",
            
            marketing: "Lucas is een marketing powerhouse! 📈<br><br><strong>📧 Email Marketing:</strong><br>• Klaviyo, Mailchimp, Mailgun<br><br><strong>🎯 Performance Advertising:</strong><br>• Meta Ads (Facebook, Instagram)<br>• TikTok Ads, Google Ads, Pinterest Ads<br>• Dating app ads (Tinder, Bumble)<br>• UGC Marketing<br><br><strong>🔍 SEO & Analytics:</strong><br>• AI-geoptimaliseerde content<br>• Google Analytics specialist<br>• Bewezen blog resultaten",
            
            ai: "Lucas is een echte AI specialist! 🤖<br><br><strong>🧠 AI Tools:</strong><br>• ChatGPT, Google Gemini<br>• Anthropic Claude, Grok<br>• Mistral, Stitch, Cursor<br><br><strong>🔧 Chatbot Development:</strong><br>• Professional chatbot designer & maker<br>• Zapier, CM.com integraties<br>• Custom AI solutions<br><br>Hij blijft altijd op de hoogte van de nieuwste AI ontwikkelingen! 🚀",
            
            contact: "Super makkelijk om Lucas te bereiken! 📧<br><br>🏠 <strong>Gevestigd in Tilburg</strong><br>🚗 <strong>Heeft rijbewijs</strong> - kan overal naartoe<br>⚡ <strong>Direct beschikbaar</strong> voor nieuwe projecten<br>⏰ <strong>Reactie binnen 24 uur</strong><br><br>💼 Werkt <strong>remote, hybrid of on-site</strong> - wat jij wilt!<br><br>Scroll naar beneden voor het contactformulier! 👇",
            
            me: "Lucas is een veelzijdige professional uit Tilburg! 🎯<br><br><strong>🏋️ Sport & Fitness:</strong><br>• MMA, BJJ, Kickboksen<br>• Fitness & Football fan<br><br><strong>💡 Interesses:</strong><br>• Healthcare & Mental health<br>• Apple product specialist<br>• Logistic & Supply chain optimalisatie<br><br><strong>🤝 Werkstijl:</strong><br>• Ruimdenkend & open voor feedback<br>• Presteert best in positieve omgeving<br>• Teamwork focused",
            
            fun: "Lucas is een echte allrounder! 🥋<br><br><strong>🏋️ Sport:</strong><br>• MMA, BJJ, Kickboksen training<br>• Fitness enthusiast<br>• Football fanaat ⚽<br><br><strong>💻 Tech Passies:</strong><br>• Apple product specialist<br>• AI tools explorer<br>• Healthcare tech interesse<br><br><strong>🧠 Mental Health:</strong><br>• Gepassioneerd over mental health<br>• Bewuste levensstijl<br><br>Balans tussen tech, sport en welzijn! 🚀",
            
            location: "Lucas woont in <strong>Tilburg, Nederland</strong> 🇳🇱<br><br>🗣️ <strong>Talen:</strong><br>• Nederlands & Vlaams (vloeiend)<br>• Engels (vloeiend)<br>• Spaans (middelmatig lezen/verstaan)<br><br>🚗 <strong>Flexibiliteit:</strong><br>• Heeft rijbewijs<br>• Remote, hybrid of on-site<br>• Heel Nederland bereikbaar<br><br>Perfect gelegen voor projecten door heel Nederland! 📍",
            
            default: "Hey! 👋 Ik ben Lucas's AI assistent. Vraag me alles over:<br><br>• 💼 <strong>Ervaring</strong> & achtergrond<br>• 🛠️ <strong>Skills</strong> & technische expertise<br>• 📈 <strong>Marketing</strong> & growth skills<br>• 🤖 <strong>AI</strong> & chatbot development<br>• 🎯 <strong>Projecten</strong> & portfolio<br>• 📧 <strong>Contact</strong> & samenwerking<br>• 🏋️ <strong>Persoonlijke</strong> interesses<br><br>Waar kan ik je mee helpen? 😊"
        };

        // Enhanced keyword matching
        const msg = message.toLowerCase();
        
        // Greetings
        if (msg.includes('hoi') || msg.includes('hallo') || msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
            return "Hoi daar! 👋 Leuk dat je interesse hebt in Lucas's werk. Ik kan je alles vertellen over zijn ervaring, projecten, skills of hoe je contact kunt opnemen. Waar ben je benieuwd naar? 😊";
        }
        
        // Thanks/Goodbye
        if (msg.includes('bedankt') || msg.includes('dank') || msg.includes('thanks') || msg.includes('thank you')) {
            return "Graag gedaan! 😊 Heb je nog meer vragen over Lucas? Ik weet veel over zijn projecten en ervaring!";
        }
        
        if (msg.includes('doei') || msg.includes('bye') || msg.includes('tot ziens') || msg.includes('goodbye')) {
            return "Tot ziens! 👋 Veel succes met je project. Als je nog vragen hebt over Lucas, ben ik er! 🚀";
        }
        
        // Experience & Background
        if (msg.includes('ervaring') || msg.includes('experience') || msg.includes('achtergrond') || msg.includes('background') || msg.includes('opleiding') || msg.includes('werken') || msg.includes('jaar')) {
            return responses.experience;
        }
        
        // Projects & Portfolio
        if (msg.includes('project') || msg.includes('werk') || msg.includes('work') || msg.includes('portfolio') || msg.includes('website') || msg.includes('gamestoelen') || msg.includes('pettech') || msg.includes('getdjoice') || msg.includes('dakkie') || msg.includes('freakygoodz') || msg.includes('margriet') || msg.includes('gemaakt') || msg.includes('gebouwd') || msg.includes('ecommerce') || msg.includes('e-commerce')) {
            return responses.projects;
        }
        
        // Skills & Technology
        if (msg.includes('skill') || msg.includes('vaardigheid') || msg.includes('expertise') || msg.includes('kunnen') || msg.includes('technologie') || msg.includes('programming') || msg.includes('development') || msg.includes('javascript') || msg.includes('shopify') || msg.includes('magento') || msg.includes('html') || msg.includes('css') || msg.includes('swift') || msg.includes('flutter') || msg.includes('figma') || msg.includes('photoshop') || msg.includes('design')) {
            return responses.skills;
        }
        
        // Marketing & Growth
        if (msg.includes('marketing') || msg.includes('advertising') || msg.includes('ads') || msg.includes('klaviyo') || msg.includes('mailchimp') || msg.includes('email') || msg.includes('facebook') || msg.includes('instagram') || msg.includes('tiktok') || msg.includes('google ads') || msg.includes('seo') || msg.includes('analytics') || msg.includes('performance') || msg.includes('ugc')) {
            return responses.marketing;
        }
        
        // AI & Chatbots
        if (msg.includes('ai') || msg.includes('artificial') || msg.includes('chatbot') || msg.includes('chat bot') || msg.includes('gpt') || msg.includes('claude') || msg.includes('gemini') || msg.includes('grok') || msg.includes('mistral') || msg.includes('cursor') || msg.includes('zapier') || msg.includes('automation')) {
            return responses.ai;
        }
        
        // Contact & Collaboration
        if (msg.includes('contact') || msg.includes('bereiken') || msg.includes('reach') || msg.includes('email') || msg.includes('samenwerk') || msg.includes('beschikbaar') || msg.includes('available') || msg.includes('inhuren') || msg.includes('hire')) {
            return responses.contact;
        }
        
        // Personal & About
        if (msg.includes('over') || msg.includes('about') || msg.includes('wie') || msg.includes('who') || msg.includes('persoon') || msg.includes('lucas') || msg.includes('vertell')) {
            return responses.me;
        }
        
        // Fun & Hobbies
        if (msg.includes('fun') || msg.includes('hobby') || msg.includes('sport') || msg.includes('mma') || msg.includes('bjj') || msg.includes('vrije tijd') || msg.includes('interesses') || msg.includes('voetbal') || msg.includes('football') || msg.includes('kickbok') || msg.includes('fitness') || msg.includes('gym') || msg.includes('mental health') || msg.includes('healthcare') || msg.includes('apple') || msg.includes('wellness')) {
            return responses.fun;
        }
        
        // Location & Languages
        if (msg.includes('waar') || msg.includes('locatie') || msg.includes('location') || msg.includes('tilburg') || msg.includes('wonen') || msg.includes('nederland') || msg.includes('based') || msg.includes('taal') || msg.includes('language') || msg.includes('engels') || msg.includes('english') || msg.includes('spaans') || msg.includes('spanish') || msg.includes('vlaams') || msg.includes('rijbewijs')) {
            return responses.location;
        }
        
        // Pricing
        if (msg.includes('prijs') || msg.includes('kosten') || msg.includes('tarief') || msg.includes('price') || msg.includes('cost') || msg.includes('rate')) {
            return "Voor specifieke prijzen en tarieven kun je het beste direct contact opnemen! 💰<br><br>Lucas bespreekt graag de mogelijkheden en maakt een <strong>passende offerte</strong> op basis van je project.<br><br>Scroll naar beneden voor het contactformulier! 👇";
        }
        
        // Availability
        if (msg.includes('wanneer') || msg.includes('tijd') || msg.includes('planning') || msg.includes('start') || msg.includes('beginnen')) {
            return "Lucas is <strong>direct beschikbaar</strong> voor nieuwe projecten! 🚀<br><br>Hij reageert binnen 24 uur en kan <strong>flexibel starten</strong> - remote, hybrid of on-site. Perfect timing! ⏰";
        }
        
        // Marketplace & E-commerce
        if (msg.includes('marketplace') || msg.includes('bol.com') || msg.includes('amazon') || msg.includes('kaufland') || msg.includes('mediamarkt') || msg.includes('saturn') || msg.includes('cdiscount') || msg.includes('webshop') || msg.includes('webwinkel')) {
            return "Lucas is een <strong>marketplace expert</strong>! 🛒<br><br><strong>Ervaring met:</strong><br>• Bol.com & Amazon optimalisatie<br>• Mediamarkt Saturn partnerships<br>• Kaufland & Cdiscount integraties<br><br>Van product listings tot supply chain optimalisatie - hij kent alle ins en outs van online verkopen! 📦";
        }
        
        // Teamwork & Working style
        if (msg.includes('team') || msg.includes('samenwerk') || msg.includes('werkstijl') || msg.includes('feedback') || msg.includes('positief') || msg.includes('omgeving') || msg.includes('cultuur')) {
            return "Lucas is een <strong>teamplayer</strong> die het beste presteert in een positieve omgeving! 🤝<br><br><strong>Werkstijl:</strong><br>• Ruimdenkend & open voor feedback<br>• Teamwork needs a go en wil niet stoppen<br>• Presteert optimaal in prestatiegerichte omgeving<br><br>Een échte doorzetter die graag meedenkt en doorpakt! 🚀";
        }
        
        return responses.default;
    }
};

// Enhanced initialization that waits for components to load
function initializeFooterChat() {
    console.log('Attempting to initialize FooterChat...');
    
    // Check if footer elements exist
    const footerInitial = document.getElementById('footer-initial');
    const footerChat = document.getElementById('footer-chat');
    
    if (footerInitial && footerChat) {
        console.log('Footer elements found, initializing FooterChat...');
        FooterChat.init();
    } else {
        console.log('Footer elements not found, retrying in 500ms...');
        setTimeout(initializeFooterChat, 500);
    }
}

// Initialize when DOM is loaded, but also retry if components aren't ready
document.addEventListener('DOMContentLoaded', initializeFooterChat);

// Also try after a delay to handle async component loading
setTimeout(initializeFooterChat, 1000);