// Universal Drawer System for Mockups, Text, Brand, and Tools

class UniversalDrawer {
    constructor(type, config) {
        this.type = type;
        this.config = config;
        this.drawer = null;
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createDrawerHTML();
        this.setupEventListeners();
        this.ensureDrawerClosed();
        if (this.config.loadContent) {
            this.loadContent();
        }
    }

    createDrawerHTML() {
        const existingDrawer = document.getElementById(`${this.type}Drawer`);
        if (existingDrawer) {
            existingDrawer.remove();
        }

        const drawerHTML = `
            <div class="${this.type}-drawer" id="${this.type}Drawer">
                <div class="drawer-header">
                    <div class="drawer-title">
                        <i class="bi ${this.config.icon}"></i>
                        <span>${this.config.title}</span>
                    </div>
                    <button class="drawer-close" id="close${this.type.charAt(0).toUpperCase() + this.type.slice(1)}Drawer">
                        <i class="bi bi-x"></i>
                    </button>
                </div>

                <div class="drawer-content">
                    ${this.config.content}
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', drawerHTML);
        this.drawer = document.getElementById(`${this.type}Drawer`);
    }

    ensureDrawerClosed() {
        if (this.drawer) {
            this.drawer.classList.remove('open');
            this.isOpen = false;

            const canvasArea = document.getElementById('canvasArea');
            if (canvasArea) {
                canvasArea.classList.remove(`with-${this.type}-drawer`);
            }
        }
    }

    setupEventListeners() {
        // Close drawer button
        const closeBtn = document.getElementById(`close${this.type.charAt(0).toUpperCase() + this.type.slice(1)}Drawer`);
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Setup custom event listeners
        if (this.config.setupEvents) {
            this.config.setupEvents.call(this);
        }
    }

    open() {
        // Show drawer
        this.drawer.classList.add('open');

        // Shift canvas area
        const canvasArea = document.getElementById('canvasArea');
        if (canvasArea) {
            canvasArea.classList.add(`with-${this.type}-drawer`);
        }

        this.isOpen = true;

        if (window.showToast) {
            window.showToast(`${this.config.title} drawer opened`, 'success');
        }

        console.log(`📋 ${this.config.title} drawer opened`);
    }

    close() {
        // Hide drawer
        this.drawer.classList.remove('open');

        // Reset canvas area
        const canvasArea = document.getElementById('canvasArea');
        if (canvasArea) {
            canvasArea.classList.remove(`with-${this.type}-drawer`);
        }

        this.isOpen = false;

        console.log(`📋 ${this.config.title} drawer closed`);
    }

    loadContent() {
        if (this.config.loadContent) {
            this.config.loadContent.call(this);
        }
    }
}

// Mockups Drawer Configuration
const mockupsConfig = {
    title: 'Visual Activations',
    icon: 'bi-phone',
    content: `
        <div class="personas-section">
            <h4>Choose Target Persona</h4>
            <div class="personas-grid">
                <div class="persona-card" data-persona="young-professional">
                    <div class="persona-avatar">👨‍💼</div>
                    <div class="persona-name">Young Professional</div>
                    <div class="persona-desc">Tech-savvy, ambitious</div>
                </div>
                <div class="persona-card" data-persona="family-parent">
                    <div class="persona-avatar">👩‍👧‍👦</div>
                    <div class="persona-name">Family Parent</div>
                    <div class="persona-desc">Practical, value-focused</div>
                </div>
                <div class="persona-card" data-persona="active-senior">
                    <div class="persona-avatar">👴</div>
                    <div class="persona-name">Active Senior</div>
                    <div class="persona-desc">Experienced, health-conscious</div>
                </div>
            </div>
        </div>

        <div class="mockups-section" id="mockupsSection" style="display: none;">
            <h4>Environment Mockups</h4>
            <div class="mockups-grid" id="mockupsGrid">
                <!-- Mockups will be loaded here -->
            </div>
        </div>
    `,
    setupEvents() {
        // Persona selection
        const personaCards = this.drawer.querySelectorAll('.persona-card');
        personaCards.forEach(card => {
            card.addEventListener('click', () => {
                // Update active persona
                personaCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                // Show mockups section
                const mockupsSection = document.getElementById('mockupsSection');
                if (mockupsSection) {
                    mockupsSection.style.display = 'block';
                }

                // Load mockups for persona
                this.loadMockupsForPersona(card.dataset.persona);
            });
        });
    },
    loadContent() {
        // Additional setup can be done here
    }
};

// Text Drawer Configuration
const textConfig = {
    title: 'Text Elements',
    icon: 'bi-type',
    content: `
        <div class="text-tools">
            <div class="text-tool" data-text-type="heading">
                <div class="text-preview heading">Heading</div>
                <div class="text-desc">Large heading text</div>
            </div>
            <div class="text-tool" data-text-type="subheading">
                <div class="text-preview subheading">Subheading</div>
                <div class="text-desc">Secondary heading</div>
            </div>
            <div class="text-tool" data-text-type="body">
                <div class="text-preview body">Body text</div>
                <div class="text-desc">Regular paragraph text</div>
            </div>
            <div class="text-tool" data-text-type="bullet">
                <div class="text-preview bullet">• Bullet point</div>
                <div class="text-desc">List item text</div>
            </div>
            <div class="text-tool" data-text-type="caption">
                <div class="text-preview caption">Caption</div>
                <div class="text-desc">Small descriptive text</div>
            </div>
            <div class="text-tool" data-text-type="quote">
                <div class="text-preview quote">"Quote"</div>
                <div class="text-desc">Highlighted quotation</div>
            </div>
        </div>
    `,
    setupEvents() {
        const textTools = this.drawer.querySelectorAll('.text-tool');
        textTools.forEach(tool => {
            tool.addEventListener('click', () => {
                const textType = tool.dataset.textType;
                this.addTextElement(textType);
            });
        });
    }
};

// Brand Drawer Configuration
const brandConfig = {
    title: 'Brand Kit',
    icon: 'bi-palette',
    content: `
        <div class="brand-colors">
            <h4>Brand Colors</h4>
            <div class="color-palette">
                <div class="color-swatch" style="background: #8B5CF6;" data-color="#8B5CF6"></div>
                <div class="color-swatch" style="background: #3B82F6;" data-color="#3B82F6"></div>
                <div class="color-swatch" style="background: #10B981;" data-color="#10B981"></div>
                <div class="color-swatch" style="background: #F59E0B;" data-color="#F59E0B"></div>
                <div class="color-swatch" style="background: #EF4444;" data-color="#EF4444"></div>
                <div class="color-swatch" style="background: #6B7280;" data-color="#6B7280"></div>
            </div>
        </div>

        <div class="brand-assets">
            <h4>Brand Assets</h4>
            <div class="upload-section">
                <input type="file" id="logoUpload" accept="image/*" style="display: none;">
                <button class="upload-btn" id="uploadLogoBtn">
                    <i class="bi bi-upload"></i>
                    Upload Logo
                </button>
            </div>

            <div class="logo-variations" id="logoVariations">
                <!-- Uploaded logos will appear here -->
            </div>
        </div>

        <div class="typography">
            <h4>Typography</h4>
            <div class="font-options">
                <div class="font-option" data-font="Inter">
                    <div class="font-preview" style="font-family: Inter, sans-serif;">Inter</div>
                    <div class="font-desc">Modern sans-serif</div>
                </div>
                <div class="font-option" data-font="Georgia">
                    <div class="font-preview" style="font-family: Georgia, serif;">Georgia</div>
                    <div class="font-desc">Classic serif</div>
                </div>
            </div>
        </div>
    `,
    setupEvents() {
        // Color swatches
        const colorSwatches = this.drawer.querySelectorAll('.color-swatch');
        colorSwatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                const color = swatch.dataset.color;
                this.applyBrandColor(color);
            });
        });

        // Logo upload
        const uploadBtn = document.getElementById('uploadLogoBtn');
        const logoUpload = document.getElementById('logoUpload');

        if (uploadBtn && logoUpload) {
            uploadBtn.addEventListener('click', () => logoUpload.click());
            logoUpload.addEventListener('change', (e) => this.handleLogoUpload(e));
        }

        // Font options
        const fontOptions = this.drawer.querySelectorAll('.font-option');
        fontOptions.forEach(option => {
            option.addEventListener('click', () => {
                const font = option.dataset.font;
                this.applyBrandFont(font);
            });
        });
    }
};

// Tools Drawer Configuration
const toolsConfig = {
    title: 'Tools',
    icon: 'bi-tools',
    content: `
        <div class="shape-tools">
            <h4>Basic Shapes</h4>
            <div class="tools-grid">
                <div class="tool-btn" data-tool="rectangle">
                    <i class="bi bi-square"></i>
                    <span>Rectangle</span>
                </div>
                <div class="tool-btn" data-tool="circle">
                    <i class="bi bi-circle"></i>
                    <span>Circle</span>
                </div>
                <div class="tool-btn" data-tool="triangle">
                    <i class="bi bi-triangle"></i>
                    <span>Triangle</span>
                </div>
                <div class="tool-btn" data-tool="line">
                    <i class="bi bi-slash"></i>
                    <span>Line</span>
                </div>
            </div>
        </div>

        <div class="drawing-tools">
            <h4>Drawing Tools</h4>
            <div class="tools-grid">
                <div class="tool-btn" data-tool="pen">
                    <i class="bi bi-pen"></i>
                    <span>Pen</span>
                </div>
                <div class="tool-btn" data-tool="highlighter">
                    <i class="bi bi-highlighter"></i>
                    <span>Highlighter</span>
                </div>
                <div class="tool-btn" data-tool="eraser">
                    <i class="bi bi-eraser"></i>
                    <span>Eraser</span>
                </div>
                <div class="tool-btn" data-tool="arrow">
                    <i class="bi bi-arrow-up-right"></i>
                    <span>Arrow</span>
                </div>
            </div>
        </div>

        <div class="utility-tools">
            <h4>Utilities</h4>
            <div class="tools-grid">
                <div class="tool-btn" data-tool="grid">
                    <i class="bi bi-grid"></i>
                    <span>Grid</span>
                </div>
                <div class="tool-btn" data-tool="ruler">
                    <i class="bi bi-rulers"></i>
                    <span>Ruler</span>
                </div>
                <div class="tool-btn" data-tool="eyedropper">
                    <i class="bi bi-eyedropper"></i>
                    <span>Color Picker</span>
                </div>
                <div class="tool-btn" data-tool="zoom">
                    <i class="bi bi-zoom-in"></i>
                    <span>Zoom</span>
                </div>
            </div>
        </div>
    `,
    setupEvents() {
        const toolBtns = this.drawer.querySelectorAll('.tool-btn');
        toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tool = btn.dataset.tool;
                this.selectTool(tool);
            });
        });
    }
};

// Initialize all drawers
document.addEventListener('DOMContentLoaded', () => {
    window.branvaMockupsDrawer = new UniversalDrawer('mockups', mockupsConfig);
    window.branvaTextDrawer = new UniversalDrawer('text', textConfig);
    window.branvaBrandDrawer = new UniversalDrawer('brand', brandConfig);
    window.branvaToolsDrawer = new UniversalDrawer('tools', toolsConfig);

    console.log('📋 Universal drawers initialized');
});