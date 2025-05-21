import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';
import { addDays, format, parseISO } from 'date-fns';
import { CarIcon, CreditCardIcon, WrenchIcon, Loader2 } from 'lucide-react';
import { DateRangePicker } from '@/components/date-range-picker';
import { RevenueChart } from '@/components/revenue-chart';
import { StatCard } from '@/components/stat-card';
import { RecentServices } from '@/components/recent-services';
import { DailySchedules } from '@/components/daily-schedules';
import { withTenantFilter } from '@/lib/tenant-utils';

const Dashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-medium">Kullanıcı bilgileri yükleniyor...</h2>
      </div>
    );
  }

  if (!userProfile.tenant_id) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-medium text-red-500 mb-4">Tenant bilgisi bulunamadı</h2>
        <p>Firma bilgilerinize erişilemiyor. Sistem yöneticisiyle iletişime geçin.</p>
      </div>
    );
  }

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats', userProfile?.tenant_id, dateRange?.from, dateRange?.to],
    queryFn: async () => {
      if (!userProfile?.tenant_id || !dateRange?.from || !dateRange?.to) {
        return null;
      }

      console.log('Dashboard: Running query with tenant ID:', userProfile.tenant_id);

      try {
        // Get active services count
        const activeServicesQuery = withTenantFilter(
          supabase
            .from('services')
            .select('id', { count: 'exact' })
            .eq('status', 'active'),
          userProfile.tenant_id
        );
        
        const { count: activeServices, error: activeError } = await activeServicesQuery;
        
        if (activeError) {
          console.error('Error fetching active services:', activeError);
        }

        // Get vehicles delivered this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const deliveredQuery = withTenantFilter(
          supabase
            .from('services')
            .select('id', { count: 'exact' })
            .eq('status', 'completed')
            .gte('completed_at', startOfMonth.toISOString()),
          userProfile.tenant_id
        );
        
        const { count: deliveredThisMonth, error: deliveredError } = await deliveredQuery;
        
        if (deliveredError) {
          console.error('Error fetching delivered vehicles:', deliveredError);
        }

        // Get revenue data
        const revenueQuery = withTenantFilter(
          supabase
            .from('services')
            .select('total_price')
            .eq('status', 'completed')
            .gte('completed_at', startOfMonth.toISOString()),
          userProfile.tenant_id
        );
        
        const { data: revenueData, error: revenueError } = await revenueQuery;
        
        if (revenueError) {
          console.error('Error fetching revenue data:', revenueError);
        }
        
        // Calculate monthly revenue
        const monthlyRevenue = revenueData?.reduce((sum, service) => 
          sum + (service.total_price || 0), 0) || 0;
        
        // Get yearly revenue
        const startOfYear = new Date();
        startOfYear.setMonth(0, 1);
        startOfYear.setHours(0, 0, 0, 0);
        
        const yearlyRevenueQuery = withTenantFilter(
          supabase
            .from('services')
            .select('total_price')
            .eq('status', 'completed')
            .gte('completed_at', startOfYear.toISOString()),
          userProfile.tenant_id
        );
        
        const { data: yearlyRevenueData, error: yearlyRevenueError } = await yearlyRevenueQuery;
        
        if (yearlyRevenueError) {
          console.error('Error fetching yearly revenue data:', yearlyRevenueError);
        }
        
        // Calculate yearly revenue
        const yearlyRevenue = yearlyRevenueData?.reduce((sum, service) => 
          sum + (service.total_price || 0), 0) || 0;

        return {
          active_vehicles: activeServices || 0,
          delivered_this_month: deliveredThisMonth || 0,
          monthly_revenue: monthlyRevenue,
          yearly_revenue: yearlyRevenue,
        };
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return null;
      }
    },
    enabled: !!userProfile?.tenant_id && !!dateRange?.from && !!dateRange?.to,
  });

  const { data: monthlyRevenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['monthlyRevenue', userProfile?.tenant_id, dateRange?.from, dateRange?.to],
    queryFn: async () => {
      if (!userProfile?.tenant_id || !dateRange?.from || !dateRange?.to) {
        return [];
      }

      // Get current year for filtering
      const currentYear = new Date().getFullYear();
      
      // Create an array of months (0-11)
      const months = Array.from({ length: 12 }, (_, i) => i);
      
      // Initialize result with zero values for all months
      const result = months.map(month => {
        const monthNames = [
          'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
          'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        
        return {
          name: monthNames[month],
          month: month,
          total: 0
        };
      });
      
      // Query all completed services for the current year
      const startDate = new Date(currentYear, 0, 1).toISOString();
      const endDate = new Date(currentYear, 11, 31, 23, 59, 59).toISOString();
      
      const revenueQuery = withTenantFilter(
        supabase
          .from('services')
          .select('completed_at, total_price')
          .eq('status', 'completed')
          .gte('completed_at', startDate)
          .lte('completed_at', endDate),
        userProfile.tenant_id
      );
      
      const { data: servicesData, error: servicesError } = await revenueQuery;
      
      if (servicesError) {
        console.error('Error fetching monthly revenue data:', servicesError);
        return result;
      }
      
      // Aggregate revenue by month
      servicesData?.forEach(service => {
        if (service.completed_at && service.total_price) {
          const date = parseISO(service.completed_at);
          const month = date.getMonth();
          result[month].total += service.total_price;
        }
      });
      
      return result;
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

      {statsLoading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Veriler yükleniyor...</span>
        </div>
      ) : (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
            <TabsTrigger value="analytics">Analitik</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Aktif Servisler"
                value={Number(stats?.active_vehicles || 0)}
                description="Devam eden servis işlemleri"
                icon={<WrenchIcon className="h-4 w-4 text-muted-foreground" />}
                trend={{
                  value: 12,
                  isPositive: true,
                  label: "geçen haftadan"
                }}
              />
              <StatCard
                title="Bu Ay Teslim Edilen"
                value={Number(stats?.delivered_this_month || 0)}
                description="Teslim edilen araçlar"
                icon={<CarIcon className="h-4 w-4 text-muted-foreground" />}
                trend={{
                  value: 3,
                  isPositive: false,
                  label: "geçen aydan"
                }}
              />
              <StatCard
                title="Aylık Gelir"
                value={Number(stats?.monthly_revenue || 0)}
                description="Bu ayki toplam gelir"
                icon={<CreditCardIcon className="h-4 w-4 text-muted-foreground" />}
                trend={{
                  value: 2.5,
                  isPositive: true,
                  label: "geçen aydan"
                }}
              />
              <StatCard
                title="Yıllık Gelir"
                value={Number(stats?.yearly_revenue || 0)}
                description="Bu yılki toplam gelir"
                icon={<CreditCardIcon className="h-4 w-4 text-muted-foreground" />}
                trend={{
                  value: 4.3,
                  isPositive: true,
                  label: "geçen yıldan"
                }}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Aylık Gelir</CardTitle>
                  <CardDescription>Aylara göre servis gelirleri</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  {revenueLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <RevenueChart data={monthlyRevenueData || []} />
                  )}
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
      )}
    </div>
  );
};

export default Dashboard;
