/*
  # Create orders table

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `stripe_payment_intent_id` (text)
      - `total_amount` (numeric)
      - `status` (text)
      - `items` (jsonb)
      - `shipping_address` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `orders` table
    - Add policies for authenticated users to:
      - Read their own orders
      - Create new orders
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  stripe_payment_intent_id text UNIQUE NOT NULL,
  total_amount numeric NOT NULL,
  status text NOT NULL,
  items jsonb NOT NULL,
  shipping_address jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own orders
CREATE POLICY "Users can read own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to create orders
CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create an index for faster lookups by user_id
CREATE INDEX orders_user_id_idx ON orders(user_id);

-- Create an index for faster lookups by stripe_payment_intent_id
CREATE INDEX orders_stripe_payment_intent_idx ON orders(stripe_payment_intent_id);