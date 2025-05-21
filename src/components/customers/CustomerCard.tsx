
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/customer";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface CustomerCardProps {
  customer: Customer;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const CustomerCard = ({ customer, onView, onEdit, onDelete }: CustomerCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-poppins font-semibold text-lg">
              {customer.firstName || customer.first_name} {customer.lastName || customer.last_name}
            </h3>
            <div className="text-muted-foreground text-sm">
              {customer.vehicleCount} araç
            </div>
          </div>

          <div className="grid gap-2 text-sm">
            <a 
              href={`tel:${customer.phone}`}
              className="flex items-center text-sm hover:text-primary transition-colors"
            >
              {customer.phone}
            </a>
            
            <a 
              href={`mailto:${customer.email}`}
              className="flex items-center text-sm hover:text-primary transition-colors"
            >
              {customer.email}
            </a>
            
            <div className="flex items-start text-sm text-muted-foreground">
              <span className="line-clamp-2">{customer.address}</span>
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
              <AlertDialogTitle>Müşteriyi Sil</AlertDialogTitle>
              <AlertDialogDescription>
                Bu işlem geri alınamaz. Bu müşteriyi silmek istediğinizden emin misiniz?
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
