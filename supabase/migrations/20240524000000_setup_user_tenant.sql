-- Function to setup a new user and tenant from signup
CREATE OR REPLACE FUNCTION public.setup_user_tenant(
  user_id UUID,
  tenant_name TEXT,
  user_email TEXT,
  user_first_name TEXT DEFAULT NULL,
  user_last_name TEXT DEFAULT NULL,
  user_phone TEXT DEFAULT NULL,
  user_role TEXT DEFAULT 'admin'
)
RETURNS JSONB AS $$
DECLARE
  new_tenant_id UUID;
  result JSONB;
BEGIN
  -- Check for valid role
  IF user_role NOT IN ('admin', 'technician', 'consultant', 'accounting') THEN
    RAISE EXCEPTION 'Invalid role: %. Valid roles are: admin, technician, consultant, accounting', user_role;
  END IF;

  -- Create a new tenant
  INSERT INTO public.tenants (
    name, 
    email,
    phone
  ) VALUES (
    tenant_name,
    user_email,
    user_phone
  )
  RETURNING id INTO new_tenant_id;

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
    user_id,
    new_tenant_id,
    user_email,
    user_first_name,
    user_last_name,
    user_phone,
    user_role
  );

  -- auth.users tablosunu güncelleme kısmı kaldırıldı (yetki sorunu oluşturuyor)
  -- Kullanıcının tenant_id bilgisi sadece public.users tablosunda saklanacak

  -- Return result
  result := jsonb_build_object(
    'tenant_id', new_tenant_id,
    'user_id', user_id,
    'success', true
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 