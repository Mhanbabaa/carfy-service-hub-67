-- Create car brands table
CREATE TABLE IF NOT EXISTS car_brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create car models table
CREATE TABLE IF NOT EXISTS car_models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (brand_id) REFERENCES car_brands(id) ON DELETE CASCADE,
  UNIQUE (brand_id, name)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_car_models_brand_id ON car_models(brand_id);

-- Make tables accessible without tenant_id requirement since they are shared resources
ALTER TABLE car_brands DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE car_models DROP COLUMN IF EXISTS tenant_id;

-- RLS policies to allow read access from all tenants 
ALTER TABLE car_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_models ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow read access for all authenticated users" ON car_brands;
CREATE POLICY "Allow read access for all authenticated users" 
ON car_brands FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Allow read access for all authenticated users" ON car_models;
CREATE POLICY "Allow read access for all authenticated users" 
ON car_models FOR SELECT 
TO authenticated 
USING (true);

-- Only allow superadmin to modify these tables
DROP POLICY IF EXISTS "Allow full access for superadmin users" ON car_brands;
CREATE POLICY "Allow full access for superadmin users" 
ON car_brands FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'superadmin');

DROP POLICY IF EXISTS "Allow full access for superadmin users" ON car_models;
CREATE POLICY "Allow full access for superadmin users" 
ON car_models FOR ALL 
TO authenticated 
USING (auth.jwt() ->> 'role' = 'superadmin');

-- Grant basic permissions to authenticated users
GRANT SELECT ON car_brands TO authenticated;
GRANT SELECT ON car_models TO authenticated; 