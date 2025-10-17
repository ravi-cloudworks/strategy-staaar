// Branva Canvas - Drag and Drop Functionality
console.log('🔧 BranvaCanvas file loaded!');

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
            console.log('🔧 applySolutionTemplate CALLED!', solution, createNewSlide);
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

        // Add editable title
        const titleElement = {
            id: this.generateId(),
            type: 'text',
            position: { x: 5, y: 1, width: 90, height: 4, rotation: 0, zIndex: 2 },
            content: {
                text: solution.name,
                fontSize: 20,
                fontWeight: 'bold',
                color: '#1e293b',
                fontFamily: 'Inter, sans-serif',
                alignment: 'left',
                isEditable: true
            }
        };

        this.addElementToSlide(titleElement);
        this.renderElement(titleElement);

        // Add editable description
        const descriptionElement = {
            id: this.generateId(),
            type: 'text',
            position: { x: 5, y: 5, width: 90, height: 3, rotation: 0, zIndex: 2 },
            content: {
                text: solution.description,
                fontSize: 12,
                fontWeight: 'normal',
                color: '#64748b',
                fontFamily: 'Inter, sans-serif',
                alignment: 'left',
                isEditable: true
            }
        };

        this.addElementToSlide(descriptionElement);
        this.renderElement(descriptionElement);

        // Create the strategy matrix table
        const matrixElement = {
            id: this.generateId(),
            type: 'strategy-matrix',
            position: { x: 5, y: 8, width: 90, height: 90, rotation: 0, zIndex: 1 },
            content: {
                gridSize: solution.gridSize,
                solutionId: solution.id,
                solutionName: solution.name,
                strategyContent: strategyContent
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
            width: ${element.position.width}px;
            height: ${element.position.height}px;
            transform: rotate(${element.position.rotation}deg);
            z-index: ${element.position.zIndex};
            cursor: move;
        `;

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

        div.innerHTML = `
            <div contenteditable="${isEditable}" style="
                width: 100%;
                height: 100%;
                font-family: ${content.fontFamily};
                font-size: ${content.fontSize}px;
                font-weight: ${content.fontWeight};
                color: ${content.color};
                text-align: ${content.alignment};
                line-height: 1.4;
                outline: none;
                border: ${isEditable ? '2px dashed transparent' : 'none'};
                padding: 4px;
                box-sizing: border-box;
                cursor: ${isEditable ? 'text' : 'move'};
                transition: all 0.2s;
            "
            placeholder="${content.placeholder || 'Click to edit...'}"
            >${content.text}</div>
        `;

        const textDiv = div.querySelector('[contenteditable]');

        if (isEditable) {
            // Add editing visual feedback
            textDiv.addEventListener('focus', () => {
                textDiv.style.border = '2px dashed #8B5CF6';
                textDiv.style.background = 'rgba(139, 92, 246, 0.05)';
            });

            textDiv.addEventListener('blur', () => {
                textDiv.style.border = '2px dashed transparent';
                textDiv.style.background = 'transparent';
                element.content.text = textDiv.textContent;

                // Show save feedback
                if (window.showToast) {
                    window.showToast('Text updated', 'success');
                }
            });

            // Handle keyboard shortcuts
            textDiv.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    textDiv.blur();
                } else if (e.key === 'Escape') {
                    textDiv.textContent = element.content.text; // Revert changes
                    textDiv.blur();
                }
            });

            // Show editing hint on hover
            div.addEventListener('mouseenter', () => {
                if (!textDiv.matches(':focus')) {
                    textDiv.style.border = '2px dashed #cbd5e1';
                }
            });

            div.addEventListener('mouseleave', () => {
                if (!textDiv.matches(':focus')) {
                    textDiv.style.border = '2px dashed transparent';
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
        console.log('🔧 renderStrategyMatrix CALLED!', element);
        const div = document.createElement('div');
        div.className = 'canvas-element strategy-matrix';
        div.dataset.elementId = element.id;

        const content = element.content;
        const strategyContent = content.strategyContent;

        // Calculate responsive sizing based on number of rows - ensure all rows are visible
        const numRows = strategyContent.data.length;
        const maxHeight = 90; // Maximum height percentage (increased further)
        const heightPerRow = numRows <= 4 ? 18 : (numRows <= 6 ? 16 : 14); // More generous height per row
        const calculatedHeight = Math.min(maxHeight, numRows * heightPerRow);

        // DEBUG: Log matrix sizing calculations
        console.log('🔧 MATRIX DEBUG:', {
            numRows,
            heightPerRow,
            calculatedHeight,
            maxHeight,
            matrixPosition: element.position,
            containerDimensions: {
                slideContentHeight: this.slideContent.offsetHeight,
                slideContentWidth: this.slideContent.offsetWidth
            }
        });

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

        // Calculate font sizes based on number of rows
        const baseFontSize = numRows > 5 ? 10 : 12;
        const iconSize = numRows > 5 ? 14 : 16;
        const categoryIconSize = numRows > 5 ? 12 : 16;

        // Create the table structure like in dashboard.html
        let tableHTML = `<table class="insight-table" style="width: 100%; height: 100%; border-collapse: collapse; font-size: ${baseFontSize}px; table-layout: fixed; display: table;">`;

        // Generate rows
        strategyContent.data.forEach((row, rowIndex) => {
            const baseRowHeight = 100 / numRows; // evenly divide full height
            const rowHeight = baseRowHeight;     // all rows same height, use full 100%
            console.log(`🔧 ROW ${rowIndex}: height ${rowHeight}%, total rows: ${numRows}`);
            tableHTML += `<tr data-row="${rowIndex}" style="height: ${rowHeight}%;">`;


            // Category cell (first column)
            const header = strategyContent.headers[rowIndex];
            let categoryHTML = '';
            if (header && typeof header === 'object' && header.icon) {
                categoryHTML = `
                    <div style="text-align: center; display: flex; flex-direction: column; justify-content: center; height: 100%; padding: 4px;">
                        <i class="bi bi-${header.icon}" style="font-size: ${categoryIconSize}px; color: white; display: block; margin-bottom: 2px;"></i>
                        <div style="font-size: ${Math.max(7, baseFontSize - 3)}px; line-height: 1.1; font-weight: 600; color: white;">${header.text}</div>
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
                ">${categoryHTML}</td>
            `;

            // Image cell (second column)
            const imageSize = numRows > 5 ? 30 : 40;
            tableHTML += `
                <td class="image-cell" style="
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    padding: 4px;
                    width: 10%;
                    text-align: center;
                    vertical-align: middle;
                ">
                    <div class="image-placeholder" style="
                        width: ${imageSize}px;
                        height: ${imageSize}px;
                        background: #e2e8f0;
                        border-radius: 4px;
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
                        padding: 3px;
                        text-align: center;
                        width: ${75 / row.length}%;
                        vertical-align: middle;
                    ">
                        <div style="text-align: center; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; padding: 2px;">
                            <i class="bi bi-${cell.icon}" style="font-size: ${iconSize}px; color: #3b82f6; display: block; margin-bottom: 2px;"></i>
                            <div style="font-size: ${Math.max(7, baseFontSize - 2)}px; line-height: 1.1; font-weight: 600; color: #1e293b; word-break: break-word;">${cell.text}</div>
                        </div>
                    </td>
                `;
            });

            tableHTML += '</tr>';
        });

        tableHTML += '</table>';
        div.innerHTML = tableHTML;

        this.slideContent.appendChild(div);

        // DEBUG: Log final matrix element dimensions after rendering
        setTimeout(() => {
            console.log('🔧 FINAL MATRIX DIMENSIONS:', {
                matrixElement: {
                    offsetWidth: div.offsetWidth,
                    offsetHeight: div.offsetHeight,
                    scrollHeight: div.scrollHeight,
                    clientHeight: div.clientHeight
                },
                table: {
                    offsetHeight: div.querySelector('table')?.offsetHeight,
                    scrollHeight: div.querySelector('table')?.scrollHeight
                },
                allRows: Array.from(div.querySelectorAll('tr')).map((tr, i) => ({
                    row: i,
                    offsetHeight: tr.offsetHeight,
                    visible: tr.getBoundingClientRect().bottom <= div.getBoundingClientRect().bottom
                }))
            });
        }, 100);
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