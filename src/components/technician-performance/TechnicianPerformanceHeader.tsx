
import React from 'react';
import { Users, TrendingUp } from 'lucide-react';

export const TechnicianPerformanceHeader = () => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
        <Users className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Teknisyen Performans Panosu
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Teknisyenlerin performansını analiz edin ve karşılaştırın
        </p>
      </div>
    </div>
  );
};
