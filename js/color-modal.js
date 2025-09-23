// Color Customization Modal
export class ColorModal {
    constructor() {
        this.modal = null;
        this.selectedColorRow = null;
        this.populateCategoryButtonsTimeout = null; // Debouncing timeout
        this.init();
    }

    init() {
        this.createModalHTML();
        this.setupEventListeners();
    }

    createModalHTML() {
        let modal = document.getElementById('colorModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'colorModal';
            modal.className = 'crop-modal';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="crop-container" style="max-width: 95vw; max-height: 90vh; overflow-y: auto; min-width: 900px;">
                <!-- Header -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <i class="bi bi-palette" style="color: white; font-size: 18px;"></i>
                        </div>
                        <div>
                            <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #1e293b;">Brand Colors</h2>
                            <p style="margin: 0; font-size: 14px; color: #64748b;">Customize colors to match your brand identity</p>
                        </div>
                    </div>
                    <button id="closeColorModal" style="width: 32px; height: 32px; border: none; background: #f1f5f9; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
                        <i class="bi bi-x" style="font-size: 18px; color: #64748b;"></i>
                    </button>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px;">
                    <!-- Left Section: Category Colors -->
                    <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                            <i class="bi bi-grid-3x3-gap" style="color: #3b82f6; font-size: 16px;"></i>
                            <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b;">Category Colors</h3>
                        </div>
                        <p style="margin: 0 0 20px 0; font-size: 13px; color: #64748b;">Each row can have its own category color</p>

                        <div id="dynamicCategoryButtons" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 20px;">
                            <!-- Categories populated dynamically -->
                        </div>

                        <div id="categoryColorSection" style="display: none;">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                                <span id="selectedRowLabel" style="font-size: 16px; font-weight: 600; color: #1e293b;">Select a category</span>
                            </div>

                            <!-- Category Background Color -->
                            <div style="background: white; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
                                <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #1e293b;">
                                    <i class="bi bi-paint-bucket" style="color: #64748b;"></i>
                                    Background Color
                                </label>
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <input type="color" id="selectedRowColorPicker" value="#8BC34A" style="width: 60px; height: 40px; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer;">
                                    <div style="flex: 1; height: 40px; background: #8BC34A; border: 1px solid #e2e8f0; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: white;" id="categoryBgPreview">
                                        Category Background
                                    </div>
                                </div>
                            </div>

                            <!-- Category Text Color -->
                            <div style="background: white; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0;">
                                <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #1e293b;">
                                    <i class="bi bi-fonts" style="color: #64748b;"></i>
                                    Text Color
                                </label>
                                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                                    <input type="color" id="categoryTextColorPicker" value="#ffffff" style="width: 60px; height: 40px; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer;">
                                    <div style="flex: 1; height: 40px; background: #8BC34A; border: 1px solid #e2e8f0; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: white;" id="categoryTextPreview">
                                        Sample Category Text
                                    </div>
                                </div>
                                <button id="autoContrastBtn" style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; background: #f8fafc; color: #475569; border-radius: 6px; font-size: 12px; cursor: pointer; transition: all 0.2s ease;">
                                    <i class="bi bi-magic" style="margin-right: 4px;"></i>Auto Contrast
                                </button>
                            </div>

                            <!-- Apply to All Button -->
                            <button id="applyToAllCategories" style="width: 100%; padding: 12px; border: 1px solid #e2e8f0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 6px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s ease; margin-top: 16px;">
                                <i class="bi bi-check-all" style="margin-right: 4px;"></i>Apply to All Categories
                            </button>
                        </div>
                    </div>

                    <!-- Right Section: Content Colors -->
                    <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px;">
                            <i class="bi bi-textarea-t" style="color: #10b981; font-size: 16px;"></i>
                            <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b;">Content Colors</h3>
                        </div>
                        <p style="margin: 0 0 20px 0; font-size: 13px; color: #64748b;">Same colors applied to all content cells</p>

                        <!-- Content Background Color -->
                        <div style="background: white; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
                            <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #1e293b;">
                                <i class="bi bi-paint-bucket" style="color: #64748b;"></i>
                                Background Color
                            </label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="color" id="contentBgColorPicker" value="#f5f5f5" style="width: 60px; height: 40px; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer;">
                                <div style="flex: 1; height: 40px; background: #f5f5f5; border: 1px solid #e2e8f0; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #64748b;" id="contentBgPreview">
                                    Content Background
                                </div>
                            </div>
                        </div>

                        <!-- Content Text Color -->
                        <div style="background: white; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; margin-bottom: 16px;">
                            <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #1e293b;">
                                <i class="bi bi-fonts" style="color: #64748b;"></i>
                                Text Color
                            </label>
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                                <input type="color" id="contentTextColorPicker" value="#1e293b" style="width: 60px; height: 40px; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer;">
                                <div style="flex: 1; height: 40px; background: #f5f5f5; border: 1px solid #e2e8f0; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #1e293b;" id="contentTextPreview">
                                    Sample Text Color
                                </div>
                            </div>
                            <button id="contentAutoContrastBtn" style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; background: #f8fafc; color: #475569; border-radius: 6px; font-size: 12px; cursor: pointer; transition: all 0.2s ease;">
                                <i class="bi bi-magic" style="margin-right: 4px;"></i>Auto Contrast
                            </button>
                        </div>

                        <!-- Content Icon Color -->
                        <div style="background: white; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0;">
                            <label style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #1e293b;">
                                <i class="bi bi-star" style="color: #64748b;"></i>
                                Icon Color
                            </label>
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <input type="color" id="contentIconColorPicker" value="#3b82f6" style="width: 60px; height: 40px; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer;">
                                <div style="flex: 1; height: 40px; background: #f5f5f5; border: 1px solid #e2e8f0; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #64748b;" id="contentIconPreview">
                                    <i class="bi bi-star" style="font-size: 16px; color: #3b82f6;" id="iconPreviewIcon"></i>
                                    <span style="margin-left: 8px;">Icon Color</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                    <button id="cancelColorChanges" style="padding: 10px 20px; border: 1px solid #e2e8f0; background: white; color: #64748b; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;">
                        <i class="bi bi-x-lg" style="font-size: 12px;"></i>
                        Cancel
                    </button>
                    <button id="applyColorChanges" style="padding: 10px 20px; border: none; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; border-radius: 6px; font-size: 14px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: all 0.2s;">
                        <i class="bi bi-check-lg" style="font-size: 12px;"></i>
                        Apply Colors
                    </button>
                </div>
            </div>
        `;

        this.modal = modal;
    }

    setupEventListeners() {
        // Close modal
        document.getElementById('closeColorModal').addEventListener('click', () => {
            this.close();
        });

        // Category background color picker
        document.getElementById('selectedRowColorPicker').addEventListener('input', (e) => {
            this.updateCategoryBgColor(e.target.value);
        });

        // Category text color picker
        document.getElementById('categoryTextColorPicker').addEventListener('input', (e) => {
            this.updateCategoryTextColor(e.target.value);
        });

        // Auto contrast button
        document.getElementById('autoContrastBtn').addEventListener('click', () => {
            this.applyAutoContrast();
        });

        // Content color pickers
        document.getElementById('contentBgColorPicker').addEventListener('input', (e) => {
            this.updateContentBgColor(e.target.value);
        });

        document.getElementById('contentTextColorPicker').addEventListener('input', (e) => {
            this.updateContentTextColor(e.target.value);
        });

        document.getElementById('contentIconColorPicker').addEventListener('input', (e) => {
            this.updateContentIconColor(e.target.value);
        });

        // Content auto contrast button
        document.getElementById('contentAutoContrastBtn').addEventListener('click', () => {
            this.applyContentAutoContrast();
        });

        // Apply to all categories
        document.getElementById('applyToAllCategories').addEventListener('click', () => {
            this.applyToAllCategories();
        });

        // Apply changes
        document.getElementById('applyColorChanges').addEventListener('click', () => {
            this.applyColorChanges();
        });

        // Cancel changes
        document.getElementById('cancelColorChanges').addEventListener('click', () => {
            this.close();
        });
    }

    open() {
        this.modal.classList.add('show');
        this.debouncedPopulateCategoryButtons();
        this.initializeContentColors();
    }

    close() {
        this.modal.classList.remove('show');
    }

    debouncedPopulateCategoryButtons() {
        // Clear previous timeout
        if (this.populateCategoryButtonsTimeout) {
            clearTimeout(this.populateCategoryButtonsTimeout);
        }

        // Set new timeout
        this.populateCategoryButtonsTimeout = setTimeout(() => {
            this.populateCategoryButtons();
        }, 300);
    }

    populateCategoryButtons() {
        const categoryButtonsContainer = document.getElementById('dynamicCategoryButtons');
        if (!categoryButtonsContainer) return;

        // Clear existing buttons
        categoryButtonsContainer.innerHTML = '';

        // Get all rows from the table
        const tableRows = document.querySelectorAll('tr[data-row]');

        if (tableRows.length === 0) {
            categoryButtonsContainer.innerHTML = '<p style="text-align: center; color: #64748b; font-style: italic; padding: 20px;">No table data available. Please generate a table first.</p>';
            return;
        }

        // Default colors for rows
        const defaultColors = [
            '#475569', '#0ea5e9', '#8b5cf6', '#06b6d4',
            '#10b981', '#f59e0b', '#ef4444', '#6366f1'
        ];

        tableRows.forEach((row, index) => {
            const categoryCell = row.querySelector('.category-cell');
            if (!categoryCell) return;

            // Extract category text
            let categoryText = '';
            const categoryTextElement = categoryCell.querySelector('div:last-child');
            if (categoryTextElement) {
                categoryText = categoryTextElement.textContent.trim();
            } else {
                categoryText = categoryCell.textContent.trim();
            }

            if (!categoryText) {
                categoryText = `Category ${index + 1}`;
            }

            // Get current background color or use default
            const computedStyle = window.getComputedStyle(categoryCell);
            let buttonColor = computedStyle.backgroundColor;
            
            if (!buttonColor || buttonColor === 'rgba(0, 0, 0, 0)' || buttonColor === 'transparent') {
                buttonColor = defaultColors[index] || '#64748b';
            }

            // Create button
            const button = document.createElement('button');
            button.className = 'modern-row-btn';
            button.setAttribute('data-row', index);
            button.style.cssText = `
                padding: 12px 16px;
                border: none;
                border-radius: 8px;
                color: white;
                font-size: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
                overflow: hidden;
                text-align: center;
                min-height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: ${buttonColor};
            `;
            button.innerHTML = `<span class="row-name">${categoryText}</span>`;

            // Add hover effects
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            });

            button.addEventListener('mouseleave', function() {
                if (!this.classList.contains('selected')) {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = 'none';
                }
            });

            // Add click handler
            button.addEventListener('click', () => {
                this.selectCategoryButton(button, index);
            });

            categoryButtonsContainer.appendChild(button);
        });

        // Adjust grid layout based on number of rows
        const numRows = tableRows.length;
        if (numRows <= 2) {
            categoryButtonsContainer.style.gridTemplateColumns = '1fr';
        } else if (numRows <= 4) {
            categoryButtonsContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
        } else {
            categoryButtonsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
        }
    }

    selectCategoryButton(button, rowIndex) {
        // Remove previous selection
        document.querySelectorAll('.modern-row-btn').forEach(b => b.classList.remove('selected'));

        // Select current button
        button.classList.add('selected');
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.3)';

        this.selectedColorRow = rowIndex;

        // Show category color section
        const categorySection = document.getElementById('categoryColorSection');
        categorySection.style.display = 'block';

        // Get current colors
        const currentBgColor = window.getComputedStyle(button).backgroundColor;
        const rowName = button.querySelector('.row-name').textContent;

        // Update UI
        document.getElementById('selectedRowLabel').textContent = rowName;
        this.updateCategoryPreview(currentBgColor);

        // Convert to hex for color picker
        const hexColor = this.rgbToHex(currentBgColor);
        document.getElementById('selectedRowColorPicker').value = hexColor;

        // Get current text color from actual category cell
        const actualRow = document.querySelector(`tr[data-row="${rowIndex}"]`);
        const categoryCell = actualRow?.querySelector('.category-cell');
        let currentTextColor = '#ffffff';
        
        if (categoryCell) {
            const cellStyle = window.getComputedStyle(categoryCell);
            currentTextColor = this.rgbToHex(cellStyle.color);
        } else {
            currentTextColor = Utils.isColorDark(hexColor) ? '#ffffff' : '#000000';
        }

        document.getElementById('categoryTextColorPicker').value = currentTextColor;
        this.updateCategoryTextColor(currentTextColor);
    }

    initializeContentColors() {
        // Get current colors from text cells
        const firstTextCell = document.querySelector('.text-cell');
        if (firstTextCell) {
            const computedStyle = window.getComputedStyle(firstTextCell);

            // Background color
            const bgColor = this.rgbToHex(computedStyle.backgroundColor);
            if (bgColor !== '#000000') {
                document.getElementById('contentBgColorPicker').value = bgColor;
                this.updateContentBgPreview(bgColor);
            }

            // Text color
            const textColor = this.rgbToHex(computedStyle.color);
            document.getElementById('contentTextColorPicker').value = textColor;
            this.updateContentTextPreview(textColor);
        }

        // Icon color
        const firstIcon = document.querySelector('.text-cell i');
        if (firstIcon) {
            const iconColor = this.rgbToHex(window.getComputedStyle(firstIcon).color);
            document.getElementById('contentIconColorPicker').value = iconColor;
            this.updateContentIconPreview(iconColor);
        }
    }

    updateCategoryBgColor(color) {
        this.updateCategoryPreview(color);
        
        // Auto-set text color based on contrast
        const autoTextColor = Utils.isColorDark(color) ? '#ffffff' : '#000000';
        document.getElementById('categoryTextColorPicker').value = autoTextColor;
        this.updateCategoryTextColor(autoTextColor);

        // Update selected button
        const selectedBtn = document.querySelector('.modern-row-btn.selected');
        if (selectedBtn) {
            selectedBtn.style.background = color;
        }
    }

    updateCategoryTextColor(color) {
        document.getElementById('categoryTextPreview').style.color = color;

        // Update selected button text color
        const selectedBtn = document.querySelector('.modern-row-btn.selected');
        if (selectedBtn) {
            const rowName = selectedBtn.querySelector('.row-name');
            if (rowName) {
                rowName.style.color = color;
            }
        }
    }

    updateCategoryPreview(bgColor) {
        const categoryBgPreview = document.getElementById('categoryBgPreview');
        const categoryTextPreview = document.getElementById('categoryTextPreview');
        
        categoryBgPreview.style.background = bgColor;
        categoryTextPreview.style.background = bgColor;
    }

    updateContentBgColor(color) {
        this.updateContentBgPreview(color);
        
        // Auto-set text color
        const autoTextColor = Utils.isColorDark(color) ? '#ffffff' : '#000000';
        document.getElementById('contentTextColorPicker').value = autoTextColor;
        this.updateContentTextColor(autoTextColor);
    }

    updateContentTextColor(color) {
        document.getElementById('contentTextPreview').style.color = color;
    }

    updateContentIconColor(color) {
        document.getElementById('iconPreviewIcon').style.color = color;
    }

    updateContentBgPreview(color) {
        document.getElementById('contentBgPreview').style.background = color;
        document.getElementById('contentTextPreview').style.background = color;
    }

    updateContentTextPreview(color) {
        document.getElementById('contentTextPreview').style.color = color;
    }

    updateContentIconPreview(color) {
        document.getElementById('iconPreviewIcon').style.color = color;
    }

    applyAutoContrast() {
        const bgColor = document.getElementById('selectedRowColorPicker').value;
        const autoTextColor = Utils.isColorDark(bgColor) ? '#ffffff' : '#000000';
        document.getElementById('categoryTextColorPicker').value = autoTextColor;
        this.updateCategoryTextColor(autoTextColor);
    }

    applyContentAutoContrast() {
        const bgColor = document.getElementById('contentBgColorPicker').value;
        const autoTextColor = Utils.isColorDark(bgColor) ? '#ffffff' : '#000000';
        document.getElementById('contentTextColorPicker').value = autoTextColor;
        this.updateContentTextColor(autoTextColor);
    }

    applyToAllCategories() {
        const categoryBgColor = document.getElementById('selectedRowColorPicker').value;
        const categoryTextColor = document.getElementById('categoryTextColorPicker').value;

        // Apply to all category cells
        const allCategoryCells = document.querySelectorAll('.category-cell');
        allCategoryCells.forEach((categoryCell) => {
            categoryCell.style.setProperty('background-color', categoryBgColor, 'important');
            categoryCell.style.setProperty('background', categoryBgColor, 'important');
            categoryCell.style.setProperty('color', categoryTextColor, 'important');

            // Update child elements
            const categoryTextElements = categoryCell.querySelectorAll('div, span, .category-text');
            categoryTextElements.forEach(textEl => {
                textEl.style.setProperty('color', categoryTextColor, 'important');
            });
        });

        // Update all category buttons in the modal
        document.querySelectorAll('.modern-row-btn').forEach(btn => {
            btn.style.background = categoryBgColor;
            const rowName = btn.querySelector('.row-name');
            if (rowName) {
                rowName.style.color = categoryTextColor;
            }
        });

        Utils.showStatus('Applied colors to all categories!', 'success');
    }

    applyColorChanges() {
        // Apply category color to selected row
        if (this.selectedColorRow !== null) {
            const categoryBgColor = document.getElementById('selectedRowColorPicker').value;
            const categoryTextColor = document.getElementById('categoryTextColorPicker').value;
            const targetRow = document.querySelector(`tr[data-row="${this.selectedColorRow}"]`);

            if (targetRow) {
                const categoryCell = targetRow.querySelector('.category-cell');
                if (categoryCell) {
                    this.applyCategoryColors(categoryCell, categoryBgColor, categoryTextColor);
                }
            }
        }

        // Apply content colors to all text cells
        const contentBgColor = document.getElementById('contentBgColorPicker').value;
        const contentTextColor = document.getElementById('contentTextColorPicker').value;
        const contentIconColor = document.getElementById('contentIconColorPicker').value;

        this.applyContentColors(contentBgColor, contentTextColor, contentIconColor);

        this.close();
        Utils.showStatus('Brand colors applied successfully!', 'success');
    }

    applyCategoryColors(categoryCell, bgColor, textColor) {
        categoryCell.style.setProperty('background-color', bgColor, 'important');
        categoryCell.style.setProperty('background', bgColor, 'important');
        categoryCell.style.setProperty('color', textColor, 'important');

        // Update child text elements
        const categoryTextElements = categoryCell.querySelectorAll('div, span, .category-text');
        categoryTextElements.forEach(textEl => {
            textEl.style.setProperty('color', textColor, 'important');
        });
    }

    applyContentColors(bgColor, textColor, iconColor) {
        const textCells = document.querySelectorAll('.text-cell');
        
        textCells.forEach((cell) => {
            cell.style.setProperty('background-color', bgColor, 'important');
            cell.style.setProperty('background', bgColor, 'important');
            cell.style.setProperty('color', textColor, 'important');

            // Update text elements
            const textElements = cell.querySelectorAll('div, span, p');
            textElements.forEach(textEl => {
                textEl.style.setProperty('color', textColor, 'important');
            });

            // Update icon colors
            const icons = cell.querySelectorAll('i, .bi');
            icons.forEach(icon => {
                icon.style.setProperty('color', iconColor, 'important');
            });

            // Handle structured cells
            const cellContent = cell.querySelector('[style*="flex-direction: column"]');
            if (cellContent) {
                cellContent.style.setProperty('background-color', bgColor, 'important');

                const textDivs = cellContent.querySelectorAll('div:not(.bi):not([class*="bi-"])');
                textDivs.forEach(textDiv => {
                    if (textDiv.textContent.trim() && !textDiv.querySelector('i')) {
                        textDiv.style.setProperty('color', textColor, 'important');
                    }
                });

                const structuredIcons = cellContent.querySelectorAll('i, .bi');
                structuredIcons.forEach(icon => {
                    icon.style.setProperty('color', iconColor, 'important');
                });
            }
        });

        // Force repaint
        document.body.style.display = 'none';
        document.body.offsetHeight;
        document.body.style.display = '';
    }

    rgbToHex(rgb) {
        if (rgb.startsWith('#')) return rgb;
        
        const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (match) {
            const [, r, g, b] = match;
            return Utils.rgbToHex(parseInt(r), parseInt(g), parseInt(b));
        }
        return '#000000';
    }
}