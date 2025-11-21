import { apps as initialApps } from '../../data/apps.js';
import { categories as initialCategories } from '../../data/categories.js';

class LucasAppStore {
    constructor() {
        this.apps = [...initialApps];
        this.categories = [...initialCategories];
        this.currentTab = 'today';
        this.searchQuery = '';

        this.init();
    }

    init() {
        this.flattenApps();
        this.renderNavigation();
        this.renderTab(this.currentTab);
        this.setupEventListeners();
        this.setupAIInterface();
    }

    flattenApps() {
        // Combine core apps and category apps into a single searchable list
        this.allApps = [...this.apps];
        this.categories.forEach(cat => {
            cat.apps.forEach(app => {
                if (!this.allApps.find(a => a.id === app.id)) {
                    this.allApps.push(app);
                }
            });
        });
    }

    setupEventListeners() {
        // Tab Navigation
        document.querySelectorAll('.app-store-nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Search Input
        const searchInput = document.getElementById('app-store-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value;
                if (this.currentTab !== 'search' && this.searchQuery.length > 0) {
                    this.switchTab('search');
                } else if (this.currentTab === 'search' && this.searchQuery.length === 0) {
                    this.switchTab('today'); // Go back to default or stay? Apple stays.
                    this.renderTab('search'); // Re-render empty search state
                } else {
                    this.renderTab('search');
                }
            });
        }

        // Modal Close
        document.getElementById('app-modal-close')?.addEventListener('click', () => {
            this.closeModal();
        });
    }

    switchTab(tabName) {
        this.currentTab = tabName;

        // Update Nav UI
        document.querySelectorAll('.app-store-nav-item').forEach(item => {
            if (item.dataset.tab === tabName) {
                item.classList.add('text-[var(--primary)]', 'bg-blue-50/50');
                item.classList.remove('text-gray-400');
            } else {
                item.classList.remove('text-[var(--primary)]', 'bg-blue-50/50');
                item.classList.add('text-gray-400');
            }
        });

        this.renderTab(tabName);
    }

    renderTab(tabName) {
        const container = document.getElementById('app-store-content');
        container.innerHTML = ''; // Clear current content
        container.className = 'w-full h-full overflow-y-auto pb-24'; // Reset classes if needed

        switch (tabName) {
            case 'today':
                this.renderToday(container);
                break;
            case 'apps':
                this.renderApps(container);
                break;
            case 'charts':
                this.renderCharts(container);
                break;
            case 'search':
                this.renderSearch(container);
                break;
        }
    }

    // --- RENDERERS ---

    renderToday(container) {
        const featuredApp = this.apps.find(a => a.id === 'margriet-ai') || this.apps[0];

        const heroHTML = `
            <div class="p-6 max-w-4xl mx-auto space-y-8 animate-fade-in">
                <div class="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">
                    ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
                <h1 class="text-4xl font-bold text-gray-900 mb-6">Today</h1>

                <!-- Featured Hero -->
                <div class="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-xl cursor-pointer group transition-transform hover:scale-[1.02] duration-500"
                     onclick="window.AppStore.openApp('${featuredApp.id}')">
                    <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
                    <img src="${featuredApp.screenshots[0] || '/assets/placeholders/app.png'}"
                         class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                         alt="${featuredApp.name}">
                    <div class="absolute bottom-0 left-0 p-8 z-20 text-white">
                        <span class="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full mb-3 inline-block">
                            Featured App
                        </span>
                        <h2 class="text-4xl font-bold mb-2 leading-tight">${featuredApp.name}</h2>
                        <p class="text-lg text-gray-200 mb-4 line-clamp-2">${featuredApp.description}</p>
                        <div class="flex items-center gap-4">
                            <img src="${featuredApp.screenshots[0] || '/assets/placeholders/app.png'}" class="w-12 h-12 rounded-xl shadow-lg border border-white/10">
                            <div class="flex-1">
                                <div class="font-semibold">${featuredApp.name}</div>
                                <div class="text-xs text-gray-300">${featuredApp.category}</div>
                            </div>
                            <button class="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-2 rounded-full font-bold transition-colors">
                                VIEW
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Rails: Our Picks -->
                <div class="pt-8">
                    <div class="flex justify-between items-end mb-4">
                        <h3 class="text-2xl font-bold text-gray-900">Our Picks</h3>
                        <button class="text-[var(--primary)] text-sm font-semibold" onclick="window.AppStore.switchTab('apps')">See All</button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${this.apps.slice(1, 3).map(app => this.createSmallCard(app)).join('')}
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = heroHTML;
    }

    renderApps(container) {
        const html = `
            <div class="p-6 max-w-6xl mx-auto animate-fade-in">
                <h1 class="text-4xl font-bold text-gray-900 mb-8 sticky top-0 bg-[var(--bg)]/95 backdrop-blur-xl z-30 py-4 border-b border-gray-100">
                    Apps
                </h1>
                <div class="space-y-12">
                    ${this.categories.map(cat => `
                        <div class="space-y-4">
                            <div class="flex justify-between items-center border-b border-gray-100 pb-2">
                                <h3 class="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <span class="text-2xl">${cat.emoji || ''}</span> ${cat.name}
                                </h3>
                                <span class="text-xs text-gray-400 font-medium uppercase">See All</span>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                ${cat.apps.map(app => this.createStandardCard(app)).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        container.innerHTML = html;
    }

    renderCharts(container) {
        const sortedApps = [...this.allApps].sort((a, b) => (a.rankFree || 99) - (b.rankFree || 99));

        const html = `
            <div class="p-6 max-w-4xl mx-auto animate-fade-in">
                <h1 class="text-4xl font-bold text-gray-900 mb-8">Top Charts</h1>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <!-- Top Free -->
                    <div>
                        <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Top Projects
                            <span class="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Free</span>
                        </h3>
                        <div class="space-y-0">
                            ${sortedApps.slice(0, 10).map((app, idx) => `
                                <div class="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group"
                                     onclick="window.AppStore.openApp('${app.id}')">
                                    <span class="text-lg font-bold w-6 text-center ${idx < 3 ? 'text-gray-900' : 'text-gray-400'}">${idx + 1}</span>
                                    <img src="${app.screenshots[0] || '/assets/placeholders/app.png'}" class="w-14 h-14 rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-md transition-all">
                                    <div class="flex-1 min-w-0">
                                        <div class="font-semibold text-gray-900 truncate">${app.name}</div>
                                        <div class="text-xs text-gray-500 truncate">${app.category}</div>
                                    </div>
                                    <button class="bg-gray-100 text-[var(--primary)] text-xs font-bold px-4 py-1.5 rounded-full uppercase group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                                        VIEW
                                    </button>
                                </div>
                                ${idx < 9 ? '<div class="h-px bg-gray-100 ml-14 my-1"></div>' : ''}
                            `).join('')}
                        </div>
                    </div>

                    <!-- Top Grossing (Simulated) -->
                    <div>
                        <h3 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            Top Grossing
                            <span class="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Simulated</span>
                        </h3>
                         <div class="space-y-0">
                            ${[...sortedApps].reverse().slice(0, 10).map((app, idx) => `
                                <div class="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group"
                                     onclick="window.AppStore.openApp('${app.id}')">
                                    <span class="text-lg font-bold w-6 text-center ${idx < 3 ? 'text-gray-900' : 'text-gray-400'}">${idx + 1}</span>
                                    <img src="${app.screenshots[0] || '/assets/placeholders/app.png'}" class="w-14 h-14 rounded-2xl shadow-sm border border-gray-100 group-hover:shadow-md transition-all">
                                    <div class="flex-1 min-w-0">
                                        <div class="font-semibold text-gray-900 truncate">${app.name}</div>
                                        <div class="text-xs text-gray-500 truncate">${app.category}</div>
                                    </div>
                                    <button class="bg-gray-100 text-[var(--primary)] text-xs font-bold px-4 py-1.5 rounded-full uppercase group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                                        VIEW
                                    </button>
                                </div>
                                ${idx < 9 ? '<div class="h-px bg-gray-100 ml-14 my-1"></div>' : ''}
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = html;
    }

    renderSearch(container) {
        const query = this.searchQuery.toLowerCase();
        const results = this.allApps.filter(app =>
            app.name.toLowerCase().includes(query) ||
            (app.description && app.description.toLowerCase().includes(query)) ||
            (app.tags && app.tags.some(tag => tag.toLowerCase().includes(query)))
        );

        const html = `
            <div class="p-6 max-w-4xl mx-auto animate-fade-in">
                <h1 class="text-4xl font-bold text-gray-900 mb-8">Search</h1>
                ${query.length === 0 ? `
                    <div class="text-center py-20">
                        <div class="text-6xl mb-4">🔍</div>
                        <h3 class="text-xl font-bold text-gray-900 mb-2">Explore Apps</h3>
                        <p class="text-gray-500">Search for projects, categories, or tags.</p>
                        <div class="mt-8 flex flex-wrap justify-center gap-2">
                            ${['AI', 'Health', 'Commerce', '3D', 'Tools'].map(tag => `
                                <button onclick="document.getElementById('app-store-search').value = '${tag}'; window.AppStore.searchQuery = '${tag}'; window.AppStore.renderTab('search');"
                                        class="px-4 py-2 bg-blue-50 text-[var(--primary)] rounded-full text-sm font-medium hover:bg-blue-100 transition-colors">
                                    ${tag}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                ` : `
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        ${results.map(app => this.createStandardCard(app)).join('')}
                    </div>
                    ${results.length === 0 ? `
                        <div class="text-center py-20 text-gray-500">
                            No results found for "${this.searchQuery}"
                        </div>
                    ` : ''}
                `}
            </div>
        `;
        container.innerHTML = html;
    }

    // --- HELPERS ---

    createSmallCard(app) {
        return `
            <div class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer flex gap-4 items-center group"
                 onclick="window.AppStore.openApp('${app.id}')">
                <img src="${app.screenshots[0] || '/assets/placeholders/app.png'}" class="w-16 h-16 rounded-xl shadow-sm group-hover:scale-105 transition-transform">
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-gray-900 truncate">${app.name}</h4>
                    <p class="text-sm text-gray-500 truncate">${app.description}</p>
                </div>
                <button class="bg-gray-100 text-[var(--primary)] text-xs font-bold px-4 py-1.5 rounded-full uppercase group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                    VIEW
                </button>
            </div>
        `;
    }

    createStandardCard(app) {
        return `
            <div class="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full group"
                 onclick="window.AppStore.openApp('${app.id}')">
                <div class="flex items-start justify-between mb-4">
                    <img src="${app.screenshots[0] || '/assets/placeholders/app.png'}" class="w-20 h-20 rounded-2xl shadow-md group-hover:scale-105 transition-transform">
                </div>
                <h4 class="font-bold text-gray-900 text-lg mb-1 line-clamp-1">${app.name}</h4>
                <p class="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">${app.category.split(' ')[0]}</p>
                <p class="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">${app.description}</p>
                <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <span class="text-xs font-bold text-gray-400">${app.status || 'Concept'}</span>
                    <button class="bg-gray-100 text-[var(--primary)] text-xs font-bold px-5 py-2 rounded-full uppercase group-hover:bg-[var(--primary)] group-hover:text-white transition-colors shadow-sm">
                        VIEW
                    </button>
                </div>
            </div>
        `;
    }

    renderNavigation() {
        // This is handled in HTML structure, but we could inject it here.
        // For now, we assume the nav exists in DOM.
    }

    // --- MODAL ---

    openApp(appId) {
        const app = this.allApps.find(a => a.id === appId);
        if (!app) return;

        const modal = document.getElementById('app-modal');
        const content = document.getElementById('app-modal-content');

        content.innerHTML = `
            <div class="p-8 md:p-12">
                <div class="flex flex-col md:flex-row gap-8 mb-8">
                    <img src="${app.screenshots[0] || '/assets/placeholders/app.png'}" class="w-32 h-32 rounded-3xl shadow-xl border border-gray-100">
                    <div class="flex-1">
                        <h2 class="text-3xl font-bold text-gray-900 mb-2">${app.name}</h2>
                        <p class="text-lg text-gray-500 mb-4">${app.category}</p>
                        <div class="flex gap-3">
                            <button class="bg-[var(--primary)] text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-500/30 hover:scale-105 transition-transform">
                                VIEW PROJECT
                            </button>
                            <button class="bg-gray-100 text-gray-900 px-4 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
                                🔗
                            </button>
                        </div>
                    </div>
                </div>

                <div class="prose max-w-none mb-12">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">About</h3>
                    <p class="text-gray-600 leading-relaxed text-lg">${app.description}</p>
                </div>

                <div class="mb-8">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Preview</h3>
                    <div class="flex gap-4 overflow-x-auto pb-4 snap-x">
                        ${(app.screenshots.length ? app.screenshots : ['/assets/placeholders/app.png', '/assets/placeholders/app.png']).map(src => `
                            <img src="${src}" class="h-64 md:h-80 rounded-2xl shadow-md snap-center border border-gray-100">
                        `).join('')}
                    </div>
                </div>

                <div class="flex flex-wrap gap-2">
                    ${app.tags.map(tag => `
                        <span class="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-medium uppercase tracking-wide">#${tag}</span>
                    `).join('')}
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        // Small delay to allow display:block to apply before opacity transition
        setTimeout(() => {
            modal.classList.remove('opacity-0', 'translate-y-full');
        }, 10);
    }

    closeModal() {
        const modal = document.getElementById('app-modal');
        modal.classList.add('opacity-0', 'translate-y-full');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }

    // --- AI INTERFACE ---

    setupAIInterface() {
        // Expose methods for "AI" to call via console or natural language simulation
        window.addApp = (nlString) => this.handleAIAddApp(nlString);
        window.editApp = (nlString) => this.handleAIEditApp(nlString);
    }

    handleAIAddApp(nlString) {
        // Simple parser for "voeg app [Name] toe aan [Category] - [Description]"
        // This is a mock implementation of the NLP requirement
        console.log("AI Adding App:", nlString);

        // Regex to extract parts (very basic)
        const nameMatch = nlString.match(/app\s+(.*?)\s+toe/i);
        const catMatch = nlString.match(/aan\s+(.*?)\s+—/i) || nlString.match(/aan\s+(.*?)\s+-/i);
        const descMatch = nlString.match(/—\s+(.*)/) || nlString.match(/-\s+(.*)/);

        if (nameMatch && catMatch) {
            const newApp = {
                id: nameMatch[1].toLowerCase().replace(/\s+/g, '-'),
                name: nameMatch[1],
                category: catMatch[1],
                description: descMatch ? descMatch[1] : "No description provided.",
                status: "Concept",
                tags: ["ai-generated"],
                screenshots: []
            };

            // Add to apps list
            this.apps.push(newApp);

            // Add to category
            const cat = this.categories.find(c => c.name.toLowerCase().includes(newApp.category.toLowerCase()));
            if (cat) {
                cat.apps.unshift(newApp); // Add to top
                if (cat.apps.length > 4) cat.apps.pop(); // Keep 4
            }

            this.renderTab(this.currentTab); // Refresh
            alert(`✨ AI: Added "${newApp.name}" to ${newApp.category}`);
        } else {
            console.error("AI could not parse command");
        }
    }

    handleAIEditApp(nlString) {
        // "Update [Name] description: [New Desc]"
        const nameMatch = nlString.match(/Update\s+(.*?)\s+description:/i);
        const descMatch = nlString.match(/description:\s+(.*)/i);

        if (nameMatch && descMatch) {
            const appName = nameMatch[1];
            const newDesc = descMatch[1];

            const app = this.apps.find(a => a.name.toLowerCase() === appName.toLowerCase());
            if (app) {
                app.description += " " + newDesc;
                this.renderTab(this.currentTab);
                alert(`✨ AI: Updated "${app.name}"`);
            }
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.AppStore = new LucasAppStore();
});
