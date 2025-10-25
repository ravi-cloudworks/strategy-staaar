// Branva Visual Activations (Mockups) Drawer Controller
// Follows the same pattern as branva-solutions-drawer.js

class BranvaVisualActivationsDrawer {
    constructor() {
        this.drawer = null;
        this.isOpen = false;
        this.selectedPersonas = new Set();
        this.currentPersona = null;
        this.init();
    }

    init() {
        this.createDrawerHTML();
        this.setupEventListeners();
        this.ensureDrawerClosed();
        // Don't load personas until drawer is opened
    }

    createDrawerHTML() {
        const existingDrawer = document.getElementById('visualActivationsDrawer');
        if (existingDrawer) {
            existingDrawer.remove();
        }

        const drawerHTML = `
            <div class="visual-activations-drawer" id="visualActivationsDrawer">
                <div class="drawer-header">
                    <div class="drawer-title">
                        <i class="bi bi-phone"></i>
                        <span>Visual Activations</span>
                    </div>
                    <button class="drawer-close" id="closeVisualActivationsDrawer">
                        <i class="bi bi-x"></i>
                    </button>
                </div>

                <div class="drawer-content">
                    <!-- Search -->
                    <div class="search-section">
                        <input type="text" class="search-input" placeholder="Search personas..." id="personasSearchInput">
                    </div>

                    <!-- Personas Grid -->
                    <div class="personas-grid" id="personasDrawerGrid">
                        <!-- Personas will be loaded here -->
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', drawerHTML);
        this.drawer = document.getElementById('visualActivationsDrawer');
    }

    ensureDrawerClosed() {
        if (this.drawer) {
            this.drawer.classList.remove('open');
            this.isOpen = false;

            const canvasArea = document.getElementById('canvasArea');
            if (canvasArea) {
                canvasArea.classList.remove('with-visual-activations-drawer');
            }
        }
    }

    setupEventListeners() {
        // Close drawer button
        const closeBtn = document.getElementById('closeVisualActivationsDrawer');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Search input
        const searchInput = document.getElementById('personasSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchPersonas(e.target.value);
            });
        }
    }

    open() {
        // Show drawer
        this.drawer.classList.add('open');

        // Shift canvas area
        const canvasArea = document.getElementById('canvasArea');
        if (canvasArea) {
            canvasArea.classList.add('with-visual-activations-drawer');
        }

        this.isOpen = true;

        // Initialize OpenCV for advanced mockup processing
        if (window.initializeOpenCV) {
            window.initializeOpenCV().then(success => {
                if (success) {
                    console.log('✅ OpenCV initialized for Visual Activations');
                } else {
                    console.log('⚠️ OpenCV initialization failed, using fallback methods');
                }
            });
        }

        // Load personas when drawer is opened
        this.loadPersonas();

        if (window.showToast) {
            // window.showToast('Visual Activations drawer opened', 'success');
        }

        // console.log('📱 Visual Activations drawer opened');
    }

    close() {
        // Hide drawer
        this.drawer.classList.remove('open');

        // Reset canvas area
        const canvasArea = document.getElementById('canvasArea');
        if (canvasArea) {
            canvasArea.classList.remove('with-visual-activations-drawer');
        }

        this.isOpen = false;

        // console.log('📱 Visual Activations drawer closed');
    }

    loadPersonas() {
        const personasGrid = document.getElementById('personasDrawerGrid');
        if (!personasGrid) return;

        // Show loading state
        personasGrid.innerHTML = '<div style="text-align: center; padding: 20px; color: #94a3b8;">Loading personas...</div>';

        // Check if MOCKUP_CONFIG is available
        if (typeof MOCKUP_CONFIG === 'undefined') {
            personasGrid.innerHTML = '<div style="text-align: center; padding: 20px; color: #ef4444;">Mockup configuration not loaded</div>';
            return;
        }

        // Extract personas from MOCKUP_CONFIG
        const personas = Object.values(MOCKUP_CONFIG).map(audience => {
            const mockupCount = Object.values(audience.locations)
                .reduce((count, location) => count + location.mockups.length, 0);

            return {
                id: audience.id,
                name: audience.name,
                icon: audience.icon,
                description: audience.description,
                mockupCount: mockupCount,
                locationCount: Object.keys(audience.locations).length
            };
        });

        this.renderPersonas(personas);
    }

    renderPersonas(personas) {
        const personasGrid = document.getElementById('personasDrawerGrid');
        if (!personasGrid) return;

        if (personas.length === 0) {
            personasGrid.innerHTML = '<div style="text-align: center; padding: 20px; color: #94a3b8;">No personas found</div>';
            return;
        }

        personasGrid.innerHTML = '';
        personas.forEach(persona => {
            const card = this.createPersonaCard(persona);
            personasGrid.appendChild(card);
        });
    }

    createPersonaCard(persona) {
        const card = document.createElement('div');
        card.className = 'persona-card';
        card.dataset.personaId = persona.id;

        card.className = 'bg-white border border-strategy-200 rounded-lg p-4 hover:shadow-md hover:border-strategy-300 transition-all duration-200 cursor-pointer group persona-card';
        card.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg persona-icon bg-insight-100 text-insight-600">
                    ${persona.icon}
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="font-strategic text-base font-semibold text-strategy-800 persona-title">${persona.name}</h3>
                    <p class="font-sans text-xs text-strategy-500 mt-1 line-clamp-2 persona-description">${persona.description}</p>
                    <div class="persona-stats flex gap-3 mt-2">
                        <span class="font-premium text-xs font-medium text-premium-500 stat-item">${persona.locationCount} locations</span>
                        <span class="font-premium text-xs font-medium text-analysis-500 stat-item">${persona.mockupCount} templates</span>
                    </div>
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            this.selectPersona(persona);
        });

        return card;
    }

    selectPersona(persona) {
        this.currentPersona = persona;

        if (window.showToast) {
            window.showToast(`Opening templates for ${persona.name}`, 'success');
        }

        // Open modal with mockup templates for this persona
        this.openVisualActivationsModal(persona);

        console.log('📱 Persona selected:', persona.name);
    }

    openVisualActivationsModal(persona) {
        const modal = document.getElementById('visualActivationsModal');
        const modalTitle = document.getElementById('visualActivationsTitle');
        const modalPreview = document.getElementById('visualActivationsPreview');

        if (!modal || !modalTitle || !modalPreview) {
            console.error('Visual Activations modal elements not found');
            return;
        }

        // Set modal title and description
        modalTitle.innerHTML = `${persona.icon} ${persona.name} - Mockup Templates`;

        const modalDescription = document.getElementById('visualActivationsDescription');
        if (modalDescription) {
            modalDescription.textContent = persona.description || 'Select mockup templates to add to your presentation';
        }

        // Generate mockup templates grid
        modalPreview.innerHTML = this.generateMockupTemplatesGrid(persona);

        // Setup multi-selection
        this.setupMultiSelection(persona);

        // Show modal
        modal.classList.add('show');

        console.log(`📱 Opened mockup templates modal for ${persona.name}`);
    }

    generateMockupTemplatesGrid(persona) {
        const audience = MOCKUP_CONFIG[persona.id];
        if (!audience) {
            return '<div style="text-align: center; padding: 20px; color: #ef4444;">Persona not found</div>';
        }

        let html = '<div class="mockup-templates-grid">';

        Object.values(audience.locations).forEach(location => {
            html += `
                <div class="location-section">
                    <h4 class="location-title">📍 ${location.name}</h4>
                    <div class="location-mockups">
            `;

            location.mockups.forEach(mockup => {
                const mockupId = `${location.id}-${mockup.id}`;
                html += `
                    <div class="border border-strategy-200 rounded-lg p-4 hover:shadow-md hover:border-analysis-300 transition-all duration-200 cursor-pointer mockup-template-card relative group" data-mockup-id="${mockupId}" data-mockup='${JSON.stringify({...mockup, locationName: location.name, audienceName: persona.name, audienceIcon: persona.icon})}'>
                        <!-- Hidden checkbox for form data -->
                        <input type="checkbox" id="mockup-${mockupId}" class="hidden mockup-checkbox">

                        <!-- Hidden selection indicator - only shows when selected -->
                        <div class="absolute top-3 right-3 w-5 h-5 border-2 border-analysis-500 bg-analysis-500 rounded-full flex items-center justify-center selection-indicator transition-all duration-200 opacity-0 scale-0">
                            <i class="bi bi-check text-white text-sm"></i>
                        </div>

                        <div class="mockup-content pr-8">
                            <div class="mockup-preview-container mb-3">
                                <img src="${mockup.image.replace('mockup-images/', 'mockup-images/')}" alt="${mockup.name}" class="mockup-preview-image w-full h-32 object-cover rounded-lg"
                                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1vY2t1cCBQcmV2aWV3PC90ZXh0Pgo8L3N2Zz4='">
                                <div class="absolute top-2 left-2 px-2 py-1 bg-white/90 rounded text-xs font-medium text-strategy-600 orientation-badge">
                                    <i class="bi ${mockup.orientation === 'portrait' ? 'bi-phone' : 'bi-display'}"></i> ${mockup.orientation}
                                </div>
                            </div>
                            <div class="mockup-info">
                                <h4 class="font-strategic text-base font-semibold text-strategy-800 mb-1 mockup-name">${mockup.name}</h4>
                                <p class="font-sans text-sm text-strategy-600 mockup-description">${mockup.description}</p>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += '</div></div>';
        });

        html += '</div>';
        return html;
    }

    setupMultiSelection(persona) {
        this.selectedMockups = new Set();
        const selectionCount = document.getElementById('mockupSelectionCount');
        const addButton = document.getElementById('addSelectedMockupsBtn');
        const selectAllBtn = document.getElementById('selectAllMockupsBtn');
        const clearAllBtn = document.getElementById('clearAllMockupsBtn');

        // Update UI based on selection
        const updateSelectionUI = () => {
            const count = this.selectedMockups.size;
            selectionCount.textContent = `${count} selected`;
            addButton.textContent = count === 0 ? 'Select Templates' :
                                   count === 1 ? 'Add 1 Slide' :
                                   `Add ${count} Slides`;
            addButton.disabled = count === 0;
        };

        // Card click handlers for selection
        document.querySelectorAll('.mockup-template-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const checkbox = card.querySelector('.mockup-checkbox');
                const indicator = card.querySelector('.selection-indicator');
                const mockupId = card.dataset.mockupId;
                const mockupData = JSON.parse(card.dataset.mockup);

                // Toggle selection
                checkbox.checked = !checkbox.checked;

                if (checkbox.checked) {
                    // Add to selection
                    this.selectedMockups.add({
                        id: mockupId,
                        data: mockupData,
                        persona: persona
                    });
                    card.classList.add('selected', 'bg-analysis-50', 'border-analysis-500');
                    indicator.classList.remove('opacity-0', 'scale-0');
                    indicator.classList.add('opacity-100', 'scale-100');
                } else {
                    // Remove from selection
                    const toRemove = [...this.selectedMockups].find(m => m.id === mockupId);
                    if (toRemove) {
                        this.selectedMockups.delete(toRemove);
                    }
                    card.classList.remove('selected', 'bg-analysis-50', 'border-analysis-500');
                    indicator.classList.add('opacity-0', 'scale-0');
                    indicator.classList.remove('opacity-100', 'scale-100');
                }

                updateSelectionUI();
            });
        });

        // Select All button
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => {
                document.querySelectorAll('.mockup-template-card').forEach(card => {
                    const checkbox = card.querySelector('.mockup-checkbox');
                    if (!checkbox.checked) {
                        card.click();
                    }
                });
            });
        }

        // Clear All button
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                document.querySelectorAll('.mockup-template-card').forEach(card => {
                    const checkbox = card.querySelector('.mockup-checkbox');
                    if (checkbox.checked) {
                        card.click();
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
        const modal = document.getElementById('visualActivationsModal');
        const closeBtn = document.getElementById('closeVisualActivationsModal');
        const cancelBtn = document.getElementById('cancelVisualActivationsBtn');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeVisualActivationsModal();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.closeVisualActivationsModal();
            });
        }

        // Close on overlay click
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeVisualActivationsModal();
                }
            });
        }
    }

    closeVisualActivationsModal() {
        const modal = document.getElementById('visualActivationsModal');
        if (modal) {
            modal.classList.remove('show');
            // Reset selection
            this.selectedMockups = new Set();
        }
    }

    addSelectedSlidesToPresentation() {
        if (!this.selectedMockups || this.selectedMockups.size === 0) {
            if (window.showToast) {
                window.showToast('Please select at least one mockup template', 'warning');
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

    createSlidesWithCanvas() {
        console.log(`📱 Creating ${this.selectedMockups.size} new slides with mockup templates...`);

        const createdSlides = [];

        this.selectedMockups.forEach((mockupInfo) => {
            const { data: mockup, persona } = mockupInfo;

            // Create new slide
            window.branvaCanvas.addNewSlide();

            // Add mockup template element to the slide
            this.addMockupTemplateElement(mockup, persona);

            console.log(`✅ Created slide for ${mockup.name}`);
            createdSlides.push({
                mockup: mockup,
                persona: persona
            });
        });

        // Show success message
        if (window.showToast) {
            window.showToast(`Created ${this.selectedMockups.size} new slides with mockup templates!`, 'success');
        }

        // Close modal and drawer
        this.closeVisualActivationsModal();
        this.close();

        console.log(`✅ Visual Activations: Created ${createdSlides.length} slides`);
        return createdSlides;
    }

    addMockupTemplateElement(mockup, persona) {
        // Create a mockup template element similar to how other elements are added
        const element = {
            id: window.branvaCanvas.generateId(),
            type: 'mockup-template',
            position: { x: 10, y: 10, width: 80, height: 70, rotation: 0, zIndex: 1 },
            content: {
                mockupId: mockup.id,
                mockupName: mockup.name,
                mockupImage: mockup.image,
                orientation: mockup.orientation,
                locationName: mockup.locationName,
                persona: {
                    name: persona.name,
                    icon: persona.icon
                },
                description: mockup.description
            }
        };

        // Add element to current slide and render it
        window.branvaCanvas.addElementToSlide(element);
        window.branvaCanvas.renderElement(element);
    }

    searchPersonas(query) {
        if (typeof MOCKUP_CONFIG === 'undefined') return;

        if (!query.trim()) {
            this.loadPersonas();
            return;
        }

        // Filter personas by name, description, or locations
        const allPersonas = Object.values(MOCKUP_CONFIG).map(audience => {
            const mockupCount = Object.values(audience.locations)
                .reduce((count, location) => count + location.mockups.length, 0);

            return {
                id: audience.id,
                name: audience.name,
                icon: audience.icon,
                description: audience.description,
                mockupCount: mockupCount,
                locationCount: Object.keys(audience.locations).length,
                locations: Object.values(audience.locations).map(loc => loc.name)
            };
        });

        const filteredPersonas = allPersonas.filter(persona => {
            const searchText = `${persona.name} ${persona.description} ${persona.locations.join(' ')}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        });

        this.renderPersonas(filteredPersonas);
    }
}

// Initialize and make globally available
window.BranvaVisualActivationsDrawer = BranvaVisualActivationsDrawer;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.branvaVisualActivationsDrawer = new BranvaVisualActivationsDrawer();
    // console.log('📱 Branva Visual Activations Drawer initialized');
});