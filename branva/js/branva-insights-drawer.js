// Branva Consumer Insights Drawer Controller
class BranvaInsightsDrawer {
    constructor() {
        this.drawer = null;
        this.isOpen = false;
        this.currentCategory = 'maps';
        this.currentMatrixId = null;
        this.currentVideo = null;
        this.init();
    }

    init() {
        this.createDrawerHTML();
        this.setupEventListeners();
        this.ensureDrawerClosed();
        // Don't load content until drawer is opened
    }

    createDrawerHTML() {
        const existingDrawer = document.getElementById('insightsDrawer');
        if (existingDrawer) {
            existingDrawer.remove();
        }

        const drawerHTML = `
            <div class="insights-drawer" id="insightsDrawer">
                <div class="drawer-header">
                    <div class="drawer-title">
                        <i class="bi bi-geo-alt"></i>
                        <span>Consumer Insights</span>
                    </div>
                    <button class="drawer-close" id="closeInsightsDrawer">
                        <i class="bi bi-x"></i>
                    </button>
                </div>

                <div class="drawer-content">
                    <!-- Category Tabs -->
                    <div class="category-tabs">
                        <button class="category-tab active" data-category="maps">
                            <i class="bi bi-map"></i>
                            <span>Maps & Geography</span>
                        </button>
                        <button class="category-tab" data-category="behavior">
                            <i class="bi bi-person-check"></i>
                            <span>Consumer Behavior</span>
                        </button>
                        <button class="category-tab" data-category="data">
                            <i class="bi bi-graph-up"></i>
                            <span>Data Visualization</span>
                        </button>
                        <button class="category-tab" data-category="journey">
                            <i class="bi bi-signpost"></i>
                            <span>Journey Mapping</span>
                        </button>
                        <button class="category-tab" data-category="touchpoints">
                            <i class="bi bi-diagram-3"></i>
                            <span>Touchpoints</span>
                        </button>
                        <button class="category-tab" data-category="video">
                            <i class="bi bi-camera-video"></i>
                            <span>Video Analysis</span>
                        </button>
                    </div>

                    <!-- Content Areas -->
                    <div class="category-content">
                        <!-- Maps Content -->
                        <div class="content-section active" id="mapsContent">
                            <div class="insight-tools">
                                <button class="insight-tool" data-tool="world-map">
                                    <div class="tool-icon">🗺️</div>
                                    <div class="tool-label">World Map</div>
                                </button>
                                <button class="insight-tool" data-tool="region-map">
                                    <div class="tool-icon">🌍</div>
                                    <div class="tool-label">Regional Map</div>
                                </button>
                                <button class="insight-tool" data-tool="city-map">
                                    <div class="tool-icon">🏙️</div>
                                    <div class="tool-label">City View</div>
                                </button>
                            </div>
                        </div>

                        <!-- Behavior Content -->
                        <div class="content-section" id="behaviorContent">
                            <div class="insight-tools">
                                <button class="insight-tool" data-tool="demographics">
                                    <div class="tool-icon">👥</div>
                                    <div class="tool-label">Demographics</div>
                                </button>
                                <button class="insight-tool" data-tool="psychographics">
                                    <div class="tool-icon">🧠</div>
                                    <div class="tool-label">Psychographics</div>
                                </button>
                                <button class="insight-tool" data-tool="behavioral-patterns">
                                    <div class="tool-icon">📊</div>
                                    <div class="tool-label">Behavior Patterns</div>
                                </button>
                            </div>
                        </div>

                        <!-- Data Visualization Content -->
                        <div class="content-section" id="dataContent">
                            <div class="insight-tools">
                                <button class="insight-tool" data-tool="bar-chart">
                                    <div class="tool-icon">📊</div>
                                    <div class="tool-label">Bar Chart</div>
                                </button>
                                <button class="insight-tool" data-tool="pie-chart">
                                    <div class="tool-icon">🍕</div>
                                    <div class="tool-label">Pie Chart</div>
                                </button>
                                <button class="insight-tool" data-tool="line-graph">
                                    <div class="tool-icon">📈</div>
                                    <div class="tool-label">Line Graph</div>
                                </button>
                            </div>
                        </div>

                        <!-- Journey Mapping Content -->
                        <div class="content-section" id="journeyContent">
                            <div class="insight-tools">
                                <button class="insight-tool" data-tool="customer-journey">
                                    <div class="tool-icon">🛤️</div>
                                    <div class="tool-label">Customer Journey</div>
                                </button>
                                <button class="insight-tool" data-tool="experience-map">
                                    <div class="tool-icon">🗺️</div>
                                    <div class="tool-label">Experience Map</div>
                                </button>
                                <button class="insight-tool" data-tool="service-blueprint">
                                    <div class="tool-icon">📋</div>
                                    <div class="tool-label">Service Blueprint</div>
                                </button>
                            </div>
                        </div>

                        <!-- Touchpoints Content -->
                        <div class="content-section" id="touchpointsContent">
                            <div class="insight-tools">
                                <button class="insight-tool" data-tool="digital-touchpoints">
                                    <div class="tool-icon">📱</div>
                                    <div class="tool-label">Digital Touchpoints</div>
                                </button>
                                <button class="insight-tool" data-tool="physical-touchpoints">
                                    <div class="tool-icon">🏪</div>
                                    <div class="tool-label">Physical Touchpoints</div>
                                </button>
                                <button class="insight-tool" data-tool="interaction-flow">
                                    <div class="tool-icon">🔄</div>
                                    <div class="tool-label">Interaction Flow</div>
                                </button>
                            </div>
                        </div>

                        <!-- Video Analysis Content -->
                        <div class="content-section" id="videoContent">
                            <!-- Video Selection -->
                            <div class="video-selection-section">
                                <h4>Select Video</h4>

                                <!-- Upload Option -->
                                <div class="upload-option">
                                    <input type="file" id="insightsVideoInput" accept="video/*" style="display: none;">
                                    <button class="upload-btn" id="insightsUploadBtn">
                                        <i class="bi bi-cloud-upload"></i>
                                        Upload Video
                                    </button>
                                </div>

                                <!-- Server Videos -->
                                <div class="server-videos">
                                    <h5>Sample Videos</h5>
                                    <div id="insightsVideosList" class="videos-list">
                                        <!-- Videos will be loaded here -->
                                    </div>
                                </div>
                            </div>

                            <!-- Video Player -->
                            <div class="video-player-section" id="insightsVideoPlayerSection" style="display: none;">
                                <video id="insightsVideoPlayer" controls style="width: 100%; max-height: 200px; border-radius: 8px;"></video>
                            </div>

                            <!-- Capture Controls -->
                            <div class="capture-controls-section" id="insightsCaptureControls" style="display: none;">
                                <h4>Capture to Matrix</h4>
                                <div class="capture-buttons-grid" id="insightsCaptureGrid">
                                    <!-- Capture buttons will be generated here -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', drawerHTML);
        this.drawer = document.getElementById('insightsDrawer');
    }

    ensureDrawerClosed() {
        if (this.drawer) {
            this.drawer.classList.remove('open');
            this.isOpen = false;

            const canvasArea = document.getElementById('canvasArea');
            if (canvasArea) {
                canvasArea.classList.remove('with-insights-drawer');
            }
        }
    }

    setupEventListeners() {
        // Close drawer button
        const closeBtn = document.getElementById('closeInsightsDrawer');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Category tabs
        const categoryTabs = document.querySelectorAll('.category-tab');
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const category = tab.dataset.category;
                this.switchCategory(category);
            });
        });

        // Video upload handling
        const uploadBtn = document.getElementById('insightsUploadBtn');
        const videoInput = document.getElementById('insightsVideoInput');

        if (uploadBtn && videoInput) {
            uploadBtn.addEventListener('click', () => videoInput.click());
            videoInput.addEventListener('change', (e) => this.handleVideoUpload(e));
        }

        // Insight tools
        const insightTools = document.querySelectorAll('.insight-tool');
        insightTools.forEach(tool => {
            tool.addEventListener('click', () => {
                const toolType = tool.dataset.tool;
                this.addInsightTool(toolType);
            });
        });
    }

    loadInsightCategories() {
        this.loadServerVideos();
    }

    open(matrixId = null) {
        this.currentMatrixId = matrixId;

        // Show drawer
        this.drawer.classList.add('open');

        // Shift canvas area
        const canvasArea = document.getElementById('canvasArea');
        if (canvasArea) {
            canvasArea.classList.add('with-insights-drawer');
        }

        this.isOpen = true;

        // Load content when drawer is opened
        this.loadInsightCategories();

        // If video category is selected and matrix is provided, generate capture buttons
        if (this.currentCategory === 'video' && matrixId) {
            this.generateCaptureButtons(matrixId);
        }

        if (window.showToast) {
            window.showToast('Consumer Insights drawer opened', 'success');
        }

        console.log('🎯 Consumer Insights drawer opened for matrix:', matrixId);
    }

    close() {
        // Hide drawer
        this.drawer.classList.remove('open');

        // Reset canvas area
        const canvasArea = document.getElementById('canvasArea');
        if (canvasArea) {
            canvasArea.classList.remove('with-insights-drawer');
        }

        this.isOpen = false;
        this.currentMatrixId = null;

        // Hide video player and capture controls
        this.hideVideoPlayer();
        this.hideCaptureControls();

        console.log('🎯 Consumer Insights drawer closed');
    }

    switchCategory(category) {
        this.currentCategory = category;

        // Update active tab
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Show corresponding content
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`${category}Content`).classList.add('active');

        // If switching to video and we have a matrix, generate capture buttons
        if (category === 'video' && this.currentMatrixId) {
            this.generateCaptureButtons(this.currentMatrixId);
        }

        console.log('🎯 Switched to category:', category);
    }

    addInsightTool(toolType) {
        if (window.showToast) {
            window.showToast(`Adding ${toolType} tool to slide`, 'success');
        }

        // TODO: Implement actual tool addition to canvas
        console.log('🔧 Adding insight tool:', toolType);
    }

    // Video Analysis Methods (inherited from video drawer)
    async loadServerVideos() {
        const videosList = document.getElementById('insightsVideosList');
        if (!videosList) return;

        try {
            const knownVideos = [
                'Apple_iPhone15_2023_Tech_Global_YoungAdults.mp4',
                'CocaCola_ShareACoke_2024_Beverage_UK_Teens.mp4',
                'Nike_JustDoIt_2024_Sports_US_Athlete.mp4'
            ];

            videosList.innerHTML = '';

            for (const videoFile of knownVideos) {
                try {
                    const response = await fetch(`./videos/${videoFile}`, { method: 'HEAD' });
                    if (response.ok) {
                        const videoItem = this.createVideoItem(videoFile);
                        videosList.appendChild(videoItem);
                    }
                } catch (e) {
                    console.log(`Video ${videoFile} not available`);
                }
            }

        } catch (error) {
            console.error('Error loading server videos:', error);
            videosList.innerHTML = '<div style="color: #64748b; font-size: 12px; text-align: center; padding: 20px;">No videos available</div>';
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
        const parts = filename.replace('.mp4', '').split('_');

        return {
            brand: parts[0] || 'Unknown',
            campaign: parts[1] || 'Campaign',
            year: parts[2] || '',
            category: parts[3] || '',
            region: parts[4] || '',
            audience: parts[5] || '',
            description: `${parts[2] || ''} ${parts[3] || ''} campaign for ${parts[5] || ''} audience`
        };
    }

    handleVideoUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('video/')) {
            const url = URL.createObjectURL(file);
            const metadata = {
                brand: 'Custom',
                campaign: file.name.replace(/\.[^/.]+$/, ""),
                description: 'Uploaded video file'
            };
            this.loadVideo(url, metadata);
        }
    }

    loadVideo(videoPath, metadata) {
        this.currentVideo = { path: videoPath, metadata };

        const videoPlayer = document.getElementById('insightsVideoPlayer');
        if (videoPlayer) {
            videoPlayer.src = videoPath;
            videoPlayer.load();

            videoPlayer.addEventListener('loadedmetadata', () => {
                this.showVideoPlayer();
                if (this.currentMatrixId) {
                    this.showCaptureControls();
                }

                if (window.showToast) {
                    window.showToast(`Video "${metadata.brand} - ${metadata.campaign}" loaded`, 'success');
                }
            }, { once: true });
        }

        console.log('🎬 Video loaded:', metadata);
    }

    showVideoPlayer() {
        const videoPlayerSection = document.getElementById('insightsVideoPlayerSection');
        if (videoPlayerSection) {
            videoPlayerSection.style.display = 'block';
        }
    }

    hideVideoPlayer() {
        const videoPlayerSection = document.getElementById('insightsVideoPlayerSection');
        if (videoPlayerSection) {
            videoPlayerSection.style.display = 'none';
        }
    }

    generateCaptureButtons(matrixId) {
        const matrixElement = document.querySelector(`[data-element-id="${matrixId}"]`);
        if (!matrixElement) {
            console.warn('Matrix not found:', matrixId);
            return;
        }

        const table = matrixElement.querySelector('table');
        if (!table) {
            console.warn('Matrix table not found');
            return;
        }

        const rows = table.querySelectorAll('tr');
        const captureGrid = document.getElementById('insightsCaptureGrid');

        if (!captureGrid) return;

        captureGrid.innerHTML = '';

        rows.forEach((row, index) => {
            const categoryCell = row.querySelector('.category-cell');
            let rowName = `Row ${index + 1}`;

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

            const captureBtn = this.createCaptureButton(rowName, index);
            captureGrid.appendChild(captureBtn);
        });

        console.log(`🎯 Generated ${rows.length} capture buttons for matrix ${matrixId}`);
    }

    createCaptureButton(rowName, rowIndex) {
        const captureBtn = document.createElement('button');
        captureBtn.className = 'capture-btn';
        captureBtn.dataset.rowIndex = rowIndex;

        captureBtn.innerHTML = `
            <div class="capture-btn-header">
                <i class="bi bi-image"></i>
                ${rowName}
            </div>
            <div class="capture-btn-desc">Click to capture and place</div>
        `;

        captureBtn.addEventListener('click', () => this.captureToRow(rowIndex));

        return captureBtn;
    }

    showCaptureControls() {
        const captureControls = document.getElementById('insightsCaptureControls');
        if (captureControls) {
            captureControls.style.display = 'block';
        }
    }

    hideCaptureControls() {
        const captureControls = document.getElementById('insightsCaptureControls');
        if (captureControls) {
            captureControls.style.display = 'none';
        }
    }

    captureToRow(rowIndex) {
        const videoPlayer = document.getElementById('insightsVideoPlayer');

        if (!videoPlayer || videoPlayer.readyState < 2) {
            if (window.showToast) {
                window.showToast('Video not ready for capture', 'error');
            }
            return;
        }

        if (!this.currentMatrixId) {
            if (window.showToast) {
                window.showToast('No matrix selected', 'error');
            }
            return;
        }

        // Find the button to show capture animation
        const captureBtn = document.querySelector(`[data-row-index="${rowIndex}"]`);
        if (captureBtn) {
            captureBtn.classList.add('capturing');
            setTimeout(() => captureBtn.classList.remove('capturing'), 1500);
        }

        // Capture current frame
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;

        ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/png');

        // Place image in matrix
        this.placeImageInMatrix(this.currentMatrixId, rowIndex, dataURL);

        if (window.showToast) {
            window.showToast(`Frame captured to row ${rowIndex + 1}!`, 'success');
        }

        console.log('🎯 Frame captured to row:', rowIndex);
    }

    placeImageInMatrix(matrixId, rowIndex, imageData) {
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

        if (window.branvaImageManipulation) {
            window.branvaImageManipulation.updateImagePlaceholder(imagePlaceholder, imageData, matrixId);
        } else {
            this.updateImagePlaceholderFallback(imagePlaceholder, imageData);
        }

        const imageKey = `row-${rowIndex}`;
        if (window.branvaImageData) {
            window.branvaImageData.storeImage(matrixId, imageKey, {
                src: imageData,
                originalSrc: imageData,
                rowIndex: rowIndex,
                columnIndex: 1,
                capturedAt: new Date().toISOString(),
                mode: 'fit',
                videoMetadata: this.currentVideo?.metadata
            });
        }

        console.log('🖼️ Image placed in matrix:', { matrixId, rowIndex });
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
        placeholder.classList.add('has-image');
    }
}

// Initialize and make globally available
window.BranvaInsightsDrawer = BranvaInsightsDrawer;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.branvaInsightsDrawer = new BranvaInsightsDrawer();
    console.log('🎯 Branva Insights Drawer initialized');
});