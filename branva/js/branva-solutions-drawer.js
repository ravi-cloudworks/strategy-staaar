// Branva Solutions Drawer Controller
// Follows the same pattern as branva-visual-activations-drawer.js
class BranvaSolutionsDrawer {
    constructor() {
        this.drawer = null;
        this.isOpen = false;
        this.selectedStrategies = new Set();
        this.currentCluster = null;
        this.init();
    }

    init() {
        this.createDrawerHTML();
        this.setupEventListeners();
        this.ensureDrawerClosed();
        // Don't load clusters until drawer is opened
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
                        <input type="text" class="search-input" placeholder="Search clusters..." id="clustersSearchInput">
                    </div>

                    <!-- Clusters Grid -->
                    <div class="clusters-grid" id="clustersDrawerGrid">
                        <!-- Clusters will be loaded here -->
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
        const searchInput = document.getElementById('clustersSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchClusters(e.target.value);
            });
        }
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

        // Load clusters when drawer is opened
        this.loadClusters();

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

    loadClusters() {
        const clustersGrid = document.getElementById('clustersDrawerGrid');
        if (!clustersGrid) return;

        // Show loading state
        clustersGrid.innerHTML = '<div style="text-align: center; padding: 20px; color: #94a3b8;">Loading strategy clusters...</div>';

        // Load strategies from the data source
        fetch('./data/strategy-metadata.json')
            .then(response => response.json())
            .then(strategies => {
                // Group strategies by cluster
                const clusters = this.groupStrategiesByCluster(strategies);
                this.renderClusters(clusters);
            })
            .catch(error => {
                console.error('Failed to load strategy metadata:', error);
                clustersGrid.innerHTML = '<div style="text-align: center; padding: 20px; color: #ef4444;">Failed to load strategy clusters</div>';
            });
    }

    groupStrategiesByCluster(strategies) {
        const clusterIcons = {
            'Diagnose': '🔍',
            'Differentiate': '⭐',
            'Defend': '🛡️',
            'Disrupt': '🚀'
        };

        const clusterDescriptions = {
            'Diagnose': 'Identify problems, analyze issues, and discover what\'s wrong with campaigns',
            'Differentiate': 'Stand out from competition, position uniquely, and create competitive advantage',
            'Defend': 'Protect brand reputation, prevent disasters, and maintain market position',
            'Disrupt': 'Challenge status quo, drive innovation, and break through barriers'
        };

        const clusteredData = {};

        strategies.forEach(strategy => {
            const cluster = strategy.strategyCluster;
            if (!clusteredData[cluster]) {
                clusteredData[cluster] = {
                    name: cluster,
                    icon: clusterIcons[cluster] || '📋',
                    description: clusterDescriptions[cluster] || '',
                    strategies: [],
                    count: 0
                };
            }
            clusteredData[cluster].strategies.push(strategy);
            clusteredData[cluster].count++;
        });

        return Object.values(clusteredData);
    }

    renderClusters(clusters) {
        const clustersGrid = document.getElementById('clustersDrawerGrid');
        if (!clustersGrid) return;

        if (clusters.length === 0) {
            clustersGrid.innerHTML = '<div style="text-align: center; padding: 20px; color: #94a3b8;">No strategy clusters found</div>';
            return;
        }

        clustersGrid.innerHTML = '';
        clusters.forEach(cluster => {
            const card = this.createClusterCard(cluster);
            clustersGrid.appendChild(card);
        });
    }

    createClusterCard(cluster) {
        const card = document.createElement('div');
        card.className = 'cluster-card';
        card.dataset.clusterName = cluster.name;

        card.innerHTML = `
            <div class="cluster-icon">${cluster.icon}</div>
            <h3 class="cluster-title">${cluster.name}</h3>
            <p class="cluster-description">${cluster.description}</p>
            <div class="cluster-stats">
                <span class="stat-item">${cluster.count} strategies</span>
            </div>
        `;

        card.addEventListener('click', () => {
            this.selectCluster(cluster);
        });

        return card;
    }

    selectCluster(cluster) {
        this.currentCluster = cluster;

        if (window.showToast) {
            window.showToast(`Opening strategies for ${cluster.name}`, 'success');
        }

        // Open modal with strategies for this cluster
        this.openSolutionsModal(cluster);

        console.log('📋 Cluster selected:', cluster.name);
    }

    searchClusters(query) {
        if (!query.trim()) {
            this.loadClusters();
            return;
        }

        fetch('./data/strategy-metadata.json')
            .then(response => response.json())
            .then(strategies => {
                // Filter strategies by search query first
                const filteredStrategies = strategies.filter(strategy => {
                    const searchText = `${strategy.name} ${strategy.description} ${strategy.strategyCluster}`.toLowerCase();
                    return searchText.includes(query.toLowerCase());
                });

                // Group filtered strategies by cluster
                const clusters = this.groupStrategiesByCluster(filteredStrategies);
                this.renderClusters(clusters);
            })
            .catch(error => {
                console.error('Failed to search strategy clusters:', error);
            });
    }

    openSolutionsModal(cluster) {
        const modal = document.getElementById('solutionsModal');
        const modalTitle = document.getElementById('solutionsTitle');
        const modalPreview = document.getElementById('solutionsPreview');

        if (!modal || !modalTitle || !modalPreview) {
            console.error('Solutions modal elements not found');
            return;
        }

        // Set modal title
        modalTitle.textContent = `${cluster.icon} ${cluster.name} - Strategy Solutions`;

        // Generate strategies grid
        modalPreview.innerHTML = this.generateStrategiesGrid(cluster);

        // Setup multi-selection
        this.setupMultiSelection(cluster);

        // Show modal
        modal.classList.add('show');

        console.log(`📋 Opened strategies modal for ${cluster.name}`);
    }

    generateStrategiesGrid(cluster) {
        if (!cluster.strategies || cluster.strategies.length === 0) {
            return '<div style="text-align: center; padding: 20px; color: #ef4444;">No strategies found for this cluster</div>';
        }

        let html = '<div class="strategy-templates-grid">';

        cluster.strategies.forEach(strategy => {
            const strategyId = `strategy-${strategy.id}`;
            const urgencyClass = strategy.marketUrgency === 'HIGH' ? 'urgency-high' : 'urgency-medium';

            html += `
                <div class="strategy-template-card selectable" data-strategy-id="${strategyId}" data-strategy='${JSON.stringify(strategy)}'>
                    <div class="selection-checkbox">
                        <input type="checkbox" id="${strategyId}" class="strategy-checkbox">
                        <label for="${strategyId}" class="checkbox-overlay"></label>
                    </div>
                    <div class="strategy-content">
                        <div class="strategy-header">
                            <h4 class="strategy-name">${strategy.name}</h4>
                            <div class="strategy-badges">
                                <span class="badge ${urgencyClass}">${strategy.marketUrgency}</span>
                                <span class="badge pricing">${strategy.pricing}</span>
                            </div>
                        </div>
                        <p class="strategy-description">${strategy.description}</p>
                        <div class="strategy-meta">
                            <span class="meta-item">⏱️ ${strategy.speed}</span>
                            <span class="meta-item">📊 ${strategy.rows}x${strategy.columns}</span>
                        </div>
                    </div>
                    <div class="selection-overlay">
                        <i class="bi bi-check-circle-fill"></i>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    setupMultiSelection(cluster) {
        this.selectedStrategies = new Set();
        const selectionCount = document.getElementById('strategySelectionCount');
        const addButton = document.getElementById('addSelectedStrategiesBtn');
        const selectAllBtn = document.getElementById('selectAllStrategiesBtn');
        const clearAllBtn = document.getElementById('clearAllStrategiesBtn');

        // Update UI based on selection
        const updateSelectionUI = () => {
            const count = this.selectedStrategies.size;
            selectionCount.textContent = `${count} selected`;
            addButton.textContent = count === 0 ? 'Select Strategies' :
                                   count === 1 ? 'Add 1 Slide' :
                                   `Add ${count} Slides`;
            addButton.disabled = count === 0;
        };

        // Individual checkbox handlers
        document.querySelectorAll('.strategy-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const card = e.target.closest('.strategy-template-card');
                const strategyId = card.dataset.strategyId;
                const strategyData = JSON.parse(card.dataset.strategy);

                if (e.target.checked) {
                    this.selectedStrategies.add({
                        id: strategyId,
                        data: strategyData,
                        cluster: cluster
                    });
                    card.classList.add('selected');
                } else {
                    // Remove from set
                    const toRemove = [...this.selectedStrategies].find(s => s.id === strategyId);
                    if (toRemove) {
                        this.selectedStrategies.delete(toRemove);
                    }
                    card.classList.remove('selected');
                }

                updateSelectionUI();
            });
        });

        // Select All button
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => {
                document.querySelectorAll('.strategy-checkbox').forEach(checkbox => {
                    if (!checkbox.checked) {
                        checkbox.checked = true;
                        checkbox.dispatchEvent(new Event('change'));
                    }
                });
            });
        }

        // Clear All button
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                document.querySelectorAll('.strategy-checkbox').forEach(checkbox => {
                    if (checkbox.checked) {
                        checkbox.checked = false;
                        checkbox.dispatchEvent(new Event('change'));
                    }
                });
            });
        }

        // Add Selected button
        if (addButton) {
            addButton.addEventListener('click', () => {
                this.addSelectedSlidesToPresentation();
            });
        }

        // Setup modal close handlers
        this.setupModalCloseHandlers();

        updateSelectionUI();
    }

    setupModalCloseHandlers() {
        const modal = document.getElementById('solutionsModal');
        const closeBtn = document.getElementById('closeSolutionsModal');
        const cancelBtn = document.getElementById('cancelSolutionsBtn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeSolutionsModal();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.closeSolutionsModal();
            });
        }

        // Close on overlay click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeSolutionsModal();
                }
            });
        }
    }

    closeSolutionsModal() {
        const modal = document.getElementById('solutionsModal');
        if (modal) {
            modal.classList.remove('show');
            // Reset selection
            this.selectedStrategies = new Set();
        }
    }

    addSelectedSlidesToPresentation() {
        if (!this.selectedStrategies || this.selectedStrategies.size === 0) {
            if (window.showToast) {
                window.showToast('Please select at least one strategy', 'warning');
            }
            return;
        }

        // Check if canvas is ready, with retry mechanism
        if (!window.branvaCanvas) {
            console.log('⏳ BranvaCanvas not yet available, waiting...');
            // Wait a bit and retry
            setTimeout(() => {
                if (window.branvaCanvas) {
                    console.log('✅ BranvaCanvas now available, proceeding...');
                    this.createSlidesWithCanvas();
                } else {
                    console.error('❌ BranvaCanvas still not available after waiting');
                    if (window.showToast) {
                        window.showToast('Canvas system not ready, please try again', 'error');
                    }
                }
            }, 500);
            return;
        }

        this.createSlidesWithCanvas();
    }

    async createSlidesWithCanvas() {
        console.log(`📋 Creating ${this.selectedStrategies.size} new slides with strategy matrices...`);

        const createdSlides = [];

        for (const strategyInfo of this.selectedStrategies) {
            const { data: strategy, cluster } = strategyInfo;

            // Create new slide
            window.branvaCanvas.addNewSlide();

            // Add strategy matrix element to the slide (await for loading)
            await this.addStrategyMatrixElement(strategy, cluster);

            console.log(`✅ Created slide for ${strategy.name}`);
            createdSlides.push({
                strategy: strategy,
                cluster: cluster
            });
        }

        // Show success message
        if (window.showToast) {
            window.showToast(`Created ${this.selectedStrategies.size} new slides with strategy matrices!`, 'success');
        }

        // Close modal and drawer
        this.closeSolutionsModal();
        this.close();

        console.log(`✅ Strategy Solutions: Created ${createdSlides.length} slides`);
        return createdSlides;
    }

    async addStrategyMatrixElement(strategy, cluster) {
        // Load the actual strategy data from the file
        try {
            const response = await fetch(`./data/strategies/${strategy.file}`);
            const strategyData = await response.json();

            // Create a strategy matrix element with the loaded data
            const element = {
                id: window.branvaCanvas.generateId(),
                type: 'strategy-matrix',
                position: { x: 10, y: 10, width: 80, height: 70, rotation: 0, zIndex: 1 },
                content: {
                    strategyContent: strategyData,
                    metadata: {
                        strategyId: strategy.id,
                        strategyName: strategy.name,
                        description: strategy.description,
                        cluster: cluster.name,
                        clusterIcon: cluster.icon,
                        pricing: strategy.pricing,
                        speed: strategy.speed,
                        marketUrgency: strategy.marketUrgency,
                        matrixSize: `${strategy.rows}x${strategy.columns}`,
                        file: strategy.file
                    }
                }
            };

            // Add element to current slide and render it
            window.branvaCanvas.addElementToSlide(element);
            window.branvaCanvas.renderElement(element);
        } catch (error) {
            console.error('Failed to load strategy data:', error);
            // Create a placeholder element if loading fails
            const element = {
                id: window.branvaCanvas.generateId(),
                type: 'text',
                position: { x: 10, y: 10, width: 80, height: 20, rotation: 0, zIndex: 1 },
                content: {
                    text: `${cluster.icon} ${strategy.name}\n\n${strategy.description}\n\nMatrix: ${strategy.rows}x${strategy.columns}\nPricing: ${strategy.pricing}\nTime: ${strategy.speed}`,
                    fontSize: 14,
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 'normal',
                    color: '#1e293b',
                    alignment: 'left',
                    isEditable: true
                }
            };

            window.branvaCanvas.addElementToSlide(element);
            window.branvaCanvas.renderElement(element);
        }
    }
}

// Initialize and make globally available
window.BranvaSolutionsDrawer = BranvaSolutionsDrawer;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.bravaSolutionsDrawer = new BranvaSolutionsDrawer();
    console.log('📋 Branva Solutions Drawer initialized');
});