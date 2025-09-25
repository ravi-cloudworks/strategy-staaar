// Self-Contained HTML Presentation Generator
export class HtmlGenerator {
    constructor() {
        this.presentationData = null;
        this.cssContent = '';
        this.jsContent = '';
    }

    async generateSelfContainedHtml(presentationData) {
        this.presentationData = presentationData;

        try {
            // Collect all CSS and JavaScript content
            await this.loadStylesheets();
            await this.loadScripts();

            // Generate the complete HTML
            const htmlContent = this.buildCompleteHtml();

            // Download the file
            this.downloadHtmlFile(htmlContent);

            return htmlContent;
        } catch (error) {
            console.error('Error generating self-contained HTML:', error);
            throw error;
        }
    }

    async loadStylesheets() {
        const stylesheets = [
            'css/main.css',
            'css/components.css',
            'css/modals.css',
            'css/table.css'
        ];

        let combinedCss = '';

        for (const stylesheet of stylesheets) {
            try {
                const response = await fetch(stylesheet);
                if (response.ok) {
                    const css = await response.text();
                    combinedCss += `/* ${stylesheet} */\n${css}\n\n`;
                }
            } catch (error) {
                console.warn(`Could not load ${stylesheet}:`, error);
            }
        }

        // Add presentation-specific styles
        combinedCss += this.getPresentationStyles();

        this.cssContent = combinedCss;
    }

    async loadScripts() {
        // Core presentation JavaScript (inline, not loaded from files)
        this.jsContent = this.getPresentationScript();
    }

    getPresentationStyles() {
        return `
/* Presentation-specific styles */
body.presentation-mode {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: #000;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.presentation-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    flex-direction: column;
    z-index: 9999;
}

.presentation-header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 16px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.presentation-header .logo-section {
    display: flex;
    align-items: center;
    gap: 12px;
}

.presentation-header .mckinsey-logo {
    font-size: 24px;
    font-weight: 800;
    color: #1e293b;
    letter-spacing: -0.025em;
}

.presentation-header .subtitle {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
}

.presentation-header .slide-counter {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    background: #f8fafc;
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid #e2e8f0;
}

.presentation-content {
    flex: 1;
    position: relative;
    overflow: hidden;
    background: #ffffff;
}

.slides-container {
    width: 100%;
    height: 100%;
    position: relative;
}

.slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    opacity: 0;
    padding: 40px;
    box-sizing: border-box;
    z-index: 1;
    transition: opacity 0.2s ease-in-out;
}

.slide.active {
    opacity: 1;
    z-index: 2;
}

/* Remove transforms and visibility transitions - they cause flashing */
.slide * {
    opacity: inherit;
}

/* Ensure content is always visible */
.slide-body,
.slide-header,
.slide-title {
    opacity: 1 !important;
    visibility: visible !important;
}

/* Debug: Make sure content containers are visible */
.title-slide,
.video-play-slide,
.table-slide,
.row-analysis-slide,
.mckinsey-matrix-slide,
.thankyou-slide {
    opacity: 1 !important;
    visibility: visible !important;
    display: flex !important;
}

/* Force all text and content to be visible */
.slide h1, .slide h2, .slide h3, .slide h4, .slide h5, .slide h6,
.slide p, .slide div, .slide span, .slide li, .slide td, .slide th {
    opacity: 1 !important;
    visibility: visible !important;
    color: inherit !important;
}

/* Ensure images and videos are visible */
.slide img, .slide video, .slide canvas {
    opacity: 1 !important;
    visibility: visible !important;
}

/* Make sure buttons and inputs are visible */
.slide button, .slide input, .slide textarea, .slide select {
    opacity: 1 !important;
    visibility: visible !important;
}

.slide-header {
    margin-bottom: 32px;
    text-align: center;
}

.slide-title {
    font-size: 36px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    line-height: 1.2;
}

.slide-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
}

.presentation-nav {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 20px 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.nav-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.nav-btn.primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.nav-btn.primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.nav-btn.secondary {
    background: #f8fafc;
    color: #374151;
    border: 1px solid #e2e8f0;
}

.nav-btn.secondary:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
}

.nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.slide-indicators {
    display: flex;
    gap: 8px;
    align-items: center;
}

.slide-indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    background: #cbd5e1;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0;
}

.slide-indicator.active {
    background: #667eea;
    transform: scale(1.2);
}

.slide-indicator:hover {
    background: #94a3b8;
}

/* Title slide styles */
.title-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
}

.title-main {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
    width: 100%;
    max-width: 1000px;
}

.staaar-title {
    font-size: 48px;
    font-weight: 800;
    color: #1e293b;
    margin: 0 0 24px 0;
    text-transform: uppercase;
    letter-spacing: -0.025em;
}

.campaign-details h3 {
    font-size: 20px;
    color: #64748b;
    margin: 0 0 20px 0;
    font-weight: 600;
}

.campaign-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
    text-align: left;
}

.campaign-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
}

.campaign-item i {
    color: #667eea;
    font-size: 18px;
    width: 20px;
}

.campaign-thumbnail {
    max-width: 400px;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.campaign-thumbnail.vertical-video {
    max-width: 300px;
    max-height: 500px;
}

.thumbnail-image {
    width: 100%;
    height: auto;
    display: block;
}

.thumbnail-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.7);
    border-radius: 50%;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 32px;
}

/* Video slide styles */
.video-play-slide {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: 32px;
}

.video-player-container {
    max-width: 800px;
    width: 100%;
    display: flex;
    justify-content: center;
}

.campaign-video {
    max-width: 100%;
    max-height: 60vh;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.video-info {
    text-align: center;
}

.video-info h3 {
    font-size: 24px;
    color: #1e293b;
    margin: 0 0 16px 0;
}

.video-badges {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
}

.badge {
    background: #f1f5f9;
    color: #475569;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
}

/* Table slide styles */
.table-slide {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.exact-table-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: auto;
}

.table-insights-area {
    background: #f8fafc;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
}

.table-insights-area label {
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 8px;
}

.table-insights-text {
    width: 100%;
    min-height: 100px;
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-family: inherit;
    font-size: 14px;
    resize: vertical;
}

/* Row analysis slide styles */
.row-analysis-slide {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    height: 100%;
    align-items: center;
}

.large-image-section {
    display: flex;
    justify-content: center;
    align-items: center;
}

.large-row-image {
    max-width: 100%;
    max-height: 70vh;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.image-placeholder-large {
    width: 400px;
    height: 300px;
    background: #f1f5f9;
    border: 2px dashed #cbd5e1;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.column-list-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.column-list-vertical {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.column-item {
    padding: 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #ffffff;
    transition: all 0.2s ease;
}

.column-item.chosen-column-highlight {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.05);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
}

.column-content-vertical {
    display: flex;
    align-items: center;
    gap: 12px;
}

.chosen-tick {
    margin-left: auto;
}

/* Matrix slide styles */
.mckinsey-matrix-slide {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.matrix-container {
    width: 100%;
    max-width: 800px;
}

.matrix-2x2 {
    display: grid;
    grid-template-areas:
        ". y-axis"
        "matrix matrix"
        "x-axis x-axis";
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr auto;
    gap: 20px;
    align-items: center;
}

.y-axis-label {
    grid-area: y-axis;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #374151;
}

.x-axis-label {
    grid-area: x-axis;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: #374151;
}

.matrix-grid {
    grid-area: matrix;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 16px;
    height: 400px;
}

.matrix-cell {
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.matrix-cell.high-impact.low-effort {
    background: rgba(16, 185, 129, 0.1);
    border-color: #10b981;
}

.matrix-cell.high-impact.high-effort {
    background: rgba(59, 130, 246, 0.1);
    border-color: #3b82f6;
}

.matrix-cell.low-impact.low-effort {
    background: rgba(156, 163, 175, 0.1);
    border-color: #9ca3af;
}

.matrix-cell.low-impact.high-effort {
    background: rgba(239, 68, 68, 0.1);
    border-color: #ef4444;
}

.cell-label {
    font-weight: 600;
    color: #374151;
    font-size: 14px;
}

.matrix-cell textarea {
    flex: 1;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 8px;
    font-family: inherit;
    font-size: 12px;
    resize: none;
}

/* Thank you slide styles */
.thankyou-slide {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.thankyou-content {
    text-align: center;
    max-width: 600px;
}

.thankyou-main h1 {
    font-size: 64px;
    font-weight: 800;
    color: #1e293b;
    margin: 0 0 16px 0;
}

.thankyou-subtitle {
    font-size: 20px;
    color: #64748b;
    margin: 0 0 40px 0;
}

.thankyou-summary {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 40px 0;
}

.summary-item {
    display: flex;
    align-items: center;
    gap: 12px;
    justify-content: center;
    font-size: 16px;
    color: #374151;
}

.summary-item i {
    color: #10b981;
    font-size: 20px;
}

.next-steps-cta {
    margin: 40px 0;
    padding: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
}

.next-steps-cta h3 {
    font-size: 24px;
    margin: 0 0 8px 0;
}

.next-steps-cta p {
    margin: 0;
    opacity: 0.9;
}

.thankyou-branding {
    margin-top: 32px;
    padding-top: 32px;
    border-top: 1px solid #e2e8f0;
}

.brand-logo {
    font-size: 20px;
    font-weight: 800;
    color: #1e293b;
    margin-bottom: 4px;
}

.brand-tagline {
    font-size: 14px;
    color: #64748b;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .slide {
        padding: 20px;
    }

    .title-main {
        grid-template-columns: 1fr;
        gap: 32px;
        text-align: center;
    }

    .row-analysis-slide {
        grid-template-columns: 1fr;
        gap: 24px;
    }

    .matrix-grid {
        height: 300px;
    }

    .staaar-title {
        font-size: 32px;
    }

    .thankyou-main h1 {
        font-size: 40px;
    }
}

/* Loading animation */
@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.loading {
    animation: pulse 2s infinite;
}

/* Exit button */
.header-btn {
    background: none;
    border: none;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 20px;
    color: #6b7280;
    transition: all 0.2s ease;
}

.header-btn:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #374151;
}
`;
    }

    getPresentationScript() {
        return `
// Self-contained presentation script
class SelfContainedPresentation {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.slides = [];
        this.isFullscreen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeSlides();
        this.showFullscreenPrompt();
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('prevSlide')?.addEventListener('click', () => this.previousSlide());
        document.getElementById('nextSlide')?.addEventListener('click', () => this.nextSlide());

        // Close button
        document.getElementById('closePresentation')?.addEventListener('click', () => this.exitPresentation());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            // Check if we're focused on a video element
            const activeVideo = document.querySelector('.slide.active video');

            switch(e.key) {
                case 'ArrowLeft':
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case ' ':
                    // If space is pressed on a video slide, toggle video playback instead of next slide
                    if (e.key === ' ' && activeVideo) {
                        e.preventDefault(); // Prevent default space behavior
                        if (activeVideo.paused) {
                            activeVideo.play();
                            console.log('Started video playback with space key');
                        } else {
                            activeVideo.pause();
                            console.log('Paused video with space key');
                        }
                    } else {
                        this.nextSlide();
                    }
                    break;
                case 'k':
                case 'K':
                    // K key to toggle video (common video player shortcut)
                    if (activeVideo) {
                        if (activeVideo.paused) {
                            activeVideo.play();
                        } else {
                            activeVideo.pause();
                        }
                    }
                    break;
                case 'Escape':
                    this.exitPresentation();
                    break;
                case 'Home':
                    this.showSlide(0);
                    break;
                case 'End':
                    this.showSlide(this.totalSlides - 1);
                    break;
            }
        });

        // Slide indicators
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('slide-indicator')) {
                const index = parseInt(e.target.textContent) - 1;
                this.showSlide(index);
            }
        });

        // Fullscreen change events
        const fullscreenEvents = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange'];
        fullscreenEvents.forEach(event => {
            document.addEventListener(event, () => {
                const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement ||
                                       document.mozFullScreenElement || document.msFullscreenElement);
                if (!isFullscreen && !this.isExiting) {
                    this.exitPresentation();
                }
            });
        });
    }

    initializeSlides() {
        this.slides = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length;

        // Update total slides counter
        const totalSlidesElement = document.getElementById('totalSlides');
        if (totalSlidesElement) {
            totalSlidesElement.textContent = this.totalSlides;
        }

        // Initialize slide indicators
        this.updateSlideIndicators();

        // Ensure all slides are properly initialized
        this.slides.forEach((slide, index) => {
            slide.style.display = 'flex'; // Ensure flex display
            slide.style.flexDirection = 'column'; // Ensure column layout
            if (index === 0) {
                slide.classList.add('active');
                slide.style.opacity = '1';
                slide.style.zIndex = '2';
            } else {
                slide.classList.remove('active');
                slide.style.opacity = '0';
                slide.style.zIndex = '1';
            }
        });

        // Show first slide with a slight delay to ensure DOM is ready
        setTimeout(() => {
            this.showSlide(0);
        }, 100);
    }

    showSlide(index) {
        if (index < 0 || index >= this.totalSlides) return;

        console.log('Showing slide:', index, 'of', this.totalSlides);

        // Simple opacity-only transition - no transforms or visibility
        this.slides.forEach((slide, i) => {
            const isBecomingActive = i === index;
            slide.classList.remove('active');

            if (isBecomingActive) {
                slide.classList.add('active');
                slide.style.opacity = '1';
                slide.style.zIndex = '2';
                slide.style.display = 'flex';
                slide.style.flexDirection = 'column';

                // Debug: Check slide content
                const slideContent = slide.innerHTML;
                const hasContent = slideContent.trim().length > 0;
                console.log('Activated slide', i, 'Has content:', hasContent, 'Length:', slideContent.length);

                if (!hasContent) {
                    console.warn('Slide', i, 'appears to be empty!');
                    slide.innerHTML = '<div style="color: red; text-align: center; margin: auto;">SLIDE ' + (i + 1) + ' - DEBUG: CONTENT MISSING</div>';
                }
            } else {
                slide.style.opacity = '0';
                slide.style.zIndex = '1';

                // Handle video playback when leaving slides
                const video = slide.querySelector('video');
                if (video) {
                    if (!video.paused) {
                        video.pause();
                        console.log('Paused video in slide', i);
                    }
                    // Reset video to beginning when leaving slide
                    video.currentTime = 0;
                    console.log('Reset video in slide', i, 'to beginning');
                }
            }
        });

        // Update navigation buttons
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');

        if (prevBtn) prevBtn.disabled = index === 0;
        if (nextBtn) {
            nextBtn.disabled = index === this.totalSlides - 1;
            nextBtn.innerHTML = index === this.totalSlides - 1 ?
                '<i class="bi bi-check-circle"></i> Finish' :
                'Next <i class="bi bi-chevron-right"></i>';
        }

        // Update slide counter
        const currentSlideElement = document.getElementById('currentSlideNum');
        if (currentSlideElement) {
            currentSlideElement.textContent = index + 1;
        }

        // Update indicators
        document.querySelectorAll('.slide-indicator').forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });

        this.currentSlide = index;

        // Auto-play videos on video slides
        const activeSlide = this.slides[index];
        const video = activeSlide?.querySelector('video');
        if (video && video.paused) {
            video.currentTime = 0; // Reset to beginning
        }
    }

    updateSlideIndicators() {
        const container = document.getElementById('slideIndicators');
        if (!container) return;

        container.innerHTML = '';
        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement('button');
            indicator.className = 'slide-indicator';
            indicator.textContent = i + 1;
            indicator.setAttribute('aria-label', \`Go to slide \${i + 1}\`);
            container.appendChild(indicator);
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides - 1) {
            this.showSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 0) {
            this.showSlide(this.currentSlide - 1);
        }
    }

    showFullscreenPrompt() {
        // Create fullscreen prompt overlay
        const promptOverlay = document.createElement('div');
        promptOverlay.innerHTML = \`
            <div style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.9); display: flex; align-items: center; justify-content: center; z-index: 10000; font-family: 'Inter', sans-serif;">
                <div style="text-align: center; color: white; max-width: 500px; padding: 40px;">
                    <h2 style="font-size: 32px; margin-bottom: 16px; font-weight: 700;">Strategy Presentation Ready</h2>
                    <p style="font-size: 18px; margin-bottom: 32px; opacity: 0.9;">Click below to start your fullscreen presentation experience</p>
                    <button id="startPresentationBtn" style="padding: 16px 32px; font-size: 18px; font-weight: 600; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                        🚀 Start Presentation
                    </button>
                    <p style="font-size: 14px; margin-top: 16px; opacity: 0.7;">Press F11 or use the button above for fullscreen</p>
                </div>
            </div>
        \`;
        document.body.appendChild(promptOverlay);

        // Add click handler for fullscreen
        document.getElementById('startPresentationBtn').addEventListener('click', async () => {
            promptOverlay.remove();
            await this.enterFullscreen();
        });
    }

    async enterFullscreen() {
        try {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                await elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                await elem.webkitRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                await elem.mozRequestFullScreen();
            } else if (elem.msRequestFullscreen) {
                await elem.msRequestFullscreen();
            }
            this.isFullscreen = true;
        } catch (error) {
            console.warn('Could not enter fullscreen:', error);
            // Continue with presentation even if fullscreen fails
        }
    }

    exitPresentation() {
        this.isExiting = true;

        // Pause all videos when exiting presentation
        const allVideos = document.querySelectorAll('video');
        allVideos.forEach(video => {
            if (!video.paused) {
                video.pause();
                video.currentTime = 0;
                console.log('Paused and reset video on presentation exit');
            }
        });

        // Exit fullscreen
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        // Option to close window if it was opened for presentation
        if (window.opener) {
            window.close();
        } else {
            // Or redirect to a thank you page
            document.body.innerHTML = \`
                <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; font-family: 'Inter', sans-serif;">
                    <div>
                        <h1 style="font-size: 48px; margin-bottom: 16px;">Thank You!</h1>
                        <p style="font-size: 18px; opacity: 0.9;">Presentation completed successfully.</p>
                        <p style="font-size: 14px; margin-top: 24px; opacity: 0.7;">You can close this window now.</p>
                    </div>
                </div>
            \`;
        }
    }
}

// Auto-start presentation when page loads
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('presentation-mode');
    new SelfContainedPresentation();
});

// Prevent context menu and other interactions
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());
`;
    }

    buildCompleteHtml() {
        const slides = this.presentationData.slides || [];
        const video = this.presentationData.video;
        const strategy = this.presentationData.strategy;

        // Filter out empty slides and create clean slide HTML
        const validSlides = slides.filter(slide =>
            slide && slide.content && slide.content.trim().length > 0
        );

        console.log('Total slides received:', slides.length, 'Valid slides after filtering:', validSlides.length);

        const slidesHtml = validSlides.map((slide, index) => `
            <div class="slide ${index === 0 ? 'active' : ''}">
                <div class="slide-header">
                    <h2 class="slide-title">${slide.title || `Slide ${index + 1}`}</h2>
                </div>
                <div class="slide-body">
                    ${slide.content || ''}
                </div>
            </div>
        `).join('');

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${strategy?.title || 'Strategy Presentation'} - STAAAR Presentation</title>
    <meta name="description" content="Interactive strategy presentation generated by Strategy STAAAR">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <style>
        ${this.cssContent}
    </style>
</head>
<body class="presentation-mode">
    <div class="presentation-container">
        <!-- Presentation Header -->
        <div class="presentation-header">
            <div class="header-left">
                <div class="logo-section">
                    <div class="mckinsey-logo">STRATEGY STAAAR</div>
                    <div class="subtitle">Strategic Insight Presentation</div>
                </div>
            </div>
            <div class="header-right">
                <div class="slide-counter">
                    <span id="currentSlideNum">1</span> / <span id="totalSlides">${validSlides.length}</span>
                </div>
                <button class="header-btn" id="closePresentation">
                    <i class="bi bi-x"></i>
                </button>
            </div>
        </div>

        <!-- Presentation Content Area -->
        <div class="presentation-content">
            <div class="slides-container">
                ${slidesHtml}
            </div>
        </div>

        <!-- Presentation Navigation -->
        <div class="presentation-nav">
            <div class="nav-left">
                <button class="nav-btn secondary" id="prevSlide" disabled>
                    <i class="bi bi-chevron-left"></i>
                    Previous
                </button>
            </div>

            <div class="nav-center">
                <div class="slide-indicators" id="slideIndicators">
                    <!-- Indicators will be generated dynamically -->
                </div>
            </div>

            <div class="nav-right">
                <button class="nav-btn secondary" id="nextSlide">
                    Next
                    <i class="bi bi-chevron-right"></i>
                </button>
            </div>
        </div>
    </div>

    <script>
        ${this.jsContent}
    </script>
</body>
</html>`;
    }

    downloadHtmlFile(htmlContent) {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        const filename = this.generateFilename();

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        return filename;
    }

    generateFilename() {
        const strategy = this.presentationData.strategy;
        const timestamp = new Date().toISOString().slice(0, 16).replace(/[:-]/g, '');

        let baseName = 'Strategy_Presentation';
        if (strategy?.title) {
            baseName = strategy.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
        }

        return `${baseName}_${timestamp}.html`;
    }

    // Utility method to convert images to base64
    async imageToBase64(imgElement) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = imgElement.naturalWidth || imgElement.width;
            canvas.height = imgElement.naturalHeight || imgElement.height;

            ctx.drawImage(imgElement, 0, 0);

            const dataURL = canvas.toDataURL('image/jpeg', 0.8);
            resolve(dataURL);
        });
    }

    // Utility method to embed all images as base64
    async embedImages(htmlContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const images = doc.querySelectorAll('img');

        const promises = Array.from(images).map(async (img) => {
            try {
                if (img.src.startsWith('data:')) {
                    return; // Already base64
                }

                const response = await fetch(img.src);
                const blob = await response.blob();
                const base64 = await this.blobToBase64(blob);
                img.src = base64;
            } catch (error) {
                console.warn('Could not embed image:', img.src, error);
            }
        });

        await Promise.all(promises);
        return doc.documentElement.outerHTML;
    }

    blobToBase64(blob) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }
}