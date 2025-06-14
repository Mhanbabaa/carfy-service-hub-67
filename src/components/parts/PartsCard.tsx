
import { Pencil, Trash2, Link, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface PartsCardProps {
  part: Part;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const PartsCard = ({ part, onView, onEdit, onDelete }: PartsCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{part.name}</h3>
              {part.code && <p className="text-muted-foreground text-sm">Kod: {part.code}</p>}
            </div>
            <div>
              <p className="font-semibold text-right">{formatCurrency(part.quantity * part.unitPrice)}</p>
              <p className="text-xs text-muted-foreground">
                {part.quantity} x {formatCurrency(part.unitPrice)}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <button 
              onClick={onView}
              className="text-blue-500 hover:underline flex items-center cursor-pointer"
            >
              <Link className="h-4 w-4 mr-1" />
              {part.serviceReference}
            </button>
          </div>
        </div>
        <div className="flex border-t">
          <Button 
            variant="ghost" 
            className="flex-1 rounded-none h-12" 
            onClick={onView}
          >
            <Eye className="h-4 w-4 mr-2" />
            Görüntüle
          </Button>
          <div className="w-px bg-border h-12" />
          <Button 
            variant="ghost" 
            className="flex-1 rounded-none h-12" 
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Düzenle
          </Button>
          <div className="w-px bg-border h-12" />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex-1 rounded-none text-destructive h-12 hover:bg-destructive/10" 
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Sil
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
                  onClick={onDelete}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Sil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};
