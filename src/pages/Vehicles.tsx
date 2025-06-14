
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Car, Calendar, Phone, Mail, Wrench } from 'lucide-react';
import { useSupabaseQuery } from '@/hooks/use-supabase-query';
import { VehicleEditModal } from '@/components/vehicles/VehicleEditModal';
import { LoadingOverlay } from '@/components/loading-overlay';

const Vehicles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const { data: vehicles, isLoading, refetch } = useSupabaseQuery('vehicle_details', {
    select: '*',
    orderBy: 'created_at',
    orderDirection: 'desc'
  });

  const filteredVehicles = vehicles?.filter(vehicle =>
    vehicle.plate_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.brand_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.model_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setIsModalOpen(true);
  };

  const handleEditVehicle = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_service':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'waiting':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_service':
        return 'Serviste';
      case 'completed':
        return 'Tamamlandı';
      case 'waiting':
        return 'Bekliyor';
      default:
        return 'Aktif';
    }
  };

  if (isLoading) {
    return <LoadingOverlay message="Araçlar yükleniyor..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-4 sm:space-y-6">
        {/* Header - Mobile responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Araçlar
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Kayıtlı araçları görüntüleyin ve yönetin
            </p>
          </div>
          <Button 
            onClick={handleAddVehicle} 
            className="w-full sm:w-auto"
            size="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Araç
          </Button>
        </div>

        {/* Search - Mobile responsive */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Plaka, müşteri adı, marka veya model ara..."
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
                  <Car className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{vehicles?.length || 0}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Toplam Araç</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Wrench className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">
                    {vehicles?.filter(v => v.status === 'in_service').length || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Serviste</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">
                    {vehicles?.filter(v => v.last_service_date && 
                      new Date(v.last_service_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    ).length || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Bu Ay Servis</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Car className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">
                    {vehicles?.filter(v => v.under_warranty).length || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Garantili</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicles Grid - Mobile responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg sm:text-xl font-bold">
                      {vehicle.plate_number}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {vehicle.brand_name} {vehicle.model_name} ({vehicle.year})
                    </CardDescription>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(vehicle.status)}`}>
                    {getStatusText(vehicle.status)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 sm:space-y-4">
                {/* Customer Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-1 bg-blue-100 dark:bg-blue-900/20 rounded">
                      <Car className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium">{vehicle.customer_name}</span>
                  </div>
                  
                  {vehicle.customer_phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3 ml-6" />
                      <span>{vehicle.customer_phone}</span>
                    </div>
                  )}
                  
                  {vehicle.customer_email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3 ml-6" />
                      <span className="truncate">{vehicle.customer_email}</span>
                    </div>
                  )}
                </div>

                {/* Vehicle Details */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Kilometre</p>
                    <p className="text-sm font-medium">{vehicle.mileage?.toLocaleString('tr-TR')} km</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Servis Sayısı</p>
                    <p className="text-sm font-medium">{vehicle.service_count || 0}</p>
                  </div>
                </div>

                {vehicle.last_service_date && (
                  <div>
                    <p className="text-xs text-muted-foreground">Son Servis</p>
                    <p className="text-sm font-medium">
                      {new Date(vehicle.last_service_date).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditVehicle(vehicle)}
                    className="w-full"
                  >
                    Detayları Görüntüle
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <Card>
            <CardContent className="p-8 sm:p-12 text-center">
              <Car className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Araç bulunamadı</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                {searchTerm ? 'Arama kriterlerinize uygun araç bulunamadı.' : 'Henüz kayıtlı araç bulunmuyor.'}
              </p>
              <Button onClick={handleAddVehicle} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                İlk Aracı Ekle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <VehicleEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        vehicle={selectedVehicle}
        onSave={() => {
          refetch();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default Vehicles;
