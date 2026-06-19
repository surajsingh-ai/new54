-- Migration: Helper function to assign admin role to a user
-- This function can be used to grant admin access to any user

-- Function to assign admin role (bypasses RLS for initial setup)
CREATE OR REPLACE FUNCTION public.assign_admin_role(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Get user ID from email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Insert or update admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
END;
$$;

-- Function to assign admin role by user ID
CREATE OR REPLACE FUNCTION public.assign_admin_role_by_id(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_uuid) THEN
    RAISE EXCEPTION 'User with ID % not found', user_uuid;
  END IF;
  
  -- Insert or update admin role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_uuid, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN TRUE;
END;
$$;

-- Grant execute permission to authenticated users (for admin use)
GRANT EXECUTE ON FUNCTION public.assign_admin_role(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_admin_role_by_id(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_admin_role(TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.assign_admin_role_by_id(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.assign_admin_role(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.assign_admin_role_by_id(UUID) TO anon;

-- Create a policy that allows service_role to insert admin roles (for initial setup)
-- This is a temporary policy for setup purposes
CREATE POLICY IF NOT EXISTS "Service role can insert admin roles for setup"
ON public.user_roles FOR INSERT
TO service_role
WITH CHECK (true);

