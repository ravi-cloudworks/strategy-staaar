// Matrix Properties Controller - Handles strategy matrix formatting and video analysis
class BranvaMatrixProperties {
    constructor(propertyManager) {
        this.propertyManager = propertyManager;
        this.currentMatrix = null;
        this.currentVideo = null;
        this.isVideoAnalysisMode = false;
    }

    render(container, elementData) {
        this.currentMatrix = elementData;

        container.innerHTML = `
            <div class="matrix-properties">
                <!-- Matrix Info Section -->
                <div class="property-section">
                    <h4 class="section-title">
                        <i class="bi bi-info-circle"></i>
                        Matrix Information
                    </h4>
                    <div class="property-group">
                        <div class="property-item">
                            <label>Strategy Name</label>
                            <div class="property-value">${elementData.content?.metadata?.strategyName || 'Unknown Strategy'}</div>
                        </div>
                        <div class="property-item">
                            <label>Cluster</label>
                            <div class="property-value">
                                ${elementData.content?.metadata?.clusterIcon || '📋'}
                                ${elementData.content?.metadata?.cluster || 'General'}
                            </div>
                        </div>
                        <div class="property-item">
                            <label>Matrix Size</label>
                            <div class="property-value">${elementData.content?.metadata?.matrixSize || 'N/A'}</div>
                        </div>
                        <div class="property-item">
                            <label>Urgency</label>
                            <div class="property-value">
                                <span class="urgency-badge ${elementData.content?.metadata?.marketUrgency?.toLowerCase()}">${elementData.content?.metadata?.marketUrgency || 'MEDIUM'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Video Analysis Section -->
                <div class="property-section">
                    <h4 class="section-title">
                        <i class="bi bi-camera-video"></i>
                        Video Analysis
                        <button class="toggle-video-btn" id="toggleVideoAnalysis" data-active="${this.isVideoAnalysisMode}">
                            ${this.isVideoAnalysisMode ? 'Hide' : 'Show'}
                        </button>
                    </h4>
                    <div class="video-analysis-content" id="videoAnalysisContent" style="display: ${this.isVideoAnalysisMode ? 'block' : 'none'}">
                        <!-- Video Selection -->
                        <div class="video-selection-section">
                            <h5>Select Video</h5>

                            <!-- Upload Option -->
                            <div class="upload-option">
                                <input type="file" id="matrixVideoInput" accept="video/*" style="display: none;">
                                <button class="upload-btn property-btn" id="matrixUploadBtn">
                                    <i class="bi bi-cloud-upload"></i>
                                    Upload Video
                                </button>
                            </div>

                            <!-- Server Videos -->
                            <div class="server-videos">
                                <h6>Sample Videos</h6>
                                <div id="matrixVideosList" class="videos-list">
                                    <!-- Videos will be loaded here -->
                                </div>
                            </div>
                        </div>

                        <!-- Video Player -->
                        <div class="video-player-section" id="matrixVideoPlayerSection" style="display: none;">
                            <video id="matrixVideoPlayer" controls style="width: 100%; max-height: 180px; border-radius: 8px;"></video>
                        </div>

                        <!-- Capture Controls -->
                        <div class="capture-controls-section" id="matrixCaptureControls" style="display: none;">
                            <h5>Capture to Matrix</h5>
                            <div class="capture-buttons-grid" id="matrixCaptureButtonsGrid">
                                <!-- Capture buttons will be generated here -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Matrix Styling Section -->
                <div class="property-section">
                    <h4 class="section-title">
                        <i class="bi bi-palette"></i>
                        Matrix Styling
                    </h4>
                    <div class="property-group">
                        <div class="property-item">
                            <label>Border Style</label>
                            <select class="property-input" id="matrixBorderStyle">
                                <option value="solid">Solid</option>
                                <option value="dashed">Dashed</option>
                                <option value="dotted">Dotted</option>
                                <option value="none">None</option>
                            </select>
                        </div>
                        <div class="property-item">
                            <label>Border Color</label>
                            <input type="color" class="property-input color-input" id="matrixBorderColor" value="#e2e8f0">
                        </div>
                        <div class="property-item">
                            <label>Background Color</label>
                            <input type="color" class="property-input color-input" id="matrixBgColor" value="#ffffff">
                        </div>
                        <div class="property-item">
                            <label>Corner Radius</label>
                            <input type="range" class="property-input range-input" id="matrixBorderRadius" min="0" max="20" value="8">
                            <span class="range-value">8px</span>
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
                        <button class="property-btn secondary" id="exportMatrixData">
                            <i class="bi bi-download"></i>
                            Export Data
                        </button>
                        <button class="property-btn secondary" id="duplicateMatrix">
                            <i class="bi bi-files"></i>
                            Duplicate
                        </button>
                        <button class="property-btn danger" id="deleteMatrix">
                            <i class="bi bi-trash"></i>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners(container);

        // Load server videos if video analysis is active
        if (this.isVideoAnalysisMode) {
            this.loadServerVideos();
        }
    }

    setupEventListeners(container) {
        // Video Analysis Toggle
        const toggleBtn = container.querySelector('#toggleVideoAnalysis');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleVideoAnalysis());
        }

        // Video Upload
        const uploadBtn = container.querySelector('#matrixUploadBtn');
        const videoInput = container.querySelector('#matrixVideoInput');
        if (uploadBtn && videoInput) {
            uploadBtn.addEventListener('click', () => videoInput.click());
            videoInput.addEventListener('change', (e) => this.handleVideoUpload(e));
        }

        // Styling Controls
        const borderStyle = container.querySelector('#matrixBorderStyle');
        const borderColor = container.querySelector('#matrixBorderColor');
        const bgColor = container.querySelector('#matrixBgColor');
        const borderRadius = container.querySelector('#matrixBorderRadius');

        if (borderStyle) borderStyle.addEventListener('change', (e) => this.updateMatrixStyle('borderStyle', e.target.value));
        if (borderColor) borderColor.addEventListener('change', (e) => this.updateMatrixStyle('borderColor', e.target.value));
        if (bgColor) bgColor.addEventListener('change', (e) => this.updateMatrixStyle('backgroundColor', e.target.value));
        if (borderRadius) {
            borderRadius.addEventListener('input', (e) => {
                const value = e.target.value;
                container.querySelector('.range-value').textContent = value + 'px';
                this.updateMatrixStyle('borderRadius', value + 'px');
            });
        }

        // Action Buttons
        const exportBtn = container.querySelector('#exportMatrixData');
        const duplicateBtn = container.querySelector('#duplicateMatrix');
        const deleteBtn = container.querySelector('#deleteMatrix');

        if (exportBtn) exportBtn.addEventListener('click', () => this.exportMatrixData());
        if (duplicateBtn) duplicateBtn.addEventListener('click', () => this.duplicateMatrix());
        if (deleteBtn) deleteBtn.addEventListener('click', () => this.deleteMatrix());
    }

    toggleVideoAnalysis() {
        this.isVideoAnalysisMode = !this.isVideoAnalysisMode;

        const toggleBtn = document.getElementById('toggleVideoAnalysis');
        const content = document.getElementById('videoAnalysisContent');

        if (toggleBtn && content) {
            toggleBtn.textContent = this.isVideoAnalysisMode ? 'Hide' : 'Show';
            toggleBtn.dataset.active = this.isVideoAnalysisMode;
            content.style.display = this.isVideoAnalysisMode ? 'block' : 'none';

            if (this.isVideoAnalysisMode) {
                this.loadServerVideos();
            }
        }
    }

    async loadServerVideos() {
        const videosList = document.getElementById('matrixVideosList');
        if (!videosList) return;

        try {
            const knownVideos = [
                'Nike_JustDoIt_2024_Sports_US_Athlete.mp4',
                'CocaCola_ShareACoke_2024_Beverage_UK_Teens.mp4',
                'Apple_iPhone15_2023_Tech_Global_YoungAdults.mp4'
            ];

            videosList.innerHTML = '<div style="color: #94a3b8; font-size: 12px; text-align: center; padding: 10px;">Loading videos...</div>';

            const availableVideos = [];
            for (const videoFile of knownVideos) {
                try {
                    const response = await fetch(`./videos/${videoFile}`, { method: 'HEAD' });
                    if (response.ok) {
                        availableVideos.push(videoFile);
                    }
                } catch (e) {
                    console.log(`Video ${videoFile} not available`);
                }
            }

            if (availableVideos.length > 0) {
                videosList.innerHTML = '';
                availableVideos.forEach(videoFile => {
                    const videoItem = this.createVideoItem(videoFile);
                    videosList.appendChild(videoItem);
                });
            } else {
                videosList.innerHTML = '<div style="color: #94a3b8; font-size: 12px; text-align: center; padding: 10px;">No videos available</div>';
            }
        } catch (error) {
            console.error('Error loading server videos:', error);
            videosList.innerHTML = '<div style="color: #ef4444; font-size: 12px; text-align: center; padding: 10px;">Failed to load videos</div>';
        }
    }

    createVideoItem(filename) {
        const metadata = this.parseVideoMetadata(filename);
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        videoItem.innerHTML = `
            <div class="video-item-title">${metadata.brand} - ${metadata.campaign}</div>
            <div class="video-item-desc">${metadata.description}</div>
        `;
        videoItem.addEventListener('click', () => {
            this.loadVideo(`./videos/${filename}`, metadata);
        });
        return videoItem;
    }

    parseVideoMetadata(filename) {
        const parts = filename.replace('.mp4', '').split('-');
        return {
            brand: parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : 'Unknown',
            campaign: parts.slice(1).join(' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: `${parts[0]} brand campaign video`
        };
    }

    handleVideoUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('video/')) {
            const url = URL.createObjectURL(file);
            const metadata = {
                brand: 'Custom',
                campaign: 'Uploaded Video',
                description: 'Uploaded video file'
            };
            this.loadVideo(url, metadata);
        }
    }

    loadVideo(videoPath, metadata) {
        this.currentVideo = { path: videoPath, metadata };
        const videoPlayer = document.getElementById('matrixVideoPlayer');
        const playerSection = document.getElementById('matrixVideoPlayerSection');

        if (videoPlayer && playerSection) {
            videoPlayer.src = videoPath;
            videoPlayer.load();
            playerSection.style.display = 'block';

            videoPlayer.addEventListener('loadedmetadata', () => {
                this.generateCaptureButtons();
                this.showCaptureControls();
            });
        }
    }

    generateCaptureButtons() {
        const captureGrid = document.getElementById('matrixCaptureButtonsGrid');
        if (!captureGrid) return;

        captureGrid.innerHTML = '';

        // Get the actual DOM table rows from the matrix element
        const matrixElement = document.querySelector(`[data-element-id="${this.currentMatrix.id}"]`);
        if (!matrixElement) return;

        const table = matrixElement.querySelector('table');
        if (!table) return;

        const rows = table.querySelectorAll('tr');

        rows.forEach((row, rowIndex) => {
            const categoryCell = row.querySelector('.category-cell');
            let rowName = `Row ${rowIndex + 1}`;

            // Extract row header text using the same logic as video drawer
            if (categoryCell) {
                const textDiv = categoryCell.querySelector('div:last-child');
                if (textDiv && textDiv.textContent.trim()) {
                    rowName = textDiv.textContent.trim();
                } else {
                    const textContent = categoryCell.textContent?.trim();
                    if (textContent && !textContent.includes('ROW')) {
                        rowName = textContent;
                    }
                }
            }

            const rowButton = document.createElement('button');
            rowButton.className = 'capture-row-btn property-btn';
            rowButton.innerHTML = `
                <i class="bi bi-camera"></i>
                Capture to ${rowName}
            `;
            rowButton.addEventListener('click', () => this.captureToRow(rowIndex));
            captureGrid.appendChild(rowButton);
        });
    }

    showCaptureControls() {
        const captureControls = document.getElementById('matrixCaptureControls');
        if (captureControls) {
            captureControls.style.display = 'block';
        }
    }

    captureToRow(rowIndex) {
        const videoPlayer = document.getElementById('matrixVideoPlayer');
        if (!videoPlayer || videoPlayer.readyState < 2) {
            if (window.showToast) {
                window.showToast('Video not ready for capture', 'error');
            }
            return;
        }

        // Create canvas for capture
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;

        // Draw video frame
        ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/png');

        // Update matrix with captured image using the same method as video drawer
        this.placeImageInMatrix(this.currentMatrix.id, rowIndex, dataURL);

        // Get row name for toast message using DOM elements
        let rowName = `Row ${rowIndex + 1}`;
        const matrixElement = document.querySelector(`[data-element-id="${this.currentMatrix.id}"]`);
        if (matrixElement) {
            const table = matrixElement.querySelector('table');
            if (table) {
                const rows = table.querySelectorAll('tr');
                if (rows[rowIndex]) {
                    const categoryCell = rows[rowIndex].querySelector('.category-cell');
                    if (categoryCell) {
                        const textDiv = categoryCell.querySelector('div:last-child');
                        if (textDiv && textDiv.textContent.trim()) {
                            rowName = textDiv.textContent.trim();
                        } else {
                            const textContent = categoryCell.textContent?.trim();
                            if (textContent && !textContent.includes('ROW')) {
                                rowName = textContent;
                            }
                        }
                    }
                }
            }
        }

        if (window.showToast) {
            window.showToast(`Captured frame to ${rowName}`, 'success');
        }
    }

    updateMatrixStyle(property, value) {
        if (this.propertyManager.selectedElement) {
            const element = this.propertyManager.selectedElement;

            switch(property) {
                case 'borderStyle':
                    element.style.borderStyle = value;
                    break;
                case 'borderColor':
                    element.style.borderColor = value;
                    break;
                case 'backgroundColor':
                    element.style.backgroundColor = value;
                    break;
                case 'borderRadius':
                    element.style.borderRadius = value;
                    break;
            }
        }
    }

    exportMatrixData() {
        if (this.currentMatrix?.content?.strategyContent) {
            const data = JSON.stringify(this.currentMatrix.content.strategyContent, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.currentMatrix.content.metadata?.strategyName || 'matrix'}-data.json`;
            a.click();

            URL.revokeObjectURL(url);
        }
    }

    duplicateMatrix() {
        if (window.branvaCanvas && this.currentMatrix) {
            window.branvaCanvas.duplicateElement(this.currentMatrix.id);
            if (window.showToast) {
                window.showToast('Matrix duplicated', 'success');
            }
        }
    }

    deleteMatrix() {
        if (window.branvaCanvas && this.currentMatrix) {
            if (confirm('Are you sure you want to delete this matrix?')) {
                window.branvaCanvas.deleteElement(this.currentMatrix.id);
                this.propertyManager.close();
                if (window.showToast) {
                    window.showToast('Matrix deleted', 'success');
                }
            }
        }
    }

    placeImageInMatrix(matrixId, rowIndex, imageData) {
        // Find the matrix element
        const matrixElement = document.querySelector(`[data-element-id="${matrixId}"]`);
        if (!matrixElement) {
            console.error('Matrix not found:', matrixId);
            return;
        }

        const table = matrixElement.querySelector('table');
        if (!table) {
            console.error('Matrix table not found');
            return;
        }

        // Find the specific row and image placeholder
        const rows = table.querySelectorAll('tr');
        if (rowIndex >= rows.length) {
            console.error('Row index out of range:', rowIndex);
            return;
        }

        const targetRow = rows[rowIndex];
        const imagePlaceholder = targetRow.querySelector('.image-placeholder');

        if (!imagePlaceholder) {
            console.error('Image placeholder not found in row');
            return;
        }

        // Use the image manipulation module if available
        if (window.branvaImageManipulation) {
            window.branvaImageManipulation.updateImagePlaceholder(imagePlaceholder, imageData, matrixId);
        } else {
            // Fallback implementation
            this.updateImagePlaceholderFallback(imagePlaceholder, imageData);
        }

        // Store in Branva storage system
        const imageKey = `row-${rowIndex}`;
        if (window.branvaImageData) {
            window.branvaImageData.storeImage(matrixId, imageKey, {
                src: imageData,
                originalSrc: imageData,
                rowIndex: rowIndex,
                columnIndex: 1, // Image column
                capturedAt: new Date().toISOString(),
                mode: 'fit',
                videoMetadata: this.currentVideo?.metadata
            });
        }

        // console.log('🖼️ Image placed in matrix:', { matrixId, rowIndex });
    }

    updateImagePlaceholderFallback(placeholder, dataURL) {
        placeholder.innerHTML = '';

        const img = document.createElement('img');
        img.src = dataURL;
        img.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: contain;
            object-position: center center;
        `;

        placeholder.appendChild(img);
    }
}

// Make globally available
window.BranvaMatrixProperties = BranvaMatrixProperties;