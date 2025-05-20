
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Plus, RefreshCw, UserPlus } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Define validation schemas
const createTenantSchema = z.object({
  name: z.string().min(2, { message: "Tenant adı en az 2 karakter olmalıdır" }),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz" }).optional(),
});

const createUserSchema = z.object({
  firstName: z.string().min(1, { message: "Ad alanı zorunludur" }),
  lastName: z.string().min(1, { message: "Soyad alanı zorunludur" }),
  email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz" }),
  tenantId: z.string().uuid({ message: "Geçerli bir tenant seçiniz" }),
  role: z.enum(['admin', 'technician', 'consultant', 'accounting']),
  tempPassword: z.string().min(6, { message: "Şifre en az 6 karakter olmalıdır" }),
});

type CreateTenantFormValues = z.infer<typeof createTenantSchema>;
type CreateUserFormValues = z.infer<typeof createUserSchema>;

const AdminPanel: React.FC = () => {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const [isCreatingTenant, setIsCreatingTenant] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Tenant oluşturma form
  const tenantForm = useForm<CreateTenantFormValues>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
    },
  });

  // Kullanıcı oluşturma form
  const userForm = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      tenantId: "",
      role: "admin",
      tempPassword: "",
    },
  });

  // Tenant listesi çekme
  const { data: tenants = [], isLoading: isLoadingTenants, refetch: refetchTenants } = useQuery({
    queryKey: ['tenants'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tenants')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Tenant listesi yüklenirken hata oluştu: " + error.message,
        });
        return [];
      }

      return data;
    },
  });

  // Kullanıcı listesi çekme
  const { data: users = [], isLoading: isLoadingUsers, refetch: refetchUsers } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*, tenants(name)')
        .order('email', { ascending: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Kullanıcı listesi yüklenirken hata oluştu: " + error.message,
        });
        return [];
      }

      return data;
    },
  });

  // Tenant oluşturma
  const onCreateTenant = async (values: CreateTenantFormValues) => {
    setIsCreatingTenant(true);
    try {
      const { data, error } = await supabase
        .from('tenants')
        .insert([values])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Başarılı",
        description: `${data.name} tenant'ı başarıyla oluşturuldu.`,
      });

      tenantForm.reset();
      refetchTenants();
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Tenant oluşturulurken hata: " + error.message,
      });
    } finally {
      setIsCreatingTenant(false);
    }
  };

  // Kullanıcı oluşturma
  const onCreateUser = async (values: CreateUserFormValues) => {
    setIsCreatingUser(true);
    try {
      // Önce Supabase Auth üzerinden kullanıcı oluştur
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: values.email,
        password: values.tempPassword,
        email_confirm: true, // E-posta doğrulamasını atla
        user_metadata: {
          tenant_id: values.tenantId,
          first_name: values.firstName,
          last_name: values.lastName,
          must_change_password: true, // İlk girişte şifre değiştirme zorunluluğu
        },
      });

      if (authError) {
        throw authError;
      }

      // Supabase users tablosuna eklenecek (handle_new_user trigger ile otomatik olarak eklenir)
      // Ancak role bilgisini güncellememiz gerekiyor
      const { error: updateError } = await supabase
        .from('users')
        .update({ role: values.role })
        .eq('id', authData.user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Başarılı",
        description: `${values.email} kullanıcısı başarıyla oluşturuldu.`,
      });

      userForm.reset();
      refetchUsers();
      
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Kullanıcı oluşturulurken hata: " + error.message,
      });
    } finally {
      setIsCreatingUser(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      case 'technician':
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      case 'consultant':
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case 'accounting':
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80";
      default:
        return "";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return "Yönetici";
      case 'technician':
        return "Teknisyen";
      case 'consultant':
        return "Danışman";
      case 'accounting':
        return "Muhasebe";
      default:
        return role;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Sistem Yönetimi</h1>
        <p className="text-muted-foreground">
          Tenant ve kullanıcı yönetimini bu panel üzerinden gerçekleştirebilirsiniz.
        </p>
      </div>

      <Tabs defaultValue="tenants" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tenants">Tenant Yönetimi</TabsTrigger>
          <TabsTrigger value="users">Kullanıcı Yönetimi</TabsTrigger>
        </TabsList>

        {/* Tenant Yönetimi */}
        <TabsContent value="tenants" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tenant Listesi</CardTitle>
                <CardDescription>Sistemde kayıtlı tüm tenant'lar</CardDescription>
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => refetchTenants()} 
                    disabled={isLoadingTenants}
                  >
                    {isLoadingTenants ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingTenants ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : tenants.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Henüz tenant kaydı bulunmamaktadır.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tenant Adı</TableHead>
                        <TableHead>E-posta</TableHead>
                        <TableHead>Telefon</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tenants.map((tenant) => (
                        <TableRow key={tenant.id}>
                          <TableCell className="font-medium">{tenant.name}</TableCell>
                          <TableCell>{tenant.email || "-"}</TableCell>
                          <TableCell>{tenant.phone || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yeni Tenant Oluştur</CardTitle>
                <CardDescription>
                  Sisteme yeni bir tenant eklemek için formu doldurun
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...tenantForm}>
                  <form onSubmit={tenantForm.handleSubmit(onCreateTenant)} className="space-y-4">
                    <FormField
                      control={tenantForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tenant Adı*</FormLabel>
                          <FormControl>
                            <Input placeholder="Örn: ABC Otomotiv" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={tenantForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adres</FormLabel>
                          <FormControl>
                            <Input placeholder="Örn: İstanbul, Türkiye" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={tenantForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefon</FormLabel>
                            <FormControl>
                              <Input placeholder="Örn: +90 555 123 4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={tenantForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-posta</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                placeholder="Örn: info@example.com" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isCreatingTenant}
                      >
                        {isCreatingTenant ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Oluşturuluyor...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Tenant Oluştur
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Kullanıcı Yönetimi */}
        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Kullanıcı Listesi</CardTitle>
                <CardDescription>Sistemde kayıtlı tüm kullanıcılar</CardDescription>
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => refetchUsers()} 
                    disabled={isLoadingUsers}
                  >
                    {isLoadingUsers ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Henüz kullanıcı kaydı bulunmamaktadır.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>E-posta</TableHead>
                        <TableHead>Ad Soyad</TableHead>
                        <TableHead>Rol</TableHead>
                        <TableHead>Tenant</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.email}</TableCell>
                          <TableCell>{user.first_name} {user.last_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                              {getRoleLabel(user.role)}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.tenants?.name || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yeni Kullanıcı Oluştur</CardTitle>
                <CardDescription>
                  Tenant için yeni bir kullanıcı eklemek için formu doldurun
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...userForm}>
                  <form onSubmit={userForm.handleSubmit(onCreateUser)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={userForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ad*</FormLabel>
                            <FormControl>
                              <Input placeholder="Örn: Ahmet" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={userForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Soyad*</FormLabel>
                            <FormControl>
                              <Input placeholder="Örn: Yılmaz" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={userForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-posta*</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="Örn: ahmet@example.com" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={userForm.control}
                      name="tenantId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tenant*</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                              {...field}
                            >
                              <option value="">Tenant Seçiniz</option>
                              {tenants.map((tenant) => (
                                <option key={tenant.id} value={tenant.id}>
                                  {tenant.name}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={userForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rol*</FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                              {...field}
                            >
                              <option value="admin">Yönetici</option>
                              <option value="technician">Teknisyen</option>
                              <option value="consultant">Danışman</option>
                              <option value="accounting">Muhasebe</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={userForm.control}
                      name="tempPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Geçici Şifre*</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="Geçici şifre" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Kullanıcı ilk girişinde bu şifreyi değiştirmek zorunda kalacak.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isCreatingUser}
                      >
                        {isCreatingUser ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Oluşturuluyor...
                          </>
                        ) : (
                          <>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Kullanıcı Oluştur
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
