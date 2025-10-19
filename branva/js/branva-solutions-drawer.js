// Branva Solutions Drawer Controller
class BranvaSolutionsDrawer {
    constructor() {
        this.drawer = null;
        this.isOpen = false;
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.createDrawerHTML();
        this.setupEventListeners();
        this.ensureDrawerClosed();
        // Don't load solutions until drawer is opened
    }

    createDrawerHTML() {
        const existingDrawer = document.getElementById('solutionsDrawer');
        if (existingDrawer) {
            existingDrawer.remove();
        }

        const drawerHTML = `
            <div class="solutions-drawer" id="solutionsDrawer">
                <div class="drawer-header">
                    <div class="drawer-title">
                        <i class="bi bi-grid-3x3-gap"></i>
                        <span>Strategy Solutions</span>
                    </div>
                    <button class="drawer-close" id="closeSolutionsDrawer">
                        <i class="bi bi-x"></i>
                    </button>
                </div>

                <div class="drawer-content">
                    <!-- Search -->
                    <div class="search-section">
                        <input type="text" class="search-input" placeholder="Search solutions..." id="solutionsSearchInput">
                    </div>

                    <!-- Filter Tabs -->
                    <div class="filter-tabs">
                        <button class="filter-tab active" data-filter="all">All</button>
                        <button class="filter-tab" data-filter="agency">Agency</button>
                        <button class="filter-tab" data-filter="advertiser">Advertiser</button>
                        <button class="filter-tab" data-filter="achiever">Achiever</button>
                        <button class="filter-tab" data-filter="high">High Urgency</button>
                    </div>

                    <!-- Solutions Grid -->
                    <div class="solutions-grid" id="solutionsDrawerGrid">
                        <!-- Solutions will be loaded here -->
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', drawerHTML);
        this.drawer = document.getElementById('solutionsDrawer');
    }

    ensureDrawerClosed() {
        if (this.drawer) {
            this.drawer.classList.remove('open');
            this.isOpen = false;

            const canvasArea = document.getElementById('canvasArea');
            if (canvasArea) {
                canvasArea.classList.remove('with-solutions-drawer');
            }
        }
    }

    setupEventListeners() {
        // Close drawer button
        const closeBtn = document.getElementById('closeSolutionsDrawer');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Search input
        const searchInput = document.getElementById('solutionsSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchSolutions(e.target.value);
            });
        }

        // Filter tabs
        const filterTabs = document.querySelectorAll('.solutions-drawer .filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const filter = e.currentTarget.dataset.filter;
                this.filterSolutions(filter);

                // Update active state
                filterTabs.forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });
    }

    open() {
        // Show drawer
        this.drawer.classList.add('open');

        // Shift canvas area
        const canvasArea = document.getElementById('canvasArea');
        if (canvasArea) {
            canvasArea.classList.add('with-solutions-drawer');
        }

        this.isOpen = true;

        // Load solutions when drawer is opened
        this.loadSolutions();

        if (window.showToast) {
            window.showToast('Strategy Solutions drawer opened', 'success');
        }

        console.log('📋 Strategy Solutions drawer opened');
    }

    close() {
        // Hide drawer
        this.drawer.classList.remove('open');

        // Reset canvas area
        const canvasArea = document.getElementById('canvasArea');
        if (canvasArea) {
            canvasArea.classList.remove('with-solutions-drawer');
        }

        this.isOpen = false;

        console.log('📋 Strategy Solutions drawer closed');
    }

    async loadSolutions(filter = 'all') {
        const solutionsGrid = document.getElementById('solutionsDrawerGrid');
        if (!solutionsGrid) return;

        // Show loading state
        solutionsGrid.innerHTML = '<div style="text-align: center; padding: 20px; color: #94a3b8;">Loading strategies...</div>';

        // Load strategies from the data source
        const loaded = await window.BranvaData.loadStrategies();
        if (!loaded) {
            solutionsGrid.innerHTML = '<div style="text-align: center; padding: 20px; color: #ef4444;">Failed to load strategies</div>';
            return;
        }

        this.filterSolutions(filter);
    }

    filterSolutions(filter) {
        this.currentFilter = filter;
        const solutionsGrid = document.getElementById('solutionsDrawerGrid');
        if (!solutionsGrid) return;

        // Use the correct method name from BranvaData
        const strategies = window.BranvaData.getSolutionsByCategory(filter);

        if (strategies.length === 0) {
            solutionsGrid.innerHTML = '<div style="text-align: center; padding: 20px; color: #94a3b8;">No strategies found for this filter</div>';
            return;
        }

        solutionsGrid.innerHTML = '';
        strategies.forEach(strategy => {
            const card = this.createSolutionCard(strategy);
            solutionsGrid.appendChild(card);
        });
    }

    searchSolutions(query) {
        const solutionsGrid = document.getElementById('solutionsDrawerGrid');
        if (!solutionsGrid) return;

        if (!query.trim()) {
            this.filterSolutions(this.currentFilter);
            return;
        }

        // Simple search implementation
        const allStrategies = window.BranvaData.solutions || [];
        const strategies = allStrategies.filter(strategy => {
            const searchText = `${strategy.name || strategy.title} ${strategy.description || ''} ${strategy.tags?.join(' ') || ''}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        });

        // Apply current filter to search results
        const filteredStrategies = this.currentFilter === 'all' ? strategies :
            strategies.filter(strategy => {
                if (this.currentFilter === 'high') return strategy.marketUrgency === 'HIGH';
                return strategy.category?.includes(this.currentFilter.charAt(0).toUpperCase() + this.currentFilter.slice(1));
            });

        if (filteredStrategies.length === 0) {
            solutionsGrid.innerHTML = '<div style="text-align: center; padding: 20px; color: #94a3b8;">No strategies found</div>';
            return;
        }

        solutionsGrid.innerHTML = '';
        filteredStrategies.forEach(strategy => {
            const card = this.createSolutionCard(strategy);
            solutionsGrid.appendChild(card);
        });
    }

    createSolutionCard(strategy) {
        const card = document.createElement('div');
        card.className = 'solution-card';
        card.dataset.strategyId = strategy.id;

        const badges = strategy.tags?.map(tag => {
            const badgeClass = tag.toLowerCase().includes('high') ? 'urgency-high' :
                              tag.toLowerCase().includes('agency') ? 'role-agency' :
                              tag.toLowerCase().includes('advertiser') ? 'role-advertiser' :
                              tag.toLowerCase().includes('achiever') ? 'role-achiever' : 'default';
            return `<span class="badge ${badgeClass}">${tag}</span>`;
        }).join('') || '';

        card.innerHTML = `
            <h3 class="solution-title">${strategy.name || strategy.title}</h3>
            <p class="solution-description">${strategy.description || ''}</p>
            <div class="solution-badges">${badges}</div>
        `;

        card.addEventListener('click', () => {
            this.selectSolution(strategy);
        });

        return card;
    }

    selectSolution(strategy) {
        if (window.showToast) {
            window.showToast(`Selected: ${strategy.name || strategy.title}`, 'success');
        }

        // Open solution modal for preview/application
        if (window.branvaPanels) {
            window.branvaPanels.openSolutionModal(strategy.id);
        }

        console.log('📋 Solution selected:', strategy.name || strategy.title);
    }
}

// Initialize and make globally available
window.BranvaSolutionsDrawer = BranvaSolutionsDrawer;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.bravaSolutionsDrawer = new BranvaSolutionsDrawer();
    console.log('📋 Branva Solutions Drawer initialized');
});