-- ============================================
-- DIRECT INSERT METHOD (No function needed)
-- This is the simplest method - just run this!
-- ============================================

-- This directly inserts the admin role, bypassing RLS by using service_role context
-- Run this entire block in Supabase SQL Editor

-- Insert admin role for thakursuraj5454@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT 
  u.id as user_id,
  'admin'::app_role as role
FROM auth.users u
WHERE u.email = 'thakursuraj5454@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING
RETURNING *;

-- Verify it worked
SELECT 
  ur.id,
  ur.user_id,
  ur.role,
  u.email,
  u.created_at as user_created_at
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin' AND u.email = 'thakursuraj5454@gmail.com';

-- If you see your email above, SUCCESS!
-- Now:
-- 1. Log out from your website
-- 2. Go to /auth page
-- 3. Click "Admin" tab
-- 4. Log in with your credentials
-- 5. You should now access the admin dashboard!

