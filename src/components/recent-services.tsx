
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ServiceStatus } from '@/types/service';

export function RecentServices() {
  const { userProfile } = useAuth();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['recentServices', userProfile?.tenant_id],
    queryFn: async () => {
      if (!userProfile?.tenant_id) {
        return [];
      }

      const { data, error } = await supabase
        .from('service_details')
        .select('id, status, plate_number, customer_name, brand_name, model_name, arrival_date, total_cost')
        .eq('tenant_id', userProfile.tenant_id)
        .order('arrival_date', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent services:', error);
        return [];
      }

      return data.map(service => ({
        id: service.id,
        plate: service.plate_number,
        customer: service.customer_name,
        model: `${service.brand_name} ${service.model_name}`,
        date: new Date(service.arrival_date).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: service.status as ServiceStatus,
        price: new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(Number(service.total_cost)),
      }));
    },
    enabled: !!userProfile?.tenant_id,
  });

  const getStatusDisplay = (status: ServiceStatus) => {
    switch (status) {
      case 'waiting':
        return { label: 'Bekliyor', className: 'border-status-pending text-status-pending' };
      case 'in_progress':
        return { label: 'Aktif', className: 'border-status-active text-status-active' };
      case 'completed':
        return { label: 'Tamamlandı', className: 'border-muted text-muted-foreground' };
      case 'delivered':
        return { label: 'Teslim Edildi', className: 'border-green-500 text-green-500' };
      case 'cancelled':
        return { label: 'İptal', className: 'border-status-cancelled text-status-cancelled' };
      default:
        return { label: status, className: 'border-muted text-muted-foreground' };
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Son Servis İşlemleri</CardTitle>
        <CardDescription>Son 5 servis kaydını görüntüle</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Henüz servis kaydı bulunmamaktadır.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servis ID</TableHead>
                <TableHead>Plaka</TableHead>
                <TableHead>Müşteri</TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">Tutar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => {
                const statusDisplay = getStatusDisplay(service.status);
                return (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">SRV-{service.id.substring(0, 4)}</TableCell>
                    <TableCell>{service.plate}</TableCell>
                    <TableCell>{service.customer}</TableCell>
                    <TableCell>{service.model}</TableCell>
                    <TableCell>{service.date}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("capitalize", statusDisplay.className)}
                      >
                        {statusDisplay.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{service.price}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
