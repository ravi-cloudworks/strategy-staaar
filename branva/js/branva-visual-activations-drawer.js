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
            window.showToast('Visual Activations drawer opened', 'success');
        }

        console.log('📱 Visual Activations drawer opened');
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

        console.log('📱 Visual Activations drawer closed');
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

        card.innerHTML = `
            <div class="persona-icon">${persona.icon}</div>
            <h3 class="persona-title">${persona.name}</h3>
            <p class="persona-description">${persona.description}</p>
            <div class="persona-stats">
                <span class="stat-item">${persona.locationCount} locations</span>
                <span class="stat-item">${persona.mockupCount} templates</span>
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

        // Set modal title
        modalTitle.textContent = `${persona.icon} ${persona.name} - Mockup Templates`;

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
                    <div class="mockup-template-card selectable" data-mockup-id="${mockupId}" data-mockup='${JSON.stringify({...mockup, locationName: location.name, audienceName: persona.name, audienceIcon: persona.icon})}'>
                        <div class="selection-checkbox">
                            <input type="checkbox" id="mockup-${mockupId}" class="mockup-checkbox">
                            <label for="mockup-${mockupId}" class="checkbox-overlay"></label>
                        </div>
                        <div class="mockup-preview-container">
                            <img src="${mockup.image.replace('mockup-images/', 'mockup-images/')}" alt="${mockup.name}" class="mockup-preview-image"
                                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDIwMCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjEwMCIgeT0iNzUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZCNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk1vY2t1cCBQcmV2aWV3PC90ZXh0Pgo8L3N2Zz4='">
                            <div class="orientation-badge ${mockup.orientation}">
                                ${mockup.orientation === 'portrait' ? '📱' : '🖥️'} ${mockup.orientation}
                            </div>
                        </div>
                        <div class="mockup-info">
                            <div class="mockup-name">${mockup.name}</div>
                            <div class="mockup-description">${mockup.description}</div>
                        </div>
                        <div class="selection-overlay">
                            <i class="bi bi-check-circle-fill"></i>
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

        // Individual checkbox handlers
        document.querySelectorAll('.mockup-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const card = e.target.closest('.mockup-template-card');
                const mockupId = card.dataset.mockupId;
                const mockupData = JSON.parse(card.dataset.mockup);

                if (e.target.checked) {
                    this.selectedMockups.add({
                        id: mockupId,
                        data: mockupData,
                        persona: persona
                    });
                    card.classList.add('selected');
                } else {
                    // Remove from set
                    const toRemove = [...this.selectedMockups].find(m => m.id === mockupId);
                    if (toRemove) {
                        this.selectedMockups.delete(toRemove);
                    }
                    card.classList.remove('selected');
                }

                updateSelectionUI();
            });
        });

        // Select All button
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => {
                document.querySelectorAll('.mockup-checkbox').forEach(checkbox => {
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
                document.querySelectorAll('.mockup-checkbox').forEach(checkbox => {
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
    console.log('📱 Branva Visual Activations Drawer initialized');
});