/*
  # Update user profile management

  1. Changes
    - Drop existing policies that conflict
    - Add new policies for profile management
    - Add functions for profile updates
    - Add triggers for profile synchronization
*/

-- Drop existing policies if they exist
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can update own profile" ON users;
  DROP POLICY IF EXISTS "Users can read own profile" ON users;
  DROP POLICY IF EXISTS "Admins can read all profiles" ON users;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Function to validate profile updates
CREATE OR REPLACE FUNCTION validate_profile_update(
  p_user_id uuid,
  p_username text,
  p_first_name text,
  p_last_name text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if username is taken by another user
  IF EXISTS (
    SELECT 1 FROM users 
    WHERE username = p_username 
    AND id != p_user_id
  ) THEN
    RAISE EXCEPTION 'Username already taken';
  END IF;

  RETURN true;
END;
$$;

-- Function to update user profile
CREATE OR REPLACE FUNCTION update_user_profile(
  p_username text,
  p_first_name text,
  p_last_name text,
  p_avatar_url text DEFAULT NULL
)
RETURNS TABLE (
  success boolean,
  message text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- Validate the update
  IF validate_profile_update(v_user_id, p_username, p_first_name, p_last_name) THEN
    -- Update the profile
    UPDATE users
    SET
      username = p_username,
      first_name = p_first_name,
      last_name = p_last_name,
      avatar_url = COALESCE(p_avatar_url, avatar_url),
      updated_at = now()
    WHERE id = v_user_id;

    RETURN QUERY SELECT 
      true AS success,
      'Profile updated successfully'::text AS message;
  END IF;

EXCEPTION
  WHEN others THEN
    RETURN QUERY SELECT 
      false AS success,
      SQLERRM AS message;
END;
$$;

-- Add trigger to sync profile changes
CREATE OR REPLACE FUNCTION sync_profile_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Update auth.users metadata if needed
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(
      raw_user_meta_data,
      '{full_name}',
      to_jsonb(NEW.first_name || ' ' || NEW.last_name)
    )
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- Add trigger to users table
CREATE TRIGGER sync_profile_changes_trigger
  AFTER UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION sync_profile_changes();

-- Create new policies
CREATE POLICY "Users can update own profile v2"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own profile v2"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles v2"
  ON users
  FOR SELECT
  TO admin
  USING (true);