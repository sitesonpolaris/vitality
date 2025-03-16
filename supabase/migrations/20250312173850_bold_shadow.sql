/*
  # Fix order management functionality

  1. Changes
    - Add proper error handling for status updates
    - Add validation for status changes
    - Add proper return type for toggle function
    - Add proper security context

  2. Security
    - Ensure only admins can update order status
    - Add proper error handling
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS toggle_fulfillment_status(uuid);

-- Create improved version with proper return type and error handling
CREATE OR REPLACE FUNCTION toggle_fulfillment_status(order_id uuid)
RETURNS TABLE (
  success boolean,
  message text,
  fulfillment_status text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_status text;
  v_new_status text;
BEGIN
  -- Check if user has admin role
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_app_meta_data->>'role' = 'admin'
  ) THEN
    RETURN QUERY SELECT 
      false AS success,
      'Unauthorized: Admin access required'::text AS message,
      NULL::text AS fulfillment_status;
    RETURN;
  END IF;

  -- Get current status
  SELECT fulfillment_status INTO v_current_status
  FROM orders
  WHERE id = order_id;

  -- Check if order exists
  IF v_current_status IS NULL THEN
    RETURN QUERY SELECT 
      false AS success,
      'Order not found'::text AS message,
      NULL::text AS fulfillment_status;
    RETURN;
  END IF;

  -- Determine new status
  v_new_status := CASE 
    WHEN v_current_status = 'unfulfilled' THEN 'fulfilled'
    ELSE 'unfulfilled'
  END;

  -- Update the order status
  UPDATE orders
  SET 
    fulfillment_status = v_new_status,
    updated_at = now()
  WHERE id = order_id;

  -- Return success result
  RETURN QUERY SELECT 
    true AS success,
    'Status updated successfully'::text AS message,
    v_new_status AS fulfillment_status;
END;
$$;