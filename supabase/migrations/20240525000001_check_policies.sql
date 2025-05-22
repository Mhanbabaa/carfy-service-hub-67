-- Bu SQL dosyası, var olan policy'leri kontrol eder ve yalnızca eksik policy'leri ekler

-- Tenants tablosu policy kontrolü
DO $$
BEGIN
    -- Tenants için policy kontrol et
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'tenants' 
        AND policyname = 'Allow insertion to tenants through the signup function'
    ) THEN
        -- Yoksa oluştur
        EXECUTE 'CREATE POLICY "Allow insertion to tenants through the signup function" ON tenants 
                 FOR INSERT WITH CHECK (true)';
    END IF;

    -- Users için policy kontrol et
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Allow insertion to users through the signup function'
    ) THEN
        -- Yoksa oluştur
        EXECUTE 'CREATE POLICY "Allow insertion to users through the signup function" ON users 
                 FOR INSERT WITH CHECK (true)';
    END IF;
END
$$; 