# Branva v0.dev Quick Start Guide

## How to Use These Prompts

### Step 1: Choose Your Prompt

You have two prompt options:

1. **Comprehensive Prompt** (`branva-v0-prompt.md`)
   - Full detail with all features
   - Best for complete understanding
   - Use when you want maximum context

2. **Concise Prompt** (`branva-v0-concise-prompt.md`)
   - Streamlined version
   - Easier to paste into v0.dev
   - Best for quick starts

### Step 2: Initial Build Strategy

Start with the **concise prompt** for your first iteration. v0.dev works best with focused, clear instructions.

**Recommended First Prompt to v0.dev:**

```
Build a Canva-like presentation editor for strategists called "Branva".

Key differences from Canva:
1. Left sidebar has "Solutions" (strategy templates), "Insights" (consumer behavior tools), and "Mockups" (persona-based environments) instead of design tools
2. When clicking a solution template, show modal with "Replace Current Slide" or "Add to New Slide" options
3. Insights add directly to current slide when clicked
4. Mockups are grouped by persona (Homemakers, Gen-Z, etc.) and show realistic environment placements

Layout:
- Top bar: Logo, File menu, project name (center), Present/Share buttons (right)
- Left sidebar (dark): Solutions, Insights, Mockups, Text, Brand icons
- Main canvas: White slide editor with grid system
- Bottom: Slide thumbnails with page numbers

Use React + TypeScript + Tailwind. Include drag-and-drop for elements. Make it look professional like Canva but focused on strategy work.
```

### Step 3: Iterative Refinement

After v0.dev generates the initial version, refine with specific requests:

#### Iteration 1: Solutions Panel
```
Improve the Solutions panel:
- Show solution cards in grid layout
- Each card displays: question title, description (2 lines), category badges, speed badge (30-45 min), urgency badge (HIGH/MEDIUM/LOW with colors)
- On click, show modal with preview and two buttons: "Replace Current Slide" and "Add to New Slide"
- Add search bar at top
- Add filter tabs: All, Agency, Advertiser, Achiever, High Urgency
```

#### Iteration 2: Insights Panel
```
Build the Insights panel with category tabs:
- Maps & Geography
- Consumer Behavior
- Data Visualization
- Journey Mapping
- Touchpoints

Show icons for each tool. When clicked, tool should appear on current slide with drag handles. Include sample tools like: location pins, behavior flow diagrams, funnel charts, journey timelines, social media icons.
```

#### Iteration 3: Mockups Panel
```
Create the Mockups panel with two levels:
Level 1: Show large persona cards (Homemakers, Working Professionals, Gen-Z Digital Natives, Parents with Young Children)
Level 2: When persona selected, show mockup categories for that persona
Example for Homemakers:
- Retail Environments (grocery aisle signage, shopping cart ad, checkout display)
- Drugstore/Pharmacy (pharmacy counter signage, medicine aisle)
- Children's Spaces (school bulletin board, daycare poster)

When mockup clicked, show modal to upload creative and preview placement.
```

#### Iteration 4: Canvas Improvements
```
Enhance the canvas:
- Add grid lines that appear when dragging
- Snap-to-grid behavior
- Show transform handles when element selected
- Add toolbar above selected element with: duplicate, delete, layer order, lock
- Make elements draggable and resizable
```

#### Iteration 5: Slide Management
```
Improve the bottom slide strip:
- Show thumbnails of all slides
- Current slide has purple border
- Show page numbers below each (1/25, 2/25, etc.)
- Click to navigate to slide
- Right-click for context menu: Duplicate, Delete, Add Note
- Add "+" button at end to add new slide
```

### Step 4: Adding Real Data

Once the UI looks good, add real data:

#### For Solutions:
```
Load these solution templates:
1. "Why Are Competitors Stealing Our Customers?" - HIGH urgency, 6x6 grid, $2,500-$5,000
2. "How To Market To Gen-Z Without Looking Cringe" - HIGH urgency, 6x6 grid, $1,500-$3,500
3. "Is Our Brand Building Actually Working?" - HIGH urgency, 6x6 grid, $2,500-$5,500
4. "Why Is My Campaign Failing?" - MEDIUM urgency, 4x6 grid, $2,000-$4,500

Display in grid with proper badges and styling.
```

#### For Insights:
```
Add these insight tools to the Maps & Geography category:
- World Map (with heatmap overlay option)
- US Map (with state boundaries)
- Location Pins (customizable colors: red, blue, green, yellow)
- Radius Circles (for coverage areas)
- Route Lines (for journey paths)

Make them draggable onto the canvas.
```

#### For Mockups:
```
Add mockups for Homemakers persona:
- Grocery Store Aisle Signage (retail-environments category)
- Shopping Cart Advertisement (retail-environments)
- Pharmacy Counter Signage (drugstore-pharmacy)
- School Bulletin Board (childrens-spaces)
- Package Insert Card (home-delivery)

Each mockup should have placeholder image and defined placement area for user's creative.
```

---

## Tips for Working with v0.dev

### 1. Be Specific About Interactions
v0.dev understands interactions well. Clearly specify:
- "When clicked, show modal"
- "On hover, display tooltip"
- "Drag and drop to canvas"
- "Right-click for context menu"

### 2. Reference Familiar Apps
Use comparisons to help v0.dev understand:
- "Like Canva's template library"
- "Similar to Figma's layer system"
- "Grid system like PowerPoint"

### 3. Request Specific Components
Ask for specific React components:
- "Create a SolutionCard component"
- "Build an InsightTool component"
- "Make a MockupUploadModal component"

### 4. Iterate on Styling
Start functional, then beautify:
```
First iteration: "Make it work with basic styling"
Second iteration: "Apply Canva-like polish with shadows, hover effects, smooth transitions"
Third iteration: "Add purple gradient theme, professional typography"
```

### 5. Handle Complex Features Separately
Don't try to build everything at once:
- Day 1: Basic layout + Solutions panel
- Day 2: Insights panel + Canvas drag-drop
- Day 3: Mockups panel + Upload modal
- Day 4: Polish + Slide management
- Day 5: Export features

---

## Common Issues & Solutions

### Issue: Too Much in One Prompt
**Solution:** Break into smaller chunks
```
❌ "Build Solutions, Insights, and Mockups panels with all features"
✅ "Build Solutions panel with search and filter first"
```

### Issue: v0.dev Doesn't Understand Your Custom Concept
**Solution:** Use analogies to known apps
```
❌ "Build a strategy insight tool selector"
✅ "Build an element library like Canva's Elements panel, but with strategy tools instead of graphics"
```

### Issue: Lost Context Between Iterations
**Solution:** Refer back to previous versions
```
"Keep the Solutions panel from v2, but now add the Insights panel beside it with category tabs"
```

### Issue: Styling Looks Generic
**Solution:** Provide specific design references
```
"Use Canva's design language: purple primary color (#8B5CF6), rounded corners (8px), subtle shadows, clean typography (Inter font)"
```

---

## Suggested Prompt Sequence

### Phase 1: Foundation (Days 1-2)
```
Prompt 1: Basic layout with top bar, left sidebar, canvas, bottom thumbnail strip

Prompt 2: Solutions panel with grid of cards, search bar, filter tabs

Prompt 3: Modal for solution selection with "Replace Current Slide" and "Add to New Slide" buttons

Prompt 4: Make slides functional - add, delete, navigate between slides
```

### Phase 2: Core Features (Days 3-4)
```
Prompt 5: Insights panel with category tabs and tool grid

Prompt 6: Make insights draggable to canvas with transform handles

Prompt 7: Mockups panel with persona selection

Prompt 8: Mockup upload modal with creative placement preview
```

### Phase 3: Polish (Days 5-6)
```
Prompt 9: Add professional styling - purple theme, shadows, transitions

Prompt 10: Improve canvas - grid lines, snap-to-grid, better element controls

Prompt 11: Enhanced slide management - thumbnails, reordering, context menus

Prompt 12: Add text editing panel with preset styles
```

### Phase 4: Advanced (Days 7+)
```
Prompt 13: Export to PowerPoint functionality

Prompt 14: Share/collaborate features

Prompt 15: Keyboard shortcuts and accessibility

Prompt 16: Mobile-responsive adjustments
```

---

## Testing Checklist

After each iteration, test these flows:

### ✅ Solutions Flow:
- [ ] Can search/filter solutions
- [ ] Solution cards display all info correctly
- [ ] Modal appears on click
- [ ] "Replace Current Slide" works
- [ ] "Add to New Slide" works
- [ ] Template structure loads correctly

### ✅ Insights Flow:
- [ ] Can switch between category tabs
- [ ] Tools display in grid
- [ ] Click adds tool to canvas
- [ ] Tool is draggable
- [ ] Tool is resizable
- [ ] Can delete tool

### ✅ Mockups Flow:
- [ ] Can select persona
- [ ] Mockups load for persona
- [ ] Can switch categories
- [ ] Upload modal appears on click
- [ ] Can upload image
- [ ] Preview shows placement correctly
- [ ] Can add to slide

### ✅ Canvas Flow:
- [ ] Elements are selectable
- [ ] Transform handles appear
- [ ] Can drag elements
- [ ] Can resize elements
- [ ] Can delete elements
- [ ] Grid lines show when dragging
- [ ] Snap-to-grid works

### ✅ Slides Flow:
- [ ] Can add new slide
- [ ] Can delete slide
- [ ] Can navigate between slides
- [ ] Thumbnails update correctly
- [ ] Page numbers are accurate
- [ ] Can reorder slides (drag & drop)

---

## Deployment Strategy

### Option 1: v0.dev Preview
- Use v0.dev's preview directly
- Share link with team for feedback
- Iterate until satisfied

### Option 2: Export to GitHub
- Export code from v0.dev
- Set up GitHub repo
- Deploy to Vercel/Netlify
- Continue development locally

### Option 3: Integrate with Backend
- Export frontend from v0.dev
- Build separate backend API
- Connect to database
- Add authentication

---

## Next Steps After v0.dev

1. **Add Real Data Layer**
   - Connect to database
   - Load actual solution templates
   - Store user presentations
   - Handle file uploads

2. **Implement Export**
   - Use pptxgenjs for PowerPoint
   - Use jsPDF for PDF
   - Implement Google Slides API

3. **Add Collaboration**
   - WebSocket for real-time editing
   - Cursor presence
   - Comment system
   - Version history

4. **Build Marketplace**
   - User-submitted templates
   - Rating system
   - Revenue sharing
   - Featured solutions

5. **Add AI Features**
   - Generate solutions from briefs
   - Suggest relevant mockups
   - Auto-fill consumer insights
   - Smart recommendations

---

## Resources

- **v0.dev**: https://v0.dev
- **Tailwind CSS**: https://tailwindcss.com
- **React DnD**: https://react-dnd.github.io/react-dnd/
- **Fabric.js**: http://fabricjs.com (for canvas)
- **pptxgenjs**: https://gitbrent.github.io/PptxGenJS/ (for export)

---

## Support

If you get stuck:
1. Review the comparison document to understand differences from Canva
2. Check the data structures document for implementation details
3. Start with the concise prompt and iterate
4. Break complex features into smaller pieces
5. Use analogies to familiar apps when prompting v0.dev

Good luck building Branva! 🚀
