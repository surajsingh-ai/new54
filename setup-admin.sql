-- Quick Setup: Assign Admin Role to Your Account
-- Copy and paste this into Supabase SQL Editor

-- ============================================
-- METHOD 1: Direct Insert (Bypasses RLS)
-- ============================================
-- This method works even if the function doesn't exist yet

-- Step 1: Find your user ID
SELECT id, email FROM auth.users WHERE email = 'thakursuraj5454@gmail.com';

-- Step 2: Copy the ID from above and use it here (replace YOUR_USER_ID_HERE)
-- Then run this to assign admin role:
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'thakursuraj5454@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================
-- METHOD 2: Using Function (If migration was run)
-- ============================================
-- If the migration function exists, you can use this:
-- SELECT public.assign_admin_role('thakursuraj5454@gmail.com');

-- ============================================
-- VERIFY: Check if admin role was assigned
-- ============================================
SELECT 
  ur.id,
  ur.user_id,
  ur.role,
  u.email,
  u.created_at as user_created_at
FROM public.user_roles ur
JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin' AND u.email = 'thakursuraj5454@gmail.com';

-- If you see your email in the results, the admin role has been assigned successfully!

-- ============================================
-- NEXT STEPS
-- ============================================
-- 1. Log out from your website (if logged in)
-- 2. Log back in using the Admin tab
-- 3. You should now be able to access the admin dashboard

