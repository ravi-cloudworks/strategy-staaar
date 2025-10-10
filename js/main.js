// Domain Security Check - Must be first
(function() {
    const allowedDomain = 'ravi-cloudworks.github.io';
    const currentDomain = window.location.hostname;

    // Block localhost and other domains
    if (currentDomain !== allowedDomain) {
        document.body.innerHTML = '<h1>Access Denied</h1><p>This application can only run on the official domain.</p>';
        throw new Error('Unauthorized domain');
    }

    // Additional check for local development
    if (currentDomain === 'localhost' || currentDomain === '127.0.0.1' || currentDomain.includes('192.168')) {
        document.body.innerHTML = '';
        throw new Error('Local execution blocked');
    }
})();

// Core Dashboard Functionality
class MainApp {
    constructor() {
        this.selectedRow = null;
        this.imageConnections = {};
        this.init();
    }

    async init() {
        console.log('🔧 Initializing Main App...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    async setup() {
        try {
            // Initialize strategy loader
            await window.strategyLoader.init();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load lazy modules
            this.loadLazyModules();
            
            console.log('✅ Main App initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing Main App:', error);
            Utils.showStatus('Error initializing application', 'error');
        }
    }

    setupEventListeners() {
        // Step 1: Strategy Selection
        const selectAgencyBtn = document.getElementById('selectAgencyBtn');
        if (selectAgencyBtn) {
            selectAgencyBtn.addEventListener('click', () => this.openStrategyModal());
        }

        // Step 2: Video Loading
        const openVideoModalBtn = document.getElementById('openVideoModal');
        if (openVideoModalBtn) {
            openVideoModalBtn.addEventListener('click', () => this.openVideoModal());
        }

        // Step 3: Color Customization
        const colorCustomizeBtn = document.getElementById('colorCustomizeBtn');
        if (colorCustomizeBtn) {
            colorCustomizeBtn.addEventListener('click', () => this.openColorModal());
        }

        // Step 3: Download
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            // Initially disable the button
            this.updateDownloadButtonState();
            downloadBtn.addEventListener('click', () => this.openDownloadModal());
        }

        // Video player events
        const videoPlayer = document.getElementById('videoPlayer');
        if (videoPlayer) {
            videoPlayer.addEventListener('loadedmetadata', () => {
                console.log('✅ Video loaded and ready for capture');
                this.updateDownloadButtonState(); // Check if ready for download
            });
        }
    }

    loadLazyModules() {
        // Lazy load heavy features only when needed
        this.lazyLoadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
        this.lazyLoadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
    }

    lazyLoadScript(src) {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        document.head.appendChild(script);
    }

    // Strategy Modal
    async openStrategyModal() {
        try {
            console.log('🎯 openStrategyModal called');
            console.log('🔍 Current window.strategyModal:', window.strategyModal);

            // Lazy load strategy modal if not already loaded
            if (!window.strategyModal || typeof window.strategyModal.open !== 'function') {
                // Reset if it's not a proper StrategyModal instance
                if (window.strategyModal && typeof window.strategyModal.open !== 'function') {
                    console.log('🔄 Resetting invalid strategyModal instance');
                    window.strategyModal = null;
                }
                console.log('🔧 Loading strategy modal...');
                const module = await import('./strategy-modal.js');
                console.log('📦 Module loaded:', module);
                console.log('📦 Module keys:', Object.keys(module));
                console.log('🏗️ StrategyModal class:', module.StrategyModal);
                console.log('🏗️ StrategyModal type:', typeof module.StrategyModal);

                if (!module.StrategyModal) {
                    throw new Error('StrategyModal class not found in module');
                }

                console.log('🔨 Creating new StrategyModal instance...');
                window.strategyModal = new module.StrategyModal();
                console.log('✅ StrategyModal instance created:', window.strategyModal);
                console.log('✅ Instance type:', typeof window.strategyModal);
                console.log('✅ Instance keys:', Object.getOwnPropertyNames(window.strategyModal));
                console.log('✅ Instance prototype:', Object.getPrototypeOf(window.strategyModal));
                console.log('✅ Has open method:', typeof window.strategyModal.open);
                console.log('✅ Open method:', window.strategyModal.open);
            } else {
                console.log('♻️ Using existing strategyModal instance');
                console.log('♻️ Existing instance:', window.strategyModal);
                console.log('♻️ Has open method:', typeof window.strategyModal.open);
            }

            console.log('🚀 About to call open method...');
            console.log('🚀 Final check - window.strategyModal:', window.strategyModal);
            console.log('🚀 Final check - open method:', window.strategyModal.open);

            if (typeof window.strategyModal.open !== 'function') {
                throw new Error(`open is not a function. Type: ${typeof window.strategyModal.open}, Value: ${window.strategyModal.open}`);
            }

            window.strategyModal.open();
            console.log('✅ Modal opened successfully');
        } catch (error) {
            console.error('❌ Error in openStrategyModal:', error);
            console.error('❌ Error stack:', error.stack);
            Utils.showStatus('Error loading strategy selection', 'error');
        }
    }

    // Video Modal
    async openVideoModal() {
        try {
            // Lazy load video modal if not already loaded
            if (!window.videoModal || typeof window.videoModal.open !== 'function') {
                // Reset if it's not a proper VideoModal instance
                if (window.videoModal && typeof window.videoModal.open !== 'function') {
                    console.log('🔄 Resetting invalid videoModal instance');
                    window.videoModal = null;
                }
                console.log('🔧 Loading video modal...');
                const module = await import('./video-modal.js');
                console.log('📦 Video module loaded:', module);
                window.videoModal = new module.VideoModal();
                console.log('✅ VideoModal instance created:', window.videoModal);
            }
            console.log('🚀 Opening video modal...');
            window.videoModal.open();
        } catch (error) {
            console.error('❌ Error loading video modal:', error);
            Utils.showStatus('Error loading video selection', 'error');
        }
    }

    // Color Modal
    async openColorModal() {
        try {
            // Lazy load color modal if not already loaded
            if (!window.colorModal || typeof window.colorModal.open !== 'function') {
                // Reset if it's not a proper ColorModal instance
                if (window.colorModal && typeof window.colorModal.open !== 'function') {
                    console.log('🔄 Resetting invalid colorModal instance');
                    window.colorModal = null;
                }
                console.log('🔧 Loading color modal...');
                const module = await import('./color-modal.js');
                console.log('📦 Color module loaded:', module);
                window.colorModal = new module.ColorModal();
                console.log('✅ ColorModal instance created:', window.colorModal);
            }
            console.log('🚀 Opening color modal...');
            window.colorModal.open();
        } catch (error) {
            console.error('❌ Error loading color modal:', error);
            Utils.showStatus('Error loading color customization', 'error');
        }
    }

    // Download Modal
    async openDownloadModal() {
        try {
            // Lazy load download modal if not already loaded
            if (!window.downloadModal || typeof window.downloadModal.open !== 'function') {
                // Reset if it's not a proper DownloadModal instance
                if (window.downloadModal && typeof window.downloadModal.open !== 'function') {
                    console.log('🔄 Resetting invalid downloadModal instance');
                    window.downloadModal = null;
                }
                console.log('🔧 Loading download modal...');
                const module = await import('./download-modal.js');
                console.log('📦 Download module loaded:', module);
                window.downloadModal = new module.DownloadModal();
                console.log('✅ DownloadModal instance created:', window.downloadModal);
            }
            console.log('🚀 Opening download modal...');
            window.downloadModal.open();
        } catch (error) {
            console.error('❌ Error loading download modal:', error);
            Utils.showStatus('Error loading presentation generator', 'error');
        }
    }

    // Row button management
    attachRowButtonListeners() {
        const rowBtns = document.querySelectorAll('.row-btn');
        rowBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleRowSelection(e));
        });
    }

    handleRowSelection(e) {
        const button = e.target;
        const videoPlayer = document.getElementById('videoPlayer');
        
        // Check if video is loaded
        if (!videoPlayer || videoPlayer.readyState < 2) {
            Utils.showStatus('Please load a video first!', 'error');
            return;
        }

        // Remove previous selections
        document.querySelectorAll('.row-btn').forEach(b => b.classList.remove('selected'));
        document.querySelectorAll('tr').forEach(tr => tr.classList.remove('row-highlight'));

        // Select current row
        button.classList.add('selected');
        this.selectedRow = parseInt(button.dataset.row);

        // Highlight the row in table
        const tableRow = document.querySelector(`tr[data-row="${this.selectedRow}"]`);
        if (tableRow) {
            tableRow.classList.add('row-highlight');
        }

        // Automatically capture frame
        this.captureFrame();
    }

    captureFrame() {
        const videoPlayer = document.getElementById('videoPlayer');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;

        ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);

        // Add demo watermark if enabled
        if (this.watermarksEnabled) {
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText('DEMO VERSION', -50, 0);
            ctx.restore();
        }

        const dataURL = canvas.toDataURL('image/png');

        // Find the image placeholder for the selected row
        const targetRow = document.querySelector(`tr[data-row="${this.selectedRow}"]`);
        const imagePlaceholder = targetRow.querySelector('.image-placeholder');

        // Update image placeholder
        this.updateImagePlaceholder(imagePlaceholder, dataURL);

        // Set default connection to first text column
        const imageKey = `row-${this.selectedRow}`;
        this.imageConnections[imageKey] = 0;
        this.updateConnectionVisuals(this.selectedRow, 0);

        // Initialize selectedColumns global variable for presentation tick logic
        if (!window.selectedColumns) window.selectedColumns = {};
        window.selectedColumns[this.selectedRow] = 2; // Column 2 is first text column (0=header, 1=image)

        Utils.showStatus('Frame captured! Hover over image to see controls: FIT | FOCUS | MOVE', 'success');
    }

    updateImagePlaceholder(placeholder, dataURL) {
        // Remove existing content
        placeholder.innerHTML = '';

        // Add new image
        const img = document.createElement('img');
        img.src = dataURL;
        img.className = 'captured-image';
        img.draggable = false;
        img.dataset.mode = 'fit';
        img.dataset.originalSrc = dataURL;

        // Apply FIT styling by default
        img.classList.add('fit-complete');
        img.style.objectFit = 'contain';

        // Update download button state when image is added
        setTimeout(() => this.updateDownloadButtonState(), 100);
        img.style.objectPosition = 'center center';

        // Add control buttons
        const controls = document.createElement('div');
        controls.className = 'image-controls';
        controls.innerHTML = `
            <button class="image-btn" data-mode="fit" title="Fit Complete Image">
                <i class="bi bi-arrows-fullscreen"></i>
            </button>
            <button class="image-btn" data-mode="pan" title="Focus Area">
                <i class="bi bi-bullseye"></i>
            </button>
            <button class="image-btn" data-mode="move" title="Move Image">
                <i class="bi bi-arrows-move"></i>
            </button>
        `;

        // Add event listeners to control buttons
        controls.querySelectorAll('.image-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleImageMode(btn.dataset.mode, img, controls, placeholder);
            });
        });

        placeholder.appendChild(img);
        placeholder.appendChild(controls);
        placeholder.classList.add('has-image');

        // Attach drag listeners
        this.attachDragListeners(placeholder);
    }

    handleImageMode(mode, img, controls, placeholder) {
        // Update active button
        controls.querySelectorAll('.image-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Reset image classes and transforms
        img.classList.remove('fit-complete');
        img.style.transform = '';
        img.style.cursor = '';
        img.style.transformOrigin = '';
        img.style.objectPosition = '';

        switch (mode) {
            case 'fit':
                this.handleFitMode(img, placeholder);
                break;
            case 'pan':
                this.handlePanMode(img);
                break;
            case 'move':
                this.handleMoveMode(img, placeholder);
                break;
        }
    }

    handleFitMode(img, placeholder) {
        const originalSrc = img.dataset.originalSrc;
        const rowIndex = parseInt(placeholder.closest('tr').dataset.row);

        img.src = originalSrc;
        img.dataset.mode = 'fit';
        img.classList.add('fit-complete');
        img.style.objectFit = 'contain';
        img.style.objectPosition = 'center center';

        // Clear any stored crops
        const rowKey = `row-${rowIndex}`;
        if (window.croppedImages) {
            delete window.croppedImages[rowKey];
        }

        console.log(`✅ Applied FIT mode - showing complete original for row ${rowIndex}`);
        Utils.showStatus('FIT mode: Complete original image displayed', 'success');
    }

    async handlePanMode(img) {
        try {
            // Lazy load crop modal for pan functionality
            if (!window.cropModal || typeof window.cropModal.openPanModal !== 'function') {
                // Reset if it's not a proper CropModal instance
                if (window.cropModal && typeof window.cropModal.openPanModal !== 'function') {
                    console.log('🔄 Resetting invalid cropModal instance');
                    window.cropModal = null;
                }
                console.log('🔧 Loading crop modal...');
                const module = await import('./crop-modal.js');
                console.log('📦 Crop module loaded:', module);
                window.cropModal = new module.CropModal();
                console.log('✅ CropModal instance created:', window.cropModal);
            }
            console.log('🚀 Opening pan modal...');
            window.cropModal.openPanModal(img);
            Utils.showStatus('PAN mode: Adjust view and apply changes', 'success');
        } catch (error) {
            console.error('❌ Error loading crop modal:', error);
            Utils.showStatus('Error loading pan functionality', 'error');
        }
    }

    handleMoveMode(img, placeholder) {
        img.dataset.mode = 'move';
        this.enableColumnDrag(placeholder);
        Utils.showStatus('MOVE mode: Drag this column to reposition within the row', 'success');
    }

    enableColumnDrag(placeholder) {
        placeholder.style.cursor = 'grab';
        placeholder.style.border = '2px dashed #4CAF50';

        const img = placeholder.querySelector('.captured-image');
        if (img) {
            img.dataset.mode = 'move';
        }

        setTimeout(() => {
            placeholder.style.border = '';
        }, 3000);
    }

    attachDragListeners(placeholder) {
        let isDragging = false;
        let dragStartX, dragStartY;
        let draggedElement = null;
        let draggedCell = null;
        let originalRow = null;

        placeholder.addEventListener('mousedown', (e) => {
            // Only start dragging if in move mode and clicking on image controls
            if (e.target.classList.contains('image-btn') && e.target.dataset.mode === 'move') {
                setTimeout(() => {
                    const img = placeholder.querySelector('.captured-image');
                    if (img && img.dataset.mode === 'move') {
                        placeholder.style.cursor = 'grab';
                    }
                }, 10);
                return;
            }

            // Don't start dragging if clicking on other control buttons
            if (e.target.classList.contains('image-btn')) {
                return;
            }

            // Only start dragging if we have an image and it's in move mode
            if (placeholder.classList.contains('has-image')) {
                const img = placeholder.querySelector('.captured-image');
                if (!img || img.dataset.mode !== 'move') {
                    return;
                }

                e.preventDefault();
                isDragging = true;
                draggedElement = placeholder;
                draggedCell = placeholder.parentElement;
                originalRow = draggedCell.parentElement;

                dragStartX = e.clientX;
                dragStartY = e.clientY;

                placeholder.style.opacity = '0.7';
                placeholder.style.cursor = 'grabbing';
                placeholder.style.zIndex = '1000';
                placeholder.style.position = 'relative';

                Utils.showStatus('Drag to reposition this column - drop on target position', 'success');
            }
        });

        // Global mouse events for drag and drop
        document.addEventListener('mousemove', (e) => {
            if (isDragging && draggedElement) {
                e.preventDefault();
                draggedElement.style.transform = `translate(${e.clientX - dragStartX}px, ${e.clientY - dragStartY}px)`;

                // Highlight drop targets
                const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
                const targetCell = elementBelow ? elementBelow.closest('td') : null;

                if (originalRow) {
                    const allCells = originalRow.querySelectorAll('td:not(.category-cell)');
                    allCells.forEach(cell => {
                        if (cell !== draggedCell) {
                            cell.style.backgroundColor = '';
                            cell.style.border = '';
                        }
                    });

                    if (targetCell && targetCell !== draggedCell &&
                        targetCell.parentElement === originalRow &&
                        !targetCell.classList.contains('category-cell')) {
                        targetCell.style.backgroundColor = 'rgba(255, 193, 7, 0.4)';
                        targetCell.style.border = '2px solid #FF9800';
                    }
                }
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (isDragging && draggedElement && draggedCell) {
                e.preventDefault();

                // Reset visual styles
                draggedElement.style.transform = '';
                draggedElement.style.opacity = '1';
                draggedElement.style.cursor = 'move';
                draggedElement.style.zIndex = '';
                draggedElement.style.position = '';

                // Find valid drop target
                const targetCell = this.getValidDropTarget(e, originalRow);

                if (targetCell && targetCell !== draggedCell) {
                    this.reorderColumns(draggedCell, targetCell);
                    Utils.showStatus('Column moved to new position!', 'success');
                } else {
                    Utils.showStatus('Drop on another valid column position', 'error');
                }

                // Reset all highlights
                const allCells = originalRow.querySelectorAll('td');
                allCells.forEach(cell => {
                    cell.style.backgroundColor = '';
                    cell.style.border = '';
                });

                isDragging = false;
                draggedElement = null;
                draggedCell = null;
                originalRow = null;
            }
        });
    }

    getValidDropTarget(e, originalRow) {
        const allCells = Array.from(originalRow.querySelectorAll('td:not(.category-cell)'));
        const textCells = allCells.filter(cell => cell.classList.contains('text-cell'));
        const validDropCells = textCells.slice(0, -1);

        const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
        let targetCell = elementBelow ? elementBelow.closest('td') : null;

        if (targetCell && validDropCells.includes(targetCell)) {
            return targetCell;
        }

        // Find closest valid cell
        const mouseX = e.clientX;
        let closestCell = null;
        let minDistance = Infinity;

        validDropCells.forEach(cell => {
            const rect = cell.getBoundingClientRect();
            const cellCenterX = rect.left + rect.width / 2;
            const distance = Math.abs(mouseX - cellCenterX);

            if (distance < minDistance && distance < 100) {
                minDistance = distance;
                closestCell = cell;
            }
        });

        return closestCell;
    }

    reorderColumns(sourceCell, targetCell) {
        const row = sourceCell.parentElement;
        const allCells = Array.from(row.querySelectorAll('td:not(.category-cell)'));

        const sourceIndex = allCells.indexOf(sourceCell);
        const targetIndex = allCells.indexOf(targetCell);

        const rowIndex = parseInt(sourceCell.closest('tr').dataset.row);
        const imageKey = `row-${rowIndex}`;
        const newTextColumnIndex = targetIndex;

        // Remove source cell and insert at target position
        sourceCell.remove();

        if (targetIndex === 0) {
            const categoryCell = row.querySelector('.category-cell');
            row.insertBefore(sourceCell, categoryCell.nextSibling);
        } else {
            const remainingCells = Array.from(row.querySelectorAll('td:not(.category-cell)'));
            if (targetIndex >= remainingCells.length) {
                row.appendChild(sourceCell);
            } else {
                row.insertBefore(sourceCell, remainingCells[targetIndex]);
            }
        }

        // Update connection mapping
        this.imageConnections[imageKey] = newTextColumnIndex;
        this.updateConnectionVisuals(rowIndex, newTextColumnIndex);

        // Update selectedColumns global variable for presentation tick logic
        if (!window.selectedColumns) window.selectedColumns = {};
        window.selectedColumns[rowIndex] = newTextColumnIndex + 2; // +2 because: 0=header, 1=image column
    }

    updateConnectionVisuals(rowIndex, textColumnIndex) {
        const targetRow = document.querySelector(`tr[data-row="${rowIndex}"]`);
        if (!targetRow) return;

        // Clear previous connections
        targetRow.querySelectorAll('.connected-pair').forEach(el => {
            el.classList.remove('connected-pair');
        });

        // Remove existing arrows for this row
        document.querySelectorAll(`.connection-arrow[data-row="${rowIndex}"]`).forEach(arrow => {
            arrow.remove();
        });

        // Add new connections
        const imagePlaceholder = targetRow.querySelector('.image-placeholder');
        const textCells = targetRow.querySelectorAll('.text-cell');

        if (imagePlaceholder && textCells[textColumnIndex]) {
            imagePlaceholder.classList.add('connected-pair');
            textCells[textColumnIndex].classList.add('connected-pair');

            this.createConnectionArrow(imagePlaceholder, textCells[textColumnIndex], rowIndex);
        }
    }

    createConnectionArrow(sourceElement, targetElement, rowIndex) {
        const sourceRect = sourceElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        const table = document.getElementById('insightTable');
        const tableRect = table.getBoundingClientRect();

        const startX = sourceRect.right - tableRect.left;
        const startY = (sourceRect.top + sourceRect.height / 2) - tableRect.top;
        const endX = targetRect.left - tableRect.left;
        const length = endX - startX - 4;

        const arrow = document.createElement('div');
        arrow.className = 'connection-arrow';
        arrow.dataset.row = rowIndex;
        arrow.style.left = (startX + 2) + 'px';
        arrow.style.top = startY + 'px';
        arrow.style.width = length + 'px';
        arrow.style.height = '3px';

        table.appendChild(arrow);

        // Animation
        arrow.style.opacity = '0';
        arrow.style.transform = 'translateY(-50%) scaleX(0)';
        arrow.style.transformOrigin = 'left center';
        arrow.style.transition = 'all 0.3s ease';

        setTimeout(() => {
            arrow.style.opacity = '1';
            arrow.style.transform = 'translateY(-50%) scaleX(1)';
        }, 50);
    }

    // Public methods for external access
    getImageConnections() {
        return this.imageConnections;
    }

    getCurrentStrategy() {
        return window.strategyLoader.getCurrentStrategy();
    }

    updateDownloadButtonState() {
        const downloadBtn = document.getElementById('downloadBtn');
        if (!downloadBtn) return;

        const isReady = this.isReadyForDownload();

        if (isReady) {
            downloadBtn.disabled = false;
            downloadBtn.style.opacity = '1';
            downloadBtn.style.cursor = 'pointer';
            downloadBtn.title = '';
        } else {
            downloadBtn.disabled = true;
            downloadBtn.style.opacity = '0.5';
            downloadBtn.style.cursor = 'not-allowed';
            downloadBtn.title = 'Please load a video and fill all image boxes first';
        }
    }

    isReadyForDownload() {
        // Check if video is loaded
        const videoPlayer = document.getElementById('videoPlayer');
        const videoReady = videoPlayer && videoPlayer.src && videoPlayer.readyState >= 2;

        // Check if all image boxes are filled
        const imageBoxes = document.querySelectorAll('.image-placeholder');
        const allImagesFilled = Array.from(imageBoxes).every(box => {
            const img = box.querySelector('img');
            return img && img.src && !img.src.includes('data:image/svg+xml'); // Exclude placeholder SVGs
        });

        return videoReady && allImagesFilled;
    }
}

// Initialize main app
window.mainApp = new MainApp();