/*
  # Update order status system with data migration

  1. Changes
    - Add order status type
    - Add status history tracking
    - Update existing orders to new status format
    - Add status transition validation
    - Add admin-only update functions

  2. Security
    - Maintain existing RLS policies
    - Add validation for status transitions
*/

-- Create temporary status mapping table
CREATE TEMPORARY TABLE status_mapping (
  old_status text,
  new_status text
);

INSERT INTO status_mapping (old_status, new_status) VALUES
  ('completed', 'paid'),
  ('processing', 'pending'),
  ('cancelled', 'cancelled');

-- Add order status type
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM ('pending', 'paid', 'order_fulfilled', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Add status history table
CREATE TABLE IF NOT EXISTS order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  previous_status order_status,
  new_status order_status,
  changed_by uuid REFERENCES auth.users(id),
  changed_at timestamptz DEFAULT now(),
  reason text
);

-- Enable RLS on status history
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Add policy for status history
CREATE POLICY "Admins can read status history"
  ON order_status_history
  FOR SELECT
  TO admin
  USING (true);

-- Update existing orders to use new status
UPDATE orders
SET status = COALESCE(
  (SELECT new_status::order_status 
   FROM status_mapping 
   WHERE old_status = orders.status),
  'pending'::order_status
);

-- Modify orders table to enforce new status type
ALTER TABLE orders 
  ALTER COLUMN status TYPE order_status USING status::order_status,
  ALTER COLUMN status SET DEFAULT 'pending'::order_status;

-- Function to validate status transition
CREATE OR REPLACE FUNCTION validate_status_transition(
  current_status order_status,
  new_status order_status
) RETURNS boolean
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN CASE
    WHEN current_status = 'pending' AND new_status = 'paid' THEN true
    WHEN current_status = 'paid' AND new_status = 'order_fulfilled' THEN true
    WHEN current_status IN ('pending', 'paid') AND new_status = 'cancelled' THEN true
    ELSE false
  END;
END;
$$;

-- Function to update order status
CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id uuid,
  p_new_status order_status,
  p_reason text DEFAULT NULL
)
RETURNS TABLE (
  success boolean,
  message text,
  new_status order_status
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_status order_status;
  v_user_id uuid;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- Check admin permission
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = v_user_id 
    AND raw_app_meta_data->>'role' = 'admin'
  ) THEN
    RETURN QUERY SELECT 
      false,
      'Unauthorized: Admin access required'::text,
      NULL::order_status;
    RETURN;
  END IF;

  -- Get current status
  SELECT status INTO v_current_status
  FROM orders
  WHERE id = p_order_id;

  -- Validate order exists
  IF v_current_status IS NULL THEN
    RETURN QUERY SELECT 
      false,
      'Order not found'::text,
      NULL::order_status;
    RETURN;
  END IF;

  -- Validate status transition
  IF NOT validate_status_transition(v_current_status, p_new_status) THEN
    RETURN QUERY SELECT 
      false,
      'Invalid status transition'::text,
      NULL::order_status;
    RETURN;
  END IF;

  -- Update order status
  UPDATE orders
  SET 
    status = p_new_status,
    updated_at = now()
  WHERE id = p_order_id;

  -- Record status change in history
  INSERT INTO order_status_history (
    order_id,
    previous_status,
    new_status,
    changed_by,
    reason
  ) VALUES (
    p_order_id,
    v_current_status,
    p_new_status,
    v_user_id,
    p_reason
  );

  -- Return success result
  RETURN QUERY SELECT 
    true,
    'Status updated successfully'::text,
    p_new_status;
END;
$$;

-- Drop temporary table
DROP TABLE status_mapping;