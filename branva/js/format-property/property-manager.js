// Property Manager - Main controller for right-side formatting panels
class BranvaPropertyManager {
    constructor() {
        this.currentPanel = null;
        this.selectedElement = null;
        this.propertyPanels = {};
        this.init();
    }

    init() {
        this.createPropertyPanelHTML();
        this.initializePropertyControllers();
        this.setupEventListeners();
        // console.log('🔧 Property Manager initialized');
    }

    createPropertyPanelHTML() {
        // Check if property panel already exists
        const existingPanel = document.getElementById('propertyPanel');
        if (existingPanel) {
            return; // Don't create duplicate
        }

        const propertyPanelHTML = `
            <div class="property-panel" id="propertyPanel">
                <div class="property-header">
                    <div class="property-title" id="propertyTitle">
                        <i class="bi bi-gear"></i>
                        <span>Properties</span>
                    </div>
                    <button class="property-close" id="closePropertyPanel">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
                <div class="property-content" id="propertyContent">
                    <div class="no-selection-state">
                        <div style="text-align: center; padding: 40px 20px; color: #94a3b8;">
                            <i class="bi bi-cursor" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
                            <p>Select an element to view its properties</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', propertyPanelHTML);
        this.propertyPanel = document.getElementById('propertyPanel');
    }

    initializePropertyControllers() {
        // Initialize property controllers when they're available
        setTimeout(() => {
            if (window.BranvaMatrixProperties) {
                this.propertyPanels['strategy-matrix'] = new window.BranvaMatrixProperties(this);
            }
            if (window.BranvaTextProperties) {
                this.propertyPanels['text'] = new window.BranvaTextProperties(this);
            }
            if (window.BranvaImageProperties) {
                this.propertyPanels['image'] = new window.BranvaImageProperties(this);
            }
            if (window.BranvaMockupProperties) {
                this.propertyPanels['mockup-template'] = new window.BranvaMockupProperties(this);
            }
            if (window.InsightProperties) {
                this.propertyPanels['insight-tool'] = new window.InsightProperties(this);
            }
        }, 100);
    }

    setupEventListeners() {
        // Close button
        const closeBtn = document.getElementById('closePropertyPanel');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Listen for canvas element selection
        document.addEventListener('branva-element-selected', (e) => {
            this.handleElementSelection(e.detail.element, e.detail.elementData);
        });

        // Listen for canvas deselection
        document.addEventListener('branva-element-deselected', () => {
            this.handleElementDeselection();
        });
    }

    handleElementSelection(element, elementData) {

        this.selectedElement = element;
        const elementType = elementData?.type || this.detectElementType(element);

        // console.log('🔧 Element selected for properties:', elementType, elementData);

        // Open property panel if closed
        if (!this.isOpen()) {
            this.open();
        }

        // Load appropriate property panel
        this.loadPropertyPanel(elementType, elementData);
    }

    handleElementDeselection() {
        this.selectedElement = null;
        this.showNoSelectionState();
    }

    detectElementType(element) {
        if (element.classList.contains('strategy-matrix')) return 'strategy-matrix';
        if (element.classList.contains('text-element')) return 'text';
        if (element.classList.contains('image-element')) return 'image';
        if (element.classList.contains('mockup-template')) return 'mockup-template';
        if (element.classList.contains('shape-element')) return 'shape';
        return 'unknown';
    }

    loadPropertyPanel(elementType, elementData) {
        const propertyController = this.propertyPanels[elementType];
        const propertyContent = document.getElementById('propertyContent');
        const propertyTitle = document.getElementById('propertyTitle');

        if (propertyController && propertyContent) {
            // Update title
            const titleInfo = this.getElementTypeInfo(elementType);
            propertyTitle.innerHTML = `
                <i class="${titleInfo.icon}"></i>
                <span>${titleInfo.name} Properties</span>
            `;

            // Load property panel content
            propertyController.render(propertyContent, elementData);
            this.currentPanel = propertyController;
        } else {
            // Fallback for unsupported element types
            this.showUnsupportedElementState(elementType);
        }
    }

    getElementTypeInfo(elementType) {
        const typeMap = {
            'strategy-matrix': { name: 'Matrix', icon: 'bi bi-grid-3x3' },
            'text': { name: 'Text', icon: 'bi bi-type' },
            'image': { name: 'Image', icon: 'bi bi-image' },
            'mockup-template': { name: 'Mockup', icon: 'bi bi-phone' },
            'shape': { name: 'Shape', icon: 'bi bi-shapes' }
        };
        return typeMap[elementType] || { name: 'Element', icon: 'bi bi-gear' };
    }

    showNoSelectionState() {
        const propertyContent = document.getElementById('propertyContent');
        const propertyTitle = document.getElementById('propertyTitle');

        if (propertyTitle) {
            propertyTitle.innerHTML = `
                <i class="bi bi-gear"></i>
                <span>Properties</span>
            `;
        }

        if (propertyContent) {
            propertyContent.innerHTML = `
                <div class="no-selection-state">
                    <div style="text-align: center; padding: 40px 20px; color: #94a3b8;">
                        <i class="bi bi-cursor" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
                        <p>Select an element to view its properties</p>
                    </div>
                </div>
            `;
        }

        this.currentPanel = null;
    }

    showUnsupportedElementState(elementType) {
        const propertyContent = document.getElementById('propertyContent');
        if (propertyContent) {
            propertyContent.innerHTML = `
                <div class="no-selection-state">
                    <div style="text-align: center; padding: 40px 20px; color: #94a3b8;">
                        <i class="bi bi-exclamation-triangle" style="font-size: 32px; margin-bottom: 12px; display: block;"></i>
                        <p>Properties for ${elementType} elements</p>
                        <p style="font-size: 12px;">Coming soon...</p>
                    </div>
                </div>
            `;
        }
    }

    open() {

        if (this.propertyPanel) {
            this.propertyPanel.classList.add('open');

            // Shift canvas area
            const canvasArea = document.getElementById('canvasArea');
            if (canvasArea) {
                canvasArea.classList.add('with-property-panel');
            }
        }
    }

    close() {
        if (this.propertyPanel) {
            this.propertyPanel.classList.remove('open');

            // Reset canvas area
            const canvasArea = document.getElementById('canvasArea');
            if (canvasArea) {
                canvasArea.classList.remove('with-property-panel');
            }
        }

        this.selectedElement = null;
        this.currentPanel = null;
    }

    isOpen() {
        return this.propertyPanel && this.propertyPanel.classList.contains('open');
    }

    // Helper method for property panels to update element
    updateElementProperty(elementId, property, value) {
        if (window.branvaCanvas) {
            window.branvaCanvas.updateElementProperty(elementId, property, value);
        }
    }

    // Helper method to get current element data
    getCurrentElementData() {
        if (this.selectedElement && window.branvaCanvas) {
            const elementId = this.selectedElement.dataset.elementId;
            return window.branvaCanvas.findElementById(elementId);
        }
        return null;
    }
}

// Initialize and make globally available
window.BranvaPropertyManager = BranvaPropertyManager;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.branvaPropertyManager = new BranvaPropertyManager();
    // console.log('🔧 Branva Property Manager initialized');
});