/*
  # Add admin role check function

  1. New Functions
    - is_admin: Checks if the current user has admin role
    - get_user_role: Gets the role of a specific user

  2. Security
    - Functions are security definer to ensure proper access control
*/

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_app_meta_data->>'role' = 'admin'
  );
END;
$$;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT raw_app_meta_data->>'role'
    FROM auth.users 
    WHERE id = user_id
  );
END;
$$;