
import { useState } from "react";
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
import { mockParts } from "@/data/parts";
import type { Part } from "@/types/part";

const Parts = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [parts, setParts] = useState<Part[]>(mockParts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

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

  const handleDelete = (partId: string) => {
    setParts(parts.filter(part => part.id !== partId));
    toast({
      title: "Parça silindi",
      description: "Parça başarıyla silindi.",
      variant: "default",
    });
  };

  const handleAddNew = () => {
    setSelectedPart(null);
    setIsModalOpen(true);
  };

  const handleSave = (part: Part) => {
    if (selectedPart) {
      // Update existing part
      setParts(parts.map(p => p.id === part.id ? part : p));
      toast({
        title: "Parça güncellendi",
        description: "Parça bilgileri başarıyla güncellendi.",
        variant: "default",
      });
    } else {
      // Add new part
      setParts([...parts, part]);
      toast({
        title: "Parça eklendi",
        description: "Yeni parça başarıyla eklendi.",
        variant: "default",
      });
    }
    setIsModalOpen(false);
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
              <DropdownMenuItem>Tüm Parçalar</DropdownMenuItem>
              <DropdownMenuItem>Fiyata Göre (Artan)</DropdownMenuItem>
              <DropdownMenuItem>Fiyata Göre (Azalan)</DropdownMenuItem>
              <DropdownMenuItem>Stok Durumuna Göre</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Parça Ekle
          </Button>
        </div>
      </div>

      {isMobile ? (
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

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Toplam {filteredParts.length} parça
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled>
            Önceki
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
            1
          </Button>
          <Button variant="outline" size="sm">
            Sonraki
          </Button>
        </div>
      </div>

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
