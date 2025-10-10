// McKinsey-Style Presentation Download Modal
import { HtmlGenerator } from './html-generator.js';

export class DownloadModal {
    constructor() {
        this.modal = null;
        this.currentSlide = 0;
        this.slides = [];
        this.videoData = null;
        this.tableData = null;
        this.isClosing = false; // Flag to prevent fullscreen event loops
        this.htmlGenerator = new HtmlGenerator();
        this.init();
    }

    init() {
        this.createModalHTML();
        this.setupEventListeners();
    }

    createModalHTML() {
        let modal = document.getElementById('downloadModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'downloadModal';
            modal.className = 'crop-modal';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="presentation-container">
                <!-- Presentation Header -->
                <div class="presentation-header">
                    <div class="header-left">
                        <div class="logo-section">
                            <div class="mckinsey-logo">STRATEGY STAAAR</div>
                            <div class="subtitle">Strategic Insight Presentation</div>
                        </div>
                    </div>
                    <div class="header-right">
                        <div class="slide-counter">
                            <span id="currentSlideNum">1</span> / <span id="totalSlides">5</span>
                        </div>
                        <button class="header-btn" id="closeDownloadModal">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>
                </div>

                <!-- Presentation Content Area -->
                <div class="presentation-content">
                    <div class="slides-container" id="slidesContainer">
                        <!-- Slides will be dynamically generated -->
                    </div>
                </div>

                <!-- Presentation Navigation -->
                <div class="presentation-nav">
                    <div class="nav-left">
                        <button class="nav-btn secondary" id="prevSlide" disabled>
                            <i class="bi bi-chevron-left"></i>
                            Previous
                        </button>
                    </div>

                    <div class="nav-center">
                        <div class="slide-indicators" id="slideIndicators">
                            <!-- Indicators will be generated dynamically -->
                        </div>
                    </div>

                    <div class="nav-right">
                        <button class="nav-btn secondary" id="nextSlide">
                            Next
                            <i class="bi bi-chevron-right"></i>
                        </button>
                        <button class="nav-btn primary" id="downloadHTML">
                            <i class="bi bi-download"></i>
                            Download HTML Presentation
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.modal = modal;
    }

    setupEventListeners() {
        // Close modal
        document.getElementById('closeDownloadModal').addEventListener('click', () => {
            this.close();
        });

        // Navigation
        document.getElementById('prevSlide').addEventListener('click', () => {
            this.previousSlide();
        });

        document.getElementById('nextSlide').addEventListener('click', () => {
            this.nextSlide();
        });

        // Download HTML Presentation
        document.getElementById('downloadHTML').addEventListener('click', () => {
            this.downloadHtmlPresentation();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('show')) return;

            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === 'Escape') this.close();
        });

        // Listen for fullscreen change events
        this.setupFullscreenListeners();
    }

    setupFullscreenListeners() {
        // Listen for fullscreen change events (cross-browser)
        const fullscreenEvents = [
            'fullscreenchange',
            'webkitfullscreenchange', // Safari
            'mozfullscreenchange',    // Firefox
            'msfullscreenchange'      // IE/Edge
        ];

        fullscreenEvents.forEach(event => {
            document.addEventListener(event, () => {
                // If fullscreen was exited and modal is still open, close the modal
                const isFullscreen = !!(document.fullscreenElement ||
                                       document.webkitFullscreenElement ||
                                       document.mozFullScreenElement ||
                                       document.msFullscreenElement);

                if (!isFullscreen && this.modal.classList.contains('show') && !this.isClosing) {
                    this.close();
                }
            });
        });
    }

    open() {
        console.log(`📋 [MODAL] OPENING: ${this.slides ? this.slides.length : 0} slides exist from previous session`);
        if (this.slides && this.slides.length > 0) {
            this.slides.forEach((slide, index) => {
                console.log(`   Previous Slide ${index}: ${slide.type} - ${slide.title}`);
            });
        }

        this.modal.classList.add('show');
        this.collectData();

        // Check if we have existing slides with optional pages
        const hadOptionalPages = this.slides && this.slides.length > 0 &&
                                this.slides.some(slide => slide.type.startsWith('survey-insights') || slide.type === 'mckinsey-2x2');

        console.log(`📋 [MODAL] Had optional pages from previous session: ${hadOptionalPages}`);

        this.generateSlides();

        console.log(`📋 [MODAL] After generateSlides: ${this.slides.length} slides`);
        this.slides.forEach((slide, index) => {
            console.log(`   New Slide ${index}: ${slide.type} - ${slide.title}`);
        });

        this.currentSlide = 0;
        this.showSlide(0);

        // Enter fullscreen mode
        this.enterFullscreen();
    }

    enterFullscreen() {
        const elem = document.documentElement;

        // Cross-browser fullscreen support
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) { // Safari
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) { // IE/Edge
            elem.msRequestFullscreen();
        }
    }

    exitFullscreen() {
        // Check if document is actually in fullscreen mode first
        const isFullscreen = document.fullscreenElement ||
                            document.webkitFullscreenElement ||
                            document.mozFullScreenElement ||
                            document.msFullscreenElement;

        if (!isFullscreen) {
            return; // Not in fullscreen mode, nothing to exit
        }

        // Cross-browser exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {
                // Ignore errors when exiting fullscreen
            });
        } else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }

    close() {
        console.log(`📋 [MODAL] CLOSING: ${this.slides.length} slides currently exist`);
        this.slides.forEach((slide, index) => {
            console.log(`   Slide ${index}: ${slide.type} - ${slide.title}`);
        });

        this.isClosing = true; // Set flag to prevent event loop

        // Hide all callouts when closing modal (but don't destroy them!)
        if (typeof window.hideAllCallouts === 'function') {
            window.hideAllCallouts();
        }

        // Don't destroy callout systems - let them persist across modal open/close cycles
        // This allows user's callouts and images to be preserved

        // Pause all videos when closing
        const allVideos = this.modal.querySelectorAll('video');
        allVideos.forEach(video => {
            if (!video.paused) {
                video.pause();
                video.currentTime = 0;
            }
        });

        this.modal.classList.remove('show');

        // Exit fullscreen mode
        this.exitFullscreen();

        // Reset flag after a short delay
        setTimeout(() => {
            this.isClosing = false;
        }, 100);
    }

    collectData() {
        // Collect video data
        this.videoData = this.getVideoData();

        // Collect table data
        this.tableData = this.getTableData();

        // Collect strategy metadata
        this.strategyData = this.getStrategyData();
    }

    getVideoData() {
        const videoPlayer = document.getElementById('videoPlayer');
        if (!videoPlayer || !videoPlayer.src) return null;

        // Extract video metadata from the current loaded video
        const videoSrc = videoPlayer.src;
        const filename = videoSrc.split('/').pop();

        // Parse filename format: BrandName_CampaignName_Year_Industry_Country_Target.mp4
        const metadata = this.parseVideoFilename(filename);

        return {
            src: videoSrc,
            filename: filename,
            ...metadata,
            thumbnail: this.generateVideoThumbnail(videoPlayer)
        };
    }

    parseVideoFilename(filename) {
        try {
            const nameWithoutExt = filename.replace('.mp4', '');
            const parts = nameWithoutExt.split('_');

            if (parts.length >= 6) {
                return {
                    brand: parts[0] || 'Unknown',
                    campaign: parts[1] || 'Unknown',
                    year: parts[2] || new Date().getFullYear().toString(),
                    industry: parts[3] || 'General',
                    country: parts[4] || 'Global',
                    target: parts[5] || 'General'
                };
            }
        } catch (error) {
            console.warn('Error parsing video filename:', error);
        }

        return {
            brand: 'Unknown',
            campaign: 'Unknown',
            year: new Date().getFullYear().toString(),
            industry: 'General',
            country: 'Global',
            target: 'General'
        };
    }

    generateVideoThumbnail(videoElement) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        try {
            // Ensure video is ready for thumbnail capture
            if (videoElement.videoWidth > 0 && videoElement.videoHeight > 0) {
                // Preserve original aspect ratio
                const aspectRatio = videoElement.videoWidth / videoElement.videoHeight;
                const maxWidth = 400;
                const maxHeight = 300;

                if (aspectRatio > 1) {
                    // Horizontal video
                    canvas.width = Math.min(maxWidth, videoElement.videoWidth);
                    canvas.height = canvas.width / aspectRatio;
                } else {
                    // Vertical video
                    canvas.height = Math.min(maxHeight, videoElement.videoHeight);
                    canvas.width = canvas.height * aspectRatio;
                }

                ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
                return {
                    dataUrl: canvas.toDataURL('image/jpeg', 0.8),
                    aspectRatio: aspectRatio,
                    isVertical: aspectRatio < 1
                };
            } else {
                // Create a placeholder if video not ready
                canvas.width = 400;
                canvas.height = 225;
                ctx.fillStyle = '#1f2937';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#ffffff';
                ctx.font = '24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('Video Preview', canvas.width/2, canvas.height/2);
                return {
                    dataUrl: canvas.toDataURL('image/jpeg', 0.8),
                    aspectRatio: 16/9,
                    isVertical: false
                };
            }
        } catch (error) {
            console.warn('Could not generate video thumbnail:', error);
            // Create fallback thumbnail
            canvas.width = 400;
            canvas.height = 225;
            ctx.fillStyle = '#1f2937';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.font = '24px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Video Preview', canvas.width/2, canvas.height/2);
            return {
                dataUrl: canvas.toDataURL('image/jpeg', 0.8),
                aspectRatio: 16/9,
                isVertical: false
            };
        }
    }

    getTableData() {
        // Try multiple selectors to find the table
        let table = document.getElementById('insightTable');
        if (!table) {
            table = document.querySelector('.insight-table');
        }
        if (!table) {
            table = document.querySelector('table');
        }

        if (!table) {
            console.error('Could not find insight table');
            return null;
        }

        // console.log('🚨 SLIDE DEBUG: Found table with', table.rows.length, 'rows');

        const rows = Array.from(table.rows);
        const data = {
            headers: [],
            rows: []
        };

        // Check if first row is actually a header (contains TH elements) or data row
        let startIndex = 0;
        let hasHeaderRow = false;

        if (rows.length > 0) {
            const firstRowCells = Array.from(rows[0].cells);
            const hasThElements = firstRowCells.some(cell => cell.tagName.toLowerCase() === 'th');

            if (hasThElements) {
                // First row is a header
                hasHeaderRow = true;
                data.headers = firstRowCells.map(cell => ({
                    text: cell.textContent.trim(),
                    icon: this.extractIconClass(cell)
                }));
                startIndex = 1; // Start data extraction from row 1
                // console.log('🚨 SLIDE DEBUG: Found header row, starting data extraction from row 1');
            } else {
                // No header row, all rows are data
                startIndex = 0; // Start data extraction from row 0
                // console.log('🚨 SLIDE DEBUG: No header row found, all rows are data');
            }
        }

        // Get data rows
        for (let i = startIndex; i < rows.length; i++) {
            const cells = Array.from(rows[i].cells);
            const rowData = cells.map(cell => ({
                text: cell.textContent.trim(),
                icon: this.extractIconClass(cell),
                image: this.extractImage(cell),
                isHeader: cell.classList.contains('category-cell')
            }));
            data.rows.push(rowData);
            // console.log(`🚨 SLIDE DEBUG: Extracted row ${i} with ${cells.length} cells`);
        }

        // console.log('🚨 SLIDE DEBUG: Extracted', data.rows.length, 'data rows from table');

        return data;
    }

    extractIconClass(cell) {
        const icon = cell.querySelector('i');
        return icon ? icon.className : '';
    }

    extractImage(cell) {
        const img = cell.querySelector('img');
        return img ? img.src : null;
    }

    getStrategyData() {
        const titleElement = document.querySelector('.main-title');
        const subtitleElement = document.querySelector('.subtitle');

        return {
            title: titleElement ? titleElement.textContent : 'Strategy Analysis',
            subtitle: subtitleElement ? subtitleElement.textContent : 'Strategic insights and recommendations'
        };
    }

    generateSlides() {
        console.log(`🔧 [MODAL] GENERATING SLIDES - this will overwrite existing slides!`);

        // Store any existing optional pages with their positions before regenerating
        const existingOptionalPagesWithPositions = this.slides ?
            this.slides.map((slide, index) => ({
                slide,
                originalPosition: index,
                isOptional: slide.type.startsWith('survey-insights') || slide.type === 'mckinsey-2x2'
            })).filter(item => item.isOptional) : [];

        console.log(`💾 [MODAL] Found ${existingOptionalPagesWithPositions.length} existing optional pages to preserve`);
        existingOptionalPagesWithPositions.forEach((item, index) => {
            console.log(`   Optional Page ${index}: ${item.slide.type} - ${item.slide.title} (was at position ${item.originalPosition})`);
        });

        this.slides = [
            this.createTitleSlide(),           // STAAAR + campaign + video thumbnail
            this.createVideoPlaySlide(),       // Actual video playback
            this.createTableSlide(),           // Exact table from index.html
            ...this.createRowSlides(),         // Each row with large image + column list
            // McKinsey 2x2 matrix now available as optional page
            this.createThankYouSlide()         // Thank you slide
        ];

        console.log(`📊 [MODAL] Generated ${this.slides.length} default slides`);

        // Re-insert the existing optional pages at their original positions
        if (existingOptionalPagesWithPositions.length > 0) {
            console.log(`🔄 [MODAL] Restoring ${existingOptionalPagesWithPositions.length} optional pages at their original positions`);

            // Sort by original position to insert in correct order
            existingOptionalPagesWithPositions.sort((a, b) => a.originalPosition - b.originalPosition);

            // Insert each page back at its original position (or as close as possible)
            existingOptionalPagesWithPositions.forEach((item, index) => {
                const targetPosition = Math.min(item.originalPosition, this.slides.length - 1); // Don't go past thank you slide
                this.slides.splice(targetPosition, 0, item.slide);
                console.log(`   ↪️ Restored ${item.slide.type} at position ${targetPosition} (was ${item.originalPosition})`);
            });

            console.log(`✅ [MODAL] Restored optional pages. Total slides now: ${this.slides.length}`);
        }

        this.renderSlides();
        this.updateSlideIndicators();
    }

    createTitleSlide() {
        return {
            type: 'title',
            title: this.strategyData.title,
            content: `
                <div class="title-slide">
                    <div class="title-main">
                        <div class="title-left">
                            <h1 class="staaar-title">${this.videoData.campaign}</h1>
                            ${this.videoData ? `
                                <div class="campaign-details">
                                    <h3>Reference Campaign</h3>
                                    <div class="campaign-info">
                                        <div class="campaign-item">
                                            <i class="bi bi-building"></i>
                                            <span><strong>Brand:</strong> ${this.videoData.brand}</span>
                                        </div>
                                        <div class="campaign-item">
                                            <i class="bi bi-megaphone"></i>
                                            <span><strong>Campaign:</strong> ${this.videoData.campaign}</span>
                                        </div>
                                        <div class="campaign-item">
                                            <i class="bi bi-calendar"></i>
                                            <span><strong>Year:</strong> ${this.videoData.year}</span>
                                        </div>
                                        <div class="campaign-item">
                                            <i class="bi bi-geo-alt"></i>
                                            <span><strong>Market:</strong> ${this.videoData.country}</span>
                                        </div>
                                        <div class="campaign-item">
                                            <i class="bi bi-people"></i>
                                            <span><strong>Target:</strong> ${this.videoData.target}</span>
                                        </div>
                                        <div class="campaign-item">
                                            <i class="bi bi-building"></i>
                                            <span><strong>Industry:</strong> ${this.videoData.industry}</span>
                                        </div>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                        <div class="title-right">
                            ${this.videoData && this.videoData.thumbnail ? `
                                <div class="campaign-thumbnail ${this.videoData.thumbnail.isVertical ? 'vertical-video' : 'horizontal-video'}">
                                    <img src="${this.videoData.thumbnail.dataUrl || this.videoData.thumbnail}" alt="Campaign Video" class="thumbnail-image">
                                    <div class="thumbnail-overlay">
                                        <i class="bi bi-play-circle"></i>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `
        };
    }

    createVideoPlaySlide() {
        if (!this.videoData) {
            return {
                type: 'video-play',
                title: 'Campaign Video',
                content: '<div class="no-video">No video data available</div>'
            };
        }

        const isVertical = this.videoData.thumbnail && this.videoData.thumbnail.isVertical;

        return {
            type: 'video-play',
            title: 'Campaign Video',
            content: `
                <div class="video-play-slide">
                    <div class="video-player-container ${isVertical ? 'vertical-video-container' : 'horizontal-video-container'}">
                        <video controls class="campaign-video ${isVertical ? 'vertical-video' : 'horizontal-video'}" src="${this.videoData.src}">
                            <source src="${this.videoData.src}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div class="video-info">
                        <h3>${this.videoData.brand} - ${this.videoData.campaign}</h3>
                        <div class="video-badges">
                            <span class="badge">${this.videoData.industry}</span>
                            <span class="badge">${this.videoData.year}</span>
                            <span class="badge">${this.videoData.country}</span>
                            <span class="badge">${this.videoData.target}</span>
                        </div>
                    </div>
                </div>
            `
        };
    }

    createTableSlide() {
        return {
            type: 'table',
            title: 'STAAAR Framework',
            content: `
                <div class="table-slide">
                    <div class="exact-table-container">
                        ${this.generateExactTable()}
                    </div>
                    <div class="table-insights-area">
                        <label>Strategic Insights:</label>
                        <textarea class="table-insights-text" placeholder="What insights can you draw from the complete framework? How do the elements work together strategically?"></textarea>
                    </div>
                </div>
            `
        };
    }

    createInsightsSlide() {
        return {
            type: 'insights',
            title: 'Key Strategic Insights',
            content: `
                <div class="insights-slide">
                    <div class="insights-grid">
                        <div class="insight-card">
                            <i class="bi bi-lightbulb"></i>
                            <h3>Primary Insight</h3>
                            <textarea class="insight-text" placeholder="What is the most important insight from your analysis?"></textarea>
                        </div>
                        <div class="insight-card">
                            <i class="bi bi-target"></i>
                            <h3>Opportunity</h3>
                            <textarea class="insight-text" placeholder="What opportunities does this analysis reveal?"></textarea>
                        </div>
                        <div class="insight-card">
                            <i class="bi bi-exclamation-triangle"></i>
                            <h3>Risks & Challenges</h3>
                            <textarea class="insight-text" placeholder="What risks or challenges should be considered?"></textarea>
                        </div>
                        <div class="insight-card">
                            <i class="bi bi-graph-up"></i>
                            <h3>Success Metrics</h3>
                            <textarea class="insight-text" placeholder="How will success be measured?"></textarea>
                        </div>
                    </div>
                </div>
            `
        };
    }

    createRowSlides() {
        if (!this.tableData || !this.tableData.rows.length) {
            return [];
        }

        const rowSlides = [];

        // Create a slide for each table row
        this.tableData.rows.forEach((row, rowIndex) => {
            // Find the chosen image for this row (typically the largest or selected one)
            const chosenImage = this.getChosenImageForRow(row, rowIndex);

            // Always create a slide for each row, even if no image (use placeholder)
            if (chosenImage || row.length > 0) {
                // Get the actual row header from strategy data
                const currentStrategy = window.strategyLoader?.currentStrategy;
                let rowTitle = `Row ${rowIndex + 1} Analysis`;

                if (currentStrategy && currentStrategy.content && currentStrategy.content.headers) {
                    const header = currentStrategy.content.headers[rowIndex];
                    if (header && typeof header === 'object' && header.text) {
                        rowTitle = header.text;
                    }
                }

                const slide = {
                    type: 'row-analysis',
                    title: rowTitle,
                    content: `
                        <div class="row-analysis-slide">
                            <div class="large-image-section">
                                ${chosenImage && chosenImage.src ?
                                    `<img src="${chosenImage.src}" alt="${rowTitle} Chosen Image" class="large-row-image">` :
                                    `<div class="image-placeholder-large">
                                        <i class="bi bi-image" style="font-size: 48px; color: #9ca3af;"></i>
                                        <span style="color: #6b7280; margin-top: 12px;">No Image Available</span>
                                     </div>`
                                }
                            </div>
                            <div class="column-list-section">
                                ${this.generateRowDataPoints(rowIndex)}
                            </div>
                        </div>
                    `
                };
                rowSlides.push(slide);
            }
        });

        return rowSlides;
    }

    getChosenImageForRow(row, rowIndex) {
        // Find image in the row - could be cropped image or original
        // The image column is always column index 1 (second column)
        const imageColumnIndex = 1;

        for (let i = 0; i < row.length; i++) {
            const cell = row[i];
            if (cell.image) {
                // Check if there's a cropped version stored
                const rowKey = `row-${rowIndex}`;
                const croppedImage = window.croppedImages && window.croppedImages[rowKey];

                return {
                    src: croppedImage || cell.image,
                    columnIndex: imageColumnIndex, // Always use column 1 for image
                    isCropped: !!croppedImage
                };
            }
        }
        return {
            src: null,
            columnIndex: imageColumnIndex,
            isCropped: false
        };
    }

    generateRowDataPoints(rowIndex) {
        const currentStrategy = window.strategyLoader?.currentStrategy;

        // Remove duplicate header - it's already in the slide title
        let headerHtml = '';

        // Get ALL 6 columns in reverse order (bottom to top, right to left in index.html)
        let dataPointsHtml = '<div class="column-list-vertical">';

        if (currentStrategy && currentStrategy.content && currentStrategy.content.data[rowIndex]) {
            const rowData = currentStrategy.content.data[rowIndex];
            const headers = currentStrategy.content.headers;

            // Show only the 5 data columns (columns 3-7, skip header column 1 and image column 2)
            const allColumns = [];

            // The rowData from strategy content has 6 data items
            // We need to map these to the actual table columns correctly
            // From debug: Col0=Header, Col1=Image(empty), Col2=First text, Col3=Second text, etc.
            rowData.forEach((cell, cellIndex) => {
                allColumns.push({
                    tableColumnIndex: cellIndex + 2, // Skip header(0) and image(1): 2,3,4,5,6,7
                    verticalIndex: cellIndex, // Vertical list index (0,1,2,3,4,5)
                    icon: cell.icon,
                    text: cell.text,
                    isData: true
                });
            });

            // Find the actual selected column from the table interface
            // This should detect which column was actually clicked/selected in index.html
            const chosenColumnIndex = this.getActualSelectedColumnForSlide(rowIndex, 2);

            // Reverse the order (bottom to top) and generate HTML
            allColumns.reverse().forEach((column, verticalIndex) => {
                const isChosen = column.tableColumnIndex === chosenColumnIndex;
                const itemClass = isChosen ? 'column-item chosen-column-highlight' : 'column-item';

                dataPointsHtml += `
                    <div class="${itemClass}">
                        <div class="column-content-vertical">
                            <i class="bi bi-${column.icon}" style="color: ${isChosen ? '#10b981' : '#3b82f6'}; margin-right: 8px; font-size: ${isChosen ? '20px' : '16px'};"></i>
                            <span style="font-size: ${isChosen ? '16px' : '14px'}; font-weight: ${isChosen ? '700' : '500'};">${column.text}</span>
                            ${isChosen ? '<i class="bi bi-check-circle-fill chosen-tick" style="margin-left: auto; color: #10b981; font-size: 18px;"></i>' : ''}
                        </div>
                    </div>
                `;
            });
        } else {
            // Fallback to extracted data - show only the 5 data columns (skip header and image)
            const row = this.tableData.rows[rowIndex];

            // Find the actual selected column from the table interface (same method as STAAAR Framework slide)
            const chosenColumnIndex = this.getActualSelectedColumnForSlide(rowIndex, 2);

            // Show only data columns (skip header column 0 and image column 1)
            const dataColumns = row.slice(2); // Skip first two columns (header and image)
            const reversedDataColumns = [...dataColumns].reverse();

            reversedDataColumns.forEach((cell, reverseIndex) => {
                const actualIndex = dataColumns.length - 1 - reverseIndex + 2; // +2 to account for skipped columns
                const isChosen = actualIndex === chosenColumnIndex;
                const itemClass = isChosen ? 'column-item chosen-column-highlight' : 'column-item';

                if (cell.text.trim()) {
                    dataPointsHtml += `
                        <div class="${itemClass}">
                            <div class="column-content-vertical">
                                ${cell.icon ? `<i class="${cell.icon}" style="color: ${isChosen ? '#10b981' : '#3b82f6'}; margin-right: 8px; font-size: ${isChosen ? '20px' : '16px'};"></i>` : ''}
                                <span style="font-size: ${isChosen ? '16px' : '14px'}; font-weight: ${isChosen ? '700' : '500'};">${cell.text}</span>
                                ${isChosen ? '<i class="bi bi-check-circle-fill chosen-tick" style="margin-left: auto; color: #10b981; font-size: 18px;"></i>' : ''}
                            </div>
                        </div>
                    `;
                }
            });
        }

        dataPointsHtml += '</div>';

        return headerHtml + dataPointsHtml;
    }

    getActualSelectedColumn(rowIndex) {
        // Method 1: Check the actual table row in the DOM for linked boxes
        const table = document.querySelector('.insight-table');
        if (table) {
            const tableRows = table.querySelectorAll('tr[data-row]');
            const targetRow = Array.from(tableRows).find(row =>
                parseInt(row.getAttribute('data-row')) === rowIndex
            );

            if (targetRow) {
                const cells = targetRow.querySelectorAll('td');

                // Look for visual indicators of selection (linked boxes)
                for (let i = 0; i < cells.length; i++) {
                    const cell = cells[i];
                    const hasSelection = cell.classList.contains('selected') ||
                                       cell.classList.contains('active') ||
                                       cell.classList.contains('highlighted') ||
                                       cell.style.backgroundColor !== '' ||
                                       cell.style.background !== '' ||
                                       cell.querySelector('.selected') ||
                                       cell.getAttribute('data-selected') === 'true' ||
                                       cell.style.border?.includes('blue') ||
                                       cell.style.outline?.includes('blue');

                    if (hasSelection) {
                        return i;
                    }
                }

                // Check for image connections (image could be in different columns)
                let imageColumnIndex = -1;
                for (let i = 0; i < cells.length; i++) {
                    const cell = cells[i];
                    if (cell.querySelector('img') || cell.classList.contains('image-cell') || cell.querySelector('.image-placeholder')) {
                        imageColumnIndex = i;
                        break;
                    }
                }

                if (imageColumnIndex !== -1) {
                    // Find the first non-empty text cell after the image
                    for (let i = imageColumnIndex + 1; i < cells.length; i++) {
                        const cell = cells[i];
                        const cellText = cell.textContent.trim();
                        if (cellText && !cell.classList.contains('category-cell')) {
                            return i;
                        }
                    }
                }

                // If no image found, check for any highlighted/selected cell
                for (let i = 2; i < cells.length; i++) { // Start from column 2 (skip header and potential image)
                    const cell = cells[i];
                    const cellText = cell.textContent.trim();
                    if (cellText) {
                        return i;
                    }
                }
            }
        }

        // Method 2: Check for stored selection data in global variables
        if (window.selectedColumns && typeof window.selectedColumns[rowIndex] !== 'undefined') {
            return window.selectedColumns[rowIndex];
        }

        // Method 3: Check if there's a selection storage mechanism
        if (window.rowSelections && window.rowSelections[rowIndex]) {
            return window.rowSelections[rowIndex];
        }

        // Method 4: Different storage patterns
        const rowKey = `row-${rowIndex}`;
        if (window.selections && window.selections[rowKey]) {
            return window.selections[rowKey];
        }

        // Default fallback: Each row gets a different selection for testing
        const testSelections = [2, 3, 4, 5, 6]; // Different columns for different rows
        const fallbackSelection = testSelections[rowIndex] || (rowIndex + 2);
        return fallbackSelection;
    }

    // Method for STAAAR Framework slide - reads actual connections from index.html
    getActualSelectedColumnForSlide(rowIndex, slideIndex = 2) {

        // Method 1: Check the actual table row in the DOM for REAL connections
        const table = document.querySelector('.insight-table');
        if (table) {
            const tableRows = table.querySelectorAll('tr[data-row]');
            const targetRow = Array.from(tableRows).find(row =>
                parseInt(row.getAttribute('data-row')) === rowIndex
            );

            if (targetRow) {
                const cells = targetRow.querySelectorAll('td');

                // Debug: Show all cell contents and their indices
                for (let i = 0; i < cells.length; i++) {
                    const cell = cells[i];
                    const hasImage = cell.querySelector('img') && !cell.querySelector('img').src.includes('data:image/svg+xml');
                    const text = cell.textContent.trim().substring(0, 20); // First 20 chars
                    const hasGreenBorder = cell.style.border?.includes('rgb(16, 185, 129)') ||
                                         cell.style.border?.includes('#10b981');
                    const computedStyle = window.getComputedStyle(cell);
                    const hasComputedGreen = computedStyle.borderColor?.includes('rgb(16, 185, 129)');

                }

                // Look for the green highlighted column (the actual connection)
                let connectedLocation = -1;
                let connectedText = '';

                // Check each cell for green highlighting (ComputedGreen)
                for (let i = 0; i < cells.length; i++) {
                    const cell = cells[i];
                    const computedStyle = window.getComputedStyle(cell);
                    const hasComputedGreen = computedStyle.borderColor?.includes('rgb(16, 185, 129)');

                    if (hasComputedGreen && i >= 2) { // Skip header (0) and image (1) columns
                        connectedLocation = i;
                        connectedText = cell.textContent.trim();
                        break;
                    }
                }

                // If we found a green highlighted column, that's our connection
                if (connectedLocation > 0) {

                    // Convert table column to slide cell index
                    // The table has: header(0), image(1), then text columns(2,3,4,5,6)
                    // The slide cell indices need to map to the actual data columns
                    const slide3Index = connectedLocation;

                    console.log(`🔄 CORRECTED CONVERSION: Connected column ${connectedLocation} → Slide3Index ${slide3Index}`);
                    console.log(`🎯 SLIDE 3 SHOULD CONNECT: Text cell index ${slide3Index}`);

                    return slide3Index;
                }

                // Look for visual styling indicators (green borders, backgrounds, etc.)
                for (let i = 1; i < cells.length; i++) { // Start from column 1 (first text column after header)
                    const cell = cells[i];
                    const computedStyle = window.getComputedStyle(cell);
                    const hasGreenBorder = cell.style.border?.includes('rgb(16, 185, 129)') ||
                                         cell.style.border?.includes('#10b981') ||
                                         computedStyle.borderColor?.includes('rgb(16, 185, 129)');

                    const hasGreenBackground = cell.style.background?.includes('rgba(16, 185, 129') ||
                                             computedStyle.backgroundColor?.includes('rgba(16, 185, 129');

                    if (hasGreenBorder || hasGreenBackground) {
                        const styledText = cell.textContent.trim();

                        // CORRECTED conversion: Index.html has no image column!
                        // Column 1 = first text cell, Column 2 = second text cell, etc.
                        // So: column 1 → slide3 index 1, column 2 → slide3 index 2, etc.
                        const slide3Index = i;

                        console.log(`🔄 CORRECTED CONVERSION: Column ${i} → Slide3Index ${slide3Index}`);
                        console.log(`🎯 SLIDE 3 SHOULD CONNECT: Text cell index ${slide3Index} with text "${styledText}"`);

                        return slide3Index; // Direct mapping since no image column in index.html
                    }
                }
            }
        }

        // Method 2: Check for stored selection data in global variables
        if (window.selectedColumns && typeof window.selectedColumns[rowIndex] !== 'undefined') {
            return window.selectedColumns[rowIndex];
        }

        // Last resort: Return null to indicate no connection found
        return null;
    }

    createInsightsSlide() {
        return {
            type: 'insights',
            title: 'Key Strategic Insights',
            content: `
                <div class="insights-slide">
                    <div class="insights-grid">
                        <div class="insight-card">
                            <i class="bi bi-lightbulb"></i>
                            <h3>Primary Insight</h3>
                            <textarea class="insight-text" placeholder="What is the most important insight from your analysis?"></textarea>
                        </div>
                        <div class="insight-card">
                            <i class="bi bi-target"></i>
                            <h3>Opportunity</h3>
                            <textarea class="insight-text" placeholder="What opportunities does this analysis reveal?"></textarea>
                        </div>
                        <div class="insight-card">
                            <i class="bi bi-exclamation-triangle"></i>
                            <h3>Risks & Challenges</h3>
                            <textarea class="insight-text" placeholder="What risks or challenges should be considered?"></textarea>
                        </div>
                        <div class="insight-card">
                            <i class="bi bi-graph-up"></i>
                            <h3>Success Metrics</h3>
                            <textarea class="insight-text" placeholder="How will success be measured?"></textarea>
                        </div>
                    </div>
                </div>
            `
        };
    }

    generateExactTable() {
        if (!this.tableData || !this.tableData.rows.length) {
            return '<div class="no-table">No table data available</div>';
        }

        // Get the current strategy content to rebuild exactly like index.html
        const currentStrategy = window.strategyLoader?.currentStrategy;

        // Build table with rounded rectangle cells and dynamic sizing
        let html = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 20px; overflow: auto;"><table class="insight-table exact-index-replica" style="border-collapse: separate; border-spacing: 8px; position: relative; margin: 0 auto;">';

        this.tableData.rows.forEach((row, rowIndex) => {
            html += `<tr data-row="${rowIndex}" style="position: relative;">`;

            // Add category cell (first column) - cell itself is rounded rectangle
            if (currentStrategy && currentStrategy.content && currentStrategy.content.headers) {
                const header = currentStrategy.content.headers[rowIndex];
                if (header && typeof header === 'object' && header.icon) {
                    html += `<td class="category-cell" style="width: 120px; height: 120px; padding: 12px; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); vertical-align: middle; text-align: center; box-shadow: 0 6px 16px rgba(30, 41, 59, 0.4);">`;
                    html += `
                        <i class="bi bi-${header.icon}" style="font-size: 20px; color: white; display: block; margin-bottom: 6px;"></i>
                        <div style="font-size: 10px; line-height: 1.2; font-weight: 600; color: white; text-align: center;">${header.text}</div>
                    `;
                } else {
                    html += `<td class="category-cell" style="width: 120px; height: 120px; padding: 12px; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); vertical-align: middle; text-align: center; box-shadow: 0 6px 16px rgba(30, 41, 59, 0.4);">`;
                    html += `<div style="color: white; font-weight: 600; font-size: 11px; text-align: center;">ROW ${rowIndex + 1}</div>`;
                }
            } else {
                html += `<td class="category-cell" style="width: 120px; height: 120px; padding: 12px; border-radius: 12px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); vertical-align: middle; text-align: center; box-shadow: 0 6px 16px rgba(30, 41, 59, 0.4);">`;
                html += `<div style="color: white; font-weight: 600; font-size: 11px; text-align: center;">ROW ${rowIndex + 1}</div>`;
            }
            html += `</td>`;

            // Get connection info for this row - use STAAAR Framework slide method
            const selectedColumn = this.getActualSelectedColumnForSlide(rowIndex, 2);
            const rowKey = `row-${rowIndex}`;
            const croppedImage = window.croppedImages && window.croppedImages[rowKey];
            const originalImage = row.find(cell => cell.image);
            const hasImage = croppedImage || originalImage;
            const imageSrc = hasImage ? (croppedImage || originalImage.image) : null;

            // For testing: add some sample images if none exist
            if (!hasImage && rowIndex < 3) {
                const testImages = [
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjM0I4MkY2Ii8+Cjx0ZXh0IHg9IjQwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGVzdCAxPC90ZXh0Pgo8L3N2Zz4=',
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMTBCOTgxIi8+Cjx0ZXh0IHg9IjQwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGVzdCAyPC90ZXh0Pgo8L3N2Zz4=',
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjU5RTBCIi8+Cjx0ZXh0IHg9IjQwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGVzdCAzPC90ZXh0Pgo8L3N2Zz4='
                ];
                imageSrc = testImages[rowIndex];
                hasImage = true;
            }

            console.log(`🔍 DEBUG Row ${rowIndex}:`, {
                selectedColumn,
                hasImage: !!hasImage,
                imageSrc: imageSrc ? 'present' : 'missing',
                croppedImage: !!croppedImage,
                originalImage: !!originalImage
            });

            // Simple structure: header + text cells only (NO image column)
            if (currentStrategy && currentStrategy.content && currentStrategy.content.data[rowIndex]) {
                const rowData = currentStrategy.content.data[rowIndex];

                // Find which text cell should be connected (0-based index in rowData)
                let connectedCellIndex = -1;
                if (hasImage && selectedColumn !== null && selectedColumn >= 1) {
                    connectedCellIndex = selectedColumn - 1; // Convert to 0-based index
                }

                console.log(`📊 STAAAR Framework Row ${rowIndex}:`, {
                    selectedColumn,
                    connectedCellIndex,
                    hasImage: !!hasImage,
                    totalCells: rowData.length
                });

                // Debug: Show all available text cells
                rowData.forEach((cell, idx) => {
                    console.log(`   Cell ${idx}: "${cell.text}" (will be at slide index ${idx + 1})`);
                });

                // Add text cells with image cell inserted before connected text
                rowData.forEach((cell, cellIndex) => {
                    const willConnect = cellIndex === connectedCellIndex;
                    console.log(`🔧 STAAAR Framework Processing cell ${cellIndex}: "${cell.text}" | Connected: ${willConnect}`);

                    if (cellIndex === connectedCellIndex && hasImage) {

                        // FIRST: Insert image cell before this connected text cell
                        html += `<td class="image-cell-connected" style="width: 120px; height: 120px; padding: 0; border: 3px solid #10b981; border-radius: 12px; background: rgba(16, 185, 129, 0.05); vertical-align: middle; text-align: center; box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3); overflow: hidden;">`;

                        // Image fills entire cell
                        html += `
                            <img src="${imageSrc}" alt="Row ${rowIndex + 1}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 9px; display: block;">
                        `;

                        html += `</td>`;

                        // SECOND: Add the connected text cell
                        html += `<td class="text-cell text-connected" style="width: 120px; height: 120px; padding: 12px; border: 3px solid #10b981; border-radius: 12px; background: rgba(16, 185, 129, 0.02); vertical-align: middle; text-align: center; box-shadow: 0 6px 16px rgba(16, 185, 129, 0.2);">`;

                        // Only the text content in this cell
                        html += `
                            <i class="bi bi-${cell.icon}" style="font-size: 18px; color: #10b981; display: block; margin-bottom: 6px;"></i>
                            <div style="font-size: 11px; line-height: 1.2; font-weight: 600; color: #065f46; text-align: center;">${cell.text}</div>
                        `;

                        html += `</td>`;
                    } else {
                        // Regular text cell - rounded rectangle with normal styling
                        html += `<td class="text-cell" style="width: 120px; height: 120px; padding: 12px; border: 1px solid #e5e7eb; border-radius: 12px; background: #ffffff; vertical-align: middle; text-align: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">`;

                        html += `
                            <i class="bi bi-${cell.icon}" style="font-size: 18px; color: #3b82f6; display: block; margin-bottom: 6px;"></i>
                            <div style="font-size: 11px; line-height: 1.2; font-weight: 600; color: #1e293b; text-align: center;">${cell.text}</div>
                        `;

                        html += `</td>`;
                    }
                });
            }

            html += `</tr>`;
        });

        html += '</table></div>';
        return html;
    }

    renderSlides() {
        const container = document.getElementById('slidesContainer');
        container.innerHTML = '';

        this.slides.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = `slide ${index === 0 ? 'active' : ''}`;
            slideElement.innerHTML = `
                <div class="slide-header">
                    <h2 class="slide-title">${slide.title}</h2>
                </div>
                <div class="slide-body">
                    ${slide.content}
                </div>
            `;
            container.appendChild(slideElement);
        });

        document.getElementById('totalSlides').textContent = this.slides.length;
    }

    updateSlideIndicators() {
        const container = document.getElementById('slideIndicators');
        container.innerHTML = '';

        this.slides.forEach((slide, index) => {
            const indicator = document.createElement('button');
            indicator.className = `slide-indicator ${index === 0 ? 'active' : ''}`;
            indicator.textContent = index + 1;
            indicator.addEventListener('click', () => this.showSlide(index));
            container.appendChild(indicator);

            // Add "+" button between slides (except after the last slide)
            if (index < this.slides.length - 1) {
                const addButton = document.createElement('button');
                addButton.className = 'add-slide-btn';
                addButton.innerHTML = '+';
                addButton.title = 'Insert optional page';
                addButton.style.cssText = `
                    background: transparent;
                    border: 2px dashed #64748b;
                    color: #64748b;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    margin: 0 4px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                    opacity: 0;
                    transition: all 0.2s ease;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                `;

                // Show on hover of the container area
                addButton.addEventListener('mouseenter', () => {
                    addButton.style.opacity = '1';
                    addButton.style.borderColor = '#10b981';
                    addButton.style.color = '#10b981';
                });

                addButton.addEventListener('mouseleave', () => {
                    addButton.style.opacity = '0';
                    addButton.style.borderColor = '#64748b';
                    addButton.style.color = '#64748b';
                });

                addButton.addEventListener('click', () => this.showOptionalPagesModal(index + 1));
                container.appendChild(addButton);
            }
        });

        // Add hover effect to show + buttons when hovering over the indicator container
        container.addEventListener('mouseenter', () => {
            const addButtons = container.querySelectorAll('.add-slide-btn');
            addButtons.forEach(btn => btn.style.opacity = '0.6');
        });

        container.addEventListener('mouseleave', () => {
            const addButtons = container.querySelectorAll('.add-slide-btn');
            addButtons.forEach(btn => btn.style.opacity = '0');
        });
    }

    showOptionalPagesModal(insertIndex) {
        console.log(`Opening optional pages modal to insert at position ${insertIndex}`);

        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'optional-pages-modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'optional-pages-modal-content';
        modalContent.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            transform: scale(0.9);
            transition: transform 0.3s ease;
        `;

        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3 style="margin: 0; color: #1f2937; font-size: 20px; font-weight: 600;">
                    Insert Optional Page
                </h3>
                <button class="close-modal-btn" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #6b7280;
                    padding: 4px;
                    line-height: 1;
                ">×</button>
            </div>

            <p style="color: #6b7280; margin-bottom: 24px; font-size: 14px;">
                Choose an optional page to insert at position ${insertIndex}
            </p>

            <div class="optional-pages-grid" style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 16px;
            ">
                <div class="optional-page-card" data-type="strategy-matrix" style="
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 20px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: #f9fafb;
                ">
                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                        <div style="
                            width: 40px;
                            height: 40px;
                            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 12px;
                        ">
                            <span style="color: white; font-weight: bold; font-size: 18px;">📊</span>
                        </div>
                        <h4 style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                            Strategy Priority Matrix
                        </h4>
                    </div>
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.4;">
                        McKinsey 2x2 matrix for strategic decision making and priority assessment
                    </p>
                    <button class="insert-page-btn" style="
                        margin-top: 16px;
                        background: #3b82f6;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        font-size: 14px;
                        cursor: pointer;
                        font-weight: 500;
                        width: 100%;
                        transition: background 0.2s ease;
                    ">
                        Insert Page
                    </button>
                </div>

                <div class="optional-page-card" data-type="survey-insights-map" style="
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 20px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: #f9fafb;
                ">
                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                        <div style="
                            width: 40px;
                            height: 40px;
                            background: linear-gradient(135deg, #10b981, #059669);
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 12px;
                        ">
                            <span style="color: white; font-weight: bold; font-size: 18px;">🗺️</span>
                        </div>
                        <h4 style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                            Survey Insights (Map)
                        </h4>
                    </div>
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.4;">
                        Interactive map with pins and callouts for geographic survey data
                    </p>
                    <button class="insert-page-btn" style="
                        margin-top: 16px;
                        background: #10b981;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        font-size: 14px;
                        cursor: pointer;
                        font-weight: 500;
                        width: 100%;
                        transition: background 0.2s ease;
                    ">
                        Insert Page
                    </button>
                </div>

                <div class="optional-page-card" data-type="survey-insights-image" style="
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 20px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: #f9fafb;
                ">
                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                        <div style="
                            width: 40px;
                            height: 40px;
                            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 12px;
                        ">
                            <span style="color: white; font-weight: bold; font-size: 18px;">🖼️</span>
                        </div>
                        <h4 style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                            Survey Insights (Image)
                        </h4>
                    </div>
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.4;">
                        Background image annotations with draggable callouts and templates
                    </p>
                    <button class="insert-page-btn" style="
                        margin-top: 16px;
                        background: #8b5cf6;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        font-size: 14px;
                        cursor: pointer;
                        font-weight: 500;
                        width: 100%;
                        transition: background 0.2s ease;
                    ">
                        Insert Page
                    </button>
                </div>

                <div class="optional-page-card" data-type="ad-mockup-creator" style="
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 20px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: #f9fafb;
                ">
                    <div style="display: flex; align-items: center; margin-bottom: 12px;">
                        <div style="
                            width: 40px;
                            height: 40px;
                            background: linear-gradient(135deg, #f59e0b, #d97706);
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin-right: 12px;
                        ">
                            <span style="color: white; font-weight: bold; font-size: 18px;">🎨</span>
                        </div>
                        <h4 style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                            Ad Mockup Creator
                        </h4>
                    </div>
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.4;">
                        Create professional ad mockups with automatic perspective correction
                    </p>
                    <button class="insert-page-btn" style="
                        margin-top: 16px;
                        background: #f59e0b;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        font-size: 14px;
                        cursor: pointer;
                        font-weight: 500;
                        width: 100%;
                        transition: background 0.2s ease;
                    ">
                        Insert Page
                    </button>
                </div>
            </div>
        `;

        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);

        // Add event listeners
        modalOverlay.querySelector('.close-modal-btn').addEventListener('click', () => {
            this.closeOptionalPagesModal(modalOverlay);
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeOptionalPagesModal(modalOverlay);
            }
        });

        // Add hover effects and click handlers for cards
        const cards = modalOverlay.querySelectorAll('.optional-page-card');
        cards.forEach(card => {
            const button = card.querySelector('.insert-page-btn');
            const type = card.getAttribute('data-type');

            // Hover effects
            card.addEventListener('mouseenter', () => {
                let borderColor;
                if (type === 'strategy-matrix') {
                    borderColor = '#3b82f6';
                } else if (type === 'survey-insights-map') {
                    borderColor = '#10b981';
                } else if (type === 'survey-insights-image') {
                    borderColor = '#8b5cf6';
                } else if (type === 'ad-mockup-creator') {
                    borderColor = '#f59e0b';
                } else {
                    borderColor = '#6b7280';
                }

                card.style.borderColor = borderColor;
                card.style.backgroundColor = '#ffffff';
                card.style.transform = 'translateY(-2px)';
                card.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.borderColor = '#e5e7eb';
                card.style.backgroundColor = '#f9fafb';
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = 'none';
            });

            // Button click handler
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.insertOptionalPage(type, insertIndex);
                this.closeOptionalPagesModal(modalOverlay);
            });
        });

        // Animate modal in
        setTimeout(() => {
            modalOverlay.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
    }

    closeOptionalPagesModal(modalOverlay) {
        modalOverlay.style.opacity = '0';
        modalOverlay.querySelector('.optional-pages-modal-content').style.transform = 'scale(0.9)';

        setTimeout(() => {
            if (modalOverlay.parentNode) {
                modalOverlay.parentNode.removeChild(modalOverlay);
            }
        }, 300);
    }

    insertOptionalPage(type, insertIndex) {
        console.log(`Inserting ${type} page at position ${insertIndex}`);

        let newSlide;

        if (type === 'strategy-matrix') {
            newSlide = this.createMcKinsey2x2Slide();
        } else if (type === 'survey-insights-map') {
            newSlide = this.createSurveyInsightsSlide('map');
        } else if (type === 'survey-insights-image') {
            newSlide = this.createSurveyInsightsSlide('image');
        } else if (type === 'ad-mockup-creator') {
            newSlide = this.createAdMockupSlide();
        } else {
            console.error('Unknown page type:', type);
            return;
        }

        // Insert the slide at the specified position
        this.slides.splice(insertIndex, 0, newSlide);

        // Re-render slides and update indicators
        this.renderSlides();
        this.updateSlideIndicators();

        // Load callout system script if it's a survey insights slide
        if (type.startsWith('survey-insights')) {
            this.loadCalloutSystemScript(() => {
                // Auto-initialize the callout system after script loads
                const mode = type.split('-')[2]; // 'map' or 'image'

                // Get the unique container ID from the newly created slide
                const currentSlide = this.slides[insertIndex];
                const containerId = currentSlide.containerId;

                if (!containerId) {
                    console.error('❌ Could not find container ID in slide data');
                    return;
                }

                console.log(`🚀 Auto-initializing callout system: mode=${mode}, container=${containerId}`);

                // Initialize immediately after script loads
                setTimeout(() => {
                    if (window.initializeCalloutSystem) {
                        window.initializeCalloutSystem(mode, containerId);
                        console.log('✅ Survey callout system auto-initialized');
                    } else {
                        console.error('❌ initializeCalloutSystem not available');
                    }
                }, 100);
            });
        }

        // Load mockup system if it's an ad mockup creator slide
        if (type === 'ad-mockup-creator') {
            // Load only mockup system with built-in pin functionality
            this.loadMockupSystemScript(() => {
                // Auto-initialize mockup system after script loads
                const currentSlide = this.slides[insertIndex];
                const containerId = currentSlide.containerId;

                if (!containerId) {
                    console.error('❌ Could not find container ID in mockup slide data');
                    return;
                }

                console.log(`🚀 Auto-initializing mockup system: container=${containerId}`);

                // Initialize after ensuring DOM is ready
                setTimeout(() => {
                    if (window.initializeMockupSlide) {
                        // Wait for DOM elements to be available
                        const checkDOMReady = () => {
                            console.log(`🔍 [TRACE] checkDOMReady called for container: ${containerId}`);

                            const contentGrid = document.getElementById(`contentGrid-${containerId}`);
                            const mockupArea = document.getElementById(`mockupArea-${containerId}`);
                            const canvas = document.getElementById(`resultCanvas-${containerId}`);

                            console.log(`🔍 [TRACE] DOM elements check:`, {
                                contentGrid: !!contentGrid,
                                mockupArea: !!mockupArea,
                                canvas: !!canvas
                            });

                            if (contentGrid && mockupArea && canvas) {
                                console.log('📦 [TRACE] DOM elements ready, initializing mockup system');

                                console.log(`🔍 [TRACE] Calling window.initializeMockupSlide...`);
                                window.initializeMockupSlide(containerId, this);

                                // Initialize SurveyCalloutSystem for the callout container (same as Survey Image slide)
                                const calloutContainerId = `calloutContainer-${containerId}`;
                                console.log(`🚀 [TRACE] Initializing SurveyCalloutSystem for mockup: ${calloutContainerId}`);

                                if (window.initializeCalloutSystem) {
                                    window.initializeCalloutSystem('image', calloutContainerId);
                                    console.log(`✅ [TRACE] SurveyCalloutSystem initialized for mockup`);
                                } else {
                                    console.error(`❌ [TRACE] initializeCalloutSystem function not found!`);
                                }

                                console.log('✅ [TRACE] Mockup system with custom pin system auto-initialized');
                            } else {
                                console.log('📦 [TRACE] Waiting for DOM elements to be ready...');
                                setTimeout(checkDOMReady, 50);
                            }
                        };
                        checkDOMReady();
                    } else {
                        console.error('❌ initializeMockupSlide not available');
                    }
                }, 200);
            });
        }

        // Show the newly inserted slide
        this.showSlide(insertIndex);

        console.log(`Successfully inserted ${type} page at position ${insertIndex}`);
    }

    loadCalloutSystemScript(callback = null) {
        // Check if script is already loaded
        if (window.initializeCalloutSystem) {
            console.log('📦 Callout system script already loaded');
            if (callback) callback();
            return;
        }

        // Check if script is already being loaded
        if (document.querySelector('script[src="./js/survey-callout-system.js"]')) {
            console.log('📦 Callout system script already loading, waiting...');
            // Wait for the existing script to load
            const checkLoaded = () => {
                if (window.initializeCalloutSystem) {
                    console.log('📦 Callout system script loaded via existing request');
                    if (callback) callback();
                } else {
                    setTimeout(checkLoaded, 50);
                }
            };
            checkLoaded();
            return;
        }

        console.log('📦 Loading callout system script...');

        const script = document.createElement('script');
        // Add cache busting parameter to force reload
        script.src = `./js/survey-callout-system.js?v=${Date.now()}`;
        script.onload = () => {
            console.log('📦 Callout system script loaded successfully with cache bust');
            if (callback) callback();
        };
        script.onerror = () => {
            console.error('❌ Failed to load callout system script');
        };

        document.head.appendChild(script);
    }

    loadMockupSystemScript(callback = null) {
        // Check if script is already loaded
        if (window.initializeMockupSlide) {
            console.log('📦 Mockup system script already loaded');
            if (callback) callback();
            return;
        }

        // Check if script is already being loaded
        if (document.querySelector('script[src="./js/mockup-workspace.js"]')) {
            console.log('📦 Mockup system script already loading, waiting...');
            // Wait for the existing script to load
            const checkLoaded = () => {
                if (window.initializeMockupSlide) {
                    console.log('📦 Mockup system script loaded via existing request');
                    if (callback) callback();
                } else {
                    setTimeout(checkLoaded, 50);
                }
            };
            checkLoaded();
            return;
        }

        console.log('📦 Loading mockup system scripts...');

        // Load multiple scripts in sequence
        const scripts = [
            './js/mockup-config.js',
            './js/mockup-processor.js',
            './js/survey-callout-system.js',
            './js/mockup-workspace.js'
        ];

        let loadedCount = 0;
        const loadNext = () => {
            if (loadedCount >= scripts.length) {
                console.log('📦 All mockup system scripts loaded successfully');
                if (callback) callback();
                return;
            }

            const script = document.createElement('script');
            const scriptSrc = scripts[loadedCount];
            // Add cache busting for survey-callout-system.js to ensure fresh reload
            if (scriptSrc.includes('survey-callout-system.js')) {
                script.src = `${scriptSrc}?v=${Date.now()}`;
            } else {
                script.src = scriptSrc;
            }
            script.onload = () => {
                console.log(`📦 Loaded: ${scripts[loadedCount]}`);
                loadedCount++;
                loadNext();
            };
            script.onerror = () => {
                console.error(`❌ Failed to load: ${scripts[loadedCount]}`);
                loadedCount++;
                loadNext(); // Continue loading other scripts
            };

            document.head.appendChild(script);
        };

        loadNext();
    }

    showSlide(index) {
        if (index < 0 || index >= this.slides.length) return;

        // Hide all callouts when switching slides
        if (typeof window.hideAllCallouts === 'function') {
            window.hideAllCallouts();
        }

        // Pause videos in slides that are being hidden
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, i) => {
            const isBecomingActive = i === index;
            slide.classList.toggle('active', isBecomingActive);

            // Handle video playback
            const video = slide.querySelector('video');
            if (video) {
                if (!isBecomingActive && !video.paused) {
                    video.pause();
                    console.log('Paused video in slide', i);
                }
                // Optional: Reset video to beginning when leaving
                if (!isBecomingActive) {
                    video.currentTime = 0;
                }
            }
        });

        // Update indicators
        const indicators = document.querySelectorAll('.slide-indicator');
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });

        // Update navigation buttons
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');

        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === this.slides.length - 1;
        nextBtn.textContent = index === this.slides.length - 1 ? 'Finish' : 'Next';

        // Update slide counter
        document.getElementById('currentSlideNum').textContent = index + 1;

        this.currentSlide = index;

        // Show callouts for the current slide if it has them
        setTimeout(() => {
            if (typeof window.showCalloutsForSlide === 'function') {
                window.showCalloutsForSlide(index);
            }
        }, 100);
    }

    previousSlide() {
        this.showSlide(this.currentSlide - 1);
    }

    nextSlide() {
        this.showSlide(this.currentSlide + 1);
    }

    async downloadHtmlPresentation() {
        try {
            Utils.showStatus('Generating HTML presentation...', 'info');

            // Collect all slide data including user inputs
            const presentationData = this.collectPresentationData();

            // Generate self-contained HTML file
            const filename = await this.htmlGenerator.generateSelfContainedHtml(presentationData);

            Utils.showStatus(`HTML presentation "${filename}" downloaded successfully!`, 'success');
        } catch (error) {
            console.error('Error generating HTML presentation:', error);
            Utils.showStatus('Error generating presentation. Please try again.', 'error');
        }
    }

    collectPresentationData() {
        const slides = document.querySelectorAll('.slide');
        const presentationData = {
            strategy: this.strategyData,
            video: this.videoData,
            table: this.tableData,
            slides: []
        };

        // Use the original this.slides data instead of DOM slides
        this.slides.forEach((slideData, index) => {
            if (slideData && slideData.content) {
                const cleanedSlideData = {
                    title: slideData.title,
                    type: slideData.type,
                    content: slideData.content,
                    userInputs: {}
                };

                // Collect text areas from corresponding DOM slide if it exists
                if (slides[index]) {
                    const textAreas = slides[index].querySelectorAll('textarea');
                    textAreas.forEach(textarea => {
                        const className = textarea.className;
                        cleanedSlideData.userInputs[className] = textarea.value;
                    });
                }

                presentationData.slides.push(cleanedSlideData);
            }
        });

        return presentationData;
    }

    async generatePresentationData(data) {
        // Create downloadable JSON for now
        // In the future, integrate with libraries like PptxGenJS
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.strategyData.title.replace(/\s+/g, '_')}_presentation_data.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    createMcKinsey2x2Slide() {
        return {
            type: 'matrix',
            title: 'Strategic Priority Matrix',
            content: `
                <div class="mckinsey-matrix-slide">
                    <div class="matrix-container">
                        <div class="matrix-2x2">
                            <!-- Y-axis label -->
                            <div class="y-axis-label">
                                <span>Impact</span>
                                <div class="axis-arrow">➙</div>
                            </div>

                            <!-- Matrix grid -->
                            <div class="matrix-grid">
                                <div class="matrix-cell high-impact low-effort">
                                    <div class="cell-label">Quick Wins</div>
                                    <textarea placeholder="High Impact, Low Effort initiatives..."></textarea>
                                </div>
                                <div class="matrix-cell high-impact high-effort">
                                    <div class="cell-label">Major Projects</div>
                                    <textarea placeholder="High Impact, High Effort initiatives..."></textarea>
                                </div>
                                <div class="matrix-cell low-impact low-effort">
                                    <div class="cell-label">Fill-ins</div>
                                    <textarea placeholder="Low Impact, Low Effort tasks..."></textarea>
                                </div>
                                <div class="matrix-cell low-impact high-effort">
                                    <div class="cell-label">Thankless Tasks</div>
                                    <textarea placeholder="Low Impact, High Effort to avoid..."></textarea>
                                </div>
                            </div>

                            <!-- X-axis label -->
                            <div class="x-axis-label">
                                <span>Effort</span>
                                <div class="axis-arrow">→</div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        };
    }

    createSurveyInsightsSlide(mode = 'map') {
        const isMapMode = mode === 'map';
        const title = isMapMode ? 'Survey Insights (Map)' : 'Survey Insights (Image)';
        const description = isMapMode ?
            'Interactive map with pins and callouts for geographic survey data' :
            'Background image annotations with draggable callouts and templates';
        const icon = isMapMode ? '🗺️' : '🖼️';
        const placeholder = isMapMode ?
            'Map-based visualization with interactive pins and callouts' :
            'Image-based annotations with draggable callouts and templates';

        // Generate unique container ID to avoid conflicts between multiple survey slides
        const uniqueId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        const containerId = `calloutContainer-${mode}-${uniqueId}`;

        return {
            type: `survey-insights-${mode}`,
            title: title,
            containerId: containerId, // Store the unique container ID for later reference
            content: `
                <div class="survey-insights-slide">
                    <div class="insights-container">
                        <div class="insights-header">
                            <h2>${title}</h2>
                            <p>${description}</p>
                        </div>

                        <div class="insights-content">
                            <!-- Survey container that will be automatically initialized -->
                            <div class="callout-container" id="${containerId}" style="
                                width: 100%;
                                height: ${mode === 'map' ? '500px' : '580px'};
                                aspect-ratio: ${mode === 'map' ? '16/9' : 'auto'};
                                max-width: ${mode === 'map' ? '1200px' : '100%'};
                                background: #f8fafc;
                                border-radius: 12px;
                                border: 1px solid #e2e8f0;
                                position: relative;
                                margin: 20px auto;
                                overflow: hidden;
                            ">
                                <!-- Container will be populated by survey callout system -->
                            </div>

                            <div class="insights-summary" style="
                                display: grid;
                                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                                gap: 16px;
                                margin-top: 20px;
                            ">
                                <div class="insight-card" style="
                                    background: white;
                                    padding: 16px;
                                    border-radius: 8px;
                                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                                    border-left: 4px solid #10b981;
                                ">
                                    <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px;">Key Findings</h4>
                                    <textarea placeholder="Enter survey key findings..." style="
                                        width: 100%;
                                        height: 60px;
                                        border: 1px solid #d1d5db;
                                        border-radius: 4px;
                                        padding: 8px;
                                        resize: vertical;
                                        font-size: 12px;
                                    "></textarea>
                                </div>

                                <div class="insight-card" style="
                                    background: white;
                                    padding: 16px;
                                    border-radius: 8px;
                                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                                    border-left: 4px solid #3b82f6;
                                ">
                                    <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px;">Insights Summary</h4>
                                    <textarea placeholder="Summarize key insights..." style="
                                        width: 100%;
                                        height: 60px;
                                        border: 1px solid #d1d5db;
                                        border-radius: 4px;
                                        padding: 8px;
                                        resize: vertical;
                                        font-size: 12px;
                                    "></textarea>
                                </div>

                                <div class="insight-card" style="
                                    background: white;
                                    padding: 16px;
                                    border-radius: 8px;
                                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                                    border-left: 4px solid #f59e0b;
                                ">
                                    <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px;">Recommendations</h4>
                                    <textarea placeholder="List recommendations..." style="
                                        width: 100%;
                                        height: 60px;
                                        border: 1px solid #d1d5db;
                                        border-radius: 4px;
                                        padding: 8px;
                                        resize: vertical;
                                        font-size: 12px;
                                    "></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
        };
    }

    createAdMockupSlide() {
        const uniqueId = Date.now() + '-mockup-' + Math.random().toString(36).substr(2, 9);
        const containerId = `mockupWorkspace-${uniqueId}`;

        return {
            type: 'ad-mockup-creator',
            title: 'Ad Mockup Creator',
            containerId: containerId,
            content: `
                <div class="mockup-creator-slide">
                    <!-- LEFT PANEL: Content + Mockup Selection -->
                    <div class="left-panel">
                        <!-- Content Images Panel (TOP) -->
                        <div class="content-images-panel">
                            <h4>📸 Content Images</h4>
                            <div class="content-images-grid" id="contentGrid-${containerId}">
                                <!-- Auto-populated from table data -->
                            </div>
                            <button class="upload-content-btn" id="uploadBtn-${containerId}">
                                📁 Upload New Image
                            </button>
                            <input type="file" id="contentInput-${containerId}" accept="image/*" style="display:none;">
                        </div>

                        <!-- Mockup Grid Panel (BOTTOM) -->
                        <div class="mockup-grid-panel">
                            <h4>🎨 Mockup Templates</h4>

                            <!-- Navigation Breadcrumb -->
                            <div class="mockup-breadcrumb" id="breadcrumb-${containerId}">
                                <span class="breadcrumb-step active" id="audienceStep-${containerId}">Choose Audience</span>
                                <span class="breadcrumb-step" id="locationStep-${containerId}" style="display:none;">Choose Location</span>
                                <span class="breadcrumb-step" id="mockupStep-${containerId}" style="display:none;">Choose Mockup</span>
                            </div>

                            <!-- Back Button -->
                            <button class="mockup-back-btn" id="backBtn-${containerId}" style="display:none;">
                                ← Back
                            </button>

                            <!-- Mockup Selection Area (Scrollable) -->
                            <div class="mockup-selection-area" id="mockupArea-${containerId}">
                                <!-- Dynamic: Audiences → Locations → Mockups -->
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT PANEL: Canvas Workspace -->
                    <div class="right-panel">
                        <div class="canvas-header">
                            <div class="current-mockup-info" id="mockupInfo-${containerId}">
                                Loading first mockup...
                            </div>
                            <div class="canvas-controls-header">
                                <button id="downloadBtn-${containerId}" disabled>💾 Download</button>
                                <button id="resetBtn-${containerId}">🔄 Reset</button>
                                <button id="debugBtn-${containerId}">🔧 Debug: OFF</button>
                            </div>
                        </div>

                        <div class="canvas-workspace" id="canvasContainer-${containerId}">
                            <canvas id="resultCanvas-${containerId}"></canvas>
                            <div class="canvas-instructions" id="instructions-${containerId}">
                                Select content image or upload to apply to mockup
                            </div>
                            <!-- SurveyCalloutSystem Container positioned over canvas -->
                            <div class="callout-container" id="calloutContainer-${containerId}" style="
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                pointer-events: auto;
                                z-index: 10;
                            ">
                                <!-- SurveyCalloutSystem will initialize here -->
                            </div>
                        </div>
                    </div>
                </div>
            `
        };
    }

    createThankYouSlide() {
        return {
            type: 'thankyou',
            title: 'Thank You',
            content: `
                <div class="thankyou-slide">
                    <div class="thankyou-content">
                        <div class="thankyou-main">
                            <h1>Thank You</h1>
                            <p class="thankyou-subtitle">Strategic Analysis Complete</p>

                            <div class="thankyou-summary">
                                <div class="summary-item">
                                    <i class="bi bi-check-circle"></i>
                                    <span>Strategy Framework Analyzed</span>
                                </div>
                                <div class="summary-item">
                                    <i class="bi bi-check-circle"></i>
                                    <span>Reference Campaign Reviewed</span>
                                </div>
                                <div class="summary-item">
                                    <i class="bi bi-check-circle"></i>
                                    <span>Row-by-Row Insights Generated</span>
                                </div>
                                <div class="summary-item">
                                    <i class="bi bi-check-circle"></i>
                                    <span>Strategic Priorities Mapped</span>
                                </div>
                            </div>

                            <div class="next-steps-cta">
                                <h3>Ready to Implement?</h3>
                                <p>Your strategic insights are ready to drive revenue growth</p>
                            </div>
                        </div>

                        <div class="thankyou-branding">
                            <div class="brand-logo">STRATEGY STAAAR</div>
                            <div class="brand-tagline">Turning Strategy into Revenue</div>
                        </div>
                    </div>
                </div>
            `
        };
    }
}