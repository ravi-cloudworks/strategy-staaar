// Strategy Data Management
class StrategyLoader {
    constructor() {
        this.STRATEGY_PRESETS = [];
        this.currentStrategy = null;
    }

    async init() {
        const success = await this.loadStrategyMetadata();
        if (success) {
            await this.initializePageWithFirstStrategy();
        }
        return success;
    }

    async loadStrategyMetadata() {
        try {
            const response = await fetch('./data/strategy-metadata.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const strategies = await response.json();
            this.STRATEGY_PRESETS = strategies;
            console.log(`✅ Loaded ${strategies.length} strategies from strategy-metadata.json`);
            return true;
        } catch (error) {
            console.error('Error loading strategy metadata:', error);
            Utils.showStatus('Failed to load strategy data from external file', 'error');
            return false;
        }
    }

    async loadStrategyContent(strategyId) {
        console.log('🔍 DEBUG: Loading strategy content for ID:', strategyId);

        try {
            const strategy = this.STRATEGY_PRESETS.find(s => s.id === strategyId);
            if (!strategy) throw new Error('Strategy not found');

            console.log('🔍 DEBUG: Strategy found:', strategy);
            console.log('🔍 DEBUG: Loading file:', `./data/strategies/${strategy.file}`);

            const response = await fetch(`./data/strategies/${strategy.file}`);
            if (!response.ok) throw new Error('Failed to load strategy content');

            const content = await response.json();

            console.log('🔍 DEBUG: Loaded content:', content);
            return content;
        } catch (error) {
            console.error('Error loading strategy content:', error);
            Utils.showStatus('Failed to load strategy content', 'error');
            return null;
        }
    }

    async selectStrategy(strategyId) {
        const strategy = this.STRATEGY_PRESETS.find(s => s.id === strategyId);
        if (!strategy) return false;

        // Show loading state
        Utils.showStatus('Loading strategy...', 'info');

        // Update the selected display
        this.updateSelectedDisplay(strategy);

        // Update the floating title card
        this.updateTitleCard(strategy);

        // Load strategy content
        const content = await this.loadStrategyContent(strategyId);
        if (content) {
            this.updateInsightTable(content);
            this.currentStrategy = { ...strategy, content };

            Utils.showStatus(`Selected: ${strategy.name}`, 'success');
            return true;
        } else {
            Utils.showStatus('Failed to load strategy content', 'error');
            return false;
        }
    }

    updateSelectedDisplay(strategy) {
        const nameElement = document.querySelector('.selected-name');
        const detailsElement = document.querySelector('.selected-details');

        if (nameElement) nameElement.textContent = strategy.name;
        if (detailsElement) detailsElement.textContent = strategy.description;
    }

    updateTitleCard(strategy) {
        const mainTitleElement = document.querySelector('.main-title');
        const subtitleElement = document.querySelector('.subtitle');
        
        if (mainTitleElement) mainTitleElement.textContent = strategy.name;
        if (subtitleElement) subtitleElement.textContent = strategy.description;
    }

    updateInsightTable(content) {
        console.log('🔍 DEBUG: updateInsightTable called with content:', content);

        const table = document.querySelector('.insight-table');
        if (!table) return;

        // Clear existing content
        table.innerHTML = '';

        console.log('🔍 DEBUG: About to render table with headers:', content.headers);
        console.log('🔍 DEBUG: About to render table with data rows:', content.data?.length);

        // Create rows that match the original table structure
        content.data.forEach((row, rowIndex) => {
            const tr = document.createElement('tr');
            tr.setAttribute('data-row', rowIndex);

            // Add category cell (first column) - use headers from JSON
            const categoryCell = document.createElement('td');
            categoryCell.className = 'category-cell';

            // Use the header for this row if available
            const header = content.headers[rowIndex];
            console.log(`🔍 DEBUG: Row ${rowIndex} - Header:`, header);
            
            if (header && typeof header === 'object' && header.icon) {
                console.log(`🔍 DEBUG: Row ${rowIndex} - Rendering icon: bi-${header.icon} for text: ${header.text}`);
                categoryCell.innerHTML = `
                    <div style="text-align: center; display: flex; flex-direction: column; justify-content: center; height: 100%; padding: 6px;">
                        <i class="bi bi-${header.icon}" style="font-size: 24px; color: white; display: block; margin-bottom: 6px;"></i>
                        <div style="font-size: 11px; line-height: 1.2; font-weight: 600; color: white;">${header.text}</div>
                    </div>
                `;
            } else if (header && typeof header === 'string') {
                categoryCell.innerHTML = header;
            } else {
                categoryCell.innerHTML = `ROW ${rowIndex + 1}<br>LEVEL`;
            }
            tr.appendChild(categoryCell);

            // Add image cell (second column)
            const imageCell = document.createElement('td');
            imageCell.className = 'image-cell';
            imageCell.innerHTML = `
                <div class="image-placeholder" data-col="1">
                    <i class="bi bi-image"></i>
                </div>
            `;
            tr.appendChild(imageCell);

            // Add text cells for each data column
            row.forEach((cell, cellIndex) => {
                console.log(`🔍 DEBUG: Row ${rowIndex}, Cell ${cellIndex} - Cell data:`, cell);
                const td = document.createElement('td');
                td.className = 'text-cell';

                // Add header info as tooltip
                const header = content.headers[cellIndex];
                if (header && typeof header === 'object') {
                    td.title = header.text;
                }

                console.log(`🔍 DEBUG: Row ${rowIndex}, Cell ${cellIndex} - Rendering icon: bi-${cell.icon} for text: ${cell.text}`);
                
                td.innerHTML = `
                    <div style="text-align: center; display: flex; flex-direction: column; justify-content: center; height: 100%; padding: 6px;">
                        <i class="bi bi-${cell.icon}" style="font-size: 24px; color: #3b82f6; display: block; margin-bottom: 6px;"></i>
                        <div style="font-size: 11px; line-height: 1.2; font-weight: 600; color: #1e293b;">${cell.text}</div>
                    </div>
                `;

                tr.appendChild(td);
            });

            table.appendChild(tr);
        });

        // Update Step 2 row buttons after table is updated
        setTimeout(() => {
            this.populateRowButtons();
        }, 100);
    }

    populateRowButtons() {
        const rowSelector = document.getElementById('dynamicRowSelector');
        if (!rowSelector) return;

        // Clear existing buttons
        rowSelector.innerHTML = '';

        // Get all rows from the table
        const tableRows = document.querySelectorAll('tr[data-row]');
        console.log(`🔧 Populating ${tableRows.length} row buttons for Step 2`);

        tableRows.forEach((row, index) => {
            const categoryCell = row.querySelector('.category-cell');
            let categoryText = '';

            // Extract category text
            const categoryTextElement = categoryCell.querySelector('div:last-child');
            if (categoryTextElement) {
                categoryText = categoryTextElement.textContent.trim();
            } else {
                categoryText = categoryCell.textContent.trim();
            }

            // Fallback to generic name if no text found
            if (!categoryText) {
                categoryText = `Row ${index + 1}`;
            } else {
                // Simplify category text for button
                const words = categoryText.split(' ');
                if (words.length > 2) {
                    categoryText = words.slice(0, 2).join(' ');
                }
            }

            // Create button
            const button = document.createElement('button');
            button.className = 'row-btn';
            button.setAttribute('data-row', index);
            button.textContent = categoryText;

            rowSelector.appendChild(button);
            console.log(`✅ Created row button ${index}: "${categoryText}"`);
        });

        // Notify main app that buttons are ready
        if (window.mainApp && window.mainApp.attachRowButtonListeners) {
            window.mainApp.attachRowButtonListeners();
        }
    }

    async initializePageWithFirstStrategy() {
        console.log('🔍 DEBUG: initializePageWithFirstStrategy called');
        
        if (this.STRATEGY_PRESETS && this.STRATEGY_PRESETS.length > 0) {
            const firstStrategy = this.STRATEGY_PRESETS[0];
            console.log('🔍 DEBUG: First strategy on page load:', firstStrategy);

            // Update displays
            this.updateSelectedDisplay(firstStrategy);
            this.updateTitleCard(firstStrategy);

            // Load and display the first strategy content
            const content = await this.loadStrategyContent(firstStrategy.id);
            if (content) {
                this.updateInsightTable(content);
                this.currentStrategy = { ...firstStrategy, content };
            }
        }
    }

    parseCustomStrategy(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());

        if (lines.length < 3) {
            return { valid: false, error: 'Minimum 3 lines required (title + 2 data rows)' };
        }

        if (lines.length > 7) {
            return { valid: false, error: 'Maximum 7 lines allowed (title + 6 data rows)' };
        }

        // Parse title line
        const titleParts = lines[0].split(',');
        if (titleParts.length < 2) {
            return { valid: false, error: 'First line must contain: Title, Description' };
        }

        const name = titleParts[0].trim();
        const description = titleParts[1].trim();

        // Parse data lines
        const dataRows = [];
        const numCols = Math.floor(lines[1].split(',').length / 2);

        if (numCols < 4 || numCols > 6) {
            return { valid: false, error: 'Each row must have 4-6 columns (8-12 values as icon,text pairs)' };
        }

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length !== numCols * 2) {
                return { valid: false, error: `Row ${i + 1} has incorrect number of values. Expected ${numCols * 2}, got ${values.length}` };
            }

            const row = [];
            for (let j = 0; j < values.length; j += 2) {
                row.push({
                    icon: values[j],
                    text: values[j + 1]
                });
            }
            dataRows.push(row);
        }

        // Generate headers
        const headers = [];
        for (let i = 0; i < numCols; i++) {
            headers.push(`COLUMN ${i + 1}`);
        }

        return {
            valid: true,
            name: name,
            description: description,
            content: {
                headers: headers,
                data: dataRows
            }
        };
    }

    // Filter helper functions
    getIncomeLevel(pricing) {
        const numbers = pricing.match(/\d+,?\d*/g) || [];
        const prices = numbers.map(n => parseInt(n.replace(',', '')));
        const maxPrice = Math.max(...prices);

        if (maxPrice >= 4000) return 'very-high';
        if (maxPrice >= 2000) return 'high';
        return 'medium';
    }

    getSpeedLevel(speed) {
        if (speed.includes('<30') || speed.includes('15-30') || speed.includes('20-30')) {
            return 'quick';
        } else if (speed.includes('30-45') || speed.includes('30-60') || speed.includes('45-60')) {
            return 'medium';
        } else {
            return 'long';
        }
    }

    getBuyerCategories(whoSearches) {
        const categories = [];
        const lower = whoSearches.toLowerCase();

        if (lower.includes('agency') || lower.includes('agencies') ||
            lower.includes('account director') || lower.includes('creative director')) {
            categories.push('agency');
        }

        if (lower.includes('brand') || lower.includes('marketing director') ||
            lower.includes('marketing manager') || lower.includes('product manager')) {
            categories.push('brand');
        }

        if (lower.includes('consultant') || lower.includes('strategist') ||
            lower.includes('leadership coach') || lower.includes('specialist')) {
            categories.push('consultant');
        }

        if (lower.includes('cmo') || lower.includes('director') ||
            lower.includes('executive') || lower.includes('corporate')) {
            categories.push('cmo');
        }

        if (lower.includes('performance') || lower.includes('campaign manager') ||
            lower.includes('e-commerce') || lower.includes('social media')) {
            categories.push('performance');
        }

        if (lower.includes('legal') || lower.includes('compliance') ||
            lower.includes('ethics') || lower.includes('safety')) {
            categories.push('legal');
        }

        if (lower.includes('creative') || lower.includes('innovation') ||
            lower.includes('design') || lower.includes('content')) {
            categories.push('creative');
        }

        return categories;
    }

    // Public getters
    getStrategies() {
        return this.STRATEGY_PRESETS;
    }

    getCurrentStrategy() {
        return this.currentStrategy;
    }

    getStrategyById(id) {
        return this.STRATEGY_PRESETS.find(s => s.id === id);
    }
}

// Initialize and export
window.strategyLoader = new StrategyLoader();