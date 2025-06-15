
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line } from 'recharts';
import { TrendingUp, Clock, AlertTriangle, DollarSign } from 'lucide-react';

export function PerformanceCharts() {
  // Mock data - gerçek uygulamada API'den gelecek
  const revenueData = [
    { name: 'Ahmet Yılmaz', revenue: 28500, jobs: 42 },
    { name: 'Mehmet Kara', revenue: 24800, jobs: 38 },
    { name: 'Ali Demir', revenue: 31200, jobs: 45 },
    { name: 'Mustafa Özkan', revenue: 19600, jobs: 31 },
  ];

  const jobCountData = [
    { name: 'Ali Demir', jobs: 45 },
    { name: 'Ahmet Yılmaz', jobs: 42 },
    { name: 'Mehmet Kara', jobs: 38 },
    { name: 'Mustafa Özkan', jobs: 31 },
  ];

  const efficiencyData = [
    { name: 'Mehmet Kara', avgTime: 2.1 },
    { name: 'Ali Demir', avgTime: 2.3 },
    { name: 'Ahmet Yılmaz', avgTime: 2.7 },
    { name: 'Mustafa Özkan', avgTime: 3.2 },
  ];

  const qualityData = [
    { name: 'Ali Demir', comebacks: 2 },
    { name: 'Mehmet Kara', comebacks: 3 },
    { name: 'Ahmet Yılmaz', comebacks: 4 },
    { name: 'Mustafa Özkan', comebacks: 7 },
  ];

  const formatCurrency = (value: number) => `₺${value.toLocaleString()}`;
  const formatTime = (value: number) => `${value} gün`;

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
            <BarChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                formatter={[formatCurrency, 'Ciro']}
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
              data={jobCountData} 
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
                formatter={[(value: number) => [value, 'İş Sayısı']]}
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
              data={efficiencyData} 
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
                formatter={[(value: number) => [formatTime(value), 'Ortalama Süre']]}
                labelStyle={{ color: '#000' }}
              />
              <Bar dataKey="avgTime" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grafik 4: Kalite Metriği - Geri Gelen İşler */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Kalite Analizi</CardTitle>
            <p className="text-sm text-muted-foreground">Geri gelen iş sayıları (düşük daha iyi)</p>
          </div>
          <AlertTriangle className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={qualityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                formatter={[(value: number) => [value, 'Geri Gelen İş']]}
                labelStyle={{ color: '#000' }}
              />
              <Bar dataKey="comebacks" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
