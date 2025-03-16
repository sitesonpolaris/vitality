/*
  # Update order recording to use customer info

  1. Changes
    - Add function to get customer shipping info
    - Update order recording to use customer info
    - Add proper error handling

  2. Security
    - Maintain existing security context
    - Keep RLS policies intact
*/

-- Function to get customer shipping info
CREATE OR REPLACE FUNCTION get_customer_shipping_info(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_customer_info customer_info%ROWTYPE;
BEGIN
  SELECT * INTO v_customer_info
  FROM customer_info
  WHERE user_id = p_user_id;

  IF v_customer_info IS NULL THEN
    RETURN NULL;
  END IF;

  RETURN jsonb_build_object(
    'name', v_customer_info.full_name,
    'email', v_customer_info.email,
    'phone', v_customer_info.phone,
    'street', v_customer_info.street,
    'city', v_customer_info.city,
    'state', v_customer_info.state,
    'postal_code', v_customer_info.postal_code,
    'country', v_customer_info.country
  );
END;
$$;

-- Update the record_stripe_order function
CREATE OR REPLACE FUNCTION record_stripe_order(
  p_payment_intent_id text,
  p_user_id uuid,
  p_total_amount numeric,
  p_items jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id uuid;
  v_item jsonb;
  v_shipping_info jsonb;
BEGIN
  -- Get customer shipping info
  v_shipping_info := get_customer_shipping_info(p_user_id);
  
  IF v_shipping_info IS NULL THEN
    RAISE EXCEPTION 'Customer information not found';
  END IF;

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
    v_shipping_info,
    'unfulfilled'
  )
  RETURNING id INTO v_order_id;

  -- Record initial status in history
  INSERT INTO order_status_history (
    order_id,
    previous_status,
    new_status,
    changed_by,
    reason
  ) VALUES (
    v_order_id,
    'pending'::order_status,
    'paid'::order_status,
    p_user_id,
    'Order created and paid'
  );

  -- Update inventory levels
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    -- Update inventory
    PERFORM update_inventory_level(
      v_item->>'id',
      (
        SELECT inventory_level - (v_item->>'quantity')::integer
        FROM product_inventory
        WHERE product_id = v_item->>'id'
      ),
      'sale'::inventory_change_type,
      'Order ' || v_order_id
    );
  END LOOP;

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
