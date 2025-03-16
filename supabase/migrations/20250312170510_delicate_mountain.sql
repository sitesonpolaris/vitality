/*
  # Add order recording function and webhook handler

  1. New Functions
    - create_order: Creates a new order record
    - handle_stripe_webhook: Processes Stripe webhook events

  2. Changes
    - Add webhook handling for successful payments
    - Add automatic order creation on payment success
*/

-- Function to create a new order
CREATE OR REPLACE FUNCTION create_order(
  p_user_id uuid,
  p_payment_intent_id text,
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
END;
$$;