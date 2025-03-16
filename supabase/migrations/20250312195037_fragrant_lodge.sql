/*
  # Add fulfillment status to orders table

  1. Changes
    - Add fulfillment_status column to orders table
    - Set default value to 'unfulfilled'
    - Add constraint to limit values to 'fulfilled' or 'unfulfilled'
    - Add indexes for performance optimization
*/

-- Add fulfillment_status column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'orders' 
    AND column_name = 'fulfillment_status'
  ) THEN
    ALTER TABLE orders
    ADD COLUMN fulfillment_status text NOT NULL DEFAULT 'unfulfilled'
    CHECK (fulfillment_status IN ('unfulfilled', 'fulfilled'));
  END IF;
END $$;

-- Create indexes if they don't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'orders_fulfillment_status_idx'
  ) THEN
    CREATE INDEX orders_fulfillment_status_idx ON orders(fulfillment_status);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'orders_status_created_at_idx'
  ) THEN
    CREATE INDEX orders_status_created_at_idx ON orders(fulfillment_status, created_at DESC);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'orders_user_status_idx'
  ) THEN
    CREATE INDEX orders_user_status_idx ON orders(user_id, fulfillment_status);
  END IF;
END $$;

-- Create audit log table if it doesn't exist
CREATE TABLE IF NOT EXISTS order_status_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  previous_status text,
  new_status text,
  changed_by uuid REFERENCES auth.users(id),
  changed_at timestamptz DEFAULT now()
);

-- Enable RLS on audit log if not already enabled
ALTER TABLE order_status_audit ENABLE ROW LEVEL SECURITY;

-- Create index for audit log lookups if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'order_audit_order_id_idx'
  ) THEN
    CREATE INDEX order_audit_order_id_idx ON order_status_audit(order_id);
  END IF;
END $$;