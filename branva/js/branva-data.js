// Branva Data - Strategy Solutions, Insights, and Mockups

// Solution Templates Data
window.BranvaData = {
    solutions: [],
    strategiesLoaded: false,

    insights: [
        // Maps & Geography
        {
            id: "world-map-heatmap",
            name: "World Map Heatmap",
            category: "maps",
            iconClass: "bi-globe",
            toolType: "data-driven",
            defaultSize: { width: 400, height: 250 },
            configurable: true,
            tags: ["global", "heat", "distribution", "geography"]
        },
        {
            id: "location-pin",
            name: "Location Pin",
            category: "maps",
            iconClass: "bi-geo-alt-fill",
            toolType: "static",
            defaultSize: { width: 40, height: 60 },
            configurable: true,
            tags: ["location", "marker", "point"]
        },
        {
            id: "radius-circle",
            name: "Coverage Area",
            category: "maps",
            iconClass: "bi-circle",
            toolType: "static",
            defaultSize: { width: 100, height: 100 },
            configurable: true,
            tags: ["coverage", "radius", "area"]
        },
        {
            id: "route-line",
            name: "Route Path",
            category: "maps",
            iconClass: "bi-arrow-right",
            toolType: "static",
            defaultSize: { width: 200, height: 20 },
            configurable: true,
            tags: ["route", "path", "journey"]
        },

        // Consumer Behavior
        {
            id: "consumer-journey-flow",
            name: "Journey Flow",
            category: "behavior",
            iconClass: "bi-arrow-right-circle",
            toolType: "interactive",
            defaultSize: { width: 450, height: 200 },
            configurable: true,
            tags: ["journey", "flow", "stages", "behavior"]
        },
        {
            id: "behavior-pattern",
            name: "Behavior Pattern",
            category: "behavior",
            iconClass: "bi-graph-up",
            toolType: "data-driven",
            defaultSize: { width: 300, height: 200 },
            configurable: true,
            tags: ["pattern", "behavior", "analysis"]
        },
        {
            id: "emotion-scale",
            name: "Emotion Scale",
            category: "behavior",
            iconClass: "bi-emoji-smile",
            toolType: "static",
            defaultSize: { width: 250, height: 50 },
            configurable: true,
            tags: ["emotion", "feeling", "scale"]
        },

        // Data Visualization
        {
            id: "funnel-conversion",
            name: "Conversion Funnel",
            category: "data",
            iconClass: "bi-funnel",
            toolType: "data-driven",
            defaultSize: { width: 250, height: 300 },
            configurable: true,
            tags: ["funnel", "conversion", "metrics", "performance"]
        },
        {
            id: "bar-chart",
            name: "Bar Chart",
            category: "data",
            iconClass: "bi-bar-chart",
            toolType: "data-driven",
            defaultSize: { width: 300, height: 200 },
            configurable: true,
            tags: ["chart", "data", "comparison"]
        },
        {
            id: "pie-chart",
            name: "Pie Chart",
            category: "data",
            iconClass: "bi-pie-chart",
            toolType: "data-driven",
            defaultSize: { width: 200, height: 200 },
            configurable: true,
            tags: ["pie", "distribution", "percentage"]
        },
        {
            id: "line-graph",
            name: "Trend Line",
            category: "data",
            iconClass: "bi-graph-up",
            toolType: "data-driven",
            defaultSize: { width: 350, height: 200 },
            configurable: true,
            tags: ["trend", "time", "growth"]
        },

        // Journey Mapping
        {
            id: "journey-timeline",
            name: "Journey Timeline",
            category: "journey",
            iconClass: "bi-stopwatch",
            toolType: "interactive",
            defaultSize: { width: 500, height: 100 },
            configurable: true,
            tags: ["timeline", "journey", "stages"]
        },
        {
            id: "touchpoint-map",
            name: "Touchpoint Map",
            category: "journey",
            iconClass: "bi-diagram-3",
            toolType: "interactive",
            defaultSize: { width: 400, height: 300 },
            configurable: true,
            tags: ["touchpoint", "interaction", "map"]
        },
        {
            id: "experience-curve",
            name: "Experience Curve",
            category: "journey",
            iconClass: "bi-bezier",
            toolType: "data-driven",
            defaultSize: { width: 350, height: 150 },
            configurable: true,
            tags: ["experience", "satisfaction", "curve"]
        },

        // Touchpoints
        {
            id: "social-media-icon",
            name: "Social Media",
            category: "touchpoints",
            iconClass: "bi-share",
            toolType: "static",
            defaultSize: { width: 60, height: 60 },
            configurable: false,
            tags: ["digital", "social", "touchpoint"]
        },
        {
            id: "retail-store-icon",
            name: "Retail Store",
            category: "touchpoints",
            iconClass: "bi-shop",
            toolType: "static",
            defaultSize: { width: 60, height: 60 },
            configurable: false,
            tags: ["physical", "retail", "touchpoint"]
        },
        {
            id: "website-icon",
            name: "Website",
            category: "touchpoints",
            iconClass: "bi-globe",
            toolType: "static",
            defaultSize: { width: 60, height: 60 },
            configurable: false,
            tags: ["digital", "web", "touchpoint"]
        },
        {
            id: "email-icon",
            name: "Email",
            category: "touchpoints",
            iconClass: "bi-envelope",
            toolType: "static",
            defaultSize: { width: 60, height: 60 },
            configurable: false,
            tags: ["digital", "email", "touchpoint"]
        },
        {
            id: "phone-icon",
            name: "Phone Call",
            category: "touchpoints",
            iconClass: "bi-telephone",
            toolType: "static",
            defaultSize: { width: 60, height: 60 },
            configurable: false,
            tags: ["voice", "phone", "touchpoint"]
        }
    ],

    personas: [
        {
            id: "homemakers",
            name: "Homemakers",
            description: "Primary household decision-makers focused on family needs and home management",
            mockupCount: 50
        },
        {
            id: "working-professionals",
            name: "Working Professionals",
            description: "Career-focused individuals in office environments and commute scenarios",
            mockupCount: 45
        },
        {
            id: "gen-z-digital-natives",
            name: "Gen-Z Digital Natives",
            description: "18-25 year olds highly active on social media and mobile platforms",
            mockupCount: 60
        },
        {
            id: "parents-young-children",
            name: "Parents with Young Children",
            description: "Parents navigating child-focused environments and family activities",
            mockupCount: 55
        },
        {
            id: "fitness-enthusiasts",
            name: "Fitness Enthusiasts",
            description: "Health-conscious individuals in gym, outdoor, and wellness environments",
            mockupCount: 40
        },
        {
            id: "luxury-consumers",
            name: "Luxury Consumers",
            description: "High-income individuals in premium retail and exclusive environments",
            mockupCount: 35
        }
    ],

    mockups: {
        homemakers: [
            {
                id: "grocery-aisle-endcap",
                name: "Grocery Aisle Endcap",
                category: "retail-environments",
                description: "Large promotional display at the end of grocery store aisle - prime visibility location",
                placementArea: { x: 35, y: 25, width: 30, height: 40 },
                tags: ["grocery", "retail", "high-traffic", "promotional"]
            },
            {
                id: "shopping-cart-ad",
                name: "Shopping Cart Ad",
                category: "retail-environments",
                description: "Ad panel mounted on shopping cart - accompanies shopper throughout store visit",
                placementArea: { x: 40, y: 30, width: 20, height: 25, rotation: -5 },
                tags: ["grocery", "mobile", "dwell-time", "impulse"]
            },
            {
                id: "pharmacy-counter-signage",
                name: "Pharmacy Counter Sign",
                category: "drugstore-pharmacy",
                description: "Signage visible while customers wait at pharmacy counter - high attention time",
                placementArea: { x: 30, y: 20, width: 40, height: 30 },
                tags: ["pharmacy", "health", "dwell-time", "trust"]
            },
            {
                id: "school-bulletin-board",
                name: "School Bulletin Board",
                category: "childrens-spaces",
                description: "Poster in school hallway bulletin board - seen by parents during pickup/dropoff",
                placementArea: { x: 25, y: 30, width: 30, height: 45 },
                tags: ["school", "parents", "education", "community"]
            },
            {
                id: "package-insert-card",
                name: "Package Insert Card",
                category: "home-delivery",
                description: "Card inserted in delivery package - first brand touchpoint at home",
                placementArea: { x: 30, y: 35, width: 40, height: 30, rotation: 3 },
                tags: ["delivery", "home", "personal", "first-impression"]
            }
        ],
        "working-professionals": [
            {
                id: "subway-platform-poster",
                name: "Subway Platform Poster",
                category: "commute-transit",
                description: "Large poster on subway platform wall - seen during wait times",
                placementArea: { x: 20, y: 15, width: 60, height: 40 },
                tags: ["transit", "commute", "urban", "professional"]
            },
            {
                id: "office-elevator-screen",
                name: "Office Elevator Screen",
                category: "office-environments",
                description: "Digital screen in office building elevator - captive audience",
                placementArea: { x: 35, y: 30, width: 30, height: 40 },
                tags: ["office", "professional", "digital", "captive"]
            },
            {
                id: "coffee-shop-table-tent",
                name: "Coffee Shop Table Tent",
                category: "office-environments",
                description: "Table tent card in business district coffee shop during morning rush",
                placementArea: { x: 40, y: 50, width: 20, height: 30 },
                tags: ["coffee", "morning", "business", "networking"]
            }
        ],
        "gen-z-digital-natives": [
            {
                id: "tiktok-mobile-feed",
                name: "TikTok Feed Ad",
                category: "digital-integration",
                description: "Full-screen ad in TikTok feed on mobile device",
                placementArea: { x: 42, y: 18, width: 16, height: 64 },
                tags: ["social", "mobile", "gen-z", "video"]
            },
            {
                id: "gaming-cafe-monitor",
                name: "Gaming Cafe Monitor",
                category: "entertainment-venues",
                description: "Display ad on gaming monitor in esports cafe",
                placementArea: { x: 30, y: 20, width: 40, height: 30 },
                tags: ["gaming", "esports", "entertainment", "digital"]
            },
            {
                id: "campus-digital-board",
                name: "Campus Digital Board",
                category: "entertainment-venues",
                description: "Digital advertising board in university campus common area",
                placementArea: { x: 25, y: 25, width: 50, height: 35 },
                tags: ["university", "campus", "students", "digital"]
            }
        ],
        "fitness-enthusiasts": [
            {
                id: "gym-locker-room-poster",
                name: "Gym Locker Room Poster",
                category: "fitness-wellness",
                description: "Poster in gym locker room - high dwell time while changing",
                placementArea: { x: 30, y: 20, width: 40, height: 50 },
                tags: ["fitness", "wellness", "health", "captive"]
            },
            {
                id: "yoga-studio-mirror",
                name: "Yoga Studio Mirror Ad",
                category: "fitness-wellness",
                description: "Small branded element on yoga studio mirror - seen during class",
                placementArea: { x: 75, y: 10, width: 20, height: 15 },
                tags: ["yoga", "mindfulness", "wellness", "mirror"]
            }
        ]
    }
};

// Load strategies using the modular strategy loader
window.BranvaData.loadStrategies = async function() {
    const success = await window.branvaStrategyLoader.loadStrategies();
    if (success) {
        this.solutions = window.branvaStrategyLoader.getAllStrategies();
        this.strategiesLoaded = true;
    }
    return success;
};

// Load strategy content using the modular strategy loader
window.BranvaData.loadStrategyContent = async function(strategyId) {
    return await window.branvaStrategyLoader.loadStrategyContent(strategyId);
};

// Helper functions for data filtering
window.BranvaData.getSolutionsByCategory = function(category) {
    if (category === 'all') return this.solutions;
    if (category === 'high') return this.solutions.filter(s => s.marketUrgency === 'HIGH');
    return this.solutions.filter(s => s.category.includes(category.charAt(0).toUpperCase() + category.slice(1)));
};

window.BranvaData.getInsightsByCategory = function(category) {
    if (category === 'maps') return this.insights.filter(i => i.category === 'maps');
    if (category === 'behavior') return this.insights.filter(i => i.category === 'behavior');
    if (category === 'data') return this.insights.filter(i => i.category === 'data');
    if (category === 'journey') return this.insights.filter(i => i.category === 'journey');
    if (category === 'touchpoints') return this.insights.filter(i => i.category === 'touchpoints');
    return this.insights;
};

window.BranvaData.getMockupsByPersona = function(personaId) {
    return this.mockups[personaId] || [];
};