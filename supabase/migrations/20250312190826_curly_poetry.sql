/*
  # Add admin user

  1. Changes
    - Updates the role for mr.shepeard@gmail.com to admin
    - Ensures idempotency by checking if update is needed
*/

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the user ID for the email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'mr.shepeard@gmail.com';

  -- If user exists, update their role to admin
  IF v_user_id IS NOT NULL THEN
    UPDATE auth.users
    SET raw_app_meta_data = 
      CASE 
        WHEN raw_app_meta_data IS NULL THEN 
          jsonb_build_object('role', 'admin')
        ELSE 
          jsonb_set(
            raw_app_meta_data,
            '{role}',
            '"admin"'
          )
      END
    WHERE id = v_user_id;
  END IF;
END $$;