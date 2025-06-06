
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Clock, User, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const DailySchedules = () => {
  const { userProfile } = useAuth();

  const { data: todaysServices, isLoading } = useQuery({
    queryKey: ['daily-schedules', userProfile?.tenant_id],
    queryFn: async () => {
      if (!userProfile?.tenant_id) return [];

      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

      console.log('DailySchedules: Fetching today services for tenant:', userProfile.tenant_id);

      const { data, error } = await supabase
        .from('service_details')
        .select('*')
        .eq('tenant_id', userProfile.tenant_id)
        .gte('arrival_date', startOfToday.toISOString())
        .lte('arrival_date', endOfToday.toISOString())
        .order('arrival_date', { ascending: true });

      if (error) {
        console.error('Error fetching daily schedules:', error);
        return [];
      }

      console.log('DailySchedules: Found services:', data);
      return data || [];
    },
    enabled: !!userProfile?.tenant_id,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'completed':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'delivered':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'Bekliyor';
      case 'in_progress':
        return 'Devam Ediyor';
      case 'completed':
        return 'Tamamlandı';
      case 'delivered':
        return 'Teslim Edildi';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return 'Bilinmiyor';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!todaysServices || todaysServices.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        <Wrench className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Bugün planlanmış servis yok</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todaysServices.slice(0, 5).map((service) => (
        <div key={service.id} className="flex flex-col space-y-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {service.arrival_date ? format(new Date(service.arrival_date), 'HH:mm', { locale: tr }) : 'Saat belirtilmedi'}
              </span>
            </div>
            <Badge className={getStatusColor(service.status)}>
              {getStatusLabel(service.status)}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{service.plate_number}</span>
              <span className="text-xs text-muted-foreground">
                {service.brand_name} {service.model_name}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{service.customer_name}</span>
            </div>
            
            {service.technician_name && (
              <div className="flex items-center space-x-2">
                <Wrench className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{service.technician_name}</span>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {todaysServices.length > 5 && (
        <div className="text-center">
          <span className="text-xs text-muted-foreground">
            +{todaysServices.length - 5} servis daha
          </span>
        </div>
      )}
    </div>
  );
};
