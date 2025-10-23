// Advanced Mockup Processing with Transparent Area Detection and Perspective Transformation
// Extracted and adapted from mockups/app.js

// Global debug mode flag
let debugMode = false;

// Detect transparent area in mockup image and return corner coordinates
function detectTransparentArea(img) {
    console.log('🔍 Starting transparent area detection...');

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(img, 0, 0);

    const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
    const data = imageData.data;

    let pixels = [];

    // Find all transparent pixels (alpha = 0)
    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
            const index = (y * img.width + x) * 4;
            if (data[index + 3] === 0) {
                pixels.push({ x, y });
            }
        }
    }

    if (pixels.length === 0) {
        console.log("❌ No transparent region detected.");
        return null;
    }

    // Find the four corners of the transparent region
    const topLeft = pixels.reduce((p, c) => (c.x + c.y < p.x + p.y ? c : p));
    const topRight = pixels.reduce((p, c) => (c.x - c.y > p.x - p.y ? c : p));
    const bottomLeft = pixels.reduce((p, c) => (c.y - c.x > p.y - p.x ? c : p));
    const bottomRight = pixels.reduce((p, c) => (c.x + c.y > p.x + p.y ? c : p));

    // Calculate tilt angle for debugging
    const bottomDeltaX = bottomRight.x - bottomLeft.x;
    const bottomDeltaY = bottomRight.y - bottomLeft.y;
    const bottomAngleRad = Math.atan2(bottomDeltaY, bottomDeltaX);
    const bottomAngleDeg = bottomAngleRad * 180 / Math.PI;
    let tiltAngle = Math.abs(bottomAngleDeg);
    if (tiltAngle > 90) tiltAngle = 180 - tiltAngle;

    console.log("=== TRANSPARENCY DETECTION ===");
    console.log("Total transparent pixels:", pixels.length);
    console.log("Corners:", { topLeft, topRight, bottomRight, bottomLeft });
    console.log("Calculated tilt angle:", tiltAngle.toFixed(2) + "°");
    console.log("==============================");

    return { topLeft, topRight, bottomRight, bottomLeft };
}

// Enhanced mockup drawing with perspective transformation
function drawAdvancedMockup(mockupImage, contentImage, canvas, detectedCorners, containerId) {
    console.log('🎨 Drawing advanced mockup with perspective transformation');

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (contentImage && detectedCorners && window.cv && cv.Mat) {
        console.log('🔮 Applying perspective transformation with OpenCV');
        console.log('📐 Detected corners for transformation:', detectedCorners);
        console.log('🖼️ Content image dimensions:', contentImage.width, 'x', contentImage.height);

        try {
            // Create temporary canvas for content processing
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = contentImage.width;
            tempCanvas.height = contentImage.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(contentImage, 0, 0);

            // Convert to OpenCV Mat
            const src = cv.imread(tempCanvas);
            const dst = new cv.Mat();

            // Define source points (content image corners)
            const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
                0, 0,
                contentImage.width, 0,
                contentImage.width, contentImage.height,
                0, contentImage.height
            ]);

            // Define destination points (detected transparent area corners)
            const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
                detectedCorners.topLeft.x, detectedCorners.topLeft.y,
                detectedCorners.topRight.x, detectedCorners.topRight.y,
                detectedCorners.bottomRight.x, detectedCorners.bottomRight.y,
                detectedCorners.bottomLeft.x, detectedCorners.bottomLeft.y
            ]);

            // Calculate perspective transformation matrix
            const M = cv.getPerspectiveTransform(srcTri, dstTri);

            // Apply perspective transformation
            cv.warpPerspective(
                src,
                dst,
                M,
                new cv.Size(mockupImage.width, mockupImage.height),
                cv.INTER_AREA,
                cv.BORDER_CONSTANT,
                new cv.Scalar(0, 0, 0, 0)
            );

            // Convert back to canvas
            const resultCanvas = document.createElement('canvas');
            resultCanvas.width = mockupImage.width;
            resultCanvas.height = mockupImage.height;
            cv.imshow(resultCanvas, dst);

            // Draw the transformed content
            ctx.drawImage(resultCanvas, 0, 0);

            // Clean up OpenCV objects
            src.delete();
            dst.delete();
            srcTri.delete();
            dstTri.delete();
            M.delete();

            console.log('✅ Perspective transformation applied successfully');

        } catch (error) {
            console.error('❌ OpenCV transformation failed:', error);
            // Fallback to simple overlay
            drawSimpleContentOverlay(ctx, contentImage, detectedCorners);
        }
    } else if (contentImage && detectedCorners) {
        console.log('📐 OpenCV not available, using simple overlay');
        drawSimpleContentOverlay(ctx, contentImage, detectedCorners);
    }

    // Draw mockup frame on top
    ctx.drawImage(mockupImage, 0, 0);
    console.log('✅ Mockup frame drawn on top');

    // Draw placeholder overlay if no content
    if (!contentImage && detectedCorners) {
        drawPlaceholderOverlay(ctx, detectedCorners);
    }

    // Draw debug information if enabled
    if (debugMode && detectedCorners) {
        drawDebugOverlay(ctx, detectedCorners);
    }
}

// Simple content overlay as fallback with angle compensation
function drawSimpleContentOverlay(ctx, contentImage, detectedCorners) {
    console.log('📐 Using simple overlay with angle compensation');

    const centerX = (detectedCorners.topLeft.x + detectedCorners.topRight.x +
                    detectedCorners.bottomLeft.x + detectedCorners.bottomRight.x) / 4;
    const centerY = (detectedCorners.topLeft.y + detectedCorners.topRight.y +
                    detectedCorners.bottomLeft.y + detectedCorners.bottomRight.y) / 4;

    // Calculate rotation angle from bottom edge
    const bl = detectedCorners.bottomLeft;
    const br = detectedCorners.bottomRight;
    const bottomDeltaX = br.x - bl.x;
    const bottomDeltaY = br.y - bl.y;
    const rotationAngle = Math.atan2(bottomDeltaY, bottomDeltaX);

    console.log(`🔄 Applying rotation angle: ${(rotationAngle * 180 / Math.PI).toFixed(2)}°`);

    // Calculate area dimensions
    const width = Math.sqrt(Math.pow(bottomDeltaX, 2) + Math.pow(bottomDeltaY, 2));
    const height = Math.sqrt(Math.pow(detectedCorners.topLeft.x - detectedCorners.bottomLeft.x, 2) +
                            Math.pow(detectedCorners.topLeft.y - detectedCorners.bottomLeft.y, 2));

    // Scale content to fit the detected area
    const scaleX = width / contentImage.width;
    const scaleY = height / contentImage.height;
    const scale = Math.min(scaleX, scaleY) * 0.9; // Slightly smaller to fit within bounds

    const scaledWidth = contentImage.width * scale;
    const scaledHeight = contentImage.height * scale;

    // Apply rotation and draw
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotationAngle);

    const x = -scaledWidth / 2;
    const y = -scaledHeight / 2;

    ctx.drawImage(contentImage, x, y, scaledWidth, scaledHeight);
    ctx.restore();

    console.log(`✅ Content fitted with rotation at ${centerX}, ${centerY}`);
}

// Draw placeholder overlay when no content is selected
function drawPlaceholderOverlay(ctx, detectedCorners) {
    console.log('🎯 Drawing placeholder overlay');
    ctx.save();

    // Calculate dimensions and center
    const width = detectedCorners.topRight.x - detectedCorners.topLeft.x;
    const height = detectedCorners.bottomLeft.y - detectedCorners.topLeft.y;

    const centerX = (detectedCorners.topLeft.x + detectedCorners.topRight.x +
                    detectedCorners.bottomLeft.x + detectedCorners.bottomRight.x) / 4;
    const centerY = (detectedCorners.topLeft.y + detectedCorners.topRight.y +
                    detectedCorners.bottomLeft.y + detectedCorners.bottomRight.y) / 4;

    // Calculate tilt angle
    const bl = detectedCorners.bottomLeft;
    const br = detectedCorners.bottomRight;
    const bottomDeltaX = br.x - bl.x;
    const bottomDeltaY = br.y - bl.y;
    const bottomAngleRad = Math.atan2(bottomDeltaY, bottomDeltaX);
    const bottomAngleDeg = bottomAngleRad * 180 / Math.PI;
    let tiltAngle = Math.abs(bottomAngleDeg);
    if (tiltAngle > 90) tiltAngle = 180 - tiltAngle;

    // Fill transparent region with semi-transparent overlay
    ctx.fillStyle = 'rgba(102, 126, 234, 0.15)';
    ctx.beginPath();
    ctx.moveTo(detectedCorners.topLeft.x, detectedCorners.topLeft.y);
    ctx.lineTo(detectedCorners.topRight.x, detectedCorners.topRight.y);
    ctx.lineTo(detectedCorners.bottomRight.x, detectedCorners.bottomRight.y);
    ctx.lineTo(detectedCorners.bottomLeft.x, detectedCorners.bottomLeft.y);
    ctx.closePath();
    ctx.fill();

    // Draw dashed border
    ctx.setLineDash([15, 10]);
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(detectedCorners.topLeft.x, detectedCorners.topLeft.y);
    ctx.lineTo(detectedCorners.topRight.x, detectedCorners.topRight.y);
    ctx.lineTo(detectedCorners.bottomRight.x, detectedCorners.bottomRight.y);
    ctx.lineTo(detectedCorners.bottomLeft.x, detectedCorners.bottomLeft.y);
    ctx.closePath();
    ctx.stroke();

    // Calculate font sizes
    const fontSize = Math.max(Math.min(width / 12, height / 6, 60), 20);
    const dimFontSize = Math.max(fontSize * 0.5, 14);
    const instructFontSize = Math.max(dimFontSize * 0.75, 12);

    // Rotate text to match tilt angle
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(bottomAngleRad);

    // Draw text with shadow
    ctx.setLineDash([]);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('INSERT YOUR STRATEGY HERE', 0, -fontSize * 0.7);

    ctx.font = `600 ${dimFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
    ctx.fillStyle = '#ffffff';
    const dimensionText = `${Math.round(width)} × ${Math.round(height)} pixels`;
    ctx.fillText(dimensionText, 0, fontSize * 0.1);

    if (Math.abs(tiltAngle) > 0.5) {
        const tiltFontSize = Math.max(dimFontSize * 0.8, 12);
        ctx.font = `500 ${tiltFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`(tilted ${tiltAngle.toFixed(1)}°)`, 0, fontSize * 0.7);
    }

    ctx.shadowBlur = 10;
    ctx.font = `500 ${instructFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Click or paste (Ctrl+V) to add content', 0, fontSize * 1.3);

    ctx.restore();
    ctx.restore();
}

// Draw debug overlay showing detected corners and information
function drawDebugOverlay(ctx, detectedCorners) {
    console.log('🔧 Drawing debug overlay');
    ctx.save();

    // Draw corner points
    ctx.fillStyle = '#ff0000';
    const cornerRadius = 8;

    [detectedCorners.topLeft, detectedCorners.topRight,
     detectedCorners.bottomRight, detectedCorners.bottomLeft].forEach((corner, index) => {
        ctx.beginPath();
        ctx.arc(corner.x, corner.y, cornerRadius, 0, 2 * Math.PI);
        ctx.fill();

        // Label corners
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(['TL', 'TR', 'BR', 'BL'][index], corner.x + 12, corner.y - 12);
        ctx.fillStyle = '#ff0000';
    });

    // Draw detection lines
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(detectedCorners.topLeft.x, detectedCorners.topLeft.y);
    ctx.lineTo(detectedCorners.topRight.x, detectedCorners.topRight.y);
    ctx.lineTo(detectedCorners.bottomRight.x, detectedCorners.bottomRight.y);
    ctx.lineTo(detectedCorners.bottomLeft.x, detectedCorners.bottomLeft.y);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
}

// Toggle debug mode
function toggleDebugMode(containerId) {
    debugMode = !debugMode;
    console.log('🔧 Debug mode toggled:', debugMode);

    // Update button text if it exists
    const debugBtn = document.getElementById(`debugBtn-${containerId}`);
    if (debugBtn) {
        debugBtn.textContent = debugMode ? '🔧 Debug: ON' : '🔧 Debug: OFF';
    }

    return debugMode;
}

// Initialize OpenCV when available
function initializeOpenCV() {
    return new Promise((resolve) => {
        if (window.cv && cv.Mat) {
            console.log('✅ OpenCV already loaded');
            resolve(true);
            return;
        }

        if (document.querySelector('script[src*="opencv.js"]')) {
            console.log('📦 OpenCV script already loading...');
            const checkCV = () => {
                if (window.cv && cv.Mat) {
                    console.log('✅ OpenCV loaded successfully');
                    resolve(true);
                } else {
                    setTimeout(checkCV, 100);
                }
            };
            checkCV();
            return;
        }

        console.log('📦 Loading OpenCV.js...');
        const script = document.createElement('script');
        script.src = 'https://docs.opencv.org/4.x/opencv.js';
        script.async = true;
        script.onload = () => {
            const checkCV = () => {
                if (window.cv && cv.Mat) {
                    console.log('✅ OpenCV loaded successfully');
                    resolve(true);
                } else {
                    setTimeout(checkCV, 100);
                }
            };
            checkCV();
        };
        script.onerror = () => {
            console.error('❌ Failed to load OpenCV.js');
            resolve(false);
        };
        document.head.appendChild(script);
    });
}

// Start AI processing animation with sparkles (30 seconds as requested)
function startAIProcessingAnimation(containerId, detectedCorners, callback) {
    console.log('🎭 Starting AI processing animation for 30 seconds...');

    const canvasContainer = document.getElementById(`canvasContainer-${containerId}`);
    if (!canvasContainer || !detectedCorners) {
        console.log('⚠️ Cannot start animation: missing container or corners');
        if (callback) callback();
        return;
    }

    // Create processing overlay
    let overlay = canvasContainer.querySelector('.processing-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'processing-overlay';
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 500;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        canvasContainer.appendChild(overlay);
    }

    // Show overlay
    overlay.classList.add('active');
    overlay.style.opacity = '1';

    // Create glow effect
    createProcessingGlow(overlay, detectedCorners);

    // Create sparkles at regular intervals
    const sparkleInterval = setInterval(() => {
        createConfinedSparkle(overlay, detectedCorners);
    }, 100); // Every 100ms for rich effect

    // Show AI status banner
    showAIStatusBanner(containerId, true);

    // Stop animation after 30 seconds (as requested)
    setTimeout(() => {
        console.log('🎭 AI processing animation complete');

        // Stop sparkles
        clearInterval(sparkleInterval);

        // Hide status banner
        showAIStatusBanner(containerId, false);

        // Fade out overlay
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.classList.remove('active');
            // Clean up sparkles and glow
            overlay.innerHTML = '';
        }, 300);

        // Execute callback (actually apply the content)
        if (callback) callback();
    }, 30000); // 30 seconds as requested
}

// Create sparkle confined to transparent region
function createConfinedSparkle(overlay, detectedCorners) {
    if (!overlay || !detectedCorners) return;

    // Get random point within the quadrilateral
    const point = getRandomPointInQuad(detectedCorners);

    // Array of sparkle symbols
    const symbols = ['✦', '✧', '✨', '⭐', '★', '◆', '◇', '●', '○', '◉', '⬟', '⬢', '⬡'];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

    // Random size
    const sizes = ['small', 'medium', 'large'];
    const weights = [0.5, 0.35, 0.15]; // More small, fewer large
    const randomSize = sizes[weightedRandom(weights)];

    const sparkle = document.createElement('div');
    sparkle.className = `sparkle ${randomSize}`;
    sparkle.textContent = randomSymbol;
    sparkle.style.cssText = `
        position: absolute;
        pointer-events: none;
        font-weight: bold;
        color: #667eea;
        text-shadow:
            0 0 10px rgba(102, 126, 234, 0.8),
            0 0 20px rgba(102, 126, 234, 0.5),
            0 0 30px rgba(102, 126, 234, 0.3);
        animation: sparkleFloat 1.5s ease-out forwards;
        left: ${point.x}px;
        top: ${point.y}px;
    `;

    // Set font size based on size class
    if (randomSize === 'small') sparkle.style.fontSize = '12px';
    else if (randomSize === 'medium') sparkle.style.fontSize = '16px';
    else sparkle.style.fontSize = '20px';

    // Random color variation
    const colors = ['#667eea', '#764ba2', '#5568d3', '#7c6ceb', '#8b7de8'];
    sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];

    overlay.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1500);
}

// Weighted random selection
function weightedRandom(weights) {
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < weights.length; i++) {
        if (random < weights[i]) return i;
        random -= weights[i];
    }
    return weights.length - 1;
}

// Get random point inside the quadrilateral (transparent region)
function getRandomPointInQuad(corners) {
    // Use bilinear interpolation to get point inside quad
    const s = Math.random();
    const t = Math.random();

    // Interpolate between corners
    const top = {
        x: corners.topLeft.x + s * (corners.topRight.x - corners.topLeft.x),
        y: corners.topLeft.y + s * (corners.topRight.y - corners.topLeft.y)
    };

    const bottom = {
        x: corners.bottomLeft.x + s * (corners.bottomRight.x - corners.bottomLeft.x),
        y: corners.bottomLeft.y + s * (corners.bottomRight.y - corners.bottomLeft.y)
    };

    return {
        x: top.x + t * (bottom.x - top.x),
        y: top.y + t * (bottom.y - top.y)
    };
}

// Create processing glow area
function createProcessingGlow(overlay, detectedCorners) {
    if (!detectedCorners) return;

    const glowArea = document.createElement('div');
    glowArea.className = 'processing-glow-area';

    // Calculate bounding box of the quad
    const minX = Math.min(detectedCorners.topLeft.x, detectedCorners.bottomLeft.x);
    const maxX = Math.max(detectedCorners.topRight.x, detectedCorners.bottomRight.x);
    const minY = Math.min(detectedCorners.topLeft.y, detectedCorners.topRight.y);
    const maxY = Math.max(detectedCorners.bottomLeft.y, detectedCorners.bottomRight.y);

    glowArea.style.cssText = `
        position: absolute;
        background: radial-gradient(circle at center, rgba(102, 126, 234, 0.15) 0%, transparent 70%);
        pointer-events: none;
        animation: glowPulse 2s ease-in-out infinite;
        left: ${minX}px;
        top: ${minY}px;
        width: ${maxX - minX}px;
        height: ${maxY - minY}px;
    `;

    // Create clip path for the exact quad shape
    const clipPath = `polygon(
        ${detectedCorners.topLeft.x - minX}px ${detectedCorners.topLeft.y - minY}px,
        ${detectedCorners.topRight.x - minX}px ${detectedCorners.topRight.y - minY}px,
        ${detectedCorners.bottomRight.x - minX}px ${detectedCorners.bottomRight.y - minY}px,
        ${detectedCorners.bottomLeft.x - minX}px ${detectedCorners.bottomLeft.y - minY}px
    )`;
    glowArea.style.clipPath = clipPath;

    overlay.appendChild(glowArea);
}

// Show/hide AI status banner
function showAIStatusBanner(containerId, show) {
    const canvasContainer = document.getElementById(`canvasContainer-${containerId}`);
    if (!canvasContainer) return;

    let banner = canvasContainer.querySelector('.ai-status-banner');

    if (show && !banner) {
        banner = document.createElement('div');
        banner.className = 'ai-status-banner';
        banner.style.cssText = `
            position: absolute;
            top: -60px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
            display: flex;
            align-items: center;
            gap: 12px;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
        `;

        banner.innerHTML = `
            <span>🤖 AI Processing Your Content</span>
            <div class="ai-progress-dots">
                <span style="width: 6px; height: 6px; background: white; border-radius: 50%; animation: dotBounce 1.4s ease-in-out infinite;"></span>
                <span style="width: 6px; height: 6px; background: white; border-radius: 50%; animation: dotBounce 1.4s ease-in-out infinite; animation-delay: 0.2s;"></span>
                <span style="width: 6px; height: 6px; background: white; border-radius: 50%; animation: dotBounce 1.4s ease-in-out infinite; animation-delay: 0.4s;"></span>
            </div>
        `;

        canvasContainer.appendChild(banner);
        setTimeout(() => banner.style.opacity = '1', 100);
    } else if (!show && banner) {
        banner.style.opacity = '0';
        setTimeout(() => banner.remove(), 300);
    }
}

// Export functions to global scope
window.detectTransparentArea = detectTransparentArea;
window.drawAdvancedMockup = drawAdvancedMockup;
window.toggleMockupDebugMode = toggleDebugMode;
window.initializeOpenCV = initializeOpenCV;
window.startAIProcessingAnimation = startAIProcessingAnimation;