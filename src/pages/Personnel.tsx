
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Users, UserCheck, Mail, Phone, Shield, Clock } from 'lucide-react';
import { useSupabaseQuery } from '@/hooks/use-supabase-query';
import { PersonnelModal } from '@/components/personnel/PersonnelModal';
import { LoadingOverlay } from '@/components/loading-overlay';

const Personnel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);

  const { data: personnel, isLoading, refetch } = useSupabaseQuery('users', {
    select: '*',
    orderBy: 'created_at',
    orderDirection: 'desc'
  });

  const filteredPersonnel = personnel?.filter(person =>
    person.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.phone?.includes(searchTerm) ||
    person.role?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleAddPersonnel = () => {
    setSelectedPersonnel(null);
    setIsModalOpen(true);
  };

  const handleEditPersonnel = (person: any) => {
    setSelectedPersonnel(person);
    setIsModalOpen(true);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'technician':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'consultant':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'accounting':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'superadmin':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Yönetici';
      case 'technician':
        return 'Teknisyen';
      case 'consultant':
        return 'Danışman';
      case 'accounting':
        return 'Muhasebe';
      case 'superadmin':
        return 'Süper Admin';
      default:
        return 'Kullanıcı';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'inactive':
        return 'Pasif';
      default:
        return 'Bilinmiyor';
    }
  };

  const getRoleCount = (role: string) => {
    return personnel?.filter(person => person.role === role).length || 0;
  };

  const getActiveCount = () => {
    return personnel?.filter(person => person.status === 'active').length || 0;
  };

  if (isLoading) {
    return <LoadingOverlay message="Personel bilgileri yükleniyor..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-4 sm:space-y-6">
        {/* Header - Mobile responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Personel Yönetimi
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Personel bilgilerini görüntüleyin ve yönetin
            </p>
          </div>
          <Button 
            onClick={handleAddPersonnel} 
            className="w-full sm:w-auto"
            size="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Personel
          </Button>
        </div>

        {/* Search - Mobile responsive */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Ad, soyad, e-posta, telefon veya rol ara..."
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
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold">{personnel?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Toplam</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/20 rounded">
                  <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold">{getActiveCount()}</p>
                  <p className="text-xs text-muted-foreground">Aktif</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/20 rounded">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold">{getRoleCount('technician')}</p>
                  <p className="text-xs text-muted-foreground">Teknisyen</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 dark:bg-green-900/20 rounded">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold">{getRoleCount('consultant')}</p>
                  <p className="text-xs text-muted-foreground">Danışman</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-red-100 dark:bg-red-900/20 rounded">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-lg sm:text-xl font-bold">{getRoleCount('admin')}</p>
                  <p className="text-xs text-muted-foreground">Yönetici</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personnel Grid - Mobile responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredPersonnel.map((person) => (
            <Card key={person.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg sm:text-xl font-bold">
                      {person.first_name} {person.last_name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {person.email}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge className={`text-xs ${getRoleColor(person.role)}`}>
                      {getRoleText(person.role)}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(person.status)}`}>
                      {getStatusText(person.status)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3 sm:space-y-4">
                {/* Contact Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-1 bg-blue-100 dark:bg-blue-900/20 rounded">
                      <Mail className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-medium truncate">{person.email}</span>
                  </div>
                  
                  {person.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="p-1 bg-green-100 dark:bg-green-900/20 rounded">
                        <Phone className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                      <span>{person.phone}</span>
                    </div>
                  )}
                </div>

                {/* Employment Details */}
                <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                  <div>
                    <p className="text-xs text-muted-foreground">Katılım Tarihi</p>
                    <p className="text-sm font-medium">
                      {new Date(person.created_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Son Güncelleme</p>
                    <p className="text-sm font-medium">
                      {new Date(person.updated_at).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditPersonnel(person)}
                    className="w-full"
                  >
                    Detayları Görüntüle
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPersonnel.length === 0 && (
          <Card>
            <CardContent className="p-8 sm:p-12 text-center">
              <Users className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Personel bulunamadı</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4">
                {searchTerm ? 'Arama kriterlerinize uygun personel bulunamadı.' : 'Henüz kayıtlı personel bulunmuyor.'}
              </p>
              <Button onClick={handleAddPersonnel} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                İlk Personeli Ekle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <PersonnelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        personnel={selectedPersonnel}
        onSave={() => {
          refetch();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default Personnel;
