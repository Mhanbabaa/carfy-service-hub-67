
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';
import { CarIcon, CreditCardIcon, WrenchIcon } from 'lucide-react';
import { DateRangePicker } from '@/components/date-range-picker';
import { RevenueChart } from '@/components/revenue-chart';
import { StatCard } from '@/components/stat-card';
import { RecentServices } from '@/components/recent-services';
import { DailySchedules } from '@/components/daily-schedules';

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats', userProfile?.tenant_id],
    queryFn: async () => {
      if (!userProfile?.tenant_id) {
        return null;
      }

      const { data, error } = await supabase
        .from('dashboard_stats')
        .select('*')
        .eq('tenant_id', userProfile.tenant_id)
        .single();

      if (error) {
        console.error('Error fetching dashboard stats:', error);
        return null;
      }

      return data;
    },
    enabled: !!userProfile?.tenant_id,
  });

  const { data: monthlyRevenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['monthlyRevenue', userProfile?.tenant_id, dateRange?.from, dateRange?.to],
    queryFn: async () => {
      if (!userProfile?.tenant_id || !dateRange?.from || !dateRange?.to) {
        return [];
      }

      // In a real application, this would fetch actual revenue data by month
      // from your Supabase database, filtered by the selected date range
      return [
        { name: 'Ocak', total: 900 },
        { name: 'Şubat', total: 1200 },
        { name: 'Mart', total: 1800 },
        { name: 'Nisan', total: 1400 },
        { name: 'Mayıs', total: 2000 },
        { name: 'Haziran', total: 2400 },
      ];
    },
    enabled: !!userProfile?.tenant_id && !!dateRange?.from && !!dateRange?.to,
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Kontrol Paneli</h1>
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Aktif Servisler"
              value={statsLoading ? "-" : parseInt(stats?.active_vehicles?.toString() || '0')}
              description="Devam eden servis işlemleri"
              icon={<WrenchIcon className="h-4 w-4 text-muted-foreground" />}
              trend={{
                value: 12,
                direction: 'up',
                label: 'geçen haftadan',
              }}
            />
            <StatCard
              title="Bu Ay Teslim Edilen"
              value={statsLoading ? "-" : parseInt(stats?.delivered_this_month?.toString() || '0')}
              description="Teslim edilen araçlar"
              icon={<CarIcon className="h-4 w-4 text-muted-foreground" />}
              trend={{
                value: 3,
                direction: 'down',
                label: 'geçen aydan',
              }}
            />
            <StatCard
              title="Aylık Gelir"
              value={statsLoading ? "-" : Number(stats?.monthly_revenue || 0)}
              description="Bu ayki toplam gelir"
              icon={<CreditCardIcon className="h-4 w-4 text-muted-foreground" />}
              trend={{
                value: 2.5,
                direction: 'up',
                label: 'geçen aydan',
              }}
              valuePrefix="₺"
            />
            <StatCard
              title="Yıllık Gelir"
              value={statsLoading ? "-" : Number(stats?.yearly_revenue || 0)}
              description="Bu yılki toplam gelir"
              icon={<CreditCardIcon className="h-4 w-4 text-muted-foreground" />}
              trend={{
                value: 4.3,
                direction: 'up',
                label: 'geçen yıldan',
              }}
              valuePrefix="₺"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Aylık Gelir</CardTitle>
                <CardDescription>Aylara göre servis gelirleri</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <RevenueChart data={monthlyRevenueData || []} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Günlük Plan</CardTitle>
                <CardDescription>Bugün planlanmış servisler</CardDescription>
              </CardHeader>
              <CardContent>
                <DailySchedules />
              </CardContent>
            </Card>
          </div>
          <RecentServices />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analitik</CardTitle>
              <CardDescription>
                Gelişmiş veri analizi ve görselleştirmeler
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
              Analitik özellikleri yakında eklenecek...
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
