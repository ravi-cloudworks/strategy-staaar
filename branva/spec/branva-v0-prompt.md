# Branva - v0.dev Prompt

## App Overview
Build "Branva" - a Canva-like presentation builder specifically designed for strategists to create repeatable strategy solutions. This is the fastest way for strategists to earn repeat income by building rapid solutions that advertisers are already searching for.

## Core Concept
Replace traditional design-focused tools with strategy-focused tools that help strategists:
1. Build rapid solutions advertisers are already searching for
2. Anchor actionable insights that connect with consumer behavior
3. Visualize activations in real places consumers visit

---

## Main Layout Structure

### Top Navigation Bar
- Left side: 
  - Logo: "Branva" with icon
  - "File" dropdown (New, Open, Save, Export)
  - "Resize" button
- Center: Project name (editable text input)
- Right side:
  - "Upgrade your plan" button
  - User avatar (circular)
  - "Present" button (primary)
  - "Share" button

### Left Sidebar Navigation (Icons + Labels)
1. **Solutions** (replaces "Design" in Canva)
   - Icon: Grid/template icon
   - Opens solutions panel
   
2. **Insights** (replaces "Elements" in Canva)
   - Icon: Location pin/analytics icon
   - Opens insights tools panel
   
3. **Mockups** (replaces standard "Uploads")
   - Icon: Device/scene icon
   - Opens persona-based mockups panel
   
4. **Text**
   - Standard text tools
   
5. **Brand**
   - Brand kit elements
   
6. **Tools**
   - Standard editing tools

### Main Canvas Area
- Large white presentation slide canvas in center
- Zoom controls (bottom)
- Slide thumbnails (bottom strip with page numbers)

---

## Feature 1: Solutions Panel (Left Sidebar)

### When "Solutions" is clicked:

#### Search Bar
- Prominent search with placeholder: "Search strategy solutions..."
- Filter icon on right

#### Filter Tabs (Horizontal scroll)
- "All Solutions"
- "Agency"
- "Advertiser" 
- "Achiever"
- "High Urgency"
- "Quick Win (30-45 min)"

#### Solutions Grid Display
Each solution card shows:
- **Title** (as question, e.g., "Why Are Competitors Stealing Our Customers?")
- **Description** (2 lines truncated)
- **Tags**: 
  - Category badge (Agency/Advertiser/Achiever)
  - Speed badge (30-45 minutes)
  - Urgency badge (HIGH/MEDIUM/LOW) with color coding
- **Grid info**: "6x6 grid" with small grid icon
- **Hover state**: 
  - "Preview" button
  - "Use Template" button (primary)

#### Solution Templates (from JSON):
```json
[
  {
    "id": "competitor-steal-strategy",
    "name": "Why Are Competitors Stealing Our Customers?",
    "description": "Decodes competitor strategies to reveal exactly why they win customers",
    "category": "Agency, Advertiser, Achiever",
    "speed": "30-45 minutes",
    "urgency": "HIGH",
    "grid": "6x6",
    "pricing": "$2,500-$5,000"
  },
  {
    "id": "gen-z-trend-translator",
    "name": "How To Market To Gen-Z Without Looking Cringe",
    "description": "Translates youth culture signals into authentic brand messaging",
    "category": "Agency, Advertiser, Achiever",
    "speed": "30-45 minutes",
    "urgency": "HIGH",
    "grid": "6x6"
  },
  {
    "id": "brand-pyramid",
    "name": "Is Our Brand Building Actually Working?",
    "description": "Measures brand equity effectiveness using Brand Pyramid framework",
    "category": "Agency, Advertiser, Achiever",
    "speed": "30-45 minutes",
    "urgency": "HIGH",
    "grid": "6x6"
  },
  {
    "id": "4c-model",
    "name": "Why Is My Campaign Failing?",
    "description": "Systematically identifies missing strategic elements using 4C framework",
    "category": "Agency, Advertiser, Achiever",
    "speed": "30-45 minutes",
    "urgency": "MEDIUM",
    "grid": "4x6"
  }
]
```

#### Modal on Click: "Add to Presentation"
When a solution template is clicked, show modal:
- Title: "Add Strategy Solution"
- Preview of template grid
- Two buttons:
  - **"Replace Current Slide"** - replaces active slide
  - **"Add to New Slide"** - adds new slide with template
- Cancel option

---

## Feature 2: Insights Panel (Left Sidebar)

### When "Insights" is clicked:

#### Search Bar
- "Search insight tools..."

#### Category Tabs
- "Maps & Geography"
- "Consumer Behavior"
- "Data Visualization"
- "Journey Mapping"
- "Touchpoints"

#### Insights Tools Grid

**Maps & Geography Section:**
- World map (interactive)
- Country maps (US, UK, India, etc.)
- City maps with neighborhoods
- Heatmap overlay tool
- Location pins (customizable colors)
- Radius circles
- Route lines

**Consumer Behavior Section:**
- Behavior flow diagrams
- Decision tree templates
- Emotion mapping icons
- Persona cards
- Journey stage markers
- Touchpoint icons (phone, store, website, etc.)

**Data Visualization:**
- Bar charts (dynamic)
- Pie charts
- Line graphs
- Funnel diagrams
- Pyramid charts
- Comparison tables
- Before/After frames

**Journey Mapping:**
- Timeline templates
- Stage cards
- Emotion curves
- Pain point markers
- Opportunity badges

**Touchpoint Icons:**
- Digital: Social media icons, website, app, email
- Physical: Store, billboard, packaging, event
- Human: Sales rep, customer service, influencer

#### Behavior on Click:
- Click any insight tool → Adds directly to current active slide
- Draggable and resizable on canvas
- Pre-sized to fit well in strategy grids

---

## Feature 3: Mockups Panel (Left Sidebar)

### When "Mockups" is clicked:

#### Persona Category Selection (Large Cards)
Display personas as large selectable cards:

**Homemakers**
- Image: Suburban home scene
- "50+ activation mockups"

**Working Professionals**
- Image: Office/commute scene
- "45+ activation mockups"

**Gen-Z Digital Natives**
- Image: Mobile/social scene
- "60+ activation mockups"

**Parents with Young Children**
- Image: Family scene
- "55+ activation mockups"

**Fitness Enthusiasts**
- Image: Gym/outdoor scene
- "40+ activation mockups"

**Luxury Consumers**
- Image: Premium environment
- "35+ activation mockups"

#### When Persona Selected: Mockup Library

**For "Homemakers" - Show categories:**

**Retail Environments:**
- Grocery store aisle signage
- Shelf wobbler mockup
- Shopping cart ad placement
- Checkout counter display
- In-store poster frames
- Window display mockup
- Store entrance banner
- Floor decals

**Drugstore/Pharmacy:**
- Pharmacy counter signage
- Medicine aisle endcap
- Beauty section display
- Health & wellness posters
- Checkout impulse display

**Children's Spaces:**
- School bulletin board
- Daycare wall poster
- Playground signage
- School newsletter ad
- Parent pickup area signs

**Community Spaces:**
- Community center poster
- Library bulletin board
- Local gym signage
- Community event booth
- Neighborhood newsletter

**Home Delivery:**
- Package insert card
- Doorstep delivery box
- Mail flyer mockup
- Welcome mat mockup

**Digital Integration:**
- Tablet in kitchen mockup
- Smart home display
- Mobile app on phone
- Email on laptop screen

#### Mockup Behavior:
- Click mockup → Opens placement modal
- Modal shows:
  - "Upload Your Creative" area (drag & drop)
  - Preview with creative placed
  - "Add to Current Slide" button
  - "Add to New Slide" button
- Mockup includes realistic environment photo
- Your creative overlays seamlessly on signage/display area

---

## Canvas Interaction Features

### Slide Management
- Bottom thumbnail strip shows all slides
- Current slide highlighted with border
- Page numbers below each thumbnail (1/25, 2/25, etc.)
- Click thumbnail to navigate
- Drag to reorder slides
- Right-click for options: Duplicate, Delete, Add Note

### Grid System
- All solution templates use grid systems (4x6, 5x6, 6x6)
- Grid lines appear when dragging elements
- Snap-to-grid behavior
- Each cell can contain: text, insight tool, mockup, or data

### Element Controls
- Click element → Shows transform handles
- Toolbar appears above element:
  - Duplicate
  - Delete
  - Layer order (front/back)
  - Lock position
  - Replace content

### Real-time Collaboration
- Show avatar badges on elements being edited
- Cursor presence for team members
- Comment thread sidebar (optional)

---

## Text Editing Panel

### When "Text" is clicked:

#### Quick Add Buttons:
- "Add a text box" (purple button)
- "Add heading"
- "Add subheading"  
- "Add body text"

#### Brand Kit Section:
- Brand-specific fonts
- Preset text styles
- Color palette

#### Text Style Presets:
- "Heading" - Bold, large
- "Strategy Title" - Question format styling
- "Insight Label" - Small, annotation style
- "Data Point" - Large number + small description
- "Action Item" - Bullet with bold start
- "Quote" - Italic with quotation marks

---

## Export Options

### When "Share" button clicked:

**Export Formats:**
- PowerPoint (.pptx) - Editable
- PDF - Print ready
- PDF - Presentation mode
- Google Slides - Opens in Google
- PNG - High res images per slide
- Link - Shareable web view

**Share Settings:**
- "Anyone with link can view"
- "Anyone with link can edit"
- "Specific people only"
- Password protection option

---

## Technical Implementation Notes

### Data Structure:
```typescript
interface SolutionTemplate {
  id: string;
  name: string;
  description: string;
  category: string[];
  speed: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  gridSize: {rows: number; columns: number};
  pricing: string;
  cells: TemplateCell[];
}

interface InsightTool {
  id: string;
  name: string;
  category: 'maps' | 'behavior' | 'visualization' | 'journey' | 'touchpoints';
  icon: string;
  defaultSize: {width: number; height: number};
  interactive: boolean;
}

interface MockupTemplate {
  id: string;
  name: string;
  persona: string;
  category: string;
  environment: string;
  imageUrl: string;
  placementArea: {x: number; y: number; width: number; height: number};
}

interface Slide {
  id: string;
  elements: SlideElement[];
  background: string;
  gridSize?: {rows: number; columns: number};
}
```

### Component Hierarchy:
```
App
├── TopNav
│   ├── Logo
│   ├── FileMenu
│   ├── ProjectName
│   └── UserActions
├── LeftSidebar
│   ├── SolutionsPanel
│   │   ├── SearchBar
│   │   ├── FilterTabs
│   │   └── SolutionGrid
│   ├── InsightsPanel
│   │   ├── CategoryTabs
│   │   └── ToolsGrid
│   ├── MockupsPanel
│   │   ├── PersonaSelector
│   │   └── MockupLibrary
│   └── TextPanel
├── Canvas
│   ├── SlideContainer
│   └── SlideElements
└── BottomBar
    ├── SlideThumbnails
    ├── ZoomControls
    └── PageIndicator
```

---

## UI/UX Details

### Color Palette:
- Primary: Purple gradient (#8B5CF6 to #7C3AED)
- Secondary: Blue (#3B82F6)
- Success: Green (#10B981)
- Urgency HIGH: Red (#EF4444)
- Urgency MEDIUM: Yellow (#F59E0B)
- Urgency LOW: Gray (#6B7280)
- Background: White (#FFFFFF)
- Sidebar: Dark (#1F2937)
- Canvas area: Light gray (#F3F4F6)

### Typography:
- Headings: Inter Bold
- Body: Inter Regular
- UI Labels: Inter Medium
- Strategy questions: Georgia Italic (for emphasis)

### Interactions:
- Hover on cards: Lift effect (shadow increases)
- Active slide: Purple border (3px)
- Drag & drop: Visual feedback with ghost image
- Loading states: Skeleton screens
- Success actions: Toast notifications

### Responsive Behavior:
- Sidebar collapses to icons only on medium screens
- Canvas adjusts but maintains aspect ratio
- Touch-optimized for tablet strategists
- Mobile: Read-only view with "Edit on desktop" prompt

---

## Key User Flows

### Flow 1: Creating New Strategy Presentation
1. User lands → See "Solutions" panel open by default
2. Browse or search solution templates
3. Click solution → Modal appears
4. Choose "Add to New Slide" → Template loads
5. Begin filling in grid cells with insights/mockups

### Flow 2: Adding Consumer Insights
1. User working on slide
2. Click "Insights" in sidebar
3. Browse maps/behavior tools
4. Click tool → Instantly appears on current slide
5. Position and customize
6. Continue building strategy visual

### Flow 3: Adding Activation Mockups
1. User needs to show "where" campaign lives
2. Click "Mockups" in sidebar
3. Select persona (e.g., "Homemakers")
4. Browse environment mockups
5. Click mockup → Upload creative modal appears
6. Upload brand creative → Preview shows realistic placement
7. Add to slide → Mockup appears with creative in place

---

## Advanced Features (Phase 2)

### AI Strategy Assistant:
- "Generate solution from brief" - AI reads brief, suggests templates
- "Complete this insight" - AI fills in consumer behavior data
- "Find relevant mockups" - AI suggests best personas/placements

### Collaboration:
- Real-time multi-user editing
- Version history
- Comment threads on specific elements
- @mention team members

### Analytics Dashboard:
- Track which solutions are most used
- Time to complete average strategy
- Client presentation win rates
- Revenue generated per template

### Template Marketplace:
- Strategists can publish their own solutions
- Revenue share model
- Rating and review system
- Popular templates featured

---

## Style Guidelines

Use modern, professional design inspired by Canva but optimized for strategy work:
- Clean, minimal interface
- Heavy use of white space
- Clear visual hierarchy
- Consistent iconography
- Smooth animations (300ms ease transitions)
- Professional, trustworthy aesthetic
- Focus on content over decoration

Build this as a single-page React application using:
- React + TypeScript
- Tailwind CSS for styling
- Drag & drop library (react-dnd or dnd-kit)
- Canvas manipulation (fabric.js or konva)
- State management (Zustand or Redux Toolkit)
- File export (pptxgenjs for PowerPoint export)

The app should feel fast, professional, and purpose-built for strategists who need to create compelling strategy presentations quickly.
