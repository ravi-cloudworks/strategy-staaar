// Feature Requests Manager - Using Direct Fetch
class FeatureRequestManager {
    constructor() {
        this.SUPABASE_URL = 'https://yxicubfthxkwqcihrdhe.supabase.co';
        this.SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4aWN1YmZ0aHhrd3FjaWhyZGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjg3NDEsImV4cCI6MjA3MzgwNDc0MX0.-w4VQhAIF0kYLHv87JazGLxgX-r4VXCJaPVSmOUher4';
        this.currentUser = null;
        this.featureRequests = [];
        this.currentFeature = null;
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

    getAuthHeaders() {
        const headers = {
            'apikey': this.SUPABASE_KEY,
            'Content-Type': 'application/json'
        };
        
        // Get session from localStorage
        try {
            const authStorage = localStorage.getItem('sb-yxicubfthxkwqcihrdhe-auth-token');
            if (authStorage) {
                const session = JSON.parse(authStorage);
                if (session?.access_token) {
                    headers['Authorization'] = `Bearer ${session.access_token}`;
                    console.log('🔑 Using user JWT token');
                    return headers;
                }
            }
        } catch (e) {
            console.warn('Failed to get token from storage:', e);
        }
        
        headers['Authorization'] = `Bearer ${this.SUPABASE_KEY}`;
        console.log('🔑 Using anon key');
        
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

            this.featureRequests = data
                .map(item => ({
                    ...item,
                    vote_count: Array.isArray(item.upvoter_emails) ? item.upvoter_emails.length : 0,
                    status: item.status || 'open',
                    comment_count: item.comment_count || 0
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

    async createFeatureRequest() {
        const title = document.getElementById('featureTitle').value.trim();
        const description = document.getElementById('featureDescription').value.trim();
        const type = document.querySelector('input[name="type"]:checked').value;

        if (!title || !description) {
            this.showError('Please fill in all fields');
            return;
        }

        if (title.length > 100) {
            this.showError('Title must be 100 characters or less');
            return;
        }

        if (title.length < 5) {
            this.showError('Title must be at least 5 characters');
            return;
        }

        if (description.length > 500) {
            this.showError('Description must be 500 characters or less');
            return;
        }

        if (description.length < 10) {
            this.showError('Description must be at least 10 characters');
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
        const feature = this.featureRequests.find(f => f.id === featureId);
        if (!feature) return;

        this.currentFeature = feature;

        // Populate modal with feature details
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
                this.openCommentsModal(featureId); // Refresh modal
            }, 500);
        };
        
        document.getElementById('modalVoteCount').textContent = feature.vote_count;
        
        const statusHtml = feature.status !== 'open' ? 
            `<span class="status-badge ${feature.status}">${this.formatStatus(feature.status)}</span>` : '';
        document.getElementById('modalFeatureStatus').innerHTML = statusHtml;
        
        document.getElementById('modalFeatureDate').textContent = this.formatDate(feature.created_at);

        // Show modal
        document.getElementById('commentsModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Load comments
        this.loadComments(featureId);
    }

    closeCommentsModal() {
        document.getElementById('commentsModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.currentFeature = null;
        
        // Clear comment input
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

        if (!commentText) {
            this.showError('Please enter a comment');
            return;
        }

        if (commentText.length > 1000) {
            this.showError('Comment must be 1000 characters or less');
            return;
        }

        if (commentText.length < 1) {
            this.showError('Comment cannot be empty');
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

            // Clear input
            document.getElementById('commentInput').value = '';
            document.getElementById('commentCharCount').textContent = '0/1000';

            // Reload comments
            await this.loadComments(this.currentFeature.id);
            await this.loadFeatureRequests(); // Refresh list to update comment count

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
            const status = feature.status || 'open';
            const isVotingDisabled = status !== 'open';
            const commentCount = feature.comment_count || 0;

            const statusBadge = status !== 'open' ? 
                `<span class="status-badge ${status}">${this.formatStatus(status)}</span>` : '';

            return `
                <div class="feature-item ${isVotingDisabled ? 'disabled-voting' : ''}" 
                     onclick="featureManager.openCommentsModal('${feature.id}')">
                    <div class="feature-header">
                        <h3 class="feature-title">${this.escapeHtml(feature.title)}</h3>
                        <div class="vote-section">
                            <button 
                                class="vote-btn ${hasVoted ? 'voted' : ''}"
                                onclick="event.stopPropagation(); featureManager.toggleVote('${feature.id}', ${hasVoted})"
                                title="${isVotingDisabled ? 'Voting closed - ' + this.formatStatus(status) : hasVoted ? 'Remove your vote' : 'Vote for this request'}"
                                ${isVotingDisabled ? 'disabled' : ''}>
                                <i class="bi bi-arrow-up"></i>
                            </button>
                            <span class="vote-count">${voteCount}</span>
                        </div>
                    </div>
                    <div class="feature-description">${this.escapeHtml(feature.description)}</div>
                    <div class="feature-meta">
                        <div>
                            <span class="feature-type ${feature.type}">${feature.type}</span>
                            ${statusBadge}
                            <span style="margin-left: 0.5rem; color: #6b7280;">
                                ${isOwn ? 'by you' : 'by user'}
                            </span>
                            <span class="comment-count-badge">
                                <i class="bi bi-chat-left-text"></i>
                                ${commentCount}
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
                return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
            }
            return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        }
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