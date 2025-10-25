// Branva Image Manipulation Module
// Adapted from main.js for multi-matrix support

class BranvaImageManipulation {
    constructor() {
        this.imageConnections = {};
        this.init();
    }

    init() {
        // console.log('🖼️ Initializing Branva Image Manipulation...');
    }

    // Update image placeholder with captured frame
    updateImagePlaceholder(placeholder, dataURL, matrixId = null) {
        // Remove existing content
        placeholder.innerHTML = '';

        // Add new image
        const img = document.createElement('img');
        img.src = dataURL;
        img.className = 'captured-image';
        img.draggable = false;
        img.dataset.mode = 'fit';
        img.dataset.originalSrc = dataURL;
        if (matrixId) {
            img.dataset.matrixId = matrixId;
        }

        // Apply FIT styling by default
        img.classList.add('fit-complete');
        img.style.objectFit = 'contain';
        img.style.objectPosition = 'center center';

        // Add control buttons with bigger icons for better UX
        const controls = document.createElement('div');

        // Check if we're in a matrix environment
        const isMatrixEnvironment = placeholder.closest('.strategy-matrix') !== null;

        if (isMatrixEnvironment) {
            controls.className = 'image-controls matrix-controls';
            console.log('🎮 Creating matrix-specific controls for matrix environment');
        } else {
            controls.className = 'image-controls';
            console.log('🎮 Creating regular controls for non-matrix environment');
        }

        controls.innerHTML = `
            <button class="image-btn large-btn" data-mode="fit" title="Fit Complete Image">
                <i class="bi bi-arrows-fullscreen"></i>
                <span class="btn-label">FIT</span>
            </button>
            <button class="image-btn large-btn" data-mode="pan" title="Focus Area">
                <i class="bi bi-bullseye"></i>
                <span class="btn-label">PAN</span>
            </button>
            <button class="image-btn large-btn" data-mode="move" title="Move Image">
                <i class="bi bi-arrows-move"></i>
                <span class="btn-label">MOVE</span>
            </button>
        `;

        // Add event listeners to control buttons
        controls.querySelectorAll('.image-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Use matrix controls if available, otherwise use local handling
                if (window.branvaMatrixControls) {
                    window.branvaMatrixControls.handleImageMode(btn.dataset.mode, img, controls, placeholder);
                } else {
                    this.handleImageMode(btn.dataset.mode, img, controls, placeholder);
                }
            });
        });

        placeholder.appendChild(img);
        placeholder.appendChild(controls);
        placeholder.classList.add('has-image');


        // Attach drag listeners for matrix environments
        if (matrixId) {
            this.attachMatrixDragListeners(placeholder, matrixId);
        }

        console.log('🖼️ Image placeholder updated with controls');
    }

    // Handle different image display modes
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

    // FIT mode - show complete original image
    handleFitMode(img, placeholder) {
        const originalSrc = img.dataset.originalSrc;
        const matrixId = img.dataset.matrixId;

        img.src = originalSrc;
        img.dataset.mode = 'fit';
        img.classList.add('fit-complete');
        img.style.objectFit = 'contain';
        img.style.objectPosition = 'center center';

        // Clear any stored crops for this matrix
        if (matrixId && window.branvaImageData?.matrices?.[matrixId]?.crops) {
            const imageKey = this.getImageKey(placeholder);
            delete window.branvaImageData.matrices[matrixId].crops[imageKey];
        }

        console.log(`✅ Applied FIT mode for matrix ${matrixId}`);
        if (window.showToast) {
            // window.showToast('FIT mode: Complete original image displayed', 'success');
        }
    }

    // PAN mode - focus on specific area
    async handlePanMode(img) {
        try {
            // For now, implement a simple pan mode with CSS transforms
            // In future, can integrate with crop modal functionality
            img.dataset.mode = 'pan';
            img.style.cursor = 'grab';

            let isDragging = false;
            let startX, startY;
            let currentTransform = { x: 0, y: 0, scale: 1 };

            const handleMouseDown = (e) => {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                img.style.cursor = 'grabbing';
            };

            const handleMouseMove = (e) => {
                if (!isDragging) return;

                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;

                currentTransform.x += deltaX;
                currentTransform.y += deltaY;

                img.style.transform = `translate(${currentTransform.x}px, ${currentTransform.y}px) scale(${currentTransform.scale})`;

                startX = e.clientX;
                startY = e.clientY;
            };

            const handleMouseUp = () => {
                isDragging = false;
                img.style.cursor = 'grab';
            };

            // Add event listeners
            img.addEventListener('mousedown', handleMouseDown);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            // Store cleanup function
            img.dataset.cleanup = 'pan';

            if (window.showToast) {
                // window.showToast('PAN mode: Drag to focus on area', 'success');
            }
        } catch (error) {
            console.error('❌ Error in pan mode:', error);
            if (window.showToast) {
                window.showToast('Error in pan mode', 'error');
            }
        }
    }

    // MOVE mode - enable column repositioning
    handleMoveMode(img, placeholder) {
        img.dataset.mode = 'move';
        this.enableColumnDrag(placeholder);
        if (window.showToast) {
            // window.showToast('MOVE mode: Drag to reposition within matrix', 'success');
        }
    }

    // Enable drag and drop for matrix columns
    enableColumnDrag(placeholder) {
        placeholder.style.cursor = 'grab';
        placeholder.style.border = '2px dashed #4CAF50';

        const img = placeholder.querySelector('.captured-image');
        if (img) {
            img.dataset.mode = 'move';
        }

        // Remove visual indication after 3 seconds
        setTimeout(() => {
            placeholder.style.border = '';
        }, 3000);
    }

    // Attach drag listeners for matrix environments
    attachMatrixDragListeners(placeholder, matrixId) {
        let isDragging = false;
        let dragStartX, dragStartY;
        let draggedElement = null;
        let originalPosition = null;

        placeholder.addEventListener('mousedown', (e) => {
            // Only start dragging if in move mode and not clicking control buttons
            if (e.target.classList.contains('image-btn')) {
                return;
            }

            const img = placeholder.querySelector('.captured-image');
            if (placeholder.classList.contains('has-image') && img?.dataset.mode === 'move') {
                e.preventDefault();
                isDragging = true;
                draggedElement = placeholder;
                originalPosition = placeholder.parentElement;

                dragStartX = e.clientX;
                dragStartY = e.clientY;

                placeholder.style.opacity = '0.7';
                placeholder.style.cursor = 'grabbing';
                placeholder.style.zIndex = '1000';
                placeholder.style.position = 'relative';

                if (window.showToast) {
                    // window.showToast('Drag to reposition - drop on target', 'success');
                }
            }
        });

        // Global mouse events for drag and drop
        document.addEventListener('mousemove', (e) => {
            if (isDragging && draggedElement) {
                e.preventDefault();
                const deltaX = e.clientX - dragStartX;
                const deltaY = e.clientY - dragStartY;
                draggedElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

                // Highlight potential drop targets in the same matrix
                this.highlightDropTargets(e, matrixId, originalPosition);
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (isDragging && draggedElement) {
                e.preventDefault();

                // Reset visual styles
                draggedElement.style.transform = '';
                draggedElement.style.opacity = '1';
                draggedElement.style.cursor = 'grab';
                draggedElement.style.zIndex = '';
                draggedElement.style.position = '';

                // Handle drop logic
                this.handleMatrixDrop(e, matrixId, draggedElement, originalPosition);

                // Reset highlights
                this.clearDropTargetHighlights(matrixId);

                isDragging = false;
                draggedElement = null;
                originalPosition = null;
            }
        });
    }

    // Highlight valid drop targets during drag
    highlightDropTargets(e, matrixId, originalPosition) {
        // Clear previous highlights
        this.clearDropTargetHighlights(matrixId);

        // Find element under cursor
        const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
        const targetCell = elementBelow?.closest('.matrix-cell');

        // Highlight if valid drop target
        if (targetCell && targetCell !== originalPosition && this.isValidDropTarget(targetCell, matrixId)) {
            targetCell.style.backgroundColor = 'rgba(255, 193, 7, 0.4)';
            targetCell.style.border = '2px solid #FF9800';
        }
    }

    // Clear drop target highlights
    clearDropTargetHighlights(matrixId) {
        const matrixContainer = document.querySelector(`[data-matrix-id="${matrixId}"]`);
        if (matrixContainer) {
            const cells = matrixContainer.querySelectorAll('.matrix-cell');
            cells.forEach(cell => {
                cell.style.backgroundColor = '';
                cell.style.border = '';
            });
        }
    }

    // Check if target is valid for dropping
    isValidDropTarget(targetCell, matrixId) {
        // Add logic to determine if the target cell is valid
        // For now, allow dropping on any cell in the same matrix
        const matrixContainer = targetCell.closest(`[data-matrix-id="${matrixId}"]`);
        return matrixContainer !== null;
    }

    // Handle drop completion in matrix
    handleMatrixDrop(e, matrixId, draggedElement, originalPosition) {
        const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
        const targetCell = elementBelow?.closest('.matrix-cell');

        if (targetCell && targetCell !== originalPosition && this.isValidDropTarget(targetCell, matrixId)) {
            // Perform the move
            this.moveImageToCell(draggedElement, targetCell, matrixId);
            if (window.showToast) {
                // window.showToast('Image moved to new position!', 'success');
            }
        } else {
            if (window.showToast) {
                window.showToast('Drop on valid cell in same matrix', 'warning');
            }
        }
    }

    // Move image from one cell to another
    moveImageToCell(imageElement, targetCell, matrixId) {
        // Store image data
        const imageData = this.extractImageData(imageElement);

        // Clear source cell
        const sourceCell = imageElement.parentElement;
        sourceCell.innerHTML = '';
        sourceCell.classList.remove('has-image');

        // Clear target cell
        targetCell.innerHTML = '';

        // Add image to target cell
        this.updateImagePlaceholder(targetCell, imageData.src, matrixId);

        // Update storage
        this.updateImageStorage(imageData, targetCell, matrixId);

        console.log(`🖼️ Image moved within matrix ${matrixId}`);
    }

    // Extract image data for transfer
    extractImageData(imageElement) {
        const img = imageElement.querySelector('.captured-image');
        return {
            src: img?.dataset.originalSrc || img?.src,
            mode: img?.dataset.mode || 'fit',
            transform: img?.style.transform || ''
        };
    }

    // Update image storage when moved
    updateImageStorage(imageData, targetCell, matrixId) {
        if (!window.branvaImageData?.matrices?.[matrixId]) return;

        const imageKey = this.getImageKey(targetCell);
        window.branvaImageData.matrices[matrixId].images[imageKey] = {
            src: imageData.src,
            mode: imageData.mode,
            transform: imageData.transform,
            timestamp: new Date().toISOString()
        };
    }

    // Get unique key for image storage
    getImageKey(cell) {
        const row = cell.dataset.row || cell.closest('[data-row]')?.dataset.row;
        const col = cell.dataset.col || cell.closest('[data-col]')?.dataset.col;
        return `row-${row}-col-${col}`;
    }

    // Public method to get image data for a specific matrix
    getMatrixImages(matrixId) {
        return window.branvaImageData?.matrices?.[matrixId]?.images || {};
    }

    // Public method to clear all images in a matrix
    clearMatrixImages(matrixId) {
        if (window.branvaImageData?.matrices?.[matrixId]) {
            window.branvaImageData.matrices[matrixId].images = {};

            // Clear visual elements
            const matrixContainer = document.querySelector(`[data-matrix-id="${matrixId}"]`);
            if (matrixContainer) {
                const imagePlaceholders = matrixContainer.querySelectorAll('.image-placeholder');
                imagePlaceholders.forEach(placeholder => {
                    placeholder.innerHTML = '';
                    placeholder.classList.remove('has-image');
                });
            }
        }
    }

    // Cleanup method for removing event listeners
    cleanup() {
        // Remove any global event listeners if needed
        console.log('🖼️ Cleaning up image manipulation...');
    }
}

// Export for global use
window.BranvaImageManipulation = BranvaImageManipulation;

// Initialize global instance
window.branvaImageManipulation = new BranvaImageManipulation();

// console.log('🖼️ Branva Image Manipulation module loaded');