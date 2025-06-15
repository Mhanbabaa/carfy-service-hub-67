
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechnicianData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  completedJobs: number;
  totalRevenue: number;
  laborRevenue: number;
  partsRevenue: number;
  avgCompletionTime: number;
  comebacks: number;
  customerSatisfaction: number;
}

interface PerformanceTableProps {
  technicians: any[];
  services: any[];
  selectedTechnicians: string[];
}

type SortKey = keyof TechnicianData;
type SortOrder = 'asc' | 'desc';

export function PerformanceTable({ technicians, services, selectedTechnicians }: PerformanceTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('totalRevenue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Process technician data
  const processData = (): TechnicianData[] => {
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
        id: technician.id,
        name: `${technician.first_name} ${technician.last_name}`,
        email: technician.email,
        completedJobs: technicianServices.length,
        totalRevenue,
        laborRevenue,
        partsRevenue,
        avgCompletionTime: Number(avgTime.toFixed(1)),
        comebacks: 0, // This would need additional logic to track comeback services
        customerSatisfaction: 4.5 // This would need customer feedback data
      };
    });
  };

  const technicianData = processData();

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const sortedData = [...technicianData].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatCurrency = (value: number) => `₺${value.toLocaleString()}`;

  const getPerformanceBadge = (satisfaction: number) => {
    if (satisfaction >= 4.5) {
      return <Badge className="bg-green-100 text-green-800">Mükemmel</Badge>;
    } else if (satisfaction >= 4.0) {
      return <Badge className="bg-yellow-100 text-yellow-800">İyi</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Geliştirilmeli</Badge>;
    }
  };

  if (technicianData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detaylı Performans Tablosu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Seçilen kriterlere uygun teknisyen bulunamadı.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Detaylı Performans Tablosu</CardTitle>
        <p className="text-sm text-muted-foreground">
          Teknisyenlerin tüm metriklerini karşılaştırın. Sütun başlıklarına tıklayarak sıralama yapabilirsiniz.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teknisyen</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('completedJobs')}
                    className="flex items-center gap-1 p-0 h-auto font-medium"
                  >
                    Tamamlanan İş
                    {getSortIcon('completedJobs')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('totalRevenue')}
                    className="flex items-center gap-1 p-0 h-auto font-medium"
                  >
                    Toplam Ciro
                    {getSortIcon('totalRevenue')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('laborRevenue')}
                    className="flex items-center gap-1 p-0 h-auto font-medium"
                  >
                    İşçilik Cirosu
                    {getSortIcon('laborRevenue')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('partsRevenue')}
                    className="flex items-center gap-1 p-0 h-auto font-medium"
                  >
                    Parça Cirosu
                    {getSortIcon('partsRevenue')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('avgCompletionTime')}
                    className="flex items-center gap-1 p-0 h-auto font-medium"
                  >
                    Ort. Tamamlama
                    {getSortIcon('avgCompletionTime')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('comebacks')}
                    className="flex items-center gap-1 p-0 h-auto font-medium"
                  >
                    Geri Gelen İş
                    {getSortIcon('comebacks')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('customerSatisfaction')}
                    className="flex items-center gap-1 p-0 h-auto font-medium"
                  >
                    Memnuniyet
                    {getSortIcon('customerSatisfaction')}
                  </Button>
                </TableHead>
                <TableHead>Performans</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((technician) => (
                <TableRow key={technician.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={technician.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(technician.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium">{technician.name}</span>
                        <p className="text-xs text-muted-foreground">{technician.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{technician.completedJobs}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(technician.totalRevenue)}</TableCell>
                  <TableCell>{formatCurrency(technician.laborRevenue)}</TableCell>
                  <TableCell>{formatCurrency(technician.partsRevenue)}</TableCell>
                  <TableCell>{technician.avgCompletionTime} gün</TableCell>
                  <TableCell>
                    <span className={cn(
                      "font-medium",
                      technician.comebacks <= 2 ? "text-green-600" :
                      technician.comebacks <= 5 ? "text-yellow-600" : "text-red-600"
                    )}>
                      {technician.comebacks}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{technician.customerSatisfaction}</span>
                      <span className="text-muted-foreground">/5</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getPerformanceBadge(technician.customerSatisfaction)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
