// Mockup Workspace System for Download Modal Integration
// Handles content selection, mockup navigation, and canvas rendering

// Global variables for mockup system
let selectedMockups = {}; // Keyed by containerId
let selectedContents = {}; // Keyed by containerId
let mockupImages = {}; // Keyed by containerId
let contentImages = {}; // Keyed by containerId
let detectedCorners = {}; // Keyed by containerId - stores transparent area corners

// Location images for fallback (same as in original app.js)
const LOCATION_IMAGES = {
    // Athletic & Fitness
    gymFitness: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    sportsStadium: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&h=300&fit=crop',
    runningTrack: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=300&fit=crop',
    sportsBar: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
    athleticStore: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=300&fit=crop',
    supplementStore: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop',
    outdoorPark: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    swimmingPool: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=300&fit=crop',
    boxingGym: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&h=300&fit=crop',
    yogaStudio: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=400&h=300&fit=crop',

    // Shopping & Retail
    groceryStore: 'https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=400&h=300&fit=crop',
    supermarket: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=400&h=300&fit=crop',
    departmentStore: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    clothingStore: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop',
    beautySalon: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop',

    // Professional & Business
    airport: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop',
    trainStation: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=400&h=300&fit=crop',
    officeBuilding: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
    coffeeShop: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=300&fit=crop',

    // Default fallback
    default: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop'
};

// Main initialization function called from download-modal.js
function initializeMockupSlide(containerId, modalInstance) {
    console.log(`🎨 Initializing mockup slide: ${containerId}`);

    // Debug: Check if elements exist
    const contentGrid = document.getElementById(`contentGrid-${containerId}`);
    const mockupArea = document.getElementById(`mockupArea-${containerId}`);
    const canvas = document.getElementById(`resultCanvas-${containerId}`);

    console.log('🔍 DOM Elements Check:', {
        contentGrid: !!contentGrid,
        mockupArea: !!mockupArea,
        canvas: !!canvas,
        containerId: containerId
    });

    try {
        // 1. Initialize OpenCV for advanced processing
        initializeOpenCVForMockups();

        // 2. Populate content images (from table data like Survey Image slide)
        populateContentImages(containerId, modalInstance);

        // 3. Initialize mockup navigation
        initializeMockupNavigation(containerId);

        // 4. Auto-select first mockup
        autoSelectFirstMockup(containerId);

        console.log(`✅ Mockup slide initialized successfully: ${containerId}`);
    } catch (error) {
        console.error(`❌ Error initializing mockup slide: ${error.message}`);
        console.error('Error stack:', error.stack);
    }
}

// Populate content images panel (same logic as Survey Image slide)
function populateContentImages(containerId, modalInstance) {
    const contentGrid = document.getElementById(`contentGrid-${containerId}`);
    const uploadBtn = document.getElementById(`uploadBtn-${containerId}`);
    const contentInput = document.getElementById(`contentInput-${containerId}`);

    if (!contentGrid || !uploadBtn || !contentInput) {
        console.error('❌ Could not find content image elements:', {
            contentGrid: !!contentGrid,
            uploadBtn: !!uploadBtn,
            contentInput: !!contentInput,
            containerId: containerId
        });
        return;
    }

    // Extract images from table data (EXACT SAME as Survey Image slide)
    const images = [];
    if (modalInstance.tableData && modalInstance.tableData.rows) {
        modalInstance.tableData.rows.forEach((row, rowIndex) => {
            const imageCell = row.find(cell => cell.image);
            if (imageCell) {
                const rowKey = `row-${rowIndex}`;
                const croppedImage = window.croppedImages?.[rowKey];

                images.push({
                    src: croppedImage || imageCell.image,
                    name: `Row ${rowIndex + 1}`,
                    rowIndex: rowIndex,
                    isCropped: !!croppedImage
                });
            }
        });
    }

    console.log(`📸 Found ${images.length} content images from table data`);

    // Render content image thumbnails
    contentGrid.innerHTML = '';
    images.forEach((img, index) => {
        const imageCard = document.createElement('div');
        imageCard.className = 'content-image-card';
        imageCard.innerHTML = `
            <img src="${img.src}" alt="${img.name}" style="width: 100%; height: 100%; object-fit: cover;">
            <div class="image-label">${img.name}</div>
            ${img.isCropped ? '<i class="bi bi-scissors crop-indicator"></i>' : ''}
        `;

        imageCard.addEventListener('click', () => {
            selectContentImage(img, containerId);
        });

        contentGrid.appendChild(imageCard);
    });

    // Upload button functionality
    uploadBtn.addEventListener('click', () => {
        contentInput.click();
    });

    contentInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const uploadedImage = {
                    src: e.target.result,
                    name: 'Uploaded Image',
                    isUploaded: true
                };
                selectContentImage(uploadedImage, containerId);
            };
            reader.readAsDataURL(file);
        }
    });

    // Setup download, reset, and debug buttons
    const downloadBtn = document.getElementById(`downloadBtn-${containerId}`);
    const resetBtn = document.getElementById(`resetBtn-${containerId}`);
    const debugBtn = document.getElementById(`debugBtn-${containerId}`);

    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            downloadMockup(containerId);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetMockupCanvas(containerId);
        });
    }

    if (debugBtn) {
        debugBtn.addEventListener('click', () => {
            toggleDebugModeForContainer(containerId);
        });
    }
}

// Initialize mockup navigation system
function initializeMockupNavigation(containerId) {
    let currentView = 'audiences'; // 'audiences' → 'locations' → 'mockups'
    let selectedAudience = null;
    let selectedLocation = null;

    const selectionArea = document.getElementById(`mockupArea-${containerId}`);
    const backBtn = document.getElementById(`backBtn-${containerId}`);

    if (!selectionArea || !backBtn) {
        console.error('❌ Could not find mockup navigation elements:', {
            selectionArea: !!selectionArea,
            backBtn: !!backBtn,
            containerId: containerId
        });
        return;
    }

    // Initialize with audience list
    showAudienceList();

    // Back button handler
    backBtn.addEventListener('click', () => {
        if (currentView === 'locations') {
            showAudienceList();
        } else if (currentView === 'mockups') {
            showLocationList(selectedAudience);
        }
    });

    function showAudienceList() {
        currentView = 'audiences';
        selectedAudience = null;
        updateBreadcrumb('audience');
        backBtn.style.display = 'none';

        selectionArea.innerHTML = `
            <div class="audience-grid">
                ${Object.entries(MOCKUP_CONFIG).map(([audienceId, audience]) => `
                    <div class="audience-option" data-audience="${audienceId}">
                        <div class="audience-icon">${audience.icon}</div>
                        <div class="audience-info">
                            <div class="audience-name">${audience.name}</div>
                            <div class="audience-desc">${audience.description}</div>
                            <div class="audience-stats">
                                ${Object.keys(audience.locations).length} locations available
                            </div>
                        </div>
                        <div class="audience-arrow">→</div>
                    </div>
                `).join('')}
            </div>
        `;

        // Add click handlers for audiences
        selectionArea.querySelectorAll('.audience-option').forEach(option => {
            option.addEventListener('click', () => {
                const audienceId = option.dataset.audience;
                selectedAudience = audienceId;
                showLocationList(audienceId);
            });
        });
    }

    function showLocationList(audienceId) {
        currentView = 'locations';
        updateBreadcrumb('location');
        backBtn.style.display = 'block';

        const audience = MOCKUP_CONFIG[audienceId];

        selectionArea.innerHTML = `
            <div class="selected-audience-header">
                <span>${audience.icon} ${audience.name}</span>
            </div>
            <div class="location-grid">
                ${Object.entries(audience.locations).map(([locationId, location]) => `
                    <div class="location-option" data-location="${locationId}">
                        <div class="location-image">
                            <img src="${getLocationImage(locationId)}" alt="${location.name}">
                        </div>
                        <div class="location-info">
                            <div class="location-name">${location.name}</div>
                            <div class="location-mockups">
                                ${location.mockups.length} mockup${location.mockups.length !== 1 ? 's' : ''}
                                <div class="orientation-badges">
                                    ${location.mockups.some(m => m.orientation === 'portrait') ? '📱' : ''}
                                    ${location.mockups.some(m => m.orientation === 'landscape') ? '🖥️' : ''}
                                </div>
                            </div>
                        </div>
                        <div class="location-arrow">→</div>
                    </div>
                `).join('')}
            </div>
        `;

        // Add click handlers for locations
        selectionArea.querySelectorAll('.location-option').forEach(option => {
            option.addEventListener('click', () => {
                const locationId = option.dataset.location;
                selectedLocation = locationId;
                showMockupList(audienceId, locationId);
            });
        });
    }

    function showMockupList(audienceId, locationId) {
        currentView = 'mockups';
        updateBreadcrumb('mockup');

        const audience = MOCKUP_CONFIG[audienceId];
        const location = audience.locations[locationId];

        selectionArea.innerHTML = `
            <div class="selected-path-header">
                <span>${audience.icon} ${audience.name} → ${location.name}</span>
            </div>
            <div class="mockup-final-grid">
                ${location.mockups.map(mockup => `
                    <div class="mockup-final-option" data-mockup='${JSON.stringify(mockup)}'>
                        <div class="mockup-preview">
                            <img src="${mockup.image}" alt="${mockup.name}"
                                 onerror="this.src='${getLocationImage(locationId)}'">
                            <div class="orientation-badge ${mockup.orientation}">
                                ${mockup.orientation === 'portrait' ? '📱 Portrait' : '🖥️ Landscape'}
                            </div>
                        </div>
                        <div class="mockup-details">
                            <div class="mockup-name">${mockup.name}</div>
                            <div class="mockup-description">${mockup.description}</div>
                        </div>
                        <div class="select-indicator">Select</div>
                    </div>
                `).join('')}
            </div>
        `;

        // Add click handlers for final mockup selection
        selectionArea.querySelectorAll('.mockup-final-option').forEach(option => {
            option.addEventListener('click', () => {
                const mockupData = JSON.parse(option.dataset.mockup);
                selectMockupTemplate(mockupData, audience, location, containerId);

                // Visual selection feedback
                selectionArea.querySelectorAll('.mockup-final-option').forEach(opt =>
                    opt.classList.remove('selected'));
                option.classList.add('selected');
            });
        });
    }

    function updateBreadcrumb(step) {
        const audienceStep = document.getElementById(`audienceStep-${containerId}`);
        const locationStep = document.getElementById(`locationStep-${containerId}`);
        const mockupStep = document.getElementById(`mockupStep-${containerId}`);

        if (!audienceStep || !locationStep || !mockupStep) return;

        // Reset all steps
        [audienceStep, locationStep, mockupStep].forEach(s => {
            s.classList.remove('active', 'completed');
            s.style.display = 'none';
        });

        if (step === 'audience') {
            audienceStep.style.display = 'block';
            audienceStep.classList.add('active');
            audienceStep.textContent = '📍 Choose Audience';
        } else if (step === 'location') {
            audienceStep.style.display = 'block';
            locationStep.style.display = 'block';
            audienceStep.classList.add('completed');
            locationStep.classList.add('active');
            audienceStep.textContent = `${MOCKUP_CONFIG[selectedAudience].icon} ${MOCKUP_CONFIG[selectedAudience].name}`;
            locationStep.textContent = '🏢 Choose Location';
        } else if (step === 'mockup') {
            audienceStep.style.display = 'block';
            locationStep.style.display = 'block';
            mockupStep.style.display = 'block';
            audienceStep.classList.add('completed');
            locationStep.classList.add('completed');
            mockupStep.classList.add('active');
            locationStep.textContent = `🏢 ${MOCKUP_CONFIG[selectedAudience].locations[selectedLocation].name}`;
            mockupStep.textContent = '🎨 Choose Mockup';
        }
    }
}

// Auto-select first mockup when slide loads
function autoSelectFirstMockup(containerId) {
    try {
        // Get first audience
        const firstAudienceId = Object.keys(MOCKUP_CONFIG)[0];
        const firstAudience = MOCKUP_CONFIG[firstAudienceId];

        // Get first location
        const firstLocationId = Object.keys(firstAudience.locations)[0];
        const firstLocation = firstAudience.locations[firstLocationId];

        // Get first mockup
        const firstMockup = firstLocation.mockups[0];

        console.log(`🎯 Auto-selecting first mockup: ${firstAudience.name} → ${firstLocation.name} → ${firstMockup.name}`);

        // Set as selected and load immediately
        selectedMockups[containerId] = {
            mockup: firstMockup,
            audience: firstAudience,
            location: firstLocation
        };

        // Update canvas with mockup (no content yet)
        loadMockupToCanvas(firstMockup, null, containerId);

        // Update UI
        updateMockupInfo(firstAudience, firstLocation, firstMockup, containerId);

        // Enable download once mockup is loaded
        const downloadBtn = document.getElementById(`downloadBtn-${containerId}`);
        if (downloadBtn) {
            downloadBtn.disabled = false;
        }

    } catch (error) {
        console.error(`❌ Error auto-selecting first mockup: ${error.message}`);
    }
}

// Handle content image selection
function selectContentImage(image, containerId) {
    console.log(`📸 Content image selected: ${image.name}`);

    // Visual feedback - highlight selected image
    const contentGrid = document.getElementById(`contentGrid-${containerId}`);
    if (contentGrid) {
        contentGrid.querySelectorAll('.content-image-card').forEach(card =>
            card.classList.remove('selected'));

        // Find and highlight the clicked card
        const clickedCard = event.target.closest('.content-image-card');
        if (clickedCard) {
            clickedCard.classList.add('selected');
        }
    }

    // Store selected content
    selectedContents[containerId] = image;

    // Apply to current mockup
    const selectedMockup = selectedMockups[containerId];
    if (selectedMockup) {
        // Load image and apply to mockup
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            contentImages[containerId] = img;
            loadMockupToCanvas(selectedMockup.mockup, img, containerId);
            // Enable pin mode in SurveyCalloutSystem once content is applied
            const calloutContainerId = `calloutContainer-${containerId}`;
            const calloutSystem = window.calloutSystems?.[calloutContainerId];
            if (calloutSystem && calloutSystem.show) {
                calloutSystem.show();
            }
        };
        img.src = image.src;
    }
}

// Handle mockup template selection
function selectMockupTemplate(mockup, audience, location, containerId) {
    console.log(`🎨 Mockup template selected: ${audience.name} → ${location.name} → ${mockup.name}`);

    // Store selected mockup
    selectedMockups[containerId] = { mockup, audience, location };

    // Update UI
    updateMockupInfo(audience, location, mockup, containerId);

    // Apply current content (if any) to new mockup
    const selectedContent = selectedContents[containerId];
    const contentImg = contentImages[containerId];

    loadMockupToCanvas(mockup, contentImg, containerId);
}

// Load mockup to canvas with advanced processing
function loadMockupToCanvas(mockup, contentImage, containerId) {
    const canvas = document.getElementById(`resultCanvas-${containerId}`);
    const instructions = document.getElementById(`instructions-${containerId}`);

    if (!canvas) {
        console.error('❌ Canvas not found:', {
            canvasId: `resultCanvas-${containerId}`,
            containerId: containerId
        });
        return;
    }

    // Load mockup image
    const mockupImg = new Image();
    mockupImg.crossOrigin = 'anonymous';

    mockupImg.onload = () => {
        console.log(`🖼️ Mockup image loaded: ${mockup.name}`);

        // Set canvas size to mockup size
        canvas.width = mockupImg.width;
        canvas.height = mockupImg.height;

        // Store mockup image
        mockupImages[containerId] = mockupImg;

        // Detect transparent area in mockup
        if (window.detectTransparentArea) {
            console.log('🔍 Detecting transparent area...');
            const corners = detectTransparentArea(mockupImg);
            detectedCorners[containerId] = corners;

            if (corners) {
                const width = Math.round(corners.topRight.x - corners.topLeft.x);
                const height = Math.round(corners.bottomLeft.y - corners.topLeft.y);
                console.log(`✅ Transparent area detected: ${width}x${height}px`);

                // Update dimension display if available
                updateDimensionDisplay(width, height, containerId);
            } else {
                console.log('⚠️ No transparent area found, will use center placement');
            }
        } else {
            console.log('⚠️ Advanced detection not available, using fallback');
        }

        // Draw mockup with advanced processing and animation (only when content is being applied)
        if (window.drawAdvancedMockup && window.startAIProcessingAnimation && detectedCorners[containerId] && contentImage) {
            // First draw the mockup WITHOUT content to show the mockup image
            drawAdvancedMockup(mockupImg, null, canvas, detectedCorners[containerId], containerId);

            // Then start animation overlay and apply content after animation completes
            startAIProcessingAnimation(containerId, detectedCorners[containerId], () => {
                // Apply the content after animation completes
                drawAdvancedMockup(mockupImg, contentImage, canvas, detectedCorners[containerId], containerId);
            });
        } else if (window.drawAdvancedMockup) {
            // Advanced processing without animation (no content or fallback)
            drawAdvancedMockup(mockupImg, contentImage, canvas, detectedCorners[containerId], containerId);
        } else {
            // Fallback to simple drawing
            drawSimpleMockup(mockupImg, contentImage, canvas, containerId);
        }

        // Update instructions visibility
        if (instructions) {
            instructions.style.display = contentImage ? 'none' : 'block';
        }

        console.log(`✅ Mockup rendered: ${mockup.name}`);
    };

    mockupImg.onerror = () => {
        console.error(`❌ Failed to load mockup: ${mockup.image}`);
        drawPlaceholderMockup(canvas);
    };

    mockupImg.src = mockup.image;
}

// Initialize OpenCV for advanced mockup processing
function initializeOpenCVForMockups() {
    if (window.initializeOpenCV) {
        initializeOpenCV().then(success => {
            if (success) {
                console.log('✅ OpenCV initialized for mockup processing');
            } else {
                console.log('⚠️ OpenCV initialization failed, using fallback methods');
            }
        });
    } else {
        console.log('📦 OpenCV initialization function not available yet');
    }
}

// Simple fallback mockup drawing
function drawSimpleMockup(mockupImg, contentImage, canvas, containerId) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (contentImage) {
        // Simple content overlay in center
        const centerX = canvas.width * 0.3;
        const centerY = canvas.height * 0.3;
        const width = canvas.width * 0.4;
        const height = canvas.height * 0.4;

        ctx.drawImage(contentImage, centerX, centerY, width, height);
    }

    // Draw mockup frame on top
    ctx.drawImage(mockupImg, 0, 0);

    if (!contentImage) {
        // Draw placeholder
        const centerX = canvas.width * 0.3;
        const centerY = canvas.height * 0.3;
        const width = canvas.width * 0.4;
        const height = canvas.height * 0.4;

        ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 5]);

        ctx.fillRect(centerX, centerY, width, height);
        ctx.strokeRect(centerX, centerY, width, height);

        ctx.fillStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.setLineDash([]);
        ctx.fillText('Content Area', centerX + width/2, centerY + height/2);
    }
}

// Update dimension display
function updateDimensionDisplay(width, height, containerId) {
    const mockupInfo = document.getElementById(`mockupInfo-${containerId}`);
    if (mockupInfo) {
        const selectedMockup = selectedMockups[containerId];
        if (selectedMockup) {
            mockupInfo.textContent = `${selectedMockup.audience.icon} ${selectedMockup.audience.name} → ${selectedMockup.location.name} → ${selectedMockup.mockup.name} (${width}×${height}px)`;
        }
    }
}

// Draw placeholder mockup
function drawPlaceholderMockup(canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;

    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#999';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Mockup Loading...', canvas.width/2, canvas.height/2);
}

// Update mockup info display
function updateMockupInfo(audience, location, mockup, containerId) {
    const mockupInfo = document.getElementById(`mockupInfo-${containerId}`);
    if (mockupInfo) {
        mockupInfo.textContent = `${audience.icon} ${audience.name} → ${location.name} → ${mockup.name}`;
    }
}

// Download mockup function
function downloadMockup(containerId) {
    const canvas = document.getElementById(`resultCanvas-${containerId}`);
    const selectedMockup = selectedMockups[containerId];

    if (!canvas || !selectedMockup) {
        console.error('❌ Cannot download: Canvas or mockup not found');
        return;
    }

    try {
        // Create download link
        const link = document.createElement('a');
        link.download = `mockup_${selectedMockup.audience.name}_${selectedMockup.location.name}_${selectedMockup.mockup.name}.png`;
        link.href = canvas.toDataURL('image/png');

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log(`✅ Mockup downloaded: ${link.download}`);
    } catch (error) {
        console.error(`❌ Error downloading mockup: ${error.message}`);
    }
}

// Toggle debug mode for specific container
function toggleDebugModeForContainer(containerId) {
    if (window.toggleMockupDebugMode) {
        const newDebugState = toggleMockupDebugMode(containerId);

        // Re-render current mockup with new debug state
        const selectedMockup = selectedMockups[containerId];
        const contentImage = contentImages[containerId];

        if (selectedMockup) {
            const canvas = document.getElementById(`resultCanvas-${containerId}`);
            const mockupImg = mockupImages[containerId];

            if (canvas && mockupImg) {
                if (window.drawAdvancedMockup) {
                    drawAdvancedMockup(mockupImg, contentImage, canvas, detectedCorners[containerId], containerId);
                } else {
                    drawSimpleMockup(mockupImg, contentImage, canvas, containerId);
                }
            }
        }

        console.log(`🔧 Debug mode toggled for ${containerId}: ${newDebugState}`);
    }
}

// Reset mockup canvas function
function resetMockupCanvas(containerId) {
    // Clear selected content
    selectedContents[containerId] = null;
    contentImages[containerId] = null;

    // Clear visual selection
    const contentGrid = document.getElementById(`contentGrid-${containerId}`);
    if (contentGrid) {
        contentGrid.querySelectorAll('.content-image-card').forEach(card =>
            card.classList.remove('selected'));
    }

    // Reload current mockup without content
    const selectedMockup = selectedMockups[containerId];
    if (selectedMockup) {
        loadMockupToCanvas(selectedMockup.mockup, null, containerId);
    }

    // Disable pin mode in SurveyCalloutSystem when content is reset
    const calloutContainerId = `calloutContainer-${containerId}`;
    const calloutSystem = window.calloutSystems?.[calloutContainerId];
    if (calloutSystem) {
        if (calloutSystem.clearCustomPins) {
            calloutSystem.clearCustomPins();
        }
        if (calloutSystem.hide) {
            calloutSystem.hide();
        }
    }

    console.log(`🔄 Reset mockup canvas: ${containerId}`);
}

// Get location image with fallback
function getLocationImage(locationId) {
    return LOCATION_IMAGES[locationId] || LOCATION_IMAGES.default;
}


// Note: SurveyCalloutSystem is now initialized directly on the callout container
// in download-modal.js, following the same pattern as Survey Image slide


// Export functions to global scope
console.log('🔧 [TRACE] Exporting mockup functions to global scope...');
window.initializeMockupSlide = initializeMockupSlide;
console.log('✅ [TRACE] Functions exported:', {
    initializeMockupSlide: !!window.initializeMockupSlide
});