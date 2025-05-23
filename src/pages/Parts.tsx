
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
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
import { Plus, Search, SlidersHorizontal, Pencil, Trash2, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { PartsModal } from "@/components/parts/PartsModal";
import { PartsCard } from "@/components/parts/PartsCard";
import type { Part } from "@/types/part";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from 'uuid';

// Using any to avoid deep type instantiation issues with Supabase
type DbResult = any;

const Parts = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [parts, setParts] = useState<Part[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch parts from service_parts table directly
  const fetchParts = async () => {
    if (!userProfile?.tenant_id) return;
    
    setIsLoading(true);
    try {
      console.log('[PARTS] Parçalar getiriliyor, tenant ID:', userProfile.tenant_id);
      
      // 1. Tüm parçaları service_parts tablosundan direkt olarak getir
      const { data: serviceParts, error: partsError } = await supabase
        .from('service_parts')
        .select('*')
        .eq('tenant_id', userProfile.tenant_id);
      
      if (partsError) {
        console.error('[PARTS] Parça verileri alınamadı:', partsError);
        toast({
          title: "Veri alma hatası",
          description: "Parçalar yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      console.log(`[PARTS] ${serviceParts?.length || 0} parça alındı:`, serviceParts);
      
      if (!serviceParts || serviceParts.length === 0) {
        console.log('[PARTS] Hiç parça bulunamadı');
        setParts([]);
        setIsLoading(false);
        return;
      }
      
      // 2. Tüm servisleri bir kerede getir
      const { data: services, error: servicesError } = await supabase
        .from('services')
        .select('*')
        .eq('tenant_id', userProfile.tenant_id);
        
      if (servicesError) {
        console.error('[PARTS] Servis verileri alınamadı:', servicesError);
      }
      
      console.log(`[PARTS] ${services?.length || 0} servis alındı`);
      
      // 3. Tüm araçları bir kerede getir
      const { data: vehicles, error: vehiclesError } = await supabase
        .from('vehicle_details')
        .select('*')
        .eq('tenant_id', userProfile.tenant_id);
        
      if (vehiclesError) {
        console.error('[PARTS] Araç verileri alınamadı:', vehiclesError);
      }
      
      console.log(`[PARTS] ${vehicles?.length || 0} araç alındı`);
      
      // 4. Servis-Araç eşleştirme haritası oluştur
      const serviceVehicleMap = new Map<string, {
        plate_number: string;
        vehicle_name: string;
        status: string | null;
      }>();
      
      if (services && vehicles) {
        services.forEach((service: DbResult) => {
          const vehicle = vehicles.find((v: DbResult) => v.id === service.vehicle_id);
          if (vehicle) {
            serviceVehicleMap.set(service.id, {
              plate_number: vehicle.plate_number || 'Bilinmiyor',
              vehicle_name: `${vehicle.brand_name || ''} ${vehicle.model_name || ''}`.trim() || 'Bilinmiyor',
              status: service.status
            });
          }
        });
      }
      
      console.log('[PARTS] Servis-Araç eşleştirme haritası oluşturuldu');
      
      // 5. Parçaları formatla
      const formattedParts = serviceParts.map((part: DbResult) => {
        const serviceInfo = serviceVehicleMap.get(part.service_id) || {
          plate_number: 'Bilinmiyor',
          vehicle_name: 'Bilinmiyor',
          status: null
        };
        
        return {
          id: part.id,
          name: part.part_name,
          code: part.part_code || '',
          quantity: part.quantity,
          unitPrice: Number(part.unit_price),
          serviceId: part.service_id,
          serviceReference: `${serviceInfo.plate_number} - ${serviceInfo.vehicle_name}`,
          servicePlateNumber: serviceInfo.plate_number,
          serviceVehicleName: serviceInfo.vehicle_name,
          serviceStatus: serviceInfo.status
        };
      });
      
      console.log('[PARTS] Parçalar formatlandı:', formattedParts);
      setParts(formattedParts);
    } catch (e) {
      console.error('[PARTS] fetchParts fonksiyonunda hata:', e);
      toast({
        title: "Beklenmeyen hata",
        description: "Parçalar yüklenirken beklenmeyen bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Component mount olduğunda ve userProfile değiştiğinde parçaları çek
  useEffect(() => {
    fetchParts();
  }, [userProfile?.tenant_id]);

  // Add an extra effect to refresh the parts list when the page is visited
  useEffect(() => {
    // Using the Page Visibility API to detect when the page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchParts();
      }
    };

    // Attach event listener for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Refresh on component mount too
    fetchParts();

    // Cleanup the event listener
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const filteredParts = parts.filter(part => 
    part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (part.code && part.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
    part.serviceReference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  const handleEdit = (part: Part) => {
    setSelectedPart(part);
    setIsModalOpen(true);
  };

  const handleDelete = async (partId: string) => {
    try {
      // Step 1: First check if any audit records exist for this part
      const { data: auditRecords, error: checkError } = await supabase
        .from('service_parts_audit')
        .select('id')
        .eq('service_part_id', partId);
      
      if (checkError) {
        console.error("Error checking audit records:", checkError);
      } else if (auditRecords && auditRecords.length > 0) {
        // Step 2: If audit records exist, delete them first
        const { error: auditError } = await supabase
          .from('service_parts_audit')
          .delete()
          .eq('service_part_id', partId);
        
        if (auditError) {
          console.error("Error deleting audit records:", auditError);
          throw new Error(`Denetim kayıtları silinirken hata oluştu: ${auditError.message}`);
        }
      }
      
      // Step 3: Now delete the part itself
      const { error } = await supabase
        .from('service_parts')
        .delete()
        .eq('id', partId)
        .eq('tenant_id', userProfile?.tenant_id as string);
      
      if (error) {
        throw error;
      }
      
      // Remove the part from the local state
      setParts(parts.filter(part => part.id !== partId));
      
      toast({
        title: "Parça silindi",
        description: "Parça başarıyla silindi.",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Error deleting part:", error);
      toast({
        title: "Hata",
        description: error.message || "Parça silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    setSelectedPart(null);
    setIsModalOpen(true);
  };

  const handleSave = async (part: Part) => {
    try {
      if (selectedPart) {
        // Update existing part
        const { error } = await supabase
          .from('service_parts')
          .update({
            part_name: part.name,
            part_code: part.code,
            quantity: part.quantity,
            unit_price: part.unitPrice,
            service_id: part.serviceId,
            updated_at: new Date().toISOString()
          })
          .eq('id', part.id)
          .eq('tenant_id', userProfile?.tenant_id as string);
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Parça güncellendi",
          description: "Parça bilgileri başarıyla güncellendi.",
          variant: "default",
        });
      } else {
        // Add new part
        const { error } = await supabase
          .from('service_parts')
          .insert({
            id: uuidv4(),
            part_name: part.name,
            part_code: part.code,
            quantity: part.quantity,
            unit_price: part.unitPrice,
            service_id: part.serviceId,
            tenant_id: userProfile?.tenant_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Parça eklendi",
          description: "Yeni parça başarıyla eklendi.",
          variant: "default",
        });
      }
      
      // Parçaları tekrar yükle
      fetchParts();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error saving part:", error);
      toast({
        title: "Hata",
        description: error.message || "Parça kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-poppins font-bold">Servis Parçaları</h1>
        <p className="text-muted-foreground">Servis işlemlerinde kullanılan tüm parçaları görüntüleyin ve yönetin</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-auto flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Parça ara..."
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
              <DropdownMenuItem onClick={() => setSearchQuery("")}>Tüm Parçalar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setParts([...parts].sort((a, b) => a.unitPrice - b.unitPrice));
              }}>Fiyata Göre (Artan)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setParts([...parts].sort((a, b) => b.unitPrice - a.unitPrice));
              }}>Fiyata Göre (Azalan)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Parça Ekle
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : isMobile ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredParts.length > 0 ? (
            filteredParts.map((part) => (
              <PartsCard
                key={part.id}
                part={part}
                onEdit={() => handleEdit(part)}
                onDelete={() => handleDelete(part.id)}
                formatCurrency={formatCurrency}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center border rounded-lg">
              <p className="mb-4 text-muted-foreground">Parça bulunamadı.</p>
              <Button onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" />
                Parça Ekle
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Parça Adı</TableHead>
                <TableHead>Parça Kodu</TableHead>
                <TableHead>Adet</TableHead>
                <TableHead>Birim Fiyat</TableHead>
                <TableHead>Toplam Fiyat</TableHead>
                <TableHead>Servis</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParts.length > 0 ? (
                filteredParts.map((part) => (
                  <TableRow key={part.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{part.name}</TableCell>
                    <TableCell className="text-muted-foreground">{part.code || "-"}</TableCell>
                    <TableCell>{part.quantity}</TableCell>
                    <TableCell>{formatCurrency(part.unitPrice)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(part.quantity * part.unitPrice)}</TableCell>
                    <TableCell>
                      <a href={`/services/${part.serviceId}`} className="text-blue-500 hover:underline flex items-center">
                        <Link className="h-4 w-4 mr-1" />
                        {part.serviceReference}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(part)}
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
                              <AlertDialogTitle>Parçayı Sil</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bu işlem geri alınamaz. "{part.name}" parçasını silmek istediğinizden emin misiniz?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>İptal</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => handleDelete(part.id)}
                              >
                                Sil
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Parça bulunamadı.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <PartsModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        part={selectedPart}
        onSave={handleSave}
      />
    </div>
  );
};

export default Parts;
