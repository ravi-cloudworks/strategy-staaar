// Branva Matrix Renderer - Handles rendering strategy matrices
// This module creates the visual strategy matrix tables from JSON data

class BranvaMatrixRenderer {
    constructor() {
        this.currentMatrixElement = null;
    }

    // Create a strategy matrix element for the canvas
    createMatrixElement(elementId, position, solution, strategyContent) {
        // Calculate optimal sizing based on matrix dimensions
        const rows = strategyContent.data.length;
        const columns = strategyContent.data[0]?.length || 6;

        // Adjust height based on number of rows to prevent scrolling
        // Reserve space for title (4%) and description (3%)
        const reservedSpace = 7; // Percentage for title and description
        const availableHeight = 100 - reservedSpace - position.y; // Available height for matrix
        const baseHeight = Math.min(60, availableHeight / rows); // Height per row
        const calculatedHeight = Math.min(availableHeight, (rows * baseHeight) / 540 * 100);

        return {
            id: elementId,
            type: 'strategy-matrix',
            position: {
                ...position,
                height: calculatedHeight
            },
            content: {
                gridSize: solution.gridSize,
                solutionId: solution.id,
                solutionName: solution.name,
                strategyContent: strategyContent,
                rows: rows,
                columns: columns
            }
        };
    }

    // Render strategy matrix as HTML table
    renderMatrixTable(element) {
        const div = document.createElement('div');
        div.className = 'canvas-element strategy-matrix';
        div.dataset.elementId = element.id;

        const content = element.content;
        const strategyContent = content.strategyContent;

        // Calculate responsive font sizes based on matrix size
        const rows = content.rows || 6;
        const columns = content.columns || 6;

        // Adjust font sizes based on matrix density
        const baseFontSize = Math.max(8, Math.min(12, 120 / (rows + columns)));
        const iconSize = Math.max(12, Math.min(18, 180 / (rows + columns)));

        // Apply positioning styles
        div.style.cssText = `
            position: absolute;
            left: ${element.position.x}%;
            top: ${element.position.y}%;
            width: ${element.position.width}%;
            height: ${element.position.height}%;
            z-index: ${element.position.zIndex};
            cursor: move;
            overflow: hidden;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            --base-font-size: ${baseFontSize}px;
            --icon-size: ${iconSize}px;
        `;

        // Generate the table HTML with responsive sizing
        const tableHTML = this.generateTableHTML(strategyContent, baseFontSize, iconSize);
        div.innerHTML = tableHTML;

        return div;
    }

    // Generate HTML for the strategy table
    generateTableHTML(strategyContent, baseFontSize = 10, iconSize = 16) {
        console.log('🔧 Generating table HTML for strategy:', {
            rows: strategyContent.data.length,
            columns: strategyContent.data[0]?.length,
            baseFontSize,
            iconSize
        });

        let tableHTML = `<table class="insight-table" style="width: 100%; height: 100%; border-collapse: collapse; font-size: ${baseFontSize}px; background: white;">`;

        // Generate each row
        strategyContent.data.forEach((row, rowIndex) => {
            console.log(`🔧 Generating row ${rowIndex} with ${row.length} data cells`);
            tableHTML += `<tr data-row="${rowIndex}">`;

            // Category cell (first column)
            tableHTML += this.generateCategoryCell(strategyContent.headers[rowIndex], rowIndex, baseFontSize, iconSize);

            // Image cell (second column)
            tableHTML += this.generateImageCell(iconSize);

            // Data cells
            row.forEach((cell, cellIndex) => {
                tableHTML += this.generateDataCell(cell, row.length, baseFontSize, iconSize);
            });

            tableHTML += '</tr>';
        });

        tableHTML += '</table>';
        return tableHTML;
    }

    // Generate category cell HTML
    generateCategoryCell(header, rowIndex, baseFontSize, iconSize) {
        let categoryHTML = '';

        if (header && typeof header === 'object' && header.icon) {
            categoryHTML = `
                <div style="
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    height: 100%;
                    padding: 4px;
                ">
                    <i class="bi bi-${header.icon}" style="
                        font-size: ${iconSize}px;
                        color: white;
                        display: block;
                        margin-bottom: 2px;
                    "></i>
                    <div style="
                        font-size: ${Math.max(7, baseFontSize - 2)}px;
                        line-height: 1.1;
                        font-weight: 600;
                        color: white;
                    ">${header.text}</div>
                </div>
            `;
        } else if (header && typeof header === 'string') {
            categoryHTML = header;
        } else {
            categoryHTML = `ROW ${rowIndex + 1}<br>LEVEL`;
        }

        return `
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
    }

    // Generate image cell HTML
    generateImageCell(iconSize) {
        const imageSize = Math.max(24, Math.min(40, iconSize * 2));
        return `
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
                    cursor: pointer;
                    transition: all 0.2s;
                "
                onmouseover="this.style.background='#cbd5e1'"
                onmouseout="this.style.background='#e2e8f0'"
                onclick="this.innerHTML='<i class=\\'bi bi-upload\\' style=\\'font-size: ${iconSize}px;\\'></i>'"
                >
                    <i class="bi bi-image" style="font-size: ${iconSize}px;"></i>
                </div>
            </td>
        `;
    }

    // Generate data cell HTML
    generateDataCell(cell, totalCells, baseFontSize, iconSize) {
        const cellWidth = Math.floor(75 / totalCells);

        return `
            <td class="text-cell" style="
                background: white;
                border: 1px solid #e2e8f0;
                padding: 3px;
                text-align: center;
                width: ${cellWidth}%;
                vertical-align: middle;
                transition: all 0.2s;
                cursor: pointer;
            "
            onmouseover="this.style.background='#f8fafc'; this.style.borderColor='#8B5CF6'"
            onmouseout="this.style.background='white'; this.style.borderColor='#e2e8f0'"
            >
                <div style="
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    padding: 2px;
                ">
                    <i class="bi bi-${cell.icon}" style="
                        font-size: ${iconSize}px;
                        color: #3b82f6;
                        display: block;
                        margin-bottom: 2px;
                        transition: all 0.2s;
                    "></i>
                    <div style="
                        font-size: ${Math.max(7, baseFontSize - 1)}px;
                        line-height: 1.1;
                        font-weight: 600;
                        color: #1e293b;
                        word-break: break-word;
                        hyphens: auto;
                    ">${cell.text}</div>
                </div>
            </td>
        `;
    }

    // Add interactivity to matrix cells
    addMatrixInteractivity(matrixElement) {
        const table = matrixElement.querySelector('.insight-table');
        if (!table) return;

        // Add click handlers to data cells
        const dataCells = table.querySelectorAll('.text-cell');
        dataCells.forEach(cell => {
            cell.addEventListener('click', (e) => {
                this.handleCellClick(e, cell);
            });
        });

        // Add click handlers to image cells
        const imageCells = table.querySelectorAll('.image-cell');
        imageCells.forEach(cell => {
            cell.addEventListener('click', (e) => {
                this.handleImageCellClick(e, cell);
            });
        });
    }

    // Handle data cell click
    handleCellClick(event, cell) {
        event.stopPropagation();

        // Remove previous selections
        const table = cell.closest('table');
        table.querySelectorAll('.text-cell').forEach(c => {
            c.style.background = 'white';
            c.style.borderColor = '#e2e8f0';
        });

        // Highlight selected cell
        cell.style.background = '#8B5CF6';
        cell.style.borderColor = '#7C3AED';
        cell.style.color = 'white';

        const cellText = cell.querySelector('div:last-child').textContent;
        console.log('🎯 Selected matrix cell:', cellText);

        // You can add more interaction logic here
        if (window.showToast) {
            window.showToast(`Selected: ${cellText}`, 'info');
        }
    }

    // Handle image cell click
    handleImageCellClick(event, cell) {
        event.stopPropagation();

        // Create file input for image upload
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const placeholder = cell.querySelector('.image-placeholder');
                    placeholder.innerHTML = `
                        <img src="${e.target.result}" style="
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                            border-radius: 4px;
                        ">
                    `;
                };
                reader.readAsDataURL(file);
            }
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    // Get matrix element statistics
    getMatrixStats(element) {
        const content = element.content;
        const strategyContent = content.strategyContent;

        return {
            solutionId: content.solutionId,
            solutionName: content.solutionName,
            rows: strategyContent.data.length,
            columns: strategyContent.data[0]?.length || 0,
            totalCells: strategyContent.data.reduce((total, row) => total + row.length, 0),
            headers: strategyContent.headers.length
        };
    }

    // Export matrix data
    exportMatrixData(element) {
        const stats = this.getMatrixStats(element);
        const content = element.content;

        return {
            metadata: {
                solutionId: content.solutionId,
                solutionName: content.solutionName,
                exportedAt: new Date().toISOString(),
                stats: stats
            },
            content: content.strategyContent
        };
    }
}

// Create global instance
window.branvaMatrixRenderer = new BranvaMatrixRenderer();