# Feature Request Implementation - Step by Step

## 🎯 **Phase 1: Database Setup**

### Step 1: Run SQL Setup
1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy and paste content from `feature-requests-setup.sql`
3. Run **each section separately** (don't run all at once)
4. Verify each step completes without errors

### Step 2: Test Database
```sql
-- Test table creation
SELECT * FROM feature_requests LIMIT 1;

-- Test functions
SELECT upvote_feature_request('00000000-0000-0000-0000-000000000000', 'test@example.com');

-- Test view
SELECT * FROM feature_requests_with_stats;
```

---

## 🎯 **Phase 2: Create HTML Page**

### Step 3: Create feature-request.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <!-- Copy CSP headers from dashboard.html -->
    <meta http-equiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://unpkg.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://docs.opencv.org; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com https://cdn.jsdelivr.net data:; img-src 'self' data: https: blob:; media-src 'self' blob: data:; connect-src 'self' https://*.supabase.co https://www.linkedin.com https://*.linkedin.com; frame-ancestors 'self';">

    <title>Feature Requests - Strategy Staaar</title>

    <!-- External Libraries (same as dashboard.html) -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <script src="https://unpkg.com/@supabase/supabase-js"></script>

    <!-- Copy styles from dashboard.html -->
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/components.css">
</head>
<body>
    <!-- Copy header from dashboard.html -->
    <!-- Add your feature request UI here -->

    <!-- Copy scripts from dashboard.html -->
    <script src="js/utils.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/feature-requests.js"></script>
</body>
</html>
```

---

## 🎯 **Phase 3: Create JavaScript Logic**

### Step 4: Create js/feature-requests.js
```javascript
class FeatureRequestManager {
    constructor() {
        this.supabaseClient = null;
        this.currentUser = null;
        this.featureRequests = [];
    }

    async init() {
        // Wait for auth.js to be ready
        this.supabaseClient = authManager.getSupabaseClient();
        this.currentUser = await authManager.getCurrentUser();

        if (!this.currentUser) {
            console.error('User not authenticated');
            return;
        }

        this.setupEventListeners();
        await this.loadFeatureRequests();
    }

    async loadFeatureRequests() {
        const { data, error } = await this.supabaseClient
            .from('feature_requests_with_stats')
            .select('*');

        if (error) {
            console.error('Error loading feature requests:', error);
            return;
        }

        this.featureRequests = data;
        this.renderFeatureRequests();
    }

    async createFeatureRequest(title, description, type) {
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
            return false;
        }

        await this.loadFeatureRequests(); // Refresh list
        return true;
    }

    async vote(featureId, isUpvote) {
        const functionName = isUpvote ? 'upvote_feature_request' : 'downvote_feature_request';

        const { data, error } = await this.supabaseClient
            .rpc(functionName, {
                feature_id: featureId,
                user_email: this.currentUser.email
            });

        if (error) {
            console.error('Error voting:', error);
            return false;
        }

        await this.loadFeatureRequests(); // Refresh list
        return true;
    }

    setupEventListeners() {
        // Add form submission logic
        // Add vote button click handlers
    }

    renderFeatureRequests() {
        // Render the feature requests list
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait for auth to be ready
    setTimeout(async () => {
        if (window.authManager) {
            const featureManager = new FeatureRequestManager();
            await featureManager.init();
        }
    }, 500);
});
```

---

## 🎯 **Phase 4: UI Implementation**

### Step 5: HTML Structure
- **Left Panel**: Form (title, description, type selector, submit button)
- **Right Panel**: Feature list (title, description, vote count, vote button)
- **Header**: Copy from dashboard.html (with user profile)

### Step 6: Styling
- Use existing CSS classes from dashboard.html
- Match the design from screenshot you provided
- Simple, clean layout

---

## 🎯 **Phase 5: Testing & Deployment**

### Step 7: Test Functionality
1. **Authentication**: Ensure email is accessible
2. **Create**: Test feature request creation
3. **Vote**: Test upvote/downvote functionality
4. **Display**: Test vote counts and user display

### Step 8: Add Navigation
- Add link to feature-request.html in dashboard.html header
- Add link in index.html navigation

### Step 9: Deploy
- Commit changes to dev branch
- GitHub Actions will deploy automatically

---

## 🔧 **Key Implementation Notes**

### Authentication Pattern:
```javascript
// Get current user email (available after auth.js loads)
const user = await authManager.getCurrentUser();
const email = user.email;
```

### Voting Logic:
```javascript
// Upvote
await supabaseClient.rpc('upvote_feature_request', {
    feature_id: 'uuid-here',
    user_email: 'user@example.com'
});

// Check if user already voted
const hasVoted = featureRequest.upvoter_emails?.includes(currentUser.email);
```

### Display Vote Count:
```javascript
const voteCount = featureRequest.vote_count || 0;
```

---

## ✅ **Success Criteria**
- [ ] Database tables created with RLS
- [ ] HTML page loads with authentication
- [ ] Users can create feature requests
- [ ] Users can vote on feature requests
- [ ] Vote counts display correctly
- [ ] Email tracking works for priority analysis

**Ready to start? Begin with Phase 1 - Database Setup!**