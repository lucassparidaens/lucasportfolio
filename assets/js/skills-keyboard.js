/* ===================================
   SKILLS KEYBOARD FUNCTIONALITY
   =================================== */

class SkillsKeyboard {
    constructor() {
        this.skillPanel = document.getElementById('skillPanel');
        this.keys = document.querySelectorAll('.key--skill');
        this.spacebarKey = document.querySelector('.key--spacebar');
        
        // Skill data with project associations
        this.skillData = {
            'HTML': {
                name: 'HTML5 & Semantiek',
                level: 'Expert',
                description: 'Semantische HTML5, accessibility best practices, SEO optimization en moderne web standards.',
                projects: ['Portfolio Website', 'GetDjoice', 'E-commerce Platform']
            },
            'CSS': {
                name: 'CSS & Animaties',
                level: 'Expert', 
                description: 'Modern CSS, Flexbox, Grid, animations, responsive design en CSS architectuur.',
                projects: ['Portfolio Website', 'Design System', 'Component Library']
            },
            'JavaScript': {
                name: 'JavaScript ES6+',
                level: 'Expert',
                description: 'Moderne JavaScript, ES6+, Async/Await, DOM manipulation en performance optimization.',
                projects: ['Interactive Websites', 'Web Applications', 'API Integrations']
            },
            'TypeScript': {
                name: 'TypeScript',
                level: 'Advanced',
                description: 'Type safety, interfaces, generics en grote applicatie ontwikkeling.',
                projects: ['React Applications', 'Node.js APIs', 'Component Libraries']
            },
            'React': {
                name: 'React.js',
                level: 'Expert',
                description: 'Hooks, Context API, component design patterns en state management.',
                projects: ['Single Page Apps', 'Dashboard Interfaces', 'E-commerce Sites']
            },
            'Next.js': {
                name: 'Next.js Framework',
                level: 'Advanced',
                description: 'SSR, SSG, App Router, API routes en deployment optimization.',
                projects: ['Portfolio Website', 'EVI Chatbot', 'Business Websites']
            },
            'Tailwind': {
                name: 'Tailwind CSS',
                level: 'Expert',
                description: 'Utility-first CSS framework voor snelle en consistente styling.',
                projects: ['Alle Recente Projecten', 'Design Systems', 'Responsive Websites']
            },
            'Sass': {
                name: 'Sass/SCSS',
                level: 'Advanced',
                description: 'SCSS preprocessing, mixins, variables en component architectuur.',
                projects: ['Legacy Projects', 'Component Libraries', 'Theme Systems']
            },
            'Python': {
                name: 'Python Development',
                level: 'Advanced',
                description: 'Django, Flask, data processing en automation scripting.',
                projects: ['Backend APIs', 'Data Processing', 'Automation Tools']
            },
            'Node.js': {
                name: 'Node.js',
                level: 'Intermediate',
                description: 'Express.js, API development en server-side JavaScript.',
                projects: ['REST APIs', 'Microservices', 'Real-time Apps']
            },
            'Git': {
                name: 'Git & Version Control',
                level: 'Expert',
                description: 'Version control, branching strategies, collaborative development.',
                projects: ['Alle Projecten', 'Team Collaboration', 'Code Reviews']
            },
            'Docker': {
                name: 'Docker & Containers',
                level: 'Intermediate',
                description: 'Containerization, Docker Compose en deployment workflows.',
                projects: ['Development Environments', 'Production Deployments']
            },
            'AWS': {
                name: 'Amazon Web Services',
                level: 'Intermediate',
                description: 'S3, EC2, Lambda functions en cloud infrastructure.',
                projects: ['Static Site Hosting', 'File Storage', 'Serverless Functions']
            },
            'PostgreSQL': {
                name: 'PostgreSQL Database',
                level: 'Advanced',
                description: 'Database design, complex queries, performance optimization.',
                projects: ['Web Applications', 'Data Analytics', 'API Backends']
            },
            'Figma': {
                name: 'Figma Design',
                level: 'Expert',
                description: 'UI/UX design, prototyping, design systems en component libraries.',
                projects: ['All UI Designs', 'Wireframes', 'Design Systems']
            },
            'Three.js': {
                name: 'Three.js & WebGL',
                level: 'Advanced',
                description: '3D graphics, WebGL, interactive experiences en visualizations.',
                projects: ['3D Websites', 'Interactive Demos', 'Product Showcases']
            }
        };
        
        // Sound samples for different key types
        this.sounds = {
            expert: ['/assets/sounds/expert-1.mp3', '/assets/sounds/expert-2.mp3'],
            advanced: ['/assets/sounds/advanced-1.mp3', '/assets/sounds/advanced-2.mp3'],
            intermediate: ['/assets/sounds/intermediate-1.mp3', '/assets/sounds/intermediate-2.mp3'],
            spacebar: ['/assets/sounds/spacebar.mp3']
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.createAudioElements();
    }
    
    bindEvents() {
        // Bind click events to skill keys
        this.keys.forEach(key => {
            key.addEventListener('click', (e) => this.handleKeyClick(e));
            key.addEventListener('mousedown', (e) => this.handleKeyPress(e));
        });
        
        // Bind spacebar event
        if (this.spacebarKey) {
            this.spacebarKey.addEventListener('click', (e) => this.handleSpacebarClick(e));
            this.spacebarKey.addEventListener('mousedown', (e) => this.handleKeyPress(e));
        }
        
        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboardInput(e));
    }
    
    createAudioElements() {
        // Create audio elements for keyboard sounds
        this.audioElements = {};
        
        // Use simple click sounds instead of complex audio files
        Object.keys(this.sounds).forEach(type => {
            this.audioElements[type] = [];
            this.sounds[type].forEach((soundUrl, index) => {
                const audio = new Audio();
                // Use Web Audio API to create simple tones instead of loading files
                this.audioElements[type][index] = this.createTone(type, index);
            });
        });
    }
    
    createTone(type, index) {
        // Create simple tone using Web Audio API
        return {
            play: () => {
                if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
                    const AudioContextClass = AudioContext || webkitAudioContext;
                    const audioContext = new AudioContextClass();
                    
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    // Different frequencies for different skill levels
                    const frequencies = {
                        expert: [800, 900][index] || 800,
                        advanced: [600, 700][index] || 600,
                        intermediate: [400, 500][index] || 400,
                        spacebar: [300][index] || 300
                    };
                    
                    oscillator.frequency.setValueAtTime(frequencies[type], audioContext.currentTime);
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.1);
                }
            }
        };
    }
    
    handleKeyClick(event) {
        const key = event.currentTarget;
        const skill = key.dataset.skill;
        
        this.updateSkillPanel(skill);
        this.playKeySound(key);
        this.animateKey(key);
    }
    
    handleSpacebarClick(event) {
        const key = event.currentTarget;
        this.showFullStackInfo();
        this.playKeySound(key);
        this.animateKey(key);
    }
    
    handleKeyPress(event) {
        const key = event.currentTarget;
        key.classList.add('pressed');
        
        setTimeout(() => {
            key.classList.remove('pressed');
        }, 100);
    }
    
    handleKeyboardInput(event) {
        // Map keyboard keys to skills
        const keyMap = {
            '1': 'HTML',
            '2': 'CSS', 
            '3': 'JavaScript',
            '4': 'TypeScript',
            '5': 'React',
            '6': 'Next.js',
            'q': 'Tailwind',
            'w': 'Sass',
            'e': 'Python',
            'r': 'Node.js',
            't': 'Git',
            'a': 'Docker',
            's': 'AWS',
            'd': 'PostgreSQL',
            'f': 'Figma',
            'g': 'Three.js',
            ' ': 'spacebar'
        };
        
        const skill = keyMap[event.key.toLowerCase()];
        
        if (skill === 'spacebar') {
            this.showFullStackInfo();
            if (this.spacebarKey) {
                this.animateKey(this.spacebarKey);
                this.playKeySound(this.spacebarKey);
            }
        } else if (skill) {
            const keyElement = Array.from(this.keys).find(key => key.dataset.skill === skill);
            if (keyElement) {
                this.updateSkillPanel(skill);
                this.animateKey(keyElement);
                this.playKeySound(keyElement);
            }
        }
    }
    
    updateSkillPanel(skillKey) {
        const skillInfo = this.skillData[skillKey];
        if (!skillInfo) return;
        
        // Update panel content
        const skillName = this.skillPanel.querySelector('.skill-name');
        const skillLevel = this.skillPanel.querySelector('.skill-level');
        const skillDescription = this.skillPanel.querySelector('.skill-description');
        const projectsList = this.skillPanel.querySelector('.projects-list');
        
        if (skillName) skillName.textContent = skillInfo.name;
        if (skillLevel) skillLevel.textContent = skillInfo.level;
        if (skillDescription) skillDescription.textContent = skillInfo.description;
        
        if (projectsList) {
            projectsList.innerHTML = '';
            skillInfo.projects.forEach(project => {
                const projectTag = document.createElement('span');
                projectTag.className = 'project-tag';
                projectTag.textContent = project;
                projectsList.appendChild(projectTag);
            });
        }
        
        // Add active state to panel
        this.skillPanel.classList.add('active');
        
        // Smooth scroll to panel on mobile
        if (window.innerWidth <= 768) {
            this.skillPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    showFullStackInfo() {
        const fullStackInfo = {
            name: 'Fullstack Development',
            level: 'Expert',
            description: 'End-to-end web development met moderne tech stack. Van UI/UX design tot database architectuur en deployment.',
            projects: ['Complete Web Applications', 'E-commerce Platforms', 'SaaS Products', 'Portfolio Websites']
        };
        
        const skillName = this.skillPanel.querySelector('.skill-name');
        const skillLevel = this.skillPanel.querySelector('.skill-level');
        const skillDescription = this.skillPanel.querySelector('.skill-description');
        const projectsList = this.skillPanel.querySelector('.projects-list');
        
        if (skillName) skillName.textContent = fullStackInfo.name;
        if (skillLevel) skillLevel.textContent = fullStackInfo.level;
        if (skillDescription) skillDescription.textContent = fullStackInfo.description;
        
        if (projectsList) {
            projectsList.innerHTML = '';
            fullStackInfo.projects.forEach(project => {
                const projectTag = document.createElement('span');
                projectTag.className = 'project-tag';
                projectTag.textContent = project;
                projectsList.appendChild(projectTag);
            });
        }
        
        this.skillPanel.classList.add('active');
    }
    
    playKeySound(key) {
        const level = key.classList.contains('key--expert') ? 'expert' :
                     key.classList.contains('key--advanced') ? 'advanced' :
                     key.classList.contains('key--spacebar') ? 'spacebar' : 'intermediate';
        
        const soundIndex = Math.floor(Math.random() * (this.audioElements[level]?.length || 1));
        const audio = this.audioElements[level]?.[soundIndex];
        
        if (audio && audio.play) {
            try {
                audio.play();
            } catch (error) {
                console.log('Audio play failed:', error);
            }
        }
        
        // Visual feedback for sound
        key.classList.add('playing-sound');
        setTimeout(() => {
            key.classList.remove('playing-sound');
        }, 200);
    }
    
    animateKey(key) {
        key.classList.add('pressed');
        
        // Add ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'key-ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.3s linear;
            pointer-events: none;
            left: 50%;
            top: 50%;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
        `;
        
        key.style.position = 'relative';
        key.appendChild(ripple);
        
        setTimeout(() => {
            key.classList.remove('pressed');
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 300);
    }
}

// CSS for ripple animation
const rippleCSS = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

// Add ripple CSS to document
if (!document.getElementById('keyboard-ripple-styles')) {
    const style = document.createElement('style');
    style.id = 'keyboard-ripple-styles';
    style.textContent = rippleCSS;
    document.head.appendChild(style);
}

// Initialize the skills keyboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SkillsKeyboard();
});

// Expose globally for potential external access
window.SkillsKeyboard = SkillsKeyboard;
