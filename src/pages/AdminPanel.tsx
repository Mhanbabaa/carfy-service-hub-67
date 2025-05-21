
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Loader2, RefreshCw, UserPlus } from 'lucide-react';

const AdminPanel = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [loadingTenants, setLoadingTenants] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Tenant oluşturma ve kullanıcı ekleme formu
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Tenant ve kullanıcı bilgilerini hazırla
      const tenantData = {
        name: data.companyName,
        phone: data.phone,
        email: data.email,
      };

      // Supabase fonksiyonunu çağırarak tenant ve kullanıcı oluştur
      const { data: result, error } = await supabase.rpc('create_tenant_with_user', {
        tenant_name: data.companyName,
        user_email: data.email,
        user_password: data.password,
        user_first_name: data.firstName,
        user_last_name: data.lastName,
        user_phone: data.phone,
        user_role: 'admin'
      });

      if (error) {
        throw new Error(`Tenant oluşturma hatası: ${error.message}`);
      }

      toast({
        title: 'Başarılı!',
        description: `${data.companyName} firması ve yönetici kullanıcısı oluşturuldu.`,
      });

      // Formu sıfırla ve tenant listesini güncelle
      reset();
      fetchTenants();
    } catch (error) {
      console.error('Tenant oluşturma hatası:', error);
      toast({
        variant: 'destructive',
        title: 'Hata!',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Tenant listesini getir
  const fetchTenants = async () => {
    setLoadingTenants(true);
    try {
      const { data, error } = await supabase
        .from('tenants')
        .select(`
          id,
          name,
          email,
          phone,
          address,
          created_at,
          users (id, first_name, last_name, email, role)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setTenants(data || []);
    } catch (error) {
      console.error('Tenant listesi alınamadı:', error);
      toast({
        variant: 'destructive',
        title: 'Hata!',
        description: 'Tenant listesi alınamadı.',
      });
    } finally {
      setLoadingTenants(false);
    }
  };

  // Component yüklendiğinde tenant listesini getir
  useEffect(() => {
    fetchTenants();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Sistem Yönetimi</h1>

      <Tabs defaultValue="new-tenant" className="space-y-4">
        <TabsList>
          <TabsTrigger value="new-tenant">Yeni Firma Ekle</TabsTrigger>
          <TabsTrigger value="tenants">Firmalar</TabsTrigger>
        </TabsList>

        <TabsContent value="new-tenant">
          <Card>
            <CardHeader>
              <CardTitle>Yeni Firma ve Yönetici Kullanıcı Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Firma Adı</Label>
                  <Input
                    id="companyName"
                    {...register('companyName', { required: 'Firma adı zorunludur' })}
                  />
                  {errors.companyName && <p className="text-sm text-red-500">{errors.companyName.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Yönetici Adı</Label>
                    <Input
                      id="firstName"
                      {...register('firstName', { required: 'Yönetici adı zorunludur' })}
                    />
                    {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Yönetici Soyadı</Label>
                    <Input
                      id="lastName"
                      {...register('lastName', { required: 'Yönetici soyadı zorunludur' })}
                    />
                    {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email', { required: 'E-posta zorunludur' })}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Şifre</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password', { required: 'Şifre zorunludur', minLength: { value: 8, message: 'Şifre en az 8 karakter olmalıdır' } })}
                  />
                  {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Ekleniyor...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Firma ve Yönetici Ekle
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenants">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Firmalar</CardTitle>
              <Button variant="outline" size="sm" onClick={fetchTenants} disabled={loadingTenants}>
                {loadingTenants ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              {loadingTenants ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : tenants.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">Henüz firma bulunmuyor.</p>
              ) : (
                <div className="divide-y divide-border">
                  {tenants.map((tenant) => (
                    <div key={tenant.id} className="py-4">
                      <h3 className="font-semibold text-lg">{tenant.name}</h3>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">E-posta:</span> {tenant.email || '-'}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Telefon:</span> {tenant.phone || '-'}
                        </div>
                      </div>
                      <div className="mt-2">
                        <h4 className="font-medium text-sm">Kullanıcılar</h4>
                        {tenant.users && tenant.users.length > 0 ? (
                          <div className="mt-1 space-y-1">
                            {tenant.users.map((user) => (
                              <div key={user.id} className="text-sm">
                                {user.first_name} {user.last_name} ({user.email}) - {user.role}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Kullanıcı bulunmuyor</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
