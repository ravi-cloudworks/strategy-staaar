// Authentication Handler
class AuthManager {
    constructor() {

        this.SUPABASE_URL = "https://yxicubfthxkwqcihrdhe.supabase.co";
        this.SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4aWN1YmZ0aHhrd3FjaWhyZGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjg3NDEsImV4cCI6MjA3MzgwNDc0MX0.-w4VQhAIF0kYLHv87JazGLxgX-r4VXCJaPVSmOUher4";
        this.supabaseClient = supabase.createClient(this.SUPABASE_URL, this.SUPABASE_KEY);
        this.trialActivated = false; // ADD THIS
        this.init();
    }

    init() {
        this.checkUser();
        this.setupAuthStateListener();
        this.setupProfileDropdown();
        this.setupSessionTimeout();
    }

    async checkUser() {
        try {
            const { data: { session }, error } = await this.supabaseClient.auth.getSession();
            if (error) {
                console.error("Auth error:", error.message);
                this.redirectToLogin();
                return;
            }

            const user = session?.user;
            if (user) {
                console.log("✅ User logged in:", user);
                this.updateUserProfile(user);
                await this.updateUserLogin(user);

                // ADD THIS:
                await this.checkTrialAccess();
            } else {
                console.log("❌ User not logged in, redirecting to login...");
                this.redirectToLogin();
            }
        } catch (error) {
            console.error("Error checking user:", error);
            this.redirectToLogin();
        }
    }

    async checkTrialAccess() {
        try {
            const { data, error } = await this.supabaseClient.rpc('get_trial_status');

            if (error) {
                console.error('Trial check error:', error);
                return;
            }

            console.log('🔍 Trial check:', data);

            if (!data.is_active && data.attempts_remaining <= 0) {
                Utils.showStatus('⚠️ All 3 trial days used! Subscribe to continue.', 'error');
                alert('⚠️ All 3 trial days used! Subscribe to continue.');


                // Sign out immediately to prevent dashboard access
                await this.supabaseClient.auth.signOut();
                window.location.href = 'index.html';

                // Stop all script execution
                throw new Error('Trial expired');

            }
        } catch (err) {
            console.error('Trial check failed:', err);
        }
    }

    updateUserProfile(user) {
        const userProfile = document.getElementById('userProfile');
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const profileImage = document.getElementById('profileImage');

        if (!userProfile || !profileName || !profileEmail || !profileImage) {
            console.warn("Profile elements not found");
            return;
        }

        // Show profile section
        userProfile.style.display = 'block';

        // Extract user information
        const name = user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.user_metadata?.given_name + ' ' + user.user_metadata?.family_name ||
            user.email?.split('@')[0] || 'User';
        const email = user.email || '';
        const avatar = user.user_metadata?.picture ||
            user.user_metadata?.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff`;

        console.log('Updating profile display:', { name, email, avatar });

        profileName.textContent = name;
        profileEmail.textContent = email;
        profileImage.src = avatar;

        // ADD THIS AFTER THE EXISTING CODE:

        // Expose user data globally for other pages to avoid duplicate auth calls

        // ADD THESE LINES:
        window.currentUserData = {
            id: user.id,
            email: user.email,
            name: name,
            avatar: avatar,
            metadata: user.user_metadata
        };

        console.log('🔥 User data exposed globally:', window.currentUserData);

        window.dispatchEvent(new CustomEvent('userDataReady', {
            detail: window.currentUserData
        }));

        console.log('🔥 userDataReady event dispatched');
    }

    async updateUserLogin(user) {
        try {
            const userId = user.id;
            const name = user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                user.user_metadata?.given_name + ' ' + user.user_metadata?.family_name ||
                user.email?.split('@')[0] ||
                "LinkedIn User";
            const email = user.email;
            const now = new Date().toISOString();

            console.log('Updating user login for:', name, email);

            // Extract LinkedIn profile data
            const avatarUrl = user.user_metadata?.picture || user.user_metadata?.avatar_url || null;
            const linkedinId = user.user_metadata?.sub ||
                user.identities?.[0]?.identity_data?.sub ||
                user.user_metadata?.provider_id || null;

            // Try to extract LinkedIn profile URL
            let profileUrl = null;
            if (user.user_metadata?.profile_url && !user.user_metadata.profile_url.includes('oauth')) {
                profileUrl = user.user_metadata.profile_url;
            } else if (user.identities?.[0]?.identity_data?.profile_url) {
                profileUrl = user.identities[0].identity_data.profile_url;
            } else {
                const searchName = encodeURIComponent(name);
                profileUrl = `https://www.linkedin.com/search/results/people/?keywords=${searchName}`;
            }

            const location = user.user_metadata?.location ||
                user.user_metadata?.country ||
                (user.user_metadata?.locale && user.user_metadata.locale !== 'en_US' ? user.user_metadata.locale : null) ||
                null;

            const { data, error: upsertError } = await this.supabaseClient
                .from("users_login")
                .upsert({
                    user_id: userId,
                    name: name,
                    email: email,
                    last_login: now,
                    profile_url: profileUrl,
                    avatar_url: avatarUrl,
                    linkedin_id: linkedinId,
                    location: location,
                    metadata: {
                        user_metadata: user.user_metadata,
                        app_metadata: user.app_metadata,
                        identities: user.identities,
                        created_at: user.created_at
                    }
                }, {
                    onConflict: "user_id",
                    ignoreDuplicates: false
                })
                .select();

            if (upsertError) {
                console.error("DB upsert error:", upsertError.message);
                return;
            }

            // Increment login_count
            if (data && data[0]) {
                const loginCount = data[0]?.login_count || 0;
                await this.supabaseClient
                    .from("users_login")
                    .update({ login_count: loginCount + 1 })
                    .eq("user_id", userId);
            }
            // ✅ ADD THIS NEW CODE HERE:
            await this.activateTrial(userId);

        } catch (error) {
            console.error("Error updating user login:", error);
        }

    }

    // ✅ ADD THIS NEW METHOD AFTER updateUserLogin():
    async activateTrial(userId) {
        if (this.trialActivated) return; // Prevent duplicate calls
        this.trialActivated = true;
        try {
            console.log('🎯 Attempting trial activation...');

            const { data, error } = await this.supabaseClient.rpc('activate_daily_trial');

            if (error) {
                console.error('Trial activation error:', error);
                return;
            }

            console.log('Trial activation result:', data);

            if (data?.success && !data.already_active) {
                const { attempts_used, attempts_allowed, attempts_remaining, is_first_attempt, is_last_attempt } = data;

                let message = '';
                if (is_first_attempt) {
                    message = `🎉 Trial Day 1 activated! You have ${attempts_remaining} more attempts available.`;
                } else if (is_last_attempt) {
                    message = `⚠️ Final trial day activated! This is your last attempt.`;
                } else {
                    message = `✅ Attempt ${attempts_used} completed. You have ${attempts_remaining} more ${attempts_remaining === 1 ? 'attempt' : 'attempts'} available.`;
                }

                console.log(message);
                Utils.showStatus(message, 'success');
            }
        } catch (err) {
            console.error('Trial activation exception:', err);
        }
    }

    setupAuthStateListener() {
        this.supabaseClient.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
                console.log('Session expired or user signed out, redirecting to login...');
                this.redirectToLogin();
            } else if (event === 'SIGNED_IN' && session?.user) {
                console.log('User signed in, updating profile...');
                this.updateUserProfile(session.user);
                await this.updateUserLogin(session.user);
            }
        });
    }

    setupProfileDropdown() {
        const profileBtn = document.getElementById('profileBtn');
        const dropdownMenu = document.getElementById('dropdownMenu');
        const logoutBtn = document.getElementById('logoutBtn');

        if (profileBtn && dropdownMenu) {
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownMenu.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                dropdownMenu.classList.remove('show');
            });

            // Prevent dropdown from closing when clicking inside
            dropdownMenu.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.logout();
            });
        }
    }

    async logout() {
        console.log('Logout initiated');

        // Set a timeout to force logout if Supabase hangs
        const forceLogoutTimer = setTimeout(() => {
            console.log('Force logout due to timeout');
            this.clearStorageAndRedirect();
        }, 3000);

        try {
            console.log('Calling supabase signOut...');
            const result = await this.supabaseClient.auth.signOut();
            console.log('SignOut result:', result);

            clearTimeout(forceLogoutTimer);

            if (result.error) {
                console.error('Logout error:', result.error.message);
            } else {
                console.log('✅ Supabase signOut successful');
            }

            this.clearStorageAndRedirect();

        } catch (err) {
            console.error('Logout exception:', err);
            clearTimeout(forceLogoutTimer);
            this.clearStorageAndRedirect();
        }
    }

    clearStorageAndRedirect() {
        localStorage.clear();
        sessionStorage.clear();
        console.log('Redirecting to login...');
        this.redirectToLogin();
    }

    setupSessionTimeout() {
        // Check session validity every 30 minutes
        setInterval(async () => {
            const { data: { session }, error } = await this.supabaseClient.auth.getSession();
            if (!session || error) {
                console.log('Session check: redirecting to login...');
                this.redirectToLogin();
            }
        }, 30 * 60 * 1000); // 30 minutes
    }

    redirectToLogin() {
        window.location.href = 'index.html';
    }

    // Public method to get current user
    async getCurrentUser() {
        const { data: { session }, error } = await this.supabaseClient.auth.getSession();
        if (error || !session) return null;
        return session.user;
    }

    // Public method to get Supabase client
    getSupabaseClient() {
        return this.supabaseClient;
    }
}

// Initialize auth manager when DOM is loaded
let authManager;
document.addEventListener('DOMContentLoaded', () => {
    authManager = new AuthManager();
    // Export for use in other modules after creation
    window.authManager = authManager;

    // Dispatch custom event to notify other scripts that auth manager is ready
    window.dispatchEvent(new CustomEvent('authManagerReady', { detail: authManager }));
});