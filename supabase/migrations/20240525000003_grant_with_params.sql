-- Bu dosya setup_user_tenant RPC fonksiyonuna erişim izni verir
-- Fonksiyonun parametre listesini de belirtir

-- RPC fonksiyonuna erişim izni (tüm versiyonlar için)
-- İlk versiyon (telefon parametresi olmadan)
GRANT EXECUTE ON FUNCTION public.setup_user_tenant(
    user_id UUID,
    tenant_name TEXT,
    user_email TEXT,
    user_first_name TEXT,
    user_last_name TEXT,
    user_role TEXT
) TO authenticated, anon;

-- İkinci versiyon (telefon parametresi ile)
GRANT EXECUTE ON FUNCTION public.setup_user_tenant(
    user_id UUID,
    tenant_name TEXT,
    user_email TEXT,
    user_first_name TEXT,
    user_last_name TEXT,
    user_phone TEXT,
    user_role TEXT
) TO authenticated, anon; 