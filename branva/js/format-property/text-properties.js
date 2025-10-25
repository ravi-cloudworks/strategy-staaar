// Text Properties Controller - Handles text element formatting
class BranvaTextProperties {
    constructor(propertyManager) {
        this.propertyManager = propertyManager;
        this.currentTextElement = null;
    }

    render(container, elementData) {
        this.currentTextElement = elementData;
        const content = elementData.content || {};

        container.innerHTML = `
            <div class="text-properties">
                <!-- Typography Section -->
                <div class="property-section">
                    <h4 class="section-title">
                        <i class="bi bi-type"></i>
                        Typography
                    </h4>
                    <div class="property-group">
                        <div class="property-item">
                            <label>Font Family</label>
                            <select class="property-input" id="textFontFamily">
                                <option value="Arial, sans-serif" ${content.fontFamily === 'Arial, sans-serif' ? 'selected' : ''}>Arial</option>
                                <option value="Georgia, serif" ${content.fontFamily === 'Georgia, serif' ? 'selected' : ''}>Georgia</option>
                                <option value="'Times New Roman', serif" ${content.fontFamily === "'Times New Roman', serif" ? 'selected' : ''}>Times New Roman</option>
                                <option value="'Courier New', monospace" ${content.fontFamily === "'Courier New', monospace" ? 'selected' : ''}>Courier New</option>
                                <option value="Helvetica, sans-serif" ${content.fontFamily === 'Helvetica, sans-serif' ? 'selected' : ''}>Helvetica</option>
                                <option value="'Trebuchet MS', sans-serif" ${content.fontFamily === "'Trebuchet MS', sans-serif" ? 'selected' : ''}>Trebuchet MS</option>
                            </select>
                        </div>
                        <div class="property-item">
                            <label>Font Size</label>
                            <div class="input-with-unit">
                                <input type="range" class="property-input range-input" id="textFontSize"
                                       min="8" max="72" value="${content.fontSize || 16}">
                                <span class="range-value">${content.fontSize || 16}px</span>
                            </div>
                        </div>
                        <div class="property-item">
                            <label>Font Weight</label>
                            <select class="property-input" id="textFontWeight">
                                <option value="300" ${content.fontWeight === '300' ? 'selected' : ''}>Light</option>
                                <option value="normal" ${content.fontWeight === 'normal' ? 'selected' : ''}>Normal</option>
                                <option value="600" ${content.fontWeight === '600' ? 'selected' : ''}>Semi Bold</option>
                                <option value="bold" ${content.fontWeight === 'bold' ? 'selected' : ''}>Bold</option>
                                <option value="900" ${content.fontWeight === '900' ? 'selected' : ''}>Black</option>
                            </select>
                        </div>
                        <div class="property-item">
                            <label>Text Color</label>
                            <input type="color" class="property-input color-input" id="textColor" value="${content.color || '#1e293b'}">
                        </div>
                    </div>
                </div>

                <!-- Layout Section -->
                <div class="property-section">
                    <h4 class="section-title">
                        <i class="bi bi-align-start"></i>
                        Layout
                    </h4>
                    <div class="property-group">
                        <div class="property-item">
                            <label>Text Alignment</label>
                            <div class="alignment-buttons">
                                <button class="alignment-btn ${content.alignment === 'left' ? 'active' : ''}" data-align="left">
                                    <i class="bi bi-text-left"></i>
                                </button>
                                <button class="alignment-btn ${content.alignment === 'center' ? 'active' : ''}" data-align="center">
                                    <i class="bi bi-text-center"></i>
                                </button>
                                <button class="alignment-btn ${content.alignment === 'right' ? 'active' : ''}" data-align="right">
                                    <i class="bi bi-text-right"></i>
                                </button>
                                <button class="alignment-btn ${content.alignment === 'justify' ? 'active' : ''}" data-align="justify">
                                    <i class="bi bi-justify"></i>
                                </button>
                            </div>
                        </div>
                        <div class="property-item">
                            <label>Line Height</label>
                            <div class="input-with-unit">
                                <input type="range" class="property-input range-input" id="textLineHeight"
                                       min="0.8" max="3.0" step="0.1" value="${content.lineHeight || 1.3}">
                                <span class="range-value">${content.lineHeight || 1.3}</span>
                            </div>
                        </div>
                        <div class="property-item">
                            <label>Letter Spacing</label>
                            <div class="input-with-unit">
                                <input type="range" class="property-input range-input" id="textLetterSpacing"
                                       min="-2" max="10" step="0.1" value="${content.letterSpacing || 0}">
                                <span class="range-value">${content.letterSpacing || 0}px</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Effects Section -->
                <div class="property-section">
                    <h4 class="section-title">
                        <i class="bi bi-magic"></i>
                        Effects
                    </h4>
                    <div class="property-group">
                        <div class="property-item">
                            <label>Text Shadow</label>
                            <div class="shadow-controls">
                                <div class="shadow-toggle">
                                    <input type="checkbox" id="textShadowEnabled" ${content.textShadow ? 'checked' : ''}>
                                    <label for="textShadowEnabled">Enable Shadow</label>
                                </div>
                                <div class="shadow-settings" id="shadowSettings" style="display: ${content.textShadow ? 'block' : 'none'}">
                                    <div class="shadow-control">
                                        <label>X Offset</label>
                                        <input type="range" id="shadowX" min="-10" max="10" value="2" class="property-input range-input">
                                        <span class="range-value">2px</span>
                                    </div>
                                    <div class="shadow-control">
                                        <label>Y Offset</label>
                                        <input type="range" id="shadowY" min="-10" max="10" value="2" class="property-input range-input">
                                        <span class="range-value">2px</span>
                                    </div>
                                    <div class="shadow-control">
                                        <label>Blur</label>
                                        <input type="range" id="shadowBlur" min="0" max="20" value="4" class="property-input range-input">
                                        <span class="range-value">4px</span>
                                    </div>
                                    <div class="shadow-control">
                                        <label>Shadow Color</label>
                                        <input type="color" id="shadowColor" value="#00000066" class="property-input color-input">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="property-item">
                            <label>Text Transform</label>
                            <select class="property-input" id="textTransform">
                                <option value="none" ${content.textTransform === 'none' ? 'selected' : ''}>None</option>
                                <option value="uppercase" ${content.textTransform === 'uppercase' ? 'selected' : ''}>UPPERCASE</option>
                                <option value="lowercase" ${content.textTransform === 'lowercase' ? 'selected' : ''}>lowercase</option>
                                <option value="capitalize" ${content.textTransform === 'capitalize' ? 'selected' : ''}>Capitalize</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Content Section -->
                <div class="property-section">
                    <h4 class="section-title">
                        <i class="bi bi-pencil"></i>
                        Content
                    </h4>
                    <div class="property-group">
                        <div class="property-item">
                            <label>Text Content</label>
                            <textarea class="property-input text-content-input" id="textContent" rows="4" placeholder="Enter your text...">${content.text || ''}</textarea>
                        </div>
                        <div class="property-item">
                            <label>Edit Mode</label>
                            <div class="toggle-switch">
                                <input type="checkbox" id="textEditable" ${content.isEditable !== false ? 'checked' : ''}>
                                <label for="textEditable">Allow inline editing</label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Actions Section -->
                <div class="property-section">
                    <h4 class="section-title">
                        <i class="bi bi-tools"></i>
                        Actions
                    </h4>
                    <div class="property-actions">
                        <button class="property-btn secondary" id="duplicateText">
                            <i class="bi bi-files"></i>
                            Duplicate
                        </button>
                        <button class="property-btn secondary" id="convertToPath">
                            <i class="bi bi-bezier"></i>
                            Convert to Path
                        </button>
                        <button class="property-btn danger" id="deleteText">
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
        // Typography controls
        const fontFamily = container.querySelector('#textFontFamily');
        const fontSize = container.querySelector('#textFontSize');
        const fontWeight = container.querySelector('#textFontWeight');
        const textColor = container.querySelector('#textColor');

        if (fontFamily) fontFamily.addEventListener('change', (e) => this.updateTextProperty('fontFamily', e.target.value));
        if (fontSize) {
            fontSize.addEventListener('input', (e) => {
                const value = e.target.value;
                container.querySelector('.range-value').textContent = value + 'px';
                this.updateTextProperty('fontSize', parseInt(value));
            });
        }
        if (fontWeight) fontWeight.addEventListener('change', (e) => this.updateTextProperty('fontWeight', e.target.value));
        if (textColor) textColor.addEventListener('change', (e) => this.updateTextProperty('color', e.target.value));

        // Alignment buttons
        const alignmentBtns = container.querySelectorAll('.alignment-btn');
        alignmentBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                alignmentBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateTextProperty('alignment', btn.dataset.align);
            });
        });

        // Layout controls
        const lineHeight = container.querySelector('#textLineHeight');
        const letterSpacing = container.querySelector('#textLetterSpacing');

        if (lineHeight) {
            lineHeight.addEventListener('input', (e) => {
                const value = e.target.value;
                container.querySelector('#textLineHeight').nextElementSibling.textContent = value;
                this.updateTextProperty('lineHeight', parseFloat(value));
            });
        }

        if (letterSpacing) {
            letterSpacing.addEventListener('input', (e) => {
                const value = e.target.value;
                container.querySelector('#textLetterSpacing').nextElementSibling.textContent = value + 'px';
                this.updateTextProperty('letterSpacing', parseFloat(value));
            });
        }

        // Shadow controls
        const shadowEnabled = container.querySelector('#textShadowEnabled');
        const shadowSettings = container.querySelector('#shadowSettings');

        if (shadowEnabled) {
            shadowEnabled.addEventListener('change', (e) => {
                shadowSettings.style.display = e.target.checked ? 'block' : 'none';
                this.updateTextShadow();
            });
        }

        // Shadow sliders
        const shadowControls = container.querySelectorAll('#shadowSettings input[type="range"]');
        shadowControls.forEach(control => {
            control.addEventListener('input', () => this.updateTextShadow());
        });

        const shadowColor = container.querySelector('#shadowColor');
        if (shadowColor) {
            shadowColor.addEventListener('change', () => this.updateTextShadow());
        }

        // Text transform
        const textTransform = container.querySelector('#textTransform');
        if (textTransform) {
            textTransform.addEventListener('change', (e) => this.updateTextProperty('textTransform', e.target.value));
        }

        // Content controls
        const textContent = container.querySelector('#textContent');
        const textEditable = container.querySelector('#textEditable');

        if (textContent) {
            textContent.addEventListener('input', (e) => this.updateTextProperty('text', e.target.value));
        }

        if (textEditable) {
            textEditable.addEventListener('change', (e) => this.updateTextProperty('isEditable', e.target.checked));
        }

        // Action buttons
        const duplicateBtn = container.querySelector('#duplicateText');
        const convertBtn = container.querySelector('#convertToPath');
        const deleteBtn = container.querySelector('#deleteText');

        if (duplicateBtn) duplicateBtn.addEventListener('click', () => this.duplicateText());
        if (convertBtn) convertBtn.addEventListener('click', () => this.convertToPath());
        if (deleteBtn) deleteBtn.addEventListener('click', () => this.deleteText());
    }

    updateTextProperty(property, value) {
        if (this.propertyManager.selectedElement && window.branvaCanvas) {
            const elementId = this.propertyManager.selectedElement.dataset.elementId;
            window.branvaCanvas.updateElementProperty(elementId, property, value);

            // Also update the visual element immediately
            const textElement = this.propertyManager.selectedElement.querySelector('.text-content');
            if (textElement) {
                switch(property) {
                    case 'fontFamily':
                        textElement.style.fontFamily = value;
                        break;
                    case 'fontSize':
                        textElement.style.fontSize = value + 'px';
                        break;
                    case 'fontWeight':
                        textElement.style.fontWeight = value;
                        break;
                    case 'color':
                        textElement.style.color = value;
                        break;
                    case 'alignment':
                        textElement.style.textAlign = value;
                        break;
                    case 'lineHeight':
                        textElement.style.lineHeight = value;
                        break;
                    case 'letterSpacing':
                        textElement.style.letterSpacing = value + 'px';
                        break;
                    case 'textTransform':
                        textElement.style.textTransform = value;
                        break;
                    case 'text':
                        textElement.textContent = value;
                        break;
                    case 'isEditable':
                        textElement.contentEditable = value;
                        break;
                }
            }
        }
    }

    updateTextShadow() {
        const container = document.querySelector('.text-properties');
        const enabled = container.querySelector('#textShadowEnabled').checked;

        if (!enabled) {
            this.updateTextProperty('textShadow', 'none');
            return;
        }

        const x = container.querySelector('#shadowX').value;
        const y = container.querySelector('#shadowY').value;
        const blur = container.querySelector('#shadowBlur').value;
        const color = container.querySelector('#shadowColor').value;

        const shadowValue = `${x}px ${y}px ${blur}px ${color}`;
        this.updateTextProperty('textShadow', shadowValue);

        // Update visual element
        const textElement = this.propertyManager.selectedElement?.querySelector('.text-content');
        if (textElement) {
            textElement.style.textShadow = shadowValue;
        }
    }

    duplicateText() {
        if (window.branvaCanvas && this.currentTextElement) {
            window.branvaCanvas.duplicateElement(this.currentTextElement.id);
            if (window.showToast) {
                window.showToast('Text element duplicated', 'success');
            }
        }
    }

    convertToPath() {
        // This would convert text to vector paths (advanced feature)
        if (window.showToast) {
            window.showToast('Convert to path feature coming soon', 'info');
        }
    }

    deleteText() {
        if (window.branvaCanvas && this.currentTextElement) {
            if (confirm('Are you sure you want to delete this text element?')) {
                window.branvaCanvas.deleteElement(this.currentTextElement.id);
                this.propertyManager.close();
                if (window.showToast) {
                    window.showToast('Text element deleted', 'success');
                }
            }
        }
    }
}

// Make globally available
window.BranvaTextProperties = BranvaTextProperties;