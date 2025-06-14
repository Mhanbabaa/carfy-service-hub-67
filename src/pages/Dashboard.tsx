
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/stat-card';
import { RevenueChart } from '@/components/revenue-chart';
import { RecentServices } from '@/components/recent-services';
import { DailySchedules } from '@/components/daily-schedules';
import { Car, Users, Wrench, TrendingUp, Calendar, Clock } from 'lucide-react';
import { useSupabaseQuery } from '@/hooks/use-supabase-query';

const Dashboard = () => {
  // Dashboard stats query
  const { data: stats, isLoading: statsLoading } = useSupabaseQuery('dashboard_stats', {
    select: '*',
    limit: 1
  });

  // Recent services query
  const { data: recentServices, isLoading: servicesLoading } = useSupabaseQuery('service_details', {
    select: '*',
    orderBy: 'created_at',
    orderDirection: 'desc',
    limit: 5
  });

  const dashboardStats = stats?.[0] || {
    active_vehicles: 0,
    delivered_this_month: 0,
    monthly_revenue: 0,
    yearly_revenue: 0
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Kontrol Paneli
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Servis merkezinizin genel durumu ve istatistikleri
          </p>
        </div>

        {/* Stats Grid - Mobile responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            title="Aktif Araçlar"
            value={dashboardStats.active_vehicles?.toString() || '0'}
            icon={Car}
            description="Serviste bulunan araçlar"
            isLoading={statsLoading}
          />
          <StatCard
            title="Bu Ay Teslim"
            value={dashboardStats.delivered_this_month?.toString() || '0'}
            icon={Calendar}
            description="Tamamlanan servisler"
            isLoading={statsLoading}
          />
          <StatCard
            title="Aylık Gelir"
            value={`₺${Number(dashboardStats.monthly_revenue || 0).toLocaleString('tr-TR')}`}
            icon={TrendingUp}
            description="Bu ay elde edilen gelir"
            isLoading={statsLoading}
          />
          <StatCard
            title="Yıllık Gelir"
            value={`₺${Number(dashboardStats.yearly_revenue || 0).toLocaleString('tr-TR')}`}
            icon={TrendingUp}
            description="Bu yıl toplam gelir"
            isLoading={statsLoading}
          />
        </div>

        {/* Charts and Recent Activity - Mobile responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Revenue Chart - Takes full width on mobile, 2/3 on desktop */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Gelir Analizi</CardTitle>
                <CardDescription className="text-sm">
                  Son 12 ayın gelir trendi
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="h-[300px] sm:h-[350px] lg:h-[400px]">
                  <RevenueChart />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Services - Takes full width on mobile, 1/3 on desktop */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                  Son Servisler
                </CardTitle>
                <CardDescription className="text-sm">
                  En son yapılan servis işlemleri
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <RecentServices services={recentServices || []} isLoading={servicesLoading} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Daily Schedules - Full width, better mobile layout */}
        <Card>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />
              Günlük Program
            </CardTitle>
            <CardDescription className="text-sm">
              Bugün yapılacak servis işlemleri
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6 pt-0">
            <DailySchedules />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
