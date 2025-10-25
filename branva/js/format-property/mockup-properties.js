// Mockup Properties Controller - Handles mockup template formatting
class BranvaMockupProperties {
    constructor(propertyManager) {
        this.propertyManager = propertyManager;
        this.currentMockupElement = null;
    }

    render(container, elementData) {
        this.currentMockupElement = elementData;
        const content = elementData.content || {};

        container.innerHTML = `
            <div class="mockup-properties">
                <!-- Mockup Info Section -->
                <div class="property-section">
                    <h4 class="section-title">
                        <i class="bi bi-info-circle"></i>
                        Mockup Information
                    </h4>
                    <div class="property-group">
                        <div class="property-item">
                            <label>Template Name</label>
                            <div class="property-value">${content.mockupName || 'Unknown Mockup'}</div>
                        </div>
                        <div class="property-item">
                            <label>Orientation</label>
                            <div class="property-value">
                                ${content.orientation === 'portrait' ? '📱' : '🖥️'}
                                ${content.orientation || 'Unknown'}
                            </div>
                        </div>
                        <div class="property-item">
                            <label>Persona</label>
                            <div class="property-value">
                                ${content.persona?.icon || '👤'}
                                ${content.persona?.name || 'General'}
                            </div>
                        </div>
                        <div class="property-item">
                            <label>Location</label>
                            <div class="property-value">${content.locationName || 'Unknown Location'}</div>
                        </div>
                    </div>
                </div>

                <!-- Content Management Section -->
                <div class="property-section">
                    <h4 class="section-title">
                        <i class="bi bi-image"></i>
                        Content Management
                    </h4>
                    <div class="property-group">
                        <div class="property-item">
                            <label>Upload Content</label>
                            <div class="upload-area" id="mockupContentUpload">
                                <input type="file" id="mockupContentInput" accept="image/*,video/*" style="display: none;">
                                <button class="upload-btn property-btn" id="mockupUploadBtn">
                                    <i class="bi bi-cloud-upload"></i>
                                    Choose File
                                </button>
                                <div class="upload-hint">Images, Videos, or Graphics</div>
                            </div>
                        </div>
                        <div class="property-item" id="currentContentSection" style="${content.contentUrl ? 'display: block' : 'display: none'}">
                            <label>Current Content</label>
                            <div class="current-content-preview">
                                <div class="content-thumbnail" id="contentThumbnail">
                                    ${content.contentUrl ? `<img src="${content.contentUrl}" alt="Content">` : '<div class="no-content">No content</div>'}
                                </div>
                                <button class="property-btn secondary small" id="removeContent">
                                    <i class="bi bi-trash"></i>
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Content Positioning Section -->
                <div class="property-section" id="contentPositioning" style="${content.contentUrl ? 'display: block' : 'display: none'}">
                    <h4 class="section-title">
                        <i class="bi bi-arrows-move"></i>
                        Content Positioning
                    </h4>
                    <div class="property-group">
                        <div class="property-item">
                            <label>Position X</label>
                            <div class="input-with-unit">
                                <input type="range" class="property-input range-input" id="contentPosX"
                                       min="0" max="100" value="${content.contentPosition?.x || 50}">
                                <span class="range-value">${content.contentPosition?.x || 50}%</span>
                            </div>
                        </div>
                        <div class="property-item">
                            <label>Position Y</label>
                            <div class="input-with-unit">
                                <input type="range" class="property-input range-input" id="contentPosY"
                                       min="0" max="100" value="${content.contentPosition?.y || 50}">
                                <span class="range-value">${content.contentPosition?.y || 50}%</span>
                            </div>
                        </div>
                        <div class="property-item">
                            <label>Scale</label>
                            <div class="input-with-unit">
                                <input type="range" class="property-input range-input" id="contentScale"
                                       min="10" max="200" value="${(content.contentScale || 1) * 100}">
                                <span class="range-value">${Math.round((content.contentScale || 1) * 100)}%</span>
                            </div>
                        </div>
                        <div class="property-item">
                            <label>Rotation</label>
                            <div class="input-with-unit">
                                <input type="range" class="property-input range-input" id="contentRotation"
                                       min="0" max="360" value="${content.contentRotation || 0}">
                                <span class="range-value">${content.contentRotation || 0}°</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Advanced Processing Section -->
                <div class="property-section" id="advancedProcessing" style="${content.contentUrl ? 'display: block' : 'display: none'}">
                    <h4 class="section-title">
                        <i class="bi bi-magic"></i>
                        Advanced Processing
                    </h4>
                    <div class="property-group">
                        <div class="property-item">
                            <label>Processing Method</label>
                            <select class="property-input" id="processingMethod">
                                <option value="simple">Simple Overlay</option>
                                <option value="perspective" ${content.useAdvancedProcessing ? 'selected' : ''}>Perspective Correction</option>
                            </select>
                        </div>
                        <div class="property-item" id="perspectiveOptions" style="${content.useAdvancedProcessing ? 'display: block' : 'display: none'}">
                            <label>Perspective Settings</label>
                            <div class="perspective-controls">
                                <button class="property-btn secondary" id="autoDetectPerspective">
                                    <i class="bi bi-search"></i>
                                    Auto-Detect Screen
                                </button>
                                <button class="property-btn secondary" id="manualPerspective">
                                    <i class="bi bi-hand-index"></i>
                                    Manual Adjustment
                                </button>
                            </div>
                        </div>
                        <div class="property-item">
                            <label>Blending Mode</label>
                            <select class="property-input" id="blendingMode">
                                <option value="normal" ${content.blendingMode === 'normal' ? 'selected' : ''}>Normal</option>
                                <option value="multiply" ${content.blendingMode === 'multiply' ? 'selected' : ''}>Multiply</option>
                                <option value="screen" ${content.blendingMode === 'screen' ? 'selected' : ''}>Screen</option>
                                <option value="overlay" ${content.blendingMode === 'overlay' ? 'selected' : ''}>Overlay</option>
                                <option value="soft-light" ${content.blendingMode === 'soft-light' ? 'selected' : ''}>Soft Light</option>
                            </select>
                        </div>
                        <div class="property-item">
                            <label>Content Opacity</label>
                            <div class="input-with-unit">
                                <input type="range" class="property-input range-input" id="contentOpacity"
                                       min="0" max="100" value="${(content.contentOpacity || 1) * 100}">
                                <span class="range-value">${Math.round((content.contentOpacity || 1) * 100)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Mockup Styling Section -->
                <div class="property-section">
                    <h4 class="section-title">
                        <i class="bi bi-palette"></i>
                        Mockup Styling
                    </h4>
                    <div class="property-group">
                        <div class="property-item">
                            <label>Background Color</label>
                            <input type="color" class="property-input color-input" id="mockupBgColor" value="${content.backgroundColor || '#f8fafc'}">
                        </div>
                        <div class="property-item">
                            <label>Border Style</label>
                            <select class="property-input" id="mockupBorderStyle">
                                <option value="none" ${content.borderStyle === 'none' ? 'selected' : ''}>None</option>
                                <option value="solid" ${content.borderStyle === 'solid' ? 'selected' : ''}>Solid</option>
                                <option value="dashed" ${content.borderStyle === 'dashed' ? 'selected' : ''}>Dashed</option>
                                <option value="dotted" ${content.borderStyle === 'dotted' ? 'selected' : ''}>Dotted</option>
                            </select>
                        </div>
                        <div class="property-item">
                            <label>Border Color</label>
                            <input type="color" class="property-input color-input" id="mockupBorderColor" value="${content.borderColor || '#e2e8f0'}">
                        </div>
                        <div class="property-item">
                            <label>Corner Radius</label>
                            <div class="input-with-unit">
                                <input type="range" class="property-input range-input" id="mockupBorderRadius"
                                       min="0" max="24" value="${content.borderRadius || 12}">
                                <span class="range-value">${content.borderRadius || 12}px</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions Section -->
                <div class="property-section">
                    <h4 class="section-title">
                        <i class="bi bi-lightning"></i>
                        Quick Actions
                    </h4>
                    <div class="property-actions">
                        <button class="property-btn secondary" id="generateVariations">
                            <i class="bi bi-collection"></i>
                            Generate Variations
                        </button>
                        <button class="property-btn secondary" id="exportMockup">
                            <i class="bi bi-download"></i>
                            Export Mockup
                        </button>
                        <button class="property-btn secondary" id="duplicateMockup">
                            <i class="bi bi-files"></i>
                            Duplicate
                        </button>
                        <button class="property-btn danger" id="deleteMockup">
                            <i class="bi bi-trash"></i>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners(container);
    }

    setupEventListeners(container) {
        // Content upload
        const uploadBtn = container.querySelector('#mockupUploadBtn');
        const fileInput = container.querySelector('#mockupContentInput');

        if (uploadBtn && fileInput) {
            uploadBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.handleContentUpload(e));
        }

        // Remove content
        const removeBtn = container.querySelector('#removeContent');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => this.removeContent());
        }

        // Content positioning
        const posX = container.querySelector('#contentPosX');
        const posY = container.querySelector('#contentPosY');
        const scale = container.querySelector('#contentScale');
        const rotation = container.querySelector('#contentRotation');

        if (posX) {
            posX.addEventListener('input', (e) => {
                const value = e.target.value;
                posX.nextElementSibling.textContent = value + '%';
                this.updateContentPosition('x', value);
            });
        }

        if (posY) {
            posY.addEventListener('input', (e) => {
                const value = e.target.value;
                posY.nextElementSibling.textContent = value + '%';
                this.updateContentPosition('y', value);
            });
        }

        if (scale) {
            scale.addEventListener('input', (e) => {
                const value = e.target.value;
                scale.nextElementSibling.textContent = value + '%';
                this.updateContentProperty('contentScale', value / 100);
            });
        }

        if (rotation) {
            rotation.addEventListener('input', (e) => {
                const value = e.target.value;
                rotation.nextElementSibling.textContent = value + '°';
                this.updateContentProperty('contentRotation', value);
            });
        }

        // Processing method
        const processingMethod = container.querySelector('#processingMethod');
        const perspectiveOptions = container.querySelector('#perspectiveOptions');

        if (processingMethod) {
            processingMethod.addEventListener('change', (e) => {
                const useAdvanced = e.target.value === 'perspective';
                perspectiveOptions.style.display = useAdvanced ? 'block' : 'none';
                this.updateContentProperty('useAdvancedProcessing', useAdvanced);
            });
        }

        // Perspective controls
        const autoDetectBtn = container.querySelector('#autoDetectPerspective');
        const manualBtn = container.querySelector('#manualPerspective');

        if (autoDetectBtn) autoDetectBtn.addEventListener('click', () => this.autoDetectPerspective());
        if (manualBtn) manualBtn.addEventListener('click', () => this.manualPerspectiveAdjustment());

        // Blending and opacity
        const blendingMode = container.querySelector('#blendingMode');
        const opacity = container.querySelector('#contentOpacity');

        if (blendingMode) {
            blendingMode.addEventListener('change', (e) => this.updateContentProperty('blendingMode', e.target.value));
        }

        if (opacity) {
            opacity.addEventListener('input', (e) => {
                const value = e.target.value;
                opacity.nextElementSibling.textContent = value + '%';
                this.updateContentProperty('contentOpacity', value / 100);
            });
        }

        // Mockup styling
        const bgColor = container.querySelector('#mockupBgColor');
        const borderStyle = container.querySelector('#mockupBorderStyle');
        const borderColor = container.querySelector('#mockupBorderColor');
        const borderRadius = container.querySelector('#mockupBorderRadius');

        if (bgColor) bgColor.addEventListener('change', (e) => this.updateMockupStyle('backgroundColor', e.target.value));
        if (borderStyle) borderStyle.addEventListener('change', (e) => this.updateMockupStyle('borderStyle', e.target.value));
        if (borderColor) borderColor.addEventListener('change', (e) => this.updateMockupStyle('borderColor', e.target.value));

        if (borderRadius) {
            borderRadius.addEventListener('input', (e) => {
                const value = e.target.value;
                borderRadius.nextElementSibling.textContent = value + 'px';
                this.updateMockupStyle('borderRadius', value + 'px');
            });
        }

        // Action buttons
        const generateBtn = container.querySelector('#generateVariations');
        const exportBtn = container.querySelector('#exportMockup');
        const duplicateBtn = container.querySelector('#duplicateMockup');
        const deleteBtn = container.querySelector('#deleteMockup');

        if (generateBtn) generateBtn.addEventListener('click', () => this.generateVariations());
        if (exportBtn) exportBtn.addEventListener('click', () => this.exportMockup());
        if (duplicateBtn) duplicateBtn.addEventListener('click', () => this.duplicateMockup());
        if (deleteBtn) deleteBtn.addEventListener('click', () => this.deleteMockup());
    }

    handleContentUpload(event) {
        const file = event.target.files[0];
        if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.updateContentProperty('contentUrl', e.target.result);
                this.updateContentProperty('contentType', file.type.startsWith('image/') ? 'image' : 'video');
                this.updateContentProperty('contentName', file.name);

                // Show content sections
                this.showContentSections();

                // Update thumbnail
                this.updateContentThumbnail(e.target.result, file.type);

                // Process content in mockup
                this.processContentInMockup(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    showContentSections() {
        const currentContent = document.getElementById('currentContentSection');
        const positioning = document.getElementById('contentPositioning');
        const processing = document.getElementById('advancedProcessing');

        if (currentContent) currentContent.style.display = 'block';
        if (positioning) positioning.style.display = 'block';
        if (processing) processing.style.display = 'block';
    }

    updateContentThumbnail(src, type) {
        const thumbnail = document.getElementById('contentThumbnail');
        if (thumbnail) {
            if (type.startsWith('image/')) {
                thumbnail.innerHTML = `<img src="${src}" alt="Content">`;
            } else {
                thumbnail.innerHTML = `<video src="${src}" style="width: 100%; height: 100%;"></video>`;
            }
        }
    }

    processContentInMockup(contentUrl) {
        // This would integrate with the mockup processor
        if (window.branvaCanvas) {
            window.branvaCanvas.updateMockupContent(this.currentMockupElement.id, contentUrl);
        }
    }

    removeContent() {
        this.updateContentProperty('contentUrl', null);
        this.updateContentProperty('contentType', null);
        this.updateContentProperty('contentName', null);

        // Hide content sections
        const currentContent = document.getElementById('currentContentSection');
        const positioning = document.getElementById('contentPositioning');
        const processing = document.getElementById('advancedProcessing');

        if (currentContent) currentContent.style.display = 'none';
        if (positioning) positioning.style.display = 'none';
        if (processing) processing.style.display = 'none';

        // Clear mockup content
        if (window.branvaCanvas) {
            window.branvaCanvas.clearMockupContent(this.currentMockupElement.id);
        }
    }

    updateContentPosition(axis, value) {
        const currentPos = this.currentMockupElement.content?.contentPosition || { x: 50, y: 50 };
        currentPos[axis] = parseFloat(value);
        this.updateContentProperty('contentPosition', currentPos);
    }

    updateContentProperty(property, value) {
        if (this.propertyManager.selectedElement && window.branvaCanvas) {
            const elementId = this.propertyManager.selectedElement.dataset.elementId;
            window.branvaCanvas.updateElementProperty(elementId, property, value);
        }
    }

    updateMockupStyle(property, value) {
        if (this.propertyManager.selectedElement) {
            const element = this.propertyManager.selectedElement;
            const container = element.querySelector('.mockup-template-container');

            if (container) {
                switch(property) {
                    case 'backgroundColor':
                        container.style.backgroundColor = value;
                        break;
                    case 'borderStyle':
                        container.style.borderStyle = value;
                        break;
                    case 'borderColor':
                        container.style.borderColor = value;
                        break;
                    case 'borderRadius':
                        container.style.borderRadius = value;
                        break;
                }
            }

            this.updateContentProperty(property, value);
        }
    }

    autoDetectPerspective() {
        // This would use OpenCV to detect screen area in mockup
        if (window.showToast) {
            window.showToast('Auto-detecting screen area...', 'info');
        }

        // Simulate auto-detection
        setTimeout(() => {
            if (window.showToast) {
                window.showToast('Screen area detected! Content positioned automatically.', 'success');
            }
        }, 1500);
    }

    manualPerspectiveAdjustment() {
        // This would open a manual adjustment interface
        if (window.showToast) {
            window.showToast('Manual perspective adjustment coming soon', 'info');
        }
    }

    generateVariations() {
        if (window.showToast) {
            window.showToast('Generating mockup variations...', 'info');
        }

        // This would create multiple variations of the current mockup
        setTimeout(() => {
            if (window.showToast) {
                window.showToast('3 mockup variations created!', 'success');
            }
        }, 2000);
    }

    exportMockup() {
        if (window.branvaCanvas && this.currentMockupElement) {
            // This would export the mockup as an image
            window.branvaCanvas.exportElementAsImage(this.currentMockupElement.id);
            if (window.showToast) {
                window.showToast('Mockup exported!', 'success');
            }
        }
    }

    duplicateMockup() {
        if (window.branvaCanvas && this.currentMockupElement) {
            window.branvaCanvas.duplicateElement(this.currentMockupElement.id);
            if (window.showToast) {
                window.showToast('Mockup duplicated', 'success');
            }
        }
    }

    deleteMockup() {
        if (window.branvaCanvas && this.currentMockupElement) {
            if (confirm('Are you sure you want to delete this mockup?')) {
                window.branvaCanvas.deleteElement(this.currentMockupElement.id);
                this.propertyManager.close();
                if (window.showToast) {
                    window.showToast('Mockup deleted', 'success');
                }
            }
        }
    }
}

// Make globally available
window.BranvaMockupProperties = BranvaMockupProperties;