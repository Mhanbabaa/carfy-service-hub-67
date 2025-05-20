-- Kullanıcı ve tenant oluşturma işlemlerini tek bir fonksiyonda birleştiren RPC fonksiyonu
CREATE OR REPLACE FUNCTION public.create_tenant_with_user(
  tenant_name TEXT,
  user_email TEXT,
  user_password TEXT,
  user_first_name TEXT DEFAULT NULL,
  user_last_name TEXT DEFAULT NULL,
  user_phone TEXT DEFAULT NULL,
  user_role TEXT DEFAULT 'admin'
)
RETURNS JSONB AS $$
DECLARE
  new_tenant_id UUID;
  new_user_id UUID;
  result JSONB;
BEGIN
  -- Rol kontrolü
  IF user_role NOT IN ('admin', 'technician', 'consultant', 'accounting') THEN
    RAISE EXCEPTION 'Invalid role: %. Valid roles are: admin, technician, consultant, accounting', user_role;
  END IF;

  -- Tenant oluştur
  INSERT INTO public.tenants (
    name, 
    address,
    phone,
    email
  ) VALUES (
    tenant_name,
    NULL,
    user_phone,
    user_email
  )
  RETURNING id INTO new_tenant_id;

  -- Kullanıcı UUID'si oluştur
  new_user_id := gen_random_uuid();
  
  -- Auth tablosunda kullanıcı oluştur
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    raw_app_meta_data
  ) VALUES (
    new_user_id,
    user_email,
    crypt(user_password, gen_salt('bf')),
    CURRENT_TIMESTAMP,
    jsonb_build_object(
      'first_name', user_first_name,
      'last_name', user_last_name
    ),
    jsonb_build_object(
      'tenant_id', new_tenant_id::text,
      'role', user_role
    )
  );

  -- Users tablosuna kullanıcı ekle
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
    new_tenant_id,
    user_email,
    user_first_name,
    user_last_name,
    user_phone,
    user_role
  );

  -- Oluşturulan tenant ve kullanıcı bilgilerini döndür
  result := jsonb_build_object(
    'tenant_id', new_tenant_id,
    'user_id', new_user_id,
    'success', true
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- İlk giriş şifre değiştirme gereksinimini kaldır
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Yerine daha basic bir fonksiyon ekle (eğer gerekirse)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Kullanıcı metadata işlemleri (gerekirse)
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı tekrar oluştur ama şifre değiştirme olmadan
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user(); 