
import { useQuery } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';
import { useSupabaseQuery } from '@/hooks/use-supabase-query';
import { format } from 'date-fns';

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

export const useTechnicianPerformanceData = (
  dateRange: DateRange | undefined,
  selectedTechnicians: string[]
) => {
  // Teknisyenlerin listesini al
  const { data: techniciansData } = useSupabaseQuery('users', {
    select: 'id, first_name, last_name',
    filter: { role: 'technician', status: 'active' },
    queryKey: ['technicians']
  });

  const technicians = techniciansData?.data?.map(tech => ({
    id: tech.id,
    name: `${tech.first_name} ${tech.last_name}`
  })) || [];

  // Performans verilerini al
  const { data: performanceData, isLoading, error } = useQuery({
    queryKey: ['technician-performance', dateRange, selectedTechnicians],
    queryFn: async () => {
      if (!dateRange?.from || !dateRange?.to) {
        return [];
      }

      // Burada gerçek veriler yerine örnek veri döndürüyoruz
      // Gerçek uygulamada Supabase'den veri çekilecek
      const mockData: TechnicianPerformanceData[] = technicians
        .filter(tech => selectedTechnicians.length === 0 || selectedTechnicians.includes(tech.id))
        .map((tech, index) => ({
          technicianId: tech.id,
          technicianName: tech.name,
          completedJobs: Math.floor(Math.random() * 50) + 10,
          totalRevenue: Math.floor(Math.random() * 100000) + 20000,
          laborRevenue: Math.floor(Math.random() * 50000) + 15000,
          partsRevenue: Math.floor(Math.random() * 50000) + 5000,
          avgCompletionTime: Math.random() * 5 + 1,
          comebackJobs: Math.floor(Math.random() * 5),
          satisfactionScore: Math.random() * 1 + 4 // 4-5 arası
        }));

      return mockData;
    },
    enabled: !!dateRange?.from && !!dateRange?.to
  });

  return {
    performanceData: performanceData || [],
    technicians,
    isLoading,
    error
  };
};
