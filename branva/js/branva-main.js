// Branva Main Application Controller

class BranvaApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadUserProfile();
        this.initializeSlideManagement();
    }

    bindEvents() {
        // Add slide button
        const addSlideBtn = document.getElementById('addSlideBtn');
        if (addSlideBtn) {
            addSlideBtn.addEventListener('click', () => {
                this.addNewSlide();
            });
        }

        // Header events
        this.bindHeaderEvents();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyDown(e);
        });
    }

    bindHeaderEvents() {
        // File menu actions
        const projectNameInput = document.querySelector('.project-name');
        if (projectNameInput) {
            projectNameInput.addEventListener('blur', () => {
                this.saveProjectName(projectNameInput.value);
            });
        }

        // Share button
        const shareBtn = document.querySelector('.btn-secondary');
        if (shareBtn && shareBtn.textContent.includes('Share')) {
            shareBtn.addEventListener('click', () => {
                this.sharePresentation();
            });
        }

        // Present button
        const presentBtn = document.querySelector('.btn-primary');
        if (presentBtn && presentBtn.textContent.includes('Present')) {
            presentBtn.addEventListener('click', () => {
                this.startPresentation();
            });
        }

        // Profile dropdown (if user is logged in)
        const profileBtn = document.getElementById('profileBtn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => {
                this.toggleProfileDropdown();
            });
        }
    }

    loadUserProfile() {
        // Try to load user from localStorage or session
        const storedUser = localStorage.getItem('branva_user');
        if (storedUser) {
            try {
                this.currentUser = JSON.parse(storedUser);
                this.updateUserInterface();
            } catch (e) {
                console.error('Error parsing stored user data:', e);
            }
        } else {
            // Set default user for demo
            this.currentUser = {
                name: 'Demo User',
                email: 'demo@branva.com',
                avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM4QjVDRjYiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI4IiB5PSI4Ij4KPHBhdGggZD0iTTggOEE0IDQgMCAxIDAgOCAwYTQgNCAwIDAgMCAwIDh6TTEyIDEwYTYgNiAwIDEgMC0xMiAwdjJhMiAyIDAgMCAwIDIgMmg4YTIgMiAwIDAgMCAyLTJ2LTJ6IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+'
            };
            this.updateUserInterface();
        }
    }

    updateUserInterface() {
        const profileName = document.getElementById('profileName');
        const profileImage = document.getElementById('profileImage');

        if (profileName && this.currentUser) {
            profileName.textContent = this.currentUser.name;
        }

        if (profileImage && this.currentUser) {
            profileImage.src = this.currentUser.avatar;
        }
    }

    // Slide Management
    initializeSlideManagement() {
        // Initialize with first slide
        this.updateSlideDisplay();
    }


    addNewSlide() {
        if (window.branvaCanvas) {
            window.branvaCanvas.addNewSlide();
            this.showToast('New slide added', 'success');
        }
    }

    updateSlideDisplay() {
        // This is handled by the canvas class
        if (window.branvaCanvas) {
            window.branvaCanvas.updateSlideThumbnails();
        }
    }

    // Presentation Actions
    sharePresentation() {
        // Generate shareable link
        const projectName = document.querySelector('.project-name').value || 'Untitled Strategy Presentation';

        // For demo purposes, we'll copy a placeholder link to clipboard
        const shareLink = `https://branva.app/shared/${this.generateShareId()}`;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareLink).then(() => {
                this.showToast('Share link copied to clipboard', 'success');
            }).catch(() => {
                this.showShareModal(shareLink);
            });
        } else {
            this.showShareModal(shareLink);
        }
    }

    showShareModal(shareLink) {
        // Create a temporary modal for sharing
        const modal = document.createElement('div');
        modal.className = 'modal-overlay active';
        modal.innerHTML = `
            <div class="modal-content" style="width: 500px;">
                <div class="modal-header">
                    <h2>Share Presentation</h2>
                    <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Share this link with your team:</p>
                    <div style="display: flex; gap: 8px; margin: 16px 0;">
                        <input type="text" value="${shareLink}" readonly style="flex: 1; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px;">
                        <button onclick="navigator.clipboard.writeText('${shareLink}'); this.textContent='Copied!'" style="padding: 8px 16px; background: #8B5CF6; color: white; border: none; border-radius: 6px; cursor: pointer;">Copy</button>
                    </div>
                    <p style="font-size: 14px; color: #64748b;">Anyone with this link can view your presentation.</p>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary" onclick="this.closest('.modal-overlay').remove()">Done</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    startPresentation() {
        if (!window.branvaCanvas || window.branvaCanvas.slides.length === 0) {
            this.showToast('Create some slides first', 'warning');
            return;
        }

        // Enter fullscreen presentation mode
        this.enterPresentationMode();
    }

    enterPresentationMode() {
        // Create presentation overlay
        const presentationOverlay = document.createElement('div');
        presentationOverlay.className = 'presentation-overlay';
        presentationOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: black;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const slideContainer = document.createElement('div');
        slideContainer.style.cssText = `
            width: 90vw;
            height: 90vh;
            background: white;
            border-radius: 8px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Clone current slide content
        const currentSlideContent = window.branvaCanvas.slideContent.cloneNode(true);
        currentSlideContent.style.cssText = `
            width: 100%;
            height: 100%;
            transform: scale(${Math.min(slideContainer.offsetWidth / 960, slideContainer.offsetHeight / 540)});
        `;

        slideContainer.appendChild(currentSlideContent);

        // Add navigation controls
        const navControls = document.createElement('div');
        navControls.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 12px;
            align-items: center;
        `;

        navControls.innerHTML = `
            <button style="padding: 8px 12px; background: rgba(255,255,255,0.9); border: none; border-radius: 6px; cursor: pointer;" onclick="this.closest('.presentation-overlay').remove()">
                <i class="bi bi-x"></i> Exit
            </button>
            <span style="color: white; font-size: 14px;">1 / ${window.branvaCanvas.slides.length}</span>
        `;

        presentationOverlay.appendChild(slideContainer);
        presentationOverlay.appendChild(navControls);

        // Handle ESC key to exit presentation
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                presentationOverlay.remove();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);

        document.body.appendChild(presentationOverlay);

        this.showToast('Press ESC to exit presentation', 'info');
    }

    saveProjectName(name) {
        // Save project name to localStorage
        localStorage.setItem('branva_project_name', name);
        this.showToast('Project name saved', 'success');
    }

    // Global Keyboard Shortcuts
    handleGlobalKeyDown(e) {
        // Only handle shortcuts when not in input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.contentEditable === 'true') {
            return;
        }

        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'n':
                    e.preventDefault();
                    this.addNewSlide();
                    break;
                case 's':
                    e.preventDefault();
                    this.savePresentation();
                    break;
                case 'o':
                    e.preventDefault();
                    this.openPresentation();
                    break;
                case 'e':
                    e.preventDefault();
                    this.exportPresentation();
                    break;
            }
        } else if (e.key === 'F5') {
            e.preventDefault();
            this.startPresentation();
        }
    }

    savePresentation() {
        if (!window.branvaCanvas) return;

        const presentationData = {
            name: document.querySelector('.project-name').value || 'Untitled Strategy Presentation',
            slides: window.branvaCanvas.slides,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        localStorage.setItem('branva_presentation', JSON.stringify(presentationData));
        this.showToast('Presentation saved', 'success');
    }

    openPresentation() {
        this.showToast('Open presentation feature coming soon', 'info');
    }

    exportPresentation() {
        this.showToast('Export feature coming soon', 'info');
    }

    toggleProfileDropdown() {
        // This would toggle a profile dropdown if implemented
        this.showToast('Profile menu coming soon', 'info');
    }

    // Utility Methods
    generateShareId() {
        return Math.random().toString(36).substr(2, 9);
    }

    showToast(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const toastId = Math.random().toString(36).substr(2, 9);

        console.log(`🍞 TOAST CREATED [${toastId}] at ${timestamp}:`, {
            message,
            type,
            duration: '6000ms'
        });

        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            console.log(`❌ TOAST CONTAINER NOT FOUND: ${type.toUpperCase()}: ${message}`);
            return;
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.dataset.toastId = toastId;

        const icon = type === 'success' ? 'bi-check-circle' :
                    type === 'error' ? 'bi-x-circle' :
                    type === 'warning' ? 'bi-exclamation-triangle' :
                    'bi-info-circle';

        toast.innerHTML = `
            <i class="bi ${icon}"></i>
            <span>${message}</span>
        `;

        toastContainer.appendChild(toast);
        console.log(`🍞 TOAST ADDED TO DOM [${toastId}]:`, toast);

        // Trigger show animation
        setTimeout(() => {
            toast.classList.add('show');
            console.log(`🍞 TOAST SHOW ANIMATION [${toastId}]`);
        }, 10);

        // Auto remove after 6 seconds (longer for better visibility)
        const timeoutId = setTimeout(() => {
            const removeTimestamp = new Date().toLocaleTimeString();
            console.log(`🍞 TOAST AUTO-REMOVING [${toastId}] at ${removeTimestamp} after 6 seconds`);
            if (toast.parentElement) {
                toast.classList.remove('show');
                console.log(`🍞 TOAST HIDE ANIMATION [${toastId}]`);
                setTimeout(() => {
                    if (toast.parentElement) {
                        toast.remove();
                        console.log(`🍞 TOAST REMOVED FROM DOM [${toastId}]`);
                    } else {
                        console.log(`⚠️ TOAST ALREADY REMOVED [${toastId}]`);
                    }
                }, 300);
            } else {
                console.log(`⚠️ TOAST ALREADY REMOVED [${toastId}]`);
            }
        }, 6000);

        console.log(`🍞 TOAST TIMEOUT SET [${toastId}]:`, timeoutId);
    }
}

// Global toast function for other modules
window.showToast = function(message, type = 'info') {
    console.log(`🍞 GLOBAL TOAST CALLED:`, { message, type, branvaAppExists: !!window.branvaApp });
    if (window.branvaApp) {
        window.branvaApp.showToast(message, type);
    } else {
        console.log(`❌ window.branvaApp not available, toast not shown: ${message}`);
    }
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.branvaApp = new BranvaApp();

    // Auto-save every 30 seconds
    setInterval(() => {
        if (window.branvaApp) {
            window.branvaApp.savePresentation();
        }
    }, 30000);
});