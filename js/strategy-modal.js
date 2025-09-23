// Strategy Selection Modal
export class StrategyModal {
    constructor() {
        console.log('🏗️ StrategyModal constructor called');
        this.modal = null;
        try {
            this.init();
            console.log('✅ StrategyModal initialized successfully');
        } catch (error) {
            console.error('❌ Error in StrategyModal constructor:', error);
            throw error;
        }
    }

    init() {
        console.log('🔧 StrategyModal init() called');
        this.createModalHTML();
        this.setupEventListeners();
        console.log('✅ StrategyModal init() completed');
    }

    createModalHTML() {
        // Get or create modal element
        let modal = document.getElementById('strategyModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'strategyModal';
            modal.className = 'modal-overlay';
            document.body.appendChild(modal);
        }

        // Ensure modal has the correct class
        modal.className = 'modal-overlay';

        modal.innerHTML = `
            <div class="modal-container">
                <div class="modal-header">
                    <h2><i class="bi bi-clipboard-data"></i> Select Your STAAAR — that advertisers, agencies and achievers repeat buy.</h2>
                    <button class="modal-close" id="closeStrategyModal">
                        <i class="bi bi-x"></i>
                    </button>
                </div>

                <div class="modal-tabs">
                    <button class="tab-btn active" data-tab="presets"><i class="bi bi-grid-3x3-gap"></i> Presets</button>
                    <button class="tab-btn" data-tab="custom"><i class="bi bi-file-earmark-plus"></i> Bring Your Own Strategy</button>
                </div>

                <div class="tab-content active" id="presets-tab">
                    <!-- Filters -->
                    <div class="filters-section">
                        <h3><i class="bi bi-funnel"></i> Filter Strategies</h3>
                        ${this.createFiltersHTML()}
                    </div>

                    <!-- Strategy Cards -->
                    <div class="strategy-grid" id="strategyGrid">
                        <!-- Cards will be populated by JavaScript -->
                    </div>
                </div>

                <div class="tab-content" id="custom-tab">
                    <div class="custom-strategy-section">
                        <h3>Paste your CSV strategy below:</h3>
                        <p class="format-hint">
                            <strong>Format:</strong> Title, Description<br>
                            <strong>Rows 2-7:</strong> icon_name, text_value (repeat for each column)
                        </p>

                        <textarea id="csvInput" placeholder="TikTok Trend Tracking,Track viral content trends for agencies
TrendingUp,Trending Now,Activity,Viral Content,Star,Top Trends,Crown,Market Leader
Eye,Watching Trends,Users,Community Pulse,Heart,Engagement,Search,Discovery
Target,Precise Targeting,Zap,Rapid Response,Trophy,Achievement,Gem,Premium
DollarSign,Revenue Impact,BarChart3,Growth Metrics,Award,Success,Rocket,Scale
Calendar,Content Planning,Clock,Time Optimization,Bell,Alerts,Shield,Protection
Rocket,Scale Success,Crown,Market Leadership,Gem,Innovation,Infinity,Unlimited"></textarea>

                        <div class="csv-info">
                            <p><strong>Requirements:</strong> Min 4×7, Max 6×7 | First row: headers | Rows 2-7: icon,text pairs</p>
                        </div>

                        <div class="csv-actions">
                            <button class="btn-secondary" id="cancelCustom">Cancel</button>
                            <button class="btn-primary" id="validateCsv">Validate & Preview</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.modal = modal;
    }

    createFiltersHTML() {
        return `
            <div class="filter-group">
                <label><i class="bi bi-currency-dollar"></i> Income Potential:</label>
                <div class="filter-checkboxes">
                    <label class="filter-checkbox">
                        <input type="checkbox" value="very-high" data-filter="pricing">
                        <i class="bi bi-circle-fill text-danger"></i> Very High ($4,000+)
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox" value="high" data-filter="pricing">
                        <i class="bi bi-circle-fill text-warning"></i> High ($2,000-$4,000)
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox" value="medium" data-filter="pricing">
                        <i class="bi bi-circle-fill text-success"></i> Medium (<$2,000)
                    </label>
                </div>
            </div>
            <div class="filter-group">
                <label><i class="bi bi-people"></i> Target Buyer:</label>
                <div class="filter-checkboxes">
                    <label class="filter-checkbox">
                        <input type="checkbox" value="agency" data-filter="buyer">
                        <i class="bi bi-building"></i> Agency
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox" value="brand" data-filter="buyer">
                        <i class="bi bi-award"></i> Brand
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox" value="consultant" data-filter="buyer">
                        <i class="bi bi-person-badge"></i> Consultant
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox" value="cmo" data-filter="buyer">
                        <i class="bi bi-person-gear"></i> CMO
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox" value="performance" data-filter="buyer">
                        <i class="bi bi-graph-up"></i> Performance Marketing
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox" value="legal" data-filter="buyer">
                        <i class="bi bi-shield-check"></i> Legal/Compliance
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox" value="creative" data-filter="buyer">
                        <i class="bi bi-palette"></i> Creative
                    </label>
                </div>
            </div>
            <div class="filter-group">
                <label><i class="bi bi-clock"></i> Time Required:</label>
                <div class="filter-checkboxes">
                    <label class="filter-checkbox">
                        <input type="checkbox" value="quick" data-filter="speed">
                        <i class="bi bi-lightning-charge"></i> <30min
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox" value="medium" data-filter="speed">
                        <i class="bi bi-clock"></i> 30-60min
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox" value="long" data-filter="speed">
                        <i class="bi bi-hourglass-split"></i> >60min
                    </label>
                </div>
            </div>
            <div class="filter-group">
                <label><i class="bi bi-exclamation-triangle"></i> Market Urgency:</label>
                <div class="filter-checkboxes">
                    <label class="filter-checkbox">
                        <input type="checkbox" value="HIGH" data-filter="urgency">
                        <i class="bi bi-exclamation-triangle-fill text-danger"></i> High
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox" value="MEDIUM" data-filter="urgency">
                        <i class="bi bi-exclamation-diamond-fill text-warning"></i> Medium
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox" value="LOW" data-filter="urgency">
                        <i class="bi bi-check-circle-fill text-success"></i> Low
                    </label>
                </div>
            </div>
            <div class="filter-actions">
                <button class="btn-secondary" id="clearFilters"><i class="bi bi-x-circle"></i> Clear All</button>
            </div>
        `;
    }

    setupEventListeners() {
        // Close modal
        document.addEventListener('click', (e) => {
            if (e.target.id === 'closeStrategyModal') {
                this.close();
            }
        });

        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.matches('.tab-btn')) {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            }
        });

        // Filter functionality
        document.addEventListener('change', (e) => {
            if (e.target.matches('.filter-checkboxes input[type="checkbox"]')) {
                this.applyFilters();
            }
        });

        // Clear filters
        document.addEventListener('click', (e) => {
            if (e.target.id === 'clearFilters') {
                this.clearFilters();
            }
        });

        // CSV functionality
        document.addEventListener('click', (e) => {
            if (e.target.id === 'validateCsv') {
                this.validateCustomStrategy();
            } else if (e.target.id === 'cancelCustom') {
                this.cancelCustomStrategy();
            }
        });

        // Close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
    }

    open() {
        this.modal.classList.add('show');
        this.populateStrategyGrid();
    }

    close() {
        this.modal.classList.remove('show');
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName + '-tab').classList.add('active');
    }

    async populateStrategyGrid() {
        const grid = document.getElementById('strategyGrid');
        if (!grid) return;

        // Show loading state
        grid.innerHTML = '<p style="text-align: center; color: #6b7280; grid-column: 1/-1;">Loading strategies...</p>';

        const strategies = window.strategyLoader.getStrategies();
        
        if (strategies.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: #dc2626; grid-column: 1/-1;">No strategies available</p>';
            return;
        }

        // Clear and populate grid
        grid.innerHTML = '';
        strategies.forEach(strategy => {
            const card = this.createStrategyCard(strategy);
            grid.appendChild(card);
        });
    }

    createStrategyCard(strategy) {
        const card = document.createElement('div');
        card.className = 'strategy-card';
        card.innerHTML = `
            <div class="strategy-card-left">
                <div class="strategy-card-header">
                    <div class="strategy-title-section">
                        <h4 class="strategy-card-title">${strategy.name}</h4>
                        <p class="strategy-card-description">${strategy.description}</p>
                    </div>
                </div>

                <div class="strategy-value-section">
                    <div class="strategy-value-item">
                        <div class="strategy-value-label">
                            <i class="bi bi-people"></i>
                            Who is searching for this?
                        </div>
                        <div class="strategy-value-text">${strategy.whoSearches}</div>
                    </div>

                    <div class="strategy-value-item">
                        <div class="strategy-value-label">
                            <i class="bi bi-exclamation-circle"></i>
                            Why they need this now?
                        </div>
                        <div class="strategy-value-text">${strategy.whyNeeded}</div>
                    </div>

                    <div class="strategy-value-item">
                        <div class="strategy-value-label">
                            <i class="bi bi-star"></i>
                            Value delivered
                        </div>
                        <div class="strategy-value-text">${strategy.value}</div>
                    </div>
                </div>
            </div>

            <div class="strategy-card-right">
                <span class="strategy-category-badge">${strategy.category}</span>

                <div class="strategy-card-tags">
                    <span class="strategy-tag price"><i class="bi bi-currency-dollar"></i> ${strategy.pricing}</span>
                    <span class="strategy-tag time"><i class="bi bi-clock"></i> ${strategy.speed}</span>
                    <span class="strategy-tag urgency">${this.getUrgencyIcon(strategy.marketUrgency)} ${strategy.marketUrgency}</span>
                </div>

                <button class="strategy-select-btn" data-strategy-id="${strategy.id}">Select STAAAR</button>
            </div>
        `;

        // Add event listener for the select button
        const selectBtn = card.querySelector('.strategy-select-btn');
        selectBtn.addEventListener('click', () => this.selectStrategy(strategy.id));

        return card;
    }

    getUrgencyIcon(urgency) {
        switch(urgency) {
            case 'HIGH': return '<i class="bi bi-exclamation-triangle-fill text-danger"></i>';
            case 'MEDIUM': return '<i class="bi bi-exclamation-diamond-fill text-warning"></i>';
            case 'LOW': return '<i class="bi bi-check-circle-fill text-success"></i>';
            default: return '<i class="bi bi-exclamation-diamond-fill text-warning"></i>';
        }
    }

    async selectStrategy(strategyId) {
        const success = await window.strategyLoader.selectStrategy(strategyId);
        if (success) {
            this.close();
        }
    }

    applyFilters() {
        const strategies = window.strategyLoader.getStrategies();
        
        // Get all checked filters by category
        const pricingFilters = Array.from(document.querySelectorAll('input[data-filter="pricing"]:checked')).map(cb => cb.value);
        const buyerFilters = Array.from(document.querySelectorAll('input[data-filter="buyer"]:checked')).map(cb => cb.value);
        const speedFilters = Array.from(document.querySelectorAll('input[data-filter="speed"]:checked')).map(cb => cb.value);
        const urgencyFilters = Array.from(document.querySelectorAll('input[data-filter="urgency"]:checked')).map(cb => cb.value);

        let filteredStrategies = strategies;

        // Apply filters
        if (pricingFilters.length > 0) {
            filteredStrategies = filteredStrategies.filter(strategy => {
                return pricingFilters.includes(window.strategyLoader.getIncomeLevel(strategy.pricing));
            });
        }

        if (buyerFilters.length > 0) {
            filteredStrategies = filteredStrategies.filter(strategy => {
                const categories = window.strategyLoader.getBuyerCategories(strategy.whoSearches);
                return buyerFilters.some(filter => categories.includes(filter));
            });
        }

        if (speedFilters.length > 0) {
            filteredStrategies = filteredStrategies.filter(strategy => {
                return speedFilters.includes(window.strategyLoader.getSpeedLevel(strategy.speed));
            });
        }

        if (urgencyFilters.length > 0) {
            filteredStrategies = filteredStrategies.filter(strategy => {
                return urgencyFilters.includes(strategy.marketUrgency);
            });
        }

        // Update grid with filtered results
        this.updateGridWithStrategies(filteredStrategies);
    }

    updateGridWithStrategies(strategies) {
        const grid = document.getElementById('strategyGrid');
        grid.innerHTML = '';

        strategies.forEach(strategy => {
            const card = this.createStrategyCard(strategy);
            grid.appendChild(card);
        });

        if (strategies.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: #6b7280; grid-column: 1/-1;">No strategies match your filters.</p>';
        }
    }

    clearFilters() {
        document.querySelectorAll('.filter-checkboxes input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        this.applyFilters();
    }

    validateCustomStrategy() {
        const csvText = document.getElementById('csvInput').value.trim();
        if (!csvText) {
            Utils.showStatus('Please paste your CSV data', 'error');
            return;
        }

        try {
            const result = window.strategyLoader.parseCustomStrategy(csvText);
            if (result.valid) {
                // Update the insight table
                window.strategyLoader.updateInsightTable(result.content);

                // Update selected display
                window.strategyLoader.updateSelectedDisplay({
                    name: result.name,
                    description: result.description
                });

                // Update title card
                window.strategyLoader.updateTitleCard({
                    name: result.name,
                    description: result.description
                });

                // Close modal
                this.close();

                Utils.showStatus('Custom strategy loaded successfully!', 'success');
            } else {
                Utils.showStatus(result.error, 'error');
            }
        } catch (error) {
            Utils.showStatus('Invalid CSV format. Please check your data.', 'error');
        }
    }

    cancelCustomStrategy() {
        document.getElementById('csvInput').value = '';
        this.close();
    }
}