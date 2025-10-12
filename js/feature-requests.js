// Feature Requests Manager - Clean Layout with Tabs
class FeatureRequestManager {
    constructor() {
        this.SUPABASE_URL = 'https://yxicubfthxkwqcihrdhe.supabase.co';
        this.SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4aWN1YmZ0aHhrd3FjaWhyZGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjg3NDEsImV4cCI6MjA3MzgwNDc0MX0.-w4VQhAIF0kYLHv87JazGLxgX-r4VXCJaPVSmOUher4';
        this.currentUser = null;
        this.featureRequests = [];
        this.currentFeature = null;
        this.activeTab = 'all'; // 'all' or 'mine'
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

        // Character counters
        const titleInput = document.getElementById('featureTitle');
        const descInput = document.getElementById('featureDescription');
        const titleCount = document.getElementById('titleCount');
        const descCount = document.getElementById('descCount');

        if (titleInput && titleCount) {
            titleInput.addEventListener('input', (e) => {
                const length = e.target.value.length;
                titleCount.textContent = `${length}/100`;

                if (length > 90) {
                    titleCount.classList.add('error');
                    titleCount.classList.remove('warning');
                } else if (length > 75) {
                    titleCount.classList.add('warning');
                    titleCount.classList.remove('error');
                } else {
                    titleCount.classList.remove('warning', 'error');
                }
            });
        }

        if (descInput && descCount) {
            descInput.addEventListener('input', (e) => {
                const length = e.target.value.length;
                descCount.textContent = `${length}/500`;

                if (length > 475) {
                    descCount.classList.add('error');
                    descCount.classList.remove('warning');
                } else if (length > 400) {
                    descCount.classList.add('warning');
                    descCount.classList.remove('error');
                } else {
                    descCount.classList.remove('warning', 'error');
                }
            });
        }

        // Comment character counter
        const commentInput = document.getElementById('commentInput');
        const commentCharCount = document.getElementById('commentCharCount');

        if (commentInput && commentCharCount) {
            commentInput.addEventListener('input', (e) => {
                const length = e.target.value.length;
                commentCharCount.textContent = `${length}/1000`;

                if (length > 950) {
                    commentCharCount.classList.add('error');
                    commentCharCount.classList.remove('warning');
                } else if (length > 800) {
                    commentCharCount.classList.add('warning');
                    commentCharCount.classList.remove('error');
                } else {
                    commentCharCount.classList.remove('warning', 'error');
                }
            });
        }

        // Add comment button
        const addCommentBtn = document.getElementById('addCommentBtn');
        if (addCommentBtn) {
            addCommentBtn.addEventListener('click', () => this.addComment());
        }

        // Close modal on overlay click
        const modalOverlay = document.getElementById('commentsModal');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeCommentsModal();
                }
            });
        }
    }

    switchTab(tabName) {
        this.activeTab = tabName;

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Re-render with filter
        this.renderFeatureRequests();
    }

    getAuthHeaders() {
        const headers = {
            'apikey': this.SUPABASE_KEY,
            'Content-Type': 'application/json'
        };

        try {
            const authStorage = localStorage.getItem('sb-yxicubfthxkwqcihrdhe-auth-token');
            if (authStorage) {
                const session = JSON.parse(authStorage);
                if (session?.access_token) {
                    headers['Authorization'] = `Bearer ${session.access_token}`;
                    return headers;
                }
            }
        } catch (e) {
            console.warn('Failed to get token from storage:', e);
        }

        headers['Authorization'] = `Bearer ${this.SUPABASE_KEY}`;
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

            const headers = this.getAuthHeaders();

            const response = await fetch(`${this.SUPABASE_URL}/rest/v1/feature_requests?select=*&order=created_at.desc`, {
                headers
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Loaded:', data.length, 'feature requests');

            // Get user names from users_login table
            const userIds = [...new Set(data.map(item => item.created_by))];
            const usersData = await this.fetchUsers(userIds);

            this.featureRequests = data
                .map(item => ({
                    ...item,
                    vote_count: Array.isArray(item.upvoter_emails) ? item.upvoter_emails.length : 0,
                    status: item.status || 'open',
                    comment_count: item.comment_count || 0,
                    creator: usersData[item.created_by] || {
                        name: 'User',
                        avatar_url: `https://ui-avatars.com/api/?name=User&background=667eea&color=fff`
                    }
                }))
                .sort((a, b) => {
                    if (b.vote_count !== a.vote_count) {
                        return b.vote_count - a.vote_count;
                    }
                    return new Date(b.created_at) - new Date(a.created_at);
                });

            this.renderFeatureRequests();

        } catch (error) {
            console.error('❌ Error loading:', error);
            this.showError('Failed to load: ' + error.message);
            this.featureRequests = [];
            this.renderFeatureRequests();
        }
    }

    async fetchUsers(userIds) {
        if (userIds.length === 0) return {};

        try {
            const headers = this.getAuthHeaders();
            const idsFilter = userIds.map(id => `user_id.eq.${id}`).join(',');

            const response = await fetch(
                `${this.SUPABASE_URL}/rest/v1/users_login?or=(${idsFilter})&select=user_id,name,avatar_url`,
                { headers }
            );

            if (!response.ok) {
                console.warn('Failed to fetch users');
                return {};
            }

            const users = await response.json();

            // Create lookup object
            const usersMap = {};
            users.forEach(user => {
                usersMap[user.user_id] = {
                    name: user.name || 'User',
                    avatar_url: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=667eea&color=fff`
                };
            });

            return usersMap;

        } catch (error) {
            console.error('Error fetching users:', error);
            return {};
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

        if (title.length > 100 || title.length < 5) {
            this.showError('Title must be between 5-100 characters');
            return;
        }

        if (description.length > 500 || description.length < 10) {
            this.showError('Description must be between 10-500 characters');
            return;
        }

        const createBtn = document.getElementById('createBtn');
        createBtn.disabled = true;
        createBtn.textContent = 'Creating...';

        try {
            console.log('📝 Creating feature request...');

            const headers = this.getAuthHeaders();
            headers['Prefer'] = 'return=representation';

            const response = await fetch(`${this.SUPABASE_URL}/rest/v1/feature_requests`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    title,
                    description,
                    type,
                    created_by: this.currentUser.id,
                    upvoter_emails: [this.currentUser.email],
                    status: 'open',
                    comment_count: 0
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
            document.getElementById('titleCount').textContent = '0/100';
            document.getElementById('descCount').textContent = '0/500';

            await this.loadFeatureRequests();

            // Switch to "My Requests" tab to show the new item
            this.switchTab('mine');

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

            const headers = this.getAuthHeaders();

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

    openCommentsModal(featureId) {
        console.log('🔍 Opening modal for feature:', featureId);

        const feature = this.featureRequests.find(f => f.id === featureId);
        console.log('🔍 Found feature:', feature);

        if (!feature) {
            console.error('❌ Feature not found!');
            return;
        }

        this.currentFeature = feature;

        // Check if modal elements exist
        const modal = document.getElementById('commentsModal');
        console.log('🔍 Modal element:', modal);

        if (!modal) {
            console.error('❌ Modal element not found! Did you add the modal HTML?');
            alert('Error: Modal HTML not found. Check the console.');
            return;
        }

        document.getElementById('modalFeatureTitle').textContent = feature.title;
        document.getElementById('modalFeatureTitleDetail').textContent = feature.title;
        document.getElementById('modalFeatureDesc').textContent = feature.description;
        document.getElementById('modalFeatureType').textContent = feature.type;
        document.getElementById('modalFeatureType').className = `feature-type ${feature.type}`;

        const hasVoted = feature.upvoter_emails?.includes(this.currentUser.email) || false;
        const voteBtn = document.getElementById('modalVoteBtn');
        voteBtn.className = `vote-btn ${hasVoted ? 'voted' : ''}`;
        voteBtn.disabled = feature.status !== 'open';
        voteBtn.onclick = () => {
            this.toggleVote(feature.id, hasVoted);
            setTimeout(() => {
                this.openCommentsModal(featureId);
            }, 500);
        };

        document.getElementById('modalVoteCount').textContent = feature.vote_count;

        const statusHtml = feature.status !== 'open' ?
            `<span class="status-badge ${feature.status}">${this.formatStatus(feature.status)}</span>` : '';
        document.getElementById('modalFeatureStatus').innerHTML = statusHtml;

        document.getElementById('modalFeatureDate').textContent = this.formatDate(feature.created_at);

        console.log('🔍 Showing modal...');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        console.log('✅ Modal should be visible now');
        this.loadComments(featureId);
    }

    closeCommentsModal() {
        document.getElementById('commentsModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.currentFeature = null;

        document.getElementById('commentInput').value = '';
        document.getElementById('commentCharCount').textContent = '0/1000';
    }

    async loadComments(featureId) {
        const container = document.getElementById('commentsList');

        container.innerHTML = `
            <div class="loading-state">
                <i class="bi bi-hourglass-split"></i>
                <div>Loading comments...</div>
            </div>
        `;

        try {
            const headers = this.getAuthHeaders();

            const response = await fetch(
                `${this.SUPABASE_URL}/rest/v1/feature_comments?feature_id=eq.${featureId}&order=created_at.desc`,
                { headers }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const comments = await response.json();
            console.log('✅ Loaded comments:', comments.length);

            document.getElementById('commentCount').textContent = comments.length;

            this.renderComments(comments);

        } catch (error) {
            console.error('❌ Error loading comments:', error);
            container.innerHTML = `
                <div class="empty-comments">
                    <p>Failed to load comments</p>
                </div>
            `;
        }
    }

    renderComments(comments) {
        const container = document.getElementById('commentsList');

        if (comments.length === 0) {
            container.innerHTML = `
                <div class="empty-comments">
                    <i class="bi bi-chat-left-text"></i>
                    <p>No comments yet. Be the first to comment!</p>
                </div>
            `;
            return;
        }

        const html = comments.map(comment => `
            <div class="comment-item">
                <img src="${this.escapeHtml(comment.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user_name)}&background=667eea&color=fff`)}" 
                     alt="${this.escapeHtml(comment.user_name)}" 
                     class="comment-avatar">
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${this.escapeHtml(comment.user_name)}</span>
                        <span class="comment-date">${this.formatDate(comment.created_at)}</span>
                    </div>
                    <p class="comment-text">${this.escapeHtml(comment.comment_text)}</p>
                </div>
            </div>
        `).join('');

        container.innerHTML = html;
    }

    async addComment() {
        const commentText = document.getElementById('commentInput').value.trim();

        if (!commentText || commentText.length < 1 || commentText.length > 1000) {
            this.showError('Comment must be between 1-1000 characters');
            return;
        }

        const addBtn = document.getElementById('addCommentBtn');
        addBtn.disabled = true;
        addBtn.textContent = 'Posting...';

        try {
            const headers = this.getAuthHeaders();
            headers['Prefer'] = 'return=representation';

            const response = await fetch(`${this.SUPABASE_URL}/rest/v1/feature_comments`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    feature_id: this.currentFeature.id,
                    user_id: this.currentUser.id,
                    user_email: this.currentUser.email,
                    user_name: this.currentUser.name,
                    avatar_url: this.currentUser.avatar,
                    comment_text: commentText
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || response.statusText);
            }

            console.log('✅ Comment added');

            document.getElementById('commentInput').value = '';
            document.getElementById('commentCharCount').textContent = '0/1000';

            await this.loadComments(this.currentFeature.id);
            await this.loadFeatureRequests();

            this.showSuccess('Comment added!');

        } catch (error) {
            console.error('❌ Error adding comment:', error);
            this.showError('Failed to add comment');
        } finally {
            addBtn.disabled = false;
            addBtn.textContent = 'Post Comment';
        }
    }

    renderFeatureRequests() {
        const container = document.getElementById('featuresList');

        // Filter based on active tab
        let filteredRequests = this.featureRequests;
        if (this.activeTab === 'mine') {
            filteredRequests = this.featureRequests.filter(f => f.created_by === this.currentUser.id);
        }

        if (filteredRequests.length === 0) {
            const emptyMessage = this.activeTab === 'mine'
                ? 'You haven\'t created any feature requests yet'
                : 'No feature requests yet';

            container.innerHTML = `
                <div class="empty-state">
                    <i class="bi bi-lightbulb"></i>
                    <h3>${emptyMessage}</h3>
                    <p>${this.activeTab === 'mine' ? 'Create one using the form on the left!' : 'Be the first to suggest a feature!'}</p>
                </div>
            `;
            return;
        }

        const html = filteredRequests.map(feature => {
            const hasVoted = feature.upvoter_emails?.includes(this.currentUser.email) || false;
            const voteCount = feature.vote_count || 0;
            const isOwn = feature.created_by === this.currentUser.id;
            const status = feature.status || 'open';
            const isVotingDisabled = status !== 'open';
            const commentCount = feature.comment_count || 0;

            const statusBadge = status !== 'open' ?
                `<span class="status-badge ${status}">${this.formatStatus(status)}</span>` : '';

            return `
                <div class="feature-item ${isVotingDisabled ? 'disabled-voting' : ''}" 
                     onclick="featureManager.openCommentsModal('${feature.id}')">
                    
                    <!-- Header: Title + Vote -->
                    <div class="feature-header">
                        <h3 class="feature-title">${this.escapeHtml(feature.title)}</h3>
                        <div class="vote-section">
                            <button 
                                class="vote-btn ${hasVoted ? 'voted' : ''}"
                                onclick="event.stopPropagation(); featureManager.toggleVote('${feature.id}', ${hasVoted})"
                                title="${isVotingDisabled ? 'Voting closed' : hasVoted ? 'Remove vote' : 'Vote'}"
                                ${isVotingDisabled ? 'disabled' : ''}>
                                <i class="bi bi-arrow-up"></i>
                            </button>
                            <span class="vote-count">${voteCount}</span>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="feature-description">${this.escapeHtml(feature.description)}</div>

                    <!-- Footer: Author + Metadata -->
                    <div class="feature-footer">
                        <div class="feature-author">
                            <img src="${feature.creator.avatar_url}" 
                                 alt="${this.escapeHtml(feature.creator.name)}" 
                                 class="author-avatar">
                            <div class="author-info">
                                <div class="author-name">${this.escapeHtml(feature.creator.name)}</div>
                                <div class="feature-badges">
                                    <span class="feature-type ${feature.type}">${feature.type}</span>
                                    ${statusBadge}
                                </div>
                            </div>
                        </div>
                        
                        <div class="feature-stats">
                            <div class="stat-item">
                                <i class="bi bi-chat-left-text"></i>
                                ${commentCount}
                            </div>
                            <div class="stat-item">
                                <i class="bi bi-clock"></i>
                                ${this.formatDate(feature.created_at)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    formatStatus(status) {
        const statusMap = {
            'open': 'Open',
            'in_progress': 'In Progress',
            'completed': 'Completed',
            'closed': 'Closed'
        };
        return statusMap[status] || status;
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

        if (diffDays === 0) {
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMins = Math.floor(diffMs / (1000 * 60));
                if (diffMins === 0) return 'Just now';
                return `${diffMins}m ago`;
            }
            return `${diffHours}h ago`;
        }
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;

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

    if (window.currentUserData) {
        console.log('✅ User data already available');
        featureManager = new FeatureRequestManager();
        featureManager.init();
    } else {
        console.log('⏳ Waiting for user data...');
        window.addEventListener('userDataReady', () => {
            console.log('✅ User data ready event received');
            featureManager = new FeatureRequestManager();
            featureManager.init();
        });
    }
});