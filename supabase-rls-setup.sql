-- SUPABASE ROW LEVEL SECURITY SETUP
-- Run this in Supabase Dashboard → SQL Editor

-- ==========================================
-- 1. ENABLE RLS ON USERS_LOGIN TABLE
-- ==========================================
ALTER TABLE users_login ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. CREATE RLS POLICIES FOR USERS_LOGIN
-- ==========================================

-- Users can view only their own profile
CREATE POLICY "Users can view own profile"
ON users_login FOR SELECT
USING (auth.uid() = user_id);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile"
ON users_login FOR UPDATE
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON users_login FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 3. VERIFY RLS IS WORKING
-- ==========================================

-- Test: Try to select data without being authenticated
-- This should return ZERO rows if RLS is working
SELECT * FROM users_login;

-- Check which tables DON'T have RLS enabled (should be empty)
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public'
AND tablename NOT IN (
  SELECT tablename
  FROM pg_policies
)
AND rowsecurity = false;

-- ==========================================
-- 4. ADD RLS TO ANY OTHER TABLES YOU CREATE
-- ==========================================

-- Template for any future tables:
-- ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "Users can access own data"
-- ON your_table_name FOR ALL
-- USING (auth.uid() = user_id);

-- ==========================================
-- NOTES:
-- 1. Run each section separately in Supabase SQL Editor
-- 2. Verify each step works before proceeding
-- 3. Test with a real user login to confirm RLS blocks cross-user access
-- ==========================================