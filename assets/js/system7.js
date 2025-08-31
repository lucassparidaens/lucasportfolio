// System 7 Interface Manager
const System7 = {
    windows: new Map(),
    zIndex: 100,
    dragData: null,
    resizeData: null,
    userProjects: [],

    // Initialize System 7 Interface
    init() {
        console.log('🖥️ Initializing System 7 Interface...');
        this.updateTime();
        this.setupEventListeners();
        this.setupFileInputs();
        this.loadUserProjects();
        this.loadProjects();
        this.loadSkills();
        
        // Update time every second
        setInterval(() => this.updateTime(), 1000);
        
        console.log('✅ System 7 Interface ready!');
    },

    // Update menu bar time
    updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        const timeElement = document.getElementById('system7-time');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    },

    // Setup global event listeners
    setupEventListeners() {
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.menubar-item')) {
                this.closeAllDropdowns();
            }
        });

        // Prevent context menus on desktop
        document.getElementById('system7-desktop').addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Handle window dragging and resizing
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        document.addEventListener('mouseup', () => this.handleMouseUp());
    },

    // Menu Functions
    toggleAppleMenu() {
        const dropdown = document.getElementById('apple-dropdown');
        const isVisible = dropdown.style.display !== 'none';
        this.closeAllDropdowns();
        if (!isVisible) {
            dropdown.style.display = 'block';
        }
    },

    toggleFileMenu() {
        const dropdown = document.getElementById('file-dropdown');
        const isVisible = dropdown.style.display !== 'none';
        this.closeAllDropdowns();
        if (!isVisible) {
            dropdown.style.display = 'block';
        }
    },

    closeAllDropdowns() {
        document.querySelectorAll('.system7-dropdown').forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    },

    // Window Management
    createWindow(title, content, options = {}) {
        const {
            width = 200,
            height = 150,
            x = 20 + (this.windows.size * 15),
            y = 30 + (this.windows.size * 15),
            resizable = true,
            windowId = `window-${Date.now()}`
        } = options;

        const windowElement = document.createElement('div');
        windowElement.className = 'system7-window opening';
        windowElement.id = windowId;
        windowElement.style.cssText = `
            width: ${width}px;
            height: ${height}px;
            left: ${x}px;
            top: ${y}px;
            z-index: ${++this.zIndex};
        `;

        windowElement.innerHTML = `
            <div class="window-titlebar" onmousedown="System7.startDrag('${windowId}', event)">
                <div class="window-close" onclick="System7.closeWindow('${windowId}')">
                    <span style="font-size: 8px;">×</span>
                </div>
                <div class="window-title">${title}</div>
            </div>
            <div class="window-content">${content}</div>
            ${resizable ? `<div class="window-resizer" onmousedown="System7.startResize('${windowId}', event)"></div>` : ''}
        `;

        // Add click listener to bring window to front
        windowElement.addEventListener('mousedown', () => this.bringToFront(windowId));

        document.getElementById('system7-windows').appendChild(windowElement);
        this.windows.set(windowId, { element: windowElement, title, x, y, width, height });
        this.bringToFront(windowId);

        // Remove opening animation class after animation
        setTimeout(() => windowElement.classList.remove('opening'), 200);

        return windowId;
    },

    closeWindow(windowId) {
        const window = this.windows.get(windowId);
        if (window) {
            window.element.remove();
            this.windows.delete(windowId);
        }
        this.closeAllDropdowns();
    },

    bringToFront(windowId) {
        // Remove active class from all windows
        document.querySelectorAll('.system7-window').forEach(w => w.classList.remove('active'));
        
        // Add active class and update z-index
        const window = this.windows.get(windowId);
        if (window) {
            window.element.classList.add('active');
            window.element.style.zIndex = ++this.zIndex;
        }
    },

    // Window Dragging
    startDrag(windowId, event) {
        event.preventDefault();
        const window = this.windows.get(windowId);
        if (!window) return;

        this.bringToFront(windowId);
        this.dragData = {
            windowId,
            startX: event.clientX,
            startY: event.clientY,
            startLeft: parseInt(window.element.style.left),
            startTop: parseInt(window.element.style.top)
        };
    },

    // Window Resizing
    startResize(windowId, event) {
        event.preventDefault();
        event.stopPropagation();
        const window = this.windows.get(windowId);
        if (!window) return;

        this.bringToFront(windowId);
        this.resizeData = {
            windowId,
            startX: event.clientX,
            startY: event.clientY,
            startWidth: parseInt(window.element.style.width),
            startHeight: parseInt(window.element.style.height)
        };
    },

    handleMouseMove(event) {
        if (this.dragData) {
            const { windowId, startX, startY, startLeft, startTop } = this.dragData;
            const window = this.windows.get(windowId);
            if (window) {
                const newLeft = startLeft + (event.clientX - startX);
                const newTop = startTop + (event.clientY - startY);
                
                // Keep window within bounds
                const maxLeft = window.innerWidth - 100;
                const maxTop = window.innerHeight - 50;
                
                window.element.style.left = `${Math.max(0, Math.min(maxLeft, newLeft))}px`;
                window.element.style.top = `${Math.max(20, Math.min(maxTop, newTop))}px`;
            }
        }

        if (this.resizeData) {
            const { windowId, startX, startY, startWidth, startHeight } = this.resizeData;
            const window = this.windows.get(windowId);
            if (window) {
                const newWidth = Math.max(200, startWidth + (event.clientX - startX));
                const newHeight = Math.max(100, startHeight + (event.clientY - startY));
                
                window.element.style.width = `${newWidth}px`;
                window.element.style.height = `${newHeight}px`;
            }
        }
    },

    handleMouseUp() {
        this.dragData = null;
        this.resizeData = null;
    },

    // Setup file input handling
    setupFileInputs() {
        const pdfInput = document.getElementById('project-pdf');
        const pdfInfo = document.getElementById('pdf-file-info');
        
        if (pdfInput && pdfInfo) {
            pdfInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    if (file.type === 'application/pdf') {
                        pdfInfo.textContent = `📄 ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
                        pdfInfo.style.color = 'var(--text)';
                    } else {
                        pdfInfo.textContent = '❌ Please select a PDF file';
                        pdfInfo.style.color = 'red';
                        pdfInput.value = '';
                    }
                } else {
                    pdfInfo.textContent = 'No file selected';
                    pdfInfo.style.color = 'var(--text-muted)';
                }
            });
        }
    },

    // Application Functions
    showAbout() {
        document.getElementById('about-modal').style.display = 'flex';
        this.closeAllDropdowns();
    },

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    },

    openCalculator() {
        const content = `
            <div class="calculator">
                <div class="calc-display" id="calc-display">0</div>
                <div class="calc-buttons">
                    <button class="calc-button" onclick="Calculator.clear()">C</button>
                    <button class="calc-button" onclick="Calculator.input('±')">±</button>
                    <button class="calc-button" onclick="Calculator.input('%')">%</button>
                    <button class="calc-button" onclick="Calculator.input('/')">÷</button>
                    
                    <button class="calc-button" onclick="Calculator.input('7')">7</button>
                    <button class="calc-button" onclick="Calculator.input('8')">8</button>
                    <button class="calc-button" onclick="Calculator.input('9')">9</button>
                    <button class="calc-button" onclick="Calculator.input('*')">×</button>
                    
                    <button class="calc-button" onclick="Calculator.input('4')">4</button>
                    <button class="calc-button" onclick="Calculator.input('5')">5</button>
                    <button class="calc-button" onclick="Calculator.input('6')">6</button>
                    <button class="calc-button" onclick="Calculator.input('-')">−</button>
                    
                    <button class="calc-button" onclick="Calculator.input('1')">1</button>
                    <button class="calc-button" onclick="Calculator.input('2')">2</button>
                    <button class="calc-button" onclick="Calculator.input('3')">3</button>
                    <button class="calc-button" onclick="Calculator.input('+')">+</button>
                    
                    <button class="calc-button wide" onclick="Calculator.input('0')">0</button>
                    <button class="calc-button" onclick="Calculator.input('.')">.</button>
                    <button class="calc-button" onclick="Calculator.calculate()">=</button>
                </div>
            </div>
        `;
        
        this.createWindow('Calculator', content, { width: 160, height: 200, resizable: false });
        this.closeAllDropdowns();
    },

    // Project Management Functions
    addProject() {
        document.getElementById('add-project-panel').style.display = 'block';
        this.closeAllDropdowns();
    },

    async saveProject() {
        const name = document.getElementById('project-name').value.trim();
        const icon = document.getElementById('project-icon').value.trim() || '📄';
        const description = document.getElementById('project-description').value.trim();
        const technologies = document.getElementById('project-technologies').value.trim();
        const url = document.getElementById('project-url').value.trim();
        const caseHtml = document.getElementById('project-case').value.trim();
        const pdfFile = document.getElementById('project-pdf').files[0];

        if (!name) {
            alert('Please enter a project name.');
            return;
        }

        let pdfData = null;
        if (pdfFile) {
            try {
                pdfData = await this.fileToBase64(pdfFile);
            } catch (error) {
                console.error('Error converting PDF to base64:', error);
                alert('Error processing PDF file. Please try again.');
                return;
            }
        }

        const project = {
            id: `user-${Date.now()}`,
            name,
            icon,
            description,
            technologies: technologies.split(',').map(t => t.trim()).filter(t => t),
            links: {
                live: url || null
            },
            caseHtml: caseHtml || null,
            pdf: pdfData ? {
                name: pdfFile.name,
                data: pdfData,
                size: pdfFile.size
            } : null,
            isUserProject: true,
            createdAt: new Date().toISOString()
        };

        this.userProjects.push(project);
        this.saveUserProjects();
        this.cancelAddProject();
        
        // Show success message
        this.showMessage(`Project "${name}" added successfully!`);
    },

    // Convert file to base64 for storage
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    },

    cancelAddProject() {
        document.getElementById('add-project-panel').style.display = 'none';
        // Clear form
        document.getElementById('project-name').value = '';
        document.getElementById('project-icon').value = '';
        document.getElementById('project-description').value = '';
        document.getElementById('project-technologies').value = '';
        document.getElementById('project-url').value = '';
        document.getElementById('project-case').value = '';
        document.getElementById('project-pdf').value = '';
        document.getElementById('pdf-file-info').textContent = 'No file selected';
    },

    newProject() {
        this.addProject();
    },

    showMessage(message) {
        const content = `
            <div style="padding: 16px; text-align: center;">
                <div style="font-size: 24px; margin-bottom: 12px;">✅</div>
                <p>${message}</p>
                <button onclick="System7.closeWindow('${this.createWindow('Message', `<div style="padding: 16px; text-align: center;"><div style="font-size: 24px; margin-bottom: 12px;">✅</div><p>${message}</p></div>`, { width: 200, height: 120, resizable: false }).replace('window-', '')}')" 
                        style="margin-top: 12px; padding: 4px 12px; background: #c0c0c0; border: 1px outset #c0c0c0; cursor: pointer;">
                    OK
                </button>
            </div>
        `;
        
        setTimeout(() => {
            const windows = document.querySelectorAll('.system7-window');
            if (windows.length > 0) {
                const lastWindow = windows[windows.length - 1];
                setTimeout(() => {
                    if (lastWindow && lastWindow.parentNode) {
                        lastWindow.remove();
                    }
                }, 3000);
            }
        }, 100);
    },

    // Local Storage Functions
    loadUserProjects() {
        const stored = localStorage.getItem('system7-user-projects');
        if (stored) {
            try {
                this.userProjects = JSON.parse(stored);
                console.log('📁 Loaded user projects:', this.userProjects.length);
            } catch (e) {
                console.error('Error loading user projects:', e);
                this.userProjects = [];
            }
        }
    },

    saveUserProjects() {
        try {
            localStorage.setItem('system7-user-projects', JSON.stringify(this.userProjects));
            console.log('💾 Saved user projects:', this.userProjects.length);
        } catch (e) {
            console.error('Error saving user projects:', e);
        }
    },

    deleteProject(projectId) {
        if (confirm('Delete this project?')) {
            this.userProjects = this.userProjects.filter(p => p.id !== projectId);
            this.saveUserProjects();
            
            // Close any open windows for this project
            const windows = document.querySelectorAll('.system7-window');
            windows.forEach(win => {
                if (win.querySelector('.window-title').textContent.includes(projectId)) {
                    win.remove();
                }
            });
            
            this.showMessage('Project deleted successfully!');
        }
    },

    openNotepad() {
        const content = `
            <div style="width: 100%; height: 100%;">
                <textarea style="width: calc(100% - 4px); height: calc(100% - 4px); border: none; outline: none; font-family: Monaco, monospace; font-size: 11px; resize: none; padding: 4px;" placeholder="Welcome to SimpleText...

This is a simple text editor recreation in System 7 style."></textarea>
            </div>
        `;
        
        this.createWindow('SimpleText - Untitled', content, { width: 450, height: 350 });
        this.closeAllDropdowns();
    },

    openProjects() {
        const defaultProjects = this.getProjectsData();
        const allProjects = [...defaultProjects, ...this.userProjects];
        
        let content = '<div class="projects-grid">';
        
        allProjects.forEach(project => {
            content += `
                <div class="project-item" onclick="System7.openProjectViewer('${project.id}', 'case')">
                    <span class="project-icon">${project.icon}</span>
                    <div class="project-name">${project.name}</div>
                    <div class="project-indicators">
                        ${project.caseHtml ? '<div class="case-indicator">📋</div>' : ''}
                        ${project.links?.live ? '<div class="live-indicator">🌐</div>' : ''}
                    </div>
                </div>
            `;
        });
        
        content += '</div>';
        
        this.createWindow('📁 Portfolio Collection', content, { width: 300, height: 220 });
        this.closeAllDropdowns();
    },

    openProjectDetail(projectId) {
        this.openProjectViewer(projectId, 'case');
    },

    // New dual-view project viewer
    openProjectViewer(projectId, initialView = 'case') {
        const defaultProjects = this.getProjectsData();
        const allProjects = [...defaultProjects, ...this.userProjects];
        const project = allProjects.find(p => p.id === projectId);
        if (!project) return;

        const windowId = `project-viewer-${projectId}`;
        
        // Check if window already exists
        const existingWindow = document.getElementById(windowId);
        if (existingWindow) {
            this.bringWindowToFront(existingWindow);
            this.switchProjectView(projectId, initialView);
            return;
        }

        const content = `
            <div class="project-viewer" id="viewer-${projectId}">
                <div class="project-viewer-toolbar">
                    <button class="viewer-tab active" data-view="case" onclick="System7.switchProjectView('${projectId}', 'case')">
                        📋 Project Case
                    </button>
                    <button class="viewer-tab" data-view="view" onclick="System7.switchProjectView('${projectId}', 'view')">
                        🌐 Project View
                    </button>
                    <div class="toolbar-spacer"></div>
                    <button class="viewer-maximize" onclick="System7.maximizeProjectView('${projectId}')" title="Maximize">
                        ⤢
                    </button>
                </div>
                
                <div class="project-viewer-content">
                    <div class="viewer-pane case-pane active" id="case-${projectId}">
                        ${project.caseHtml || this.getDefaultCaseHtml(project)}
                    </div>
                    
                    <div class="viewer-pane view-pane" id="view-${projectId}">
                        ${this.getProjectViewHtml(project)}
                    </div>
                </div>
            </div>
        `;
        
        this.createWindow(`${project.name} - Portfolio`, content, { 
            width: 400, 
            height: 300,
            windowId: windowId
        });
    },

    // Switch between case and view
    switchProjectView(projectId, viewType) {
        const viewer = document.getElementById(`viewer-${projectId}`);
        if (!viewer) return;

        // Update tabs
        const tabs = viewer.querySelectorAll('.viewer-tab');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.view === viewType);
        });

        // Update panes
        const panes = viewer.querySelectorAll('.viewer-pane');
        panes.forEach(pane => {
            pane.classList.toggle('active', pane.id.includes(viewType));
        });
    },

    // Maximize project view (fullscreen iframe)
    maximizeProjectView(projectId) {
        const defaultProjects = this.getProjectsData();
        const allProjects = [...defaultProjects, ...this.userProjects];
        const project = allProjects.find(p => p.id === projectId);
        if (!project || !project.links?.live) return;

        const content = `
            <div class="project-fullscreen-view">
                <div class="fullscreen-header">
                    <span class="project-name">${project.name} - Live View</span>
                    <button class="close-fullscreen" onclick="this.closest('.system7-window').remove()">✕ Close</button>
                </div>
                <div class="fullscreen-iframe-container">
                    <iframe 
                        src="${project.links.live}" 
                        class="fullscreen-iframe"
                        onload="this.style.display='block'; this.nextElementSibling.style.display='none';"
                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                        style="display: none;">
                    </iframe>
                    <div class="iframe-error">
                        <div class="error-icon">🚫</div>
                        <div class="error-message">Deze website kan niet in een iframe worden weergegeven</div>
                        <button class="action-button primary" onclick="window.open('${project.links.live}', '_blank')">
                            🔗 Open in Nieuw Tabblad
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.createWindow(`${project.name} - Fullscreen`, content, { 
            width: 480, 
            height: 360,
            x: 5,
            y: 5
        });
    },

    // Generate default case HTML for projects without caseHtml
    getDefaultCaseHtml(project) {
        return `
            <div class="case-study">
                <h3>${project.icon} ${project.name}</h3>
                
                <div class="case-section">
                    <h4>📋 Project Overview</h4>
                    <p>${project.description}</p>
                </div>
                
                <div class="case-section">
                    <h4>🛠️ Technologies Used</h4>
                    <div class="tech-tags">
                        ${Array.isArray(project.technologies) ? 
                            project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('') :
                            `<span class="tech-tag">${project.technologies}</span>`
                        }
                    </div>
                </div>
                
                <div class="case-section">
                    <h4>📝 Case Study</h4>
                    <p><em>Deze case study wordt binnenkort toegevoegd...</em></p>
                </div>
            </div>
        `;
    },

    // Generate project view HTML (iframe)
    getProjectViewHtml(project) {
        if (!project.links?.live) {
            return `
                <div class="no-live-view">
                    <div class="no-view-icon">🚫</div>
                    <div class="no-view-message">Geen live website beschikbaar</div>
                </div>
            `;
        }

        return `
            <div class="iframe-container">
                <iframe 
                    src="${project.links.live}" 
                    class="project-iframe"
                    onload="this.style.display='block'; this.nextElementSibling.style.display='none';"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                    style="display: none;">
                </iframe>
                <div class="iframe-error">
                    <div class="error-icon">🚫</div>
                    <div class="error-message">Website kan niet in iframe worden weergegeven</div>
                    <button class="action-button primary" onclick="window.open('${project.links.live}', '_blank')">
                        🔗 Open in Nieuw Tabblad
                    </button>
                </div>
            </div>
        `;
    },

    // Helper function to bring window to front
    bringWindowToFront(windowElement) {
        this.zIndex++;
        windowElement.style.zIndex = this.zIndex;
        
        // Update active window styling
        document.querySelectorAll('.system7-window').forEach(w => w.classList.remove('active'));
        windowElement.classList.add('active');
    },

    // Preview website in System 7 window
    previewWebsite(projectId) {
        const defaultProjects = this.getProjectsData();
        const allProjects = [...defaultProjects, ...this.userProjects];
        const project = allProjects.find(p => p.id === projectId);
        if (!project || !project.url || project.url === '#') return;

        // Try to create iframe preview (might fail due to CORS)
        const content = `
            <div style="width: 100%; height: 100%; position: relative;">
                <iframe 
                    src="${project.url}" 
                    class="website-preview"
                    onload="this.style.display='block'; this.nextElementSibling.style.display='none';"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                    style="display: none;">
                </iframe>
                <div class="preview-error">
                    <div class="preview-error-icon">🚫</div>
                    <div>Website preview blocked by CORS policy</div>
                    <div style="margin-top: 8px;">
                        <button class="action-button primary" onclick="window.open('${project.url}', '_blank')">
                            Open in New Tab
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.createWindow(`${project.name} - Preview`, content, { width: 320, height: 240 });
    },

    // View PDF in System 7 window
    viewPDF(projectId) {
        const defaultProjects = this.getProjectsData();
        const allProjects = [...defaultProjects, ...this.userProjects];
        const project = allProjects.find(p => p.id === projectId);
        if (!project || !project.pdf) return;

        // Support both base64 data (user uploads) and file URLs (default projects)
        const pdfSource = project.pdf.data || project.pdf.url;
        const fileSizeMB = (project.pdf.size / 1024 / 1024).toFixed(2);

        const content = `
            <div class="pdf-viewer">
                <div class="pdf-controls">
                    <button class="pdf-button" onclick="System7.downloadPDF('${project.id}')">Download</button>
                    <span style="flex: 1; text-align: center;">📄 ${project.pdf.name}</span>
                    <span>${fileSizeMB} MB</span>
                </div>
                <div class="pdf-content">
                    <embed src="${pdfSource}" type="application/pdf" width="100%" height="100%" 
                           style="border: none;" />
                </div>
            </div>
        `;
        
        this.createWindow(`${project.name} - Portfolio`, content, { width: 350, height: 250 });
    },

    // View PDF in fullscreen mode
    viewPDFFullscreen(projectId) {
        const defaultProjects = this.getProjectsData();
        const allProjects = [...defaultProjects, ...this.userProjects];
        const project = allProjects.find(p => p.id === projectId);
        if (!project || !project.pdf) return;

        // Support both base64 data (user uploads) and file URLs (default projects)
        const pdfSource = project.pdf.data || project.pdf.url;
        const fileSizeMB = (project.pdf.size / 1024 / 1024).toFixed(2);

        const content = `
            <div class="pdf-fullscreen-viewer">
                <div class="pdf-fullscreen-header">
                    <div class="pdf-header-info">
                        <span class="pdf-project-name">${project.name} - Portfolio</span>
                        <span class="pdf-file-info">📄 ${project.pdf.name} (${fileSizeMB} MB)</span>
                    </div>
                    <div class="pdf-header-controls">
                        <button class="pdf-button" onclick="System7.downloadPDF('${project.id}')">⬇️ Download</button>
                        <button class="pdf-button" onclick="window.open('${pdfSource}', '_blank')">🔗 Open in Tab</button>
                        <button class="pdf-button close-btn" onclick="this.closest('.system7-window').remove()">✕ Close</button>
                    </div>
                </div>
                <div class="pdf-fullscreen-content">
                    <embed src="${pdfSource}" type="application/pdf" width="100%" height="100%" 
                           style="border: none; background: white;" />
                </div>
            </div>
        `;
        
        // Create larger fullscreen window
        this.createWindow(`${project.name} - Portfolio Fullscreen`, content, { 
            width: 480, 
            height: 360,
            x: 10,
            y: 10
        });
    },

    // Download PDF file
    downloadPDF(projectId) {
        const defaultProjects = this.getProjectsData();
        const allProjects = [...defaultProjects, ...this.userProjects];
        const project = allProjects.find(p => p.id === projectId);
        if (!project || !project.pdf) return;

        const link = document.createElement('a');
        // Support both base64 data (user uploads) and file URLs (default projects)
        link.href = project.pdf.data || project.pdf.url;
        link.download = project.pdf.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },

    openSkills() {
        const skillsData = this.getSkillsData();
        let content = '<div class="skills-categories">';
        
        Object.entries(skillsData).forEach(([category, skills]) => {
            content += `
                <div class="skill-category">
                    <h4>${category}</h4>
                    <div class="skill-items">
                        ${skills.map(skill => `<span class="skill-pill">${skill}</span>`).join('')}
                    </div>
                </div>
            `;
        });
        
        content += '</div>';
        
        this.createWindow('Skills & Tools', content, { width: 260, height: 180 });
        this.closeAllDropdowns();
    },

    openTrash() {
        const content = `
            <div style="text-align: center; padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 16px;">🗑️</div>
                <p>The Trash is empty.</p>
                <p style="font-size: 11px; color: #666; margin-top: 16px;">
                    To delete items, drag them to the Trash.
                </p>
            </div>
        `;
        
        this.createWindow('Trash', content, { width: 300, height: 200 });
        this.closeAllDropdowns();
    },

    openDisk() {
        const content = `
            <div class="projects-grid">
                <div class="project-item" onclick="System7.openProjects()">
                    <span class="project-icon">📁</span>
                    <div class="project-name">Projects</div>
                </div>
                <div class="project-item" onclick="System7.openSkills()">
                    <span class="project-icon">⚡</span>
                    <div class="project-name">Skills</div>
                </div>
                <div class="project-item">
                    <span class="project-icon">📄</span>
                    <div class="project-name">Resume.txt</div>
                </div>
                <div class="project-item">
                    <span class="project-icon">📧</span>
                    <div class="project-name">Contact Info</div>
                </div>
            </div>
        `;
        
        this.createWindow('Macintosh HD', content, { width: 400, height: 300 });
        this.closeAllDropdowns();
    },

    // File Menu Functions
    newFolder() {
        alert('New Folder: This feature is not yet implemented in this demo.');
        this.closeAllDropdowns();
    },

    openItem() {
        alert('Open: This feature is not yet implemented in this demo.');
        this.closeAllDropdowns();
    },

    getInfo() {
        alert('Get Info: This feature is not yet implemented in this demo.');
        this.closeAllDropdowns();
    },

    // Data Management
    loadProjects() {
        // This would typically load from an API or local storage
        console.log('📁 Loading projects data...');
    },

    loadSkills() {
        // This would typically load from an API or local storage
        console.log('⚡ Loading skills data...');
    },

    getProjectsData() {
        return [
            {
                id: 'gamestoelen',
                name: 'Gamestoelen.nl',
                icon: '🪑',
                description: 'E-commerce platform voor gaming chairs met geavanceerde filtering, reviews en vergelijkingsfuncties. Shopify-based webshop met custom functionaliteiten.',
                technologies: ['Shopify', 'JavaScript', 'CSS', 'Liquid', 'Marketing Automation'],
                links: {
                    live: 'https://gamestoelen.nl'
                },
                caseHtml: `
                    <div class="case-study">
                        <h3>🪑 Gamestoelen.nl - E-commerce Platform</h3>
                        
                        <div class="case-section">
                            <h4>📋 Project Overview</h4>
                            <p>Een comprehensive e-commerce platform gespecialiseerd in gaming chairs met geavanceerde product filtering, gebruikersreviews en vergelijkingsfuncties. Gebouwd op Shopify met custom functionaliteiten.</p>
                        </div>
                        
                        <div class="case-section">
                            <h4>🎯 Doelstellingen</h4>
                            <ul>
                                <li>User-friendly product discovery experience</li>
                                <li>Advanced filtering en search functionaliteit</li>
                                <li>Trusted review en rating systeem</li>
                                <li>Optimized conversion funnel</li>
                            </ul>
                        </div>
                        
                        <div class="case-section">
                            <h4>🛠️ Technische Aanpak</h4>
                            <p><strong>Platform:</strong> Shopify Plus voor e-commerce foundation<br>
                            <strong>Customization:</strong> Liquid templating voor custom features<br>
                            <strong>Frontend:</strong> JavaScript en CSS voor interactive elements<br>
                            <strong>Marketing:</strong> Automation tools voor customer retention</p>
                        </div>
                        
                        <div class="case-section">
                            <h4>📊 Resultaten</h4>
                            <div class="results-grid">
                                <div class="result-item">
                                    <strong>Conversion Rate</strong><br>
                                    +45% door improved product discovery
                                </div>
                                <div class="result-item">
                                    <strong>User Experience</strong><br>
                                    Advanced filtering en comparison tools
                                </div>
                                <div class="result-item">
                                    <strong>Reviews</strong><br>
                                    Trusted review systeem verhoogt conversie
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                id: 'gamestoelenexpert',
                name: 'Gamestoelenexpert',
                icon: '🎮',
                description: 'Specialist gaming chair platform met uitgebreide product vergelijkingen en expert reviews voor de perfecte gaming setup.',
                technologies: ['Shopify', 'SEO', 'Content Marketing', 'Affiliate Marketing'],
                links: {
                    live: 'https://gamestoelenexpert.nl'
                },
                caseHtml: `
                    <div class="case-study">
                        <h3>🎮 Gamestoelenexpert - Review Platform</h3>
                        
                        <div class="case-section">
                            <h4>📋 Project Overview</h4>
                            <p>Een specialist platform voor gaming chair reviews en vergelijkingen, gericht op het helpen van gamers bij het vinden van de perfecte gaming setup door middel van expert evaluaties.</p>
                        </div>
                        
                        <div class="case-section">
                            <h4>🎯 Doelstellingen</h4>
                            <ul>
                                <li>Authoritative expert reviews en ratings</li>
                                <li>Comprehensive product vergelijkingen</li>
                                <li>SEO-optimized content voor organic traffic</li>
                                <li>Affiliate revenue optimization</li>
                            </ul>
                        </div>
                        
                        <div class="case-section">
                            <h4>📊 Resultaten</h4>
                            <div class="results-grid">
                                <div class="result-item">
                                    <strong>SEO Performance</strong><br>
                                    Top rankings voor gaming chair keywords
                                </div>
                                <div class="result-item">
                                    <strong>User Engagement</strong><br>
                                    High-quality expert content verhoogt trust
                                </div>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                id: 'pettech',
                name: 'Pettech.nl',
                icon: '🐕',
                description: 'Tech oplossingen voor huisdierverzorging inclusief slimme voerautomaten, GPS trackers en gezondheidsmonitoring.',
                technologies: ['React', 'Node.js', 'MongoDB', 'IoT', 'E-commerce'],
                url: 'https://pettech.nl'
            },
            {
                id: 'getdjoice',
                name: 'Getdjoice.com',
                icon: '🎵',
                description: 'Voice en audio solutions platform voor podcasters en content creators met advanced audio processing.',
                technologies: ['Vue.js', 'Express.js', 'WebRTC', 'FFmpeg', 'Audio Processing'],
                links: {
                    live: 'https://getdjoice.com'
                },
                caseHtml: `
                    <div class="case-study">
                        <h3>🎵 Getdjoice.com - Audio Platform</h3>
                        
                        <div class="case-section">
                            <h4>📋 Project Overview</h4>
                            <p>Een innovatieve voice en audio solutions platform specifiek ontworpen voor podcasters en content creators. Het platform biedt geavanceerde audio processing tools en real-time communicatie mogelijkheden.</p>
                        </div>
                        
                        <div class="case-section">
                            <h4>🎯 Doelstellingen</h4>
                            <ul>
                                <li>Professionele audio processing voor content creators</li>
                                <li>Real-time communicatie tussen gebruikers</li>
                                <li>Gebruiksvriendelijke interface voor audio editing</li>
                                <li>Scalable platform architectuur</li>
                            </ul>
                        </div>
                        
                        <div class="case-section">
                            <h4>🛠️ Technische Aanpak</h4>
                            <p><strong>Frontend:</strong> Vue.js voor reactive user interface<br>
                            <strong>Backend:</strong> Express.js met Node.js runtime<br>
                            <strong>Real-time:</strong> WebRTC voor directe audio communicatie<br>
                            <strong>Audio Processing:</strong> FFmpeg integratie voor advanced audio manipulation</p>
                        </div>
                        
                        <div class="case-section">
                            <h4>📊 Resultaten</h4>
                            <div class="results-grid">
                                <div class="result-item">
                                    <strong>Performance</strong><br>
                                    Real-time audio processing zonder latency
                                </div>
                                <div class="result-item">
                                    <strong>User Experience</strong><br>
                                    Intuitive interface voor professional audio editing
                                </div>
                                <div class="result-item">
                                    <strong>Scalability</strong><br>
                                    Microservices architectuur voor growth
                                </div>
                            </div>
                        </div>
                        
                        <div class="case-section">
                            <h4>🏆 Evaluatie</h4>
                            <p>Het project heeft succesvol een professionele audio platform geleverd die voldoet aan de behoeften van content creators. De integratie van WebRTC en FFmpeg heeft geleid tot een krachtige tool voor audio processing en real-time communicatie.</p>
                        </div>
                    </div>
                `
            },
            {
                id: 'freakygoodz',
                name: 'Freakygoodz.com',
                icon: '🛍️',
                description: 'Lifestyle en fashion e-commerce met unieke product customization features en social commerce integratie.',
                technologies: ['WooCommerce', 'PHP', 'MySQL', 'jQuery', 'Social Commerce'],
                url: 'https://freakygoodz.com'
            },
            {
                id: 'dakkie',
                name: 'Dakkie App',
                icon: '📱',
                description: 'Mobile app voor dak inspectie en onderhoud planning met camera AI en rapportage functionaliteiten.',
                technologies: ['React Native', 'Firebase', 'Camera API', 'AI Vision', 'Reports'],
                url: '#'
            },
            {
                id: 'margriet',
                name: 'Margriet Magazine',
                icon: '📰',
                description: 'Content marketing en management voor Margriet magazine digital platform met SEO optimalisatie.',
                technologies: ['WordPress', 'Content Strategy', 'SEO', 'Analytics', 'Social Media'],
                url: '#'
            }
        ];
    },

    getSkillsData() {
        return {
            'Web Development': [
                'HTML5', 'CSS3', 'JavaScript', 'React', 'Vue.js', 'Node.js', 'Express.js', 'PHP', 'Python'
            ],
            'E-commerce': [
                'Shopify', 'WooCommerce', 'Magento', 'Payment Integration', 'Inventory Management'
            ],
            'Marketing Automation': [
                'Klaviyo', 'Mailchimp', 'Meta Ads', 'Google Ads', 'TikTok Ads', 'Email Marketing'
            ],
            'AI & Tools': [
                'ChatGPT', 'Claude', 'Cursor', 'Mistral', 'Automation', 'Chatbot Development'
            ],
            'Design': [
                'Figma', 'Photoshop', 'Illustrator', 'Canva', 'UI/UX Design', 'Responsive Design'
            ],
            'Database & Backend': [
                'MySQL', 'MongoDB', 'Firebase', 'REST APIs', 'GraphQL', 'Docker'
            ],
            'Mobile': [
                'React Native', 'Mobile-First Design', 'Progressive Web Apps', 'iOS', 'Android'
            ],
            'Other': [
                'Git', 'SEO', 'Analytics', 'Project Management', 'Supply Chain', 'Logistics'
            ]
        };
    }
};

// Calculator Logic
const Calculator = {
    display: '0',
    operand1: null,
    operator: null,
    waitingForOperand: false,

    updateDisplay() {
        const display = document.getElementById('calc-display');
        if (display) {
            display.textContent = this.display;
        }
    },

    input(value) {
        if (['/', '*', '-', '+'].includes(value)) {
            this.inputOperator(value);
        } else if (value === '=') {
            this.calculate();
        } else if (value === '.') {
            this.inputDecimal();
        } else if (value === '±') {
            this.toggleSign();
        } else if (value === '%') {
            this.percentage();
        } else {
            this.inputNumber(value);
        }
        this.updateDisplay();
    },

    inputNumber(num) {
        if (this.waitingForOperand) {
            this.display = num;
            this.waitingForOperand = false;
        } else {
            this.display = this.display === '0' ? num : this.display + num;
        }
    },

    inputOperator(nextOperator) {
        const inputValue = parseFloat(this.display);

        if (this.operand1 === null) {
            this.operand1 = inputValue;
        } else if (this.operator) {
            const currentValue = this.operand1 || 0;
            const newValue = this.performCalculation(currentValue, inputValue, this.operator);

            this.display = String(newValue);
            this.operand1 = newValue;
        }

        this.waitingForOperand = true;
        this.operator = nextOperator;
    },

    inputDecimal() {
        if (this.waitingForOperand) {
            this.display = '0.';
            this.waitingForOperand = false;
        } else if (this.display.indexOf('.') === -1) {
            this.display += '.';
        }
    },

    clear() {
        this.display = '0';
        this.operand1 = null;
        this.operator = null;
        this.waitingForOperand = false;
        this.updateDisplay();
    },

    toggleSign() {
        if (this.display !== '0') {
            this.display = this.display.startsWith('-') 
                ? this.display.slice(1) 
                : '-' + this.display;
        }
    },

    percentage() {
        const value = parseFloat(this.display);
        this.display = String(value / 100);
    },

    calculate() {
        const inputValue = parseFloat(this.display);

        if (this.operand1 !== null && this.operator) {
            const newValue = this.performCalculation(this.operand1, inputValue, this.operator);
            this.display = String(newValue);
            this.operand1 = null;
            this.operator = null;
            this.waitingForOperand = true;
        }
    },

    performCalculation(operand1, operand2, operator) {
        switch (operator) {
            case '+': return operand1 + operand2;
            case '-': return operand1 - operand2;
            case '*': return operand1 * operand2;
            case '/': return operand2 !== 0 ? operand1 / operand2 : 0;
            default: return operand2;
        }
    }
};

// Initialize System 7 when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if System 7 section exists
    if (document.querySelector('.system7-section')) {
        System7.init();
    }
});
