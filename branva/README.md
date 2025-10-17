# Branva - Strategy Presentation Builder

Branva is a Canva-like presentation builder specifically designed for strategists to create rapid strategy solutions. This is a completely independent application that can be deployed to GitHub Pages.

## 📁 Folder Structure

```
branva/
├── index.html              # Main application file
├── css/                    # All styling files
│   ├── branva.css         # Branva-specific styles
│   ├── main.css           # Core styles from dashboard
│   ├── components.css     # UI components
│   ├── modals.css         # Modal styling
│   └── table.css          # Strategy matrix table styles
├── js/                     # Modular JavaScript files
│   ├── utils.js           # Utility functions (from dashboard)
│   ├── branva-strategy-loader.js    # Strategy data loading
│   ├── branva-matrix-renderer.js    # Matrix table rendering
│   ├── branva-data.js     # Data management
│   ├── branva-canvas.js   # Canvas and drag-drop functionality
│   ├── branva-panels.js   # Left sidebar panels management
│   └── branva-main.js     # Main application controller
├── data/                   # Strategy data (copied from dashboard)
│   ├── strategy-metadata.json      # Strategy metadata
│   └── strategies/        # Individual strategy JSON files
└── spec/                   # Documentation and specifications
```

## 🎯 Key Features

### Solutions Panel
- Loads real strategy templates from `data/strategy-metadata.json`
- Search and filter by category (Agency, Advertiser, Achiever)
- Filter by urgency level (High, Medium, Low)
- Modal with "Replace Current Slide" or "Add to New Slide" options

### Strategy Matrix Generation
- Loads actual strategy content from individual JSON files
- Renders complete matrix tables with icons, headers, and data cells
- Interactive cells with hover effects and click handlers
- Image upload functionality for matrix cells

### Canvas Functionality
- Drag-and-drop elements
- Zoom controls (zoom in/out, fit to screen)
- Grid snapping with visual grid lines
- Element selection and manipulation
- Strategy matrix positioning and sizing

### Slide Management
- Add/delete slides
- Slide thumbnails with navigation
- Auto-save functionality
- Presentation mode

## 🔧 JavaScript Architecture

### Modular Design
The application uses a modular JavaScript architecture for easy debugging and updates:

- **branva-strategy-loader.js**: Handles all strategy data loading and management
- **branva-matrix-renderer.js**: Responsible for rendering strategy matrices
- **branva-canvas.js**: Canvas functionality and element manipulation
- **branva-panels.js**: Left sidebar panels and interactions
- **branva-main.js**: Main application controller and coordination
- **branva-data.js**: Data management and coordination layer

### Key Classes

```javascript
// Strategy data loading
window.branvaStrategyLoader = new BranvaStrategyLoader();

// Matrix rendering
window.branvaMatrixRenderer = new BranvaMatrixRenderer();

// Canvas management
window.branvaCanvas = new BranvaCanvas();

// Panel management
window.branvaPanels = new BranvaPanels();

// Main app controller
window.branvaApp = new BranvaApp();
```

## 🚀 Deployment

### GitHub Pages
1. Push the `branva/` folder to a GitHub repository
2. Enable GitHub Pages pointing to the `branva/index.html` file
3. The app will be available at `https://username.github.io/repository/branva/`

### Local Development
1. Serve the `branva/` folder with any HTTP server
2. Navigate to `http://localhost:port/index.html`

## 📊 Data Structure

### Strategy Templates
Located in `data/strategy-metadata.json` with references to individual strategy files in `data/strategies/`.

### Matrix Data
Each strategy has its own JSON file with:
- Headers with icons and text
- Data rows with icon/text pairs
- Complete matrix structure

## 🎨 Styling

The application uses a modern, professional design with:
- Purple accent color (#8B5CF6)
- Dark left sidebar
- Clean white canvas area
- Professional typography
- Hover effects and transitions

## 🔄 Integration with Dashboard

Branva reuses data and utilities from the main dashboard application but is completely independent:
- Copies all required data files
- Includes necessary CSS and JavaScript utilities
- Uses the same strategy matrix rendering logic
- Maintains compatibility with existing data formats

## 📝 Development Notes

- All file paths are relative within the `branva/` folder
- No dependencies on files outside the `branva/` directory
- Modular JavaScript for easy debugging and updates
- Error handling and loading states throughout
- Console logging for debugging purposes