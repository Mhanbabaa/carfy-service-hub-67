import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DashboardStats } from '@/types/database.types';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/stat-card';
import { RevenueChart } from '@/components/revenue-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, CarIcon, CreditCardIcon, UserIcon, WrenchIcon } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*')
        .eq('tenant_id', userProfile?.tenant_id || '')
        .maybeSingle();

      if (error) throw error;
      return data as DashboardStats;
    },
    enabled: !!userProfile?.tenant_id,
  });

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['recentServices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_details')
        .select('*')
        .eq('tenant_id', userProfile?.tenant_id || '')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!userProfile?.tenant_id,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gösterge Paneli</h1>
          <p className="text-muted-foreground">
            {userProfile?.tenant?.name || 'Servis'} için özet bilgiler ve istatistikler.
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="analytics">Analiz</TabsTrigger>
          <TabsTrigger value="reports">Raporlar</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Aktif Araçlar"
              value={statsLoading ? "Yükleniyor..." : String(stats?.active_vehicles || 0)}
              description="Servisteki araç sayısı"
              icon={<CarIcon className="h-6 w-6" />}
              className="bg-blue-50 dark:bg-blue-950"
            />
            <StatCard
              title="Bu Ay Teslim Edilen"
              value={statsLoading ? "Yükleniyor..." : String(stats?.delivered_this_month || 0)}
              description="Tamamlanan servis sayısı"
              icon={<WrenchIcon className="h-6 w-6" />}
              className="bg-green-50 dark:bg-green-950"
            />
            <StatCard
              title="Aylık Ciro"
              value={statsLoading ? "Yükleniyor..." : `₺${stats?.monthly_revenue?.toLocaleString() || 0}`}
              description="Bu ayki toplam gelir"
              icon={<CreditCardIcon className="h-6 w-6" />}
              className="bg-purple-50 dark:bg-purple-950"
            />
            <StatCard
              title="Yıllık Ciro"
              value={statsLoading ? "Yükleniyor..." : `₺${stats?.yearly_revenue?.toLocaleString() || 0}`}
              description="Bu yılki toplam gelir"
              icon={<CreditCardIcon className="h-6 w-6" />}
              className="bg-amber-50 dark:bg-amber-950"
            />
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Gelir Grafiği</CardTitle>
              </CardHeader>
              <CardContent>
                <RevenueChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Günlük Programlar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('tr-TR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
                <div className="space-y-4">
                  {servicesLoading ? (
                    <p className="text-muted-foreground">Yükleniyor...</p>
                  ) : services && services.length > 0 ? (
                    services.map((service: any) => (
                      <div key={service.id} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full 
                          ${service.status === 'waiting' ? 'bg-amber-100 text-amber-700' : 
                            service.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 
                            service.status === 'completed' ? 'bg-green-100 text-green-700' : 
                            service.status === 'delivered' ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-700'
                          } dark:bg-opacity-20`}
                        >
                          <CarIcon className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{service.plate_number}</p>
                          <p className="text-xs text-muted-foreground">{service.brand_name} {service.model_name}</p>
                        </div>
                        <div className="ml-auto space-y-1 text-right">
                          <p className="text-sm">{service.customer_name}</p>
                          <p className={`text-xs font-medium 
                            ${service.status === 'waiting' ? 'text-amber-600' : 
                              service.status === 'in_progress' ? 'text-blue-600' : 
                              service.status === 'completed' ? 'text-green-600' : 
                              service.status === 'delivered' ? 'text-purple-600' : 'text-red-600'
                            }`}
                          >
                            {service.status === 'waiting' ? 'Bekliyor' : 
                             service.status === 'in_progress' ? 'İşlemde' : 
                             service.status === 'completed' ? 'Tamamlandı' : 
                             service.status === 'delivered' ? 'Teslim Edildi' : 'İptal'
                            }
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Servis kaydı bulunmuyor.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="p-4 flex items-center justify-center h-80 bg-muted/30 rounded-md">
          <p className="text-muted-foreground">Analiz içeriği yakında eklenecek.</p>
        </TabsContent>
        <TabsContent value="reports" className="p-4 flex items-center justify-center h-80 bg-muted/30 rounded-md">
          <p className="text-muted-foreground">Rapor içeriği yakında eklenecek.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
