/**
 * Survey Callout System
 * Extracted from callout-map-libre.html for reuse in presentation slides
 * Supports both map and image modes with interactive callouts
 */

class SurveyCalloutSystem {
    constructor(mode, containerId) {
        console.log(`🔧 ===== SURVEY CALLOUT SYSTEM CONSTRUCTOR =====`);
        console.log(`📋 Mode: ${mode}`);
        console.log(`📦 Container ID: ${containerId}`);

        this.mode = mode; // 'map' or 'image'
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.isPinMode = false;
        this.pinData = [];
        this.map = null;
        this.isImageView = mode === 'image';
        this.pinCounter = 0; // Track pin numbers

        console.log(`🔍 Container found:`, this.container);
        console.log(`🗺️ Is image view:`, this.isImageView);

        this.feedbacks = [
            "Great product! Really loving the features 😍",
            "Excellent customer service, highly recommend! ⭐⭐⭐⭐⭐",
            "Good value for money. Works as expected ✅",
            "Amazing quality! Will definitely buy again 🚀",
            "Fast delivery and great packaging 📦",
            "User-friendly interface, easy to use 👍",
            "Outstanding performance! 5 stars ⭐⭐⭐⭐⭐"
        ];

        this.init();
    }

    init() {
        if (!this.container) {
            console.error('Container not found:', this.containerId);
            return;
        }

        // Clear the container and reset pin counter
        this.container.innerHTML = '';
        this.container.style.position = 'relative';
        this.container.style.overflow = 'hidden';
        this.pinCounter = 0; // Reset pin counter on init

        if (this.mode === 'map') {
            this.initializeMapMode();
        } else {
            this.initializeImageMode();
        }

        this.addControls();
        this.addCSS();
        // Removed addDemoCallouts() - user will add callouts manually via pin mode
    }

    initializeMapMode() {
        // Create map container
        const mapContainer = document.createElement('div');
        mapContainer.id = `map-${this.containerId}`;
        mapContainer.style.cssText = `
            width: 100%;
            height: 100%;
            border-radius: 8px;
        `;
        this.container.appendChild(mapContainer);

        // Initialize MapLibre map
        this.map = new maplibregl.Map({
            container: mapContainer.id,
            style: {
                "version": 8,
                "sources": {
                    "osm": {
                        "type": "raster",
                        "tiles": ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                        "tileSize": 256
                    }
                },
                "layers": [{"id": "osm", "type": "raster", "source": "osm"}]
            },
            center: [-1.5, 54], // UK center
            zoom: 6
        });

        this.map.addControl(new maplibregl.NavigationControl());

        // Add map click handler
        this.map.on('click', (e) => {
            if (!this.isPinMode) return;
            const coords = e.lngLat;
            const randomFeedback = this.feedbacks[Math.floor(Math.random() * this.feedbacks.length)];
            const randomRating = Math.floor(Math.random() * 2) + 4;
            this.createPin([coords.lng, coords.lat], randomFeedback, "💬 Customer Feedback", randomRating);
        });

        // Update lines on map movement
        this.map.on('move', () => this.updateAllLines());
        this.map.on('zoom', () => this.updateAllLines());
    }

    initializeImageMode() {
        // Create image container
        const imageContainer = document.createElement('div');
        imageContainer.style.cssText = `
            width: 100%;
            height: 100%;
            position: relative;
            background: #f3f4f6;
            border-radius: 8px;
            overflow: hidden;
        `;

        // Use images from the presentation slides
        const slideImages = this.extractImagesFromSlides();
        const defaultImage = slideImages.length > 0 ? slideImages[0] : 'https://images.unsplash.com/photo-1486312338219-ce68ba2129d9?w=800&h=450&fit=crop';

        const backgroundImage = document.createElement('img');
        backgroundImage.src = defaultImage;
        backgroundImage.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
            cursor: crosshair;
        `;

        // Add click handler for image
        backgroundImage.addEventListener('click', (e) => {
            if (!this.isPinMode) return;
            const rect = backgroundImage.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;

            const randomFeedback = this.feedbacks[Math.floor(Math.random() * this.feedbacks.length)];
            const randomRating = Math.floor(Math.random() * 2) + 4;
            this.createImagePin([xPercent, yPercent], randomFeedback, "💬 Customer Feedback", randomRating);
        });

        imageContainer.appendChild(backgroundImage);
        this.container.appendChild(imageContainer);

        // Add image selector outside the image container for image mode
        this.addImageSelector();
    }

    addControls() {
        // Pin mode toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '📍 Click to Add Pins';
        toggleBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            z-index: 10002;
            background: #3b82f6;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            transition: all 0.2s ease;
        `;

        // Add hover effects to toggle button
        toggleBtn.addEventListener('mouseenter', () => {
            toggleBtn.style.transform = 'translateY(-2px)';
            toggleBtn.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
        });

        toggleBtn.addEventListener('mouseleave', () => {
            toggleBtn.style.transform = 'translateY(0)';
            toggleBtn.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
        });

        toggleBtn.addEventListener('click', () => {
            this.isPinMode = !this.isPinMode;
            if (this.isPinMode) {
                toggleBtn.textContent = '📍 Pin Mode ON - Click';
                toggleBtn.style.background = '#10b981';
                toggleBtn.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
            } else {
                toggleBtn.textContent = '📍 Click to Add Pins';
                toggleBtn.style.background = '#3b82f6';
                toggleBtn.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
            }
        });

        // Clear button
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '🔄 Reset';
        clearBtn.style.cssText = `
            position: absolute;
            top: 60px;
            right: 10px;
            z-index: 10002;
            background: #ef4444;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
            transition: all 0.2s ease;
        `;

        // Add hover effects to clear button
        clearBtn.addEventListener('mouseenter', () => {
            clearBtn.style.transform = 'translateY(-2px)';
            clearBtn.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
        });

        clearBtn.addEventListener('mouseleave', () => {
            clearBtn.style.transform = 'translateY(0)';
            clearBtn.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
        });

        clearBtn.addEventListener('click', () => this.clearCustomPins());

        this.container.appendChild(toggleBtn);
        this.container.appendChild(clearBtn);
    }

    addImageSelector() {
        if (this.mode !== 'image') return;

        // Create image selector container positioned to the left of the slide content
        const imageSelector = document.createElement('div');
        imageSelector.style.cssText = `
            position: absolute;
            top: 80px;
            left: 20px;
            z-index: 10001;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            backdrop-filter: blur(10px);
        `;

        // Add a header
        const header = document.createElement('div');
        header.textContent = 'Choose Image';
        header.style.cssText = `
            font-size: 12px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
            text-align: center;
        `;
        imageSelector.appendChild(header);

        // Create 2x2 grid container
        const gridContainer = document.createElement('div');
        gridContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            width: 180px;
        `;

        // Extract images from the presentation slides (table data)
        const imageOptions = this.extractImagesFromSlides();

        console.log(`🖼️ Creating 2x2 selector with ${imageOptions.length} images`);

        if (imageOptions.length === 0) {
            // Fallback to generic images if no images found in slides
            console.log('⚠️ Using fallback images');
            imageOptions.push(
                'https://images.unsplash.com/photo-1486312338219-ce68ba2129d9?w=800&h=450&fit=crop',
                'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=450&fit=crop',
                'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=450&fit=crop',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop'
            );
        }

        // Get background image element
        const backgroundImage = this.container.querySelector('img');
        let currentImageIndex = 0;

        // Limit to 4 images for 2x2 grid
        const displayImages = imageOptions.slice(0, 4);

        displayImages.forEach((imageSrc, index) => {
            const imageOption = document.createElement('img');
            imageOption.src = imageSrc;
            imageOption.className = index === currentImageIndex ? 'image-option selected' : 'image-option';
            imageOption.style.cssText = `
                width: 80px;
                height: 60px;
                border: 3px solid ${index === currentImageIndex ? '#10b981' : '#e5e7eb'};
                border-radius: 6px;
                cursor: pointer;
                object-fit: cover;
                transition: all 0.3s ease;
                background: white;
            `;

            // Hover effects
            imageOption.addEventListener('mouseenter', () => {
                if (!imageOption.classList.contains('selected')) {
                    imageOption.style.borderColor = '#3b82f6';
                    imageOption.style.transform = 'scale(1.05)';
                    imageOption.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                }
            });

            imageOption.addEventListener('mouseleave', () => {
                if (!imageOption.classList.contains('selected')) {
                    imageOption.style.borderColor = '#e5e7eb';
                    imageOption.style.transform = 'scale(1)';
                    imageOption.style.boxShadow = 'none';
                }
            });

            // Click handler
            imageOption.addEventListener('click', () => {
                // Update background image
                backgroundImage.src = imageSrc;

                // Update selected state
                gridContainer.querySelectorAll('.image-option').forEach(opt => {
                    opt.classList.remove('selected');
                    opt.style.borderColor = '#e5e7eb';
                    opt.style.transform = 'scale(1)';
                    opt.style.boxShadow = 'none';
                });

                imageOption.classList.add('selected');
                imageOption.style.borderColor = '#10b981';
                imageOption.style.transform = 'scale(1.05)';
                imageOption.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';

                currentImageIndex = index;
                console.log('🖼️ Background image changed to:', imageSrc.substring(0, 50) + '...');
            });

            gridContainer.appendChild(imageOption);
        });

        imageSelector.appendChild(gridContainer);

        // Find the parent slide container and append there instead of inside the callout container
        const slideContainer = this.container.closest('.slide') || this.container.parentElement;
        if (slideContainer) {
            slideContainer.appendChild(imageSelector);
            console.log('✅ Image selector added to slide container, outside of image area');
        } else {
            // Fallback to container if slide not found
            this.container.appendChild(imageSelector);
            console.log('⚠️ Using fallback: Image selector added to callout container');
        }
    }

    addCSS() {
        // Add required CSS animations and styles
        const styleId = `callout-styles-${this.containerId}`;

        // Check if styles already exist
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes lineFlow {
                0%, 100% { opacity: 0.7; }
                50% { opacity: 1; }
            }

            @keyframes lottiePopup {
                0% {
                    opacity: 0;
                    transform: translateY(30px) scale(0.7) rotate(5deg);
                }
                50% {
                    opacity: 0.8;
                    transform: translateY(-10px) scale(1.1) rotate(-2deg);
                }
                70% {
                    opacity: 1;
                    transform: translateY(5px) scale(0.95) rotate(1deg);
                }
                100% {
                    opacity: 0.95;
                    transform: translateY(0px) scale(1) rotate(0deg);
                }
            }

            @keyframes gentleFloat {
                0%, 100% { transform: translateY(0px) scale(1) rotate(0deg); }
                50% { transform: translateY(-8px) scale(1) rotate(0deg); }
            }

            .floating-callout.show {
                animation: lottiePopup 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
            }

            .floating-callout.active {
                opacity: 0.95;
                animation: gentleFloat 4s ease-in-out infinite;
            }

            .floating-callout:hover {
                opacity: 1;
                transform: scale(1.02);
                z-index: 10002;
                animation-play-state: paused;
            }

            .floating-callout .editable-title:hover {
                background: #f9fafb;
                border-color: #d1d5db;
            }

            .floating-callout .editable-title:focus {
                outline: none;
                background: #f9fafb;
                border-color: #3b82f6;
            }

            .floating-callout .editable-body:hover {
                background: #f9fafb;
                border-color: #d1d5db;
            }

            .floating-callout .editable-body:focus {
                outline: none;
                background: #f9fafb;
                border-color: #3b82f6;
            }

            .floating-callout:hover .edit-hint {
                opacity: 1;
            }
        `;

        document.head.appendChild(style);
    }

    extractImagesFromSlides() {
        const images = [];

        console.log('🔍 ===== EXTRACTING IMAGES FROM SLIDES =====');

        // ONLY Method: Look for images in table rows (in order) - ignore other sources
        // Find the MAIN insight table (not presentation replicas)
        const allInsightTables = document.querySelectorAll('.insight-table');
        let mainTable = null;

        for (const table of allInsightTables) {
            if (!table.classList.contains('exact-index-replica')) {
                mainTable = table;
                break;
            }
        }

        // Fallback to first table if no main table found
        if (!mainTable && allInsightTables.length > 0) {
            mainTable = allInsightTables[0];
        }

        if (mainTable) {
            console.log('📊 Main insight table found - extracting images in row order');
            console.log(`🔍 Tables breakdown: ${allInsightTables.length} total (${allInsightTables.length - 1} replicas)`);

            // Get table rows in order to preserve sequence
            const tableRows = mainTable.querySelectorAll('tr[data-row]');
            console.log(`🔍 Found ${tableRows.length} table rows in main table`);

            tableRows.forEach((row, rowIndex) => {
                // Look for img tags in this specific row
                const rowImages = row.querySelectorAll('img');
                const rowBgImages = row.querySelectorAll('*[style*="background-image"]');

                console.log(`📍 Row ${rowIndex + 1}: ${rowImages.length} images, ${rowBgImages.length} background images`);

                // Process img tags in this row
                rowImages.forEach((img, imgIndex) => {
                    if (img.src) {
                        const isSvg = img.src.includes('data:image/svg+xml');
                        const isHttp = img.src.startsWith('http');
                        const isDataImage = img.src.startsWith('data:image/');
                        const isValidType = isHttp || isDataImage;
                        const isNotSvg = !isSvg;

                        if (isValidType && isNotSvg) {
                            images.push(img.src);
                            console.log(`✅ Row ${rowIndex + 1} - Added image: ${img.src.substring(0, 70)}...`);
                        } else {
                            const reason = isSvg ? 'SVG' : 'INVALID URL TYPE';
                            console.log(`❌ Row ${rowIndex + 1} - Skipped: ${reason} - ${img.src.substring(0, 70)}...`);
                        }
                    }
                });

                // Process background images in this row
                rowBgImages.forEach((element, bgIndex) => {
                    const style = element.getAttribute('style') || '';
                    const bgMatch = style.match(/background-image:\s*url\(['"]?([^'"]+)['"]?\)/);
                    if (bgMatch && bgMatch[1]) {
                        const bgImageUrl = bgMatch[1];
                        if ((bgImageUrl.startsWith('http') || bgImageUrl.startsWith('data:image/')) &&
                            !bgImageUrl.includes('data:image/svg+xml')) {
                            images.push(bgImageUrl);
                            console.log(`✅ Row ${rowIndex + 1} - Added background image: ${bgImageUrl.substring(0, 70)}...`);
                        }
                    }
                });
            });
        } else {
            console.log('⚠️ No main insight table found');
        }

        // Skip Method 4 - we only want table images to avoid accumulation

        console.log(`🎯 FINAL: Found ${images.length} images total`);
        if (images.length > 0) {
            console.log('📋 Final images:');
            images.forEach((img, i) => console.log(`   ${i + 1}. ${img.substring(0, 80)}...`));
        }

        if (images.length === 0) {
            console.log('❌ NO IMAGES FOUND - checking fallbacks...');
            console.log('   - window.croppedImages:', !!window.croppedImages);
            console.log('   - document.images.length:', document.images.length);
        }

        return images;
    }

    createPin(coords, feedbackText, title = "💬 Customer Feedback", rating = 4, isDemo = false) {
        // Increment pin counter and create numbered pin
        this.pinCounter++;
        const pinNumber = this.pinCounter;

        console.log(`📍 Creating map pin #${pinNumber}`);

        // Create marker for map mode
        let marker = null;
        if (this.mode === 'map' && this.map) {
            // Create custom numbered marker
            const markerElement = document.createElement('div');
            markerElement.style.cssText = `
                width: 24px;
                height: 24px;
                background: #ef4444;
                border: 2px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
                color: white;
                font-family: Arial, sans-serif;
                cursor: pointer;
            `;
            markerElement.textContent = pinNumber;

            marker = new maplibregl.Marker({ element: markerElement })
                .setLngLat(coords)
                .addTo(this.map);
        }

        // Create floating callout
        const callout = document.createElement('div');
        callout.className = 'floating-callout template-quotes';
        callout.setAttribute('data-template', 'quotes');
        callout.style.cssText = this.getCalloutStyles();

        callout.innerHTML = `
            <div class="pin-number" style="
                position: absolute;
                top: -10px;
                left: -10px;
                width: 20px;
                height: 20px;
                background: #ef4444;
                border: 2px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: bold;
                color: white;
                z-index: 1;
            ">${pinNumber}</div>
            <div class="delete-btn" title="Delete this callout" style="${this.getDeleteBtnStyles()}">×</div>
            <div class="template-btn" title="Change template" style="${this.getTemplateBtnStyles()}">⚡</div>
            <div class="editable-title" contenteditable="true" style="${this.getEditableTitleStyles()}">${title}</div>
            <div class="thumbs-selector" style="${this.getThumbsSelectorStyles()}">
                ${this.generateStars(rating)}
            </div>
            <div class="editable-body" contenteditable="true" style="${this.getEditableBodyStyles()}">${feedbackText}</div>
            <div class="edit-hint" style="${this.getEditHintStyles()}">💡 Click to edit • Drag to move</div>
        `;

        // Add callout to same container for consistent behavior between map and image modes
        this.container.appendChild(callout);
        console.log('📦 Appended callout to map container');

        // Create pinInfo object
        const pinInfo = {
            marker,
            callout,
            coords: [...coords],
            isDemo,
            manuallyPositioned: false,
            rating: rating,
            pinMarker: null
        };

        // Setup functionality
        this.setupThumbsRating(callout);
        this.setupDeleteButton(callout, pinInfo);
        this.setupTemplateButton(callout, pinInfo);
        this.setupSafeMaxLength(callout);

        // Position callout
        if (this.mode === 'map' && marker) {
            this.positionCallout(marker, callout);
        }

        // Animate in
        setTimeout(() => {
            callout.style.opacity = '0.95';
            callout.style.transform = 'scale(1) rotate(0deg)';
        }, 100);

        // Add to pinData array
        this.pinData.push(pinInfo);

        // Make callout draggable
        this.makeDraggable(callout, pinInfo);

        return pinInfo;
    }

    createImagePin(coords, feedbackText, title = "💬 Customer Feedback", rating = 4, isDemo = false) {
        // Increment pin counter and create numbered pin
        this.pinCounter++;
        const pinNumber = this.pinCounter;

        console.log(`📍 Creating image pin #${pinNumber}`);

        const callout = document.createElement('div');
        callout.className = 'floating-callout template-quotes';
        callout.setAttribute('data-template', 'quotes');
        callout.style.cssText = this.getCalloutStyles();

        callout.innerHTML = `
            <div class="pin-number" style="
                position: absolute;
                top: -10px;
                left: -10px;
                width: 20px;
                height: 20px;
                background: #ef4444;
                border: 2px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                font-weight: bold;
                color: white;
                z-index: 1;
            ">${pinNumber}</div>
            <div class="delete-btn" title="Delete this callout" style="${this.getDeleteBtnStyles()}">×</div>
            <div class="template-btn" title="Change template" style="${this.getTemplateBtnStyles()}">⚡</div>
            <div class="editable-title" contenteditable="true" style="${this.getEditableTitleStyles()}">${title}</div>
            <div class="thumbs-selector" style="${this.getThumbsSelectorStyles()}">
                ${this.generateStars(rating)}
            </div>
            <div class="editable-body" contenteditable="true" style="${this.getEditableBodyStyles()}">${feedbackText}</div>
            <div class="edit-hint" style="${this.getEditHintStyles()}">💡 Click to edit • Drag to move</div>
        `;

        // SIMPLE APPROACH: Both pin and callout in same container with same positioning method
        const containerRect = this.container.getBoundingClientRect();
        const x = (coords[0] / 100) * containerRect.width;
        const y = (coords[1] / 100) * containerRect.height;

        console.log('🎯 SIMPLE POSITIONING:');
        console.log('   Container size:', containerRect.width, containerRect.height);
        console.log('   Click %:', coords[0], coords[1]);
        console.log('   Pin position in container:', x, y);

        const pinMarker = document.createElement('div');
        pinMarker.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 24px;
            height: 24px;
            background: #ef4444;
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            z-index: 10000;
            pointer-events: none;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            color: white;
            font-family: Arial, sans-serif;
        `;
        pinMarker.textContent = pinNumber;
        this.container.appendChild(pinMarker);

        // Create callout in SAME container with SAME positioning method
        const calloutX = Math.min(x + 60, containerRect.width - 300); // Pin + offset, but stay in bounds
        const calloutY = Math.max(y - 80, 10); // Pin - offset, but stay in bounds

        console.log('   Callout position in container:', calloutX, calloutY);

        callout.style.position = 'absolute';
        callout.style.left = calloutX + 'px';
        callout.style.top = calloutY + 'px';
        callout.style.zIndex = '10001';
        callout.style.transform = 'none';

        // Add callout to same container as pin
        this.container.appendChild(callout);

        const pinInfo = {
            marker: null,
            callout,
            pinMarker,
            coords: [...coords],
            isDemo,
            manuallyPositioned: false,
            rating: rating
        };

        this.setupThumbsRating(callout);
        this.setupDeleteButton(callout, pinInfo);
        this.setupTemplateButton(callout, pinInfo);
        this.setupSafeMaxLength(callout);

        // Removed animation timeout - callout now positioned correctly from start

        this.pinData.push(pinInfo);
        this.makeDraggable(callout, pinInfo);

        return pinInfo;
    }

    // addDemoCallouts() method removed - users add callouts manually via pin mode

    // Styling methods
    getCalloutStyles() {
        return `
            position: absolute;
            background: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
            max-width: 280px;
            font-size: 13px;
            border-left: 4px solid #f59e0b;
            z-index: 10001;
            cursor: grab;
            opacity: 0.95;
            transform: none;
            font-family: 'Georgia', serif;
        `;
    }

    getDeleteBtnStyles() {
        return `
            position: absolute;
            top: -8px;
            right: -8px;
            width: 18px;
            height: 18px;
            background: #ef4444;
            color: white;
            border: 2px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 11px;
            font-weight: bold;
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 10002;
        `;
    }

    getTemplateBtnStyles() {
        return `
            position: absolute;
            top: -8px;
            right: 15px;
            width: 18px;
            height: 18px;
            background: #3b82f6;
            color: white;
            border: 2px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 9px;
            font-weight: bold;
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 10002;
        `;
    }

    getEditableTitleStyles() {
        return `
            font-weight: 600;
            margin-bottom: 8px;
            color: #1f2937;
            font-size: 14px;
            border: 1px solid transparent;
            padding: 2px 4px;
            border-radius: 3px;
            cursor: text;
            min-height: 18px;
            transition: all 0.2s ease;
        `;
    }

    getThumbsSelectorStyles() {
        return `
            margin-bottom: 8px;
            display: flex;
            gap: 3px;
        `;
    }

    getEditableBodyStyles() {
        return `
            border: 1px solid transparent;
            padding: 4px;
            border-radius: 3px;
            cursor: text;
            min-height: 40px;
            line-height: 1.4;
            transition: all 0.2s ease;
        `;
    }

    getEditHintStyles() {
        return `
            font-size: 10px;
            color: #9ca3af;
            margin-top: 4px;
            opacity: 0;
            transition: opacity 0.2s;
        `;
    }

    getLineStyles() {
        return `
            position: absolute;
            height: 2px;
            background: linear-gradient(90deg, #3b82f6, rgba(59, 130, 246, 0.3), #3b82f6);
            z-index: 10000;
            pointer-events: none;
            animation: lineFlow 3s ease-in-out infinite;
        `;
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            const active = i <= rating ? 'active' : '';
            stars += `<span class="thumb ${active}" data-rating="${i}" style="
                font-size: 16px;
                cursor: pointer;
                color: ${i <= rating ? '#fbbf24' : '#d1d5db'};
                transition: all 0.3s ease;
                padding: 2px;
                user-select: none;
                text-shadow: ${i <= rating ? '0 0 8px rgba(251, 191, 36, 0.6)' : '1px 1px 1px rgba(0,0,0,0.1)'};
            ">★</span>`;
        }
        return stars;
    }

    // Event handlers and utility methods would continue here...
    setupThumbsRating(callout) {
        const thumbs = callout.querySelectorAll('.thumb');
        thumbs.forEach((thumb) => {
            thumb.addEventListener('click', (e) => {
                e.stopPropagation();
                const clickedRating = parseInt(thumb.getAttribute('data-rating'));

                thumbs.forEach((t) => {
                    const thumbRating = parseInt(t.getAttribute('data-rating'));
                    if (thumbRating <= clickedRating) {
                        t.classList.add('active');
                        t.style.color = '#fbbf24';
                        t.style.textShadow = '0 0 8px rgba(251, 191, 36, 0.6)';
                    } else {
                        t.classList.remove('active');
                        t.style.color = '#d1d5db';
                        t.style.textShadow = '1px 1px 1px rgba(0,0,0,0.1)';
                    }
                });
            });
        });
    }

    setupDeleteButton(callout, pinInfo) {
        const deleteBtn = callout.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            callout.style.transform = 'scale(0.8) rotate(10deg)';
            callout.style.opacity = '0';

            const index = this.pinData.indexOf(pinInfo);
            if (index > -1) {
                this.pinData.splice(index, 1);
            }

            setTimeout(() => {
                if (pinInfo.marker) pinInfo.marker.remove();
                if (pinInfo.pinMarker) pinInfo.pinMarker.remove();
                callout.remove();

                // Renumber remaining pins after deletion
                this.renumberPins();
                console.log('🗑️ Pin deleted, remaining pins renumbered');
            }, 300);
        });

        // Show/hide buttons on hover
        callout.addEventListener('mouseenter', () => {
            deleteBtn.style.opacity = '1';
            callout.querySelector('.template-btn').style.opacity = '1';
        });

        callout.addEventListener('mouseleave', () => {
            deleteBtn.style.opacity = '0';
            callout.querySelector('.template-btn').style.opacity = '0';
        });
    }

    setupTemplateButton(callout, pinInfo) {
        const templateBtn = callout.querySelector('.template-btn');

        const templates = [
            {
                name: 'quotes',
                class: 'template-quotes',
                borderColor: '#f59e0b',
                fontFamily: 'Georgia, serif',
                title: '"This product changed everything for our business"',
                content: '<div style="font-weight: 700; margin-top: 8px; color: #f59e0b; font-size: 13px;">— Sarah Johnson</div><div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">CEO, TechStart Inc.</div><div style="font-size: 11px; color: #9ca3af;">📍 Manchester</div>',
                showStars: true
            },
            {
                name: 'statistics',
                class: 'template-statistics',
                borderColor: '#3b82f6',
                fontFamily: 'Arial, sans-serif',
                title: '85%',
                content: '<div style="font-size: 13px; color: #4b5563; margin-bottom: 8px; line-height: 1.4;">of customers report <strong>increased productivity</strong> within first month</div><div style="font-size: 10px; color: #9ca3af; font-style: italic;">Survey of 2,500+ users • March 2024</div>',
                showStars: false
            },
            {
                name: 'charts',
                class: 'template-charts',
                borderColor: '#10b981',
                fontFamily: 'Arial, sans-serif',
                title: 'Performance Growth',
                content: '<div style="display: flex; align-items: end; gap: 8px; height: 60px; margin-bottom: 12px; justify-content: center; background: #f8fafc; border-radius: 6px; padding: 10px;"><div style="width: 20px; background: #10b981; border-radius: 3px 3px 0 0; height: 30%;"></div><div style="width: 20px; background: #3b82f6; border-radius: 3px 3px 0 0; height: 50%;"></div><div style="width: 20px; background: #f59e0b; border-radius: 3px 3px 0 0; height: 80%;"></div></div><div style="font-size: 10px; color: #9ca3af; font-style: italic; text-align: center;">Q1-Q3 Performance Data</div>',
                showStars: false
            },
            {
                name: 'social',
                class: 'template-social',
                borderColor: '#8b5cf6',
                fontFamily: 'Arial, sans-serif',
                title: '@techinfluencer',
                content: '<div style="display: inline-block; background: #8b5cf6; color: white; padding: 3px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; margin-bottom: 8px;">LinkedIn</div><div style="font-size: 12px; color: #4b5563; line-height: 1.4; margin-bottom: 8px;">"Just tried this amazing tool - game changer for productivity! 🚀 #TechReview"</div><div style="font-size: 10px; color: #6b7280; display: flex; gap: 8px;">❤️ 234 • 🔄 45 • 💬 12</div>',
                showStars: false
            }
        ];

        let currentTemplateIndex = 0;

        templateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();

            // Cycle to next template
            currentTemplateIndex = (currentTemplateIndex + 1) % templates.length;
            const newTemplate = templates[currentTemplateIndex];

            console.log('🎨 Switching to template:', newTemplate.name);

            // Remove old template classes
            templates.forEach(t => callout.classList.remove(t.class));

            // Add new template class and update styling
            callout.classList.add(newTemplate.class);
            callout.setAttribute('data-template', newTemplate.name);
            callout.style.borderLeftColor = newTemplate.borderColor;
            callout.style.fontFamily = newTemplate.fontFamily;

            // Update content
            const title = callout.querySelector('.editable-title');
            const body = callout.querySelector('.editable-body');
            const thumbsSelector = callout.querySelector('.thumbs-selector');

            if (title) {
                title.textContent = newTemplate.title;
                if (newTemplate.name === 'statistics') {
                    title.style.fontSize = '32px';
                    title.style.fontWeight = '900';
                    title.style.color = '#3b82f6';
                    title.style.textAlign = 'center';
                } else {
                    title.style.fontSize = '14px';
                    title.style.fontWeight = '600';
                    title.style.color = '#1f2937';
                    title.style.textAlign = 'left';
                    if (newTemplate.name === 'quotes') {
                        title.style.fontStyle = 'italic';
                        title.style.fontWeight = '500';
                    }
                }
            }

            if (body) {
                body.innerHTML = newTemplate.content;
                if (newTemplate.name === 'statistics') {
                    body.style.textAlign = 'center';
                } else {
                    body.style.textAlign = 'left';
                }
            }

            if (thumbsSelector) {
                thumbsSelector.style.display = newTemplate.showStars ? 'flex' : 'none';
            }

            // Add template switch animation
            callout.style.transform = 'scale(0.95) rotate(5deg)';
            setTimeout(() => {
                callout.style.transform = 'scale(1) rotate(0deg)';
            }, 200);

            console.log('✅ Template switched successfully');
        });

        // Prevent template button from triggering drag
        templateBtn.addEventListener('mousedown', (e) => {
            e.stopPropagation();
        });
    }

    setupSafeMaxLength(callout) {
        const editableTitle = callout.querySelector('.editable-title');
        const editableBody = callout.querySelector('.editable-body');

        if (editableTitle) {
            editableTitle.addEventListener('input', function() {
                const text = this.innerText || '';
                if (text.length > 100) {
                    this.innerText = text.substring(0, 100);
                }
            });
        }

        if (editableBody) {
            editableBody.addEventListener('input', function() {
                const text = this.innerText || '';
                if (text.length > 400) {
                    this.innerText = text.substring(0, 400);
                }
            });
        }
    }

    positionCallout(marker, callout) {
        const markerEl = marker.getElement();
        const markerRect = markerEl.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();

        // Calculate position relative to container
        let left = markerRect.left - containerRect.left + 50;
        let top = markerRect.top - containerRect.top - 60;

        // Keep callout within container bounds
        const maxX = this.container.clientWidth - 300; // callout width
        const maxY = this.container.clientHeight - 150; // callout height

        left = Math.max(10, Math.min(left, maxX));
        top = Math.max(10, Math.min(top, maxY));

        // Adjust position if it would be off-screen
        if (left + 300 > this.container.clientWidth) left = (markerRect.left - containerRect.left) - 320;
        if (left < 0) left = 10;

        callout.style.position = 'absolute';
        callout.style.left = left + 'px';
        callout.style.top = top + 'px';

        console.log('📍 Positioned map callout at:', left, top);
    }

    drawLine(pinInfo) {
        const { marker, callout, line } = pinInfo;
        if (!marker) return;

        const markerEl = marker.getElement();
        const markerRect = markerEl.getBoundingClientRect();
        const calloutRect = callout.getBoundingClientRect();

        const x1 = markerRect.left + markerRect.width / 2;
        const y1 = markerRect.top + markerRect.height / 2;
        const x2 = calloutRect.left;
        const y2 = calloutRect.top + calloutRect.height / 2;

        const length = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
        const angle = Math.atan2(y2-y1, x2-x1) * 180 / Math.PI;

        line.style.left = x1 + 'px';
        line.style.top = y1 + 'px';
        line.style.width = length + 'px';
        line.style.transform = `rotate(${angle}deg)`;
        line.style.transformOrigin = '0 50%';
    }

    drawImageLine(pinInfo) {
        const { callout, line, pinMarker } = pinInfo;

        // Get the parent that contains the line to determine coordinate system
        const lineParent = line.parentElement;
        const lineParentRect = lineParent ? lineParent.getBoundingClientRect() : { left: 0, top: 0 };

        const pinRect = pinMarker.getBoundingClientRect();
        const calloutRect = callout.getBoundingClientRect();

        console.log('🔗 Drawing line:');
        console.log('   Pin viewport pos:', pinRect.left, pinRect.top);
        console.log('   Callout viewport pos:', calloutRect.left, calloutRect.top);
        console.log('   Line parent pos:', lineParentRect.left, lineParentRect.top);

        // Calculate connection points relative to line parent
        // Pin: center of the pin
        const x1 = pinRect.left + pinRect.width / 2 - lineParentRect.left;
        const y1 = pinRect.top + pinRect.height / 2 - lineParentRect.top;

        // Callout: closest edge to pin (left edge if callout is to the right of pin)
        const calloutCenterX = calloutRect.left + calloutRect.width / 2 - lineParentRect.left;
        const calloutCenterY = calloutRect.top + calloutRect.height / 2 - lineParentRect.top;

        // Choose connection point based on relative position
        let x2, y2;
        if (calloutCenterX > x1) {
            // Callout is to the right of pin - connect to left edge
            x2 = calloutRect.left - lineParentRect.left;
            y2 = calloutRect.top + calloutRect.height / 2 - lineParentRect.top;
        } else {
            // Callout is to the left of pin - connect to right edge
            x2 = calloutRect.right - lineParentRect.left;
            y2 = calloutRect.top + calloutRect.height / 2 - lineParentRect.top;
        }

        const length = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
        const angle = Math.atan2(y2-y1, x2-x1) * 180 / Math.PI;

        console.log('   Pin center: (' + x1 + ',' + y1 + ')');
        console.log('   Callout connection point: (' + x2 + ',' + y2 + ')');
        console.log('   Connection side:', calloutCenterX > x1 ? 'left edge' : 'right edge');
        console.log('   Line: length=' + length + ', angle=' + angle);

        line.style.position = 'absolute';
        line.style.left = x1 + 'px';
        line.style.top = y1 + 'px';
        line.style.width = length + 'px';
        line.style.height = '2px';
        line.style.backgroundColor = '#3b82f6';
        line.style.opacity = '0.8';
        line.style.transform = `rotate(${angle}deg)`;
        line.style.transformOrigin = '0 50%';
        line.style.zIndex = '9999';

        console.log('   Line styled at:', line.style.left, line.style.top, 'width:', line.style.width);

        // Debug line visibility
        setTimeout(() => {
            const lineRect = line.getBoundingClientRect();
            const computedStyle = getComputedStyle(line);
            console.log('🔍 Line visibility check:');
            console.log('   Line rect:', lineRect.left, lineRect.top, lineRect.width, lineRect.height);
            console.log('   Display:', computedStyle.display, 'Visibility:', computedStyle.visibility);
            console.log('   Background:', computedStyle.backgroundColor, 'Opacity:', computedStyle.opacity);
            console.log('   Z-index:', computedStyle.zIndex, 'Position:', computedStyle.position);

            // Make line VERY visible for testing
            line.style.border = '2px solid red';
            line.style.backgroundColor = 'red';
            line.style.height = '10px';
            console.log('🔴 Made line RED and thick for visibility test');
        }, 100);
    }

    updateAllLines() {
        this.pinData.forEach(pinInfo => {
            if (!pinInfo.manuallyPositioned && pinInfo.marker) {
                this.positionCallout(pinInfo.marker, pinInfo.callout);
            }
        });
    }

    makeDraggable(callout, pinInfo) {
        let isDragging = false;
        let startX, startY;

        callout.addEventListener('mousedown', (e) => {
            // Skip dragging for interactive elements
            if (e.target.contentEditable === 'true' ||
                e.target.classList.contains('thumb') ||
                e.target.closest('.thumbs-selector') ||
                e.target.closest('.delete-btn') ||
                e.target.closest('.template-btn')) {
                return;
            }

            isDragging = true;

            // Get mouse offset within the callout
            const calloutRect = callout.getBoundingClientRect();
            startX = e.clientX - calloutRect.left;
            startY = e.clientY - calloutRect.top;

            e.preventDefault();
            e.stopPropagation();

            // Add visual feedback
            callout.style.cursor = 'grabbing';
            callout.style.opacity = '0.8';
            callout.style.zIndex = '10002';

            console.log('🖱️ Started dragging - mouse offset:', startX, startY);
        });

        const mouseMoveHandler = (e) => {
            if (!isDragging) return;

            e.preventDefault();

            // Calculate new position relative to container
            const containerRect = this.container.getBoundingClientRect();

            // Position the callout so the mouse stays at the same relative position within it
            let newX = e.clientX - containerRect.left - startX;
            let newY = e.clientY - containerRect.top - startY;

            // Keep callout within container bounds
            const maxX = this.container.clientWidth - callout.offsetWidth;
            const maxY = this.container.clientHeight - callout.offsetHeight;

            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            // Update callout position
            callout.style.left = newX + 'px';
            callout.style.top = newY + 'px';

            pinInfo.manuallyPositioned = true;

            console.log('🖱️ Dragging to:', newX, newY);
        };

        document.addEventListener('mousemove', mouseMoveHandler);

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;

                // Reset visual feedback
                callout.style.cursor = 'grab';
                callout.style.opacity = '0.95';
                callout.style.zIndex = '10001';

                console.log('🖱️ Drag ended');
            }
        });
    }

    // Renumber all existing pins sequentially
    renumberPins() {
        this.pinData.forEach((pinInfo, index) => {
            const newNumber = index + 1;

            // Update pin marker number if it exists (for image mode)
            if (pinInfo.pinMarker) {
                pinInfo.pinMarker.textContent = newNumber;
            }

            // Update map marker number if it exists (for map mode)
            if (pinInfo.marker && this.mode === 'map') {
                const markerElement = pinInfo.marker.getElement();
                if (markerElement) {
                    markerElement.textContent = newNumber;
                }
            }

            // Update callout pin number if it exists
            const pinNumberElement = pinInfo.callout.querySelector('.pin-number');
            if (pinNumberElement) {
                pinNumberElement.textContent = newNumber;
            }
        });

        // Update counter to next number
        this.pinCounter = this.pinData.length;
        console.log(`🔢 Renumbered ${this.pinData.length} pins, counter set to ${this.pinCounter}`);
    }

    clearCustomPins() {
        this.pinData = this.pinData.filter(pinInfo => {
            if (!pinInfo.isDemo) {
                if (pinInfo.marker) pinInfo.marker.remove();
                if (pinInfo.pinMarker) pinInfo.pinMarker.remove();
                pinInfo.callout.remove();
                return false;
            }
            return true;
        });

        // Reset counter and renumber remaining pins
        this.pinCounter = 0;
        this.renumberPins();
        console.log('🧹 Cleared all custom pins, reset counter to start from 1');
    }

    // Hide all callouts (when slide is not active)
    hide() {
        this.pinData.forEach(pinInfo => {
            pinInfo.callout.style.display = 'none';
        });
    }

    // Show all callouts (when slide becomes active)
    show() {
        this.pinData.forEach(pinInfo => {
            pinInfo.callout.style.display = 'block';
        });
    }

    // Destroy the callout system and clean up
    destroy() {
        console.log('Destroying callout system for container:', this.containerId);

        // Remove all pins and callouts
        this.pinData.forEach(pinInfo => {
            if (pinInfo.marker) pinInfo.marker.remove();
            if (pinInfo.pinMarker) pinInfo.pinMarker.remove();
            pinInfo.callout.remove();
        });

        // Clear data
        this.pinData = [];

        // Remove map if it exists
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
    }
}

// Global callout system manager
window.calloutSystems = window.calloutSystems || {};

// Global function to initialize the callout system
window.initializeCalloutSystem = function(mode, containerId) {
    console.log(`🚀 ===== INITIALIZING CALLOUT SYSTEM =====`);
    console.log(`📋 Mode: ${mode}`);
    console.log(`📦 Container ID: ${containerId}`);
    console.log(`🔍 Container element:`, document.getElementById(containerId));

    // Clean up existing system for this container if it exists
    if (window.calloutSystems[containerId]) {
        window.calloutSystems[containerId].destroy();
        delete window.calloutSystems[containerId];
    }

    // Check if MapLibre is available for map mode
    if (mode === 'map' && typeof maplibregl === 'undefined') {
        console.error('MapLibre GL JS not loaded. Please include the MapLibre GL JS library.');

        // Load MapLibre GL JS dynamically
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js';
        script.onload = () => {
            // Also load CSS
            const link = document.createElement('link');
            link.href = 'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css';
            link.rel = 'stylesheet';
            document.head.appendChild(link);

            // Initialize after libraries are loaded
            setTimeout(() => {
                window.calloutSystems[containerId] = new SurveyCalloutSystem(mode, containerId);
            }, 100);
        };
        document.head.appendChild(script);
        return;
    }

    // Initialize directly if libraries are available
    window.calloutSystems[containerId] = new SurveyCalloutSystem(mode, containerId);
};

// Hide all callouts when switching slides
window.hideAllCallouts = function() {
    Object.values(window.calloutSystems || {}).forEach(system => {
        if (system && typeof system.hide === 'function') {
            system.hide();
        }
    });
};

// Show callouts for a specific slide
window.showCalloutsForSlide = function(slideIndex) {
    // Hide all first
    window.hideAllCallouts();

    // Show callouts for current slide if they exist
    const slideElement = document.querySelector(`.slide:nth-child(${slideIndex + 1})`);
    if (slideElement) {
        const calloutContainer = slideElement.querySelector('[id^="calloutContainer-"]');
        if (calloutContainer) {
            const containerId = calloutContainer.id;
            const system = window.calloutSystems[containerId];
            if (system && typeof system.show === 'function') {
                system.show();
            }
        }
    }
};