
import { supabase } from '@/integrations/supabase/client';

export const getTenantName = async (): Promise<string> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      const { data: userProfile } = await supabase
        .from('users')
        .select('tenant:tenants(name)')
        .eq('id', userData.user.id)
        .single();
      
      if (userProfile?.tenant?.name) {
        return userProfile.tenant.name;
      }
    }
  } catch (error) {
    console.error('Tenant bilgisi alınamadı:', error);
  }
  
  return 'CARFY OTOSERVİS';
};
