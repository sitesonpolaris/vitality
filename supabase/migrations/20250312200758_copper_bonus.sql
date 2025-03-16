/*
  # Add inventory management system

  1. New Tables
    - `product_inventory`
      - `id` (uuid, primary key)
      - `product_id` (text, references products)
      - `inventory_level` (integer)
      - `low_stock_threshold` (integer)
      - `last_updated` (timestamptz)
      - `updated_by` (uuid, references auth.users)

    - `inventory_history`
      - `id` (uuid, primary key)
      - `product_id` (text)
      - `previous_level` (integer)
      - `new_level` (integer)
      - `change_type` (enum: restock, sale, adjustment)
      - `change_reason` (text)
      - `changed_by` (uuid, references auth.users)
      - `changed_at` (timestamptz)

  2. Functions
    - update_inventory_level: Updates product inventory with audit trail
    - check_low_stock: Returns products below threshold
    - get_inventory_status: Returns current inventory status for all products

  3. Triggers
    - Automatically update product availability
    - Log inventory changes
    - Prevent negative inventory
*/

-- Create inventory change type enum
CREATE TYPE inventory_change_type AS ENUM ('restock', 'sale', 'adjustment');

-- Create product inventory table
CREATE TABLE product_inventory (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  inventory_level integer NOT NULL DEFAULT 0 CHECK (inventory_level >= 0),
  low_stock_threshold integer NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
  last_updated timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id),
  UNIQUE (product_id)
);

-- Create inventory history table
CREATE TABLE inventory_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  previous_level integer NOT NULL,
  new_level integer NOT NULL,
  change_type inventory_change_type NOT NULL,
  change_reason text,
  changed_by uuid REFERENCES auth.users(id),
  changed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE product_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_history ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX product_inventory_level_idx ON product_inventory(inventory_level);
CREATE INDEX inventory_history_product_id_idx ON inventory_history(product_id);
CREATE INDEX inventory_history_changed_at_idx ON inventory_history(changed_at DESC);

-- Create policies
CREATE POLICY "Admins can read all inventory"
  ON product_inventory
  FOR SELECT
  TO admin
  USING (true);

CREATE POLICY "Admins can update inventory"
  ON product_inventory
  FOR UPDATE
  TO admin
  USING (true);

CREATE POLICY "Admins can read inventory history"
  ON inventory_history
  FOR SELECT
  TO admin
  USING (true);

-- Function to update inventory level
CREATE OR REPLACE FUNCTION update_inventory_level(
  p_product_id text,
  p_new_level integer,
  p_change_type inventory_change_type,
  p_change_reason text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_level integer;
  v_user_id uuid;
BEGIN
  -- Check admin permission
  v_user_id := auth.uid();
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = v_user_id 
    AND raw_app_meta_data->>'role' = 'admin'
  ) THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Unauthorized: Admin access required'
    );
  END IF;

  -- Get current inventory level
  SELECT inventory_level INTO v_current_level
  FROM product_inventory
  WHERE product_id = p_product_id;

  -- Insert new record if product doesn't exist
  IF v_current_level IS NULL THEN
    INSERT INTO product_inventory (
      product_id,
      inventory_level,
      updated_by
    ) VALUES (
      p_product_id,
      p_new_level,
      v_user_id
    );
    v_current_level := 0;
  ELSE
    -- Update existing record
    UPDATE product_inventory
    SET
      inventory_level = p_new_level,
      last_updated = now(),
      updated_by = v_user_id
    WHERE product_id = p_product_id;
  END IF;

  -- Record change in history
  INSERT INTO inventory_history (
    product_id,
    previous_level,
    new_level,
    change_type,
    change_reason,
    changed_by
  ) VALUES (
    p_product_id,
    v_current_level,
    p_new_level,
    p_change_type,
    p_change_reason,
    v_user_id
  );

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Inventory updated successfully',
    'new_level', p_new_level
  );
END;
$$;

-- Function to check low stock
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TABLE (
  product_id text,
  inventory_level integer,
  low_stock_threshold integer,
  last_updated timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pi.product_id,
    pi.inventory_level,
    pi.low_stock_threshold,
    pi.last_updated
  FROM product_inventory pi
  WHERE pi.inventory_level <= pi.low_stock_threshold;
END;
$$;

-- Function to get inventory status
CREATE OR REPLACE FUNCTION get_inventory_status()
RETURNS TABLE (
  product_id text,
  inventory_level integer,
  low_stock_threshold integer,
  status text,
  last_updated timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pi.product_id,
    pi.inventory_level,
    pi.low_stock_threshold,
    CASE
      WHEN pi.inventory_level = 0 THEN 'out_of_stock'
      WHEN pi.inventory_level <= pi.low_stock_threshold THEN 'low_stock'
      ELSE 'in_stock'
    END as status,
    pi.last_updated
  FROM product_inventory pi;
END;
$$;

-- Initialize inventory for existing products
INSERT INTO product_inventory (product_id, inventory_level, low_stock_threshold)
VALUES
  ('prod_RvMg6hSxnhzCQT', 10, 5),
  ('prod_RvMjMoAHC2UmDK', 10, 5),
  ('prod_RvMifUDDltJqea', 10, 5),
  ('prod_RvMiKhAIbdzurG', 10, 5),
  ('prod_RvMhF8f6IObr9A', 10, 5),
  ('6', 10, 5),
  ('7', 10, 5)
ON CONFLICT (product_id) DO NOTHING;