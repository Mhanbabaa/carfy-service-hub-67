
-- Service history tablosunu güncelleyip trigger ekleyelim
CREATE OR REPLACE FUNCTION public.track_service_changes()
RETURNS trigger AS $$
BEGIN
  -- Durum değişikliği varsa kaydet
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.service_history (
      tenant_id,
      service_id,
      user_id,
      action,
      description,
      created_at
    ) VALUES (
      NEW.tenant_id,
      NEW.id,
      auth.uid(),
      CASE NEW.status
        WHEN 'pending' THEN 'Servis Beklemede'
        WHEN 'in_progress' THEN 'Servis Başlatıldı'
        WHEN 'completed' THEN 'Servis Tamamlandı'
        WHEN 'delivered' THEN 'Araç Teslim Edildi'
        WHEN 'cancelled' THEN 'Servis İptal Edildi'
        ELSE 'Durum Değiştirildi'
      END,
      CASE NEW.status
        WHEN 'pending' THEN 'Servis durumu beklemede olarak değiştirildi'
        WHEN 'in_progress' THEN 'Servis işlemi başlatıldı'
        WHEN 'completed' THEN 'Servis işlemi tamamlandı'
        WHEN 'delivered' THEN 'Araç müşteriye teslim edildi'
        WHEN 'cancelled' THEN 'Servis işlemi iptal edildi'
        ELSE 'Servis durumu güncellendi'
      END,
      NOW()
    );
    
    -- Eğer durum "delivered" ise ve delivery_date boşsa, otomatik set et
    IF NEW.status = 'delivered' AND NEW.delivery_date IS NULL THEN
      NEW.delivery_date = NOW();
    END IF;
  END IF;
  
  -- İlk oluşturulma kaydı
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.service_history (
      tenant_id,
      service_id,
      user_id,
      action,
      description,
      created_at
    ) VALUES (
      NEW.tenant_id,
      NEW.id,
      auth.uid(),
      'Servis Oluşturuldu',
      'Yeni servis kaydı oluşturuldu',
      NEW.created_at
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger'ı services tablosuna ekle
DROP TRIGGER IF EXISTS track_service_changes_trigger ON public.services;
CREATE TRIGGER track_service_changes_trigger
  BEFORE INSERT OR UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.track_service_changes();

-- Mevcut service_history kayıtları için user bilgilerini getirmek için view oluştur
CREATE OR REPLACE VIEW public.service_history_with_user AS
SELECT 
  sh.*,
  COALESCE(u.first_name || ' ' || u.last_name, 'Sistem') as user_name
FROM public.service_history sh
LEFT JOIN public.users u ON sh.user_id = u.id;
