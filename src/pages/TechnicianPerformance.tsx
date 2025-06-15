
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Clock, TrendingUp, Users, ArrowUpDown, Star, AlertTriangle } from 'lucide-react';
import { PerformanceCharts } from '@/components/technician/PerformanceCharts';
import { PerformanceTable } from '@/components/technician/PerformanceTable';
import { addDays, format } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';
import { useSupabaseQuery } from '@/hooks/use-supabase-query';

export default function TechnicianPerformance() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);

  // Fetch technicians data
  const { data: techniciansData } = useSupabaseQuery('users', {
    filter: { role: 'technician', status: 'active' },
    select: 'id,first_name,last_name,email,phone',
    queryKey: ['technicians']
  });

  // Fetch services data for KPIs
  const { data: servicesData } = useSupabaseQuery('services', {
    filter: {
      status: 'completed',
      ...(dateRange?.from && dateRange?.to && {
        updated_at: `gte.${dateRange.from.toISOString()}`
      })
    },
    select: 'id,labor_cost,parts_cost,total_cost,updated_at,arrival_date,delivery_date,technician_id',
    queryKey: ['services-performance', dateRange]
  });

  const technicians = techniciansData?.data || [];
  const services = servicesData?.data || [];

  // Calculate KPIs
  const totalJobs = services.length;
  const totalRevenue = services.reduce((sum, service) => sum + (Number(service.total_cost) || 0), 0);
  const avgCompletionTime = services.length > 0 ? 
    services.reduce((sum, service) => {
      if (service.arrival_date && service.delivery_date) {
        const arrivalDate = new Date(service.arrival_date);
        const deliveryDate = new Date(service.delivery_date);
        const diffDays = Math.ceil((deliveryDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24));
        return sum + diffDays;
      }
      return sum;
    }, 0) / services.length : 0;

  const quickFilters = [
    { label: 'Son 7 Gün', days: 7 },
    { label: 'Son 30 Gün', days: 30 },
    { label: 'Bu Ay', days: 30 },
    { label: 'Geçen Ay', days: 60 },
    { label: 'Bu Çeyrek', days: 90 },
  ];

  const handleQuickFilter = (days: number) => {
    setDateRange({
      from: addDays(new Date(), -days),
      to: new Date(),
    });
  };

  const handleTechnicianFilter = (technicianId: string) => {
    if (technicianId === 'all') {
      setSelectedTechnicians([]);
    } else {
      setSelectedTechnicians([technicianId]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sayfa Başlığı */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teknisyen Performans Analizi</h1>
          <p className="text-muted-foreground">
            Teknisyenlerin performansını detaylı olarak analiz edin ve karşılaştırın
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* 1. Bölüm: Global Filtreleme Barı */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtreler</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tarih Aralığı Seçici */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tarih Aralığı</label>
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                className="w-full md:w-[300px]"
              />
            </div>
            
            {/* Hızlı Filtreler */}
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((filter) => (
                <Button
                  key={filter.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickFilter(filter.days)}
                  className="text-xs"
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Teknisyen Filtresi */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Teknisyen Seçimi</label>
            <Select onValueChange={handleTechnicianFilter}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Tüm teknisyenler veya seçim yapın" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Teknisyenler</SelectItem>
                {technicians.map((technician) => (
                  <SelectItem key={technician.id} value={technician.id}>
                    {technician.first_name} {technician.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Seçilen Dönem Göstergesi */}
          {dateRange?.from && dateRange?.to && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Analiz Dönemi: {format(dateRange.from, 'dd MMM yyyy', { locale: tr })} - {format(dateRange.to, 'dd MMM yyyy', { locale: tr })}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Bölüm: KPI Gösterge Kartları */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Tamamlanan İş</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              Seçilen dönemde
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ciro</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Seçilen dönemde
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ort. Tamamlama Süresi</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCompletionTime.toFixed(1)} gün</div>
            <p className="text-xs text-muted-foreground">
              Ortalama süre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Teknisyen</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{technicians.length}</div>
            <p className="text-xs text-muted-foreground">
              Toplam teknisyen sayısı
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Bölüm: Görsel Analiz Alanı (Grafikler) */}
      <PerformanceCharts 
        technicians={technicians}
        services={services}
        selectedTechnicians={selectedTechnicians}
        dateRange={dateRange}
      />

      {/* 4. Bölüm: Detaylı Veri Tablosu */}
      <PerformanceTable 
        technicians={technicians}
        services={services}
        selectedTechnicians={selectedTechnicians}
      />
    </div>
  );
}
