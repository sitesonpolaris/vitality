/*
  # Make user_profiles view editable

  1. Changes
    - Drop existing function and view
    - Create new trigger function
    - Create new editable view
    - Add trigger for handling updates
*/

-- Drop the function that depends on the view first
DROP FUNCTION IF EXISTS get_user_profiles();

-- Drop existing view
DROP VIEW IF EXISTS user_profiles;

-- Create trigger function
CREATE OR REPLACE FUNCTION sync_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Update or insert into users table
    INSERT INTO users (
      id,
      username,
      first_name,
      last_name,
      avatar_url,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.username,
      NEW.first_name,
      NEW.last_name,
      NEW.avatar_url,
      now()
    )
    ON CONFLICT (id) DO UPDATE SET
      username = EXCLUDED.username,
      first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      avatar_url = EXCLUDED.avatar_url,
      updated_at = now();
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    DELETE FROM users WHERE id = OLD.id;
    RETURN OLD;
  END IF;
END;
$$;

-- Create new editable view
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

-- Make view editable
CREATE TRIGGER user_profiles_trigger
INSTEAD OF INSERT OR UPDATE OR DELETE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION sync_user_profile();

-- Recreate the get_user_profiles function
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