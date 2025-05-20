
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Eye, Pencil, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { Service, ServiceStatus, getStatusColor, getStatusLabel } from "@/types/service";
import { ServiceModal } from "@/components/services/ServiceModal";
import { useToast } from "@/hooks/use-toast";
import { ServiceCard } from "@/components/services/ServiceCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

const Services = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Fetch service data from Supabase
  const { data: services = [], isLoading, refetch } = useQuery({
    queryKey: ['services', userProfile?.tenant_id],
    queryFn: async () => {
      if (!userProfile?.tenant_id) return [];
      
      const { data, error } = await supabase
        .from('service_details')
        .select('*')
        .eq('tenant_id', userProfile.tenant_id);
      
      if (error) {
        console.error('Error fetching services:', error);
        toast({
          title: "Veri alma hatası",
          description: "Servis işlemleri yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
        return [];
      }
      
      // Map Supabase data to our Service type
      return data.map(item => ({
        id: item.id,
        plateNumber: item.plate_number,
        make: item.brand_name,
        model: item.model_name,
        year: item.year,
        mileage: item.mileage || 0,
        customerName: item.customer_name,
        status: item.status as ServiceStatus,
        laborCost: Number(item.labor_cost),
        partsCost: Number(item.parts_cost),
        totalCost: Number(item.total_cost),
        technician: item.technician_name,
        complaint: item.complaint || '',
        servicePerformed: item.work_done || '',
        parts: [],
        history: [],
        arrivalDate: new Date(item.arrival_date),
        deliveryDate: item.delivery_date ? new Date(item.delivery_date) : undefined
      }));
    },
    enabled: !!userProfile?.tenant_id,
  });

  const filteredServices = services.filter(service => 
    service.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getStatusLabel(service.status).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (serviceId: string) => {
    navigate(`/services/${serviceId}`);
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId);
      
      if (error) {
        throw error;
      }

      refetch();
      
      toast({
        title: "Servis işlemi silindi",
        description: "Servis işlemi başarıyla silindi.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: "Silme hatası",
        description: "Servis işlemi silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleSave = async (service: Service) => {
    try {
      if (selectedService) {
        // Update existing service
        const { error } = await supabase
          .from('services')
          .update({
            status: service.status,
            complaint: service.complaint,
            work_done: service.servicePerformed,
            mileage: service.mileage,
            labor_cost: service.laborCost,
            parts_cost: service.partsCost,
            delivery_date: service.deliveryDate ? service.deliveryDate.toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', service.id);
        
        if (error) throw error;
        
        toast({
          title: "Servis işlemi güncellendi",
          description: "Servis işlemi başarıyla güncellendi.",
          variant: "default",
        });
      } else {
        // Add new service - this would require more data like vehicle_id
        toast({
          title: "Uyarı",
          description: "Yeni servis eklemek için araç seçimi gereklidir. Lütfen önce araç seçiniz.",
          variant: "default",
        });
        // In a real implementation, we would need to collect vehicle info first
      }
      
      refetch();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error saving service:', error);
      toast({
        title: "Kaydetme hatası",
        description: error.message || "Servis işlemi kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-poppins font-bold">Servis İşlemleri</h1>
        <p className="text-muted-foreground">Tüm servis işlemlerini görüntüleyin ve yönetin</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-auto flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Servis ara..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Filtrele</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSearchQuery("")}>Tüm Servisler</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchQuery("bekliyor")}>Bekleyen Servisler</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchQuery("devam ediyor")}>Devam Eden Servisler</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchQuery("tamamlandı")}>Tamamlanan Servisler</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchQuery("teslim edildi")}>Teslim Edilen Servisler</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchQuery("iptal edildi")}>İptal Edilen Servisler</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Servis Ekle
          </Button>
        </div>
      </div>

      {filteredServices.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Servis işlemi bulunamadı.</p>
        </div>
      ) : isMobile ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onView={() => handleView(service.id)}
              onEdit={() => handleEdit(service)}
              onDelete={() => handleDelete(service.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Plaka</TableHead>
                <TableHead>Marka/Model</TableHead>
                <TableHead>Yıl</TableHead>
                <TableHead>Km</TableHead>
                <TableHead>Araç Sahibi</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Ücret</TableHead>
                <TableHead>Teknisyen</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.map((service) => (
                <TableRow key={service.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{service.plateNumber}</TableCell>
                  <TableCell>{service.make} {service.model}</TableCell>
                  <TableCell className="text-muted-foreground">{service.year}</TableCell>
                  <TableCell>{service.mileage.toLocaleString()} km</TableCell>
                  <TableCell>{service.customerName}</TableCell>
                  <TableCell>
                    <Badge 
                      className={`${getStatusColor(service.status)} hover:${getStatusColor(service.status)}`}
                    >
                      {getStatusLabel(service.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{formatCurrency(service.totalCost)}</div>
                    <div className="text-xs text-muted-foreground">
                      İşçilik: {formatCurrency(service.laborCost)}<br />
                      Parça: {formatCurrency(service.partsCost)}
                    </div>
                  </TableCell>
                  <TableCell>{service.technician || "-"}</TableCell>
                  <TableCell>
                    <div className="flex justify-end items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleView(service.id)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Görüntüle</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(service)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Düzenle</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Sil</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Servis İşlemini Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu işlem geri alınamaz. Bu servis kaydını silmek istediğinizden emin misiniz?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={() => handleDelete(service.id)}
                            >
                              Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ServiceModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        service={selectedService}
        onSave={handleSave}
      />
    </div>
  );
};

export default Services;
