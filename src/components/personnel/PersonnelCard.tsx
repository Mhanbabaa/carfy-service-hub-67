
import { Pencil, Trash2 } from "lucide-react";
import { Personnel, getRoleColor, getRoleLabel, getStatusColor, getStatusLabel } from "@/types/personnel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface PersonnelCardProps {
  personnel: Personnel;
  onEdit: () => void;
  onDelete: () => void;
}

export const PersonnelCard = ({ personnel, onEdit, onDelete }: PersonnelCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{personnel.firstName} {personnel.lastName}</h3>
              <p className="text-muted-foreground text-sm">{personnel.username}</p>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <Badge className={`${getRoleColor(personnel.role)} hover:${getRoleColor(personnel.role)}`}>
                {getRoleLabel(personnel.role)}
              </Badge>
              <Badge className={`${getStatusColor(personnel.status)} hover:${getStatusColor(personnel.status)}`}>
                {getStatusLabel(personnel.status)}
              </Badge>
            </div>
          </div>
          <div className="mt-3 space-y-1 text-sm">
            <p>
              <a href={`mailto:${personnel.email}`} className="text-blue-500 hover:underline">
                {personnel.email}
              </a>
            </p>
            <p>
              <a href={`tel:${personnel.phone}`} className="text-blue-500 hover:underline">
                {personnel.phone}
              </a>
            </p>
          </div>
        </div>
        <div className="flex border-t">
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
                <AlertDialogTitle>Personeli Sil</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu işlem geri alınamaz. Bu personeli silmek istediğinizden emin misiniz?
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
