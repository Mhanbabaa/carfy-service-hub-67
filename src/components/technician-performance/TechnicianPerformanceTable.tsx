
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

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

interface TechnicianPerformanceTableProps {
  data: TechnicianPerformanceData[];
}

type SortField = keyof TechnicianPerformanceData;
type SortDirection = 'asc' | 'desc';

export const TechnicianPerformanceTable: React.FC<TechnicianPerformanceTableProps> = ({ data }) => {
  const [sortField, setSortField] = useState<SortField>('totalRevenue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    
    const modifier = sortDirection === 'asc' ? 1 : -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return aValue.localeCompare(bValue) * modifier;
    }
    
    return (Number(aValue) - Number(bValue)) * modifier;
  });

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const getPerformanceBadge = (comebacks: number, totalJobs: number) => {
    const comebackRate = totalJobs > 0 ? (comebacks / totalJobs) * 100 : 0;
    
    if (comebackRate <= 2) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Mükemmel</Badge>;
    } else if (comebackRate <= 5) {
      return <Badge variant="secondary">İyi</Badge>;
    } else if (comebackRate <= 10) {
      return <Badge variant="outline" className="border-yellow-300 text-yellow-700">Orta</Badge>;
    } else {
      return <Badge variant="destructive">Geliştirilmeli</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Detaylı Teknisyen Performans Tablosu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">Teknisyen</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('completedJobs')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Tamamlanan İş
                    {getSortIcon('completedJobs')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('totalRevenue')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Toplam Ciro
                    {getSortIcon('totalRevenue')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('laborRevenue')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    İşçilik Cirosu
                    {getSortIcon('laborRevenue')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('partsRevenue')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Parça Cirosu
                    {getSortIcon('partsRevenue')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('avgCompletionTime')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Ort. Tamamlama
                    {getSortIcon('avgCompletionTime')}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleSort('comebackJobs')}
                    className="h-auto p-0 font-medium hover:bg-transparent"
                  >
                    Geri Gelen İş
                    {getSortIcon('comebackJobs')}
                  </Button>
                </TableHead>
                <TableHead>Kalite</TableHead>
                {data.some(tech => tech.satisfactionScore) && (
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleSort('satisfactionScore')}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      Memnuniyet
                      {getSortIcon('satisfactionScore')}
                    </Button>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((technician) => (
                <TableRow key={technician.technicianId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {technician.technicianName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{technician.technicianName}</div>
                        <div className="text-sm text-muted-foreground">ID: {technician.technicianId.slice(0, 8)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{technician.completedJobs}</TableCell>
                  <TableCell className="font-medium">₺{technician.totalRevenue.toLocaleString()}</TableCell>
                  <TableCell>₺{technician.laborRevenue.toLocaleString()}</TableCell>
                  <TableCell>₺{technician.partsRevenue.toLocaleString()}</TableCell>
                  <TableCell>{technician.avgCompletionTime.toFixed(1)} gün</TableCell>
                  <TableCell>{technician.comebackJobs}</TableCell>
                  <TableCell>
                    {getPerformanceBadge(technician.comebackJobs, technician.completedJobs)}
                  </TableCell>
                  {data.some(tech => tech.satisfactionScore) && (
                    <TableCell>
                      {technician.satisfactionScore ? (
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{technician.satisfactionScore.toFixed(1)}</span>
                          <span className="text-muted-foreground">/5</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
