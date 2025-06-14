
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Clock, DollarSign } from 'lucide-react';

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

interface TechnicianKPICardsProps {
  data: TechnicianPerformanceData[];
}

export const TechnicianKPICards: React.FC<TechnicianKPICardsProps> = ({ data }) => {
  const totalJobs = data.reduce((sum, tech) => sum + tech.completedJobs, 0);
  const totalRevenue = data.reduce((sum, tech) => sum + tech.totalRevenue, 0);
  const avgCompletionTime = data.length > 0 
    ? data.reduce((sum, tech) => sum + tech.avgCompletionTime, 0) / data.length 
    : 0;
  const avgSatisfaction = data.filter(tech => tech.satisfactionScore).length > 0
    ? data.filter(tech => tech.satisfactionScore).reduce((sum, tech) => sum + (tech.satisfactionScore || 0), 0) / data.filter(tech => tech.satisfactionScore).length
    : null;

  const kpiCards = [
    {
      title: 'Toplam Tamamlanan İş',
      value: totalJobs.toLocaleString(),
      icon: Users,
      description: 'Seçilen dönemde tamamlanan toplam iş sayısı'
    },
    {
      title: 'Toplam Ciro',
      value: `₺${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: 'İşçilik ve parça satışlarından toplam gelir'
    },
    {
      title: 'Ortalama Tamamlama Süresi',
      value: `${avgCompletionTime.toFixed(1)} gün`,
      icon: Clock,
      description: 'Bir işin baştan sona tamamlanma süresi'
    },
    ...(avgSatisfaction ? [{
      title: 'Müşteri Memnuniyeti',
      value: `${avgSatisfaction.toFixed(1)}/5`,
      icon: TrendingUp,
      description: 'Ortalama müşteri memnuniyet puanı'
    }] : [])
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {kpiCards.map((card, index) => (
        <Card key={index} className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
