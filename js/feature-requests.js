// Feature Requests Manager
class FeatureRequestManager {
    constructor() {
        this.supabaseClient = null;
        this.currentUser = null;
        this.featureRequests = [];
    }

    async init() {
        console.log('🚀 Initializing Feature Request Manager...');

        try {
            // CRITICAL: Wait for auth to be ready first
            if (!window.authManager) {
                console.error('❌ Auth manager not available');
                this.showError('Authentication system not ready. Please refresh the page.');
                return;
            }

            // Get Supabase client
            this.supabaseClient = window.authManager.getSupabaseClient();
            
            // Get current user from auth
            this.currentUser = await window.authManager.getCurrentUser();
            
            if (!this.currentUser) {
                console.error('❌ No authenticated user found');
                this.showNotAuthenticated();
                return;
            }

            console.log('✅ User authenticated:', this.currentUser.email);

            // Setup and load
            this.setupEventListeners();
            await this.loadFeatureRequests();

            console.log('✅ Feature Request Manager initialized');

        } catch (error) {
            console.error('❌ Error during initialization:', error);
            this.showError('Failed to initialize. Please refresh the page.');
        }
    }

    setupEventListeners() {
        const form = document.getElementById('featureForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.createFeatureRequest();
            });
        }
    }

    async loadFeatureRequests() {
        const container = document.getElementById('featuresList');
        
        // Show loading
        container.innerHTML = `
            <div class="loading-state">
                <i class="bi bi-hourglass-split"></i>
                <div>Loading feature requests...</div>
            </div>
        `;

        try {
            console.log('📥 Loading feature requests...');

            const { data, error } = await this.supabaseClient
                .from('feature_requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('❌ Error loading feature requests:', error);
                
                // Check if it's an auth error
                if (error.code === 'PGRST301' || error.message.includes('JWT')) {
                    this.showNotAuthenticated();
                    return;
                }
                
                this.showError('Failed to load feature requests: ' + error.message);
                this.featureRequests = [];
            } else {
                console.log(`✅ Loaded ${data?.length || 0} feature requests`);
                
                // Process data - calculate vote counts from array
                this.featureRequests = (data || []).map(item => ({
                    ...item,
                    vote_count: Array.isArray(item.upvoter_emails) ? item.upvoter_emails.length : 0
                }));
            }

            this.renderFeatureRequests();

        } catch (error) {
            console.error('❌ Exception loading feature requests:', error);
            this.showError('Failed to load feature requests');
            this.featureRequests = [];
            this.renderFeatureRequests();
        }
    }

    async createFeatureRequest() {
        const title = document.getElementById('featureTitle').value.trim();
        const description = document.getElementById('featureDescription').value.trim();
        const type = document.querySelector('input[name="type"]:checked').value;

        if (!title || !description) {
            this.showError('Please fill in all fields');
            return;
        }

        const createBtn = document.getElementById('createBtn');
        createBtn.disabled = true;
        createBtn.textContent = 'Creating...';

        try {
            console.log('📝 Creating feature request...');

            const { data, error } = await this.supabaseClient
                .from('feature_requests')
                .insert({
                    title,
                    description,
                    type,
                    created_by: this.currentUser.id,
                    upvoter_emails: [] // Start with empty array
                })
                .select();

            if (error) {
                console.error('❌ Error creating feature request:', error);
                this.showError('Failed to create: ' + error.message);
                return;
            }

            console.log('✅ Feature request created:', data[0].id);

            // Clear form
            document.getElementById('featureForm').reset();
            document.getElementById('typeFeature').checked = true;

            // Refresh list
            await this.loadFeatureRequests();

            this.showSuccess('Feature request created successfully!');

        } catch (error) {
            console.error('❌ Exception creating feature request:', error);
            this.showError('Failed to create feature request');
        } finally {
            createBtn.disabled = false;
            createBtn.textContent = 'Create Post';
        }
    }

    async toggleVote(featureId, currentlyVoted) {
        try {
            const userEmail = this.currentUser.email;
            
            if (currentlyVoted) {
                // Remove vote (downvote)
                console.log('⬇️ Removing vote from:', featureId);
                
                const { error } = await this.supabaseClient
                    .rpc('downvote_feature_request', {
                        feature_id: featureId,
                        user_email: userEmail
                    });

                if (error) {
                    console.error('❌ Error removing vote:', error);
                    this.showError('Failed to remove vote');
                    return;
                }
                
                console.log('✅ Vote removed');
                
            } else {
                // Add vote (upvote)
                console.log('⬆️ Adding vote to:', featureId);
                
                const { error } = await this.supabaseClient
                    .rpc('upvote_feature_request', {
                        feature_id: featureId,
                        user_email: userEmail
                    });

                if (error) {
                    console.error('❌ Error adding vote:', error);
                    this.showError('Failed to add vote');
                    return;
                }
                
                console.log('✅ Vote added');
            }

            // Refresh list to show updated counts
            await this.loadFeatureRequests();

        } catch (error) {
            console.error('❌ Exception voting:', error);
            this.showError('Failed to record vote');
        }
    }

    renderFeatureRequests() {
        const container = document.getElementById('featuresList');

        if (!this.currentUser) {
            this.showNotAuthenticated();
            return;
        }

        if (this.featureRequests.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-lightbulb"></i>
                    <h3>No feature requests yet</h3>
                    <p>Be the first to suggest a new feature or report a bug!</p>
                </div>
            `;
            return;
        }

        const html = this.featureRequests.map(feature => {
            const hasVoted = feature.upvoter_emails?.includes(this.currentUser.email) || false;
            const voteCount = feature.vote_count || 0;
            const isOwnRequest = feature.created_by === this.currentUser.id;

            return `
                <div class="feature-item">
                    <div class="feature-header">
                        <h3 class="feature-title">${this.escapeHtml(feature.title)}</h3>
                        <div class="vote-section">
                            <button 
                                class="vote-btn ${hasVoted ? 'voted' : ''}"
                                onclick="featureManager.toggleVote('${feature.id}', ${hasVoted})"
                                title="${hasVoted ? 'Remove your vote' : 'Vote for this request'}">
                                <i class="bi bi-arrow-up"></i>
                            </button>
                            <span class="vote-count">${voteCount}</span>
                        </div>
                    </div>

                    <div class="feature-description">
                        ${this.escapeHtml(feature.description)}
                    </div>

                    <div class="feature-meta">
                        <div>
                            <span class="feature-type ${feature.type}">${feature.type}</span>
                            <span style="margin-left: 0.5rem; color: #6b7280;">
                                ${isOwnRequest ? 'by you' : 'by user'}
                            </span>
                        </div>
                        <div style="color: #9ca3af; font-size: 12px;">
                            ${this.formatDate(feature.created_at)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    showNotAuthenticated() {
        const container = document.getElementById('featuresList');
        container.innerHTML = `
            <div class="empty-state">
                <i class="bi bi-lock"></i>
                <h3>Authentication Required</h3>
                <p>Please log in to view and create feature requests.</p>
                <a href="index.html" class="btn btn-primary" style="margin-top: 1rem; display: inline-block; background: #667eea; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none;">
                    Go to Login
                </a>
            </div>
        `;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;

        return date.toLocaleDateString();
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) {
            console.log('Toast:', message);
            return;
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                     type === 'error' ? 'exclamation-circle' : 
                     'info-circle';
        
        toast.innerHTML = `
            <div class="toast-content">
                <i class="bi bi-${icon}"></i>
                <span>${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        container.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
}

// Global instance
let featureManager;

// Initialize when auth is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded, waiting for auth...');

    // Check if auth manager already exists
    if (window.authManager) {
        console.log('✅ Auth manager found immediately');
        featureManager = new FeatureRequestManager();
        featureManager.init();
    } else {
        // Wait for auth manager ready event
        console.log('⏳ Waiting for authManagerReady event...');
        window.addEventListener('authManagerReady', () => {
            console.log('✅ Auth manager ready event received');
            featureManager = new FeatureRequestManager();
            featureManager.init();
        });
    }
});