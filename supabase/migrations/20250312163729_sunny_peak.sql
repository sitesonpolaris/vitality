/*
  # Create user profiles view

  1. New View
    - Creates a view `user_profiles` that combines:
      - Auth user data (email, status, role)
      - Profile data (username, names)
    - Provides a unified view of user information
    - Includes security through function-based access control

  2. Security
    - Creates a secure function to access the view
    - Restricts access based on user role and permissions
*/

-- Create the view
CREATE OR REPLACE VIEW user_profiles AS
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.last_sign_in_at,
  u.raw_app_meta_data->>'role' as role,
  u.confirmed_at,
  CASE 
    WHEN u.confirmed_at IS NOT NULL THEN 'confirmed'
    ELSE 'pending'
  END as status,
  p.username,
  p.first_name,
  p.last_name,
  p.avatar_url
FROM auth.users u
LEFT JOIN users p ON u.id = p.id;

-- Create a secure function to access the view
CREATE OR REPLACE FUNCTION get_user_profiles()
RETURNS SETOF user_profiles
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF (SELECT auth.jwt() ->> 'role' = 'admin') THEN
    -- Admins can see all profiles
    RETURN QUERY SELECT * FROM user_profiles;
  ELSE
    -- Regular users can only see their own profile
    RETURN QUERY 
    SELECT * FROM user_profiles 
    WHERE id = auth.uid();
  END IF;
END;
$$;