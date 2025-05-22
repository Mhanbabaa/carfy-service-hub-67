-- Bu dosya sadece setup_user_tenant RPC fonksiyonuna erişim izni verir
-- Policy'lerin zaten var olduğu durumlar için kullanılabilir

-- RPC fonksiyonuna erişim izni
DO $$
BEGIN
    -- Grant işlemi için doğrudan komut çalıştır
    -- Bu komut hali hazırda atanmış izinleri etkilemez
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.setup_user_tenant TO authenticated, anon';
END
$$; 