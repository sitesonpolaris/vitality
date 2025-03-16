/*
  # Fix fulfillment status toggle function

  1. Changes
    - Update toggle_fulfillment_status function to handle errors correctly
    - Add proper validation and error handling
    - Fix return type to match frontend expectations
*/

-- Drop existing function
DROP FUNCTION IF EXISTS toggle_fulfillment_status(uuid);

-- Create improved version with proper return type and error handling
CREATE OR REPLACE FUNCTION toggle_fulfillment_status(order_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_status text;
  v_new_status text;
  v_order_exists boolean;
BEGIN
  -- Check if user has admin role
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_app_meta_data->>'role' = 'admin'
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Unauthorized: Admin access required'
    );
  END IF;

  -- Check if order exists
  SELECT EXISTS (
    SELECT 1 FROM orders WHERE id = order_id
  ) INTO v_order_exists;

  IF NOT v_order_exists THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Order not found'
    );
  END IF;

  -- Get current status
  SELECT fulfillment_status INTO v_current_status
  FROM orders
  WHERE id = order_id;

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

  -- Return success result with new status
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Status updated successfully',
    'fulfillment_status', v_new_status
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'message', SQLERRM
  );
END;
$$;