
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface TechnicianPerformanceData {
  technicianId: string;
  technicianName: string;
  completedJobs: number;
  totalRevenue: number;
  laborRevenue: number;
  partsRevenue: number;
  avgCompletionTime: number;
  comebackJobs: number;
  satisfactionScore?: number;
}

interface TechnicianChartsProps {
  data: TechnicianPerformanceData[];
}

const chartConfig = {
  revenue: {
    label: "Ciro",
    color: "hsl(var(--primary))",
  },
  jobs: {
    label: "İş Sayısı",
    color: "hsl(var(--secondary))",
  },
  efficiency: {
    label: "Verimlilik",
    color: "hsl(var(--accent))",
  },
  comebacks: {
    label: "Geri Gelen İşler",
    color: "hsl(var(--destructive))",
  }
};

export const TechnicianCharts: React.FC<TechnicianChartsProps> = ({ data }) => {
  const revenueData = data.map(tech => ({
    name: tech.technicianName.split(' ')[0], // Sadece ilk isim
    revenue: tech.totalRevenue,
    fullName: tech.technicianName
  }));

  const jobsData = data.map(tech => ({
    name: tech.technicianName.split(' ')[0],
    jobs: tech.completedJobs,
    fullName: tech.technicianName
  }));

  const efficiencyData = data.map(tech => ({
    name: tech.technicianName.split(' ')[0],
    time: tech.avgCompletionTime,
    fullName: tech.technicianName
  }));

  const comebackData = data.map(tech => ({
    name: tech.technicianName.split(' ')[0],
    comebacks: tech.comebackJobs,
    fullName: tech.technicianName
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {/* Ciro Dağılımı */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Teknisyene Göre Ciro Dağılımı</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₺${value.toLocaleString()}`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value, name, props) => [
                      `₺${value.toLocaleString()}`,
                      'Toplam Ciro'
                    ]}
                    labelFormatter={(label, payload) => 
                      payload?.[0]?.payload?.fullName || label
                    }
                  />} 
                />
                <Bar dataKey="revenue" fill="var(--color-revenue)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Tamamlanan İş Sayısı */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tamamlanan İş Sayısı</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobsData} layout="horizontal">
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value, name, props) => [
                      `${value} İş`,
                      'Tamamlanan'
                    ]}
                    labelFormatter={(label, payload) => 
                      payload?.[0]?.payload?.fullName || label
                    }
                  />} 
                />
                <Bar dataKey="jobs" fill="var(--color-jobs)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Ortalama Tamamlama Süresi */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ortalama İş Tamamlama Süresi</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={efficiencyData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value} gün`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value, name, props) => [
                      `${Number(value).toFixed(1)} gün`,
                      'Ortalama Süre'
                    ]}
                    labelFormatter={(label, payload) => 
                      payload?.[0]?.payload?.fullName || label
                    }
                  />} 
                />
                <Bar dataKey="time" fill="var(--color-efficiency)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Geri Gelen İşler */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Geri Gelen İşler (Kalite Metriği)</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comebackData}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    formatter={(value, name, props) => [
                      `${value} İş`,
                      'Geri Gelen'
                    ]}
                    labelFormatter={(label, payload) => 
                      payload?.[0]?.payload?.fullName || label
                    }
                  />} 
                />
                <Bar dataKey="comebacks" fill="var(--color-comebacks)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
