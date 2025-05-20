-- Function to create a new tenant
CREATE OR REPLACE FUNCTION admin.create_tenant(
  tenant_name TEXT,
  tenant_address TEXT DEFAULT NULL,
  tenant_phone TEXT DEFAULT NULL,
  tenant_email TEXT DEFAULT NULL,
  tenant_logo_url TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_tenant_id UUID;
BEGIN
  -- Insert new tenant
  INSERT INTO public.tenants (
    name, 
    address, 
    phone, 
    email, 
    logo_url
  ) VALUES (
    tenant_name,
    tenant_address,
    tenant_phone,
    tenant_email,
    tenant_logo_url
  )
  RETURNING id INTO new_tenant_id;
  
  RETURN new_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a new tenant user
CREATE OR REPLACE FUNCTION admin.create_tenant_user(
  tenant_id UUID,
  email TEXT,
  password TEXT,
  role TEXT DEFAULT 'admin',
  first_name TEXT DEFAULT NULL,
  last_name TEXT DEFAULT NULL,
  phone TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- Check if tenant exists
  IF NOT EXISTS (SELECT 1 FROM public.tenants WHERE id = tenant_id) THEN
    RAISE EXCEPTION 'Tenant ID % does not exist', tenant_id;
  END IF;
  
  -- Check if role is valid
  IF role NOT IN ('admin', 'technician', 'consultant', 'accounting') THEN
    RAISE EXCEPTION 'Invalid role: %. Valid roles are: admin, technician, consultant, accounting', role;
  END IF;
  
  -- Create user in auth.users
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    raw_app_meta_data
  ) VALUES (
    email,
    crypt(password, gen_salt('bf')),
    CURRENT_TIMESTAMP,
    jsonb_build_object(
      'first_name', first_name,
      'last_name', last_name,
      'must_change_password', true
    ),
    jsonb_build_object(
      'tenant_id', tenant_id,
      'role', role
    )
  )
  RETURNING id INTO new_user_id;
  
  -- Insert into users table
  INSERT INTO public.users (
    id,
    tenant_id,
    email,
    first_name,
    last_name,
    phone,
    role
  ) VALUES (
    new_user_id,
    tenant_id,
    email,
    first_name,
    last_name,
    phone,
    role
  );
  
  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 