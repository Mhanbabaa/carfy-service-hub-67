
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { mockServices } from "@/data/services";
import { Service, getStatusColor, getStatusLabel } from "@/types/service";
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
  const [services, setServices] = useState<Service[]>(mockServices);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

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

  const handleDelete = (serviceId: string) => {
    setServices(services.filter(service => service.id !== serviceId));
    toast({
      title: "Servis işlemi silindi",
      description: "Servis işlemi başarıyla silindi.",
      variant: "default",
    });
  };

  const handleAddNew = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleSave = (service: Service) => {
    if (selectedService) {
      // Update existing service
      setServices(services.map(s => s.id === service.id ? service : s));
      toast({
        title: "Servis işlemi güncellendi",
        description: "Servis işlemi başarıyla güncellendi.",
        variant: "default",
      });
    } else {
      // Add new service
      setServices([...services, service]);
      toast({
        title: "Servis işlemi eklendi",
        description: "Yeni servis işlemi başarıyla eklendi.",
        variant: "default",
      });
    }
    setIsModalOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

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
              <DropdownMenuItem>Tüm Servisler</DropdownMenuItem>
              <DropdownMenuItem>Bekleyen Servisler</DropdownMenuItem>
              <DropdownMenuItem>Devam Eden Servisler</DropdownMenuItem>
              <DropdownMenuItem>Tamamlanan Servisler</DropdownMenuItem>
              <DropdownMenuItem>Teslim Edilen Servisler</DropdownMenuItem>
              <DropdownMenuItem>İptal Edilen Servisler</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Servis Ekle
          </Button>
        </div>
      </div>

      {isMobile ? (
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
                  <TableCell>{service.technician}</TableCell>
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

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Toplam {filteredServices.length} servis işlemi
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled>
            Önceki
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            Sonraki
          </Button>
        </div>
      </div>

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
