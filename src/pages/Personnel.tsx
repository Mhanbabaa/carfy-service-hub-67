import { useState } from "react";
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
import { Plus, Search, SlidersHorizontal, Pencil, Trash2 } from "lucide-react";
import { Personnel as PersonnelType, getRoleColor, getRoleLabel, getStatusColor, getStatusLabel } from "@/types/personnel";
import { PersonnelModal } from "@/components/personnel/PersonnelModal";
import { PersonnelCard } from "@/components/personnel/PersonnelCard";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from "@/hooks/use-supabase-query";

const Personnel = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<PersonnelType | null>(null);

  // Fetch personnel (users) from Supabase with tenant filter
  const { data: personnelData, isLoading, refetch } = useSupabaseQuery('users', {
    orderBy: 'created_at',
    orderDirection: 'desc',
    pageSize: 100
  });

  // Map Supabase users to Personnel type
  const personnel: PersonnelType[] = (personnelData?.data || []).map(user => ({
    id: user.id,
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    username: user.email.split('@')[0], // Use email prefix as username
    email: user.email,
    phone: user.phone || '',
    role: user.role as PersonnelType['role'],
    status: user.status as PersonnelType['status'],
    createdAt: user.created_at ? new Date(user.created_at) : new Date()
  }));

  // CRUD operations with Supabase
  const createPersonnel = useSupabaseCreate('users');
  const updatePersonnel = useSupabaseUpdate('users');
  const deletePersonnel = useSupabaseDelete('users');

  const filteredPersonnel = personnel.filter(person => 
    person.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    person.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getRoleLabel(person.role).toLowerCase().includes(searchQuery.toLowerCase()) ||
    getStatusLabel(person.status).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (person: PersonnelType) => {
    setSelectedPersonnel(person);
    setIsModalOpen(true);
  };

  const handleDelete = async (personId: string) => {
    try {
      await deletePersonnel.mutateAsync(personId);
      toast({
        title: "Personel silindi",
        description: "Personel başarıyla silindi.",
        variant: "default",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting personnel:", error);
      toast({
        title: "Hata",
        description: "Personel silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    setSelectedPersonnel(null);
    setIsModalOpen(true);
  };

  const handleSave = async (person: PersonnelType) => {
    try {
      // Convert Personnel type to Supabase user format
      const userData = {
        id: person.id,
        first_name: person.firstName,
        last_name: person.lastName,
        email: person.email,
        phone: person.phone,
        role: person.role,
        status: person.status
      };

      if (selectedPersonnel) {
        // Update existing personnel
        await updatePersonnel.mutateAsync({ 
          id: person.id,
          data: userData
        });
        toast({
          title: "Personel güncellendi",
          description: "Personel bilgileri başarıyla güncellendi.",
          variant: "default",
        });
      } else {
        // Add new personnel
        await createPersonnel.mutateAsync(userData);
        toast({
          title: "Personel eklendi",
          description: "Yeni personel başarıyla eklendi.",
          variant: "default",
        });
      }
      refetch();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving personnel:", error);
      toast({
        title: "Hata",
        description: "Personel kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  // Role explanation cards
  const roleExplanations = [
    {
      role: "admin",
      description: "Tüm yetkilere sahiptir."
    },
    {
      role: "technician",
      description: "Servis işlemlerine erişebilir."
    },
    {
      role: "consultant",
      description: "Müşteri ve araç işlemlerine erişebilir."
    },
    {
      role: "accountant",
      description: "Ücret ve fatura işlemlerine erişebilir."
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-poppins font-bold">Personel</h1>
        <p className="text-muted-foreground">Tüm personel kayıtlarını görüntüleyin ve yönetin</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-auto flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Personel ara..."
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
              <DropdownMenuItem>Tüm Personel</DropdownMenuItem>
              <DropdownMenuItem>Aktif Personel</DropdownMenuItem>
              <DropdownMenuItem>Pasif Personel</DropdownMenuItem>
              <DropdownMenuItem>Yöneticiler</DropdownMenuItem>
              <DropdownMenuItem>Teknisyenler</DropdownMenuItem>
              <DropdownMenuItem>Danışmanlar</DropdownMenuItem>
              <DropdownMenuItem>Muhasebe</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Personel Ekle
          </Button>
        </div>
      </div>

      {isMobile ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPersonnel.length > 0 ? (
            filteredPersonnel.map((person) => (
              <PersonnelCard
                key={person.id}
                personnel={person}
                onEdit={() => handleEdit(person)}
                onDelete={() => handleDelete(person.id)}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center border rounded-lg">
              <p className="mb-4 text-muted-foreground">Personel bulunamadı.</p>
              <Button onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" />
                Personel Ekle
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Ad Soyad</TableHead>
                <TableHead>Kullanıcı Adı</TableHead>
                <TableHead>E-posta</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPersonnel.length > 0 ? (
                filteredPersonnel.map((person) => (
                  <TableRow key={person.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {person.firstName} {person.lastName}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {person.username}
                    </TableCell>
                    <TableCell>
                      <a href={`mailto:${person.email}`} className="text-blue-500 hover:underline">
                        {person.email}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a href={`tel:${person.phone}`} className="text-blue-500 hover:underline">
                        {person.phone}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${getRoleColor(person.role)} hover:${getRoleColor(person.role)}`}
                      >
                        {getRoleLabel(person.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${getStatusColor(person.status)} hover:${getStatusColor(person.status)}`}
                      >
                        {getStatusLabel(person.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(person)}
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
                              <AlertDialogTitle>Personeli Sil</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bu işlem geri alınamaz. {person.firstName} {person.lastName} adlı personeli silmek istediğinizden emin misiniz?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>İptal</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() => handleDelete(person.id)}
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
                    Personel bulunamadı.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Toplam {filteredPersonnel.length} personel
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

      {!isMobile && (
        <div className="space-y-4">
          <h2 className="text-xl font-poppins font-semibold">Roller ve Yetkiler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {roleExplanations.map((roleInfo) => (
              <Card key={roleInfo.role} className="bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <Badge 
                      className={`${getRoleColor(roleInfo.role as PersonnelType['role'])} hover:${getRoleColor(roleInfo.role as PersonnelType['role'])} mr-2`}
                    >
                      {getRoleLabel(roleInfo.role as PersonnelType['role'])}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{roleInfo.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <PersonnelModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        personnel={selectedPersonnel}
        onSave={handleSave}
      />
    </div>
  );
};

export default Personnel;
