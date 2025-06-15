
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePickerWithRange } from '@/components/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Clock, TrendingUp, Users, ArrowUpDown, Star, AlertTriangle } from 'lucide-react';
import { PerformanceCharts } from '@/components/technician/PerformanceCharts';
import { PerformanceTable } from '@/components/technician/PerformanceTable';
import { addDays, format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function TechnicianPerformance() {
  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);

  // Mock data - gerçek uygulamada API'den gelecek
  const mockKPIs = {
    totalJobs: 156,
    totalRevenue: 125000,
    avgCompletionTime: 2.5,
    customerSatisfaction: 4.7,
  };

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
              <DatePickerWithRange
                date={dateRange}
                onDateChange={setDateRange}
                placeholder="Tarih aralığı seçin"
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
            <Select>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Tüm teknisyenler veya seçim yapın" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Teknisyenler</SelectItem>
                <SelectItem value="ahmet-yilmaz">Ahmet Yılmaz</SelectItem>
                <SelectItem value="mehmet-kara">Mehmet Kara</SelectItem>
                <SelectItem value="ali-demir">Ali Demir</SelectItem>
                <SelectItem value="mustafa-ozkan">Mustafa Özkan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Seçilen Dönem Göstergesi */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              Analiz Dönemi: {format(dateRange.from, 'dd MMM yyyy', { locale: tr })} - {format(dateRange.to, 'dd MMM yyyy', { locale: tr })}
            </span>
          </div>
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
            <div className="text-2xl font-bold">{mockKPIs.totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              +12% geçen aya göre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ciro</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₺{mockKPIs.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +8% geçen aya göre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ort. Tamamlama Süresi</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.avgCompletionTime} gün</div>
            <p className="text-xs text-muted-foreground">
              -0.3 gün geçen aya göre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Müşteri Memnuniyeti</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockKPIs.customerSatisfaction}/5</div>
            <p className="text-xs text-muted-foreground">
              +0.2 puan geçen aya göre
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 3. Bölüm: Görsel Analiz Alanı (Grafikler) */}
      <PerformanceCharts />

      {/* 4. Bölüm: Detaylı Veri Tablosu */}
      <PerformanceTable />
    </div>
  );
}
