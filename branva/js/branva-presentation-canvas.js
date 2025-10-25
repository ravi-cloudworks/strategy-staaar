// Branva Canvas-Based Presentation Mode
// High-performance image capture for perfect visual fidelity

class BranvaCanvasPresentation {
    constructor() {
        this.currentSlideIndex = 0;
        this.slideImages = [];
        this.isActive = false;
        this.isCapturing = false; // Prevent multiple simultaneous captures
        this.canvasWidth = 1920;
        this.canvasHeight = 1080;
        this.captureScale = 3; // Higher DPI for better quality
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadHtml2Canvas();
    }

    async loadHtml2Canvas() {
        // Load html2canvas library if not already loaded
        if (typeof html2canvas === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
            script.onload = () => {};
            document.head.appendChild(script);
        }
    }

    setupEventListeners() {
        // Present button in header
        const presentBtn = document.querySelector('.btn-primary');
        if (presentBtn && presentBtn.textContent.trim() === 'Present') {
            presentBtn.addEventListener('click', () => this.startPresentation());
        }

        // Presentation controls
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');
        const exitBtn = document.getElementById('exitPresentation');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousSlide());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSlide());
        }

        if (exitBtn) {
            exitBtn.addEventListener('click', () => this.exitPresentation());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!this.isActive) return;

            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ': // Spacebar
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.exitPresentation();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.slideImages.length - 1);
                    break;
                case 'r':
                case 'R':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.refreshPresentation();
                    }
                    break;
            }
        });

        // Prevent context menu in presentation mode
        document.addEventListener('contextmenu', (e) => {
            if (this.isActive) {
                e.preventDefault();
            }
        });
    }

    async startPresentation() {
        // Prevent multiple simultaneous captures
        if (this.isCapturing) {
            console.log('📸 Presentation capture already in progress, please wait...');
            return;
        }

        this.isCapturing = true;

        // Show loading indicator
        this.showLoadingIndicator();

        try {
            // Check how many slides should be captured
            // console.log('🔍 CHECKING SLIDE SYSTEM:');
            if (window.branvaCanvas && window.branvaCanvas.slides) {
                // console.log('  - Formal slides system found:', window.branvaCanvas.slides.length, 'slides');
                window.branvaCanvas.slides.forEach((slide, i) => {
                    // console.log(`    Slide ${i + 1}:`, {
                    //     id: slide.id,
                    //     title: slide.title,
                    //     elements: slide.elements ? slide.elements.length : 0
                    // });
                });
            } else {
                // console.log('  - No formal slides system, using current canvas content');
            }

            // Capture current canvas content as high-quality image
            await this.captureCanvasContent();

            if (this.slideImages.length === 0) {
                this.hideLoadingIndicator();
                if (window.showToast) {
                    window.showToast('No content to present. Add some elements to the canvas first!', 'warning');
                }
                return;
            }

            // Hide loading and show presentation
            this.hideLoadingIndicator();
            this.showPresentationMode();

        } catch (error) {
            console.error('❌ Failed to start presentation:', error);
            this.hideLoadingIndicator();
            if (window.showToast) {
                window.showToast('Failed to start presentation. Please try again.', 'error');
            }
        } finally {
            this.isCapturing = false; // Always reset capture flag
        }
    }

    async captureCanvasContent() {
        this.slideImages = [];

        const slideContent = document.getElementById('slideContent');
        if (!slideContent) {
            console.warn('❌ No slide content found');
            return;
        }

        // Check if html2canvas is available
        if (typeof html2canvas === 'undefined') {
            throw new Error('❌ html2canvas library not loaded');
        }

        // console.log('🚀 STARTING PRESENTATION CAPTURE DEBUG');

        try {
            // Temporarily hide any UI elements that shouldn't be in presentation
            this.hideUIElements();

            // Check if we have multiple slides to capture
            if (window.branvaCanvas && window.branvaCanvas.slides && window.branvaCanvas.slides.length > 0) {
                // console.log(`📚 Found ${window.branvaCanvas.slides.length} slides to capture`);

                // Save current slide index to restore later
                const originalSlideIndex = window.branvaCanvas.currentSlideIndex;

                // Capture each slide
                for (let i = 0; i < window.branvaCanvas.slides.length; i++) {
                    // console.log(`📸 Capturing slide ${i + 1}/${window.branvaCanvas.slides.length}`);

                    // Switch to this slide to render it
                    window.branvaCanvas.currentSlideIndex = i;
                    window.branvaCanvas.renderCurrentSlide();

                    // Wait for the slide to render
                    await new Promise(resolve => setTimeout(resolve, 100));

                    // Capture this slide
                    const slideImage = await this.captureSlideContent(slideContent, i);
                    if (slideImage) {
                        this.slideImages.push(slideImage);
                        console.log(`✅ Successfully captured slide ${i + 1}: ${slideImage.title}`);
                    } else {
                        console.warn(`❌ Failed to capture slide ${i + 1}`);
                    }
                }

                // Restore original slide
                window.branvaCanvas.currentSlideIndex = originalSlideIndex;
                window.branvaCanvas.renderCurrentSlide();

            } else {
                // console.log('📄 No formal slides system found, capturing current content');
                // Fallback: capture current content
                const slideImage = await this.captureSlideContent(slideContent, 0);
                if (slideImage) {
                    this.slideImages.push(slideImage);
                }
            }

        } catch (error) {
            console.error('❌ Error during content capture:', error);
            throw error;
        } finally {
            // Always restore UI elements
            this.showUIElements();
        }
    }

    async captureSlideContent(slideContent, slideIndex) {
        // Get actual slideContent dimensions
        const contentRect = slideContent.getBoundingClientRect();

        // Use high-resolution dimensions for better quality
        const captureWidth = Math.max(contentRect.width, slideContent.scrollWidth, 1920);
        const captureHeight = Math.max(contentRect.height, slideContent.scrollHeight, 1080);

        try {
            // Capture the entire slide content area including overflow
            const canvas = await html2canvas(slideContent, {
                width: captureWidth,
                height: captureHeight,
                scale: this.captureScale,
                useCORS: true,
                backgroundColor: '#ffffff',
                removeContainer: false,
                foreignObjectRendering: false,
                allowTaint: true,
                scrollX: 0,
                scrollY: 0,
                imageTimeout: 15000,
                ignoreElements: (element) => {
                    return element.classList.contains('grid-lines') ||
                           element.classList.contains('resize-handle') ||
                           element.classList.contains('element-toolbar');
                },
                onclone: (clonedDoc, element) => {
                    const clonedSlideContent = clonedDoc.getElementById('slideContent');
                    if (clonedSlideContent) {
                        // Force all elements to be visible and properly styled
                        const allElements = clonedSlideContent.querySelectorAll('*');
                        allElements.forEach((el) => {
                            // Force basic visibility
                            el.style.visibility = 'visible';
                            el.style.opacity = '1';

                            // Fix common CSS issues that break html2canvas
                            if (el.style.position === 'fixed') {
                                el.style.position = 'absolute';
                            }
                        });

                        // Force styles on cloned matrix elements
                        const matrices = clonedSlideContent.querySelectorAll('.strategy-matrix');
                        matrices.forEach((matrix, index) => {
                            // Force visibility and positioning
                            matrix.style.display = 'block';
                            matrix.style.visibility = 'visible';
                            matrix.style.opacity = '1';
                            matrix.style.backgroundColor = '#ffffff';

                            // Force table styles
                            const tables = matrix.querySelectorAll('table');
                            tables.forEach(table => {
                                table.style.borderCollapse = 'collapse';
                                table.style.width = '100%';
                                table.style.backgroundColor = '#ffffff';

                                // Force cell styles
                                const cells = table.querySelectorAll('td, th');
                                cells.forEach(cell => {
                                    cell.style.border = '1px solid #ccc';
                                    cell.style.padding = '8px';
                                    cell.style.backgroundColor = '#ffffff';
                                    cell.style.color = '#000000';
                                });
                            });
                        });

                        // Force text elements to be visible
                        const textElements = clonedSlideContent.querySelectorAll('.text-element, .welcome-message, h1, h2, h3, p, div');
                        textElements.forEach(textEl => {
                            textEl.style.color = '#000000';
                            textEl.style.backgroundColor = 'transparent';
                            textEl.style.fontSize = textEl.style.fontSize || '16px';
                        });
                    }
                }
            });

            // Convert to high-quality image
            const imageDataUrl = canvas.toDataURL('image/png', 1.0);

            // Always include slides in presentation, even if they appear empty
            // This ensures text-only slides and minimal content slides are shown
            const hasContent = await this.checkImageContent(imageDataUrl);
            if (!hasContent) {
                console.warn(`⚠️ Slide ${slideIndex + 1} appears to be mostly empty, but including it anyway`);
            }

            // console.log(`✅ Captured slide ${slideIndex + 1}: ${canvas.width}x${canvas.height}`);

            return {
                id: `slide-${slideIndex}`,
                title: `Slide ${slideIndex + 1}`,
                imageUrl: imageDataUrl,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Canvas capture failed:', error);
            return null;
        }
    }

    async checkImageContent(imageDataUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;
                let nonWhitePixels = 0;
                let totalNonTransparent = 0;

                for (let i = 0; i < pixels.length; i += 4) {
                    const r = pixels[i];
                    const g = pixels[i + 1];
                    const b = pixels[i + 2];
                    const a = pixels[i + 3];

                    if (a > 0) {
                        totalNonTransparent++;
                        // More lenient detection - consider light gray as content too
                        if (!(r > 240 && g > 240 && b > 240)) {
                            nonWhitePixels++;
                        }
                    }
                }

                const contentPercentage = totalNonTransparent > 0 ? (nonWhitePixels / totalNonTransparent) * 100 : 0;
                resolve(contentPercentage > 0.1); // Much more lenient threshold
            };
            img.onerror = () => resolve(false);
            img.src = imageDataUrl;
        });
    }

    hideUIElements() {
        // Hide elements that shouldn't appear in presentation
        const elementsToHide = [
            '.resize-handle',
            '.element-toolbar',
            '.selection-outline',
            '.grid-lines',
            '.canvas-element .resize-handle',
            '.canvas-element .element-toolbar'
        ];

        this.hiddenElements = [];

        elementsToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.style.display !== 'none') {
                    this.hiddenElements.push({
                        element: el,
                        originalDisplay: el.style.display
                    });
                    el.style.display = 'none';
                }
            });
        });

        // Remove selection states
        document.querySelectorAll('.selected').forEach(el => {
            el.classList.add('temp-deselected');
            el.classList.remove('selected');
        });
    }

    showUIElements() {
        // Restore hidden elements
        if (this.hiddenElements) {
            this.hiddenElements.forEach(({ element, originalDisplay }) => {
                element.style.display = originalDisplay;
            });
            this.hiddenElements = [];
        }

        // Restore selection states
        document.querySelectorAll('.temp-deselected').forEach(el => {
            el.classList.add('selected');
            el.classList.remove('temp-deselected');
        });
    }

    showLoadingIndicator() {
        const loader = document.createElement('div');
        loader.id = 'presentation-loader';
        loader.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                color: white;
                font-family: 'Geist', sans-serif;
            ">
                <div style="text-align: center;">
                    <div style="
                        width: 50px;
                        height: 50px;
                        border: 3px solid rgba(255,255,255,0.3);
                        border-top: 3px solid white;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 20px auto;
                    "></div>
                    <div style="font-size: 18px; font-weight: 500;">
                        📸 Capturing presentation content...
                    </div>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(loader);
    }

    hideLoadingIndicator() {
        const loader = document.getElementById('presentation-loader');
        if (loader) {
            loader.remove();
        }
    }

    showPresentationMode() {
        const presentationOverlay = document.getElementById('presentationMode');
        if (!presentationOverlay) {
            console.error('Presentation overlay not found');
            return;
        }

        presentationOverlay.classList.add('active');
        this.isActive = true;
        this.currentSlideIndex = 0;

        // Render slide images
        this.renderSlideImages();
        this.updateSlideCounter();
        this.showSlide(0);

        // Try to enter fullscreen
        this.requestFullscreen();

    }

    renderSlideImages() {
        const slideContainer = document.getElementById('slideContainer');
        if (!slideContainer) return;

        slideContainer.innerHTML = '';

        this.slideImages.forEach((slide, index) => {
            const slideElement = document.createElement('div');
            slideElement.className = 'presentation-slide';
            slideElement.id = `presentation-slide-${index}`;
            slideElement.style.cssText = `
                width: 100vw;
                height: 100vh;
                position: fixed;
                top: 0;
                left: 0;
                background: black;
                display: none;
                overflow: hidden;
                z-index: 999;
            `;

            // Create image element with perfect scaling
            const imageElement = document.createElement('img');

            // console.log(`🖼️ Creating presentation image for slide ${index}:`);
            // console.log('  - Image data length:', slide.imageUrl.length, 'bytes');
            // console.log('  - Image data prefix:', slide.imageUrl.substring(0, 50));

            imageElement.src = slide.imageUrl;

            imageElement.onload = () => {
                // console.log(`✅ Presentation image ${index} loaded successfully:`);
                // console.log('  - Natural dimensions:', `${imageElement.naturalWidth}x${imageElement.naturalHeight}`);
                // console.log('  - Display dimensions:', `${imageElement.width}x${imageElement.height}`);
                // console.log('  - Parent container:', `${slideElement.offsetWidth}x${slideElement.offsetHeight}`);

                // Check if image is visible
                const computedStyle = window.getComputedStyle(imageElement);
                // console.log('  - Computed styles:', {
                //     display: computedStyle.display,
                //     visibility: computedStyle.visibility,
                //     opacity: computedStyle.opacity,
                //     position: computedStyle.position,
                //     zIndex: computedStyle.zIndex
                // });
            };

            imageElement.onerror = (e) => {
                console.error(`❌ Image failed to load for slide ${index}:`, e);
                console.error('  - Image src length:', slide.imageUrl.length);
                console.error('  - Image src prefix:', slide.imageUrl.substring(0, 100));
            };

            // Use absolute positioning within the fixed slide container for better control
            imageElement.style.cssText = `
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                object-fit: contain;
                object-position: center center;
                z-index: 1;
                image-rendering: auto;
                image-rendering: -webkit-optimize-contrast;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
            `;

            // console.log(`📐 Image ${index} positioning:`, {
            //     maxWidth: '100vw',
            //     maxHeight: '100vh',
            //     position: 'absolute',
            //     transform: 'translate(-50%, -50%)',
            //     objectFit: 'contain'
            // });

            slideElement.appendChild(imageElement);
            slideContainer.appendChild(slideElement);
        });
    }

    showSlide(index) {
        if (index < 0 || index >= this.slideImages.length) {
            console.warn(`⚠️ Invalid slide index: ${index} (max: ${this.slideImages.length - 1})`);
            return;
        }

        // console.log(`🎯 Showing slide ${index}:`);

        // Hide all slides
        const allSlides = document.querySelectorAll('.presentation-slide');
        // console.log('  - Total slides found:', allSlides.length);
        allSlides.forEach((slide, i) => {
            slide.style.display = 'none';
            // console.log(`    ${i}. Hidden slide:`, slide.id);
        });

        // Show current slide
        const currentSlide = document.getElementById(`presentation-slide-${index}`);
        if (currentSlide) {
            currentSlide.style.display = 'block';

            // console.log(`✅ Slide ${index} displayed:`, {
            //     id: currentSlide.id,
            //     dimensions: `${currentSlide.offsetWidth}x${currentSlide.offsetHeight}`,
            //     display: currentSlide.style.display,
            //     childCount: currentSlide.children.length
            // });

            // Check if the image inside is visible
            const image = currentSlide.querySelector('img');
            if (image) {
                // console.log('  - Image in slide:', {
                //     src: image.src.substring(0, 50) + '...',
                //     naturalSize: `${image.naturalWidth}x${image.naturalHeight}`,
                //     displaySize: `${image.width}x${image.height}`,
                //     complete: image.complete,
                //     visible: image.offsetWidth > 0 && image.offsetHeight > 0
                // });

                // Force a visual check
                setTimeout(() => {
                    const rect = image.getBoundingClientRect();
                    // console.log('  - Image position after render:', {
                    //     left: rect.left,
                    //     top: rect.top,
                    //     width: rect.width,
                    //     height: rect.height,
                    //     inViewport: rect.top >= 0 && rect.left >= 0 &&
                    //                rect.bottom <= window.innerHeight &&
                    //                rect.right <= window.innerWidth
                    // });
                }, 100);
            } else {
                console.warn(`⚠️ No image found in slide ${index}`);
            }
        } else {
            console.error(`❌ Slide element not found: presentation-slide-${index}`);
        }

        this.currentSlideIndex = index;
        this.updateNavigationButtons();
        this.updateSlideCounter();
    }

    previousSlide() {
        if (this.currentSlideIndex > 0) {
            this.showSlide(this.currentSlideIndex - 1);
        }
    }

    nextSlide() {
        if (this.currentSlideIndex < this.slideImages.length - 1) {
            this.showSlide(this.currentSlideIndex + 1);
        }
    }

    goToSlide(index) {
        this.showSlide(index);
    }

    async refreshPresentation() {
        if (!this.isActive) return;


        this.showLoadingIndicator();

        try {
            // Re-capture canvas content
            await this.captureCanvasContent();

            // Re-render slides
            this.renderSlideImages();

            // Show current slide with fresh content
            this.showSlide(this.currentSlideIndex);

            this.hideLoadingIndicator();

            // Removed: Presentation refreshed toast (unnecessary)

        } catch (error) {
            console.error('❌ Failed to refresh presentation:', error);
            this.hideLoadingIndicator();
            if (window.showToast) {
                window.showToast('Failed to refresh presentation', 'error');
            }
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');

        if (prevBtn) {
            prevBtn.disabled = this.currentSlideIndex === 0;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentSlideIndex === this.slideImages.length - 1;
        }
    }

    updateSlideCounter() {
        const slideCounter = document.getElementById('slideCounter');
        if (slideCounter) {
            slideCounter.textContent = `${this.currentSlideIndex + 1} / ${this.slideImages.length}`;
        }
    }

    exitPresentation() {

        const presentationOverlay = document.getElementById('presentationMode');
        if (presentationOverlay) {
            presentationOverlay.classList.remove('active');
            this.isActive = false;

            // Exit fullscreen
            this.exitFullscreen();

            // Clean up slide images to free memory
            this.slideImages = [];

        }
    }

    requestFullscreen() {
        const element = document.getElementById('presentationMode');
        if (element && element.requestFullscreen) {
            element.requestFullscreen().catch(err => {
                console.log('Could not enter fullscreen:', err);
            });
        }
    }

    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => {
                console.log('Could not exit fullscreen:', err);
            });
        }
    }
}

// Initialize and make globally available
window.BranvaCanvasPresentation = BranvaCanvasPresentation;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.branvaCanvasPresentation = new BranvaCanvasPresentation();
});