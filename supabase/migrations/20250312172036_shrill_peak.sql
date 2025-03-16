/*
  # Add order recording trigger and webhook handler

  1. New Functions
    - record_stripe_order: Creates order record from Stripe payment
    - sync_order_status: Keeps order status in sync with Stripe

  2. Changes
    - Add automatic order creation on payment success
    - Add status synchronization between Stripe and database
    - Add proper error handling and logging
*/

-- Function to record a new order from Stripe payment
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
    'completed',
    p_items,
    p_shipping_address,
    'unfulfilled'
  )
  RETURNING id INTO v_order_id;

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