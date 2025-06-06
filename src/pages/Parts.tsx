import { useState } from "react";
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Eye, Pencil, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { Part } from "@/types/part";
import { PartsModal } from "@/components/parts/PartsModal";
import { PartsCard } from "@/components/parts/PartsCard";
import { useToast } from "@/hooks/use-toast";
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

const Parts = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  // Fetch parts data from service_parts_view
  const { data: parts = [], isLoading, refetch } = useQuery({
    queryKey: ['parts', userProfile?.tenant_id],
    queryFn: async () => {
      if (!userProfile?.tenant_id) return [];
      
      console.log('Fetching parts for tenant:', userProfile.tenant_id);
      
      const { data, error } = await supabase
        .from('service_parts_view')
        .select('*')
        .eq('tenant_id', userProfile.tenant_id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching parts:', error);
        toast({
          title: "Veri alma hatası",
          description: "Parçalar yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
        return [];
      }
      
      console.log('Parts data:', data);
      
      // Map service_parts_view data to Part type
      return data.map(item => ({
        id: item.id,
        name: item.part_name,
        code: item.part_code,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        serviceId: item.service_id,
        serviceReference: item.service_reference || `${item.plate_number || 'Bilinmiyor'} - ${item.vehicle_name || 'Bilinmiyor'}`,
        servicePlateNumber: item.plate_number,
        serviceVehicleName: item.vehicle_name,
        serviceStatus: item.service_status
      }));
    },
    enabled: !!userProfile?.tenant_id,
  });

  const filteredParts = parts.filter(part => 
    part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (part.code && part.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (part.serviceReference && part.serviceReference.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (part.servicePlateNumber && part.servicePlateNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleView = (partId: string) => {
    console.log("View part:", partId);
  };

  const handleEdit = (part: Part) => {
    setSelectedPart(part);
    setIsModalOpen(true);
  };

  const handleDelete = async (partId: string) => {
    try {
      if (!userProfile?.tenant_id) return;
      
      console.log('Deleting part:', partId);
      
      const { error } = await supabase
        .from('service_parts')
        .delete()
        .eq('id', partId)
        .eq('tenant_id', userProfile.tenant_id);
      
      if (error) {
        console.error('Error deleting part:', error);
        throw error;
      }

      refetch();
      
      toast({
        title: "Parça silindi",
        description: "Parça başarıyla silindi.",
        variant: "default",
      });
      
    } catch (error: any) {
      console.error('Error deleting part:', error);
      toast({
        title: "Silme hatası",
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
      console.log("Saving part:", part);
      
      if (selectedPart) {
        // Update existing part
        const { error } = await supabase
          .from('service_parts')
          .update({
            part_name: part.name,
            part_code: part.code || '',
            quantity: part.quantity,
            unit_price: part.unitPrice,
            total_price: part.quantity * part.unitPrice,
            updated_at: new Date().toISOString(),
          })
          .eq('id', part.id)
          .eq('tenant_id', userProfile?.tenant_id);
        
        if (error) throw error;
        
        toast({
          title: "Parça güncellendi",
          description: "Parça başarıyla güncellendi.",
          variant: "default",
        });
      } else {
        // Add new part
        const { error } = await supabase
          .from('service_parts')
          .insert({
            id: part.id,
            service_id: part.serviceId,
            part_name: part.name,
            part_code: part.code || '',
            quantity: part.quantity,
            unit_price: part.unitPrice,
            total_price: part.quantity * part.unitPrice,
            tenant_id: userProfile?.tenant_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
        
        toast({
          title: "Parça eklendi",
          description: "Yeni parça başarıyla eklendi.",
          variant: "default",
        });
      }
      
      refetch();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error saving part:', error);
      toast({
        title: "Kaydetme hatası",
        description: error.message || "Parça kaydedilirken bir hata oluştu.",
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
              <DropdownMenuItem onClick={() => setSearchQuery("fren")}>Fren Parçaları</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchQuery("motor")}>Motor Parçaları</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSearchQuery("elektrik")}>Elektrik Parçaları</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Parça Ekle
          </Button>
        </div>
      </div>

      {filteredParts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Parça bulunamadı.</p>
        </div>
      ) : isMobile ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredParts.map((part) => (
            <PartsCard
              key={part.id}
              part={part}
              onView={() => handleView(part.id)}
              onEdit={() => handleEdit(part)}
              onDelete={() => handleDelete(part.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Parça Adı</TableHead>
                <TableHead>Parça Kodu</TableHead>
                <TableHead className="text-right">Adet</TableHead>
                <TableHead className="text-right">Birim Fiyat</TableHead>
                <TableHead className="text-right">Toplam Fiyat</TableHead>
                <TableHead>Servis</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParts.map((part) => (
                <TableRow key={part.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{part.name}</TableCell>
                  <TableCell className="text-muted-foreground">{part.code || "-"}</TableCell>
                  <TableCell className="text-right">{part.quantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(part.unitPrice)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(part.quantity * part.unitPrice)}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div>{part.serviceReference}</div>
                    {part.serviceStatus && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Durum: {part.serviceStatus === 'waiting' ? 'Bekliyor' : 
                               part.serviceStatus === 'in_progress' ? 'Devam Ediyor' :
                               part.serviceStatus === 'completed' ? 'Tamamlandı' :
                               part.serviceStatus === 'delivered' ? 'Teslim Edildi' :
                               part.serviceStatus === 'cancelled' ? 'İptal Edildi' : part.serviceStatus}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleView(part.id)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Görüntüle</span>
                      </Button>
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
                              Bu işlem geri alınamaz. Bu parçayı silmek istediğinizden emin misiniz?
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
              ))}
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
