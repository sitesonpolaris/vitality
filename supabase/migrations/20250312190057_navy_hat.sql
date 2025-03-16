/*
  # Sync existing auth users to users table

  1. Changes
    - Create function to sync users
    - Add trigger for auto-syncing new users
*/

-- Function to sync auth users to users table
CREATE OR REPLACE FUNCTION sync_auth_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO users (
    id,
    username,
    first_name,
    last_name,
    created_at,
    updated_at
  )
  SELECT 
    id,
    email as username, -- Use email as initial username
    split_part(raw_user_meta_data->>'full_name', ' ', 1) as first_name,
    split_part(raw_user_meta_data->>'full_name', ' ', 2) as last_name,
    created_at,
    now()
  FROM auth.users
  WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE users.id = auth.users.id
  );
END;
$$;

-- Create trigger for new auth users
CREATE OR REPLACE FUNCTION on_auth_user_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO users (
    id,
    username,
    first_name,
    last_name,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.email,
    split_part(NEW.raw_user_meta_data->>'full_name', ' ', 1),
    split_part(NEW.raw_user_meta_data->>'full_name', ' ', 2),
    NEW.created_at,
    now()
  );
  RETURN NEW;
END;
$$;

-- Add trigger to auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION on_auth_user_created();

-- Sync existing users
SELECT sync_auth_users();