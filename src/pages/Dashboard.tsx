
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
import { RecentServices } from '@/components/recent-services';

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats', userProfile?.tenant_id],
    queryFn: async () => {
      if (!userProfile?.tenant_id) {
        throw new Error('No tenant ID available');
      }
      
      const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*')
        .eq('tenant_id', userProfile.tenant_id)
        .maybeSingle();

      if (error) throw error;
      return data as DashboardStats;
    },
    enabled: !!userProfile?.tenant_id,
  });

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['recentServices', userProfile?.tenant_id],
    queryFn: async () => {
      if (!userProfile?.tenant_id) {
        throw new Error('No tenant ID available');
      }
      
      const { data, error } = await supabase
        .from('service_details')
        .select('*')
        .eq('tenant_id', userProfile.tenant_id)
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
              title="Aktif Servisler"
              value={statsLoading ? "-" : `${parseInt(stats?.active_vehicles?.toString() || '0')}`}
              description="Devam eden servis işlemleri"
              icon={<WrenchIcon className="h-4 w-4 text-muted-foreground" />}
              trend={{
                value: "+5%",
                direction: "up",
                text: "geçen haftadan",
              }}
            />
            <StatCard
              title="Bu Ay Teslim Edilen"
              value={statsLoading ? "-" : `${parseInt(stats?.delivered_this_month?.toString() || '0')}`}
              description="Teslim edilen araçlar"
              icon={<CarIcon className="h-4 w-4 text-muted-foreground" />}
              trend={{
                value: "+12%",
                direction: "up",
                text: "geçen aydan",
              }}
            />
            <StatCard
              title="Aylık Gelir"
              value={statsLoading ? "-" : `₺${Number(stats?.monthly_revenue || 0).toLocaleString()}`}
              description="Bu ayki toplam gelir"
              icon={<CreditCardIcon className="h-4 w-4 text-muted-foreground" />}
              trend={{
                value: "+18%",
                direction: "up",
                text: "geçen aydan",
              }}
            />
            <StatCard
              title="Yeni Müşteriler"
              value="28"
              description="Bu ay kaydolan müşteriler"
              icon={<UserIcon className="h-4 w-4 text-muted-foreground" />}
              trend={{
                value: "+3%",
                direction: "up",
                text: "geçen aydan",
              }}
            />
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-1 md:col-span-2 lg:col-span-4">
              <CardHeader>
                <CardTitle>Gelir İstatistikleri</CardTitle>
              </CardHeader>
              <CardContent>
                <RevenueChart />
              </CardContent>
            </Card>
            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Günlük Program</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>20 Mayıs, 2025</span>
                </div>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="bg-primary/10 text-primary rounded-lg p-2">09:00</div>
                    <div>
                      <p className="font-medium">Toyota Corolla - 34ABC123</p>
                      <p className="text-sm text-muted-foreground">Periyodik Bakım</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="bg-primary/10 text-primary rounded-lg p-2">11:30</div>
                    <div>
                      <p className="font-medium">Honda Civic - 34DEF456</p>
                      <p className="text-sm text-muted-foreground">Fren Bakımı</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="bg-primary/10 text-primary rounded-lg p-2">14:00</div>
                    <div>
                      <p className="font-medium">Ford Focus - 34GHI789</p>
                      <p className="text-sm text-muted-foreground">Motor Arızası</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <RecentServices />
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analiz</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Bu bölüm yapım aşamasındadır.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Raporlar</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Bu bölüm yapım aşamasındadır.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
