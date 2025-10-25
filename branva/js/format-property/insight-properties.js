class InsightProperties {
    constructor(propertyManager) {
        this.propertyManager = propertyManager;
        this.currentElement = null;
        this.currentElementData = null;
    }

    render(container, elementData) {
        // Find the actual insight tool element
        this.currentElement = document.querySelector(`[data-element-id="${elementData.id}"]`);
        this.currentElementData = elementData;

        const content = elementData.content || {};

        container.innerHTML = `
            <div class="property-section">
                <h3 class="property-title">Insight Tool Properties</h3>

                <div class="property-group">
                    <label class="property-label">Tool Type</label>
                    <div class="property-value">
                        <select id="insightType" class="property-input">
                            <option value="rituals-symbolism-ladder" ${content.insightType === 'rituals-symbolism-ladder' ? 'selected' : ''}>Elements of Value Pyramid</option>
                            <option value="customer-journey-mapping" ${content.insightType === 'customer-journey-mapping' ? 'selected' : ''}>Customer Journey Mapping</option>
                            <option value="value-proposition-canvas" ${content.insightType === 'value-proposition-canvas' ? 'selected' : ''}>Value Proposition Canvas</option>
                            <option value="empathy-mapping" ${content.insightType === 'empathy-mapping' ? 'selected' : ''}>Empathy Mapping</option>
                            <option value="personas-development" ${content.insightType === 'personas-development' ? 'selected' : ''}>Personas Development</option>
                            <option value="market-segmentation" ${content.insightType === 'market-segmentation' ? 'selected' : ''}>Market Segmentation</option>
                            <option value="competitor-analysis" ${content.insightType === 'competitor-analysis' ? 'selected' : ''}>Competitor Analysis</option>
                            <option value="swot-analysis" ${content.insightType === 'swot-analysis' ? 'selected' : ''}>SWOT Analysis</option>
                            <option value="trend-analysis" ${content.insightType === 'trend-analysis' ? 'selected' : ''}>Trend Analysis</option>
                            <option value="behavioral-triggers" ${content.insightType === 'behavioral-triggers' ? 'selected' : ''}>Behavioral Triggers</option>
                            <option value="psychological-drivers" ${content.insightType === 'psychological-drivers' ? 'selected' : ''}>Psychological Drivers</option>
                            <option value="decision-making-factors" ${content.insightType === 'decision-making-factors' ? 'selected' : ''}>Decision Making Factors</option>
                            <option value="emotional-mapping" ${content.insightType === 'emotional-mapping' ? 'selected' : ''}>Emotional Mapping</option>
                            <option value="cultural-insights" ${content.insightType === 'cultural-insights' ? 'selected' : ''}>Cultural Insights</option>
                            <option value="demographic-analysis" ${content.insightType === 'demographic-analysis' ? 'selected' : ''}>Demographic Analysis</option>
                            <option value="psychographic-profiling" ${content.insightType === 'psychographic-profiling' ? 'selected' : ''}>Psychographic Profiling</option>
                            <option value="usage-patterns" ${content.insightType === 'usage-patterns' ? 'selected' : ''}>Usage Patterns</option>
                            <option value="needs-assessment" ${content.insightType === 'needs-assessment' ? 'selected' : ''}>Needs Assessment</option>
                        </select>
                    </div>
                </div>

                <div class="property-group">
                    <label class="property-label">Title</label>
                    <div class="property-value">
                        <input type="text" id="insightTitle" class="property-input"
                               value="${content.title || ''}"
                               placeholder="Enter insight tool title">
                    </div>
                </div>

                <div class="property-group">
                    <label class="property-label">Description</label>
                    <div class="property-value">
                        <textarea id="insightDescription" class="property-input"
                                  placeholder="Enter description">${content.description || ''}</textarea>
                    </div>
                </div>

                <div class="property-group">
                    <label class="property-label">Expected Outcome</label>
                    <div class="property-value">
                        <textarea id="insightOutcome" class="property-input"
                                  placeholder="Enter expected outcome">${content.outcome || ''}</textarea>
                    </div>
                </div>

                <div class="property-section">
                    <h4 class="property-subtitle">Position & Size</h4>

                    <div class="property-grid">
                        <div class="property-group">
                            <label class="property-label">X Position (%)</label>
                            <input type="number" id="insightX" class="property-input"
                                   value="${elementData.position?.x || 0}"
                                   min="0" max="100" step="0.1">
                        </div>

                        <div class="property-group">
                            <label class="property-label">Y Position (%)</label>
                            <input type="number" id="insightY" class="property-input"
                                   value="${elementData.position?.y || 0}"
                                   min="0" max="100" step="0.1">
                        </div>
                    </div>

                    <div class="property-grid">
                        <div class="property-group">
                            <label class="property-label">Width (%)</label>
                            <input type="number" id="insightWidth" class="property-input"
                                   value="${elementData.size?.width || 50}"
                                   min="10" max="100" step="1">
                        </div>

                        <div class="property-group">
                            <label class="property-label">Height (%)</label>
                            <input type="number" id="insightHeight" class="property-input"
                                   value="${elementData.size?.height || 50}"
                                   min="10" max="100" step="1">
                        </div>
                    </div>
                </div>

                <div class="property-section">
                    <h4 class="property-subtitle">Tool Configuration</h4>

                    <div class="property-group">
                        <label class="property-label">Show Title</label>
                        <div class="property-value">
                            <input type="checkbox" id="showTitle" class="property-checkbox" checked>
                            <label for="showTitle" class="checkbox-label">Display tool title</label>
                        </div>
                    </div>

                    <div class="property-group">
                        <label class="property-label">Show Description</label>
                        <div class="property-value">
                            <input type="checkbox" id="showDescription" class="property-checkbox" checked>
                            <label for="showDescription" class="checkbox-label">Display tool description</label>
                        </div>
                    </div>

                    <div class="property-group">
                        <label class="property-label">Background Color</label>
                        <div class="property-value">
                            <input type="color" id="insightBgColor" class="property-input"
                                   value="#ffffff">
                        </div>
                    </div>

                    <div class="property-group">
                        <label class="property-label">Border Color</label>
                        <div class="property-value">
                            <input type="color" id="insightBorderColor" class="property-input"
                                   value="#e2e8f0">
                        </div>
                    </div>

                    <div class="property-group">
                        <label class="property-label">Circle Size</label>
                        <div class="property-value">
                            <select id="insightCircleSize" class="property-input">
                                <option value="small">Small (40px)</option>
                                <option value="medium" selected>Medium (50px)</option>
                                <option value="large">Large (60px)</option>
                            </select>
                        </div>
                    </div>

                    <div class="property-group">
                        <label class="property-label">Show Layer Titles</label>
                        <div class="property-value">
                            <input type="checkbox" id="showLayerTitles" class="property-checkbox" checked>
                            <label for="showLayerTitles" class="checkbox-label">Display section titles</label>
                        </div>
                    </div>

                    <div class="property-group">
                        <label class="property-label">Auto Arrange</label>
                        <div class="property-value">
                            <input type="checkbox" id="autoArrangeCircles" class="property-checkbox" checked>
                            <label for="autoArrangeCircles" class="checkbox-label">Auto arrange circles</label>
                        </div>
                    </div>
                </div>

                <div class="property-section">
                    <h4 class="property-subtitle">Progress Tracking</h4>

                    <div class="property-group">
                        <label class="property-label">Completion Status</label>
                        <div class="property-value">
                            <div id="completionStatus" class="status-display">
                                <span class="status-count">0 / 30</span>
                                <span class="status-text">elements completed</span>
                            </div>
                        </div>
                    </div>

                    <div class="property-group">
                        <label class="property-label">Progress by Layer</label>
                        <div class="property-value">
                            <div id="layerProgress" class="layer-progress">
                                <!-- Progress bars will be populated here -->
                            </div>
                        </div>
                    </div>
                </div>

                <div class="property-section">
                    <h4 class="property-subtitle">Actions</h4>

                    <div class="property-actions">
                        <button id="reloadInsightTool" class="property-button primary">
                            🔄 Reload Tool
                        </button>

                        <button id="exportInsightData" class="property-button">
                            📤 Export Data
                        </button>

                        <button id="importInsightData" class="property-button">
                            📥 Import Data
                        </button>

                        <button id="resetInsightTool" class="property-button danger">
                            🗑️ Reset Tool
                        </button>

                        <button id="duplicateInsightTool" class="property-button">
                            📋 Duplicate Tool
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Bind events after rendering
        setTimeout(() => this.bindEvents(), 100);
    }

    bindEvents() {
        // Title visibility
        const showTitleCheckbox = document.getElementById('showTitle');
        if (showTitleCheckbox) {
            showTitleCheckbox.addEventListener('change', (e) => {
                this.toggleTitleVisibility(e.target.checked);
            });
        }

        // Description visibility
        const showDescriptionCheckbox = document.getElementById('showDescription');
        if (showDescriptionCheckbox) {
            showDescriptionCheckbox.addEventListener('change', (e) => {
                this.toggleDescriptionVisibility(e.target.checked);
            });
        }

        // Tool type change
        const insightTypeSelect = document.getElementById('insightType');
        if (insightTypeSelect) {
            insightTypeSelect.addEventListener('change', (e) => {
                this.updateProperty('insightType', e.target.value);
                this.updateProperty('templateName', e.target.value);
                this.reloadInsightTool();
            });
        }

        // Title change
        const titleInput = document.getElementById('insightTitle');
        if (titleInput) {
            titleInput.addEventListener('input', (e) => {
                this.updateProperty('title', e.target.value);
                this.updateProperty('insightName', e.target.value);
            });
        }

        // Description change
        const descriptionTextarea = document.getElementById('insightDescription');
        if (descriptionTextarea) {
            descriptionTextarea.addEventListener('input', (e) => {
                this.updateProperty('description', e.target.value);
            });
        }

        // Outcome change
        const outcomeTextarea = document.getElementById('insightOutcome');
        if (outcomeTextarea) {
            outcomeTextarea.addEventListener('input', (e) => {
                this.updateProperty('outcome', e.target.value);
            });
        }

        // Position and size changes
        ['insightX', 'insightY'].forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', (e) => {
                    const property = inputId === 'insightX' ? 'x' : 'y';
                    this.updatePositionProperty(property, parseFloat(e.target.value));
                });
            }
        });

        ['insightWidth', 'insightHeight'].forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', (e) => {
                    const property = inputId === 'insightWidth' ? 'width' : 'height';
                    this.updateSizeProperty(property, parseFloat(e.target.value));
                });
            }
        });

        // Action buttons
        const reloadButton = document.getElementById('reloadInsightTool');
        if (reloadButton) {
            reloadButton.addEventListener('click', () => this.reloadInsightTool());
        }

        const exportButton = document.getElementById('exportInsightData');
        if (exportButton) {
            exportButton.addEventListener('click', () => this.exportInsightData());
        }

        const resetButton = document.getElementById('resetInsightTool');
        if (resetButton) {
            resetButton.addEventListener('click', () => this.resetInsightTool());
        }
    }

    updateProperty(property, value) {
        if (window.branvaCanvas && this.currentElementData) {
            window.branvaCanvas.updateElementProperty(this.currentElementData.id, `content.${property}`, value);
        }
    }

    updatePositionProperty(property, value) {
        if (window.branvaCanvas && this.currentElementData) {
            window.branvaCanvas.updateElementProperty(this.currentElementData.id, `position.${property}`, value);

            // Update element position in DOM
            if (this.currentElement) {
                this.currentElement.style[property === 'x' ? 'left' : 'top'] = value + '%';
            }
        }
    }

    updateSizeProperty(property, value) {
        if (window.branvaCanvas && this.currentElementData) {
            window.branvaCanvas.updateElementProperty(this.currentElementData.id, `size.${property}`, value);

            // Update element size in DOM
            if (this.currentElement) {
                this.currentElement.style[property] = value + '%';
            }
        }
    }

    reloadInsightTool() {
        if (window.branvaCanvas && this.currentElementData) {
            // Clear current content
            this.currentElement.innerHTML = '';

            // Re-render the insight tool
            window.branvaCanvas.renderInsightTool(this.currentElementData);

            // console.log('🔄 Insight tool reloaded');
        }
    }

    exportInsightData() {
        if (!this.currentElementData) return;

        const container = this.currentElement.querySelector('.insight-tool-container');
        if (!container) return;

        // Collect all uploaded images and their data
        const insightData = {
            toolType: this.currentElementData.content.insightType,
            title: this.currentElementData.content.title,
            description: this.currentElementData.content.description,
            outcome: this.currentElementData.content.outcome,
            elements: [],
            exportedAt: new Date().toISOString()
        };

        // Extract data from active circles
        const activeContainers = container.querySelectorAll('.insight-circle-container.active');
        activeContainers.forEach(container => {
            const name = container.dataset.name;
            const img = container.querySelector('.uploaded-image');
            if (img && img.src) {
                insightData.elements.push({
                    name: name,
                    imageData: img.src
                });
            }
        });

        // Create and download JSON file
        const dataStr = JSON.stringify(insightData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `insight-tool-${this.currentElementData.content.insightType}-${Date.now()}.json`;
        link.click();

        URL.revokeObjectURL(url);

        // console.log('📤 Insight data exported');
    }

    resetInsightTool() {
        if (!confirm('Are you sure you want to reset this insight tool? All uploaded content will be lost.')) {
            return;
        }

        const container = this.currentElement.querySelector('.insight-tool-container');
        if (!container) return;

        // Reset all circles
        const circles = container.querySelectorAll('.insight-circle');
        const containers = container.querySelectorAll('.insight-circle-container');
        const images = container.querySelectorAll('.uploaded-image');
        const inputs = container.querySelectorAll('input[type="file"]');

        circles.forEach(circle => circle.classList.remove('active'));
        containers.forEach(container => container.classList.remove('active'));
        images.forEach(img => img.src = '');
        inputs.forEach(input => input.value = '');

        // console.log('🗑️ Insight tool reset');
    }


    toggleTitleVisibility(show) {
        const header = this.currentElement.querySelector('.insight-header');
        if (header) {
            if (show) {
                header.classList.remove('title-hidden');
            } else {
                header.classList.add('title-hidden');
            }
        }
    }

    toggleDescriptionVisibility(show) {
        const header = this.currentElement.querySelector('.insight-header');
        if (header) {
            if (show) {
                header.classList.remove('description-hidden');
            } else {
                header.classList.add('description-hidden');
            }
        }
    }

    cleanup() {
        this.currentElement = null;
        this.currentElementData = null;
    }
}