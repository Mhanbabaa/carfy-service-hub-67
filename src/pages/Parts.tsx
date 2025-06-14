
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Package, TrendingUp, Calendar, DollarSign, Wrench } from 'lucide-react';
import { useSupabaseQuery } from '@/hooks/use-supabase-query';
import { PartsModal } from '@/components/parts/PartsModal';
import { LoadingOverlay } from '@/components/loading-overlay';

const Parts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);

  const { data: parts, isLoading, refetch } = useSupabaseQuery('service_parts_view', {
    select: '*',
    orderBy: 'created_at',
    orderDirection: 'desc'
  });

  const filteredParts = parts?.filter(part =>
    part.part_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.part_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.plate_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    part.vehicle_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddPart = () => {
    setSelectedPart(null);
    setIsModalOpen(true);
  };

  const handleEditPart = (part: any) => {
    setSelectedPart(part);
    setIsModalOpen(true);
  };

  const getTotalValue = () => {
    return parts?.reduce((sum, part) => sum + Number(part.total_price || 0), 0) || 0;
  };

  const getTotalQuantity = () => {
    return parts?.reduce((sum, part) => sum + Number(part.quantity || 0), 0) || 0;
  };

  const getThisMonthParts = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return parts?.filter(part => new Date(part.created_at) >= firstDayOfMonth).length || 0;
  };

  if (isLoading) {
    return <LoadingOverlay message="Parçalar yükleniyor..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-4 sm:space-y-6">
        {/* Header - Mobile responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Servis Parçaları
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Kullanılan parçaları görüntüleyin ve yönetin
            </p>
          </div>
          <Button 
            onClick={handleAddPart} 
            className="w-full sm:w-auto"
            size="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Parça
          </Button>
        </div>

        {/* Search - Mobile responsive */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Parça adı, kodu, plaka veya araç ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats Cards - Mobile responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{parts?.length || 0}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Toplam Parça</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">
                    ₺{getTotalValue().toLocaleString('tr-TR')}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Toplam Değer</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{getTotalQuantity()}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Toplam Adet</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{getThisMonthParts()}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Bu Ay Kullanılan</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Parts Grid - Mobile responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredParts.map((part) => (
            <Card key={part.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg sm:text-xl font-bold">
                      {part.part_name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {part.part_code && `Kod: ${part.part_code}`}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      part.service_status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}
                  >
                    {part.service_status === 'completed' ? 'Tamamlandı' : 'Devam Ediyor'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 sm:space-y-4">
                {/* Vehicle Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-1 bg-blue-100 dark:bg-blue-900/20 rounded">
                      <Wrench className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium">{part.service_reference}</span>
                  </div>
                </div>

                {/* Part Details */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Adet</p>
                    <p className="text-sm font-medium">{part.quantity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Birim Fiyat</p>
                    <p className="text-sm font-medium">₺{Number(part.unit_price || 0).toLocaleString('tr-TR')}</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Toplam Tutar</p>
                      <p className="text-lg font-bold text-primary">
                        ₺{Number(part.total_price || 0).toLocaleString('tr-TR')}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Kullanım Tarihi</p>
                  <p className="text-sm font-medium">
                    {new Date(part.created_at).toLocaleDateString('tr-TR')}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditPart(part)}
                    className="w-full"
                  >
                    Detayları Görüntüle
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredParts.length === 0 && (
          <Card>
            <CardContent className="p-8 sm:p-12 text-center">
              <Package className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Parça bulunamadı</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                {searchTerm ? 'Arama kriterlerinize uygun parça bulunamadı.' : 'Henüz kayıtlı parça bulunmuyor.'}
              </p>
              <Button onClick={handleAddPart} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                İlk Parçayı Ekle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <PartsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        part={selectedPart}
        onSave={() => {
          refetch();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default Parts;
