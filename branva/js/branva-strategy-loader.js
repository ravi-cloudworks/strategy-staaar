// Branva Strategy Loader - Handles loading and managing strategy data
// This module is responsible for fetching strategy metadata and content from JSON files

class BranvaStrategyLoader {
    constructor() {
        this.strategies = [];
        this.strategiesLoaded = false;
        this.currentStrategy = null;
    }

    // Load strategy metadata from JSON file
    async loadStrategies() {
        if (this.strategiesLoaded) return true;

        try {
            console.log('🔄 Loading strategy metadata...');
            const response = await fetch('data/strategy-metadata.json');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const strategies = await response.json();

            // Transform the data format for Branva
            this.strategies = strategies.map(strategy => ({
                id: strategy.id,
                name: strategy.name,
                description: strategy.description,
                category: strategy.category.split(', '),
                value: strategy.value,
                whoSearches: strategy.whoSearches,
                whyNeeded: strategy.whyNeeded,
                pricing: strategy.pricing,
                speed: strategy.speed,
                marketUrgency: strategy.marketUrgency,
                gridSize: { rows: strategy.rows, columns: strategy.columns },
                file: strategy.file
            }));

            this.strategiesLoaded = true;
            console.log(`✅ Loaded ${strategies.length} strategies for Branva`);
            return true;

        } catch (error) {
            console.error('❌ Error loading strategy metadata:', error);
            return false;
        }
    }

    // Load specific strategy content (matrix data)
    async loadStrategyContent(strategyId) {
        try {
            console.log(`🔄 Loading strategy content for: ${strategyId}`);

            const strategy = this.strategies.find(s => s.id === strategyId);
            if (!strategy) {
                throw new Error(`Strategy not found: ${strategyId}`);
            }

            const response = await fetch(`data/strategies/${strategy.file}`);
            if (!response.ok) {
                throw new Error(`Failed to load strategy file: ${strategy.file}`);
            }

            const content = await response.json();
            console.log(`✅ Loaded strategy content for: ${strategyId}`);

            return content;

        } catch (error) {
            console.error(`❌ Error loading strategy content for ${strategyId}:`, error);
            return null;
        }
    }

    // Get strategies by category filter
    getSolutionsByCategory(category) {
        if (category === 'all') return this.strategies;
        if (category === 'high') return this.strategies.filter(s => s.marketUrgency === 'HIGH');

        const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1);
        return this.strategies.filter(s => s.category.includes(capitalizedCategory));
    }

    // Get strategy by ID
    getStrategyById(strategyId) {
        return this.strategies.find(s => s.id === strategyId);
    }

    // Get all strategies
    getAllStrategies() {
        return this.strategies;
    }

    // Set current strategy
    setCurrentStrategy(strategy) {
        this.currentStrategy = strategy;
    }

    // Get current strategy
    getCurrentStrategy() {
        return this.currentStrategy;
    }

    // Search strategies by text
    searchStrategies(query) {
        if (!query || query.trim() === '') return this.strategies;

        const lowerQuery = query.toLowerCase();
        return this.strategies.filter(strategy =>
            strategy.name.toLowerCase().includes(lowerQuery) ||
            strategy.description.toLowerCase().includes(lowerQuery) ||
            strategy.category.some(cat => cat.toLowerCase().includes(lowerQuery)) ||
            strategy.whoSearches.toLowerCase().includes(lowerQuery)
        );
    }

    // Get strategies by urgency level
    getStrategiesByUrgency(urgency) {
        return this.strategies.filter(s => s.marketUrgency === urgency.toUpperCase());
    }

    // Get statistics about loaded strategies
    getStatistics() {
        const total = this.strategies.length;
        const byUrgency = {
            HIGH: this.strategies.filter(s => s.marketUrgency === 'HIGH').length,
            MEDIUM: this.strategies.filter(s => s.marketUrgency === 'MEDIUM').length,
            LOW: this.strategies.filter(s => s.marketUrgency === 'LOW').length
        };

        const byCategory = {};
        this.strategies.forEach(strategy => {
            strategy.category.forEach(cat => {
                byCategory[cat] = (byCategory[cat] || 0) + 1;
            });
        });

        return {
            total,
            byUrgency,
            byCategory
        };
    }
}

// Create global instance
window.branvaStrategyLoader = new BranvaStrategyLoader();