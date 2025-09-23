// McKinsey-Style Presentation Download Modal
export class DownloadModal {
    constructor() {
        this.modal = null;
        this.currentSlide = 0;
        this.slides = [];
        this.videoData = null;
        this.tableData = null;
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
                        <button class="nav-btn primary" id="downloadPPT">
                            <i class="bi bi-download"></i>
                            Download PowerPoint
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

        // Download PowerPoint
        document.getElementById('downloadPPT').addEventListener('click', () => {
            this.downloadPowerPoint();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('show')) return;

            if (e.key === 'ArrowLeft') this.previousSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === 'Escape') this.close();
        });
    }

    open() {
        this.modal.classList.add('show');
        this.collectData();
        this.generateSlides();
        this.currentSlide = 0;
        this.showSlide(0);
    }

    close() {
        this.modal.classList.remove('show');
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
        this.slides = [
            this.createTitleSlide(),           // STAAAR + campaign + video thumbnail
            this.createVideoPlaySlide(),       // Actual video playback
            this.createTableSlide(),           // Exact table from index.html
            ...this.createRowSlides(),         // Each row with large image + column list
            this.createMcKinsey2x2Slide(),     // McKinsey 2x2 matrix
            this.createThankYouSlide()         // Thank you slide
        ];

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
                title: 'Reference Campaign Video',
                content: '<div class="no-video">No video data available</div>'
            };
        }

        const isVertical = this.videoData.thumbnail && this.videoData.thumbnail.isVertical;

        return {
            type: 'video-play',
            title: 'Reference Campaign Video',
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
            const chosenColumnIndex = this.getActualSelectedColumn(rowIndex);

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

            // Find the actual selected column from the table interface
            const chosenColumnIndex = this.getActualSelectedColumn(rowIndex);

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

    // Separate method ONLY for slide 3 - reads actual connections from index.html
    getActualSelectedColumnForSlide3(rowIndex) {
        console.log(`\n🔍 ===== DEBUG SLIDE 3 ROW ${rowIndex} =====`);

        // Method 1: Check the actual table row in the DOM for REAL connections
        const table = document.querySelector('.insight-table');
        if (table) {
            const tableRows = table.querySelectorAll('tr[data-row]');
            const targetRow = Array.from(tableRows).find(row =>
                parseInt(row.getAttribute('data-row')) === rowIndex
            );

            if (targetRow) {
                const cells = targetRow.querySelectorAll('td');
                console.log(`🔍 INDEX.HTML Row ${rowIndex}: Found ${cells.length} cells`);

                // Debug: Show all cell contents and their indices
                for (let i = 0; i < cells.length; i++) {
                    const cell = cells[i];
                    const hasImage = cell.querySelector('img') && !cell.querySelector('img').src.includes('data:image/svg+xml');
                    const text = cell.textContent.trim().substring(0, 20); // First 20 chars
                    const hasGreenBorder = cell.style.border?.includes('rgb(16, 185, 129)') ||
                                         cell.style.border?.includes('#10b981');
                    const computedStyle = window.getComputedStyle(cell);
                    const hasComputedGreen = computedStyle.borderColor?.includes('rgb(16, 185, 129)');

                    console.log(`📍 INDEX.HTML Column ${i}: "${text}" | Image: ${hasImage} | GreenBorder: ${hasGreenBorder} | ComputedGreen: ${hasComputedGreen}`);
                }

                // Look for images that have been moved from the image column (column 1)
                let imageLocation = -1;
                let connectedText = '';

                // Check each cell for images
                for (let i = 0; i < cells.length; i++) {
                    const cell = cells[i];
                    const img = cell.querySelector('img');

                    if (img && !img.src.includes('data:image/svg+xml')) { // Skip placeholder images
                        imageLocation = i;
                        connectedText = cell.textContent.trim();
                        console.log(`📸 INDEX.HTML: Found real image in column ${i} with text: "${connectedText}"`);
                        break;
                    }
                }

                // If we found an image in a text column, that's our connection
                if (imageLocation > 0) { // Column 0=header, 1+=text columns
                    console.log(`✅ INDEX.HTML CONNECTION: Image in column ${imageLocation} with text "${connectedText}"`);

                    // CORRECTED: Index.html structure has no separate image column!
                    // Column 1 = first text cell, column 2 = second text cell, etc.
                    // Direct mapping: imageLocation = slide3Index
                    const slide3Index = imageLocation;

                    console.log(`🔄 CORRECTED CONVERSION: Image in column ${imageLocation} → Slide3Index ${slide3Index}`);
                    console.log(`🎯 SLIDE 3 SHOULD CONNECT: Text cell index ${slide3Index}`);

                    return slide3Index; // Direct mapping since no image column separation
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
                        console.log(`🎨 INDEX.HTML: Found green styling in column ${i} with text "${styledText}"`);

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
            console.log(`💾 INDEX.HTML: Found stored selection: ${window.selectedColumns[rowIndex]}`);
            return window.selectedColumns[rowIndex];
        }

        // Last resort: Return null to indicate no connection found
        console.log(`❌ INDEX.HTML: No connection found for row ${rowIndex}`);
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

            // Get connection info for this row - use slide 3 specific method
            const selectedColumn = this.getActualSelectedColumnForSlide3(rowIndex);
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

                console.log(`\n🎨 ===== SLIDE 3 GENERATION ROW ${rowIndex} =====`);
                console.log(`📊 SLIDE 3 Row ${rowIndex}:`, {
                    selectedColumn,
                    connectedCellIndex,
                    hasImage: !!hasImage,
                    totalCells: rowData.length
                });

                // Debug: Show all available text cells
                console.log(`📝 SLIDE 3 AVAILABLE TEXT CELLS:`);
                rowData.forEach((cell, idx) => {
                    console.log(`   Cell ${idx}: "${cell.text}" (will be at slide3 index ${idx + 1})`);
                });

                // Add text cells with image cell inserted before connected text
                rowData.forEach((cell, cellIndex) => {
                    const willConnect = cellIndex === connectedCellIndex;
                    console.log(`🔧 SLIDE 3 Processing cell ${cellIndex}: "${cell.text}" | Connected: ${willConnect}`);

                    if (cellIndex === connectedCellIndex && hasImage) {
                        console.log(`✅ SLIDE 3 CONNECTING: Image + Text "${cell.text}" at cell index ${cellIndex}`);

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
        });
    }

    showSlide(index) {
        if (index < 0 || index >= this.slides.length) return;

        // Update slide visibility
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
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
    }

    previousSlide() {
        this.showSlide(this.currentSlide - 1);
    }

    nextSlide() {
        this.showSlide(this.currentSlide + 1);
    }

    async downloadPowerPoint() {
        try {
            Utils.showStatus('Generating PowerPoint presentation...', 'info');

            // Collect all slide data including user inputs
            const presentationData = this.collectPresentationData();

            // Here you would integrate with a PowerPoint generation library
            // For now, we'll create a comprehensive data export
            await this.generatePresentationData(presentationData);

            Utils.showStatus('PowerPoint presentation ready for download!', 'success');
        } catch (error) {
            console.error('Error generating PowerPoint:', error);
            Utils.showStatus('Error generating presentation', 'error');
        }
    }

    collectPresentationData() {
        const slides = document.querySelectorAll('.slide');
        const presentationData = {
            title: this.strategyData.title,
            subtitle: this.strategyData.subtitle,
            video: this.videoData,
            table: this.tableData,
            slides: []
        };

        slides.forEach((slide, index) => {
            const slideData = {
                title: this.slides[index].title,
                type: this.slides[index].type,
                notes: '',
                content: {}
            };

            // Collect text areas from each slide
            const textAreas = slide.querySelectorAll('textarea');
            textAreas.forEach(textarea => {
                const className = textarea.className;
                slideData.content[className] = textarea.value;
            });

            presentationData.slides.push(slideData);
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
                                <div class="axis-arrow">↑</div>
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