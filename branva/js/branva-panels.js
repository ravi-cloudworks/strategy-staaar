// Branva Panels Management

class BranvaPanels {
    constructor() {
        this.currentPanel = 'solutions';
        this.selectedPersona = null;
        this.currentSolution = null;
        this.currentMockup = null;
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.loadSolutions();
        this.loadInsights();
        this.loadPersonas();
    }

    bindEvents() {
        // Sidebar tab switching
        document.querySelectorAll('.sidebar-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const panel = e.currentTarget.dataset.panel;
                this.switchPanel(panel);
            });
        });

        // Solution filters
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const filter = e.currentTarget.dataset.filter;
                this.filterSolutions(filter);

                // Update active state
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // Insight categories
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.filterInsights(category);

                // Update active state
                document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
        });

        // Solution search
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchSolutions(e.target.value);
            });
        }

        // Modal events
        this.bindModalEvents();
    }

    bindModalEvents() {
        // Solution modal
        const solutionModal = document.getElementById('solutionModal');
        const closeSolutionModal = document.getElementById('closeSolutionModal');
        const replaceSlideBtn = document.getElementById('replaceSlideBtn');
        const addNewSlideBtn = document.getElementById('addNewSlideBtn');

        if (closeSolutionModal) {
            closeSolutionModal.addEventListener('click', () => {
                this.closeSolutionModal();
            });
        }

        if (replaceSlideBtn) {
            replaceSlideBtn.addEventListener('click', () => {
                this.applySolutionToCurrentSlide();
            });
        }

        if (addNewSlideBtn) {
            addNewSlideBtn.addEventListener('click', () => {
                this.applySolutionToNewSlide();
            });
        }

        // Mockup modal
        const mockupModal = document.getElementById('mockupModal');
        const closeMockupModal = document.getElementById('closeMockupModal');
        const uploadCreativeBtn = document.getElementById('uploadCreativeBtn');
        const creativeUpload = document.getElementById('creativeUpload');
        const addMockupBtn = document.getElementById('addMockupBtn');
        const cancelMockupBtn = document.getElementById('cancelMockupBtn');

        if (closeMockupModal) {
            closeMockupModal.addEventListener('click', () => {
                this.closeMockupModal();
            });
        }

        if (cancelMockupBtn) {
            cancelMockupBtn.addEventListener('click', () => {
                this.closeMockupModal();
            });
        }

        if (uploadCreativeBtn && creativeUpload) {
            uploadCreativeBtn.addEventListener('click', () => {
                creativeUpload.click();
            });

            creativeUpload.addEventListener('change', (e) => {
                this.handleCreativeUpload(e);
            });
        }

        if (addMockupBtn) {
            addMockupBtn.addEventListener('click', () => {
                this.addMockupToSlide();
            });
        }

        // Close modals on overlay click
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                }
            });
        });
    }

    switchPanel(panelName) {
        // Update sidebar tabs
        document.querySelectorAll('.sidebar-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-panel="${panelName}"]`).classList.add('active');

        // Close all existing drawers first
        this.closeAllDrawers();

        // Hide all panel content when using drawer system
        document.querySelectorAll('.panel').forEach(panel => {
            panel.classList.remove('active');
        });

        // Open appropriate drawer based on panel
        switch (panelName) {
            case 'solutions':
                this.openSolutionsDrawer();
                break;
            case 'insights':
                this.openConsumerInsightsDrawer();
                break;
            case 'mockups':
                this.openVisualActivationsDrawer();
                break;
            case 'text':
                this.openTextDrawer();
                break;
            case 'brand':
                this.openBrandDrawer();
                break;
            case 'tools':
                this.openToolsDrawer();
                break;
            default:
                // Fallback to old panel system if drawer doesn't exist
                document.getElementById(`${panelName}Panel`).classList.add('active');
        }

        this.currentPanel = panelName;
    }

    closeAllDrawers() {
        // Clear all canvas area drawer classes first to prevent flicker
        const canvasArea = document.getElementById('canvasArea');
        if (canvasArea) {
            canvasArea.classList.remove(
                'with-drawer',
                'with-insights-drawer',
                'with-solutions-drawer',
                'with-mockups-drawer',
                'with-text-drawer',
                'with-brand-drawer',
                'with-tools-drawer'
            );
        }

        // Close all existing drawers
        if (window.branvaInsightsDrawer && window.branvaInsightsDrawer.isOpen) {
            window.branvaInsightsDrawer.close();
        }
        if (window.branvaVideoDrawer && window.branvaVideoDrawer.isOpen) {
            window.branvaVideoDrawer.close();
        }
        if (window.bravaSolutionsDrawer && window.bravaSolutionsDrawer.isOpen) {
            window.bravaSolutionsDrawer.close();
        }
        if (window.branvaMockupsDrawer && window.branvaMockupsDrawer.isOpen) {
            window.branvaMockupsDrawer.close();
        }
        if (window.branvaVisualActivationsDrawer && window.branvaVisualActivationsDrawer.isOpen) {
            window.branvaVisualActivationsDrawer.close();
        }
        if (window.branvaTextDrawer && window.branvaTextDrawer.isOpen) {
            window.branvaTextDrawer.close();
        }
        if (window.branvaBrandDrawer && window.branvaBrandDrawer.isOpen) {
            window.branvaBrandDrawer.close();
        }
        if (window.branvaToolsDrawer && window.branvaToolsDrawer.isOpen) {
            window.branvaToolsDrawer.close();
        }
    }

    openSolutionsDrawer() {
        if (window.bravaSolutionsDrawer) {
            window.bravaSolutionsDrawer.open();
        } else {
            // Fallback to panel until drawer is created
            document.getElementById('solutionsPanel').classList.add('active');
        }
    }

    openMockupsDrawer() {
        if (window.branvaMockupsDrawer) {
            window.branvaMockupsDrawer.open();
        } else {
            document.getElementById('mockupsPanel').classList.add('active');
        }
    }

    openVisualActivationsDrawer() {
        if (window.branvaVisualActivationsDrawer) {
            window.branvaVisualActivationsDrawer.open();
        } else {
            document.getElementById('mockupsPanel').classList.add('active');
        }
    }

    openTextDrawer() {
        if (window.branvaTextDrawer) {
            window.branvaTextDrawer.open();
        } else {
            document.getElementById('textPanel').classList.add('active');
        }
    }

    openBrandDrawer() {
        if (window.branvaBrandDrawer) {
            window.branvaBrandDrawer.open();
        } else {
            document.getElementById('brandPanel').classList.add('active');
        }
    }

    openToolsDrawer() {
        if (window.branvaToolsDrawer) {
            window.branvaToolsDrawer.open();
        } else {
            document.getElementById('toolsPanel').classList.add('active');
        }
    }

    openConsumerInsightsDrawer() {
        // Close video drawer if open
        if (window.branvaVideoDrawer && window.branvaVideoDrawer.isOpen) {
            window.branvaVideoDrawer.close();
        }

        // Get current matrices for video analysis functionality
        const currentMatrices = window.branvaCanvas ? window.branvaCanvas.getCurrentMatrices() : [];
        const matrixId = currentMatrices.length > 0 ? currentMatrices[0].id : null;

        // Open Consumer Insights drawer
        if (window.branvaInsightsDrawer) {
            window.branvaInsightsDrawer.open(matrixId);
        } else {
            this.showToast('Consumer Insights drawer not available', 'error');
        }
    }

    // Solutions Panel
    async loadSolutions(filter = 'all') {
        const solutionsGrid = document.getElementById('solutionsGrid');
        if (!solutionsGrid) return;

        // Show loading state
        solutionsGrid.innerHTML = '<div style="text-align: center; padding: 20px; color: #94a3b8;">Loading strategies...</div>';

        // Load strategies from the data source
        const loaded = await window.BranvaData.loadStrategies();
        if (!loaded) {
            solutionsGrid.innerHTML = '<div style="text-align: center; padding: 20px; color: #ef4444;">Failed to load strategies</div>';
            return;
        }

        const solutions = window.BranvaData.getSolutionsByCategory(filter);

        solutionsGrid.innerHTML = solutions.map(solution => `
            <div class="solution-card" data-solution-id="${solution.id}">
                <h4 class="solution-title">${solution.name}</h4>
                <p class="solution-description">${solution.description}</p>
                <div class="solution-badges">
                    <span class="badge urgency-${solution.marketUrgency.toLowerCase()}">${solution.marketUrgency}</span>
                    ${solution.category.map(cat => `<span class="badge category">${cat}</span>`).join('')}
                    <span class="badge speed">${solution.speed}</span>
                </div>
            </div>
        `).join('');

        // Bind click events to solution cards
        solutionsGrid.querySelectorAll('.solution-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const solutionId = e.currentTarget.dataset.solutionId;
                this.openSolutionModal(solutionId);
            });
        });
    }

    filterSolutions(filter) {
        this.loadSolutions(filter);
    }

    searchSolutions(query) {
        const solutionsGrid = document.getElementById('solutionsGrid');
        if (!solutionsGrid) return;

        const solutions = window.BranvaData.solutions.filter(solution =>
            solution.name.toLowerCase().includes(query.toLowerCase()) ||
            solution.description.toLowerCase().includes(query.toLowerCase()) ||
            solution.category.some(cat => cat.toLowerCase().includes(query.toLowerCase()))
        );

        solutionsGrid.innerHTML = solutions.map(solution => `
            <div class="solution-card" data-solution-id="${solution.id}">
                <h4 class="solution-title">${solution.name}</h4>
                <p class="solution-description">${solution.description}</p>
                <div class="solution-badges">
                    <span class="badge urgency-${solution.marketUrgency.toLowerCase()}">${solution.marketUrgency}</span>
                    ${solution.category.map(cat => `<span class="badge category">${cat}</span>`).join('')}
                    <span class="badge speed">${solution.speed}</span>
                </div>
            </div>
        `).join('');

        // Rebind events
        solutionsGrid.querySelectorAll('.solution-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const solutionId = e.currentTarget.dataset.solutionId;
                this.openSolutionModal(solutionId);
            });
        });
    }

    openSolutionModal(solutionId) {
        const solution = window.BranvaData.solutions.find(s => s.id === solutionId);
        if (!solution) return;

        this.currentSolution = solution;

        // Update modal content
        document.getElementById('solutionTitle').textContent = solution.name;

        const solutionInfo = document.getElementById('solutionInfo');
        solutionInfo.innerHTML = `
            <div class="solution-details">
                <p><strong>Description:</strong> ${solution.description}</p>
                <p><strong>Value:</strong> ${solution.value}</p>
                <p><strong>Who Searches:</strong> ${solution.whoSearches}</p>
                <p><strong>Why Needed:</strong> ${solution.whyNeeded}</p>
                <p><strong>Pricing:</strong> ${solution.pricing}</p>
                <p><strong>Speed:</strong> ${solution.speed}</p>
                <p><strong>Grid Size:</strong> ${solution.gridSize.rows} x ${solution.gridSize.columns}</p>
            </div>
        `;

        const solutionPreview = document.getElementById('solutionPreview');
        solutionPreview.innerHTML = `
            <div class="grid-preview" style="display: grid; grid-template-columns: repeat(6, 1fr); grid-template-rows: repeat(${solution.gridSize.rows}, 1fr); gap: 2px; width: 300px; height: ${300 * solution.gridSize.rows / 6}px; border: 1px solid #e2e8f0;">
                ${Array.from({length: solution.gridSize.rows * solution.gridSize.columns}, (_, i) => `
                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; min-height: 40px;"></div>
                `).join('')}
            </div>
        `;

        // Show modal
        document.getElementById('solutionModal').classList.add('active');
    }

    closeSolutionModal() {
        document.getElementById('solutionModal').classList.remove('active');
        this.currentSolution = null;
    }

    async applySolutionToCurrentSlide() {
        if (!this.currentSolution) return;

        this.showToast('Loading strategy matrix...', 'info');

        if (window.branvaCanvas) {
            await window.branvaCanvas.applySolutionTemplate(this.currentSolution, false);
            this.showToast('Solution applied to current slide', 'success');
        }

        this.closeSolutionModal();
    }

    async applySolutionToNewSlide() {
        if (!this.currentSolution) return;

        this.showToast('Loading strategy matrix...', 'info');

        if (window.branvaCanvas) {
            await window.branvaCanvas.applySolutionTemplate(this.currentSolution, true);
            this.showToast('Solution applied to new slide', 'success');
        }

        this.closeSolutionModal();
    }

    // Insights Panel
    loadInsights(category = 'maps') {
        const insightsGrid = document.getElementById('insightsGrid');
        if (!insightsGrid) return;

        const insights = window.BranvaData.getInsightsByCategory(category);

        insightsGrid.innerHTML = insights.map(insight => `
            <div class="insight-tool" data-insight-id="${insight.id}">
                <div class="insight-icon">
                    <i class="${insight.iconClass}"></i>
                </div>
                <div class="insight-name">${insight.name}</div>
            </div>
        `).join('');

        // Bind click events to insight tools
        insightsGrid.querySelectorAll('.insight-tool').forEach(tool => {
            tool.addEventListener('click', (e) => {
                const insightId = e.currentTarget.dataset.insightId;
                this.addInsightToCanvas(insightId);
            });
        });
    }

    filterInsights(category) {
        this.loadInsights(category);
    }

    addInsightToCanvas(insightId) {
        const insight = window.BranvaData.insights.find(i => i.id === insightId);
        if (!insight) return;

        // Handle special video analysis actions
        if (insight.action === 'openVideoModal') {
            this.openVideoAnalysisModal();
            return;
        }

        if (window.branvaCanvas) {
            window.branvaCanvas.addInsightElement(insight);
            this.showToast(`${insight.name} added to slide`, 'success');
        }
    }

    // Video Analysis Drawer
    openVideoAnalysisModal() {
        // Check if we have matrices on the current slide
        const currentMatrices = window.branvaCanvas ? window.branvaCanvas.getCurrentMatrices() : [];

        if (currentMatrices.length === 0) {
            this.showToast('Add a strategy matrix first to capture video frames', 'warning');
            return;
        }

        // Open the video drawer with matrix context
        if (window.branvaVideoDrawer) {
            window.branvaVideoDrawer.open(currentMatrices[0].id); // Use first matrix ID
            this.showToast('Video analysis drawer opened', 'success');
        } else {
            this.showToast('Video analysis not available', 'error');
        }
    }

    // Mockups Panel
    loadPersonas() {
        const personasSection = document.getElementById('personasSection');
        if (!personasSection) return;

        personasSection.innerHTML = window.BranvaData.personas.map(persona => `
            <div class="persona-card" data-persona-id="${persona.id}">
                <h4 class="persona-name">${persona.name}</h4>
                <p class="persona-description">${persona.description}</p>
            </div>
        `).join('');

        // Bind click events to persona cards
        personasSection.querySelectorAll('.persona-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const personaId = e.currentTarget.dataset.personaId;
                this.selectPersona(personaId, e.currentTarget);
            });
        });
    }

    selectPersona(personaId, cardElement) {
        this.selectedPersona = personaId;

        // Update active state
        document.querySelectorAll('.persona-card').forEach(card => {
            card.classList.remove('active');
        });
        cardElement.classList.add('active');

        // Load mockups for selected persona
        this.loadMockups(personaId);

        // Show mockups grid
        document.getElementById('mockupsGrid').style.display = 'grid';
    }

    loadMockups(personaId) {
        const mockupsGrid = document.getElementById('mockupsGrid');
        if (!mockupsGrid) return;

        const mockups = window.BranvaData.getMockupsByPersona(personaId);

        mockupsGrid.innerHTML = mockups.map(mockup => `
            <div class="mockup-item" data-mockup-id="${mockup.id}">
                <div class="mockup-preview"></div>
                <div class="mockup-name">${mockup.name}</div>
            </div>
        `).join('');

        // Bind click events to mockup items
        mockupsGrid.querySelectorAll('.mockup-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const mockupId = e.currentTarget.dataset.mockupId;
                this.openMockupModal(mockupId);
            });
        });
    }

    openMockupModal(mockupId) {
        const mockup = window.BranvaData.getMockupsByPersona(this.selectedPersona)
            .find(m => m.id === mockupId);
        if (!mockup) return;

        this.currentMockup = mockup;

        // Update modal content
        const mockupPreview = document.getElementById('mockupPreview');
        mockupPreview.innerHTML = `
            <div class="mockup-environment">
                <h4>${mockup.name}</h4>
                <p>${mockup.description}</p>
                <div class="placement-preview" style="width: 400px; height: 300px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px; position: relative; margin: 20px 0;">
                    <div class="placement-area" style="
                        position: absolute;
                        left: ${mockup.placementArea.x}%;
                        top: ${mockup.placementArea.y}%;
                        width: ${mockup.placementArea.width}%;
                        height: ${mockup.placementArea.height}%;
                        border: 2px dashed #8B5CF6;
                        background: rgba(139, 92, 246, 0.1);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        color: #8B5CF6;
                        ${mockup.placementArea.rotation ? `transform: rotate(${mockup.placementArea.rotation}deg);` : ''}
                    ">
                        Your creative here
                    </div>
                </div>
                <div class="mockup-tags">
                    ${mockup.tags.map(tag => `<span class="badge category">${tag}</span>`).join('')}
                </div>
            </div>
        `;

        // Reset upload state
        document.getElementById('addMockupBtn').disabled = true;

        // Show modal
        document.getElementById('mockupModal').classList.add('active');
    }

    closeMockupModal() {
        document.getElementById('mockupModal').classList.remove('active');
        this.currentMockup = null;
    }

    handleCreativeUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Create file URL for preview
        const fileURL = URL.createObjectURL(file);

        // Update placement area with uploaded creative
        const placementArea = document.querySelector('.placement-area');
        if (placementArea) {
            placementArea.innerHTML = `<img src="${fileURL}" style="width: 100%; height: 100%; object-fit: cover;">`;
        }

        // Enable add button
        document.getElementById('addMockupBtn').disabled = false;

        // Store file for later use
        this.uploadedCreative = {
            file: file,
            url: fileURL
        };
    }

    addMockupToSlide() {
        if (!this.currentMockup || !this.uploadedCreative) return;

        if (window.branvaCanvas) {
            window.branvaCanvas.addMockupElement(this.currentMockup, this.uploadedCreative);
            this.showToast('Mockup added to slide', 'success');
        }

        this.closeMockupModal();
    }

    // Text Panel Methods
    addTextElement(textType) {
        if (window.branvaCanvas) {
            window.branvaCanvas.addTextElement(textType);
            this.showToast('Text element added to slide', 'success');
        }
    }

    // Utility Methods
    showToast(message, type = 'info') {
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Initialize panels when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.branvaPanels = new BranvaPanels();
});