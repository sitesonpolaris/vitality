/*
  # Add product management system

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `stripe_product_id` (text)
      - `stripe_price_id` (text)
      - `status` (enum: active, draft, archived)
      - `images` (jsonb array of image URLs)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid, references auth.users)
      - `updated_by` (uuid, references auth.users)

    - `product_activity_log`
      - `id` (uuid, primary key)
      - `product_id` (uuid, references products)
      - `action` (enum: created, updated, deleted, archived, restored)
      - `changes` (jsonb)
      - `performed_by` (uuid, references auth.users)
      - `performed_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
    - Add audit logging triggers
*/

-- Create product status enum
CREATE TYPE product_status AS ENUM ('active', 'draft', 'archived');
CREATE TYPE product_action AS ENUM ('created', 'updated', 'deleted', 'archived', 'restored');

-- Create products table
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  stripe_product_id text UNIQUE,
  stripe_price_id text UNIQUE,
  status product_status NOT NULL DEFAULT 'draft',
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id),
  deleted_at timestamptz,
  deleted_by uuid REFERENCES auth.users(id)
);

-- Create activity log table
CREATE TABLE product_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id),
  action product_action NOT NULL,
  changes jsonb,
  performed_by uuid REFERENCES auth.users(id),
  performed_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_activity_log ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX products_status_idx ON products(status);
CREATE INDEX products_stripe_ids_idx ON products(stripe_product_id, stripe_price_id);
CREATE INDEX product_activity_product_id_idx ON product_activity_log(product_id);
CREATE INDEX product_activity_performed_at_idx ON product_activity_log(performed_at DESC);

-- Create policies
CREATE POLICY "Admins can manage products"
  ON products
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Public can view active products"
  ON products
  FOR SELECT
  TO authenticated
  USING (status = 'active' AND deleted_at IS NULL);

CREATE POLICY "Admins can view activity logs"
  ON product_activity_log
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Create function to log product changes
CREATE OR REPLACE FUNCTION log_product_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_action product_action;
  v_changes jsonb;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_action := 'created';
    v_changes := to_jsonb(NEW.*) - 'created_at' - 'updated_at';
  ELSIF TG_OP = 'UPDATE' THEN
    v_action := CASE
      WHEN NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN 'deleted'
      WHEN NEW.status = 'archived' AND OLD.status != 'archived' THEN 'archived'
      WHEN NEW.status != 'archived' AND OLD.status = 'archived' THEN 'restored'
      ELSE 'updated'
    END;
    v_changes := jsonb_build_object(
      'before', to_jsonb(OLD.*) - 'created_at' - 'updated_at',
      'after', to_jsonb(NEW.*) - 'created_at' - 'updated_at'
    );
  END IF;

  INSERT INTO product_activity_log (
    product_id,
    action,
    changes,
    performed_by
  ) VALUES (
    COALESCE(NEW.id, OLD.id),
    v_action,
    v_changes,
    auth.uid()
  );

  RETURN NULL;
END;
$$;

-- Create triggers for logging
CREATE TRIGGER log_product_changes
  AFTER INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION log_product_change();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_product_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$;

-- Create trigger for updating timestamps
CREATE TRIGGER update_product_timestamp
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_product_timestamp();

-- Create function to manage products
CREATE OR REPLACE FUNCTION manage_product(
  p_action text,
  p_product_id uuid DEFAULT NULL,
  p_product_data jsonb DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
  v_product products%ROWTYPE;
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

  CASE p_action
    WHEN 'create' THEN
      INSERT INTO products (
        name,
        description,
        price,
        stripe_product_id,
        stripe_price_id,
        status,
        images,
        created_by,
        updated_by
      )
      SELECT
        p_product_data->>'name',
        p_product_data->>'description',
        (p_product_data->>'price')::numeric,
        p_product_data->>'stripe_product_id',
        p_product_data->>'stripe_price_id',
        (p_product_data->>'status')::product_status,
        p_product_data->'images',
        v_user_id,
        v_user_id
      RETURNING * INTO v_product;

    WHEN 'update' THEN
      UPDATE products
      SET
        name = COALESCE((p_product_data->>'name')::text, name),
        description = COALESCE((p_product_data->>'description')::text, description),
        price = COALESCE((p_product_data->>'price')::numeric, price),
        stripe_product_id = COALESCE((p_product_data->>'stripe_product_id')::text, stripe_product_id),
        stripe_price_id = COALESCE((p_product_data->>'stripe_price_id')::text, stripe_price_id),
        status = COALESCE((p_product_data->>'status')::product_status, status),
        images = COALESCE(p_product_data->'images', images),
        updated_by = v_user_id
      WHERE id = p_product_id
      RETURNING * INTO v_product;

    WHEN 'archive' THEN
      UPDATE products
      SET
        status = 'archived',
        updated_by = v_user_id
      WHERE id = p_product_id
      RETURNING * INTO v_product;

    WHEN 'delete' THEN
      UPDATE products
      SET
        deleted_at = now(),
        deleted_by = v_user_id,
        updated_by = v_user_id
      WHERE id = p_product_id
      RETURNING * INTO v_product;

    ELSE
      RETURN jsonb_build_object(
        'success', false,
        'message', 'Invalid action'
      );
  END CASE;

  IF v_product.id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Product not found or operation failed'
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Operation successful',
    'product', to_jsonb(v_product)
  );
END;
$$;