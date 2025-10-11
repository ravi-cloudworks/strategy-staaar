// Feature Requests Manager - MINIMAL DEBUG VERSION
class FeatureRequestManager {
    constructor() {
        this.supabaseClient = null;
        this.currentUser = null;
        this.featureRequests = [];
    }

    async init() {
    console.log('🚀 Init started');

    const client = window.authManager?.getSupabaseClient();
    console.log('📊 Client retrieved:', !!client);

    if (!client) {
        console.error('❌ No client');
        return;
    }

    this.supabaseClient = client;
    console.log('✅ Client assigned');

    if (!window.currentUserData) {
        console.error('❌ No user data');
        return;
    }

    this.currentUser = window.currentUserData;
    console.log('✅ User assigned:', this.currentUser.email);

    this.setupEventListeners();
    console.log('✅ Listeners setup');

    // TEST 1: Query users_login (we know this works from auth.js)
    console.log('🧪 TEST 1: Query users_login table...');
    this.supabaseClient
        .from('users_login')
        .select('email')
        .limit(1)
        .then(({ data, error }) => {
            console.log('✅ users_login query resolved!');
            console.log('📊 Data:', data);
            console.log('📊 Error:', error);
        })
        .catch(err => {
            console.error('❌ users_login query rejected:', err);
        });

    // Give it 2 seconds
    setTimeout(() => {
        // TEST 2: Query feature_requests
        console.log('🧪 TEST 2: Query feature_requests table...');
        this.supabaseClient
            .from('feature_requests')
            .select('*')
            .order('created_at', { ascending: false })
            .then(({ data, error }) => {
                console.log('✅ feature_requests query resolved!');
                console.log('📊 Data:', data);
                console.log('📊 Error:', error);
                
                if (error) {
                    console.error('❌ Query error:', error);
                    this.featureRequests = [];
                } else {
                    console.log('✅ Success! Rows:', data?.length || 0);
                    this.featureRequests = (data || []).map(item => ({
                        ...item,
                        vote_count: Array.isArray(item.upvoter_emails) ? item.upvoter_emails.length : 0
                    }));
                }
                
                this.renderFeatureRequests();
            })
            .catch(err => {
                console.error('❌ feature_requests query rejected:', err);
                this.featureRequests = [];
                this.renderFeatureRequests();
            });
    }, 2000);
    
    console.log('✅ Init completed (tests dispatched)');
}

    setupEventListeners() {
        const form = document.getElementById('featureForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createFeatureRequest();
            });
        }
    }

    createFeatureRequest() {
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

        console.log('📝 Creating:', { title, type });

        this.supabaseClient
            .from('feature_requests')
            .insert({
                title,
                description,
                type,
                created_by: this.currentUser.id,
                upvoter_emails: []
            })
            .select()
            .then(({ data, error }) => {
                console.log('Insert result:', { data, error });
                
                if (error) {
                    console.error('❌ Insert error:', error);
                    this.showError('Failed: ' + error.message);
                } else {
                    console.log('✅ Created!');
                    document.getElementById('featureForm').reset();
                    document.getElementById('typeFeature').checked = true;
                    this.showSuccess('Created successfully!');
                    
                    // Reload
                    this.init();
                }
            })
            .catch(err => {
                console.error('❌ Insert exception:', err);
                this.showError('Failed to create');
            })
            .finally(() => {
                createBtn.disabled = false;
                createBtn.textContent = 'Create Post';
            });
    }

    toggleVote(featureId, currentlyVoted) {
        const functionName = currentlyVoted ? 'downvote_feature_request' : 'upvote_feature_request';
        
        console.log('🗳️ Voting:', functionName, featureId);

        this.supabaseClient
            .rpc(functionName, {
                feature_id: featureId,
                user_email: this.currentUser.email
            })
            .then(({ error }) => {
                if (error) {
                    console.error('❌ Vote error:', error);
                    this.showError('Failed to vote');
                } else {
                    console.log('✅ Vote recorded');
                    this.init(); // Reload
                }
            })
            .catch(err => {
                console.error('❌ Vote exception:', err);
                this.showError('Failed to vote');
            });
    }

    renderFeatureRequests() {
        const container = document.getElementById('featuresList');

        console.log('🎨 Rendering:', this.featureRequests.length, 'items');

        if (this.featureRequests.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-lightbulb"></i>
                    <h3>No feature requests yet</h3>
                    <p>Be the first to suggest a feature!</p>
                </div>
            `;
            return;
        }

        const html = this.featureRequests.map(feature => {
            const hasVoted = feature.upvoter_emails?.includes(this.currentUser.email) || false;
            const voteCount = feature.vote_count || 0;
            const isOwn = feature.created_by === this.currentUser.id;

            return `
                <div class="feature-item">
                    <div class="feature-header">
                        <h3 class="feature-title">${this.escapeHtml(feature.title)}</h3>
                        <div class="vote-section">
                            <button 
                                class="vote-btn ${hasVoted ? 'voted' : ''}"
                                onclick="featureManager.toggleVote('${feature.id}', ${hasVoted})"
                                title="${hasVoted ? 'Remove vote' : 'Vote'}">
                                <i class="bi bi-arrow-up"></i>
                            </button>
                            <span class="vote-count">${voteCount}</span>
                        </div>
                    </div>
                    <div class="feature-description">${this.escapeHtml(feature.description)}</div>
                    <div class="feature-meta">
                        <div>
                            <span class="feature-type ${feature.type}">${feature.type}</span>
                            <span style="margin-left: 0.5rem; color: #6b7280;">
                                ${isOwn ? 'by you' : 'by user'}
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

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

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

        const icon = type === 'success' ? 'check-circle' : 
                     type === 'error' ? 'exclamation-circle' : 'info-circle';
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
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

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded');

    setTimeout(() => {
        if (window.authManager && window.currentUserData) {
            console.log('✅ Auth ready, starting manager...');
            featureManager = new FeatureRequestManager();
            featureManager.init();
        } else {
            console.error('❌ Auth not ready');
        }
    }, 1000);
});