// Branva Canvas - Drag and Drop Functionality

class BranvaCanvas {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.slideContent = document.getElementById('slideContent');
        this.gridLines = document.getElementById('gridLines');

        this.slides = [this.createEmptySlide()];
        this.currentSlideIndex = 0;
        this.selectedElements = [];
        this.draggedElement = null;
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.zoomLevel = 1;

        this.init();
    }

    init() {
        this.bindEvents();
        this.showWelcomeMessage();
    }

    createEmptySlide() {
        return {
            id: this.generateId(),
            elements: [],
            background: { color: '#ffffff' },
            createdAt: new Date()
        };
    }

    generateId() {
        return 'elem_' + Math.random().toString(36).substr(2, 9);
    }

    bindEvents() {
        // Canvas events
        this.slideContent.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.slideContent.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.slideContent.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.slideContent.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.slideContent.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.slideContent.addEventListener('drop', (e) => this.handleDrop(e));

        // Zoom controls
        document.getElementById('zoomIn')?.addEventListener('click', () => this.zoomIn());
        document.getElementById('zoomOut')?.addEventListener('click', () => this.zoomOut());
        document.getElementById('fitToScreen')?.addEventListener('click', () => this.fitToScreen());

        // Keyboard events
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));

        // Text tools
        document.querySelectorAll('.text-tool').forEach(tool => {
            tool.addEventListener('click', (e) => {
                const textType = e.currentTarget.dataset.textType;
                this.addTextElement(textType);
            });
        });

        // Shape tools
        document.querySelectorAll('.tool-btn').forEach(tool => {
            tool.addEventListener('click', (e) => {
                const toolIcon = e.currentTarget.querySelector('i');
                if (toolIcon.classList.contains('bi-square')) this.addShapeElement('rectangle');
                else if (toolIcon.classList.contains('bi-circle')) this.addShapeElement('circle');
                else if (toolIcon.classList.contains('bi-triangle')) this.addShapeElement('triangle');
                else if (toolIcon.classList.contains('bi-slash')) this.addShapeElement('line');
            });
        });
    }

    handleCanvasClick(e) {
        if (e.target === this.slideContent) {
            this.clearSelection();
        }
    }

    handleMouseDown(e) {
        const element = e.target.closest('.canvas-element');
        if (!element) return;

        this.selectElement(element);
        this.isDragging = true;
        this.draggedElement = element;

        const rect = element.getBoundingClientRect();
        const canvasRect = this.slideContent.getBoundingClientRect();

        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };

        this.showGridLines();
        e.preventDefault();
    }

    handleMouseMove(e) {
        if (!this.isDragging || !this.draggedElement) return;

        const canvasRect = this.slideContent.getBoundingClientRect();
        const x = e.clientX - canvasRect.left - this.dragOffset.x;
        const y = e.clientY - canvasRect.top - this.dragOffset.y;

        // Snap to grid
        const gridSize = 20;
        const snappedX = Math.round(x / gridSize) * gridSize;
        const snappedY = Math.round(y / gridSize) * gridSize;

        this.draggedElement.style.left = snappedX + 'px';
        this.draggedElement.style.top = snappedY + 'px';

        // Update element data
        const elementId = this.draggedElement.dataset.elementId;
        const element = this.getCurrentSlide().elements.find(el => el.id === elementId);
        if (element) {
            element.position.x = (snappedX / this.slideContent.offsetWidth) * 100;
            element.position.y = (snappedY / this.slideContent.offsetHeight) * 100;
        }
    }

    handleMouseUp(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.draggedElement = null;
            this.hideGridLines();
        }
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDrop(e) {
        e.preventDefault();
        // Handle external drops if needed
    }

    handleKeyDown(e) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
            this.deleteSelectedElements();
        } else if (e.key === 'Escape') {
            this.clearSelection();
        } else if (e.ctrlKey || e.metaKey) {
            if (e.key === 'a') {
                e.preventDefault();
                this.selectAllElements();
            } else if (e.key === 'c') {
                e.preventDefault();
                this.copySelectedElements();
            } else if (e.key === 'v') {
                e.preventDefault();
                this.pasteElements();
            }
        }
    }

    selectElement(elementDiv) {
        this.clearSelection();
        elementDiv.classList.add('selected');
        this.selectedElements = [elementDiv];
        this.showResizeHandles(elementDiv);
    }

    clearSelection() {
        this.selectedElements.forEach(el => {
            el.classList.remove('selected');
            this.hideResizeHandles(el);
        });
        this.selectedElements = [];
    }

    showResizeHandles(element) {
        // Remove existing handles
        this.hideResizeHandles(element);

        // Add resize handles
        const handles = ['nw', 'ne', 'sw', 'se'];
        handles.forEach(position => {
            const handle = document.createElement('div');
            handle.className = `resize-handle ${position}`;
            handle.addEventListener('mousedown', (e) => this.startResize(e, element, position));
            element.appendChild(handle);
        });
    }

    hideResizeHandles(element) {
        element.querySelectorAll('.resize-handle').forEach(handle => handle.remove());
    }

    startResize(e, element, position) {
        e.stopPropagation();
        // Implement resize functionality
        this.showToast('Resize functionality coming soon', 'info');
    }

    deleteSelectedElements() {
        if (this.selectedElements.length === 0) return;

        const slide = this.getCurrentSlide();
        this.selectedElements.forEach(elementDiv => {
            const elementId = elementDiv.dataset.elementId;
            const index = slide.elements.findIndex(el => el.id === elementId);
            if (index > -1) {
                slide.elements.splice(index, 1);
            }
            elementDiv.remove();
        });

        this.selectedElements = [];
        this.showToast('Elements deleted', 'success');
    }

    showGridLines() {
        this.gridLines.classList.add('visible');
    }

    hideGridLines() {
        this.gridLines.classList.remove('visible');
    }

    // Zoom Controls
    zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel * 1.2, 3);
        this.updateZoom();
    }

    zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.1);
        this.updateZoom();
    }

    fitToScreen() {
        this.zoomLevel = 1;
        this.updateZoom();
    }

    updateZoom() {
        this.canvas.style.transform = `scale(${this.zoomLevel})`;
        document.getElementById('zoomLevel').textContent = Math.round(this.zoomLevel * 100) + '%';
    }

    // Element Creation Methods
    addTextElement(textType) {
        const textStyles = {
            heading: { fontSize: 32, fontWeight: 'bold', color: '#1e293b' },
            subheading: { fontSize: 24, fontWeight: '600', color: '#1e293b' },
            body: { fontSize: 16, fontWeight: 'normal', color: '#475569' },
            bullet: { fontSize: 16, fontWeight: 'normal', color: '#475569' }
        };

        const style = textStyles[textType] || textStyles.body;
        const text = textType === 'bullet' ? '• Bullet point' :
            textType === 'heading' ? 'Heading Text' :
                textType === 'subheading' ? 'Subheading Text' : 'Body text';

        const element = {
            id: this.generateId(),
            type: 'text',
            position: { x: 10, y: 10, width: 300, height: 50, rotation: 0, zIndex: 1 },
            content: {
                text: text,
                fontSize: style.fontSize,
                fontWeight: style.fontWeight,
                color: style.color,
                fontFamily: 'Inter, sans-serif',
                alignment: 'left'
            }
        };

        this.addElementToSlide(element);
        this.renderElement(element);
    }

    addShapeElement(shapeType) {
        const shapes = {
            rectangle: { width: 200, height: 100 },
            circle: { width: 100, height: 100 },
            triangle: { width: 100, height: 100 },
            line: { width: 200, height: 4 }
        };

        const size = shapes[shapeType] || shapes.rectangle;

        const element = {
            id: this.generateId(),
            type: 'shape',
            position: { x: 20, y: 20, width: size.width, height: size.height, rotation: 0, zIndex: 1 },
            content: {
                shapeType: shapeType,
                fillColor: '#8B5CF6',
                strokeColor: '#7C3AED',
                strokeWidth: 2
            }
        };

        this.addElementToSlide(element);
        this.renderElement(element);
    }

    addInsightElement(insight) {
        const element = {
            id: this.generateId(),
            type: 'insight',
            position: {
                x: 15,
                y: 15,
                width: insight.defaultSize.width,
                height: insight.defaultSize.height,
                rotation: 0,
                zIndex: 1
            },
            content: {
                insightToolId: insight.id,
                insightName: insight.name,
                iconClass: insight.iconClass,
                category: insight.category
            }
        };

        this.addElementToSlide(element);
        this.renderElement(element);
    }

    addMockupElement(mockup, uploadedCreative) {
        const element = {
            id: this.generateId(),
            type: 'mockup',
            position: { x: 10, y: 10, width: 400, height: 300, rotation: 0, zIndex: 1 },
            content: {
                mockupId: mockup.id,
                mockupName: mockup.name,
                creativeUrl: uploadedCreative.url,
                placementArea: mockup.placementArea
            }
        };

        this.addElementToSlide(element);
        this.renderElement(element);
    }

    async applySolutionTemplate(solution, createNewSlide = false) {
        try {
            if (createNewSlide) {
                this.addNewSlide();
            } else {
                this.clearCurrentSlide();
            }

        this.hideWelcomeMessage();

        // Load the actual strategy content (matrix data)
        const strategyContent = await window.BranvaData.loadStrategyContent(solution.id);
        if (!strategyContent) {
            this.showToast('Failed to load strategy content', 'error');
            return;
        }

        // Add slide title header (full width, more height for long titles)
        const titleElement = {
            id: this.generateId(),
            type: 'text',
            position: { x: 1, y: 1, width: 98, height: 8, rotation: 0, zIndex: 2 },
            content: {
                text: solution.name,
                fontSize: 16,
                fontWeight: 'bold',
                color: '#1e293b',
                fontFamily: 'Inter, sans-serif',
                alignment: 'left',
                isEditable: true
            }
        };

        console.log('📝 TITLE ELEMENT CREATED:', {
            id: titleElement.id,
            text: titleElement.content.text,
            position: titleElement.position,
            fontSize: titleElement.content.fontSize
        });

        this.addElementToSlide(titleElement);
        this.renderElement(titleElement);

        // Add slide description (full width, more height for long descriptions)
        const descriptionElement = {
            id: this.generateId(),
            type: 'text',
            position: { x: 1, y: 9, width: 98, height: 10, rotation: 0, zIndex: 2 },
            content: {
                text: solution.description,
                fontSize: 10,
                fontWeight: 'normal',
                color: '#64748b',
                fontFamily: 'Inter, sans-serif',
                alignment: 'left',
                isEditable: true
            }
        };

        console.log('📝 DESCRIPTION ELEMENT CREATED:', {
            id: descriptionElement.id,
            text: descriptionElement.content.text.substring(0, 100) + '...',
            position: descriptionElement.position,
            fontSize: descriptionElement.content.fontSize
        });

        this.addElementToSlide(descriptionElement);
        this.renderElement(descriptionElement);

        // Calculate matrix height based on content - start after title/description (y: 20)
        const numRows = strategyContent.data.length;
        const matrixStartY = 20; // Start after title (8%) + description (10%) + margin (2%)
        const availableSpace = 100 - matrixStartY; // Available space from matrix start to bottom
        const maxHeight = 78; // Maximum height percentage to fit remaining space
        const heightPerRow = numRows <= 4 ? 18 : (numRows <= 6 ? 14 : 12); // Adjusted for smaller space
        const calculatedMatrixHeight = Math.min(maxHeight, Math.min(availableSpace, numRows * heightPerRow));

        // Create the strategy matrix table
        const matrixElement = {
            id: this.generateId(),
            type: 'strategy-matrix',
            position: { x: 1, y: matrixStartY, width: 98, height: calculatedMatrixHeight, rotation: 0, zIndex: 1 },
            content: {
                gridSize: solution.gridSize,
                solutionId: solution.id,
                solutionName: solution.name,
                strategyContent: strategyContent,
                metadata: {
                    name: solution.name,
                    description: solution.description,
                    id: solution.id
                }
            }
        };

        this.addElementToSlide(matrixElement);
        this.renderStrategyMatrix(matrixElement);
        } catch (error) {
            console.error('🔧 Error in applySolutionTemplate:', error);
        }
    }

    renderGridElement(element) {
        const div = document.createElement('div');
        div.className = 'canvas-element grid-element';
        div.dataset.elementId = element.id;

        const { rows, columns } = element.content.gridSize;

        div.style.cssText = `
            position: absolute;
            left: ${element.position.x}%;
            top: ${element.position.y}%;
            width: ${element.position.width}%;
            height: ${element.position.height}%;
            display: grid;
            grid-template-columns: repeat(${columns}, 1fr);
            grid-template-rows: repeat(${rows}, 1fr);
            gap: 2px;
            border: 1px solid #e2e8f0;
            background: rgba(139, 92, 246, 0.05);
            z-index: ${element.position.zIndex};
        `;

        // Create grid cells
        for (let i = 0; i < rows * columns; i++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.style.cssText = `
                background: white;
                border: 1px solid #f1f5f9;
                min-height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 10px;
                color: #94a3b8;
            `;
            div.appendChild(cell);
        }

        this.slideContent.appendChild(div);
    }

    renderElement(element) {
        const div = document.createElement('div');
        div.className = 'canvas-element';
        div.dataset.elementId = element.id;

        div.style.cssText = `
            position: absolute;
            left: ${element.position.x}%;
            top: ${element.position.y}%;
            width: ${element.position.width}%;
            height: ${element.position.height}%;
            transform: rotate(${element.position.rotation}deg);
            z-index: ${element.position.zIndex};
            cursor: ${element.type === 'text' ? 'text' : 'move'};
        `;

        console.log('🎯 ELEMENT RENDERED:', {
            type: element.type,
            id: element.id,
            position: element.position,
            computedStyle: {
                left: element.position.x + '%',
                top: element.position.y + '%',
                width: element.position.width + '%',
                height: element.position.height + '%'
            }
        });

        switch (element.type) {
            case 'text':
                this.renderTextElement(div, element);
                break;
            case 'shape':
                this.renderShapeElement(div, element);
                break;
            case 'insight':
                this.renderInsightElement(div, element);
                break;
            case 'mockup':
                this.renderMockupElement(div, element);
                break;
            case 'strategy-matrix':
                this.renderStrategyMatrix(element);
                return; // Don't append to slideContent, it's handled differently
        }

        this.slideContent.appendChild(div);
    }

    renderTextElement(div, element) {
        const content = element.content;
        const isEditable = content.isEditable !== false; // Default to true

        console.log('📝 RENDERING TEXT ELEMENT:', {
            id: element.id,
            text: content.text.substring(0, 50) + '...',
            fontSize: content.fontSize,
            position: element.position,
            containerSize: {
                width: element.position.width + '%',
                height: element.position.height + '%'
            }
        });

        div.innerHTML = `
            <div class="text-content" contenteditable="${isEditable}" style="
                width: calc(100% - 16px) !important;
                height: calc(100% - 16px) !important;
                font-family: ${content.fontFamily} !important;
                font-size: ${content.fontSize}px !important;
                font-weight: ${content.fontWeight} !important;
                color: ${content.color} !important;
                text-align: ${content.alignment} !important;
                line-height: 1.3 !important;
                outline: none !important;
                border: none !important;
                padding: 8px !important;
                margin: 0 !important;
                box-sizing: border-box !important;
                cursor: text !important;
                transition: all 0.2s !important;
                word-wrap: break-word !important;
                overflow-wrap: break-word !important;
                white-space: normal !important;
                overflow: hidden !important;
                background: transparent !important;
                position: relative !important;
                z-index: 2 !important;
            "
            placeholder="${content.placeholder || 'Click to edit...'}"
            >${content.text}</div>
        `;

        const textDiv = div.querySelector('.text-content');

        if (isEditable) {
            console.log('📝 MAKING TEXT EDITABLE:', element.id);

            // Add editing visual feedback
            textDiv.addEventListener('focus', () => {
                console.log('📝 TEXT ELEMENT FOCUSED:', element.id);
                textDiv.style.setProperty('border', '2px solid #3b82f6', 'important');
                textDiv.style.setProperty('background', 'rgba(59, 130, 246, 0.05)', 'important');
                textDiv.style.setProperty('box-shadow', '0 0 0 2px rgba(59, 130, 246, 0.1)', 'important');
                // Select all text for easy replacement
                setTimeout(() => {
                    const range = document.createRange();
                    range.selectNodeContents(textDiv);
                    const selection = window.getSelection();
                    selection.removeAllRanges();
                    selection.addRange(range);
                }, 10);
            });

            textDiv.addEventListener('blur', () => {
                console.log('📝 TEXT ELEMENT BLURRED:', element.id, 'New text:', textDiv.textContent);
                textDiv.style.setProperty('border', 'none', 'important');
                textDiv.style.setProperty('background', 'transparent', 'important');
                textDiv.style.setProperty('box-shadow', 'none', 'important');

                // Save the new text
                const oldText = element.content.text;
                const newText = textDiv.textContent.trim();

                if (oldText !== newText) {
                    element.content.text = newText;
                    // Show save feedback
                    if (window.showToast) {
                        window.showToast('Text updated successfully', 'success');
                    }
                    console.log('📝 TEXT SAVED:', { id: element.id, oldText: oldText.substring(0, 30) + '...', newText: newText.substring(0, 30) + '...' });
                }
            });

            // Handle keyboard shortcuts
            textDiv.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    textDiv.blur();
                } else if (e.key === 'Escape') {
                    textDiv.textContent = element.content.text; // Revert changes
                    textDiv.blur();
                } else if (e.key === 'Enter' && !e.shiftKey) {
                    // For single-line text, Enter saves
                    e.preventDefault();
                    textDiv.blur();
                }
            });

            // Show editing hint on hover over text
            textDiv.addEventListener('mouseenter', () => {
                if (!textDiv.matches(':focus')) {
                    textDiv.style.setProperty('border', '1px dashed #94a3b8', 'important');
                    textDiv.style.setProperty('background', 'rgba(148, 163, 184, 0.02)', 'important');
                }
            });

            textDiv.addEventListener('mouseleave', () => {
                if (!textDiv.matches(':focus')) {
                    textDiv.style.setProperty('border', 'none', 'important');
                    textDiv.style.setProperty('background', 'transparent', 'important');
                }
            });

            // Create professional move icon above text box
            const moveIcon = document.createElement('div');
            moveIcon.innerHTML = '<i class="bi bi-arrows-move"></i>'; // Bootstrap move icon
            moveIcon.style.cssText = `
                position: absolute !important;
                top: -12px !important;
                left: 50% !important;
                transform: translateX(-50%) !important;
                font-size: 14px !important;
                background: rgba(255, 255, 255, 0.95) !important;
                border: 1px solid #d1d5db !important;
                border-radius: 6px !important;
                padding: 6px 8px !important;
                cursor: move !important;
                z-index: 10 !important;
                opacity: 0 !important;
                transition: all 0.2s ease !important;
                user-select: none !important;
                pointer-events: auto !important;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
                color: #6b7280 !important;
            `;
            div.appendChild(moveIcon);

            // Show move icon on hover (when not editing)
            div.addEventListener('mouseenter', () => {
                if (!textDiv.matches(':focus')) {
                    moveIcon.style.setProperty('opacity', '1', 'important');
                    moveIcon.style.setProperty('transform', 'translateX(-50%) scale(1.05)', 'important');
                    console.log('🎯 MOVE ICON SHOWN');
                }
            });

            div.addEventListener('mouseleave', () => {
                if (!textDiv.matches(':focus')) {
                    moveIcon.style.setProperty('opacity', '0', 'important');
                    moveIcon.style.setProperty('transform', 'translateX(-50%) scale(1)', 'important');
                    console.log('🎯 MOVE ICON HIDDEN');
                }
            });

            // Hide move icon when editing
            textDiv.addEventListener('focus', () => {
                moveIcon.style.setProperty('opacity', '0', 'important');
            });

            // Move icon hover effect
            moveIcon.addEventListener('mouseenter', () => {
                moveIcon.style.setProperty('background', 'rgba(255, 255, 255, 1)', 'important');
                moveIcon.style.setProperty('border-color', '#9ca3af', 'important');
                moveIcon.style.setProperty('transform', 'translateX(-50%) scale(1.1)', 'important');
            });

            moveIcon.addEventListener('mouseleave', () => {
                moveIcon.style.setProperty('background', 'rgba(255, 255, 255, 0.95)', 'important');
                moveIcon.style.setProperty('border-color', '#d1d5db', 'important');
                moveIcon.style.setProperty('transform', 'translateX(-50%) scale(1.05)', 'important');
            });

            // Move icon drag functionality
            let isDragging = false;
            let dragStart = { x: 0, y: 0 };

            moveIcon.addEventListener('mousedown', (e) => {
                console.log('🎯 MOVE ICON CLICKED');
                e.preventDefault();
                e.stopPropagation();
                isDragging = true;
                dragStart = { x: e.clientX, y: e.clientY };
                document.body.style.cursor = 'move';
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    const deltaX = e.clientX - dragStart.x;
                    const deltaY = e.clientY - dragStart.y;

                    // Update element position (this would need to be integrated with your existing drag system)
                    const newLeft = parseFloat(div.style.left) + (deltaX / window.innerWidth * 100);
                    const newTop = parseFloat(div.style.top) + (deltaY / window.innerHeight * 100);

                    div.style.left = newLeft + '%';
                    div.style.top = newTop + '%';

                    dragStart = { x: e.clientX, y: e.clientY };
                }
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    console.log('🎯 MOVE DRAG ENDED');
                    isDragging = false;
                    document.body.style.cursor = '';
                }
            });


            // Prevent dragging when editing text
            textDiv.addEventListener('mousedown', (e) => {
                e.stopPropagation();
            });

            // Handle clicking outside to blur text
            document.addEventListener('click', (e) => {
                if (!div.contains(e.target) && textDiv.matches(':focus')) {
                    console.log('📝 CLICKED OUTSIDE, BLURRING TEXT:', element.id);
                    textDiv.blur();
                }
            });
        }
    }

    renderShapeElement(div, element) {
        const content = element.content;
        let shapeHTML = '';

        switch (content.shapeType) {
            case 'rectangle':
                shapeHTML = `<div style="
                    width: 100%;
                    height: 100%;
                    background: ${content.fillColor};
                    border: ${content.strokeWidth}px solid ${content.strokeColor};
                "></div>`;
                break;
            case 'circle':
                shapeHTML = `<div style="
                    width: 100%;
                    height: 100%;
                    background: ${content.fillColor};
                    border: ${content.strokeWidth}px solid ${content.strokeColor};
                    border-radius: 50%;
                "></div>`;
                break;
            case 'triangle':
                shapeHTML = `<div style="
                    width: 0;
                    height: 0;
                    border-left: 50px solid transparent;
                    border-right: 50px solid transparent;
                    border-bottom: 100px solid ${content.fillColor};
                "></div>`;
                break;
            case 'line':
                shapeHTML = `<div style="
                    width: 100%;
                    height: ${content.strokeWidth}px;
                    background: ${content.strokeColor};
                    margin-top: 50%;
                "></div>`;
                break;
        }

        div.innerHTML = shapeHTML;
    }

    renderInsightElement(div, element) {
        const content = element.content;
        div.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                background: #f8fafc;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 16px;
                box-sizing: border-box;
            ">
                <i class="${content.iconClass}" style="font-size: 24px; color: #8B5CF6; margin-bottom: 8px;"></i>
                <div style="font-size: 12px; font-weight: 500; color: #475569; text-align: center;">
                    ${content.insightName}
                </div>
            </div>
        `;
    }

    renderMockupElement(div, element) {
        const content = element.content;
        div.innerHTML = `
            <div style="
                width: 100%;
                height: 100%;
                background: #f1f5f9;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                position: relative;
                overflow: hidden;
            ">
                <div style="
                    position: absolute;
                    left: ${content.placementArea.x}%;
                    top: ${content.placementArea.y}%;
                    width: ${content.placementArea.width}%;
                    height: ${content.placementArea.height}%;
                    ${content.placementArea.rotation ? `transform: rotate(${content.placementArea.rotation}deg);` : ''}
                ">
                    <img src="${content.creativeUrl}" style="
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    ">
                </div>
                <div style="
                    position: absolute;
                    bottom: 8px;
                    left: 8px;
                    font-size: 10px;
                    color: #64748b;
                    background: rgba(255, 255, 255, 0.9);
                    padding: 2px 6px;
                    border-radius: 4px;
                ">
                    ${content.mockupName}
                </div>
            </div>
        `;
    }

    renderStrategyMatrix(element) {
        const div = document.createElement('div');
        div.className = 'canvas-element strategy-matrix';
        div.dataset.elementId = element.id;

        const content = element.content;
        const strategyContent = content.strategyContent;
        const metadata = content.metadata || {}; // Get metadata from element

        // Calculate responsive sizing based on number of rows - ensure all rows are visible and fit in container
        const numRows = strategyContent.data.length;
        const matrixTop = element.position.y; // Get actual position Y
        const availableSpace = 100 - matrixTop; // Available space from top position to bottom
        const maxHeight = Math.min(92, availableSpace - 1); // Leave 1% margin, ensure fits in container
        const heightPerRow = numRows <= 4 ? 22 : (numRows <= 6 ? 18 : 16); // Reduced height per row for 6+ rows
        const calculatedHeight = Math.min(maxHeight, numRows * heightPerRow);


        div.style.cssText = `
            position: absolute;
            left: ${element.position.x}%;
            top: ${element.position.y}%;
            width: ${element.position.width}%;
            height: ${calculatedHeight}%;
            z-index: ${element.position.zIndex};
            cursor: move;
            overflow: hidden;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;


        // Calculate font sizes based on number of rows - optimize for readability now that sizing works
        const baseFontSize = numRows > 5 ? 11 : (numRows > 4 ? 12 : 14);
        const iconSize = numRows > 5 ? 16 : (numRows > 4 ? 18 : 20);
        const categoryIconSize = numRows > 5 ? 14 : (numRows > 4 ? 16 : 18);

        // Create the table structure - full height since no header
        const expectedTableHeightPx = this.slideContent.offsetHeight * (calculatedHeight / 100);
        let tableHTML = `<table class="insight-table" style="width: 100%; height: ${expectedTableHeightPx}px; max-height: ${expectedTableHeightPx}px; border-collapse: collapse !important; border-spacing: 0 !important; font-size: ${baseFontSize}px; table-layout: fixed; display: table; overflow: hidden;">`;

        // Generate rows
        strategyContent.data.forEach((row, rowIndex) => {
            const baseRowHeight = 100 / numRows; // evenly divide full height
            const rowHeight = baseRowHeight;     // all rows same height, use full 100%
            tableHTML += `<tr data-row="${rowIndex}" style="height: ${rowHeight}%; max-height: ${rowHeight}%; overflow: hidden;">`;


            // Category cell (first column)
            const header = strategyContent.headers[rowIndex];
            let categoryHTML = '';
            if (header && typeof header === 'object' && header.icon) {
                categoryHTML = `
                    <div style="text-align: center; display: flex; flex-direction: column; justify-content: center; height: 100%; padding: 4px;">
                        <i class="bi bi-${header.icon}" style="font-size: ${categoryIconSize}px; color: white; display: block; margin-bottom: 2px;"></i>
                        <div style="font-size: ${Math.max(8, baseFontSize - 2)}px; line-height: 1.2; font-weight: 600; color: white;">${header.text}</div>
                    </div>
                `;
            } else {
                categoryHTML = `ROW ${rowIndex + 1}`;
            }

            tableHTML += `
                <td class="category-cell" style="
                    background: #1e293b;
                    color: white;
                    border: 1px solid #334155;
                    padding: 4px;
                    width: 15%;
                    text-align: center;
                    font-weight: 600;
                    font-size: ${baseFontSize}px;
                    vertical-align: middle;
                    min-height: auto !important;
                    height: auto !important;
                ">${categoryHTML}</td>
            `;

            // Image cell (second column) - responsive sizing, optimized for visibility
            const imageSize = numRows > 5 ? 35 : Math.max(30, Math.min(45, 200 / numRows)); // Larger for better visibility
            tableHTML += `
                <td class="image-cell" style="
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    padding: ${numRows > 5 ? '1px' : '4px'};
                    width: 10%;
                    text-align: center;
                    vertical-align: middle;
                    height: auto !important;
                    min-height: auto !important;
                ">
                    <div class="image-placeholder" style="
                        width: ${imageSize}px;
                        height: ${imageSize}px;
                        max-width: 100%;
                        max-height: 80%;
                        background: #e2e8f0;
                        border-radius: 3px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto;
                        color: #64748b;
                    ">
                        <i class="bi bi-image" style="font-size: ${iconSize}px;"></i>
                    </div>
                </td>
            `;

            // Data cells
            row.forEach((cell, cellIndex) => {
                tableHTML += `
                    <td class="text-cell" style="
                        background: white;
                        border: 1px solid #e2e8f0;
                        padding: ${numRows > 5 ? '1px' : '3px'};
                        text-align: center;
                        width: ${75 / row.length}%;
                        vertical-align: middle;
                        min-height: auto !important;
                        height: auto !important;
                    ">
                        <div style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; padding: ${numRows > 5 ? '2px' : '4px'};">
                            <i class="bi bi-${cell.icon}" style="font-size: ${iconSize}px; color: #3b82f6; display: block; margin-bottom: ${numRows > 5 ? '3px' : '4px'};"></i>
                            <div style="font-size: ${Math.max(9, baseFontSize - 1)}px; line-height: ${numRows > 5 ? '1.1' : '1.2'}; font-weight: 600; color: #1e293b; word-break: break-word;">${cell.text}</div>
                        </div>
                    </td>
                `;
            });

            tableHTML += '</tr>';
        });

        tableHTML += '</table>';
        div.innerHTML = tableHTML;


        this.slideContent.appendChild(div);

    }

    // Slide Management
    getCurrentSlide() {
        return this.slides[this.currentSlideIndex];
    }

    addElementToSlide(element) {
        this.getCurrentSlide().elements.push(element);
    }

    clearCurrentSlide() {
        this.getCurrentSlide().elements = [];
        this.slideContent.innerHTML = '';
        this.selectedElements = [];
    }

    addNewSlide() {
        const newSlide = this.createEmptySlide();
        this.slides.push(newSlide);
        this.currentSlideIndex = this.slides.length - 1;
        this.renderCurrentSlide();
        this.updateSlideThumbnails();
    }

    renderCurrentSlide() {
        this.slideContent.innerHTML = '';
        this.selectedElements = [];

        const slide = this.getCurrentSlide();
        slide.elements.forEach(element => {
            if (element.type === 'grid') {
                this.renderGridElement(element);
            } else if (element.type === 'strategy-matrix') {
                this.renderStrategyMatrix(element);
            } else {
                this.renderElement(element);
            }
        });

        if (slide.elements.length === 0) {
            this.showWelcomeMessage();
        }
    }

    updateSlideThumbnails() {
        // Update slide thumbnails in the bottom strip
        const thumbnailsContainer = document.getElementById('slideThumbnails');
        if (!thumbnailsContainer) return;

        thumbnailsContainer.innerHTML = this.slides.map((slide, index) => `
            <div class="slide-thumbnail ${index === this.currentSlideIndex ? 'active' : ''}" data-slide="${index}">
                <div class="thumbnail-content">
                    <div class="thumbnail-preview"></div>
                </div>
                <div class="slide-number">${index + 1} / ${this.slides.length}</div>
            </div>
        `).join('');

        // Bind click events
        thumbnailsContainer.querySelectorAll('.slide-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.currentTarget.dataset.slide);
                this.switchToSlide(slideIndex);
            });
        });
    }

    switchToSlide(index) {
        if (index >= 0 && index < this.slides.length) {
            this.currentSlideIndex = index;
            this.renderCurrentSlide();
            this.updateSlideThumbnails();
        }
    }

    showWelcomeMessage() {
        if (this.slideContent.children.length === 0) {
            this.slideContent.innerHTML = `
                <div class="welcome-message">
                    <h2>Welcome to Branva</h2>
                    <p>Select a solution template from the left panel to get started</p>
                </div>
            `;
        }
    }

    hideWelcomeMessage() {
        const welcomeMsg = this.slideContent.querySelector('.welcome-message');
        if (welcomeMsg) {
            welcomeMsg.remove();
        }
    }

    // Get current matrices on the slide
    getCurrentMatrices() {
        const slide = this.getCurrentSlide();
        return slide.elements.filter(element => element.type === 'strategy-matrix');
    }

    // Utility Methods
    showToast(message, type = 'info') {
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Initialize canvas when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.branvaCanvas = new BranvaCanvas();
});