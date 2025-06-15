
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
  avatar?: string;
  completedJobs: number;
  totalRevenue: number;
  laborRevenue: number;
  partsRevenue: number;
  avgCompletionTime: number;
  comebacks: number;
  customerSatisfaction: number;
}

type SortKey = keyof TechnicianData;
type SortOrder = 'asc' | 'desc';

export function PerformanceTable() {
  const [sortKey, setSortKey] = useState<SortKey>('totalRevenue');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Mock data - gerçek uygulamada API'den gelecek
  const technicianData: TechnicianData[] = [
    {
      id: '1',
      name: 'Ali Demir',
      completedJobs: 45,
      totalRevenue: 31200,
      laborRevenue: 18700,
      partsRevenue: 12500,
      avgCompletionTime: 2.3,
      comebacks: 2,
      customerSatisfaction: 4.8,
    },
    {
      id: '2',
      name: 'Ahmet Yılmaz',
      completedJobs: 42,
      totalRevenue: 28500,
      laborRevenue: 17100,
      partsRevenue: 11400,
      avgCompletionTime: 2.7,
      comebacks: 4,
      customerSatisfaction: 4.6,
    },
    {
      id: '3',
      name: 'Mehmet Kara',
      completedJobs: 38,
      totalRevenue: 24800,
      laborRevenue: 14900,
      partsRevenue: 9900,
      avgCompletionTime: 2.1,
      comebacks: 3,
      customerSatisfaction: 4.7,
    },
    {
      id: '4',
      name: 'Mustafa Özkan',
      completedJobs: 31,
      totalRevenue: 19600,
      laborRevenue: 11800,
      partsRevenue: 7800,
      avgCompletionTime: 3.2,
      comebacks: 7,
      customerSatisfaction: 4.2,
    },
  ];

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
                      <span className="font-medium">{technician.name}</span>
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
