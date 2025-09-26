# Supabase Feedback System Setup Guide

## 📋 Overview

This guide will help you set up the complete feedback system with Supabase backend, working with your existing LinkedIn authentication system without breaking it.

## 🗄️ Database Tables

### 1. **users_login** (Your Existing Table - Extended)
- Your existing LinkedIn authentication table, now extended with role information
- **New Columns Added:**
  - `role` (TEXT: 'user', 'admin', 'moderator') - Default: 'user'
  - `updated_at` (TIMESTAMP) - For tracking role changes
- **Existing Columns Used:**
  - `user_id` (TEXT, Primary Key) - Links to auth.users.id
  - `email` (TEXT, NOT NULL)
  - `name` (TEXT) - User's full name from LinkedIn
  - `avatar_url` (TEXT) - Profile picture from LinkedIn

### 2. **feedback_requests**
- Main table for feature requests, bugs, and feedback
- **Columns:**
  - `id` (UUID, Primary Key)
  - `title` (TEXT, NOT NULL, 3-200 chars)
  - `description` (TEXT, NOT NULL, 10-2000 chars)
  - `type` (TEXT: 'feature', 'bug', 'feedback')
  - `status` (TEXT: 'pending', 'in-progress', 'completed', 'duplicate', 'out-of-scope')
  - `priority` (INTEGER, for admin sorting)
  - `created_by` (TEXT, Foreign Key to users_login.user_id)
  - `assigned_to` (TEXT, Foreign Key to users_login.user_id, nullable)
  - `votes_count` (INTEGER, denormalized for performance)
  - `created_at`, `updated_at`, `completed_at` (TIMESTAMP)

### 3. **feedback_votes**
- Tracks individual votes to prevent duplicate voting
- **Columns:**
  - `id` (UUID, Primary Key)
  - `request_id` (UUID, Foreign Key to feedback_requests)
  - `user_id` (TEXT, Foreign Key to users_login.user_id)
  - `created_at` (TIMESTAMP)
- **Constraint:** UNIQUE(request_id, user_id) - one vote per user per request

### 4. **feedback_comments** (Optional)
- For admin/user comments on requests
- **Columns:**
  - `id` (UUID, Primary Key)
  - `request_id` (UUID, Foreign Key to feedback_requests)
  - `user_id` (TEXT, Foreign Key to users_login.user_id)
  - `comment` (TEXT, NOT NULL, 1-1000 chars)
  - `is_internal` (BOOLEAN, admin-only comments)
  - `created_at`, `updated_at` (TIMESTAMP)

### 5. **feedback_status_history**
- Audit trail for status changes
- **Columns:**
  - `id` (UUID, Primary Key)
  - `request_id` (UUID, Foreign Key to feedback_requests)
  - `old_status`, `new_status` (TEXT)
  - `changed_by` (TEXT, Foreign Key to users_login.user_id)
  - `change_reason` (TEXT, optional)
  - `created_at` (TIMESTAMP)

## 🔧 Setup Instructions

### Step 1: ✅ Supabase Project (Already Done)
You already have a Supabase project with LinkedIn authentication working. We'll extend it.

### Step 2: Run Database Schema
1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the script to:
   - Add `role` and `updated_at` columns to your existing `users_login` table
   - Create all feedback tables, functions, and policies
   - Set up Row Level Security

### Step 3: ✅ Authentication (Already Done)
Your LinkedIn authentication is already working perfectly. No changes needed.

### Step 4: Set Admin Users
After running the schema, make yourself an admin:

```sql
-- Update your user to admin (replace with your email)
UPDATE public.users_login
SET role = 'admin'
WHERE email = 'your-email@domain.com';
```

### Step 5: Update Frontend Configuration
1. Your Supabase credentials are already in `login.html`
2. Update `feedback.html` to use the Supabase version:

```html
<!-- Replace this line -->
<script src="js/feedback.js"></script>
<!-- With this -->
<script src="js/feedback-supabase.js"></script>
```

3. Update the Supabase credentials in `feedback-supabase.js` to match your existing ones from `login.html`

## 🔐 Admin Role Management

### How Admin Role is Defined:
1. **Database Level:** In `users_login.role` column (your existing table)
2. **Valid Roles:**
   - `'user'` - Regular user (default)
   - `'admin'` - Full administrative access
   - `'moderator'` - Limited admin access

### Admin Privileges:
- ✅ Can see all status types (including 'duplicate', 'out-of-scope')
- ✅ Can change status of any feedback request
- ✅ Can view admin statistics
- ✅ Can promote other users to admin
- ✅ Can delete requests
- ✅ Can view internal comments and status history

### User Privileges:
- ✅ Can submit feedback requests
- ✅ Can vote on requests (once per request)
- ✅ Can edit their own requests
- ✅ Can view limited status types ('pending', 'in-progress', 'completed')
- ❌ Cannot see 'duplicate' or 'out-of-scope' requests
- ❌ Cannot change request status

## 🛡️ Security Features

### Row Level Security (RLS)
All tables have RLS enabled with appropriate policies:

**User Profiles:**
- Users can view all profiles
- Users can update only their own profile
- Admins can update any profile

**Feedback Requests:**
- Users see filtered requests (no admin-only statuses)
- Admins see all requests
- Users can only edit their own requests
- Admins can edit any request

**Votes:**
- Users can view all votes
- Users can only create/delete their own votes

### Data Validation:
- Title: 3-200 characters
- Description: 10-2000 characters
- Type: Must be 'feature', 'bug', or 'feedback'
- Status: Must be one of defined values
- Unique votes per user per request

## 🎯 API Usage Examples

### Submit Feedback Request:
```javascript
const { data, error } = await supabase
  .from('feedback_requests')
  .insert([{
    title: 'New feature request',
    description: 'Detailed description...',
    type: 'feature',
    created_by: user.id
  }]);
```

### Vote on Request:
```javascript
const { error } = await supabase
  .from('feedback_votes')
  .insert([{
    request_id: 'request-uuid',
    user_id: user.id
  }]);
```

### Update Status (Admin Only):
```javascript
const { error } = await supabase
  .from('feedback_requests')
  .update({ status: 'in-progress' })
  .eq('id', 'request-uuid');
```

### Get Requests with Details:
```javascript
const { data, error } = await supabase
  .from('feedback_requests_with_details')
  .select('*')
  .order('votes_count', { ascending: false });
```

## 📊 Admin Functions

### Promote User to Admin:
```sql
SELECT promote_user_to_admin('user@example.com');
```

### Get Admin Statistics:
```sql
SELECT get_admin_stats();
```

## 🔄 Automatic Features

### Auto-Updated Vote Counts:
- Triggers automatically update `votes_count` when votes are added/removed
- No manual count updates needed

### Status Change Tracking:
- All status changes are automatically logged in `feedback_status_history`
- Includes who made the change and when

### User Profile Creation:
- Profiles are automatically created when users sign up
- Uses email and name from auth metadata

## 🚀 Going Live

### Environment Variables:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### Production Checklist:
- ✅ Update Supabase URLs in code
- ✅ Set up custom domain authentication
- ✅ Configure email templates
- ✅ Set up admin users
- ✅ Test all user flows
- ✅ Enable real-time subscriptions if needed

## 🔔 Real-time Updates (Optional)

To enable real-time updates when new feedback is submitted:

```javascript
// Subscribe to new feedback requests
supabase
  .channel('feedback_requests')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'feedback_requests' },
    (payload) => {
      // Refresh the display
      this.loadRequests();
    }
  )
  .subscribe();
```

## 📞 Support

For issues with this setup:
1. Check Supabase logs in Dashboard > Logs
2. Verify RLS policies are working correctly
3. Test with different user roles
4. Check browser console for JavaScript errors

The system is designed to be secure by default and scalable for production use.