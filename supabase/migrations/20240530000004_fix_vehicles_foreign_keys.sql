-- This migration fixes foreign key constraints for the vehicles table

-- First, let's make sure the vehicles table has the correct columns
DO $$ 
BEGIN
  -- Check if brand_id column exists, add it if not
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'vehicles' AND column_name = 'brand_id') THEN
    ALTER TABLE vehicles ADD COLUMN brand_id UUID;
  END IF;
  
  -- Check if model_id column exists, add it if not
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'vehicles' AND column_name = 'model_id') THEN
    ALTER TABLE vehicles ADD COLUMN model_id UUID;
  END IF;
END $$;

-- Drop existing foreign key constraints if they exist
DO $$ 
BEGIN
  -- Check if foreign key exists and drop it
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
             WHERE constraint_name = 'vehicles_brand_id_fkey' 
             AND table_name = 'vehicles') THEN
    ALTER TABLE vehicles DROP CONSTRAINT vehicles_brand_id_fkey;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
             WHERE constraint_name = 'vehicles_model_id_fkey' 
             AND table_name = 'vehicles') THEN
    ALTER TABLE vehicles DROP CONSTRAINT vehicles_model_id_fkey;
  END IF;
END $$;

-- Add the correct foreign key constraints
ALTER TABLE vehicles 
  ADD CONSTRAINT vehicles_brand_id_fkey 
  FOREIGN KEY (brand_id) 
  REFERENCES car_brands(id);

ALTER TABLE vehicles 
  ADD CONSTRAINT vehicles_model_id_fkey 
  FOREIGN KEY (model_id) 
  REFERENCES car_models(id);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE vehicles TO authenticated;
-- Remove the sequence grant since this table uses UUID primary keys 