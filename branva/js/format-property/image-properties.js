// Image Properties Controller - Handles image element formatting
class BranvaImageProperties {
    constructor(propertyManager) {
        this.propertyManager = propertyManager;
        this.currentImageElement = null;
    }

    render(container, elementData) {
        this.currentImageElement = elementData;
        const content = elementData.content || {};

        container.innerHTML = `
            <div class="image-properties">
                <!-- Image Info Section -->
                <div class="property-section">
                    <h4 class="section-title">
                        <i class="bi bi-info-circle"></i>
                        Image Information
                    </h4>
                    <div class="property-group">
                        <div class="property-item">
                            <label>Source</label>
                            <div class="image-source-info">
                                <div class="property-value">${content.imageName || 'Unknown'}</div>
                                <button class="property-btn secondary small" id="changeImageSource">
                                    <i class="bi bi-arrow-repeat"></i>
                                    Change
                                </button>
                            </div>
                            <input type="file" id="newImageInput" accept="image/*" style="display: none;">
                        </div>
                        <div class="property-item">
                            <label>Dimensions</label>
                            <div class="property-value">${content.originalWidth || 'N/A'} × ${content.originalHeight || 'N/A'}</div>
                        </div>
                    </div>
                </div>

                <!-- Transform Section -->
                <div class="property-section">
                    <h4 class="section-title">
                        <i class="bi bi-arrows-move"></i>
                        Transform
                    </h4>
                    <div class="property-group">
                        <div class="property-item">
                            <label>Scale</label>
                            <div class="input-with-unit">
                                <input type="range" class="property-input range-input" id="imageScale"
                                       min="10" max="200" value="${(content.scale || 1) * 100}">
                                <span class="range-value">${Math.round((content.scale || 1) * 100)}%</span>
                            </div>
                        </div>
                        <div class="property-item">
                            <label>Rotation</label>
                            <div class="input-with-unit">
                                <input type="range" class="property-input range-input" id="imageRotation"
                                       min="0" max="360" value="${content.rotation || 0}">
                                <span class="range-value">${content.rotation || 0}°</span>
                            </div>
                        </div>
                        <div class="property-item">
                            <label>Object Fit</label>
                            <select class="property-input" id="imageObjectFit">
                                <option value="cover" ${content.objectFit === 'cover' ? 'selected' : ''}>Cover</option>
                                <option value="contain" ${content.objectFit === 'contain' ? 'selected' : ''}>Contain</option>
                                <option value="fill" ${content.objectFit === 'fill' ? 'selected' : ''}>Fill</option>
                                <option value="none" ${content.objectFit === 'none' ? 'selected' : ''}>None</option>
                                <option value="scale-down" ${content.objectFit === 'scale-down' ? 'selected' : ''}>Scale Down</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Filters Section -->
                <div class="property-section">
                    <h4 class="section-title">
                        <i class="bi bi-magic"></i>
                        Filters & Effects
                    </h4>
                    <div class="property-group">
                        <div class="property-item">
                            <label>Brightness</label>
                            <div class="input-with-unit">
                                <input type="range" class="property-input range-input" id="imageBrightness"
                                       min="0" max="200" value="${content.brightness || 100}">
                                <span class="range-value">${content.brightness || 100}%</span>
                            </div>
                        </div>
                        <div class="property-item">
                            <label>Contrast</label>
                            <div class="input-with-unit">
                                <input type="range" class="property-input range-input" id="imageContrast"
                                       min="0" max="200" value="${content.contrast || 100}">
                                <span class="range-value">${content.contrast || 100}%</span>
                            </div>
                        </div>
                        <div class="property-item">
                            <label>Saturation</label>
                            <div class="input-with-unit">
                                <input type="range" class="property-input range-input" id="imageSaturation"
                                       min="0" max="200" value="${content.saturation || 100}">
                                <span class="range-value">${content.saturation || 100}%</span>
                            </div>
                        </div>
                        <div class="property-item">
                            <label>Blur</label>
                            <div class="input-with-unit">
                                <input type="range" class="property-input range-input" id="imageBlur"
                                       min="0" max="20" value="${content.blur || 0}">
                                <span class="range-value">${content.blur || 0}px</span>
                            </div>
                        </div>
                        <div class="property-item">
                            <label>Opacity</label>
                            <div class="input-with-unit">
                                <input type="range" class="property-input range-input" id="imageOpacity"
                                       min="0" max="100" value="${(content.opacity || 1) * 100}">
                                <span class="range-value">${Math.round((content.opacity || 1) * 100)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Border & Shadow Section -->
                <div class="property-section">
                    <h4 class="section-title">
                        <i class="bi bi-border"></i>
                        Border & Shadow
                    </h4>
                    <div class="property-group">
                        <div class="property-item">
                            <label>Border Width</label>
                            <div class="input-with-unit">
                                <input type="range" class="property-input range-input" id="imageBorderWidth"
                                       min="0" max="20" value="${content.borderWidth || 0}">
                                <span class="range-value">${content.borderWidth || 0}px</span>
                            </div>
                        </div>
                        <div class="property-item">
                            <label>Border Color</label>
                            <input type="color" class="property-input color-input" id="imageBorderColor"
                                   value="${content.borderColor || '#e2e8f0'}">
                        </div>
                        <div class="property-item">
                            <label>Border Radius</label>
                            <div class="input-with-unit">
                                <input type="range" class="property-input range-input" id="imageBorderRadius"
                                       min="0" max="50" value="${content.borderRadius || 0}">
                                <span class="range-value">${content.borderRadius || 0}px</span>
                            </div>
                        </div>
                        <div class="property-item">
                            <label>Drop Shadow</label>
                            <div class="shadow-controls">
                                <div class="shadow-toggle">
                                    <input type="checkbox" id="imageShadowEnabled" ${content.boxShadow ? 'checked' : ''}>
                                    <label for="imageShadowEnabled">Enable Shadow</label>
                                </div>
                                <div class="shadow-settings" id="imageShadowSettings" style="display: ${content.boxShadow ? 'block' : 'none'}">
                                    <div class="shadow-control">
                                        <label>X Offset</label>
                                        <input type="range" id="imageShadowX" min="-20" max="20" value="4" class="property-input range-input">
                                        <span class="range-value">4px</span>
                                    </div>
                                    <div class="shadow-control">
                                        <label>Y Offset</label>
                                        <input type="range" id="imageShadowY" min="-20" max="20" value="4" class="property-input range-input">
                                        <span class="range-value">4px</span>
                                    </div>
                                    <div class="shadow-control">
                                        <label>Blur</label>
                                        <input type="range" id="imageShadowBlur" min="0" max="50" value="8" class="property-input range-input">
                                        <span class="range-value">8px</span>
                                    </div>
                                    <div class="shadow-control">
                                        <label>Shadow Color</label>
                                        <input type="color" id="imageShadowColor" value="#00000033" class="property-input color-input">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Presets Section -->
                <div class="property-section">
                    <h4 class="section-title">
                        <i class="bi bi-lightning"></i>
                        Quick Presets
                    </h4>
                    <div class="preset-buttons">
                        <button class="preset-btn" data-preset="reset">
                            <i class="bi bi-arrow-clockwise"></i>
                            Reset
                        </button>
                        <button class="preset-btn" data-preset="vintage">
                            <i class="bi bi-camera-reels"></i>
                            Vintage
                        </button>
                        <button class="preset-btn" data-preset="bw">
                            <i class="bi bi-circle-half"></i>
                            B&W
                        </button>
                        <button class="preset-btn" data-preset="bright">
                            <i class="bi bi-brightness-high"></i>
                            Bright
                        </button>
                        <button class="preset-btn" data-preset="dramatic">
                            <i class="bi bi-lightning-charge"></i>
                            Dramatic
                        </button>
                    </div>
                </div>

                <!-- Actions Section -->
                <div class="property-section">
                    <h4 class="section-title">
                        <i class="bi bi-tools"></i>
                        Actions
                    </h4>
                    <div class="property-actions">
                        <button class="property-btn secondary" id="cropImage">
                            <i class="bi bi-crop"></i>
                            Crop
                        </button>
                        <button class="property-btn secondary" id="duplicateImage">
                            <i class="bi bi-files"></i>
                            Duplicate
                        </button>
                        <button class="property-btn secondary" id="downloadImage">
                            <i class="bi bi-download"></i>
                            Download
                        </button>
                        <button class="property-btn danger" id="deleteImage">
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
        // Image source change
        const changeBtn = container.querySelector('#changeImageSource');
        const fileInput = container.querySelector('#newImageInput');
        if (changeBtn && fileInput) {
            changeBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.handleImageChange(e));
        }

        // Transform controls
        const scale = container.querySelector('#imageScale');
        const rotation = container.querySelector('#imageRotation');
        const objectFit = container.querySelector('#imageObjectFit');

        if (scale) {
            scale.addEventListener('input', (e) => {
                const value = e.target.value;
                container.querySelector('#imageScale').nextElementSibling.textContent = value + '%';
                this.updateImageProperty('scale', value / 100);
            });
        }

        if (rotation) {
            rotation.addEventListener('input', (e) => {
                const value = e.target.value;
                container.querySelector('#imageRotation').nextElementSibling.textContent = value + '°';
                this.updateImageProperty('rotation', value);
            });
        }

        if (objectFit) {
            objectFit.addEventListener('change', (e) => this.updateImageProperty('objectFit', e.target.value));
        }

        // Filter controls
        const filterControls = ['brightness', 'contrast', 'saturation', 'blur', 'opacity'];
        filterControls.forEach(filter => {
            const control = container.querySelector(`#image${filter.charAt(0).toUpperCase() + filter.slice(1)}`);
            if (control) {
                control.addEventListener('input', (e) => {
                    const value = e.target.value;
                    const unit = filter === 'blur' ? 'px' : '%';
                    control.nextElementSibling.textContent = value + unit;

                    let finalValue = value;
                    if (filter === 'opacity') finalValue = value / 100;

                    this.updateImageProperty(filter, finalValue);
                    this.updateImageFilters();
                });
            }
        });

        // Border controls
        const borderWidth = container.querySelector('#imageBorderWidth');
        const borderColor = container.querySelector('#imageBorderColor');
        const borderRadius = container.querySelector('#imageBorderRadius');

        if (borderWidth) {
            borderWidth.addEventListener('input', (e) => {
                const value = e.target.value;
                borderWidth.nextElementSibling.textContent = value + 'px';
                this.updateImageProperty('borderWidth', value);
                this.updateImageBorder();
            });
        }

        if (borderColor) {
            borderColor.addEventListener('change', (e) => {
                this.updateImageProperty('borderColor', e.target.value);
                this.updateImageBorder();
            });
        }

        if (borderRadius) {
            borderRadius.addEventListener('input', (e) => {
                const value = e.target.value;
                borderRadius.nextElementSibling.textContent = value + 'px';
                this.updateImageProperty('borderRadius', value);
                this.updateImageBorder();
            });
        }

        // Shadow controls
        const shadowEnabled = container.querySelector('#imageShadowEnabled');
        const shadowSettings = container.querySelector('#imageShadowSettings');

        if (shadowEnabled) {
            shadowEnabled.addEventListener('change', (e) => {
                shadowSettings.style.display = e.target.checked ? 'block' : 'none';
                this.updateImageShadow();
            });
        }

        const shadowControls = container.querySelectorAll('#imageShadowSettings input[type="range"]');
        shadowControls.forEach(control => {
            control.addEventListener('input', () => this.updateImageShadow());
        });

        const shadowColor = container.querySelector('#imageShadowColor');
        if (shadowColor) {
            shadowColor.addEventListener('change', () => this.updateImageShadow());
        }

        // Preset buttons
        const presetBtns = container.querySelectorAll('.preset-btn');
        presetBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.applyPreset(e.target.closest('.preset-btn').dataset.preset));
        });

        // Action buttons
        const cropBtn = container.querySelector('#cropImage');
        const duplicateBtn = container.querySelector('#duplicateImage');
        const downloadBtn = container.querySelector('#downloadImage');
        const deleteBtn = container.querySelector('#deleteImage');

        if (cropBtn) cropBtn.addEventListener('click', () => this.cropImage());
        if (duplicateBtn) duplicateBtn.addEventListener('click', () => this.duplicateImage());
        if (downloadBtn) downloadBtn.addEventListener('click', () => this.downloadImage());
        if (deleteBtn) deleteBtn.addEventListener('click', () => this.deleteImage());
    }

    handleImageChange(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.updateImageProperty('imageUrl', e.target.result);
                this.updateImageProperty('imageName', file.name);

                // Update visual element
                const imageElement = this.propertyManager.selectedElement?.querySelector('img');
                if (imageElement) {
                    imageElement.src = e.target.result;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    updateImageProperty(property, value) {
        if (this.propertyManager.selectedElement && window.branvaCanvas) {
            const elementId = this.propertyManager.selectedElement.dataset.elementId;
            window.branvaCanvas.updateElementProperty(elementId, property, value);
        }
    }

    updateImageFilters() {
        const imageElement = this.propertyManager.selectedElement?.querySelector('img');
        if (!imageElement) return;

        const container = document.querySelector('.image-properties');
        const brightness = container.querySelector('#imageBrightness').value;
        const contrast = container.querySelector('#imageContrast').value;
        const saturation = container.querySelector('#imageSaturation').value;
        const blur = container.querySelector('#imageBlur').value;
        const opacity = container.querySelector('#imageOpacity').value / 100;

        const filterValue = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;

        imageElement.style.filter = filterValue;
        imageElement.style.opacity = opacity;
    }

    updateImageBorder() {
        const imageElement = this.propertyManager.selectedElement?.querySelector('img');
        if (!imageElement) return;

        const container = document.querySelector('.image-properties');
        const width = container.querySelector('#imageBorderWidth').value;
        const color = container.querySelector('#imageBorderColor').value;
        const radius = container.querySelector('#imageBorderRadius').value;

        imageElement.style.border = width > 0 ? `${width}px solid ${color}` : 'none';
        imageElement.style.borderRadius = radius + 'px';
    }

    updateImageShadow() {
        const imageElement = this.propertyManager.selectedElement?.querySelector('img');
        if (!imageElement) return;

        const container = document.querySelector('.image-properties');
        const enabled = container.querySelector('#imageShadowEnabled').checked;

        if (!enabled) {
            imageElement.style.boxShadow = 'none';
            return;
        }

        const x = container.querySelector('#imageShadowX').value;
        const y = container.querySelector('#imageShadowY').value;
        const blur = container.querySelector('#imageShadowBlur').value;
        const color = container.querySelector('#imageShadowColor').value;

        imageElement.style.boxShadow = `${x}px ${y}px ${blur}px ${color}`;
    }

    applyPreset(preset) {
        const container = document.querySelector('.image-properties');

        switch(preset) {
            case 'reset':
                this.setFilterValues({ brightness: 100, contrast: 100, saturation: 100, blur: 0, opacity: 100 });
                break;
            case 'vintage':
                this.setFilterValues({ brightness: 110, contrast: 85, saturation: 70, blur: 0, opacity: 100 });
                break;
            case 'bw':
                this.setFilterValues({ brightness: 100, contrast: 110, saturation: 0, blur: 0, opacity: 100 });
                break;
            case 'bright':
                this.setFilterValues({ brightness: 130, contrast: 90, saturation: 110, blur: 0, opacity: 100 });
                break;
            case 'dramatic':
                this.setFilterValues({ brightness: 80, contrast: 150, saturation: 120, blur: 0, opacity: 100 });
                break;
        }

        this.updateImageFilters();
    }

    setFilterValues(values) {
        const container = document.querySelector('.image-properties');

        Object.entries(values).forEach(([filter, value]) => {
            const control = container.querySelector(`#image${filter.charAt(0).toUpperCase() + filter.slice(1)}`);
            if (control) {
                control.value = value;
                const unit = filter === 'blur' ? 'px' : '%';
                control.nextElementSibling.textContent = value + unit;
            }
        });
    }

    cropImage() {
        if (window.showToast) {
            window.showToast('Crop feature coming soon', 'info');
        }
    }

    duplicateImage() {
        if (window.branvaCanvas && this.currentImageElement) {
            window.branvaCanvas.duplicateElement(this.currentImageElement.id);
            if (window.showToast) {
                window.showToast('Image duplicated', 'success');
            }
        }
    }

    downloadImage() {
        const imageElement = this.propertyManager.selectedElement?.querySelector('img');
        if (imageElement) {
            const link = document.createElement('a');
            link.href = imageElement.src;
            link.download = this.currentImageElement.content?.imageName || 'image.png';
            link.click();
        }
    }

    deleteImage() {
        if (window.branvaCanvas && this.currentImageElement) {
            if (confirm('Are you sure you want to delete this image?')) {
                window.branvaCanvas.deleteElement(this.currentImageElement.id);
                this.propertyManager.close();
                if (window.showToast) {
                    window.showToast('Image deleted', 'success');
                }
            }
        }
    }
}

// Make globally available
window.BranvaImageProperties = BranvaImageProperties;