/*
  # Fix admin order management functions

  1. Changes
    - Add proper admin access to orders
    - Fix status update handling
    - Add order filtering functions
*/

-- Function to get orders with admin access
CREATE OR REPLACE FUNCTION get_orders(
  p_status text DEFAULT NULL,
  p_sort_field text DEFAULT 'created_at',
  p_sort_direction text DEFAULT 'desc',
  p_limit integer DEFAULT 100
)
RETURNS SETOF orders
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin or getting their own orders
  IF NOT (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_app_meta_data->>'role' = 'admin'
    )
  ) THEN
    -- Regular users can only see their orders
    RETURN QUERY
    SELECT * FROM orders
    WHERE user_id = auth.uid()
    ORDER BY 
      CASE WHEN p_sort_field = 'created_at' AND p_sort_direction = 'desc' THEN created_at END DESC,
      CASE WHEN p_sort_field = 'created_at' AND p_sort_direction = 'asc' THEN created_at END ASC,
      CASE WHEN p_sort_field = 'total_amount' AND p_sort_direction = 'desc' THEN total_amount END DESC,
      CASE WHEN p_sort_field = 'total_amount' AND p_sort_direction = 'asc' THEN total_amount END ASC,
      CASE WHEN p_sort_field = 'fulfillment_status' AND p_sort_direction = 'desc' THEN fulfillment_status END DESC,
      CASE WHEN p_sort_field = 'fulfillment_status' AND p_sort_direction = 'asc' THEN fulfillment_status END ASC
    LIMIT p_limit;
    RETURN;
  END IF;

  -- Admin can see all orders
  RETURN QUERY
  SELECT * FROM orders
  WHERE 
    CASE 
      WHEN p_status IS NOT NULL THEN fulfillment_status = p_status
      ELSE true
    END
  ORDER BY 
    CASE WHEN p_sort_field = 'created_at' AND p_sort_direction = 'desc' THEN created_at END DESC,
    CASE WHEN p_sort_field = 'created_at' AND p_sort_direction = 'asc' THEN created_at END ASC,
    CASE WHEN p_sort_field = 'total_amount' AND p_sort_direction = 'desc' THEN total_amount END DESC,
    CASE WHEN p_sort_field = 'total_amount' AND p_sort_direction = 'asc' THEN total_amount END ASC,
    CASE WHEN p_sort_field = 'fulfillment_status' AND p_sort_direction = 'desc' THEN fulfillment_status END DESC,
    CASE WHEN p_sort_field = 'fulfillment_status' AND p_sort_direction = 'asc' THEN fulfillment_status END ASC
  LIMIT p_limit;
END;
$$;