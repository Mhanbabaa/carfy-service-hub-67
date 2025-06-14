
import React from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, subDays, startOfMonth, endOfMonth, subMonths, startOfYear, subYears } from 'date-fns';
import { DateRangePicker } from '@/components/date-range-picker';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Badge } from '@/components/ui/badge';
import { X, Calendar, Users } from 'lucide-react';

interface TechnicianPerformanceFiltersProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  selectedTechnicians: string[];
  onTechniciansChange: (technicians: string[]) => void;
  technicians: Array<{ id: string; name: string }>;
}

export const TechnicianPerformanceFilters: React.FC<TechnicianPerformanceFiltersProps> = ({
  dateRange,
  onDateRangeChange,
  selectedTechnicians,
  onTechniciansChange,
  technicians
}) => {
  const quickDateFilters = [
    {
      label: 'Son 7 Gün',
      range: {
        from: subDays(new Date(), 6),
        to: new Date()
      }
    },
    {
      label: 'Son 30 Gün',
      range: {
        from: subDays(new Date(), 29),
        to: new Date()
      }
    },
    {
      label: 'Bu Ay',
      range: {
        from: startOfMonth(new Date()),
        to: new Date()
      }
    },
    {
      label: 'Geçen Ay',
      range: {
        from: startOfMonth(subMonths(new Date(), 1)),
        to: endOfMonth(subMonths(new Date(), 1))
      }
    },
    {
      label: 'Bu Yıl',
      range: {
        from: startOfYear(new Date()),
        to: new Date()
      }
    }
  ];

  const technicianOptions = technicians.map(tech => ({
    value: tech.id,
    label: tech.name
  }));

  const handleTechnicianSelect = (technicianId: string) => {
    if (!selectedTechnicians.includes(technicianId)) {
      onTechniciansChange([...selectedTechnicians, technicianId]);
    }
  };

  const handleTechnicianRemove = (technicianId: string) => {
    onTechniciansChange(selectedTechnicians.filter(id => id !== technicianId));
  };

  const clearAllTechnicians = () => {
    onTechniciansChange([]);
  };

  return (
    <div className="bg-card border rounded-lg p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Filtreler</h3>
      </div>

      {/* Tarih Aralığı Seçici */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Tarih Aralığı</label>
        <div className="flex flex-col md:flex-row gap-3">
          <DateRangePicker 
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
            className="flex-1"
          />
          <div className="flex flex-wrap gap-2">
            {quickDateFilters.map((filter, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => onDateRangeChange(filter.range)}
                className="text-xs"
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Teknisyen Filtresi */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Teknisyenler
          </label>
          {selectedTechnicians.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearAllTechnicians}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Tümünü Temizle
            </Button>
          )}
        </div>
        
        <Combobox
          options={technicianOptions}
          onChange={handleTechnicianSelect}
          placeholder="Teknisyen seçin..."
          emptyMessage="Teknisyen bulunamadı."
          className="w-full md:w-80"
        />

        {/* Seçilen Teknisyenler */}
        {selectedTechnicians.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedTechnicians.map(techId => {
              const technician = technicians.find(t => t.id === techId);
              return technician ? (
                <Badge 
                  key={techId} 
                  variant="secondary" 
                  className="flex items-center gap-1"
                >
                  {technician.name}
                  <button
                    onClick={() => handleTechnicianRemove(techId)}
                    className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ) : null;
            })}
          </div>
        )}
      </div>
    </div>
  );
};
