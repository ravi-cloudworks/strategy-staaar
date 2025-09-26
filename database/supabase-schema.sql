-- ====================================
-- SUPABASE DATABASE SCHEMA FOR FEEDBACK SYSTEM (FIXED)
-- ====================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================
-- 1. EXTEND EXISTING USERS_LOGIN TABLE
-- ====================================
-- Add admin role column to your existing users_login table
-- This preserves your LinkedIn integration while adding feedback system support

-- First, let's add the role column to users_login (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'users_login' AND column_name = 'role') THEN
        ALTER TABLE public.users_login
        ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'));
    END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'users_login' AND column_name = 'updated_at') THEN
        ALTER TABLE public.users_login
        ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- ====================================
-- 2. FEEDBACK REQUESTS TABLE
-- ====================================
CREATE TABLE public.feedback_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('feature', 'bug', 'feedback')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'duplicate', 'out-of-scope')),
    priority INTEGER DEFAULT 0, -- For admin sorting
    created_by UUID REFERENCES public.users_login(user_id) ON DELETE CASCADE NOT NULL, -- Use your existing users_login table
    assigned_to UUID REFERENCES public.users_login(user_id) ON DELETE SET NULL, -- Admin can assign requests
    votes_count INTEGER DEFAULT 0, -- Denormalized for performance
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE, -- When status changed to completed

    -- Indexes for performance
    CONSTRAINT feedback_requests_title_length CHECK (char_length(title) >= 3 AND char_length(title) <= 200),
    CONSTRAINT feedback_requests_description_length CHECK (char_length(description) >= 10 AND char_length(description) <= 2000)
);

-- ====================================
-- 3. FEEDBACK VOTES TABLE
-- ====================================
-- Tracks individual votes to prevent duplicate voting
CREATE TABLE public.feedback_votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    request_id UUID REFERENCES public.feedback_requests(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users_login(user_id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure one vote per user per request
    UNIQUE(request_id, user_id)
);

-- ====================================
-- 4. FEEDBACK COMMENTS TABLE (Optional)
-- ====================================
-- For future enhancement - admin/user comments on requests
CREATE TABLE public.feedback_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    request_id UUID REFERENCES public.feedback_requests(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users_login(user_id) ON DELETE CASCADE NOT NULL,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false, -- Admin-only comments
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT feedback_comments_length CHECK (char_length(comment) >= 1 AND char_length(comment) <= 1000)
);

-- ====================================
-- 5. FEEDBACK STATUS HISTORY TABLE
-- ====================================
-- Track status changes for audit trail
CREATE TABLE public.feedback_status_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    request_id UUID REFERENCES public.feedback_requests(id) ON DELETE CASCADE NOT NULL,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES public.users_login(user_id) ON DELETE SET NULL,
    change_reason TEXT, -- Optional reason for status change
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- INDEXES FOR PERFORMANCE
-- ====================================

-- Feedback requests indexes
CREATE INDEX idx_feedback_requests_created_by ON public.feedback_requests(created_by);
CREATE INDEX idx_feedback_requests_status ON public.feedback_requests(status);
CREATE INDEX idx_feedback_requests_type ON public.feedback_requests(type);
CREATE INDEX idx_feedback_requests_created_at ON public.feedback_requests(created_at DESC);
CREATE INDEX idx_feedback_requests_votes_count ON public.feedback_requests(votes_count DESC);

-- Feedback votes indexes
CREATE INDEX idx_feedback_votes_request_id ON public.feedback_votes(request_id);
CREATE INDEX idx_feedback_votes_user_id ON public.feedback_votes(user_id);

-- Users login indexes
CREATE INDEX idx_users_login_role ON public.users_login(role);
CREATE INDEX idx_users_login_email ON public.users_login(email);

-- ====================================
-- FUNCTIONS AND TRIGGERS
-- ====================================

-- Function to update votes count when vote is added/removed
CREATE OR REPLACE FUNCTION update_votes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.feedback_requests
        SET votes_count = votes_count + 1,
            updated_at = NOW()
        WHERE id = NEW.request_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.feedback_requests
        SET votes_count = GREATEST(votes_count - 1, 0),
            updated_at = NOW()
        WHERE id = OLD.request_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update votes count
CREATE TRIGGER trigger_update_votes_count
    AFTER INSERT OR DELETE ON public.feedback_votes
    FOR EACH ROW EXECUTE FUNCTION update_votes_count();

-- Function to track status changes
CREATE OR REPLACE FUNCTION track_status_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        -- Get current user from session
        INSERT INTO public.feedback_status_history (
            request_id,
            old_status,
            new_status,
            changed_by
        ) VALUES (
            NEW.id,
            OLD.status,
            NEW.status,
            auth.uid()::UUID
        );

        -- Set completed_at when status changes to completed
        IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
            NEW.completed_at = NOW();
        ELSIF NEW.status != 'completed' THEN
            NEW.completed_at = NULL;
        END IF;
    END IF;

    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to track status changes
CREATE TRIGGER trigger_track_status_changes
    BEFORE UPDATE ON public.feedback_requests
    FOR EACH ROW EXECUTE FUNCTION track_status_changes();

-- ====================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================

-- Enable RLS on feedback tables
ALTER TABLE public.feedback_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_status_history ENABLE ROW LEVEL SECURITY;

-- Feedback Requests Policies
CREATE POLICY "Anyone can view non-hidden requests" ON public.feedback_requests
    FOR SELECT USING (
        -- Regular users can't see admin-only statuses
        CASE
            WHEN EXISTS (
                SELECT 1 FROM public.users_login
                WHERE user_id = auth.uid()::UUID AND role IN ('admin', 'moderator')
            ) THEN true
            ELSE status NOT IN ('duplicate', 'out-of-scope')
        END
    );

CREATE POLICY "Authenticated users can create requests" ON public.feedback_requests
    FOR INSERT WITH CHECK (auth.uid()::UUID = created_by);

CREATE POLICY "Users can update own requests" ON public.feedback_requests
    FOR UPDATE USING (auth.uid()::UUID = created_by)
    WITH CHECK (auth.uid()::UUID = created_by);

CREATE POLICY "Admins can update any request" ON public.feedback_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users_login
            WHERE user_id = auth.uid()::UUID AND role IN ('admin', 'moderator')
        )
    );

CREATE POLICY "Admins can delete requests" ON public.feedback_requests
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.users_login
            WHERE user_id = auth.uid()::UUID AND role = 'admin'
        )
    );

-- Feedback Votes Policies
CREATE POLICY "Users can view all votes" ON public.feedback_votes
    FOR SELECT USING (true);

CREATE POLICY "Users can insert own votes" ON public.feedback_votes
    FOR INSERT WITH CHECK (auth.uid()::UUID = user_id);

CREATE POLICY "Users can delete own votes" ON public.feedback_votes
    FOR DELETE USING (auth.uid()::UUID = user_id);

-- Feedback Comments Policies
CREATE POLICY "Users can view public comments" ON public.feedback_comments
    FOR SELECT USING (
        NOT is_internal OR
        EXISTS (
            SELECT 1 FROM public.users_login
            WHERE user_id = auth.uid()::UUID AND role IN ('admin', 'moderator')
        )
    );

CREATE POLICY "Authenticated users can create comments" ON public.feedback_comments
    FOR INSERT WITH CHECK (auth.uid()::UUID = user_id);

CREATE POLICY "Users can update own comments" ON public.feedback_comments
    FOR UPDATE USING (auth.uid()::UUID = user_id);

-- Status History Policies
CREATE POLICY "Admins can view status history" ON public.feedback_status_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users_login
            WHERE user_id = auth.uid()::UUID AND role IN ('admin', 'moderator')
        )
    );

-- ====================================
-- HELPER VIEWS
-- ====================================

-- View for feedback requests with user details and vote information
CREATE VIEW public.feedback_requests_with_details AS
SELECT
    fr.*,
    ul.name AS creator_name,
    ul.email AS creator_email,
    ul.avatar_url AS creator_avatar,
    COALESCE(v.user_votes, '[]'::json) AS voters,
    EXISTS (
        SELECT 1 FROM public.feedback_votes fv
        WHERE fv.request_id = fr.id AND fv.user_id = auth.uid()::UUID
    ) AS user_has_voted
FROM public.feedback_requests fr
LEFT JOIN public.users_login ul ON fr.created_by = ul.user_id
LEFT JOIN (
    SELECT
        fv.request_id,
        json_agg(
            json_build_object(
                'user_id', fv.user_id,
                'user_name', uvl.name,
                'user_email', uvl.email,
                'user_avatar', uvl.avatar_url,
                'voted_at', fv.created_at
            )
        ) AS user_votes
    FROM public.feedback_votes fv
    LEFT JOIN public.users_login uvl ON fv.user_id = uvl.user_id
    GROUP BY fv.request_id
) v ON fr.id = v.request_id;

-- ====================================
-- ADMIN FUNCTIONS
-- ====================================

-- Function to promote user to admin (only callable by existing admins)
CREATE OR REPLACE FUNCTION promote_user_to_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    current_user_role TEXT;
BEGIN
    -- Check if current user is admin
    SELECT role INTO current_user_role
    FROM public.users_login
    WHERE user_id = auth.uid()::UUID;

    IF current_user_role != 'admin' THEN
        RAISE EXCEPTION 'Only admins can promote users';
    END IF;

    -- Update user role
    UPDATE public.users_login
    SET role = 'admin', updated_at = NOW()
    WHERE email = user_email;

    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get admin statistics
CREATE OR REPLACE FUNCTION get_admin_stats()
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    -- Check if current user is admin
    IF NOT EXISTS (
        SELECT 1 FROM public.users_login
        WHERE user_id = auth.uid()::UUID AND role IN ('admin', 'moderator')
    ) THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    SELECT json_build_object(
        'total_requests', COUNT(*),
        'pending_requests', COUNT(*) FILTER (WHERE status = 'pending'),
        'in_progress_requests', COUNT(*) FILTER (WHERE status = 'in-progress'),
        'completed_requests', COUNT(*) FILTER (WHERE status = 'completed'),
        'total_votes', COALESCE(SUM(votes_count), 0),
        'total_users', (SELECT COUNT(*) FROM public.users_login),
        'admin_users', (SELECT COUNT(*) FROM public.users_login WHERE role = 'admin')
    ) INTO stats
    FROM public.feedback_requests;

    RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================
-- SAMPLE DATA (Optional - for testing)
-- ====================================

-- To make someone an admin, update their role in users_login table
-- This should be done after they have logged in at least once via your LinkedIn system

-- Example: Update a user to admin role
-- UPDATE public.users_login
-- SET role = 'admin'
-- WHERE email = 'your-admin-email@domain.com';

-- Or use the function:
-- SELECT promote_user_to_admin('your-admin-email@domain.com');