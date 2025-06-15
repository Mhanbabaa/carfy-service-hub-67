
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, AlertTriangle, DollarSign } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

interface PerformanceChartsProps {
  technicians: any[];
  services: any[];
  selectedTechnicians: string[];
  dateRange?: DateRange;
}

export function PerformanceCharts({ technicians, services, selectedTechnicians }: PerformanceChartsProps) {
  // Process data for charts
  const processData = () => {
    const filteredTechnicians = selectedTechnicians.length > 0 
      ? technicians.filter(t => selectedTechnicians.includes(t.id))
      : technicians;

    return filteredTechnicians.map(technician => {
      const technicianServices = services.filter(s => s.technician_id === technician.id);
      
      const totalRevenue = technicianServices.reduce((sum, service) => 
        sum + (Number(service.total_cost) || 0), 0);
      
      const laborRevenue = technicianServices.reduce((sum, service) => 
        sum + (Number(service.labor_cost) || 0), 0);
      
      const partsRevenue = technicianServices.reduce((sum, service) => 
        sum + (Number(service.parts_cost) || 0), 0);

      const avgTime = technicianServices.length > 0 ? 
        technicianServices.reduce((sum, service) => {
          if (service.arrival_date && service.delivery_date) {
            const arrivalDate = new Date(service.arrival_date);
            const deliveryDate = new Date(service.delivery_date);
            const diffDays = Math.ceil((deliveryDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24));
            return sum + diffDays;
          }
          return sum;
        }, 0) / technicianServices.length : 0;

      return {
        name: `${technician.first_name} ${technician.last_name}`,
        revenue: totalRevenue,
        laborRevenue,
        partsRevenue,
        jobs: technicianServices.length,
        avgTime: Number(avgTime.toFixed(1)),
        comebacks: 0 // This would need additional logic to track comeback services
      };
    });
  };

  const data = processData();
  
  const formatCurrency = (value: number) => `₺${value.toLocaleString()}`;
  const formatTime = (value: number) => `${value} gün`;

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Seçilen dönem için gösterilecek veri bulunamadı.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Grafik 1: Teknisyene Göre Ciro Dağılımı */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Teknisyene Göre Ciro Dağılımı</CardTitle>
            <p className="text-sm text-muted-foreground">Seçilen dönemdeki toplam ciro performansı</p>
          </div>
          <DollarSign className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis tickFormatter={formatCurrency} fontSize={12} />
              <Tooltip 
                formatter={(value: any) => [formatCurrency(Number(value)), 'Ciro']}
                labelStyle={{ color: '#000' }}
              />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grafik 2: Teknisyene Göre Tamamlanan İş Sayısı */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Tamamlanan İş Sayısı</CardTitle>
            <p className="text-sm text-muted-foreground">Teknisyen başına iş adedi karşılaştırması</p>
          </div>
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={data} 
              layout="horizontal"
              margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" fontSize={12} />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={80}
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: any) => [Number(value), 'İş Sayısı']}
                labelStyle={{ color: '#000' }}
              />
              <Bar dataKey="jobs" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grafik 3: Verimlilik ve Hız Analizi */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Verimlilik Analizi</CardTitle>
            <p className="text-sm text-muted-foreground">Ortalama iş tamamlama süreleri</p>
          </div>
          <Clock className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={data} 
              layout="horizontal"
              margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={formatTime} fontSize={12} />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={80}
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: any) => [formatTime(Number(value)), 'Ortalama Süre']}
                labelStyle={{ color: '#000' }}
              />
              <Bar dataKey="avgTime" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grafik 4: İşçilik vs Parça Cirosu */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">İşçilik vs Parça Cirosu</CardTitle>
            <p className="text-sm text-muted-foreground">Ciro kaynaklarının dağılımı</p>
          </div>
          <DollarSign className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis tickFormatter={formatCurrency} fontSize={12} />
              <Tooltip 
                formatter={(value: any, name: string) => [
                  formatCurrency(Number(value)), 
                  name === 'laborRevenue' ? 'İşçilik' : 'Parça'
                ]}
                labelStyle={{ color: '#000' }}
              />
              <Bar dataKey="laborRevenue" fill="#8884d8" name="laborRevenue" />
              <Bar dataKey="partsRevenue" fill="#82ca9d" name="partsRevenue" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
