-- FEATURE REQUESTS UPDATE - Auto-Upvote Creator & Auto-Delete at 0 Votes
-- Run this in Supabase Dashboard → SQL Editor AFTER the initial setup

-- ==========================================
-- 1. CREATE AUTO-UPVOTE TRIGGER (Option C)
-- ==========================================

-- Function to automatically upvote creator when feature request is created
CREATE OR REPLACE FUNCTION auto_upvote_creator()
RETURNS TRIGGER AS $$
DECLARE
    creator_email TEXT;
BEGIN
    -- Get creator's email from users_login table
    SELECT email INTO creator_email
    FROM auth.users
    WHERE id = NEW.created_by;

    -- If email found, add to upvoter_emails array
    IF creator_email IS NOT NULL THEN
        NEW.upvoter_emails = array_append(NEW.upvoter_emails, creator_email);
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-upvote on INSERT
CREATE TRIGGER trigger_auto_upvote_creator
    BEFORE INSERT ON feature_requests
    FOR EACH ROW
    EXECUTE FUNCTION auto_upvote_creator();

-- ==========================================
-- 2. CREATE AUTO-DELETE TRIGGER (Option B)
-- ==========================================

-- Function to auto-delete feature request when vote count reaches 0
CREATE OR REPLACE FUNCTION auto_delete_zero_votes()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if upvoter_emails array is empty or null
    IF array_length(NEW.upvoter_emails, 1) IS NULL OR array_length(NEW.upvoter_emails, 1) = 0 THEN
        -- Delete the feature request
        DELETE FROM feature_requests WHERE id = NEW.id;
        RETURN NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-delete on UPDATE
CREATE TRIGGER trigger_auto_delete_zero_votes
    AFTER UPDATE ON feature_requests
    FOR EACH ROW
    EXECUTE FUNCTION auto_delete_zero_votes();

-- ==========================================
-- 3. UPDATE VOTING FUNCTIONS (Enhanced)
-- ==========================================

-- Enhanced upvote function (prevents creator from voting twice)
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

-- Enhanced downvote function (with auto-delete support)
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

    -- Note: Auto-delete trigger will handle deletion if vote count becomes 0

    RETURN updated_rows > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 4. TEST THE NEW FUNCTIONALITY
-- ==========================================

-- Test auto-upvote: Create a test feature request
-- (Uncomment to test - replace with real user ID)
/*
INSERT INTO feature_requests (title, description, type, created_by)
VALUES ('Test Auto-Upvote', 'This should automatically have 1 vote', 'feature', 'YOUR_USER_ID_HERE');

-- Check if it has 1 vote automatically
SELECT title, array_length(upvoter_emails, 1) as vote_count, upvoter_emails
FROM feature_requests
WHERE title = 'Test Auto-Upvote';
*/

-- Test auto-delete: Remove all votes from a feature request
-- (This should delete the feature request automatically)
/*
UPDATE feature_requests
SET upvoter_emails = ARRAY[]::TEXT[]
WHERE title = 'Test Auto-Upvote';

-- Check if it was deleted
SELECT COUNT(*) FROM feature_requests WHERE title = 'Test Auto-Upvote';
-- Should return 0
*/

-- ==========================================
-- 5. VERIFY TRIGGERS ARE ACTIVE
-- ==========================================

-- Check if triggers are created
SELECT
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'feature_requests';

-- ==========================================
-- NOTES:
-- ==========================================
-- 1. New feature requests automatically start with 1 vote (creator's)
-- 2. When vote count reaches 0, feature request is automatically deleted
-- 3. Creator can downvote their own request to delete it
-- 4. Triggers work automatically - no code changes needed
-- 5. Test with sample data to verify behavior
-- ==========================================