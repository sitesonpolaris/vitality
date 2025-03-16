/*
  # Add admin access to customer info (if not exists)

  1. Changes
    - Add RLS policy to allow admins to read all customer info (if not exists)
    - Uses DO block to check for existing policy
    - Maintains existing policies for authenticated users

  2. Security
    - Admins can read all customer info
    - Regular users can still only read/write their own info
*/

DO $$ 
BEGIN
  -- Check if the policy doesn't exist before creating it
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'customer_info' 
      AND policyname = 'Admins can read all customer info'
  ) THEN
    CREATE POLICY "Admins can read all customer info" ON customer_info
      FOR SELECT
      TO authenticated
      USING (
        auth.jwt() ->> 'role' = 'admin'
      );
  END IF;
END $$;