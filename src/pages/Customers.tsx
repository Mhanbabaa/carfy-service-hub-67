
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Users, Phone, Mail, Car, Calendar } from 'lucide-react';
import { useSupabaseQuery } from '@/hooks/use-supabase-query';
import { CustomerModal } from '@/components/customers/CustomerModal';
import { LoadingOverlay } from '@/components/loading-overlay';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const { data: customers, isLoading, refetch } = useSupabaseQuery('customers', {
    select: '*',
    orderBy: 'created_at',
    orderDirection: 'desc'
  });

  // Get vehicle counts for each customer
  const { data: vehicles } = useSupabaseQuery('vehicles', {
    select: 'customer_id'
  });

  const filteredCustomers = customers?.filter(customer =>
    customer.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getVehicleCount = (customerId: string) => {
    return vehicles?.filter(vehicle => vehicle.customer_id === customerId).length || 0;
  };

  const handleAddCustomer = () => {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  };

  const handleEditCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <LoadingOverlay message="Müşteriler yükleniyor..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-4 sm:space-y-6">
        {/* Header - Mobile responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Müşteriler
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Müşteri bilgilerini görüntüleyin ve yönetin
            </p>
          </div>
          <Button 
            onClick={handleAddCustomer} 
            className="w-full sm:w-auto"
            size="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Müşteri
          </Button>
        </div>

        {/* Search - Mobile responsive */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Ad, soyad, telefon veya e-posta ara..."
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
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{customers?.length || 0}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Toplam Müşteri</p>
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
                    {customers?.filter(c => 
                      new Date(c.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    ).length || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Bu Ay Yeni</p>
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
                  <p className="text-xl sm:text-2xl font-bold">{vehicles?.length || 0}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Toplam Araç</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold">
                    {customers?.filter(c => c.email).length || 0}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">E-posta Var</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers Grid - Mobile responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg sm:text-xl font-bold">
                      {customer.first_name} {customer.last_name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Kayıt: {new Date(customer.created_at).toLocaleDateString('tr-TR')}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {getVehicleCount(customer.id)} Araç
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 sm:space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-1 bg-green-100 dark:bg-green-900/20 rounded">
                      <Phone className="h-3 w-3 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-medium">{customer.phone}</span>
                  </div>
                  
                  {customer.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="p-1 bg-blue-100 dark:bg-blue-900/20 rounded ml-1">
                        <Mail className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="truncate">{customer.email}</span>
                    </div>
                  )}
                </div>

                {/* Address */}
                {customer.address && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">Adres</p>
                    <p className="text-sm font-medium line-clamp-2">{customer.address}</p>
                  </div>
                )}

                {/* Vehicle Info */}
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Araç Sayısı</p>
                      <p className="text-sm font-medium">{getVehicleCount(customer.id)}</p>
                    </div>
                    {getVehicleCount(customer.id) > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <Car className="h-3 w-3 mr-1" />
                        Aktif Müşteri
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditCustomer(customer)}
                    className="w-full"
                  >
                    Detayları Görüntüle
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <Card>
            <CardContent className="p-8 sm:p-12 text-center">
              <Users className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Müşteri bulunamadı</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                {searchTerm ? 'Arama kriterlerinize uygun müşteri bulunamadı.' : 'Henüz kayıtlı müşteri bulunmuyor.'}
              </p>
              <Button onClick={handleAddCustomer} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                İlk Müşteriyi Ekle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
        onSave={() => {
          refetch();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default Customers;
