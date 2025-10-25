// Branva Video Selection Modal - Adapted for multi-matrix support
class BranvaVideoModal {
    constructor() {
        this.modal = null;
        this.currentMatrixId = null;
        this.onFrameCaptured = null; // Callback for when frame is captured
        this.init();
    }

    init() {
        this.createModalHTML();
        this.setupEventListeners();
    }

    createModalHTML() {
        let modal = document.getElementById('branvaVideoModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'branvaVideoModal';
            modal.className = 'crop-modal';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="crop-container" style="max-width: 900px; max-height: 85vh; overflow-y: auto;">
                <!-- Header -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <i class="bi bi-play-circle" style="color: white; font-size: 18px;"></i>
                        </div>
                        <div>
                            <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #1e293b;">Video Analysis</h2>
                            <p style="margin: 0; font-size: 14px; color: #64748b;" id="matrixInfo">Select video to capture frames for matrix analysis</p>
                        </div>
                    </div>
                    <button id="closeBranvaVideoModal" style="width: 32px; height: 32px; border: none; background: #f1f5f9; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
                        <i class="bi bi-x" style="font-size: 18px; color: #64748b;"></i>
                    </button>
                </div>

                <!-- Current Matrix Info -->
                <div id="currentMatrixInfo" style="background: #f0f9ff; border-radius: 12px; padding: 16px; border: 1px solid #bae6fd; margin-bottom: 24px; display: none;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <i class="bi bi-grid-3x3" style="color: #0284c7; font-size: 16px;"></i>
                        <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #0284c7;">Current Matrix</h4>
                    </div>
                    <p id="matrixDetails" style="margin: 0; font-size: 12px; color: #0369a1;"></p>
                </div>

                <!-- Upload Section -->
                <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                        <i class="bi bi-upload" style="color: #10b981; font-size: 16px;"></i>
                        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b;">Upload from Computer</h3>
                    </div>
                    <input type="file" id="branvaVideoInput" accept="video/*" style="display: none;">
                    <button id="branvaUploadBtn" style="width: 100%; padding: 12px; border: 1px dashed #cbd5e1; background: white; color: #64748b; border-radius: 8px; font-size: 14px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <i class="bi bi-cloud-upload" style="font-size: 16px;"></i>
                        Choose Video File
                    </button>
                </div>

                <!-- Available Videos Section -->
                <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                        <i class="bi bi-collection-play" style="color: #3b82f6; font-size: 16px;"></i>
                        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b;">Available Videos</h3>
                    </div>
                    <div id="branvaVideosList" style="display: grid; gap: 12px;">
                        <!-- Loading state -->
                        <div id="branvaVideosLoading" style="text-align: center; padding: 40px; color: #64748b;">
                            <i class="bi bi-hourglass-split" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                            Loading videos...
                        </div>
                    </div>
                </div>

                <!-- Video Player Section (hidden initially) -->
                <div id="videoPlayerSection" style="background: white; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-top: 24px; display: none;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                        <i class="bi bi-camera-video" style="color: #8b5cf6; font-size: 16px;"></i>
                        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b;">Video Player</h3>
                    </div>
                    <video id="branvaVideoPlayer" controls style="width: 100%; max-height: 300px; border-radius: 8px; background: #000;">
                        <source src="" type="video/mp4">
                        Your browser does not support the video tag.
                    </video>
                    <div style="margin-top: 12px; text-align: center;">
                        <button id="captureFrameBtn" style="padding: 10px 20px; background: #8b5cf6; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 8px;">
                            <i class="bi bi-camera"></i>
                            Capture Current Frame
                        </button>
                    </div>
                </div>

                <!-- Column Selection Section (hidden initially) -->
                <div id="columnSelectionSection" style="background: #fefce8; border-radius: 12px; padding: 20px; border: 1px solid #fde047; margin-top: 24px; display: none;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                        <i class="bi bi-grid" style="color: #ca8a04; font-size: 16px;"></i>
                        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #a16207;">Select Matrix Column</h3>
                    </div>
                    <p style="margin: 0 0 16px 0; font-size: 14px; color: #a16207;">Choose which column to place the captured frame:</p>
                    <div id="matrixColumnsGrid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
                        <!-- Column buttons will be populated here -->
                    </div>
                </div>
            </div>
        `;

        this.modal = modal;
    }

    setupEventListeners() {
        // Close modal
        document.getElementById('closeBranvaVideoModal').addEventListener('click', () => {
            this.close();
        });

        // Upload button
        document.getElementById('branvaUploadBtn').addEventListener('click', () => {
            document.getElementById('branvaVideoInput').click();
        });

        // Handle video upload
        document.getElementById('branvaVideoInput').addEventListener('change', (e) => {
            this.handleVideoUpload(e);
        });

        // Capture frame button
        document.getElementById('captureFrameBtn').addEventListener('click', () => {
            this.captureCurrentFrame();
        });
    }

    open(matrixId = null) {
        this.currentMatrixId = matrixId;
        this.updateMatrixInfo();
        this.modal.classList.add('show');
        this.loadServerVideos();

        // console.log('🎬 BRANVA VIDEO MODAL OPENED:', { matrixId });
    }

    close() {
        this.modal.classList.remove('show');
        // Hide video player and column selection
        document.getElementById('videoPlayerSection').style.display = 'none';
        document.getElementById('columnSelectionSection').style.display = 'none';
    }

    updateMatrixInfo() {
        const matrixInfo = document.getElementById('currentMatrixInfo');
        const matrixDetails = document.getElementById('matrixDetails');

        if (this.currentMatrixId) {
            // Get matrix information from Branva canvas
            const matrixElement = document.querySelector(`[data-element-id="${this.currentMatrixId}"]`);
            if (matrixElement) {
                const matrix = this.getMatrixInfo(matrixElement);
                matrixInfo.style.display = 'block';
                matrixDetails.textContent = `${matrix.name} (${matrix.rows}x${matrix.columns}) - Ready for video analysis`;
            }
        } else {
            matrixInfo.style.display = 'none';
        }
    }

    getMatrixInfo(matrixElement) {
        // Extract matrix information from the DOM element
        const table = matrixElement.querySelector('table');
        const rows = table ? table.querySelectorAll('tr').length : 0;
        const columns = table && table.querySelector('tr') ? table.querySelector('tr').querySelectorAll('td').length : 0;

        return {
            name: 'Strategy Matrix',
            rows: rows,
            columns: columns
        };
    }

    handleVideoUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const videoPlayer = document.getElementById('branvaVideoPlayer');
            const url = URL.createObjectURL(file);
            videoPlayer.src = url;
            this.showVideoPlayer();
            Utils.showStatus(`Video "${file.name}" loaded successfully!`, 'success');
        }
    }

    showVideoPlayer() {
        document.getElementById('videoPlayerSection').style.display = 'block';
        // Scroll to video player
        document.getElementById('videoPlayerSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    captureCurrentFrame() {
        const video = document.getElementById('branvaVideoPlayer');

        if (video.videoWidth === 0 || video.videoHeight === 0) {
            Utils.showStatus('Please load and play the video first', 'warning');
            return;
        }

        // Create canvas to capture frame
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataURL = canvas.toDataURL('image/png');

        // Store captured frame
        this.capturedFrame = dataURL;

        // Show column selection
        this.showColumnSelection();

        Utils.showStatus('Frame captured! Select a column to place the image.', 'success');
    }

    showColumnSelection() {
        if (!this.currentMatrixId) {
            Utils.showStatus('No matrix selected', 'error');
            return;
        }

        const matrixElement = document.querySelector(`[data-element-id="${this.currentMatrixId}"]`);
        if (!matrixElement) {
            Utils.showStatus('Matrix not found', 'error');
            return;
        }

        const columnHeaders = this.getMatrixColumns(matrixElement);
        const columnsGrid = document.getElementById('matrixColumnsGrid');

        // Clear existing columns
        columnsGrid.innerHTML = '';

        // Create column buttons - focus on image column and provide row selection
        columnHeaders.forEach((header, index) => {
            // Skip first column (category headers) - start from column 1
            if (index === 0) return;

            const columnBtn = document.createElement('button');

            // Special handling for image column
            if (index === 1) {
                columnBtn.innerHTML = `
                    <div style="font-weight: 600; font-size: 14px; color: white; margin-bottom: 4px;">
                        <i class="bi bi-image" style="margin-right: 6px;"></i>
                        ${header}
                    </div>
                    <div style="font-size: 11px; color: rgba(255,255,255,0.8);">Click to select rows</div>
                `;
                columnBtn.style.cssText = `
                    padding: 12px;
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                    border: 2px solid #8b5cf6;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: center;
                    color: white;
                `;
            } else {
                columnBtn.innerHTML = `
                    <div style="font-weight: 600; font-size: 14px; color: #1e293b; margin-bottom: 4px;">${header}</div>
                    <div style="font-size: 11px; color: #64748b;">Text Column ${index - 1}</div>
                `;
                columnBtn.style.cssText = `
                    padding: 12px;
                    background: white;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: center;
                `;
            }

            columnBtn.addEventListener('mouseenter', () => {
                if (index === 1) {
                    columnBtn.style.background = 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)';
                } else {
                    columnBtn.style.borderColor = '#8b5cf6';
                    columnBtn.style.backgroundColor = '#f3f4f6';
                }
            });

            columnBtn.addEventListener('mouseleave', () => {
                if (index === 1) {
                    columnBtn.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
                } else {
                    columnBtn.style.borderColor = '#e2e8f0';
                    columnBtn.style.backgroundColor = 'white';
                }
            });

            columnBtn.addEventListener('click', () => {
                this.selectColumn(index);
            });

            columnsGrid.appendChild(columnBtn);
        });

        document.getElementById('columnSelectionSection').style.display = 'block';
        document.getElementById('columnSelectionSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    getMatrixColumns(matrixElement) {
        const table = matrixElement.querySelector('table');
        if (!table) return [];

        const firstRow = table.querySelector('tr');
        if (!firstRow) return [];

        const headers = [];
        const cells = firstRow.querySelectorAll('td');

        cells.forEach((cell, index) => {
            if (index === 0) {
                // First column is category/row headers
                headers.push('Category Headers');
            } else if (index === 1) {
                // Second column is images
                headers.push('Image Column');
            } else {
                // Text columns - extract meaningful content
                const textDiv = cell.querySelector('div:last-child');
                let columnName = '';

                if (textDiv) {
                    columnName = textDiv.textContent?.trim() || '';
                }

                // Fallback to cell content if no specific div found
                if (!columnName) {
                    columnName = cell.textContent?.trim() || '';
                    // Clean up the text by removing icon classes and extra whitespace
                    columnName = columnName.replace(/\s+/g, ' ').trim();
                }

                // Use column number as fallback
                if (!columnName || columnName.length === 0) {
                    columnName = `Text Column ${index - 1}`;
                }

                headers.push(columnName);
            }
        });

        return headers;
    }

    selectColumn(columnIndex) {
        if (!this.capturedFrame || !this.currentMatrixId) {
            Utils.showStatus('No frame captured or matrix selected', 'error');
            return;
        }

        // If image column selected (index 1), show row selection
        if (columnIndex === 1) {
            this.showRowSelection();
            return;
        }

        console.log('🎯 COLUMN SELECTED:', { matrixId: this.currentMatrixId, columnIndex, frame: this.capturedFrame.substring(0, 50) + '...' });

        // Trigger callback if provided
        if (this.onFrameCaptured) {
            this.onFrameCaptured({
                matrixId: this.currentMatrixId,
                columnIndex: columnIndex,
                imageData: this.capturedFrame
            });
        }

        // Store in Branva image system
        this.storeCapturedImage(this.currentMatrixId, columnIndex, this.capturedFrame);

        Utils.showStatus(`Image placed in column ${columnIndex}!`, 'success');
        this.close();
    }

    showRowSelection() {
        const matrixElement = document.querySelector(`[data-element-id="${this.currentMatrixId}"]`);
        if (!matrixElement) {
            Utils.showStatus('Matrix not found', 'error');
            return;
        }

        const table = matrixElement.querySelector('table');
        if (!table) {
            Utils.showStatus('Matrix table not found', 'error');
            return;
        }

        const rows = table.querySelectorAll('tr');
        const columnsGrid = document.getElementById('matrixColumnsGrid');

        // Update section title
        const sectionTitle = document.querySelector('#columnSelectionSection h3');
        if (sectionTitle) {
            sectionTitle.innerHTML = '<i class="bi bi-target" style="color: #ca8a04; font-size: 16px;"></i> Select Row for Image';
        }

        // Clear existing columns and show row selection
        columnsGrid.innerHTML = '';

        rows.forEach((row, index) => {
            const categoryCell = row.querySelector('.category-cell');
            let rowName = `Row ${index + 1}`;

            if (categoryCell) {
                const textContent = categoryCell.textContent?.trim();
                if (textContent && textContent !== `ROW ${index + 1}`) {
                    rowName = textContent;
                }
            }

            const rowBtn = document.createElement('button');
            rowBtn.innerHTML = `
                <div style="font-weight: 600; font-size: 14px; color: #1e293b; margin-bottom: 4px;">
                    <i class="bi bi-image" style="margin-right: 6px; color: #8b5cf6;"></i>
                    ${rowName}
                </div>
                <div style="font-size: 11px; color: #64748b;">Place image here</div>
            `;
            rowBtn.style.cssText = `
                padding: 12px;
                background: white;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: center;
            `;

            rowBtn.addEventListener('mouseenter', () => {
                rowBtn.style.borderColor = '#8b5cf6';
                rowBtn.style.backgroundColor = '#f3f4f6';
            });

            rowBtn.addEventListener('mouseleave', () => {
                rowBtn.style.borderColor = '#e2e8f0';
                rowBtn.style.backgroundColor = 'white';
            });

            rowBtn.addEventListener('click', () => {
                this.selectRow(index);
            });

            columnsGrid.appendChild(rowBtn);
        });

        Utils.showStatus('Select which row to place the captured image', 'info');
    }

    selectRow(rowIndex) {
        if (!this.capturedFrame || !this.currentMatrixId) {
            Utils.showStatus('No frame captured or matrix selected', 'error');
            return;
        }

        console.log('🎯 ROW SELECTED:', { matrixId: this.currentMatrixId, rowIndex, frame: this.capturedFrame.substring(0, 50) + '...' });

        // Place image in the image column of the selected row
        this.placeImageInMatrix(this.currentMatrixId, rowIndex, this.capturedFrame);

        Utils.showStatus(`Image placed in row ${rowIndex + 1}!`, 'success');
        this.close();
    }

    storeCapturedImage(matrixId, columnIndex, imageData) {
        // Initialize Branva image storage if not exists
        if (!window.branvaImageData) {
            window.branvaImageData = {
                matrices: {},
                currentMatrixId: null
            };
        }

        // Initialize matrix storage if not exists
        if (!window.branvaImageData.matrices[matrixId]) {
            window.branvaImageData.matrices[matrixId] = {
                id: matrixId,
                images: {}
            };
        }

        // Store the image with column mapping
        const imageKey = `col-${columnIndex}`;
        window.branvaImageData.matrices[matrixId].images[imageKey] = {
            src: imageData,
            columnIndex: columnIndex,
            capturedAt: new Date().toISOString(),
            mode: 'fit', // Default mode
            position: { x: 0, y: 0 } // Default position
        };

        console.log('💾 IMAGE STORED:', { matrixId, columnIndex, imageKey });
    }

    placeImageInMatrix(matrixId, rowIndex, imageData) {
        // Find the matrix element in the DOM
        const matrixElement = document.querySelector(`[data-element-id="${matrixId}"]`);
        if (!matrixElement) {
            Utils.showStatus('Matrix not found in DOM', 'error');
            return;
        }

        const table = matrixElement.querySelector('table');
        if (!table) {
            Utils.showStatus('Matrix table not found', 'error');
            return;
        }

        // Find the specific row and image cell
        const rows = table.querySelectorAll('tr');
        if (rowIndex >= rows.length) {
            Utils.showStatus('Row index out of range', 'error');
            return;
        }

        const targetRow = rows[rowIndex];
        const imagePlaceholder = targetRow.querySelector('.image-placeholder');

        if (!imagePlaceholder) {
            Utils.showStatus('Image placeholder not found in row', 'error');
            return;
        }

        // Use the image manipulation module to update the placeholder
        if (window.branvaImageManipulation) {
            window.branvaImageManipulation.updateImagePlaceholder(imagePlaceholder, imageData, matrixId);
        } else {
            // Fallback implementation if manipulation module not available
            this.updateImagePlaceholderFallback(imagePlaceholder, imageData);
        }

        // Store in Branva storage system
        const imageKey = `row-${rowIndex}`;
        window.branvaImageData.storeImage(matrixId, imageKey, {
            src: imageData,
            originalSrc: imageData,
            rowIndex: rowIndex,
            columnIndex: 1, // Image column
            capturedAt: new Date().toISOString(),
            mode: 'fit'
        });

        console.log('🎯 IMAGE PLACED IN MATRIX:', { matrixId, rowIndex, imageKey });
    }

    updateImagePlaceholderFallback(placeholder, dataURL) {
        // Simple fallback if branvaImageManipulation is not available
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

    // Reuse existing video loading logic from original
    async loadServerVideos() {
        const serverVideosList = document.getElementById('branvaVideosList');
        const videosLoading = document.getElementById('branvaVideosLoading');

        if (!serverVideosList) return;

        // Show loading state
        if (videosLoading) {
            videosLoading.style.display = 'block';
        }

        try {
            // Get video files from the list
            const videoFilenames = await this.getVideoFileList();
            const videos = [];

            // Process each video file
            for (const filename of videoFilenames) {
                try {
                    const videoPath = `./videos/${filename}`;
                    const metadata = this.parseVideoMetadata(filename);
                    const duration = await this.getVideoDuration(videoPath);

                    videos.push({
                        ...metadata,
                        duration: duration,
                        path: videoPath
                    });
                } catch (error) {
                    console.warn(`Could not process ${filename}:`, error);
                }
            }

            // Hide loading state
            if (videosLoading) {
                videosLoading.style.display = 'none';
            }

            if (videos.length === 0) {
                serverVideosList.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #64748b;">
                        <i class="bi bi-camera-video" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                        No videos available.<br><br>
                        <small style="color: #94a3b8;">Add video files to ./videos/ folder</small>
                    </div>
                `;
                return;
            }

            // Clear and populate videos
            serverVideosList.innerHTML = '';
            videos.forEach((video) => {
                const videoItem = this.createVideoItem(video);
                serverVideosList.appendChild(videoItem);
            });

        } catch (error) {
            console.error('Error loading videos:', error);
            if (videosLoading) {
                videosLoading.style.display = 'none';
            }
            serverVideosList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #dc2626;">
                    <i class="bi bi-exclamation-triangle" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                    Error loading videos
                </div>
            `;
        }
    }

    // Copy remaining methods from original video-modal.js
    async getVideoFileList() {
        try {
            const knownVideos = [
                'Apple_iPhone15_2023_Tech_Global_YoungAdults.mp4',
                'CocaCola_ShareACoke_2024_Beverage_UK_Teens.mp4',
                'Nike_JustDoIt_2024_Sports_US_Athlete.mp4'
            ];

            const availableVideos = [];
            for (const video of knownVideos) {
                try {
                    const response = await fetch(`./videos/${video}`, { method: 'HEAD' });
                    if (response.ok) {
                        availableVideos.push(video);
                    }
                } catch (e) {
                    console.log(`Video ${video} not found`);
                }
            }

            return availableVideos;
        } catch (error) {
            console.error('Could not load video list:', error);
            return [];
        }
    }

    parseVideoMetadata(filename) {
        try {
            const nameWithoutExt = filename.replace('.mp4', '');
            const parts = nameWithoutExt.split('_');

            if (parts.length !== 6) {
                return {
                    filename: filename,
                    brand: 'Unknown',
                    campaign: 'Unknown',
                    year: 'Unknown',
                    industry: 'Unknown',
                    country: 'Unknown',
                    target: 'Unknown'
                };
            }

            const [brandName, campaignName, year, industry, country, target] = parts;

            return {
                filename: filename,
                brand: brandName,
                campaign: campaignName,
                year: year,
                industry: industry,
                country: country,
                target: target,
                displayName: `${brandName} - ${campaignName}`,
                description: `${year} ${industry} campaign targeting ${target} in ${country}`
            };
        } catch (error) {
            console.error(`Error parsing video metadata for ${filename}:`, error);
            return {
                filename: filename,
                brand: 'Unknown',
                campaign: 'Unknown',
                year: 'Unknown',
                industry: 'Unknown',
                country: 'Unknown',
                target: 'Unknown'
            };
        }
    }

    getVideoDuration(videoSrc) {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                const duration = video.duration;
                const minutes = Math.floor(duration / 60);
                const seconds = Math.floor(duration % 60);
                resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
            };
            video.onerror = () => resolve('--:--');
            video.src = videoSrc;
        });
    }

    createVideoItem(video) {
        const videoItem = document.createElement('div');
        videoItem.style.cssText = `
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 12px;
        `;

        // Create thumbnail and info (reuse logic from original)
        videoItem.innerHTML = `
            <div style="width: 80px; height: 60px; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center; position: relative;">
                <i class="bi bi-play-fill" style="color: white; font-size: 24px;"></i>
            </div>
            <div style="flex: 1;">
                <div style="font-weight: 600; color: #1e293b; margin-bottom: 6px; font-size: 14px;">
                    ${video.brand} - ${video.campaign}
                </div>
                <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">
                    ${video.description}
                </div>
                <div style="font-size: 11px; color: #94a3b8;">
                    ${video.duration} • Click to load
                </div>
            </div>
        `;

        // Add click handler
        videoItem.addEventListener('click', () => {
            const videoPlayer = document.getElementById('branvaVideoPlayer');
            videoPlayer.src = video.path;
            this.showVideoPlayer();
            Utils.showStatus(`Video "${video.brand} - ${video.campaign}" loaded!`, 'success');
        });

        // Add hover effects
        videoItem.addEventListener('mouseenter', () => {
            videoItem.style.borderColor = '#8b5cf6';
            videoItem.style.transform = 'translateY(-2px)';
        });

        videoItem.addEventListener('mouseleave', () => {
            videoItem.style.borderColor = '#e2e8f0';
            videoItem.style.transform = 'translateY(0)';
        });

        return videoItem;
    }
}

// Make it globally available
window.BranvaVideoModal = BranvaVideoModal;

// console.log('🎬 Branva Video Modal class loaded');