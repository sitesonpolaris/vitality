/*
  # Add admin role and policies for order management

  1. Changes
    - Create admin role
    - Add admin policies for orders table
    - Add fulfillment status to orders table
    - Add admin-specific indexes

  2. Security
    - Enable admin-only access to all orders
    - Allow admins to update order status
*/

-- Create admin role
CREATE ROLE admin;

-- Add fulfillment_status to orders table
ALTER TABLE orders 
ADD COLUMN fulfillment_status text NOT NULL DEFAULT 'unfulfilled'
CHECK (fulfillment_status IN ('unfulfilled', 'fulfilled'));

-- Create policy for admins to read all orders
CREATE POLICY "Admins can read all orders"
  ON orders
  FOR SELECT
  TO admin
  USING (true);

-- Create policy for admins to update order fulfillment status
CREATE POLICY "Admins can update order fulfillment status"
  ON orders
  FOR UPDATE
  TO admin
  USING (true)
  WITH CHECK (true);

-- Create indexes for improved query performance
CREATE INDEX orders_fulfillment_status_idx ON orders(fulfillment_status);
CREATE INDEX orders_created_at_idx ON orders(created_at DESC);

-- Add function to toggle fulfillment status
CREATE OR REPLACE FUNCTION toggle_fulfillment_status(order_id uuid)
RETURNS orders
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE orders
  SET 
    fulfillment_status = CASE 
      WHEN fulfillment_status = 'unfulfilled' THEN 'fulfilled'
      ELSE 'unfulfilled'
    END,
    updated_at = now()
  WHERE id = order_id
  RETURNING *;
END;
$$;