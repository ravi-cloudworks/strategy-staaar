// Feature Requests Manager - Using Direct Fetch
class FeatureRequestManager {
    constructor() {
        this.SUPABASE_URL = 'https://yxicubfthxkwqcihrdhe.supabase.co';
        this.SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4aWN1YmZ0aHhrd3FjaWhyZGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjg3NDEsImV4cCI6MjA3MzgwNDc0MX0.-w4VQhAIF0kYLHv87JazGLxgX-r4VXCJaPVSmOUher4';
        this.currentUser = null;
        this.featureRequests = [];
    }

    async init() {
        console.log('🚀 Init started');

        if (!window.currentUserData) {
            console.error('❌ No user data');
            return;
        }

        this.currentUser = window.currentUserData;
        console.log('✅ User assigned:', this.currentUser.email);

        this.setupEventListeners();
        await this.loadFeatureRequests();

        console.log('✅ Init completed');
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

    getAuthHeaders() {
    const headers = {
        'apikey': this.SUPABASE_KEY,
        'Content-Type': 'application/json'
    };
    
    // Try to get cached session from Supabase client (synchronous)
    const client = window.authManager?.getSupabaseClient();
    
    // Access the internal auth state (this is synchronous)
    if (client?.auth?.currentSession?.access_token) {
        headers['Authorization'] = `Bearer ${client.auth.currentSession.access_token}`;
    } else if (client?.realtime?.accessToken) {
        headers['Authorization'] = `Bearer ${client.realtime.accessToken}`;
    } else {
        // Fallback to anon key
        headers['Authorization'] = `Bearer ${this.SUPABASE_KEY}`;
    }
    
    console.log('🔑 Using auth token:', headers['Authorization'].substring(0, 30) + '...');
    
    return headers;
}

    async loadFeatureRequests() {
    const container = document.getElementById('featuresList');
    
    container.innerHTML = `
        <div class="loading-state">
            <i class="bi bi-hourglass-split"></i>
            <div>Loading feature requests...</div>
        </div>
    `;

    try {
        console.log('📥 Loading feature requests...');

        const headers = this.getAuthHeaders(); // Remove await

        const response = await fetch(`${this.SUPABASE_URL}/rest/v1/feature_requests?select=*&order=created_at.desc`, {
            headers
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Loaded:', data.length, 'feature requests');

        this.featureRequests = data.map(item => ({
            ...item,
            vote_count: Array.isArray(item.upvoter_emails) ? item.upvoter_emails.length : 0
        }));

        this.renderFeatureRequests();

    } catch (error) {
        console.error('❌ Error loading:', error);
        this.showError('Failed to load: ' + error.message);
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

        const headers = this.getAuthHeaders(); // Remove await
        headers['Prefer'] = 'return=representation';

        const response = await fetch(`${this.SUPABASE_URL}/rest/v1/feature_requests`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                title,
                description,
                type,
                created_by: this.currentUser.id,
                upvoter_emails: []
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || response.statusText);
        }

        const data = await response.json();
        console.log('✅ Created:', data[0].id);

        document.getElementById('featureForm').reset();
        document.getElementById('typeFeature').checked = true;

        await this.loadFeatureRequests();
        this.showSuccess('Feature request created!');

    } catch (error) {
        console.error('❌ Error creating:', error);
        this.showError('Failed: ' + error.message);
    } finally {
        createBtn.disabled = false;
        createBtn.textContent = 'Create Post';
    }
}


    async toggleVote(featureId, currentlyVoted) {
    const functionName = currentlyVoted ? 'downvote_feature_request' : 'upvote_feature_request';

    try {
        console.log('🗳️ Voting:', functionName);

        const headers = this.getAuthHeaders(); // Remove await

        const response = await fetch(`${this.SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                feature_id: featureId,
                user_email: this.currentUser.email
            })
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        console.log('✅ Vote recorded');
        await this.loadFeatureRequests();

    } catch (error) {
        console.error('❌ Vote error:', error);
        this.showError('Failed to vote');
    }
}

    renderFeatureRequests() {
        const container = document.getElementById('featuresList');

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
        if (window.currentUserData) {
            console.log('✅ Starting manager...');
            featureManager = new FeatureRequestManager();
            featureManager.init();
        } else {
            console.error('❌ No user data');
        }
    }, 1000);
});