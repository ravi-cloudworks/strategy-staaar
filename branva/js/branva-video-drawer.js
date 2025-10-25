// Branva Video Analysis Drawer Controller
class BranvaVideoDrawer {
    constructor() {
        this.drawer = null;
        this.isOpen = false;
        this.currentMatrixId = null;
        this.currentVideo = null;
        this.init();
    }

    init() {
        this.drawer = document.getElementById('videoDrawer');
        this.setupEventListeners();
        this.loadServerVideos();

        // Ensure drawer starts closed
        this.ensureDrawerClosed();
    }

    ensureDrawerClosed() {
        if (this.drawer) {
            this.drawer.classList.remove('open');
            this.isOpen = false;

            // Ensure canvas area doesn't have drawer margin
            const canvasArea = document.getElementById('canvasArea');
            if (canvasArea) {
                canvasArea.classList.remove('with-drawer');
            }
        }
    }

    setupEventListeners() {
        // Close drawer button
        const closeBtn = document.getElementById('closeVideoDrawer');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Upload video button
        const uploadBtn = document.getElementById('drawerUploadBtn');
        const videoInput = document.getElementById('drawerVideoInput');

        if (uploadBtn && videoInput) {
            uploadBtn.addEventListener('click', () => videoInput.click());
            videoInput.addEventListener('change', (e) => this.handleVideoUpload(e));
        }
    }

    open(matrixId = null) {
        this.currentMatrixId = matrixId;

        // Show drawer
        this.drawer.classList.add('open');

        // Shift canvas area
        const canvasArea = document.getElementById('canvasArea');
        if (canvasArea) {
            canvasArea.classList.add('with-drawer');
        }

        this.isOpen = true;

        // Generate row buttons if matrix is provided
        if (matrixId) {
            this.generateRowButtons(matrixId);
        }

        // Show success message
        if (window.showToast) {
            // window.showToast('Video analysis drawer opened', 'success');
        }

        // console.log('🎬 Video drawer opened for matrix:', matrixId);
    }

    close() {
        // Hide drawer
        this.drawer.classList.remove('open');

        // Reset canvas area
        const canvasArea = document.getElementById('canvasArea');
        if (canvasArea) {
            canvasArea.classList.remove('with-drawer');
        }

        this.isOpen = false;
        this.currentMatrixId = null;

        // Hide video player and row buttons
        this.hideVideoPlayer();
        this.hideRowButtons();

        // console.log('🎬 Video drawer closed');
    }

    async loadServerVideos() {
        const videosList = document.getElementById('drawerVideosList');
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
                    // Check if video exists
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
        // Parse filename format: Brand_Campaign_Year_Category_Region_Audience.mp4
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

        const videoPlayer = document.getElementById('drawerVideoPlayer');
        if (videoPlayer) {
            videoPlayer.src = videoPath;
            videoPlayer.load();

            videoPlayer.addEventListener('loadedmetadata', () => {
                this.showVideoPlayer();
                if (this.currentMatrixId) {
                    this.showRowButtons();
                }

                if (window.showToast) {
                    window.showToast(`Video "${metadata.brand} - ${metadata.campaign}" loaded`, 'success');
                }
            }, { once: true });
        }

        // console.log('🎬 Video loaded:', metadata);
    }

    showVideoPlayer() {
        const videoPlayerSection = document.getElementById('drawerVideoPlayerSection');
        if (videoPlayerSection) {
            videoPlayerSection.style.display = 'block';
        }
    }

    hideVideoPlayer() {
        const videoPlayerSection = document.getElementById('drawerVideoPlayerSection');
        if (videoPlayerSection) {
            videoPlayerSection.style.display = 'none';
        }
    }

    generateRowButtons(matrixId) {
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
        const rowButtonsGrid = document.getElementById('rowButtonsGrid');

        if (!rowButtonsGrid) return;

        // Clear existing buttons
        rowButtonsGrid.innerHTML = '';

        rows.forEach((row, index) => {
            const categoryCell = row.querySelector('.category-cell');
            let rowName = `Row ${index + 1}`;

            // Extract row header text
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

            const rowBtn = this.createRowButton(rowName, index);
            rowButtonsGrid.appendChild(rowBtn);
        });

        // console.log(`🎯 Generated ${rows.length} row buttons for matrix ${matrixId}`);
    }

    createRowButton(rowName, rowIndex) {
        const rowBtn = document.createElement('button');
        rowBtn.className = 'row-btn';
        rowBtn.dataset.rowIndex = rowIndex;

        rowBtn.innerHTML = `
            <div class="row-btn-header">
                <i class="bi bi-image"></i>
                ${rowName}
            </div>
            <div class="row-btn-desc">Click to capture and place</div>
        `;

        rowBtn.addEventListener('click', () => this.captureToRow(rowIndex));

        return rowBtn;
    }

    showRowButtons() {
        const rowButtonsSection = document.getElementById('drawerRowButtons');
        if (rowButtonsSection) {
            rowButtonsSection.style.display = 'block';
        }
    }

    hideRowButtons() {
        const rowButtonsSection = document.getElementById('drawerRowButtons');
        if (rowButtonsSection) {
            rowButtonsSection.style.display = 'none';
        }
    }

    captureToRow(rowIndex) {
        const videoPlayer = document.getElementById('drawerVideoPlayer');

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
        const rowBtn = document.querySelector(`[data-row-index="${rowIndex}"]`);
        if (rowBtn) {
            rowBtn.classList.add('capturing');
            setTimeout(() => rowBtn.classList.remove('capturing'), 1500);
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

        // Show success feedback
        if (window.showToast) {
            window.showToast(`Frame captured to row ${rowIndex + 1}!`, 'success');
        }

        console.log('🎯 Frame captured to row:', rowIndex);
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
window.BranvaVideoDrawer = BranvaVideoDrawer;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.branvaVideoDrawer = new BranvaVideoDrawer();
    // console.log('🎬 Branva Video Drawer initialized');
});