
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Service, getStatusColor, getStatusLabel } from "@/types/service";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ServiceCardProps {
  service: Service;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const ServiceCard = ({ service, onView, onEdit, onDelete }: ServiceCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between">
            <div>
              <h3 className="font-poppins font-semibold text-lg">{service.plateNumber}</h3>
              <p className="text-sm text-muted-foreground">{service.make} {service.model} ({service.year})</p>
            </div>
            <Badge 
              className={`${getStatusColor(service.status)} hover:${getStatusColor(service.status)}`}
            >
              {getStatusLabel(service.status)}
            </Badge>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Müşteri:</span>
              <span>{service.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Teknisyen:</span>
              <span>{service.technician}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kilometre:</span>
              <span>{service.mileage.toLocaleString()} km</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Toplam Ücret:</span>
              <span>{formatCurrency(service.totalCost)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between bg-muted/30 p-4 border-t">
        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0" onClick={onView}>
          <Eye className="h-4 w-4" />
          <span className="sr-only">Görüntüle</span>
        </Button>
        
        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0" onClick={onEdit}>
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Düzenle</span>
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 rounded-full p-0 hover:bg-destructive/10 hover:text-destructive"
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
                onClick={onDelete}
              >
                Sil
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
