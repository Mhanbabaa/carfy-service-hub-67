import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

/**
 * Kullanıcı oluşturulduğunda veya silindiğinde otomatik olarak users ve tenants tablolarına
 * eklemek veya silmek için bir hook
 * 
 * Bu hook, AuthContext içinde veya başka bir komponentte kullanılabilir
 */
export const useSupabaseAuthHooks = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Kullanıcı kayıt olduktan sonra RPC fonksiyonunu çağırarak tenant ve user oluştur
    const setupNewUser = async (user_id: string, email: string, firstName = "", lastName = "") => {
      try {
        console.log("Yeni kullanıcı için tenant ve user kaydı oluşturuluyor:", user_id);
        
        // Kullanıcı meta verilerini kontrol et
        const { data: userData } = await supabase.auth.getUser();
        
        // İsim bilgilerini user metadata'dan almayı dene
        const userFirstName = firstName || userData.user?.user_metadata?.first_name || email.split('@')[0];
        const userLastName = lastName || userData.user?.user_metadata?.last_name || '';
        
        // Tenant adını belirle (firma adı veya kullanıcı adı)
        const tenantName = userData.user?.user_metadata?.company_name || `${userFirstName}'s Tenant`;
        
        // RPC fonksiyonunu çağır (zaten varsa yeni oluşturmaz)
        const { data, error } = await supabase.rpc('setup_user_tenant', {
          user_id: user_id,
          tenant_name: tenantName,
          user_email: email,
          user_first_name: userFirstName,
          user_last_name: userLastName,
          user_phone: userData.user?.user_metadata?.phone || '',
          user_role: 'admin'
        });
        
        if (error) {
          console.error("Tenant ve kullanıcı kaydı oluşturulurken hata:", error);
          // Kritik hata durumunda kullanıcıyı bilgilendir
          toast({
            title: "Hesap Kurulumu Hatası",
            description: "Hesabınız oluşturuldu ancak bazı ayarlar yapılamadı. Lütfen yönetici ile iletişime geçin.",
            variant: "destructive",
          });
          return;
        }
        
        console.log("Tenant ve kullanıcı kaydı başarıyla oluşturuldu:", data);
        
      } catch (err) {
        console.error("Tenant ve kullanıcı kaydı oluşturulurken beklenmeyen hata:", err);
      }
    };

    // Auth state değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          console.log("Auth hook: Kullanıcı giriş yaptı");
          
          // Kullanıcının tenant_id'si var mı kontrol et
          // Bu işlem supabase_auth hatası alınmasını önlemek için 
          // bir timeout içinde gerçekleştirilmelidir
          setTimeout(async () => {
            try {
              const { data } = await supabase.from('users').select('id').eq('id', session?.user.id).single();
              
              // Eğer kullanıcı bulunamazsa, oluştur
              if (!data) {
                console.log("Kullanıcı users tablosunda bulunamadı, yeni kayıt oluşturuluyor");
                await setupNewUser(
                  session?.user.id || "", 
                  session?.user.email || "", 
                  session?.user.user_metadata?.first_name,
                  session?.user.user_metadata?.last_name
                );
              }
            } catch (error) {
              console.log("Kullanıcı kontrol hatası, yeni kayıt oluşturuluyor:", error);
              await setupNewUser(
                session?.user.id || "", 
                session?.user.email || "", 
                session?.user.user_metadata?.first_name,
                session?.user.user_metadata?.last_name
              );
            }
          }, 0);
        }
      }
    );
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);
  
  return null;
};
