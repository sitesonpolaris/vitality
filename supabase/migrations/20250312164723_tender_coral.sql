/*
  # Add order testing and validation functions

  1. New Functions
    - get_order_details: Retrieves complete order information
    - verify_order_consistency: Checks data consistency between views
    - get_filtered_orders: Handles complex order filtering
    - audit_order_updates: Tracks order status changes

  2. Indexes
    - Add indexes to support efficient filtering and sorting
    - Optimize query performance for dashboard views

  3. Testing Support
    - Add functions to validate order synchronization
    - Enable detailed order status tracking
*/

-- Function to get complete order details
CREATE OR REPLACE FUNCTION get_order_details(order_id uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  total_amount numeric,
  status text,
  fulfillment_status text,
  items jsonb,
  shipping_address jsonb,
  customer_name text,
  customer_email text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.user_id,
    o.created_at,
    o.updated_at,
    o.total_amount,
    o.status,
    o.fulfillment_status,
    o.items,
    o.shipping_address,
    u.first_name || ' ' || u.last_name as customer_name,
    up.email as customer_email
  FROM orders o
  LEFT JOIN users u ON o.user_id = u.id
  LEFT JOIN user_profiles up ON o.user_id = up.id
  WHERE o.id = order_id
  AND (
    auth.jwt() ->> 'role' = 'admin'
    OR o.user_id = auth.uid()
  );
END;
$$;

-- Function to verify order data consistency
CREATE OR REPLACE FUNCTION verify_order_consistency(order_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_consistent boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN user_profiles up ON o.user_id = up.id
    WHERE o.id = order_id
    AND o.shipping_address->>'name' = (u.first_name || ' ' || u.last_name)
    AND o.shipping_address->>'email' = up.email
  ) INTO is_consistent;
  
  RETURN is_consistent;
END;
$$;

-- Function to get filtered orders with complex conditions
CREATE OR REPLACE FUNCTION get_filtered_orders(
  date_from timestamptz DEFAULT NULL,
  date_to timestamptz DEFAULT NULL,
  status_filter text DEFAULT NULL,
  customer_id uuid DEFAULT NULL,
  sort_by text DEFAULT 'created_at',
  sort_direction text DEFAULT 'desc'
)
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  customer_name text,
  total_amount numeric,
  status text,
  fulfillment_status text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.created_at,
    u.first_name || ' ' || u.last_name as customer_name,
    o.total_amount,
    o.status,
    o.fulfillment_status
  FROM orders o
  JOIN users u ON o.user_id = u.id
  WHERE (date_from IS NULL OR o.created_at >= date_from)
  AND (date_to IS NULL OR o.created_at <= date_to)
  AND (status_filter IS NULL OR o.fulfillment_status = status_filter)
  AND (customer_id IS NULL OR o.user_id = customer_id)
  AND (
    auth.jwt() ->> 'role' = 'admin'
    OR o.user_id = auth.uid()
  )
  ORDER BY
    CASE 
      WHEN sort_by = 'created_at' AND sort_direction = 'desc' THEN o.created_at END DESC,
    CASE 
      WHEN sort_by = 'created_at' AND sort_direction = 'asc' THEN o.created_at END ASC,
    CASE 
      WHEN sort_by = 'total_amount' AND sort_direction = 'desc' THEN o.total_amount END DESC,
    CASE 
      WHEN sort_by = 'total_amount' AND sort_direction = 'asc' THEN o.total_amount END ASC,
    CASE 
      WHEN sort_by = 'status' AND sort_direction = 'desc' THEN o.fulfillment_status END DESC,
    CASE 
      WHEN sort_by = 'status' AND sort_direction = 'asc' THEN o.fulfillment_status END ASC;
END;
$$;

-- Create order update audit log
CREATE TABLE IF NOT EXISTS order_status_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  previous_status text,
  new_status text,
  changed_by uuid REFERENCES auth.users(id),
  changed_at timestamptz DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE order_status_audit ENABLE ROW LEVEL SECURITY;

-- Create policy for audit log access
CREATE POLICY "Admins can read audit log"
  ON order_status_audit
  FOR SELECT
  TO admin
  USING (true);

-- Function to log order status changes
CREATE OR REPLACE FUNCTION log_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF OLD.fulfillment_status != NEW.fulfillment_status THEN
    INSERT INTO order_status_audit (
      order_id,
      previous_status,
      new_status,
      changed_by
    ) VALUES (
      NEW.id,
      OLD.fulfillment_status,
      NEW.fulfillment_status,
      auth.uid()
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for status change logging
CREATE TRIGGER order_status_change_trigger
  AFTER UPDATE OF fulfillment_status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION log_order_status_change();

-- Add indexes for improved query performance
CREATE INDEX IF NOT EXISTS orders_status_created_at_idx 
  ON orders(fulfillment_status, created_at DESC);

CREATE INDEX IF NOT EXISTS orders_user_status_idx 
  ON orders(user_id, fulfillment_status);

CREATE INDEX IF NOT EXISTS order_audit_order_id_idx 
  ON order_status_audit(order_id);