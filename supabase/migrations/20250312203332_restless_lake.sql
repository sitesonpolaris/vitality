/*
  # Add stored procedure for getting customer info by user ID

  1. Changes
    - Add stored procedure to get customer info by user ID
    - Handles admin access to all customer info
    - Maintains RLS policies while allowing admins to read any customer's info

  2. Security
    - Respects existing RLS policies
    - Only admins can read other users' info
    - Regular users can only read their own info
*/

CREATE OR REPLACE FUNCTION get_customer_info_by_user_id(p_user_id uuid)
RETURNS TABLE (
  full_name text,
  email text,
  phone text,
  street text,
  city text,
  state text,
  postal_code text,
  country text
) SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin or requesting their own info
  IF (auth.jwt() ->> 'role' = 'admin') OR (auth.uid() = p_user_id) THEN
    RETURN QUERY
    SELECT 
      ci.full_name,
      ci.email,
      ci.phone,
      ci.street,
      ci.city,
      ci.state,
      ci.postal_code,
      ci.country
    FROM customer_info ci
    WHERE ci.user_id = p_user_id;
  END IF;
  
  RETURN;
END;
$$ LANGUAGE plpgsql;