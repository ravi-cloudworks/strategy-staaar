// Branva Matrix Image Controls
// Handles FIT, PAN, and MOVE controls specifically for strategy matrix images
// Based on dashboard.html controls with matrix-specific enhancements

class BranvaMatrixControls {
    constructor() {
        this.isDragging = false;
        this.dragData = {
            startX: 0,
            startY: 0,
            draggedElement: null,
            draggedCell: null,
            originalRow: null
        };
        this.init();
    }

    init() {
        // console.log('🎮 Initializing Branva Matrix Controls');
        this.setupGlobalDragListeners();
    }

    // Main method to handle image modes (called from branva-image-manipulation.js)
    handleImageMode(mode, img, controls, placeholder) {
        // console.log(`🎮 Matrix Controls: Handling ${mode} mode`);

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
                this.handlePanMode(img, placeholder);
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

        // Store data for matrix if applicable
        if (matrixId) {
            const imageData = {
                src: originalSrc,
                originalSrc: originalSrc,
                mode: 'fit',
                transform: '',
                position: { x: 0.5, y: 0.5 }
            };
            window.branvaImageData.storeImage(matrixId, placeholder.id, imageData);
        }

        console.log('✅ FIT mode applied - showing complete original image');
        if (window.showToast) {
            // window.showToast('FIT mode: Complete original image displayed', 'success');
        }
    }

    // PAN mode - open cropping/focus modal
    async handlePanMode(img, placeholder) {
        try {
            console.log('🔍 Opening PAN mode for focused area selection');

            // For now, implement a simple pan mode by allowing object-position adjustment
            img.dataset.mode = 'pan';
            img.style.objectFit = 'cover';
            img.style.cursor = 'move';

            // Add pan functionality
            this.enablePanInteraction(img, placeholder);

            if (window.showToast) {
                // window.showToast('PAN mode: Click and drag to adjust focus area', 'success');
            }
        } catch (error) {
            console.error('❌ Error in PAN mode:', error);
            if (window.showToast) {
                window.showToast('Error enabling pan mode', 'error');
            }
        }
    }

    // MOVE mode - enable column dragging with matrix fixed
    handleMoveMode(img, placeholder) {
        console.log('🔄 MOVE mode activated - matrix will be fixed');

        img.dataset.mode = 'move';
        placeholder.style.cursor = 'grab';
        placeholder.style.border = '2px dashed #4CAF50';

        // **MATRIX-SPECIFIC FIX**: Fix the matrix table to prevent scrolling/movement
        this.fixMatrix(true);

        // Visual feedback
        setTimeout(() => {
            placeholder.style.border = '';
        }, 3000);

        if (window.showToast) {
            // window.showToast('MOVE mode: Drag this image to another column. Matrix is now fixed.', 'success');
        }
    }

    // Enable pan interaction for adjusting focus area
    enablePanInteraction(img, placeholder) {
        let isPanning = false;
        let startX, startY, startObjectPosition;

        const onMouseDown = (e) => {
            e.preventDefault();
            e.stopPropagation();
            isPanning = true;
            startX = e.clientX;
            startY = e.clientY;

            // Parse current object position
            const currentPosition = img.style.objectPosition || 'center center';
            const [xPos, yPos] = currentPosition.split(' ');
            startObjectPosition = {
                x: parseFloat(xPos) || 50,
                y: parseFloat(yPos) || 50
            };

            img.style.cursor = 'grabbing';
        };

        const onMouseMove = (e) => {
            if (!isPanning) return;
            e.preventDefault();

            const deltaX = (e.clientX - startX) / placeholder.offsetWidth * 100;
            const deltaY = (e.clientY - startY) / placeholder.offsetHeight * 100;

            const newX = Math.max(0, Math.min(100, startObjectPosition.x + deltaX));
            const newY = Math.max(0, Math.min(100, startObjectPosition.y + deltaY));

            img.style.objectPosition = `${newX}% ${newY}%`;
        };

        const onMouseUp = (e) => {
            if (isPanning) {
                isPanning = false;
                img.style.cursor = 'move';

                // Store the new position
                const matrixId = img.dataset.matrixId;
                if (matrixId) {
                    const position = img.style.objectPosition.split(' ');
                    const imageData = {
                        src: img.src,
                        originalSrc: img.dataset.originalSrc,
                        mode: 'pan',
                        transform: '',
                        position: {
                            x: parseFloat(position[0]) / 100,
                            y: parseFloat(position[1]) / 100
                        }
                    };
                    window.branvaImageData.storeImage(matrixId, placeholder.id, imageData);
                }
            }
        };

        // Add event listeners
        img.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        // Clean up on mode change
        const cleanup = () => {
            img.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        // Store cleanup function for later removal
        img._panCleanup = cleanup;
    }

    // Fix matrix table to prevent movement during drag operations
    fixMatrix(fix = true) {
        const matrixContainer = document.querySelector('.strategy-matrix');
        const matrixTable = document.querySelector('.strategy-matrix .insight-table');
        const canvasArea = document.getElementById('canvasArea');

        if (!matrixContainer || !matrixTable) {
            console.warn('⚠️ Matrix container or table not found');
            return;
        }

        if (fix) {
            // Fix the entire canvas area and matrix
            if (canvasArea) {
                canvasArea.style.position = 'fixed';
                canvasArea.style.top = canvasArea.getBoundingClientRect().top + 'px';
                canvasArea.style.left = canvasArea.getBoundingClientRect().left + 'px';
                canvasArea.style.width = canvasArea.offsetWidth + 'px';
                canvasArea.style.height = canvasArea.offsetHeight + 'px';
                canvasArea.style.zIndex = '999';
            }

            // Fix the matrix itself
            matrixContainer.style.position = 'relative';
            matrixContainer.style.overflow = 'hidden';
            matrixTable.style.tableLayout = 'fixed';
            matrixTable.style.position = 'relative';

            // Prevent all scrolling and user selection during drag
            document.body.style.overflow = 'hidden';
            document.body.style.userSelect = 'none';
            document.documentElement.style.overflow = 'hidden';

            console.log('🔒 Matrix and canvas area fixed for drag operation');
        } else {
            // Restore normal behavior
            if (canvasArea) {
                canvasArea.style.position = '';
                canvasArea.style.top = '';
                canvasArea.style.left = '';
                canvasArea.style.width = '';
                canvasArea.style.height = '';
                canvasArea.style.zIndex = '';
            }

            matrixContainer.style.position = '';
            matrixContainer.style.overflow = '';
            matrixTable.style.tableLayout = '';
            matrixTable.style.position = '';

            // Restore scrolling and selection
            document.body.style.overflow = '';
            document.body.style.userSelect = '';
            document.documentElement.style.overflow = '';

            console.log('🔓 Matrix and canvas position restored');
        }
    }

    // Setup global drag listeners for move mode
    setupGlobalDragListeners() {
        document.addEventListener('mousedown', (e) => {
            // Check if this is a matrix image placeholder in move mode
            const placeholder = e.target.closest('.image-placeholder');
            if (!placeholder || !placeholder.classList.contains('has-image')) return;

            const img = placeholder.querySelector('.captured-image');
            if (!img || img.dataset.mode !== 'move') return;

            // Don't start drag on control buttons
            if (e.target.classList.contains('image-btn') || e.target.closest('.image-controls')) return;

            this.startDrag(e, placeholder);
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.handleDrag(e);
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (this.isDragging) {
                this.endDrag(e);
            }
        });
    }

    startDrag(e, placeholder) {
        e.preventDefault();
        this.isDragging = true;

        const cell = placeholder.parentElement;
        const row = cell.parentElement;

        this.dragData = {
            startX: e.clientX,
            startY: e.clientY,
            draggedElement: placeholder,
            draggedCell: cell,
            originalRow: row
        };

        // Visual feedback
        placeholder.style.opacity = '0.7';
        placeholder.style.cursor = 'grabbing';
        placeholder.style.zIndex = '1000';
        placeholder.style.position = 'relative';

        console.log('🎯 Started dragging matrix image placeholder');

        if (window.showToast) {
            window.showToast('Dragging image - drop on target column', 'info');
        }
    }

    handleDrag(e) {
        if (!this.dragData.draggedElement) return;

        e.preventDefault();
        const deltaX = e.clientX - this.dragData.startX;
        const deltaY = e.clientY - this.dragData.startY;

        this.dragData.draggedElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

        // Highlight valid drop targets
        this.highlightDropTargets(e);
    }

    highlightDropTargets(e) {
        const { originalRow, draggedCell } = this.dragData;
        if (!originalRow) return;

        // Clear previous highlights
        const allCells = originalRow.querySelectorAll('td:not(.category-cell)');
        allCells.forEach(cell => {
            if (cell !== draggedCell) {
                cell.style.backgroundColor = '';
                cell.style.border = '';
            }
        });

        // Find target cell under mouse
        const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
        const targetCell = elementBelow ? elementBelow.closest('td') : null;

        // Highlight if valid target
        if (targetCell &&
            targetCell !== draggedCell &&
            targetCell.parentElement === originalRow &&
            !targetCell.classList.contains('category-cell')) {

            targetCell.style.backgroundColor = 'rgba(75, 192, 192, 0.2)';
            targetCell.style.border = '2px solid #4BC0C0';
        }
    }

    endDrag(e) {
        if (!this.isDragging || !this.dragData.draggedElement) return;

        e.preventDefault();
        const { draggedElement, draggedCell, originalRow } = this.dragData;

        // Reset visual styles
        draggedElement.style.transform = '';
        draggedElement.style.opacity = '1';
        draggedElement.style.cursor = 'grab';
        draggedElement.style.zIndex = '';
        draggedElement.style.position = '';

        // Find drop target
        const targetCell = this.getValidDropTarget(e, originalRow);

        if (targetCell && targetCell !== draggedCell) {
            this.reorderColumns(draggedCell, targetCell);
            if (window.showToast) {
                // window.showToast('Image moved to new column!', 'success');
            }
        } else {
            if (window.showToast) {
                window.showToast('Drop on a valid column to move image', 'error');
            }
        }

        // Clear all highlights
        const allCells = originalRow.querySelectorAll('td');
        allCells.forEach(cell => {
            cell.style.backgroundColor = '';
            cell.style.border = '';
        });

        // Restore matrix movement
        this.fixMatrix(false);

        // Reset drag state
        this.isDragging = false;
        this.dragData = {
            startX: 0,
            startY: 0,
            draggedElement: null,
            draggedCell: null,
            originalRow: null
        };

        console.log('🎯 Drag operation completed');
    }

    getValidDropTarget(e, originalRow) {
        // Get all non-category cells in the row
        const allCells = Array.from(originalRow.querySelectorAll('td:not(.category-cell)'));

        // Find cell under mouse
        const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
        let targetCell = elementBelow ? elementBelow.closest('td') : null;

        // Check if it's a valid drop target
        if (targetCell &&
            allCells.includes(targetCell) &&
            !targetCell.classList.contains('category-cell')) {
            return targetCell;
        }

        // If no direct hit, find closest valid cell
        const mouseX = e.clientX;
        let closestCell = null;
        let minDistance = Infinity;

        allCells.forEach(cell => {
            if (cell.classList.contains('category-cell')) return;

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

        console.log(`📊 Reordering: moving from index ${sourceIndex} to ${targetIndex}`);

        // Remove source cell
        sourceCell.remove();

        // Insert at target position
        if (targetIndex === 0) {
            // Insert after category cell
            const categoryCell = row.querySelector('.category-cell');
            row.insertBefore(sourceCell, categoryCell.nextSibling);
        } else {
            // Get remaining cells and insert at correct position
            const remainingCells = Array.from(row.querySelectorAll('td:not(.category-cell)'));
            if (targetIndex >= remainingCells.length) {
                row.appendChild(sourceCell);
            } else {
                row.insertBefore(sourceCell, remainingCells[targetIndex]);
            }
        }

        console.log('✅ Column reordering completed');
    }

    // Cleanup method for when mode changes
    cleanupImageControls(img) {
        if (img._panCleanup) {
            img._panCleanup();
            delete img._panCleanup;
        }

        // Reset any applied styles
        img.style.cursor = '';
        img.style.objectPosition = '';

        // Restore matrix if it was fixed
        this.fixMatrix(false);
    }

    // Public method to check if currently in move mode
    isInMoveMode() {
        return this.isDragging;
    }
}

// Initialize and make globally available
window.BranvaMatrixControls = BranvaMatrixControls;
window.branvaMatrixControls = new BranvaMatrixControls();

// console.log('🎮 Branva Matrix Controls loaded and initialized');