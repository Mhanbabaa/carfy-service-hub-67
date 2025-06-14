
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Wrench, Calendar, TrendingUp, Clock, Car, CheckCircle, AlertCircle } from 'lucide-react';
import { useSupabaseQuery } from '@/hooks/use-supabase-query';
import { ServiceModal } from '@/components/services/ServiceModal';
import { LoadingOverlay } from '@/components/loading-overlay';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  const { data: services, isLoading, refetch } = useSupabaseQuery('service_details', {
    select: '*',
    orderBy: 'created_at',
    orderDirection: 'desc'
  });

  const filteredServices = services?.filter(service => {
    const matchesSearch = 
      service.plate_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.brand_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.model_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.technician_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && service.status === activeTab;
  }) || [];

  const getStatusCount = (status: string) => {
    if (status === 'all') return services?.length || 0;
    return services?.filter(service => service.status === status).length || 0;
  };

  const handleAddService = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service: any) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleViewDetail = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'delivered':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'Bekliyor';
      case 'in_progress':
        return 'Devam Ediyor';
      case 'completed':
        return 'Tamamlandı';
      case 'delivered':
        return 'Teslim Edildi';
      default:
        return 'Bilinmiyor';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Clock className="h-4 w-4" />;
      case 'in_progress':
        return <Wrench className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'delivered':
        return <Car className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return <LoadingOverlay message="Servisler yükleniyor..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-4 sm:space-y-6">
        {/* Header - Mobile responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Servis İşlemleri
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Servis süreçlerini takip edin ve yönetin
            </p>
          </div>
          <Button 
            onClick={handleAddService} 
            className="w-full sm:w-auto"
            size="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Servis
          </Button>
        </div>

        {/* Search - Mobile responsive */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Plaka, müşteri adı, marka veya teknisyen ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats Cards - Mobile responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/20 rounded">
                  <Wrench className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold">{getStatusCount('all')}</p>
                  <p className="text-xs text-muted-foreground">Toplam</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/20 rounded">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold">{getStatusCount('waiting')}</p>
                  <p className="text-xs text-muted-foreground">Bekliyor</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900/20 rounded">
                  <Wrench className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold">{getStatusCount('in_progress')}</p>
                  <p className="text-xs text-muted-foreground">Devam Ediyor</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/20 rounded">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold">{getStatusCount('completed')}</p>
                  <p className="text-xs text-muted-foreground">Tamamlandı</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 dark:bg-purple-900/20 rounded">
                  <Car className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold">{getStatusCount('delivered')}</p>
                  <p className="text-xs text-muted-foreground">Teslim Edildi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Tabs - Mobile responsive */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1">
            <TabsTrigger value="all" className="text-xs sm:text-sm px-2 py-2">
              Tümü ({getStatusCount('all')})
            </TabsTrigger>
            <TabsTrigger value="waiting" className="text-xs sm:text-sm px-2 py-2">
              Bekliyor ({getStatusCount('waiting')})
            </TabsTrigger>
            <TabsTrigger value="in_progress" className="text-xs sm:text-sm px-2 py-2">
              Devam Ediyor ({getStatusCount('in_progress')})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm px-2 py-2">
              Tamamlandı ({getStatusCount('completed')})
            </TabsTrigger>
            <TabsTrigger value="delivered" className="text-xs sm:text-sm px-2 py-2">
              Teslim Edildi ({getStatusCount('delivered')})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4 sm:mt-6">
            {/* Services Grid - Mobile responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredServices.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg sm:text-xl font-bold">
                          {service.plate_number}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {service.brand_name} {service.model_name}
                        </CardDescription>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(service.status)} flex items-center gap-1`}>
                        {getStatusIcon(service.status)}
                        {getStatusText(service.status)}
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
                        <span className="font-medium">{service.customer_name}</span>
                      </div>
                      
                      {service.customer_phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="ml-6">{service.customer_phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Service Details */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Giriş Tarihi</p>
                        <p className="text-sm font-medium">
                          {service.arrival_date ? new Date(service.arrival_date).toLocaleDateString('tr-TR') : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Toplam Tutar</p>
                        <p className="text-sm font-medium">
                          ₺{Number(service.total_cost || 0).toLocaleString('tr-TR')}
                        </p>
                      </div>
                    </div>

                    {service.technician_name && (
                      <div>
                        <p className="text-xs text-muted-foreground">Teknisyen</p>
                        <p className="text-sm font-medium">{service.technician_name}</p>
                      </div>
                    )}

                    {service.complaint && (
                      <div>
                        <p className="text-xs text-muted-foreground">Şikayet</p>
                        <p className="text-sm font-medium line-clamp-2">{service.complaint}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-2 space-y-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDetail(service.id)}
                        className="w-full"
                      >
                        Detayları Görüntüle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <Card>
                <CardContent className="p-8 sm:p-12 text-center">
                  <Wrench className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Servis bulunamadı</h3>
                  <p className="text-sm sm:text-base text-muted-foreground mb-4">
                    {searchTerm ? 'Arama kriterlerinize uygun servis bulunamadı.' : 'Bu kategoride servis bulunmuyor.'}
                  </p>
                  <Button onClick={handleAddService} className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni Servis Ekle
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={selectedService}
        onSave={() => {
          refetch();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default Services;
