
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, CalendarDays, Car, Clock, CreditCard, Printer, Tag, User, Wrench, X as CloseIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Service, ServicePart, ServiceDB, mapServiceFromDB, getStatusColor, getStatusLabel } from "@/types/service";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { ServiceModal } from "@/components/services/ServiceModal";
import { useToast } from "@/hooks/use-toast";

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Fetch service details from Supabase
  const { data: service, isLoading, isError } = useQuery({
    queryKey: ['service', id, userProfile?.tenant_id],
    queryFn: async () => {
      if (!id || !userProfile?.tenant_id) throw new Error('Missing required parameters');
      
      console.log('Fetching service with ID:', id);
      
      // Get the service details
      const { data: serviceData, error: serviceError } = await supabase
        .from('service_details')
        .select('*')
        .eq('id', id)
        .eq('tenant_id', userProfile.tenant_id)
        .single();
        
      if (serviceError) {
        console.error('Error fetching service details:', serviceError);
        throw serviceError;
      }
      
      if (!serviceData) {
        throw new Error('Service not found');
      }
      
      console.log('Service data:', serviceData);
      
      // Get service parts
      const { data: partsData, error: partsError } = await supabase
        .from('service_parts')
        .select('*')
        .eq('service_id', id)
        .eq('tenant_id', userProfile.tenant_id);
        
      if (partsError) {
        console.error('Error fetching service parts:', partsError);
      }
      
      const parts: ServicePart[] = (partsData || []).map(part => ({
        id: part.id,
        name: part.part_name,
        code: part.part_code,
        quantity: part.quantity,
        unitPrice: Number(part.unit_price)
      }));
      
      console.log('Service parts:', parts);
      
      // Map the data to our Service type
      return mapServiceFromDB(serviceData as ServiceDB, parts);
    },
    enabled: !!id && !!userProfile?.tenant_id,
  });
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-4 text-muted-foreground">Servis bilgileri yükleniyor...</p>
      </div>
    );
  }
  
  if (isError || !service) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <h2 className="text-2xl font-poppins font-semibold mb-2">Servis Bulunamadı</h2>
        <p className="text-muted-foreground mb-4">Aradığınız servis kaydı bulunamadı veya erişim izniniz yok.</p>
        <Button onClick={() => navigate("/services")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Servis Listesine Dön
        </Button>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };
  
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Belirtilmemiş";
    return format(date, "d MMMM yyyy, HH:mm", { locale: tr });
  };

  const handlePrint = () => {
    toast({
      title: "Yazdırma",
      description: "Yazdırma özelliği henüz uygulanmadı.",
      variant: "default",
    });
  };

  const handleCancel = async () => {
    if (!id || !userProfile?.tenant_id) return;
    
    try {
      const { error } = await supabase
        .from('services')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .eq('tenant_id', userProfile.tenant_id);
        
      if (error) throw error;
      
      toast({
        title: "İptal İşlemi",
        description: "Servis işlemi başarıyla iptal edildi.",
        variant: "default",
      });
      
      // Reload the page to show the updated status
      window.location.reload();
    } catch (error) {
      console.error('Error cancelling service:', error);
      
      toast({
        title: "İptal Hatası",
        description: "İptal işlemi sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };
  
  const handleSave = async (updatedService: Service) => {
    if (!id || !userProfile?.tenant_id) return;
    
    try {
      // Update the service
      const { error } = await supabase
        .from('services')
        .update({
          status: updatedService.status,
          labor_cost: updatedService.laborCost,
          parts_cost: updatedService.partsCost,
          complaint: updatedService.complaint,
          work_done: updatedService.servicePerformed,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('tenant_id', userProfile.tenant_id);
        
      if (error) throw error;
      
      toast({
        title: "Servis güncellendi",
        description: "Servis bilgileri başarıyla güncellendi.",
        variant: "default",
      });
      
      // Close modal and reload page
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating service:', error);
      
      toast({
        title: "Güncelleme Hatası",
        description: "Servis güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/services")}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Geri</span>
          </Button>
          <div>
            <h1 className="text-2xl font-poppins font-bold">Servis Detayı</h1>
            <p className="text-muted-foreground">{service.plateNumber} plaka numaralı araç için servis bilgileri</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Yazdır
          </Button>
          <Button variant="outline" onClick={() => setIsModalOpen(true)}>
            <Wrench className="mr-2 h-4 w-4" />
            Düzenle
          </Button>
          {service.status !== "cancelled" && (
            <Button variant="outline" className="text-destructive hover:bg-destructive/10" onClick={handleCancel}>
              <CloseIcon className="mr-2 h-4 w-4" />
              İptal Et
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Car className="h-5 w-5 text-muted-foreground" />
              Araç Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Plaka</dt>
                <dd className="mt-1 text-base">{service.plateNumber}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Marka/Model</dt>
                <dd className="mt-1 text-base">{service.make} {service.model}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Yıl</dt>
                <dd className="mt-1 text-base">{service.year}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Kilometre</dt>
                <dd className="mt-1 text-base">{service.mileage.toLocaleString()} km</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-sm font-medium text-muted-foreground">Araç Sahibi</dt>
                <dd className="mt-1 text-base">{service.customerName}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Tag className="h-5 w-5 text-muted-foreground" />
              Servis Durumu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Durum</dt>
                <dd className="mt-1">
                  <Badge 
                    className={`${getStatusColor(service.status)} hover:${getStatusColor(service.status)}`}
                  >
                    {getStatusLabel(service.status)}
                  </Badge>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Teknisyen</dt>
                <dd className="mt-1 text-base">{service.technician}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Geliş Tarihi</dt>
                <dd className="mt-1 text-base">{formatDate(service.arrivalDate)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-muted-foreground">Teslim Tarihi</dt>
                <dd className="mt-1 text-base">{formatDate(service.deliveryDate)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              Ücret Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">İşçilik Ücreti</dt>
                <dd className="text-base">{formatCurrency(service.laborCost)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Parça Ücreti</dt>
                <dd className="text-base">{formatCurrency(service.partsCost)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-muted-foreground">KDV (%18)</dt>
                <dd className="text-base">{formatCurrency(service.totalCost * 0.18)}</dd>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <dt className="text-sm">Toplam Ücret</dt>
                <dd className="text-lg">{formatCurrency(service.totalCost * 1.18)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <div className="grid gap-6 grid-rows-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                Şikayet/Talep
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{service.complaint || "Belirtilmemiş"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="h-5 w-5 text-muted-foreground" />
                Yapılan İşlem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{service.servicePerformed || "Belirtilmemiş"}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Wrench className="h-5 w-5 text-muted-foreground" />
            Kullanılan Parçalar
          </CardTitle>
        </CardHeader>
        <CardContent>
          {service.parts && service.parts.length > 0 ? (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Parça Adı</TableHead>
                  <TableHead>Parça Kodu</TableHead>
                  <TableHead className="text-right">Adet</TableHead>
                  <TableHead className="text-right">Birim Fiyat</TableHead>
                  <TableHead className="text-right">Toplam</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {service.parts.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell>{part.name}</TableCell>
                    <TableCell>{part.code || "-"}</TableCell>
                    <TableCell className="text-right">{part.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(part.unitPrice)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(part.quantity * part.unitPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-4">Kayıtlı parça bulunmuyor.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            İşlem Geçmişi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {service.history.map((historyItem) => (
              <div key={historyItem.id} className="flex">
                <div className="mr-4 flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div className="h-full w-px bg-border" />
                </div>
                <div className="space-y-1 pt-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{historyItem.action}</p>
                    <span className="text-xs text-muted-foreground">
                      {format(historyItem.date, "d MMMM yyyy, HH:mm", { locale: tr })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{historyItem.user}</span> {historyItem.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <ServiceModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        service={service}
        onSave={handleSave}
      />
    </div>
  );
};

export default ServiceDetail;
