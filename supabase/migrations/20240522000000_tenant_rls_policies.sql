-- Tüm tablolar için RLS etkinleştir
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_history ENABLE ROW LEVEL SECURITY;

-- Create a function to get user's tenant ID
CREATE OR REPLACE FUNCTION auth.get_user_tenant_id()
RETURNS UUID AS $$
DECLARE
  user_tenant_id UUID;
BEGIN
  SELECT tenant_id INTO user_tenant_id FROM public.users WHERE id = auth.uid();
  RETURN user_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- User metadata fields for temporary password forcing
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Set must_change_password to true for new users
  UPDATE auth.users 
  SET raw_user_meta_data = 
    COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object('must_change_password', true);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Temel SELECT politikaları
CREATE POLICY "Tenant users can view their own tenant" ON tenants 
  FOR SELECT USING (id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can view their own tenant's users" ON users 
  FOR SELECT USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can view their own tenant's brands" ON brands 
  FOR SELECT USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can view their own tenant's models" ON models 
  FOR SELECT USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can view their own tenant's customers" ON customers 
  FOR SELECT USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can view their own tenant's vehicles" ON vehicles 
  FOR SELECT USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can view their own tenant's services" ON services 
  FOR SELECT USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can view their own tenant's service parts" ON service_parts 
  FOR SELECT USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can view their own tenant's service history" ON service_history 
  FOR SELECT USING (tenant_id = auth.get_user_tenant_id());

-- INSERT politikalar
CREATE POLICY "Tenant users can insert to their own tenant's brands" ON brands 
  FOR INSERT WITH CHECK (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can insert to their own tenant's models" ON models 
  FOR INSERT WITH CHECK (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can insert to their own tenant's customers" ON customers 
  FOR INSERT WITH CHECK (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can insert to their own tenant's vehicles" ON vehicles 
  FOR INSERT WITH CHECK (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can insert to their own tenant's services" ON services 
  FOR INSERT WITH CHECK (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can insert to their own tenant's service parts" ON service_parts 
  FOR INSERT WITH CHECK (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can insert to their own tenant's service history" ON service_history 
  FOR INSERT WITH CHECK (tenant_id = auth.get_user_tenant_id());

-- UPDATE politikalar
CREATE POLICY "Tenant users can update their own tenant" ON tenants 
  FOR UPDATE USING (id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can update their own tenant's users" ON users 
  FOR UPDATE USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can update their own tenant's brands" ON brands 
  FOR UPDATE USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can update their own tenant's models" ON models 
  FOR UPDATE USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can update their own tenant's customers" ON customers 
  FOR UPDATE USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can update their own tenant's vehicles" ON vehicles 
  FOR UPDATE USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can update their own tenant's services" ON services 
  FOR UPDATE USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can update their own tenant's service parts" ON service_parts 
  FOR UPDATE USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can update their own tenant's service history" ON service_history 
  FOR UPDATE USING (tenant_id = auth.get_user_tenant_id());

-- DELETE politikalar
CREATE POLICY "Tenant users can delete their own tenant's brands" ON brands 
  FOR DELETE USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can delete their own tenant's models" ON models 
  FOR DELETE USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can delete their own tenant's customers" ON customers 
  FOR DELETE USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can delete their own tenant's vehicles" ON vehicles 
  FOR DELETE USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can delete their own tenant's services" ON services 
  FOR DELETE USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can delete their own tenant's service parts" ON service_parts 
  FOR DELETE USING (tenant_id = auth.get_user_tenant_id());

CREATE POLICY "Tenant users can delete their own tenant's service history" ON service_history 
  FOR DELETE USING (tenant_id = auth.get_user_tenant_id());

-- Password updating function
CREATE OR REPLACE FUNCTION public.update_password_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user metadata to indicate password has been changed
  UPDATE auth.users
  SET raw_user_meta_data = 
    raw_user_meta_data - 'must_change_password' || 
    jsonb_build_object('must_change_password', false)
  WHERE id = auth.uid();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for password updates
DROP TRIGGER IF EXISTS on_password_change ON auth.users;
CREATE TRIGGER on_password_change
  AFTER UPDATE OF encrypted_password ON auth.users
  FOR EACH ROW
  WHEN (OLD.encrypted_password IS DISTINCT FROM NEW.encrypted_password)
  EXECUTE PROCEDURE public.update_password_status(); 