// Feature Requests Manager
class FeatureRequestManager {
    constructor() {
        this.supabaseClient = null;
        this.currentUser = null;
        this.featureRequests = [];
    }

    async init() {
        console.log('Initializing Feature Request Manager...');

        try {
            // Use existing global user data (already set by auth.js)
            if (!window.currentUserData) {
                console.error('No user data found - user not logged in');
                this.showError('Please login to access feature requests');
                return;
            }

            this.currentUser = window.currentUserData;
            console.log('Using existing user data ✓:', this.currentUser.email);

            // Get Supabase client
            this.supabaseClient = window.authManager.getSupabaseClient();
            console.log('Supabase client obtained ✓');

            // Setup and load
            this.setupEventListeners();
            console.log('Event listeners setup ✓');

            await this.testSimpleQuery();
            await this.loadFeatureRequests();
            console.log('Feature requests loaded ✓');

        } catch (error) {
            console.error('Error during initialization:', error);
            this.showError('Failed to initialize feature requests');
        }
    }

    setupEventListeners() {
        // Form submission
        const form = document.getElementById('featureForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.createFeatureRequest();
        });

        console.log('Event listeners setup complete');
    }

    async testSimpleQuery() {
        console.log('🧪 Testing simple database query...');

        try {
            // Test 1: Basic connectivity test (PostgreSQL equivalent of "select 1")
            console.log('Test 1: Basic query...');
            const { data: test1, error: error1 } = await this.supabaseClient
                .rpc('now'); // PostgreSQL built-in function

            console.log('Test 1 result:', { data: test1, error: error1 });

            if (error1) {
                // Try alternative simple query
                console.log('Test 1 failed, trying Test 2: Known table query...');
                const { data: test2, error: error2 } = await this.supabaseClient
                    .from('users_login')
                    .select('count')
                    .limit(1);

                console.log('Test 2 result:', { data: test2, error: error2 });

                if (error2) {
                    throw new Error('Both simple queries failed');
                } else {
                    console.log('✅ Simple query test passed (Test 2)');
                }
            } else {
                console.log('✅ Simple query test passed (Test 1)');
            }

        } catch (error) {
            console.error('❌ Simple query test failed:', error);
            throw error;
        }
    }


    async loadFeatureRequests() {
        try {
            console.log('Loading feature requests...');

            // Simple query to feature_requests table
            const { data, error } = await this.supabaseClient
                .from('feature_requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error loading feature requests:', error);
                this.showError('Failed to load feature requests: ' + error.message);
                this.featureRequests = [];
            } else {
                console.log('Raw data:', data);

                // Process data - calculate vote counts
                this.featureRequests = (data || []).map(item => ({
                    ...item,
                    vote_count: Array.isArray(item.upvoter_emails) ? item.upvoter_emails.length : 0,
                    creator_name: 'User'
                }));

                console.log('Processed feature requests:', this.featureRequests.length);
            }

            this.renderFeatureRequests();

        } catch (error) {
            console.error('Exception loading feature requests:', error);
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
            console.log('Creating feature request:', { title, description, type });

            const { data, error } = await this.supabaseClient
                .from('feature_requests')
                .insert({
                    title,
                    description,
                    type,
                    created_by: this.currentUser.id
                })
                .select();

            if (error) {
                console.error('Error creating feature request:', error);
                this.showError('Failed to create feature request');
                return;
            }

            console.log('Feature request created:', data[0]);

            // Clear form
            document.getElementById('featureForm').reset();
            document.getElementById('typeFeature').checked = true;

            // Refresh list
            await this.loadFeatureRequests();

            this.showSuccess('Feature request created successfully!');

        } catch (error) {
            console.error('Exception creating feature request:', error);
            this.showError('Failed to create feature request');
        } finally {
            createBtn.disabled = false;
            createBtn.textContent = 'Create Post';
        }
    }

    async vote(featureId, isUpvote) {
        try {
            console.log('Voting:', { featureId, isUpvote, email: this.currentUser.email });

            const functionName = isUpvote ? 'upvote_feature_request' : 'downvote_feature_request';

            const { data, error } = await this.supabaseClient
                .rpc(functionName, {
                    feature_id: featureId,
                    user_email: this.currentUser.email
                });

            if (error) {
                console.error('Error voting:', error);
                this.showError('Failed to record vote');
                return;
            }

            console.log('Vote recorded:', data);

            // Refresh list to show updated vote counts
            await this.loadFeatureRequests();

        } catch (error) {
            console.error('Exception voting:', error);
            this.showError('Failed to record vote');
        }
    }

    renderFeatureRequests() {
        const container = document.getElementById('featuresList');

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
                            <button class="vote-btn ${hasVoted ? 'voted' : ''}"
                                    onclick="featureManager.vote('${feature.id}', ${!hasVoted})"
                                    title="${hasVoted ? 'Remove vote' : 'Upvote'}">
                                <i class="bi bi-chevron-up"></i>
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
                            <span style="margin-left: 0.5rem;">by ${isOwnRequest ? 'you' : this.escapeHtml(feature.creator_name || 'User')}</span>
                        </div>
                        <div>
                            ${this.formatDate(feature.created_at)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
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
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span>${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        container.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }
}

// Global instance
let featureManager;

// Initialize when DOM and auth are ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, waiting for auth...');

    // Wait for auth to be ready
    setTimeout(async () => {
        if (window.authManager) {
            console.log('Auth manager found, initializing feature manager...');
            featureManager = new FeatureRequestManager();
            await featureManager.init();
        } else {
            console.error('Auth manager not found after timeout');
        }
    }, 1000);
});