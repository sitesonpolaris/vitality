/*
  # Fix order status update functionality

  1. Changes
    - Add function to update both fulfillment and order status
    - Ensure proper status transitions
    - Add validation and error handling
    - Maintain audit trail
*/

-- Function to update both fulfillment and order status
CREATE OR REPLACE FUNCTION update_order_fulfillment(
  p_order_id uuid,
  p_fulfillment_status text,
  p_reason text DEFAULT NULL
)
RETURNS TABLE (
  success boolean,
  message text,
  fulfillment_status text,
  order_status order_status
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_fulfillment text;
  v_current_order_status order_status;
  v_new_order_status order_status;
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
      NULL::text,
      NULL::order_status;
    RETURN;
  END IF;

  -- Get current statuses
  SELECT 
    fulfillment_status,
    status INTO v_current_fulfillment, v_current_order_status
  FROM orders
  WHERE id = p_order_id;

  -- Validate order exists
  IF v_current_fulfillment IS NULL THEN
    RETURN QUERY SELECT 
      false,
      'Order not found'::text,
      NULL::text,
      NULL::order_status;
    RETURN;
  END IF;

  -- Determine new order status based on fulfillment
  v_new_order_status := CASE
    WHEN p_fulfillment_status = 'fulfilled' THEN 'order_fulfilled'::order_status
    ELSE v_current_order_status
  END;

  -- Update both statuses
  UPDATE orders
  SET 
    fulfillment_status = p_fulfillment_status,
    status = v_new_order_status,
    updated_at = now()
  WHERE id = p_order_id;

  -- Record status changes in history
  INSERT INTO order_status_history (
    order_id,
    previous_status,
    new_status,
    changed_by,
    reason
  ) VALUES (
    p_order_id,
    v_current_order_status,
    v_new_order_status,
    v_user_id,
    COALESCE(p_reason, 'Fulfillment status updated to ' || p_fulfillment_status)
  );

  -- Return success result
  RETURN QUERY SELECT 
    true,
    'Status updated successfully'::text,
    p_fulfillment_status,
    v_new_order_status;
END;
$$;

-- Update toggle_fulfillment_status to use the new function
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
  -- Get current status
  SELECT fulfillment_status INTO v_current_status
  FROM orders
  WHERE id = order_id;

  -- Determine new status
  v_new_status := CASE 
    WHEN v_current_status = 'unfulfilled' THEN 'fulfilled'
    ELSE 'unfulfilled'
  END;

  -- Use new function to update status
  RETURN QUERY 
  SELECT 
    result.success,
    result.message,
    result.fulfillment_status
  FROM update_order_fulfillment(order_id, v_new_status) result;
END;
$$;