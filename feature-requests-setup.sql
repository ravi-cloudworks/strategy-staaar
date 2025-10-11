-- FEATURE REQUESTS TABLE SETUP FOR SUPABASE
-- Run this in Supabase Dashboard → SQL Editor

-- ==========================================
-- 1. CREATE FEATURE REQUESTS TABLE
-- ==========================================

CREATE TABLE feature_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'feature' CHECK (type IN ('feature', 'bug')),
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    upvoter_emails TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- ==========================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ==========================================

-- Index for faster queries by creation date
CREATE INDEX idx_feature_requests_created_at ON feature_requests(created_at DESC);

-- Index for filtering by type
CREATE INDEX idx_feature_requests_type ON feature_requests(type);

-- Index for finding user's own requests
CREATE INDEX idx_feature_requests_created_by ON feature_requests(created_by);

-- GIN index for array operations (upvoter_emails)
CREATE INDEX idx_feature_requests_upvoter_emails ON feature_requests USING GIN(upvoter_emails);

-- ==========================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE feature_requests ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. CREATE RLS POLICIES
-- ==========================================

-- Only authenticated users can VIEW feature requests
CREATE POLICY "Authenticated users can view feature requests"
ON feature_requests FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Authenticated users can CREATE new feature requests
CREATE POLICY "Authenticated users can create feature requests"
ON feature_requests FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Users can UPDATE only their own feature requests (title/description)
CREATE POLICY "Users can update own feature requests"
ON feature_requests FOR UPDATE
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Users can DELETE only their own feature requests
CREATE POLICY "Users can delete own feature requests"
ON feature_requests FOR DELETE
USING (auth.uid() = created_by);

-- ==========================================
-- 5. CREATE VOTING FUNCTIONS (SECURE)
-- ==========================================

-- Function to upvote (add email to array)
CREATE OR REPLACE FUNCTION upvote_feature_request(
    feature_id UUID,
    user_email TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    updated_rows INTEGER;
BEGIN
    UPDATE feature_requests
    SET upvoter_emails = array_append(upvoter_emails, user_email),
        updated_at = NOW()
    WHERE id = feature_id
      AND NOT (user_email = ANY(upvoter_emails));

    GET DIAGNOSTICS updated_rows = ROW_COUNT;
    RETURN updated_rows > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to downvote (remove email from array)
CREATE OR REPLACE FUNCTION downvote_feature_request(
    feature_id UUID,
    user_email TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    updated_rows INTEGER;
BEGIN
    UPDATE feature_requests
    SET upvoter_emails = array_remove(upvoter_emails, user_email),
        updated_at = NOW()
    WHERE id = feature_id
      AND (user_email = ANY(upvoter_emails));

    GET DIAGNOSTICS updated_rows = ROW_COUNT;
    RETURN updated_rows > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 6. CREATE VIEW FOR EASY QUERYING
-- ==========================================

CREATE OR REPLACE VIEW feature_requests_with_stats AS
SELECT
    fr.*,
    array_length(fr.upvoter_emails, 1) AS vote_count,
    COALESCE(ul.name, 'Anonymous') AS creator_name,
    ul.avatar_url AS creator_avatar
FROM feature_requests fr
LEFT JOIN users_login ul ON fr.created_by = ul.user_id
ORDER BY array_length(fr.upvoter_emails, 1) DESC, fr.created_at DESC;

-- ==========================================
-- 7. GRANT PERMISSIONS
-- ==========================================

-- Grant execute permissions on voting functions to authenticated users
GRANT EXECUTE ON FUNCTION upvote_feature_request TO authenticated;
GRANT EXECUTE ON FUNCTION downvote_feature_request TO authenticated;

-- Grant select on view to authenticated users only
GRANT SELECT ON feature_requests_with_stats TO authenticated;

-- ==========================================
-- 8. INSERT SAMPLE DATA (OPTIONAL)
-- ==========================================

-- Uncomment below to add sample feature requests for testing
/*
INSERT INTO feature_requests (title, description, type, created_by) VALUES
('Dark Mode Support', 'Add dark mode theme option for better user experience', 'feature', '00000000-0000-0000-0000-000000000000'),
('Export to PDF Bug', 'PDF export sometimes fails with large documents', 'bug', '00000000-0000-0000-0000-000000000000'),
('Mobile Responsive Design', 'Improve mobile layout and touch interactions', 'feature', '00000000-0000-0000-0000-000000000000');
*/

-- ==========================================
-- NOTES:
-- ==========================================
-- 1. Run each section separately in Supabase SQL Editor
-- 2. Verify each step works before proceeding to next
-- 3. The functions prevent duplicate votes automatically
-- 4. RLS ensures users can only modify their own requests
-- 5. Vote counts are calculated in real-time via array_length()
-- 6. Use the view for displaying feature requests with vote counts
-- ==========================================