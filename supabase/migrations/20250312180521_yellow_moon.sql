/*
  # Add customer information storage

  1. New Tables
    - `customer_info`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `street` (text)
      - `city` (text)
      - `state` (text)
      - `postal_code` (text)
      - `country` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `customer_info` table
    - Add policies for:
      - Users can read/update their own info
      - Admins can read all customer info

  3. Functions
    - get_customer_info: Retrieves customer information
    - upsert_customer_info: Creates or updates customer information
*/

-- Create customer_info table
CREATE TABLE IF NOT EXISTS customer_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  street text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text NOT NULL,
  country text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE customer_info ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own customer info"
  ON customer_info
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own customer info"
  ON customer_info
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own customer info"
  ON customer_info
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can read all customer info"
  ON customer_info
  FOR SELECT
  TO admin
  USING (true);

-- Create indexes
CREATE INDEX customer_info_user_id_idx ON customer_info(user_id);
CREATE INDEX customer_info_email_idx ON customer_info(email);

-- Create function to get customer info
CREATE OR REPLACE FUNCTION get_customer_info()
RETURNS TABLE (
  id uuid,
  full_name text,
  email text,
  phone text,
  street text,
  city text,
  state text,
  postal_code text,
  country text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ci.id,
    ci.full_name,
    ci.email,
    ci.phone,
    ci.street,
    ci.city,
    ci.state,
    ci.postal_code,
    ci.country
  FROM customer_info ci
  WHERE ci.user_id = auth.uid();
END;
$$;

-- Create function to upsert customer info
CREATE OR REPLACE FUNCTION upsert_customer_info(
  p_full_name text,
  p_email text,
  p_phone text,
  p_street text,
  p_city text,
  p_state text,
  p_postal_code text,
  p_country text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_customer_id uuid;
BEGIN
  -- Insert or update customer info
  INSERT INTO customer_info (
    user_id,
    full_name,
    email,
    phone,
    street,
    city,
    state,
    postal_code,
    country
  ) VALUES (
    auth.uid(),
    p_full_name,
    p_email,
    p_phone,
    p_street,
    p_city,
    p_state,
    p_postal_code,
    p_country
  )
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    street = EXCLUDED.street,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    postal_code = EXCLUDED.postal_code,
    country = EXCLUDED.country,
    updated_at = now()
  RETURNING id INTO v_customer_id;

  RETURN v_customer_id;
END;
$$;