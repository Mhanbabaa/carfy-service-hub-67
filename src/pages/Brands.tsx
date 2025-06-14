
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, CarFront, Factory, Package, Calendar } from 'lucide-react';
import { useSupabaseQuery } from '@/hooks/use-supabase-query';
import { LoadingOverlay } from '@/components/loading-overlay';

const Brands = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('brands');

  const { data: brands, isLoading: brandsLoading } = useSupabaseQuery('car_brands', {
    select: '*',
    orderBy: 'name',
    orderDirection: 'asc'
  });

  const { data: models, isLoading: modelsLoading } = useSupabaseQuery('car_models', {
    select: '*, car_brands(name)',
    orderBy: 'name',
    orderDirection: 'asc'
  });

  const { data: vehicles } = useSupabaseQuery('vehicles', {
    select: 'brand_id, model_id'
  });

  const filteredBrands = brands?.filter(brand =>
    brand.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredModels = models?.filter(model =>
    model.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.car_brands?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getVehicleCountByBrand = (brandId: string) => {
    return vehicles?.filter(vehicle => vehicle.brand_id === brandId).length || 0;
  };

  const getVehicleCountByModel = (modelId: string) => {
    return vehicles?.filter(vehicle => vehicle.model_id === modelId).length || 0;
  };

  const getModelCountByBrand = (brandId: string) => {
    return models?.filter(model => model.brand_id === brandId).length || 0;
  };

  const isLoading = brandsLoading || modelsLoading;

  if (isLoading) {
    return <LoadingOverlay message="Marka ve modeller yükleniyor..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-4 sm:space-y-6">
        {/* Header - Mobile responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Marka ve Modeller
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Araç markalarını ve modellerini görüntüleyin
            </p>
          </div>
        </div>

        {/* Search - Mobile responsive */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Marka veya model ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats Cards - Mobile responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Factory className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{brands?.length || 0}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Toplam Marka</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <CarFront className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{models?.length || 0}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Toplam Model</p>
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
                  <p className="text-xl sm:text-2xl font-bold">{vehicles?.length || 0}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Kayıtlı Araç</p>
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
                  <p className="text-xl sm:text-2xl font-bold">
                    {brands?.filter(brand => 
                      getVehicleCountByBrand(brand.id) > 0
                    ).length || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Aktif Marka</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs - Mobile responsive */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto p-1">
            <TabsTrigger value="brands" className="text-sm px-4 py-2">
              Markalar ({brands?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="models" className="text-sm px-4 py-2">
              Modeller ({models?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="brands" className="mt-4 sm:mt-6">
            {/* Brands Grid - Mobile responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredBrands.map((brand) => (
                <Card key={brand.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg sm:text-xl font-bold">
                          {brand.name}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          Araç Markası
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {getModelCountByBrand(brand.id)} Model
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 sm:space-y-4">
                    {/* Brand Stats */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Model Sayısı</p>
                        <p className="text-lg font-bold text-primary">
                          {getModelCountByBrand(brand.id)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Kayıtlı Araç</p>
                        <p className="text-lg font-bold text-primary">
                          {getVehicleCountByBrand(brand.id)}
                        </p>
                      </div>
                    </div>

                    {getVehicleCountByBrand(brand.id) > 0 && (
                      <Badge className="w-full justify-center bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        <Factory className="h-3 w-3 mr-1" />
                        Aktif Kullanımda
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredBrands.length === 0 && (
              <Card>
                <CardContent className="p-8 sm:p-12 text-center">
                  <Factory className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Marka bulunamadı</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {searchTerm ? 'Arama kriterlerinize uygun marka bulunamadı.' : 'Henüz kayıtlı marka bulunmuyor.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="models" className="mt-4 sm:mt-6">
            {/* Models Grid - Mobile responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredModels.map((model) => (
                <Card key={model.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg sm:text-xl font-bold">
                          {model.name}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {model.car_brands?.name}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {getVehicleCountByModel(model.id)} Araç
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3 sm:space-y-4">
                    {/* Model Stats */}
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground">Kayıtlı Araç Sayısı</p>
                          <p className="text-lg font-bold text-primary">
                            {getVehicleCountByModel(model.id)}
                          </p>
                        </div>
                        {getVehicleCountByModel(model.id) > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <CarFront className="h-3 w-3 mr-1" />
                            Aktif
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">Eklenme Tarihi</p>
                      <p className="text-sm font-medium">
                        {new Date(model.created_at).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredModels.length === 0 && (
              <Card>
                <CardContent className="p-8 sm:p-12 text-center">
                  <CarFront className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Model bulunamadı</h3>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {searchTerm ? 'Arama kriterlerinize uygun model bulunamadı.' : 'Henüz kayıtlı model bulunmuyor.'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Brands;
