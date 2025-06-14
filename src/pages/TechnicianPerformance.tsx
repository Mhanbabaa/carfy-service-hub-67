
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';
import { addDays, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { TechnicianPerformanceHeader } from '@/components/technician-performance/TechnicianPerformanceHeader';
import { TechnicianPerformanceFilters } from '@/components/technician-performance/TechnicianPerformanceFilters';
import { TechnicianKPICards } from '@/components/technician-performance/TechnicianKPICards';
import { TechnicianCharts } from '@/components/technician-performance/TechnicianCharts';
import { TechnicianPerformanceTable } from '@/components/technician-performance/TechnicianPerformanceTable';
import { LoadingOverlay } from '@/components/loading-overlay';
import { useTechnicianPerformanceData } from '@/hooks/useTechnicianPerformanceData';

const TechnicianPerformance = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);

  const {
    performanceData,
    technicians,
    isLoading,
    error
  } = useTechnicianPerformanceData(dateRange, selectedTechnicians);

  if (isLoading) {
    return <LoadingOverlay isLoading={true} message="Teknisyen performans verileri yükleniyor..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive">Veri yüklenirken bir hata oluştu.</p>
          <p className="text-muted-foreground text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <TechnicianPerformanceHeader />
      
      <TechnicianPerformanceFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        selectedTechnicians={selectedTechnicians}
        onTechniciansChange={setSelectedTechnicians}
        technicians={technicians}
      />

      {performanceData && performanceData.length > 0 ? (
        <>
          <TechnicianKPICards data={performanceData} />
          <TechnicianCharts data={performanceData} />
          <TechnicianPerformanceTable data={performanceData} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-lg font-medium mb-2">Gösterilecek veri bulunamadı</h3>
          <p className="text-muted-foreground">
            Seçilen dönem ve filtreler için teknisyen performans verisi bulunmuyor.
          </p>
        </div>
      )}
    </div>
  );
};

export default TechnicianPerformance;
