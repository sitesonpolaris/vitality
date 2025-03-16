/*
  # Fix user creation and synchronization

  1. Changes
    - Drop existing trigger that might conflict
    - Create improved user creation trigger
    - Add proper error handling
    - Ensure proper order of operations

  2. Security
    - Maintain existing RLS policies
    - Keep security context for trigger functions
*/

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create improved trigger function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_profile_exists boolean;
BEGIN
  -- Check if profile already exists
  SELECT EXISTS (
    SELECT 1 FROM public.users WHERE id = NEW.id
  ) INTO v_profile_exists;

  -- Only create profile if it doesn't exist
  IF NOT v_profile_exists THEN
    INSERT INTO public.users (
      id,
      username,
      first_name,
      last_name,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.email,
      split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), ' ', 1),
      split_part(COALESCE(NEW.raw_user_meta_data->>'full_name', ''), ' ', 2),
      NEW.created_at,
      now()
    );
  END IF;

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    -- Log error details
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Ensure existing users have profiles
INSERT INTO public.users (
  id,
  username,
  first_name,
  last_name,
  created_at,
  updated_at
)
SELECT
  id,
  email as username,
  split_part(COALESCE(raw_user_meta_data->>'full_name', email), ' ', 1) as first_name,
  split_part(COALESCE(raw_user_meta_data->>'full_name', ''), ' ', 2) as last_name,
  created_at,
  now()
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE users.id = auth.users.id
);
