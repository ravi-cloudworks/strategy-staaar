// Branva Consumer Insights Drawer Controller
class BranvaInsightsDrawer {
    constructor() {
        this.drawer = null;
        this.isOpen = false;
        this.currentCategory = 'maps';
        this.currentMatrixId = null;
        this.currentVideo = null;
        this.init();
    }

    init() {
        this.createDrawerHTML();
        this.setupEventListeners();
        this.ensureDrawerClosed();
        // Don't load content until drawer is opened
    }

    createDrawerHTML() {
        const existingDrawer = document.getElementById('insightsDrawer');
        if (existingDrawer) {
            existingDrawer.remove();
        }

        const drawerHTML = `
            <div class="insights-drawer" id="insightsDrawer">
                <div class="drawer-header">
                    <div class="drawer-title">
                        <i class="bi bi-lightbulb"></i>
                        <span>Consumer Insights</span>
                    </div>
                    <button class="drawer-close" id="closeInsightsDrawer">
                        <i class="bi bi-x"></i>
                    </button>
                </div>

                <div class="drawer-content">
                    <!-- Search -->
                    <div class="search-section">
                        <input type="text" class="search-input" placeholder="Search insights..." id="insightsSearchInput">
                    </div>

                    <!-- Insights Categories Grid -->
                    <div class="clusters-grid" id="insightsCategoriesGrid">
                        <!-- Categories will be loaded here -->
                    </div>
                </div>
            </div>

        `;

        document.body.insertAdjacentHTML('beforeend', drawerHTML);
        this.drawer = document.getElementById('insightsDrawer');

        // Modal is now in HTML, no need to create it dynamically
    }

    ensureDrawerClosed() {
        if (this.drawer) {
            this.drawer.classList.remove('open');
            this.isOpen = false;
        }
    }

    setupEventListeners() {
        // Close drawer
        document.getElementById('closeInsightsDrawer')?.addEventListener('click', () => {
            this.close();
        });

        // Close modal
        document.getElementById('closeInsightsCategoryModal')?.addEventListener('click', () => {
            this.closeModal();
        });

        // Cancel selection
        document.getElementById('cancelInsightsSelection')?.addEventListener('click', () => {
            this.closeModal();
        });

        // Create slides
        document.getElementById('createInsightsSlides')?.addEventListener('click', () => {
            this.createInsightsSlides();
        });

        // Search functionality
        document.getElementById('insightsSearchInput')?.addEventListener('input', (e) => {
            this.filterCategories(e.target.value);
        });
    }

    renderCategories() {
        const grid = document.getElementById('insightsCategoriesGrid');
        if (!grid) return;

        const categories = this.getInsightCategories();

        const gridHTML = categories.map(category => `
            <div class="bg-white border border-strategy-200 rounded-lg p-4 hover:shadow-md hover:border-strategy-300 transition-all duration-200 cursor-pointer group cluster-card" data-category="${category.id}">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg cluster-icon" style="background: ${category.color}20; color: ${category.color};">
                        ${category.icon}
                    </div>
                    <div class="flex-1 min-w-0 cluster-content">
                        <h3 class="font-strategic text-base font-semibold text-strategy-800 cluster-title">${category.title}</h3>
                        <p class="font-premium text-xs italic text-premium-500 cluster-subtitle">${category.subtitle}</p>
                        <p class="font-sans text-xs text-strategy-500 mt-1 line-clamp-2 cluster-description">${category.description}</p>
                    </div>
                </div>
            </div>
        `).join('');

        grid.innerHTML = gridHTML;

        // Add click listeners
        grid.querySelectorAll('.cluster-card').forEach(card => {
            card.addEventListener('click', () => {
                const categoryId = card.dataset.category;
                this.openCategoryModal(categoryId);
            });
        });
    }

    openCategoryModal(categoryId) {
        const modal = document.getElementById('insightsCategoryModal');
        const title = document.getElementById('insightsCategoryTitle');
        const description = document.getElementById('insightsCategoryDescription');
        const grid = document.getElementById('insightsCategoryGrid');

        // Get full category data including icon
        const categories = this.getInsightCategories();
        const category = categories.find(cat => cat.id === categoryId);
        const categoryData = this.getCategoryData(categoryId);

        // Set title with icon (like Strategy Solutions)
        if (category) {
            title.innerHTML = `${category.icon} ${categoryData.title}`;
        } else {
            title.textContent = categoryData.title;
        }
        description.textContent = categoryData.description;

        // Generate insights grid using EXACT same approach as Strategy Solutions - simplified content
        let optionsHTML = '<div class="strategy-templates-grid">';

        categoryData.options.forEach(option => {
            const optionId = `insight-${option.id}`;

            optionsHTML += `
                <div class="border border-strategy-200 rounded-lg p-4 hover:shadow-md hover:border-analysis-300 transition-all duration-200 cursor-pointer strategy-template-card relative group" data-strategy-id="${optionId}" data-strategy='${JSON.stringify(option)}'>
                    <!-- Hidden checkbox for form data -->
                    <input type="checkbox" id="${optionId}" class="hidden strategy-checkbox">

                    <!-- Hidden selection indicator - only shows when selected -->
                    <div class="absolute top-3 right-3 w-5 h-5 border-2 border-analysis-500 bg-analysis-500 rounded-full flex items-center justify-center selection-indicator transition-all duration-200 opacity-0 scale-0">
                        <i class="bi bi-check text-white text-sm"></i>
                    </div>

                    <!-- Content -->
                    <div class="strategy-content pr-8">
                        <div class="strategy-header mb-2">
                            <h4 class="font-strategic text-base font-semibold text-strategy-800 mb-2 strategy-name">${option.title}</h4>
                            <div class="strategy-badges flex gap-2 mb-3">
                                <span class="px-2 py-1 text-xs font-medium rounded-full bg-analysis-100 text-analysis-600">Insight</span>
                            </div>
                        </div>
                        <p class="font-sans text-sm text-strategy-600 mb-3 strategy-description">${option.description}</p>
                        <div class="strategy-meta flex gap-4">
                            <span class="font-premium text-xs font-medium text-analysis-600">💡 Framework</span>
                        </div>
                    </div>
                </div>
            `;
        });

        optionsHTML += '</div>';

        grid.innerHTML = optionsHTML;

        // Setup multi-selection using EXACT same approach as Strategy Solutions
        this.setupMultiSelection(categoryData);

        modal.classList.add('show');
        this.updateSelectionCount();
    }

    setupMultiSelection(categoryData) {
        this.selectedInsights = new Set();
        const selectionCount = document.getElementById('insightsSelectionCount');
        const addButton = document.getElementById('createInsightsSlides');

        // Update UI based on selection
        const updateSelectionUI = () => {
            const count = this.selectedInsights.size;
            selectionCount.textContent = `${count} selected`;
            addButton.textContent = count === 0 ? 'Select Insights' :
                                   count === 1 ? 'Create 1 Slide' :
                                   `Create ${count} Slides`;
            addButton.disabled = count === 0;
        };

        // Card click handlers for selection
        document.querySelectorAll('.strategy-template-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const checkbox = card.querySelector('.strategy-checkbox');
                const indicator = card.querySelector('.selection-indicator');
                const strategyId = card.dataset.strategyId;
                const strategyData = JSON.parse(card.dataset.strategy);

                // Toggle selection
                checkbox.checked = !checkbox.checked;

                if (checkbox.checked) {
                    // Add to selection
                    this.selectedInsights.add({
                        id: strategyId,
                        data: strategyData,
                        category: categoryData
                    });
                    card.classList.add('selected', 'bg-analysis-50', 'border-analysis-500');
                    indicator.classList.remove('opacity-0', 'scale-0');
                    indicator.classList.add('opacity-100', 'scale-100');
                } else {
                    // Remove from selection
                    const toRemove = [...this.selectedInsights].find(s => s.id === strategyId);
                    if (toRemove) {
                        this.selectedInsights.delete(toRemove);
                    }
                    card.classList.remove('selected', 'bg-analysis-50', 'border-analysis-500');
                    indicator.classList.add('opacity-0', 'scale-0');
                    indicator.classList.remove('opacity-100', 'scale-100');
                }

                updateSelectionUI();
            });
        });

        // Initial UI update
        updateSelectionUI();
    }

    getCategoryData(categoryId) {
        const categoryMap = this.getInsightCategoryData();
        return categoryMap[categoryId] || { title: 'Unknown Category', description: '', options: [] };
    }

    updateSelectionCount() {
        // This method is now handled by setupMultiSelection - keeping for compatibility
        const count = this.selectedInsights ? this.selectedInsights.size : 0;
        const countElement = document.getElementById('insightsSelectionCount');
        const createButton = document.getElementById('createInsightsSlides');

        if (countElement) {
            countElement.textContent = `${count} selected`;
        }

        if (createButton) {
            createButton.disabled = count === 0;
            createButton.textContent = count === 0 ? 'Select Insights' :
                                     count === 1 ? 'Create 1 Slide' :
                                     `Create ${count} Slides`;
        }
    }

    createInsightsSlides() {
        const checkedBoxes = document.querySelectorAll('.strategy-checkbox:checked');
        if (checkedBoxes.length === 0) {
            if (window.showToast) {
                window.showToast('Please select at least one insight option', 'warning');
            }
            return;
        }

        console.log(`📊 Creating ${checkedBoxes.length} insight slides...`);

        // Process each selected insight option
        let createdCount = 0;
        checkedBoxes.forEach(checkbox => {
            const card = checkbox.closest('.strategy-template-card');
            const optionData = JSON.parse(card.dataset.strategy);

            // Create slide for this insight option
            if (this.createInsightSlide(optionData)) {
                createdCount++;
            }
        });

        this.closeModal();

        if (window.showToast) {
            window.showToast(`Created ${createdCount} insight slides!`, 'success');
        }
    }

    createInsightSlide(optionData) {
        try {
            // Add new slide if canvas is available
            if (window.branvaCanvas) {
                const createNewSlide = window.branvaCanvas.slides.length > 0 &&
                                      window.branvaCanvas.getCurrentSlide().elements.length > 0;

                if (createNewSlide) {
                    window.branvaCanvas.addNewSlide();
                } else {
                    window.branvaCanvas.clearCurrentSlide();
                }

                window.branvaCanvas.hideWelcomeMessage();

                // Create insight element based on option type
                const insightElement = this.createInsightElement(optionData);

                window.branvaCanvas.addElementToSlide(insightElement);
                window.branvaCanvas.renderInsightTool(insightElement);

                console.log(`✅ Created slide for: ${optionData.title}`);
                return true;
            } else {
                console.error('❌ Canvas not available');
                return false;
            }
        } catch (error) {
            console.error('❌ Error creating insight slide:', error);
            return false;
        }
    }

    createInsightElement(optionData) {
        // Map insight options to their corresponding template names
        const insightTemplates = {
            'rituals-symbolism': {
                templateName: 'rituals-symbolism-ladder',
                defaultSize: { width: 95, height: 85 },
                type: 'rituals-symbolism-ladder'
            },
            'customer-journey': {
                templateName: 'customer-journey-mapping',
                defaultSize: { width: 95, height: 85 },
                type: 'customer-journey-mapping'
            },
            'value-proposition': {
                templateName: 'value-proposition-canvas',
                defaultSize: { width: 95, height: 85 },
                type: 'value-proposition-canvas'
            },
            'empathy-mapping': {
                templateName: 'empathy-mapping',
                defaultSize: { width: 95, height: 85 },
                type: 'empathy-mapping'
            },
            'personas-development': {
                templateName: 'personas-development',
                defaultSize: { width: 95, height: 85 },
                type: 'personas-development'
            },
            'market-segmentation': {
                templateName: 'market-segmentation',
                defaultSize: { width: 95, height: 85 },
                type: 'market-segmentation'
            },
            'competitor-analysis': {
                templateName: 'competitor-analysis',
                defaultSize: { width: 95, height: 85 },
                type: 'competitor-analysis'
            },
            'swot-analysis': {
                templateName: 'swot-analysis',
                defaultSize: { width: 95, height: 85 },
                type: 'swot-analysis'
            },
            'trend-analysis': {
                templateName: 'trend-analysis',
                defaultSize: { width: 95, height: 85 },
                type: 'trend-analysis'
            },
            'behavioral-triggers': {
                templateName: 'behavioral-triggers',
                defaultSize: { width: 95, height: 85 },
                type: 'behavioral-triggers'
            },
            'psychological-drivers': {
                templateName: 'psychological-drivers',
                defaultSize: { width: 95, height: 85 },
                type: 'psychological-drivers'
            },
            'decision-factors': {
                templateName: 'decision-making-factors',
                defaultSize: { width: 95, height: 85 },
                type: 'decision-making-factors'
            },
            'emotional-mapping': {
                templateName: 'emotional-mapping',
                defaultSize: { width: 95, height: 85 },
                type: 'emotional-mapping'
            },
            'cultural-insights': {
                templateName: 'cultural-insights',
                defaultSize: { width: 95, height: 85 },
                type: 'cultural-insights'
            },
            'demographic-analysis': {
                templateName: 'demographic-analysis',
                defaultSize: { width: 95, height: 85 },
                type: 'demographic-analysis'
            },
            'psychographic-profiling': {
                templateName: 'psychographic-profiling',
                defaultSize: { width: 95, height: 85 },
                type: 'psychographic-profiling'
            },
            'usage-patterns': {
                templateName: 'usage-patterns',
                defaultSize: { width: 95, height: 85 },
                type: 'usage-patterns'
            },
            'needs-assessment': {
                templateName: 'needs-assessment',
                defaultSize: { width: 95, height: 85 },
                type: 'needs-assessment'
            }
        };

        const template = insightTemplates[optionData.id] || {
            templateName: 'rituals-symbolism-ladder', // Default fallback
            defaultSize: { width: 95, height: 85 },
            type: 'generic-insight-tool'
        };

        return {
            id: window.branvaCanvas.generateId(),
            type: 'insight-tool',
            size: {
                width: template.defaultSize.width,
                height: template.defaultSize.height
            },
            position: {
                x: 2.5,
                y: 10
            },
            zIndex: 1,
            content: {
                templateName: template.templateName,
                insightType: template.type,
                insightName: optionData.title,
                title: optionData.title,
                description: optionData.description,
                outcome: optionData.outcome,
                template: optionData.template,
                optionId: optionData.id
            }
        };
    }

    closeModal() {
        const modal = document.getElementById('insightsCategoryModal');
        modal.classList.remove('show');

        // Clear selections and visual states
        document.querySelectorAll('.strategy-template-card').forEach(card => {
            const checkbox = card.querySelector('.strategy-checkbox');
            const indicator = card.querySelector('.selection-indicator');

            checkbox.checked = false;
            card.classList.remove('selected', 'bg-analysis-50', 'border-analysis-500');
            if (indicator) {
                indicator.classList.add('opacity-0', 'scale-0');
                indicator.classList.remove('opacity-100', 'scale-100');
            }
        });
        this.updateSelectionCount();
    }

    filterCategories(searchTerm) {
        const cards = document.querySelectorAll('.cluster-card');
        const term = searchTerm.toLowerCase();

        cards.forEach(card => {
            const title = card.querySelector('.cluster-title').textContent.toLowerCase();
            const description = card.querySelector('.cluster-description').textContent.toLowerCase();

            if (title.includes(term) || description.includes(term)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    open(matrixId = null) {
        if (this.isOpen) return;

        // console.log('📊 Consumer Insights drawer opened');
        this.drawer.classList.add('open');
        this.isOpen = true;

        // Store matrixId for potential use
        this.currentMatrixId = matrixId;

        // Adjust canvas area for drawer
        const canvasArea = document.querySelector('.canvas-area');
        if (canvasArea) {
            canvasArea.classList.add('with-insights-drawer');
        }

        // Load categories when drawer opens
        this.renderCategories();

        if (window.showToast) {
            // window.showToast('Consumer Insights drawer opened', 'success');
        }
    }

    close() {
        if (!this.isOpen) return;

        // console.log('📊 Consumer Insights drawer closed');
        this.drawer.classList.remove('open');
        this.isOpen = false;

        // Remove canvas area adjustment
        const canvasArea = document.querySelector('.canvas-area');
        if (canvasArea) {
            canvasArea.classList.remove('with-insights-drawer');
        }

        // Close any open modals
        this.closeModal();

        if (window.showToast) {
            // window.showToast('Consumer Insights drawer closed', 'success');
        }
    }

    // Configurable data structure for easy addition of new categories
    getInsightCategories() {
        return [
            {
                id: 'market-location',
                icon: '<i class="bi bi-geo-alt-fill"></i>',
                title: 'Market & Location Insights',
                subtitle: 'Where to Play',
                description: 'Identify regions and environments with the highest growth, least competition, and best alignment with brand potential.',
                color: '#2563EB'
            },
            {
                id: 'cultural-behavioral',
                icon: '<i class="bi bi-people-fill"></i>',
                title: 'Cultural & Behavioral Insights',
                subtitle: 'How People Behave',
                description: 'Decode cultural motivations, symbols, and rituals that drive brand relevance.',
                color: '#7C3AED'
            },
            {
                id: 'audience-psychographic',
                icon: '<i class="bi bi-bullseye"></i>',
                title: 'Audience & Psychographic Insights',
                subtitle: 'Who to Target',
                description: 'Define audience segments not by demographics but by desire, motivation, and influence power.',
                color: '#0891B2'
            },
            {
                id: 'category-competitive',
                icon: '<i class="bi bi-grid-3x3-gap-fill"></i>',
                title: 'Category & Competitive Insights',
                subtitle: 'What Space to Own',
                description: 'Reveal competitive gaps, brand white space, and emotional differentiation zones.',
                color: '#059669'
            },
            {
                id: 'process-experience',
                icon: '<i class="bi bi-gear-fill"></i>',
                title: 'Process & Experience Insights',
                subtitle: 'How to Operate or Express',
                description: 'Align experience, delivery, and tone to market expectations.',
                color: '#D97706'
            },
            {
                id: 'implementation',
                icon: '<i class="bi bi-rocket-takeoff-fill"></i>',
                title: 'Implementation Insights',
                subtitle: 'When & What Next',
                description: 'Plan next moves with time, channels, and predictive momentum.',
                color: '#DC2626'
            }
        ];
    }

    // Configurable data structure for easy addition of new options per category
    getInsightCategoryData() {
        return {
            'market-location': {
                title: 'Market & Location Insights',
                description: 'Identify regions and environments with the highest growth, least competition, and best alignment with brand potential.',
                options: [
                    {
                        id: 'regional-mapping',
                        title: 'Regional Opportunity Mapping',
                        description: 'Identify high-growth regions with unmet demand.',
                        outcome: 'Visual map of high-potential regions.',
                        template: 'GeoJSON Map + Bar/Pie Sidebar – click regions → show growth data.'
                    },
                    {
                        id: 'audience-density',
                        title: 'Audience Density Heatmaps',
                        description: 'Visualize customer cluster intensity by demographics.',
                        outcome: 'Visual density view of where target customers live.',
                        template: 'Heatmap Overlay on Map – toggle between cluster types.'
                    },
                    {
                        id: 'economic-conditions',
                        title: 'Economic Conditions Board',
                        description: 'Compare income, entry cost, infra readiness across regions.',
                        outcome: 'Clear choice of top 2–3 markets to enter.',
                        template: 'Card Grid + Draggable Stars – each card editable with photo + rank.'
                    }
                ]
            },
            'cultural-behavioral': {
                title: 'Cultural & Behavioral Insights',
                description: 'Decode cultural motivations, symbols, and rituals that drive brand relevance.',
                options: [
                    {
                        id: 'identity-archetype',
                        title: 'Identity Archetype Wheel',
                        description: 'Understand aspirational archetypes customers relate to.',
                        outcome: 'Map brand fit to cultural archetypes.',
                        template: 'Circular Wheel with 12 Slots – drag brand image into an archetype.'
                    },
                    {
                        id: 'rituals-symbolism',
                        title: 'Rituals & Symbolism Ladder',
                        description: 'Identify occasions, triggers, humor, and taboo layers.',
                        outcome: 'Hierarchy of what people celebrate, avoid, or admire.',
                        template: 'Vertical Ladder – draggable text/image triggers up functional→emotional.'
                    },
                    {
                        id: 'lifestyle-shifts',
                        title: 'Lifestyle Shifts Timeline',
                        description: 'Track major lifestyle or mindset changes post-AI/pandemic.',
                        outcome: 'Visual storyline of emerging needs.',
                        template: 'Image Timeline Carousel – draggable cards with caption + year.'
                    }
                ]
            },
            'audience-psychographic': {
                title: 'Audience & Psychographic Insights',
                description: 'Define audience segments not by demographics but by desire, motivation, and influence power.',
                options: [
                    {
                        id: 'persona-motivations',
                        title: 'Persona Motivations Board',
                        description: 'Segment audiences by emotional and rational drivers.',
                        outcome: 'Clear visual of key audience archetypes.',
                        template: 'Persona Cards + Draggable Motivation Tags – drop motivators onto persona.'
                    },
                    {
                        id: 'pain-gain-quadrant',
                        title: 'Pain–Gain Quadrant',
                        description: 'Map barriers (pains) and enablers (gains).',
                        outcome: 'Prioritized list of emotional and functional motivators.',
                        template: 'Quadrant Board with Sticky Notes – draggable post-its in 4 zones.'
                    },
                    {
                        id: 'influence-network',
                        title: 'Influence Network Map',
                        description: 'Identify who shapes adoption (trendsetters → mass).',
                        outcome: 'Influence clusters and early adopter path.',
                        template: 'Cluster Map (images as nodes) – draggable relationship lines.'
                    }
                ]
            },
            'category-competitive': {
                title: 'Category & Competitive Insights',
                description: 'Reveal competitive gaps, brand white space, and emotional differentiation zones.',
                options: [
                    {
                        id: 'competitor-footprint',
                        title: 'Competitor Footprint Canvas',
                        description: 'Visualize each brand\'s price–value position.',
                        outcome: 'Clear competitive whitespace.',
                        template: '2D Canvas (Price vs Value) – drag brand logo cards onto grid.'
                    },
                    {
                        id: 'disruption-whitespace',
                        title: 'Disruption & White Space Matrix',
                        description: 'Identify functional vs emotional opportunity zones.',
                        outcome: 'Defined brand opportunity quadrant.',
                        template: '4-Quadrant Canvas – drop keywords/brands, highlight empties.'
                    },
                    {
                        id: 'innovation-trend',
                        title: 'Innovation Trend Wall',
                        description: 'Observe trends in formats, design, or features.',
                        outcome: 'Visual understanding of what "premium" means now.',
                        template: 'Masonry Card Grid – add images/tags; drag to reorder by relevance.'
                    }
                ]
            },
            'process-experience': {
                title: 'Process & Experience Insights',
                description: 'Align experience, delivery, and tone to market expectations.',
                options: [
                    {
                        id: 'customer-journey',
                        title: 'Customer Journey Map',
                        description: 'Identify pain points across awareness → loyalty.',
                        outcome: 'Visual journey map highlighting frictions.',
                        template: 'Swimlane Journey with Icons/Stages – drag notes per phase.'
                    },
                    {
                        id: 'omnichannel-touchpoint',
                        title: 'Omnichannel Touchpoint Wheel',
                        description: 'Visualize readiness of each touchpoint.',
                        outcome: 'Balanced channel performance dashboard.',
                        template: 'Circular Wheel Around Brand Logo – click to mark readiness (color glow).'
                    },
                    {
                        id: 'brand-voice-adaptation',
                        title: 'Brand Voice Adaptation Tool',
                        description: 'Adjust tone to fit market expectations.',
                        outcome: 'Sample tone-of-voice ready for use.',
                        template: 'Text Area + Tone Preset Buttons – live preview for each tone.'
                    }
                ]
            },
            'implementation': {
                title: 'Implementation Insights',
                description: 'Plan next moves with time, channels, and predictive momentum.',
                options: [
                    {
                        id: 'action-timeline',
                        title: 'Action Timeline / Roadmap',
                        description: 'Sequence major market actions or campaigns.',
                        outcome: 'Prioritized timeline of execution.',
                        template: 'Interactive Gantt Bar Timeline – editable milestones with time sliders.'
                    },
                    {
                        id: 'channel-availability',
                        title: 'Channel Availability Board',
                        description: 'Compare reach, relevance, and cost of local media.',
                        outcome: 'Clear decision on which channels to activate first.',
                        template: 'Media Icons with Slider Bars – drag bars to set reach/cost/fit.'
                    },
                    {
                        id: 'performance-readiness',
                        title: 'Performance Readiness Scoreboard',
                        description: 'Evaluate launch readiness of assets and teams.',
                        outcome: 'Confidence gauge for go-to-market.',
                        template: 'Card Dashboard with Progress Bars + Emojis – editable labels and progress.'
                    }
                ]
            }
        };
    }

}

// Initialize and make globally available
window.BranvaInsightsDrawer = BranvaInsightsDrawer;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.branvaInsightsDrawer = new BranvaInsightsDrawer();
    // console.log('🎯 Branva Insights Drawer initialized');
});
