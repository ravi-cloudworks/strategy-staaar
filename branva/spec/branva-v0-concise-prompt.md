# Branva - Concise v0.dev Prompt

Build a Canva-like presentation builder for strategists called "Branva". Replace design tools with strategy tools.

## Layout
- **Top bar**: Logo, File menu, project name (center), Upgrade, user avatar, Present, Share buttons
- **Left sidebar** (dark, icon + label):
  1. Solutions (grid icon) - Strategy templates
  2. Insights (pin icon) - Consumer behavior tools
  3. Mockups (device icon) - Persona-based activation mockups
  4. Text, Brand, Tools (standard)
- **Main canvas**: White slide with grid system (4x6, 5x6, or 6x6)
- **Bottom bar**: Slide thumbnails with page numbers, zoom controls

## 1. Solutions Panel (replaces Design templates)

Show grid of strategy solution cards with:
- Question-style titles ("Why Are Competitors Stealing Our Customers?")
- Short description
- Badges: Category (Agency/Advertiser/Achiever), Speed (30-45 min), Urgency (HIGH/MEDIUM/LOW with colors)
- Grid info (6x6)

**On click**: Modal with "Replace Current Slide" or "Add to New Slide" buttons

Sample solutions:
- "Why Are Competitors Stealing Our Customers?" (HIGH urgency, 6x6 grid)
- "How To Market To Gen-Z Without Looking Cringe" (HIGH urgency, 6x6 grid)
- "Is Our Brand Building Actually Working?" (HIGH urgency, 6x6 grid)
- "Why Is My Campaign Failing?" (MEDIUM urgency, 4x6 grid)

## 2. Insights Panel (replaces Elements)

Categories in tabs:
- **Maps & Geography**: World maps, city maps, location pins, heatmaps, radius circles
- **Consumer Behavior**: Behavior flows, decision trees, persona cards, journey markers
- **Data Visualization**: Bar/pie charts, funnels, pyramids, comparison tables
- **Journey Mapping**: Timelines, stage cards, emotion curves, pain points
- **Touchpoints**: Social icons, store icons, billboard, packaging, sales rep icons

**On click**: Tool instantly adds to current slide (draggable, resizable)

## 3. Mockups Panel (persona-based environments)

**First level**: Choose persona card:
- Homemakers (50+ mockups)
- Working Professionals (45+ mockups)
- Gen-Z Digital Natives (60+ mockups)
- Parents with Young Children (55+ mockups)

**Second level** (example: Homemakers):
Show categories:
- **Retail Environments**: Grocery aisle signage, shelf wobbler, shopping cart ad, checkout display, window display, floor decals
- **Drugstore/Pharmacy**: Pharmacy counter signage, medicine aisle endcap, beauty section display
- **Children's Spaces**: School bulletin board, daycare poster, playground signage, school newsletter
- **Community Spaces**: Community center poster, library bulletin, local gym signage
- **Home Delivery**: Package insert, doorstep box, mail flyer, welcome mat

**On click**: Modal to upload creative → Preview shows realistic placement → "Add to Current/New Slide"

## Canvas Features
- Grid-based templates from solutions
- Drag and drop insights/mockups onto slides
- Snap-to-grid behavior
- Bottom thumbnail strip to navigate slides
- Real-time element selection with transform handles

## Color Scheme
- Primary: Purple gradient (#8B5CF6 to #7C3AED)
- Urgency HIGH: Red (#EF4444)
- Urgency MEDIUM: Yellow (#F59E0B)
- Sidebar: Dark gray (#1F2937)
- Canvas: Light gray background (#F3F4F6)

## Technical Stack
- React + TypeScript
- Tailwind CSS
- Drag & drop (react-dnd or dnd-kit)
- Canvas manipulation (fabric.js)

Build as single-page app focused on helping strategists create strategy presentations 10x faster by choosing pre-built solution templates, adding consumer insights, and showing realistic activation mockups grouped by target personas.
