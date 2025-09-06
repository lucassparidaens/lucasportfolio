// Lucas AI Footer Chat - Simple Implementation Based on Skills Keyboard
class SimpleFooterChat {
    constructor() {
        this.isActive = false;
        this.messages = [];
        this.currentInput = "";
        this.isTyping = false;
        
        console.log('SimpleFooterChat initialized');
        this.bindEvents();
    }

    bindEvents() {
        // Initial state input
        const chatInput = document.getElementById('footer-chat-input');
        const sendBtn = document.getElementById('footer-send-btn');
        
        // Chat state input
        const chatInputActive = document.getElementById('footer-chat-input-active');
        const sendBtnActive = document.getElementById('footer-send-btn-active');
        
        // Initial state pills
        const pills = document.querySelectorAll('.footer-pill');
        const pillsActive = document.querySelectorAll('.footer-pill-active');
        
        // Bind initial input events
        if (chatInput && sendBtn) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSendMessage(chatInput.value.trim());
                }
            });
            
            sendBtn.addEventListener('click', () => {
                this.handleSendMessage(chatInput.value.trim());
            });
        }
        
        // Bind active input events
        if (chatInputActive && sendBtnActive) {
            chatInputActive.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSendMessageActive(chatInputActive.value.trim());
                }
            });
            
            sendBtnActive.addEventListener('click', () => {
                this.handleSendMessageActive(chatInputActive.value.trim());
            });
        }
        
        // Bind pill events
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                const action = pill.getAttribute('data-action');
                this.handlePillClick(action);
            });
        });
        
        pillsActive.forEach(pill => {
            pill.addEventListener('click', () => {
                const action = pill.getAttribute('data-action');
                this.handlePillClick(action);
            });
        });
        
        console.log('Events bound:', {
            chatInput: !!chatInput,
            sendBtn: !!sendBtn,
            chatInputActive: !!chatInputActive,
            sendBtnActive: !!sendBtnActive,
            pillsCount: pills.length,
            pillsActiveCount: pillsActive.length
        });
    }

    handleSendMessage(message) {
        if (!message) return;
        
        console.log('Sending message:', message);
        
        // Clear input
        const chatInput = document.getElementById('footer-chat-input');
        if (chatInput) chatInput.value = '';
        
        // Add message and switch to chat state
        this.addMessage(message, true);
        this.activateChatState();
        this.showTypingIndicator();
        
        // Simulate AI response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.getAIResponse(message);
            this.addMessage(response, false);
        }, 1500);
    }
    
    handleSendMessageActive(message) {
        if (!message) return;
        
        console.log('Sending active message:', message);
        
        // Clear input
        const chatInputActive = document.getElementById('footer-chat-input-active');
        if (chatInputActive) chatInputActive.value = '';
        
        // Add message
        this.addMessage(message, true);
        this.showTypingIndicator();
        
        // Simulate AI response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.getAIResponse(message);
            this.addMessage(response, false);
        }, 1500);
    }

    handlePillClick(action) {
        const messages = {
            me: "Vertel me meer over jezelf",
            projects: "Wat voor projecten heb je gemaakt?",
            skills: "Welke skills heb je?",
            fun: "Wat vind je leuk aan programmeren?",
            contact: "Hoe kan ik contact met je opnemen?"
        };

        const message = messages[action];
        if (message) {
            if (!this.isActive) {
                this.handleSendMessage(message);
            } else {
                this.handleSendMessageActive(message);
            }
        }
    }

    activateChatState() {
        if (this.isActive) return;
        
        console.log('Activating chat state');
        this.isActive = true;
        
        const initialState = document.getElementById('footer-initial-state');
        const chatState = document.getElementById('footer-chat-state');
        
        if (initialState) initialState.classList.add('hidden');
        if (chatState) chatState.classList.remove('hidden');
    }

    addMessage(text, isUser) {
        console.log('Adding message:', text, 'isUser:', isUser);
        
        const messagesContainer = document.getElementById('footer-messages');
        if (!messagesContainer) {
            console.error('Messages container not found');
            return;
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = `max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
            isUser 
                ? 'bg-[#5B8DEF] text-white' 
                : 'bg-white text-slate-800 border border-slate-200'
        }`;
        messageContent.textContent = text;
        
        messageDiv.appendChild(messageContent);
        messagesContainer.appendChild(messageDiv);
        
        // Auto-scroll
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const typingIndicator = document.getElementById('footer-typing');
        if (typingIndicator) {
            typingIndicator.classList.remove('hidden');
        }
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('footer-typing');
        if (typingIndicator) {
            typingIndicator.classList.add('hidden');
        }
    }

    getAIResponse(input) {
        const lowerInput = input.toLowerCase();
        
        if (lowerInput.includes('frontend') || lowerInput.includes('react') || lowerInput.includes('javascript')) {
            return "Ik ben expert in frontend development! Ik werk met HTML5, CSS3, JavaScript, React en Three.js voor interactieve 3D ervaringen. Bekijk de Frontend Development keycap set voor alle details!";
        } else if (lowerInput.includes('ecommerce') || lowerInput.includes('shopify') || lowerInput.includes('magento')) {
            return "E-commerce is één van mijn specialiteiten! Ik bouw op Shopify, Magento en integreer met marketplaces zoals Bol.com, Amazon en MediaMarkt. Van dropshipping tot enterprise oplossingen.";
        } else if (lowerInput.includes('design') || lowerInput.includes('figma') || lowerInput.includes('ux')) {
            return "Design & UX/UI is mijn passie! Ik werk met Figma, Adobe Creative Suite en focus op gebruikersgericht ontwerp. Van wireframes tot pixel-perfect implementaties.";
        } else if (lowerInput.includes('mobile') || lowerInput.includes('app') || lowerInput.includes('swift')) {
            return "Mobile development doe ik met Swift voor iOS en Flutter voor cross-platform apps. Ook progressive web apps die native voelen op alle devices!";
        } else if (lowerInput.includes('marketing') || lowerInput.includes('ads') || lowerInput.includes('social')) {
            return "Digital marketing is waar data en creativiteit samenkomen! Ik run Meta Ads, Google Ads, TikTok campaigns en email automation met Klaviyo voor maximale ROI.";
        } else if (lowerInput.includes('ai') || lowerInput.includes('chatbot') || lowerInput.includes('automation')) {
            return "AI & Automation is de toekomst! Ik integreer ChatGPT, Claude, Gemini en bouw custom chatbots. Van process automation tot intelligente content generatie.";
        } else if (lowerInput.includes('logistics') || lowerInput.includes('supply') || lowerInput.includes('warehouse')) {
            return "Supply chain en logistics optimalisatie voor e-commerce! Ik automatiseer inbound/outbound processen en inventory management voor maximale efficiëntie.";
        } else if (lowerInput.includes('apple') || lowerInput.includes('sports') || lowerInput.includes('mental health')) {
            return "Buiten tech ben ik Apple product specialist, voetbal fan, train MMA/BJJ/Kickboxing en zet me in voor mental health awareness. Balans is belangrijk!";
        } else if (lowerInput.includes('skills') || lowerInput.includes('keyboard')) {
            return "Dit keyboard toont mijn 8 expertisegebieden: Frontend Dev, E-commerce, Design, Mobile, Marketing, AI, Logistics en Lifestyle. Elk met 50+ tools en technologieën!";
        } else if (lowerInput.includes('contact') || lowerInput.includes('project')) {
            return "Ik ben altijd open voor interessante projecten! Of het nu gaat om e-commerce automation, AI integratie, of mobile apps - laten we praten over jouw ideeën.";
        } else if (lowerInput.includes('portfolio') || lowerInput.includes('werk')) {
            return "Mijn portfolio toont projecten van 3D webapps tot AI chatbots, van Shopify stores tot mobile apps. Deze skills keyboard is zelf ook een portfolio piece!";
        } else if (lowerInput.includes('leuk') || lowerInput.includes('passie') || lowerInput.includes('waarom')) {
            return "Wat ik zo leuk vind aan programmeren? De combinatie van logisch denken en creativiteit! Elke dag leer ik nieuwe dingen, los ik complexe puzzels op en bouw ik dingen die echt impact hebben. Plus de tech community is geweldig! 🚀";
        } else if (lowerInput.includes('jezelf') || lowerInput.includes('wie ben je') || lowerInput.includes('about')) {
            return "Ik ben Lucas - een full-stack developer met een passie voor innovatieve weboplossingen. Van frontend magic tot e-commerce automation, van AI chatbots tot mobile apps. Buiten programmeren ben ik Apple fanboy, voetbal fan en train ik MMA/BJJ! ⚡";
        }
        
        return "Geweldig dat je geïnteresseerd bent! Selecteer een keycap set hierboven om meer te leren over een specifiek expertisegebied, of vraag me specifiek naar frontend, e-commerce, design, mobile, marketing, AI, logistics of lifestyle skills.";
    }
}

// Initialize only once when components are loaded
let footerChatInstance = null;

function initSimpleFooterChat() {
    if (footerChatInstance) {
        console.log('Footer chat already initialized');
        return;
    }
    
    const initialState = document.getElementById('footer-initial-state');
    const chatState = document.getElementById('footer-chat-state');
    
    if (initialState && chatState) {
        console.log('Initializing SimpleFooterChat');
        footerChatInstance = new SimpleFooterChat();
    } else {
        console.log('Footer elements not found, retrying...');
        setTimeout(initSimpleFooterChat, 1000);
    }
}

// Initialize after a delay to ensure components are loaded
setTimeout(initSimpleFooterChat, 2000);

// Export for manual initialization
window.initFooterChat = initSimpleFooterChat;