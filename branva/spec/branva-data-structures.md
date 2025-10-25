# Branva Data Structures & Schema

## 1. Solution Templates

```typescript
interface SolutionTemplate {
  id: string;
  name: string;                    // Question format: "Why Are Competitors Stealing Our Customers?"
  description: string;             // Short description (2 lines max)
  category: Category[];            // ["Agency", "Advertiser", "Achiever"]
  value: string;                   // What problem it solves
  whoSearches: string;             // Target users
  whyNeeded: string;               // Pain point it addresses
  pricing: string;                 // "$2,000-$4,500"
  speed: string;                   // "30-45 minutes"
  marketUrgency: 'HIGH' | 'MEDIUM' | 'LOW';
  gridSize: {
    rows: number;                  // 4, 5, or 6
    columns: number;               // Always 6
  };
  templateCells: TemplateCell[];   // Pre-defined grid structure
  previewImage?: string;           // Thumbnail for preview
}

type Category = 'Agency' | 'Advertiser' | 'Achiever';

interface TemplateCell {
  rowIndex: number;
  columnIndex: number;
  cellType: 'heading' | 'insight' | 'data' | 'mockup' | 'text' | 'empty';
  defaultContent?: {
    label?: string;
    placeholder?: string;
    suggestedInsightType?: string;
  };
}
```

### Sample Solution Templates JSON:

```json
[
  {
    "id": "competitor-steal-strategy",
    "name": "Why Are Competitors Stealing Our Customers?",
    "description": "Decodes competitor strategies to reveal exactly why they win customers and provides actionable counter-strategies to win them back",
    "category": ["Agency", "Advertiser", "Achiever"],
    "value": "Helps clients improve their campaigns and retain market share with competitive intelligence that boards can act on immediately",
    "whoSearches": "CMOs, Brand Managers losing market share, Product marketers, Strategic planners under board pressure",
    "whyNeeded": "Boards demand explanations for competitor success and actionable responses, not vague theories or excuses",
    "pricing": "$2,500-$5,000",
    "speed": "30-45 minutes",
    "marketUrgency": "HIGH",
    "gridSize": {
      "rows": 6,
      "columns": 6
    },
    "templateCells": [
      {
        "rowIndex": 0,
        "columnIndex": 0,
        "cellType": "heading",
        "defaultContent": {
          "label": "Strategic Question",
          "placeholder": "Why are competitors stealing our customers?"
        }
      },
      {
        "rowIndex": 1,
        "columnIndex": 0,
        "cellType": "insight",
        "defaultContent": {
          "label": "Customer Journey Comparison",
          "suggestedInsightType": "journey-map"
        }
      }
    ]
  },
  {
    "id": "gen-z-trend-translator",
    "name": "How To Market To Gen-Z Without Looking Cringe",
    "description": "Translates youth culture signals and emerging trends into authentic brand messaging that Gen-Z respects instead of mocks online",
    "category": ["Agency", "Advertiser", "Achiever"],
    "value": "Ensures campaigns connect with younger demographics authentically, improving engagement and preventing viral embarrassment",
    "whoSearches": "Brand managers, Social media managers, Product marketers, Creative directors, Innovation teams",
    "whyNeeded": "Revenue declines in 18-25 segment due to brands trying too hard and getting roasted on TikTok",
    "pricing": "$1,500-$3,500",
    "speed": "30-45 minutes",
    "marketUrgency": "HIGH",
    "gridSize": {
      "rows": 6,
      "columns": 6
    }
  },
  {
    "id": "brand-pyramid",
    "name": "Is Our Brand Building Actually Working?",
    "description": "Measures brand equity effectiveness using Brand Pyramid framework to show exactly what's working and what's wasting budget",
    "category": ["Agency", "Advertiser", "Achiever"],
    "value": "Provides measurable proof of brand value to justify marketing spend and optimize future investments with data boards trust",
    "whoSearches": "Brand managers, Marketing directors, Corporate strategists, Brand architects under scrutiny",
    "whyNeeded": "Boards demand proof of ROI for brand investments - 'awareness' is no longer enough justification",
    "pricing": "$2,500-$5,500",
    "speed": "30-45 minutes",
    "marketUrgency": "HIGH",
    "gridSize": {
      "rows": 6,
      "columns": 6
    }
  }
]
```

---

## 2. Insight Tools

```typescript
interface InsightTool {
  id: string;
  name: string;
  category: InsightCategory;
  subcategory?: string;
  iconUrl: string;
  thumbnailUrl: string;
  toolType: 'static' | 'interactive' | 'data-driven';
  defaultSize: {
    width: number;      // pixels
    height: number;     // pixels
  };
  configurable: boolean;
  defaultConfig?: {
    colors?: string[];
    dataPoints?: number;
    interactiveOptions?: string[];
  };
  tags: string[];
}

type InsightCategory = 
  | 'maps-geography'
  | 'consumer-behavior'
  | 'data-visualization'
  | 'journey-mapping'
  | 'touchpoints';
```

### Sample Insights JSON:

```json
[
  {
    "id": "world-map-heatmap",
    "name": "World Map with Heatmap Overlay",
    "category": "maps-geography",
    "iconUrl": "/icons/world-map.svg",
    "thumbnailUrl": "/thumbnails/world-map-heat.png",
    "toolType": "data-driven",
    "defaultSize": {
      "width": 800,
      "height": 500
    },
    "configurable": true,
    "defaultConfig": {
      "colors": ["#fee5d9", "#fc8d59", "#e34a33", "#b30000"],
      "dataPoints": 50
    },
    "tags": ["global", "heat", "distribution", "geography"]
  },
  {
    "id": "location-pin-marker",
    "name": "Location Pin",
    "category": "maps-geography",
    "iconUrl": "/icons/pin.svg",
    "thumbnailUrl": "/thumbnails/pin.png",
    "toolType": "static",
    "defaultSize": {
      "width": 40,
      "height": 60
    },
    "configurable": true,
    "defaultConfig": {
      "colors": ["#EF4444", "#3B82F6", "#10B981", "#F59E0B"]
    },
    "tags": ["location", "marker", "point"]
  },
  {
    "id": "consumer-journey-flow",
    "name": "Consumer Journey Flow",
    "category": "consumer-behavior",
    "iconUrl": "/icons/journey.svg",
    "thumbnailUrl": "/thumbnails/journey-flow.png",
    "toolType": "interactive",
    "defaultSize": {
      "width": 900,
      "height": 400
    },
    "configurable": true,
    "defaultConfig": {
      "dataPoints": 5,
      "interactiveOptions": ["add-stage", "add-touchpoint", "add-emotion"]
    },
    "tags": ["journey", "flow", "stages", "behavior"]
  },
  {
    "id": "funnel-conversion",
    "name": "Conversion Funnel",
    "category": "data-visualization",
    "iconUrl": "/icons/funnel.svg",
    "thumbnailUrl": "/thumbnails/funnel.png",
    "toolType": "data-driven",
    "defaultSize": {
      "width": 500,
      "height": 600
    },
    "configurable": true,
    "defaultConfig": {
      "colors": ["#8B5CF6", "#7C3AED", "#6D28D9", "#5B21B6"],
      "dataPoints": 4
    },
    "tags": ["funnel", "conversion", "metrics", "performance"]
  },
  {
    "id": "touchpoint-social-media",
    "name": "Social Media Touchpoint",
    "category": "touchpoints",
    "subcategory": "digital",
    "iconUrl": "/icons/social.svg",
    "thumbnailUrl": "/thumbnails/social-touch.png",
    "toolType": "static",
    "defaultSize": {
      "width": 80,
      "height": 80
    },
    "configurable": false,
    "tags": ["digital", "social", "touchpoint", "channel"]
  },
  {
    "id": "touchpoint-retail-store",
    "name": "Retail Store Touchpoint",
    "category": "touchpoints",
    "subcategory": "physical",
    "iconUrl": "/icons/store.svg",
    "thumbnailUrl": "/thumbnails/store-touch.png",
    "toolType": "static",
    "defaultSize": {
      "width": 80,
      "height": 80
    },
    "configurable": false,
    "tags": ["physical", "retail", "touchpoint", "in-store"]
  }
]
```

---

## 3. Mockup Templates

```typescript
interface MockupTemplate {
  id: string;
  name: string;
  persona: Persona;
  category: MockupCategory;
  subcategory?: string;
  description: string;
  environmentImageUrl: string;     // Photo of the environment
  placementArea: {                 // Where creative gets placed
    x: number;                     // percentage from left
    y: number;                     // percentage from top
    width: number;                 // percentage
    height: number;                // percentage
    rotation?: number;             // degrees if angled
  };
  perspective?: 'straight' | 'angled' | 'overhead';
  tags: string[];
  useCases: string[];
}

type Persona = 
  | 'homemakers'
  | 'working-professionals'
  | 'gen-z-digital-natives'
  | 'parents-young-children'
  | 'fitness-enthusiasts'
  | 'luxury-consumers';

type MockupCategory = 
  | 'retail-environments'
  | 'drugstore-pharmacy'
  | 'childrens-spaces'
  | 'community-spaces'
  | 'home-delivery'
  | 'digital-integration'
  | 'office-environments'
  | 'commute-transit'
  | 'fitness-wellness'
  | 'entertainment-venues';
```

### Sample Mockups JSON:

```json
[
  {
    "id": "grocery-aisle-endcap",
    "name": "Grocery Store Aisle Endcap Display",
    "persona": "homemakers",
    "category": "retail-environments",
    "subcategory": "grocery",
    "description": "Large promotional display at the end of grocery store aisle - prime visibility location",
    "environmentImageUrl": "/mockups/grocery-endcap.jpg",
    "placementArea": {
      "x": 35,
      "y": 25,
      "width": 30,
      "height": 40
    },
    "perspective": "straight",
    "tags": ["grocery", "retail", "high-traffic", "promotional"],
    "useCases": ["New product launches", "Seasonal campaigns", "Volume promotions"]
  },
  {
    "id": "shopping-cart-ad",
    "name": "Shopping Cart Advertisement",
    "persona": "homemakers",
    "category": "retail-environments",
    "subcategory": "grocery",
    "description": "Ad panel mounted on shopping cart - accompanies shopper throughout store visit",
    "environmentImageUrl": "/mockups/shopping-cart.jpg",
    "placementArea": {
      "x": 40,
      "y": 30,
      "width": 20,
      "height": 25,
      "rotation": -5
    },
    "perspective": "angled",
    "tags": ["grocery", "mobile", "dwell-time", "impulse"],
    "useCases": ["In-store navigation", "Category reminders", "Impulse purchases"]
  },
  {
    "id": "pharmacy-counter-signage",
    "name": "Pharmacy Counter Signage",
    "persona": "homemakers",
    "category": "drugstore-pharmacy",
    "subcategory": "pharmacy",
    "description": "Signage visible while customers wait at pharmacy counter - high attention time",
    "environmentImageUrl": "/mockups/pharmacy-counter.jpg",
    "placementArea": {
      "x": 30,
      "y": 20,
      "width": 40,
      "height": 30
    },
    "perspective": "straight",
    "tags": ["pharmacy", "health", "dwell-time", "trust"],
    "useCases": ["Health products", "Wellness campaigns", "Trust-building messages"]
  },
  {
    "id": "school-bulletin-board",
    "name": "School Bulletin Board Poster",
    "persona": "homemakers",
    "category": "childrens-spaces",
    "subcategory": "school",
    "description": "Poster in school hallway bulletin board - seen by parents during pickup/dropoff",
    "environmentImageUrl": "/mockups/school-bulletin.jpg",
    "placementArea": {
      "x": 25,
      "y": 30,
      "width": 30,
      "height": 45
    },
    "perspective": "straight",
    "tags": ["school", "parents", "education", "community"],
    "useCases": ["Family products", "Educational services", "Community events"]
  },
  {
    "id": "package-insert-card",
    "name": "Package Insert Card",
    "persona": "homemakers",
    "category": "home-delivery",
    "subcategory": "unboxing",
    "description": "Card inserted in delivery package - first brand touchpoint at home",
    "environmentImageUrl": "/mockups/package-insert.jpg",
    "placementArea": {
      "x": 30,
      "y": 35,
      "width": 40,
      "height": 30,
      "rotation": 3
    },
    "perspective": "overhead",
    "tags": ["delivery", "home", "personal", "first-impression"],
    "useCases": ["Welcome messages", "Loyalty programs", "Cross-sell offers"]
  },
  {
    "id": "tablet-kitchen-mockup",
    "name": "Kitchen Tablet Display",
    "persona": "homemakers",
    "category": "digital-integration",
    "subcategory": "home-tech",
    "description": "Ad/content displayed on tablet device in kitchen setting",
    "environmentImageUrl": "/mockups/kitchen-tablet.jpg",
    "placementArea": {
      "x": 35,
      "y": 25,
      "width": 30,
      "height": 45,
      "rotation": -8
    },
    "perspective": "angled",
    "tags": ["digital", "home", "content", "connected"],
    "useCases": ["Recipe content", "Smart home integration", "Digital campaigns"]
  },
  {
    "id": "subway-platform-poster",
    "name": "Subway Platform Poster",
    "persona": "working-professionals",
    "category": "commute-transit",
    "subcategory": "subway",
    "description": "Large poster on subway platform wall - seen during wait times",
    "environmentImageUrl": "/mockups/subway-poster.jpg",
    "placementArea": {
      "x": 20,
      "y": 15,
      "width": 60,
      "height": 40
    },
    "perspective": "straight",
    "tags": ["transit", "commute", "urban", "professional"],
    "useCases": ["Brand awareness", "Service announcements", "Career opportunities"]
  },
  {
    "id": "office-elevator-screen",
    "name": "Office Building Elevator Screen",
    "persona": "working-professionals",
    "category": "office-environments",
    "subcategory": "elevator",
    "description": "Digital screen in office building elevator - captive audience",
    "environmentImageUrl": "/mockups/elevator-screen.jpg",
    "placementArea": {
      "x": 35,
      "y": 30,
      "width": 30,
      "height": 40
    },
    "perspective": "straight",
    "tags": ["office", "professional", "digital", "captive"],
    "useCases": ["B2B services", "Professional products", "Career messaging"]
  },
  {
    "id": "gym-locker-room-poster",
    "name": "Gym Locker Room Poster",
    "persona": "fitness-enthusiasts",
    "category": "fitness-wellness",
    "subcategory": "gym",
    "description": "Poster in gym locker room - high dwell time while changing",
    "environmentImageUrl": "/mockups/gym-locker.jpg",
    "placementArea": {
      "x": 30,
      "y": 20,
      "width": 40,
      "height": 50
    },
    "perspective": "straight",
    "tags": ["fitness", "wellness", "health", "captive"],
    "useCases": ["Sports nutrition", "Fitness products", "Wellness services"]
  },
  {
    "id": "tiktok-mobile-feed",
    "name": "TikTok Mobile Feed Ad",
    "persona": "gen-z-digital-natives",
    "category": "digital-integration",
    "subcategory": "social-mobile",
    "description": "Full-screen ad in TikTok feed on mobile device",
    "environmentImageUrl": "/mockups/tiktok-feed.jpg",
    "placementArea": {
      "x": 42,
      "y": 18,
      "width": 16,
      "height": 64
    },
    "perspective": "straight",
    "tags": ["social", "mobile", "gen-z", "video"],
    "useCases": ["Gen-Z campaigns", "Viral content", "Trend participation"]
  }
]
```

---

## 4. Slide Data Structure

```typescript
interface Slide {
  id: string;
  slideNumber: number;
  templateId?: string;            // If created from a solution template
  gridSize?: {
    rows: number;
    columns: number;
  };
  background: {
    color?: string;
    gradient?: string;
    image?: string;
  };
  elements: SlideElement[];
  notes?: string;                 // Speaker notes
  duration?: number;              // Auto-advance timing
  createdAt: Date;
  updatedAt: Date;
}

interface SlideElement {
  id: string;
  type: 'text' | 'insight' | 'mockup' | 'image' | 'shape';
  position: {
    x: number;                    // percentage from left
    y: number;                    // percentage from top
    width: number;                // percentage
    height: number;               // percentage
    rotation: number;             // degrees
    zIndex: number;
  };
  locked: boolean;
  content: TextContent | InsightContent | MockupContent | ImageContent | ShapeContent;
}

interface TextContent {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  color: string;
  alignment: 'left' | 'center' | 'right' | 'justify';
  lineHeight: number;
}

interface InsightContent {
  insightToolId: string;
  configuration: any;             // Tool-specific config
  data?: any;                     // If data-driven
}

interface MockupContent {
  mockupTemplateId: string;
  uploadedCreative: {
    imageUrl: string;
    originalFilename: string;
  };
  adjustments?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
  };
}

interface ImageContent {
  imageUrl: string;
  originalFilename: string;
  filters?: string[];
  adjustments?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
  };
}

interface ShapeContent {
  shapeType: 'rectangle' | 'circle' | 'triangle' | 'line';
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
}
```

---

## 5. Presentation Structure

```typescript
interface Presentation {
  id: string;
  name: string;
  owner: User;
  collaborators: User[];
  slides: Slide[];
  brandKit?: {
    colors: string[];
    fonts: string[];
    logos: string[];
  };
  settings: {
    slideSize: {
      width: number;
      height: number;
      aspectRatio: '16:9' | '4:3' | 'custom';
    };
    defaultFont: string;
    defaultColors: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  sharedWith?: {
    userId: string;
    permission: 'view' | 'edit' | 'admin';
  }[];
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}
```

---

## 6. API Endpoints Structure

```typescript
// Solutions
GET    /api/solutions                      // List all solution templates
GET    /api/solutions/:id                  // Get specific solution
GET    /api/solutions/search?q=...         // Search solutions
GET    /api/solutions/filter?category=...  // Filter by category/urgency

// Insights
GET    /api/insights                       // List all insight tools
GET    /api/insights/:category             // Get tools by category
GET    /api/insights/:id                   // Get specific tool

// Mockups
GET    /api/mockups                        // List all mockups
GET    /api/mockups/personas               // List personas
GET    /api/mockups/:persona               // Get mockups for persona
GET    /api/mockups/:persona/:category     // Get mockups by category
GET    /api/mockups/:id                    // Get specific mockup

// Presentations
GET    /api/presentations                  // List user's presentations
POST   /api/presentations                  // Create new presentation
GET    /api/presentations/:id              // Get specific presentation
PUT    /api/presentations/:id              // Update presentation
DELETE /api/presentations/:id              // Delete presentation

// Slides
POST   /api/presentations/:id/slides       // Add slide
PUT    /api/presentations/:id/slides/:slideId  // Update slide
DELETE /api/presentations/:id/slides/:slideId  // Delete slide
POST   /api/presentations/:id/slides/:slideId/duplicate  // Duplicate slide

// Export
POST   /api/presentations/:id/export       // Export to format
      // Body: { format: 'pptx' | 'pdf' | 'png' | 'google-slides' }

// Upload
POST   /api/upload                         // Upload image/creative
      // Returns: { url: string, filename: string }
```

---

## 7. State Management Structure (Example with Zustand)

```typescript
interface BranvaStore {
  // Current presentation
  currentPresentation: Presentation | null;
  currentSlide: Slide | null;
  selectedElements: string[];

  // UI state
  leftPanelOpen: 'solutions' | 'insights' | 'mockups' | 'text' | 'brand' | 'tools' | null;
  zoomLevel: number;
  
  // Solutions
  solutions: SolutionTemplate[];
  solutionsLoading: boolean;
  
  // Insights
  insights: InsightTool[];
  insightsLoading: boolean;
  
  // Mockups
  mockups: MockupTemplate[];
  mockupsLoading: boolean;
  selectedPersona: Persona | null;
  
  // Actions
  setCurrentPresentation: (presentation: Presentation) => void;
  setCurrentSlide: (slide: Slide) => void;
  addSlide: (slide: Slide) => void;
  updateSlide: (slideId: string, updates: Partial<Slide>) => void;
  deleteSlide: (slideId: string) => void;
  addElementToSlide: (element: SlideElement) => void;
  updateElement: (elementId: string, updates: Partial<SlideElement>) => void;
  deleteElement: (elementId: string) => void;
  setSelectedElements: (elementIds: string[]) => void;
  setLeftPanel: (panel: typeof leftPanelOpen) => void;
  setZoomLevel: (zoom: number) => void;
  loadSolutions: () => Promise<void>;
  loadInsights: () => Promise<void>;
  loadMockups: (persona?: Persona) => Promise<void>;
}
```

---

## Implementation Priority

### Phase 1 - Core Canvas:
1. Presentation/Slide data structure
2. Canvas rendering
3. Basic element manipulation (drag, resize, delete)
4. Text editing

### Phase 2 - Solutions Panel:
1. Load solution templates from JSON
2. Display in grid with filters
3. Modal for "Replace vs Add New"
4. Apply template to slide

### Phase 3 - Insights Panel:
1. Load insight tools from JSON
2. Category tabs
3. Add to slide functionality
4. Basic configurability

### Phase 4 - Mockups Panel:
1. Persona selection
2. Load mockups by persona
3. Upload creative modal
4. Place mockup with creative on slide

### Phase 5 - Export & Collaboration:
1. PowerPoint export
2. PDF export
3. Share/collaborate features
4. Version history

This structure provides a solid foundation for implementing Branva with scalable, maintainable code.
