-- Bu politikalar yeni kullanıcı kaydı sırasında tenant ve kullanıcı kayıtlarını
-- oluşturmaya izin vermek için gereklidir.

-- Tenants tablosu için anonim kullanıcıların da yeni tenant ekleyebilmesi için policy
CREATE POLICY "Allow insertion to tenants through the signup function" ON tenants 
  FOR INSERT WITH CHECK (true);

-- Users tablosu için anonim kullanıcıların da yeni kullanıcı ekleyebilmesi için policy
CREATE POLICY "Allow insertion to users through the signup function" ON users 
  FOR INSERT WITH CHECK (true);

-- Auth.users tablosu için kısım kaldırıldı (yetki hatasına neden oluyor)

-- RPC fonksiyonuna erişim izni
GRANT EXECUTE ON FUNCTION public.setup_user_tenant TO authenticated, anon; 