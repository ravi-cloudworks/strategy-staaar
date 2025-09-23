// Image Cropping Modal
export class CropModal {
    constructor() {
        this.modal = null;
        this.currentPanImage = null;
        this.init();
    }

    init() {
        this.createModalHTML();
        this.setupEventListeners();
    }

    createModalHTML() {
        let modal = document.getElementById('cropModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'cropModal';
            modal.className = 'crop-modal';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="crop-container">
                <h3 style="margin: 0 0 20px 0; text-align: center; font-size: 18px; font-weight: 600; color: #111827;">Select Focus Area</h3>
                <div style="position: relative; display: inline-block;">
                    <img id="cropImage" class="crop-image" src="" alt="Crop Preview" style="max-width: 70vw; max-height: 60vh; position: relative;">
                    <div class="crop-selector" id="cropSelector" style="position: absolute; border: 3px solid #10b981; background: rgba(16, 185, 129, 0.15); cursor: move; pointer-events: auto; width: 240px; height: 160px; border-radius: 4px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                        <div style="position: absolute; top: -30px; left: 50%; transform: translateX(-50%); background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; white-space: nowrap;">3:2 Rectangle - Move to Focus Area</div>
                    </div>
                </div>

                <div style="margin: 16px 0; padding: 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 13px; color: #6b7280; line-height: 1.4;">
                    <div style="font-weight: 500; color: #374151; margin-bottom: 6px;">How to use:</div>
                    • <strong>Fixed 3:2 rectangle</strong> matches final output dimensions<br>
                    • <strong>Drag to position</strong> the rectangle over your focus area<br>
                    • <strong>Exact area</strong> inside rectangle will be captured
                </div>

                <div class="crop-controls" style="display: flex; gap: 8px; justify-content: center; margin-top: 20px;">
                    <button class="crop-btn confirm" id="confirmCrop" style="margin: 0 6px; padding: 10px 20px; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.15s ease; background: #1f2937; color: #ffffff; border-color: #1f2937;">Apply Focus</button>
                    <button class="crop-btn cancel" id="cancelCrop" style="margin: 0 6px; padding: 10px 20px; border: 1px solid #d1d5db; border-radius: 6px; cursor: pointer; font-weight: 500; font-size: 14px; transition: all 0.15s ease; background: #ffffff; color: #6b7280; border-color: #d1d5db;">Cancel</button>
                </div>
            </div>
        `;

        this.modal = modal;
    }

    setupEventListeners() {
        // Confirm crop button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'confirmCrop') {
                this.applyFocus();
            }
        });

        // Cancel crop button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'cancelCrop') {
                this.close();
            }
        });
    }

    openPanModal(img) {
        this.currentPanImage = img;
        const cropImage = document.getElementById('cropImage');

        // Set the image source
        cropImage.src = img.dataset.originalSrc || img.src;

        // Initialize fixed 3:2 rectangle selector
        const cropSelector = document.getElementById('cropSelector');
        cropSelector.style.display = 'block';

        // Wait for image to load, then set up fixed rectangle
        cropImage.onload = () => {
            this.initializeFixedRectangle();
        };

        this.modal.classList.add('show');
    }

    close() {
        this.modal.classList.remove('show');
        this.currentPanImage = null;
    }

    initializeFixedRectangle() {
        const cropSelector = document.getElementById('cropSelector');
        const cropImage = document.getElementById('cropImage');

        if (!cropSelector || !cropImage) return;

        // Position rectangle in center of image initially
        const imageRect = cropImage.getBoundingClientRect();
        const containerRect = cropImage.parentElement.getBoundingClientRect();

        // Calculate center position
        const centerX = (imageRect.width - 240) / 2; // 240px rectangle width
        const centerY = (imageRect.height - 160) / 2; // 160px rectangle height

        // Ensure rectangle stays within image bounds
        const maxX = Math.max(0, imageRect.width - 240);
        const maxY = Math.max(0, imageRect.height - 160);

        const initialX = Math.max(0, Math.min(centerX, maxX));
        const initialY = Math.max(0, Math.min(centerY, maxY));

        // Position the fixed rectangle
        cropSelector.style.left = initialX + 'px';
        cropSelector.style.top = initialY + 'px';

        // Make rectangle draggable (but not resizable)
        this.makeRectangleDraggable();

        console.log('✅ Fixed 3:2 rectangle initialized at center');
    }

    makeRectangleDraggable() {
        const cropSelector = document.getElementById('cropSelector');
        const cropImage = document.getElementById('cropImage');
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        cropSelector.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = parseInt(cropSelector.style.left) || 0;
            initialTop = parseInt(cropSelector.style.top) || 0;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            let newLeft = initialLeft + deltaX;
            let newTop = initialTop + deltaY;

            // Keep rectangle within image bounds
            const imageRect = cropImage.getBoundingClientRect();
            const containerRect = cropImage.parentElement.getBoundingClientRect();

            const maxLeft = imageRect.width - 240; // 240px rectangle width
            const maxTop = imageRect.height - 160; // 160px rectangle height

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            cropSelector.style.left = newLeft + 'px';
            cropSelector.style.top = newTop + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    applyFocus() {
        if (!this.currentPanImage) return;

        const cropImage = document.getElementById('cropImage');
        const selector = document.getElementById('cropSelector');

        // Get selection coordinates
        const imageRect = cropImage.getBoundingClientRect();
        const selectorLeft = parseInt(selector.style.left);
        const selectorTop = parseInt(selector.style.top);
        const selectorWidth = parseInt(selector.style.width);
        const selectorHeight = parseInt(selector.style.height);

        // Calculate exact rectangle coordinates (0-1) for precise cropping
        const rectLeft = selectorLeft / imageRect.width;
        const rectTop = selectorTop / imageRect.height;
        const rectRight = (selectorLeft + selectorWidth) / imageRect.width;
        const rectBottom = (selectorTop + selectorHeight) / imageRect.height;

        console.log('🎯 Rectangle Coordinates:', {
            left: rectLeft.toFixed(3),
            top: rectTop.toFixed(3),
            right: rectRight.toFixed(3),
            bottom: rectBottom.toFixed(3),
            width: (rectRight - rectLeft).toFixed(3),
            height: (rectBottom - rectTop).toFixed(3)
        });

        // Get row index and original image source
        const rowIndex = parseInt(this.currentPanImage.closest('tr').dataset.row);
        const originalSrc = this.currentPanImage.dataset.originalSrc;

        // Store reference to current image before closing modal
        const targetImage = this.currentPanImage;

        // Generate exact rectangle crop from selected area
        this.generateExactRectangleCrop(originalSrc, rectLeft, rectTop, rectRight, rectBottom).then(croppedUrl => {
            // Store the cropped image
            const rowKey = `row-${rowIndex}`;
            if (!window.croppedImages) {
                window.croppedImages = {};
            }
            window.croppedImages[rowKey] = croppedUrl;

            // Update image display using stored reference
            targetImage.src = croppedUrl;
            targetImage.dataset.mode = 'pan';

            console.log(`✅ Applied EXACT PAN rectangle crop for row ${rowIndex}`);

            // Update download button state when image is cropped
            if (window.mainApp && window.mainApp.updateDownloadButtonState) {
                setTimeout(() => window.mainApp.updateDownloadButtonState(), 100);
            }

            // Show success message after the operation completes
            Utils.showStatus('Focus area applied - rectangle crop generated!', 'success');
        }).catch(error => {
            console.error('❌ Error generating crop:', error);
            Utils.showStatus('Error applying focus area', 'error');
        });

        // Close modal immediately
        this.close();
    }

    generateExactRectangleCrop(originalImageSrc, rectLeft, rectTop, rectRight, rectBottom) {
        const RECTANGLE_WIDTH = 1200;
        const RECTANGLE_HEIGHT = 800;

        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Set standard rectangle dimensions
                canvas.width = RECTANGLE_WIDTH;
                canvas.height = RECTANGLE_HEIGHT;

                // Calculate source crop area from the rectangle coordinates
                const sourceX = rectLeft * img.width;
                const sourceY = rectTop * img.height;
                const sourceWidth = (rectRight - rectLeft) * img.width;
                const sourceHeight = (rectBottom - rectTop) * img.height;

                console.log('🔍 Exact Crop Details:', {
                    originalSize: `${img.width}x${img.height}`,
                    sourceRect: `${sourceX.toFixed(0)},${sourceY.toFixed(0)} ${sourceWidth.toFixed(0)}x${sourceHeight.toFixed(0)}`,
                    outputSize: `${RECTANGLE_WIDTH}x${RECTANGLE_HEIGHT}`
                });

                // Draw the exact selected rectangle area
                ctx.drawImage(
                    img,
                    sourceX, sourceY, sourceWidth, sourceHeight,
                    0, 0, RECTANGLE_WIDTH, RECTANGLE_HEIGHT
                );

                resolve(canvas.toDataURL('image/png'));
            };
            img.onerror = () => resolve(originalImageSrc); // Fallback
            img.src = originalImageSrc;
        });
    }
}