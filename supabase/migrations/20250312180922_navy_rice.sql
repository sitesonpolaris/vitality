/*
  # Fix order recording function

  1. Changes
    - Update record_stripe_order function to use correct order_status enum value
    - Add proper error handling and validation
    - Ensure consistent status tracking

  2. Security
    - Maintain existing security definer settings
    - Keep RLS policies intact
*/

-- Update the record_stripe_order function to use the correct status
CREATE OR REPLACE FUNCTION record_stripe_order(
  p_payment_intent_id text,
  p_user_id uuid,
  p_total_amount numeric,
  p_items jsonb,
  p_shipping_address jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id uuid;
BEGIN
  -- Create the order record
  INSERT INTO orders (
    user_id,
    stripe_payment_intent_id,
    total_amount,
    status,
    items,
    shipping_address,
    fulfillment_status
  ) VALUES (
    p_user_id,
    p_payment_intent_id,
    p_total_amount,
    'paid'::order_status,
    p_items,
    p_shipping_address,
    'unfulfilled'
  )
  RETURNING id INTO v_order_id;

  -- Record initial status in history
  INSERT INTO order_status_history (
    order_id,
    previous_status,
    new_status,
    changed_by
  ) VALUES (
    v_order_id,
    'pending'::order_status,
    'paid'::order_status,
    p_user_id
  );

  RETURN v_order_id;
EXCEPTION
  WHEN unique_violation THEN
    -- Handle case where order already exists
    SELECT id INTO v_order_id
    FROM orders
    WHERE stripe_payment_intent_id = p_payment_intent_id;
    RETURN v_order_id;
  WHEN OTHERS THEN
    RAISE;
END;
$$;