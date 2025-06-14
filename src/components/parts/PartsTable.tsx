
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
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
import { Part } from "@/types/part";

interface PartsTableProps {
  parts: Part[];
  onView: (part: Part) => void;
  onEdit: (part: Part) => void;
  onDelete: (partId: string) => void;
}

export const PartsTable = ({ parts, onView, onEdit, onDelete }: PartsTableProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  return (
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
          {parts.map((part) => (
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
                    onClick={() => onView(part)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Görüntüle</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(part)}
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
                          onClick={() => onDelete(part.id)}
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
  );
};
