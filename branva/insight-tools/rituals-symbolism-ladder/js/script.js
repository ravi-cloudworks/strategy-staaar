// Rituals & Symbolism Ladder - Elements of Value Pyramid JavaScript
class RitualsSymbolismLadder {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        this.setupImageUpload();
        this.setupDragAndDrop();
        console.log('🔮 Rituals & Symbolism Ladder initialized - v2.0 (with priority event handling)');
    }

    setupImageUpload() {
        const containers = this.container.querySelectorAll('.insight-circle-container');

        containers.forEach(circleContainer => {
            const circle = circleContainer.querySelector('.insight-circle');
            const input = circleContainer.querySelector('input[type="file"]');
            const img = circle.querySelector('.uploaded-image');

            if (!circle || !input || !img) return;

            // Click to upload - using global flag system to prevent canvas conflicts
            circleContainer.addEventListener('click', (e) => {

                // Prevent re-triggering if already processing
                if (window.circleClickInProgress) {
                    return;
                }

                // Set global flag to prevent canvas handler and re-triggering
                window.circleClickInProgress = true;

                // IMMEDIATELY stop all event propagation
                e.stopImmediatePropagation();
                e.preventDefault();
                e.stopPropagation();

                // Open file dialog
                setTimeout(() => {
                    try {
                        input.click();
                    } catch (err) {
console.error('File dialog failed:', err);
                    }

                    // Clear flag after a short delay
                    setTimeout(() => {
                        window.circleClickInProgress = false;
                    }, 100);
                }, 0);
            }, { capture: true, passive: false });

            // Handle image selection
            input.addEventListener('change', e => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = evt => {
                    img.src = evt.target.result;
                    circle.classList.add('active');
                    circleContainer.classList.add('active');

                    // Trigger animation
                    this.triggerUploadAnimation(circleContainer);

                    console.log(`📸 Image uploaded for: ${circleContainer.dataset.name}`);
                };
                reader.readAsDataURL(file);
            });
        });
    }

    setupDragAndDrop() {
        const containers = this.container.querySelectorAll('.insight-circle-container');

        containers.forEach(circleContainer => {
            const circle = circleContainer.querySelector('.insight-circle');
            const img = circle.querySelector('.uploaded-image');

            // Drag over - high priority
            circleContainer.addEventListener('dragover', e => {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
                circleContainer.classList.add('dragging');
            }, { capture: true, passive: false });

            // Drag leave - high priority
            circleContainer.addEventListener('dragleave', e => {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
                circleContainer.classList.remove('dragging');
            }, { capture: true, passive: false });

            // Drop - high priority
            circleContainer.addEventListener('drop', e => {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
                circleContainer.classList.remove('dragging');

                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = evt => {
                        img.src = evt.target.result;
                        circle.classList.add('active');
                        circleContainer.classList.add('active');

                        // Trigger animation
                        this.triggerUploadAnimation(circleContainer);

                        console.log(`🎯 Image dropped for: ${circleContainer.dataset.name}`);
                    };
                    reader.readAsDataURL(file);
                }
            });
        });
    }

    triggerUploadAnimation(circleContainer) {
        // Add a temporary class for extra animation effect
        circleContainer.classList.add('just-uploaded');

        setTimeout(() => {
            circleContainer.classList.remove('just-uploaded');
        }, 1000);
    }

    // Get all uploaded data
    getUploadedData() {
        const data = {
            toolType: 'rituals-symbolism-ladder',
            title: 'The Elements of Value Pyramid',
            elements: [],
            uploadedAt: new Date().toISOString()
        };

        const activeContainers = this.container.querySelectorAll('.insight-circle-container.active');
        activeContainers.forEach(container => {
            const name = container.dataset.name;
            const img = container.querySelector('.uploaded-image');
            const layer = container.closest('.insight-layer').querySelector('.insight-layer-title').textContent;

            if (img && img.src) {
                data.elements.push({
                    name: name,
                    layer: layer,
                    imageData: img.src
                });
            }
        });

        return data;
    }

    // Reset all uploads
    reset() {
        const circles = this.container.querySelectorAll('.insight-circle');
        const containers = this.container.querySelectorAll('.insight-circle-container');
        const images = this.container.querySelectorAll('.uploaded-image');
        const inputs = this.container.querySelectorAll('input[type="file"]');

        circles.forEach(circle => circle.classList.remove('active'));
        containers.forEach(container => {
            container.classList.remove('active');
            container.classList.remove('just-uploaded');
        });
        images.forEach(img => img.src = '');
        inputs.forEach(input => input.value = '');

        console.log('🗑️ Rituals & Symbolism Ladder reset');
    }

    // Load data from previous session
    loadData(data) {
        if (!data || !data.elements) return;

        data.elements.forEach(element => {
            const container = this.container.querySelector(`[data-name="${element.name}"]`);
            if (container) {
                const circle = container.querySelector('.insight-circle');
                const img = container.querySelector('.uploaded-image');

                if (img && element.imageData) {
                    img.src = element.imageData;
                    circle.classList.add('active');
                    container.classList.add('active');
                }
            }
        });

        console.log(`📂 Loaded ${data.elements.length} elements`);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RitualsSymbolismLadder;
} else {
    window.RitualsSymbolismLadder = RitualsSymbolismLadder;
}