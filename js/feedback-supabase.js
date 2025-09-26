// Supabase Integration for Feedback System
class FeedbackSupabase {
    constructor() {
        // Use existing auth manager's Supabase client to avoid conflicts
        this.supabase = null;
        this.authManager = null;

        window.debugLog('🔍 FeedbackSupabase constructor - waiting for auth manager...');

        this.currentUser = null;
        this.userProfile = null;
        this.isAdmin = false;

        // Wait for auth manager to be ready, then initialize
        this.waitForAuthManager();
    }

    async waitForAuthManager() {
        window.debugLog('🔍 Waiting for auth manager to be ready...');

        let attempts = 0;
        const maxAttempts = 50; // 5 seconds with 100ms intervals

        const checkAuthManager = async () => {
            attempts++;
            window.debugLog(`🔍 Auth manager check attempt ${attempts}/${maxAttempts}`);

            if (window.authManager && window.authManager.supabaseClient) {
                window.debugLog('✅ Auth manager found with Supabase client');
                this.authManager = window.authManager;
                this.supabase = window.authManager.supabaseClient;

                // Now initialize the feedback system
                this.init();
                return;
            }

            // If not ready and we haven't exceeded max attempts, try again
            if (attempts < maxAttempts) {
                window.debugLog(`⏳ Auth manager not ready yet, will retry in 100ms`);
                setTimeout(checkAuthManager, 100);
            } else {
                window.debugLog('❌ Auth manager timeout - creating fallback client');
                // Fallback: create our own client
                const SUPABASE_URL = "https://yxicubfthxkwqcihrdhe.supabase.co";
                const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4aWN1YmZ0aHhrd3FjaihyZGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjg3NDEsImV4cCI6MjA3MzgwNDc0MX0.-w4VQhAIF0kYLHv87JazGLxgX-r4VXCJaPVSmOUher4";
                this.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
                this.init();
            }
        };

        checkAuthManager();
    }

    async init() {
        window.debugLog('🔍 FeedbackSupabase init() called');
        await this.checkAuthState();
        this.setupEventListeners();
        if (this.currentUser) {
            window.debugLog('✅ User found, loading requests');
            await this.loadRequests();
        } else {
            window.debugLog('❌ No current user found');
        }
    }

    async checkAuthState() {
        try {
            window.debugLog('🔍 Checking auth state...');

            // Wait for profile to load (with timeout)
            for (let i = 0; i < 20; i++) { // Wait up to 2 seconds
                const profileName = document.getElementById('profileName');
                const profileEmail = document.getElementById('profileEmail');

                window.debugLog(`🔍 Profile check attempt ${i + 1}/20 - Name: "${profileName?.textContent}", Email: "${profileEmail?.textContent}"`);

                if (profileName && profileName.textContent && profileEmail && profileEmail.textContent) {
                    window.debugLog('✅ Profile populated - extracting user info');

                    // Create a user object from the displayed profile
                    this.currentUser = {
                        email: profileEmail.textContent,
                        id: 'current-user', // We'll get the real ID from the database
                    };

                    window.debugLog('✅ Using displayed profile data', {
                        email: this.currentUser.email
                    });

                    // Load user profile from database using email
                    await this.loadUserProfileByEmail();
                    this.updateUIForUser();
                    return;
                }

                // Wait 100ms before next check
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            window.debugLog('❌ Profile data not loaded after 2 seconds - user not authenticated');
            window.location.href = '/login.html';

        } catch (error) {
            window.debugLog('❌ Auth state check failed', error);
            console.error('Auth state check failed:', error);
            window.location.href = '/login.html';
        }
    }

    async loadUserProfileByEmail() {
        try {
            const email = this.currentUser.email;
            window.debugLog('🔍 Loading user profile by email:', email);

            const { data: profile, error } = await this.supabase
                .from('users_login')
                .select('*')
                .eq('email', email)
                .single();

            if (error) {
                window.debugLog('❌ Profile load error', error);
                console.error('Profile load error:', error);
                return;
            }

            if (profile) {
                this.userProfile = profile;
                this.currentUser.id = profile.user_id; // Set the real user ID
                this.isAdmin = profile.role === 'admin' || profile.role === 'moderator';
                window.debugLog('✅ Profile loaded', {
                    name: profile.name,
                    email: profile.email,
                    role: profile.role,
                    isAdmin: this.isAdmin,
                    user_id: profile.user_id
                });
            }
        } catch (error) {
            window.debugLog('❌ Failed to load user profile by email', error);
            console.error('Failed to load user profile by email:', error);
        }
    }

    async loadUserProfile() {
        try {
            window.debugLog('🔍 Loading user profile for user_id:', this.currentUser.id);
            const { data: profile, error } = await this.supabase
                .from('users_login')
                .select('*')
                .eq('user_id', this.currentUser.id)
                .single();

            if (error) {
                window.debugLog('❌ Profile load error', error);
                console.error('Profile load error:', error);
                return;
            }

            this.userProfile = profile;
            this.isAdmin = profile.role === 'admin' || profile.role === 'moderator';
            window.debugLog('✅ Profile loaded', {
                name: profile.name,
                email: profile.email,
                role: profile.role,
                isAdmin: this.isAdmin
            });
        } catch (error) {
            window.debugLog('❌ Failed to load user profile', error);
            console.error('Failed to load user profile:', error);
        }
    }

    updateUIForUser() {
        if (!this.userProfile) return;

        // Update profile display
        document.getElementById('profileName').textContent = this.userProfile.name || this.userProfile.email;
        document.getElementById('profileEmail').textContent = this.userProfile.email;

        // Show profile
        document.getElementById('userProfile').style.display = 'block';

        // Show/hide admin controls
        const adminControls = document.getElementById('adminControls');
        if (this.isAdmin) {
            adminControls.style.display = 'flex';
        } else {
            adminControls.style.display = 'none';
        }

        // Update status filter options based on user role
        this.updateStatusFilterOptions();
    }

    updateStatusFilterOptions() {
        const statusFilter = document.getElementById('statusFilter');

        if (this.isAdmin) {
            // Admin sees all statuses
            statusFilter.innerHTML = `
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="duplicate">Duplicate</option>
                <option value="out-of-scope">Out of Scope</option>
            `;
        } else {
            // Regular users see limited statuses
            statusFilter.innerHTML = `
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
            `;
        }
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('feedbackForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitRequest();
        });

        // Filter controls
        document.getElementById('userFilter').addEventListener('change', () => {
            this.loadRequests();
        });

        document.getElementById('statusFilter').addEventListener('change', () => {
            this.loadRequests();
        });

        document.getElementById('typeFilter').addEventListener('change', () => {
            this.loadRequests();
        });

        // Admin status filter
        if (document.getElementById('adminStatusFilter')) {
            document.getElementById('adminStatusFilter').addEventListener('change', () => {
                this.loadRequests();
            });
        }

        // Logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.logout();
        });
    }

    async submitRequest() {
        window.debugLog('🔍 Form submission started');

        if (!this.currentUser) {
            window.debugLog('❌ No current user found');
            this.showMessage('Please log in to submit a request', 'error');
            return;
        }

        const form = document.getElementById('feedbackForm');
        const formData = new FormData(form);

        const requestData = {
            title: formData.get('title'),
            description: formData.get('description'),
            type: formData.get('type'),
            created_by: this.currentUser.id
        };

        window.debugLog('🔍 Form data collected', requestData);

        try {
            window.debugLog('🔍 Attempting to insert into feedback_requests table...');

            const { data, error } = await this.supabase
                .from('feedback_requests')
                .insert([requestData])
                .select();

            window.debugLog('🔍 Insert operation completed', {
                data: data,
                error: error,
                hasData: !!data,
                hasError: !!error
            });

            if (error) {
                window.debugLog('❌ Submit error details', error);
                console.error('Submit error:', error);
                this.showMessage(`Failed to submit request: ${error.message}`, 'error');
                return;
            }

            if (data && data.length > 0) {
                window.debugLog('✅ Request inserted successfully', data[0]);

                // Reset form
                form.reset();
                window.debugLog('✅ Form reset');

                // Refresh display
                window.debugLog('🔍 Loading requests to refresh display...');
                await this.loadRequests();

                // Show success message
                this.showMessage('Request submitted successfully!', 'success');
                window.debugLog('✅ Success message shown');
            } else {
                window.debugLog('❌ No data returned from insert');
                this.showMessage('Request submitted but no confirmation received', 'error');
            }
        } catch (error) {
            window.debugLog('❌ Submit request exception', error);
            console.error('Submit request failed:', error);
            this.showMessage(`Failed to submit request: ${error.message}`, 'error');
        }
    }

    async loadRequests() {
        try {
            window.debugLog('🔍 Loading requests...');

            const userFilter = document.getElementById('userFilter').value;
            const statusFilter = document.getElementById('statusFilter').value;
            const typeFilter = document.getElementById('typeFilter').value;
            const adminStatusFilter = this.isAdmin ?
                document.getElementById('adminStatusFilter')?.value || 'all' : 'all';

            window.debugLog('🔍 Filters applied', {
                userFilter,
                statusFilter,
                typeFilter,
                adminStatusFilter,
                isAdmin: this.isAdmin
            });

            let query = this.supabase
                .from('feedback_requests_with_details')
                .select('*')
                .order('votes_count', { ascending: false })
                .order('created_at', { ascending: false });

            // Apply filters
            if (userFilter === 'mine') {
                query = query.eq('created_by', this.currentUser.id);
                window.debugLog('🔍 Applied "mine" filter for user:', this.currentUser.id);
            }

            // Use admin filter if admin, otherwise regular filter
            const activeStatusFilter = this.isAdmin && adminStatusFilter !== 'all' ?
                adminStatusFilter : statusFilter;

            if (activeStatusFilter !== 'all') {
                query = query.eq('status', activeStatusFilter);
                window.debugLog('🔍 Applied status filter:', activeStatusFilter);
            }

            if (typeFilter !== 'all') {
                query = query.eq('type', typeFilter);
                window.debugLog('🔍 Applied type filter:', typeFilter);
            }

            window.debugLog('🔍 Executing query...');
            const { data: requests, error } = await query;

            window.debugLog('🔍 Query completed', {
                requestsFound: requests?.length || 0,
                hasError: !!error,
                error: error
            });

            if (error) {
                window.debugLog('❌ Load requests error', error);
                console.error('Load requests error:', error);
                this.showMessage(`Failed to load requests: ${error.message}`, 'error');
                return;
            }

            window.debugLog('✅ Displaying requests', requests || []);
            this.displayRequests(requests || []);
        } catch (error) {
            window.debugLog('❌ Load requests exception', error);
            console.error('Load requests failed:', error);
            this.showMessage(`Failed to load requests: ${error.message}`, 'error');
        }
    }

    displayRequests(requests) {
        const container = document.getElementById('requestsList');

        if (requests.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No requests found</h3>
                    <p>No requests match your current filters.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = requests.map(request => this.renderRequest(request)).join('');
        this.setupVoteListeners();
    }

    renderRequest(request) {
        const userHasVoted = request.user_has_voted;
        const timeAgo = this.getTimeAgo(request.created_at);
        const statusClickable = this.isAdmin ? 'admin-clickable' : '';
        const voters = request.voters || [];

        return `
            <div class="request-item" data-id="${request.id}">
                <div class="vote-section">
                    <button class="vote-btn ${userHasVoted ? 'voted' : ''}" data-id="${request.id}">
                        <i class="bi bi-chevron-up"></i>
                    </button>
                    <div class="vote-count">${request.votes_count}</div>
                </div>
                <div class="request-content">
                    <div class="request-header">
                        <h3 class="request-title">${this.escapeHtml(request.title)}</h3>
                        <span class="request-type ${request.type}">${request.type}</span>
                        <span class="request-status ${request.status} ${statusClickable}"
                              data-id="${request.id}"
                              ${this.isAdmin ? 'title="Click to change status"' : ''}>
                            ${request.status.replace('-', ' ')}
                        </span>
                    </div>
                    <p class="request-description">${this.escapeHtml(request.description)}</p>
                    <div class="request-meta">
                        <span>${timeAgo}</span>
                        <span class="created-by">by ${this.getCreatorName(request.created_by, request.creator_name)}</span>
                        ${request.votes_count > 0 ? `
                            <div class="vote-info">
                                <i class="bi bi-chat-dots"></i>
                                <span>${request.votes_count}</span>
                                <div class="vote-avatars">
                                    ${voters.slice(0, 3).map(voter => `
                                        <div class="voter-avatar" title="${voter.user_name || voter.user_email}">
                                            ${this.generateAvatar(voter.user_name || voter.user_email)}
                                        </div>
                                    `).join('')}
                                    ${voters.length > 3 ? `
                                        <div class="voter-avatar" title="${voters.length - 3} more">
                                            +${voters.length - 3}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    setupVoteListeners() {
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const requestId = btn.dataset.id;
                this.toggleVote(requestId);
            });
        });

        // Setup admin status change listeners
        if (this.isAdmin) {
            document.querySelectorAll('.request-status.admin-clickable').forEach(statusBtn => {
                statusBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const requestId = statusBtn.dataset.id;
                    this.showStatusChangeModal(requestId);
                });
            });
        }
    }

    async toggleVote(requestId) {
        if (!this.currentUser) {
            this.showMessage('Please log in to vote', 'error');
            return;
        }

        try {
            // Check if user has already voted
            const { data: existingVote, error: checkError } = await this.supabase
                .from('feedback_votes')
                .select('id')
                .eq('request_id', requestId)
                .eq('user_id', this.currentUser.id)
                .single();

            if (checkError && checkError.code !== 'PGRST116') {
                console.error('Vote check error:', checkError);
                return;
            }

            if (existingVote) {
                // Remove vote
                const { error: deleteError } = await this.supabase
                    .from('feedback_votes')
                    .delete()
                    .eq('id', existingVote.id);

                if (deleteError) {
                    console.error('Vote removal error:', deleteError);
                    this.showMessage('Failed to remove vote', 'error');
                    return;
                }
            } else {
                // Add vote
                const { error: insertError } = await this.supabase
                    .from('feedback_votes')
                    .insert([{
                        request_id: requestId,
                        user_id: this.currentUser.id
                    }]);

                if (insertError) {
                    console.error('Vote addition error:', insertError);
                    this.showMessage('Failed to add vote', 'error');
                    return;
                }
            }

            // Refresh display
            await this.loadRequests();
        } catch (error) {
            console.error('Toggle vote failed:', error);
            this.showMessage('Failed to update vote', 'error');
        }
    }

    async showStatusChangeModal(requestId) {
        // Find the request
        const { data: request, error } = await this.supabase
            .from('feedback_requests')
            .select('*')
            .eq('id', requestId)
            .single();

        if (error || !request) {
            this.showMessage('Request not found', 'error');
            return;
        }

        const statuses = [
            { value: 'pending', label: 'Pending' },
            { value: 'in-progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'duplicate', label: 'Duplicate' },
            { value: 'out-of-scope', label: 'Out of Scope' }
        ];

        const modal = document.createElement('div');
        modal.className = 'status-modal';
        modal.innerHTML = `
            <div class="status-modal-content">
                <h3>Change Status</h3>
                <p><strong>${this.escapeHtml(request.title)}</strong></p>
                <div class="status-options">
                    ${statuses.map(status => `
                        <button class="status-option ${status.value === request.status ? 'current' : ''}"
                                data-status="${status.value}">
                            ${status.label}
                        </button>
                    `).join('')}
                </div>
                <div class="modal-actions">
                    <button class="cancel-btn">Cancel</button>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        document.body.appendChild(modal);

        // Handle status selection
        modal.querySelectorAll('.status-option').forEach(btn => {
            btn.addEventListener('click', async () => {
                const newStatus = btn.dataset.status;
                await this.updateRequestStatus(requestId, newStatus);
                modal.remove();
            });
        });

        // Handle cancel
        modal.querySelector('.cancel-btn').addEventListener('click', () => {
            modal.remove();
        });

        // Handle click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    async updateRequestStatus(requestId, newStatus) {
        try {
            const { error } = await this.supabase
                .from('feedback_requests')
                .update({ status: newStatus })
                .eq('id', requestId);

            if (error) {
                console.error('Status update error:', error);
                this.showMessage('Failed to update status', 'error');
                return;
            }

            this.showMessage('Status updated successfully', 'success');
            await this.loadRequests();
        } catch (error) {
            console.error('Update status failed:', error);
            this.showMessage('Failed to update status', 'error');
        }
    }

    async logout() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) {
                console.error('Logout error:', error);
                return;
            }
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    getCreatorName(createdBy, creatorName) {
        if (createdBy === this.currentUser.id) {
            return 'you';
        }
        return creatorName || 'User';
    }

    generateAvatar(name) {
        if (!name) return '?';
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
        return initials.substring(0, 2);
    }

    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showMessage(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Replace the old feedback system with Supabase version
    window.feedbackSystem = new FeedbackSupabase();
});