
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Eye, Pencil, Plus, Search, Filter, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { CustomerModal } from "@/components/customers/CustomerModal";
import { CustomerCard } from "@/components/customers/CustomerCard";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Define the Customer interface
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  vehicleCount: number;
}

// Sample data for customers
const sampleCustomers: Customer[] = [
  {
    id: "1",
    firstName: "Ahmet",
    lastName: "Yılmaz",
    phone: "+90 532 123 4567",
    email: "ahmet.yilmaz@example.com",
    address: "Ataşehir, İstanbul",
    vehicleCount: 2,
  },
  {
    id: "2",
    firstName: "Ayşe",
    lastName: "Kaya",
    phone: "+90 533 765 4321",
    email: "ayse.kaya@example.com",
    address: "Kadıköy, İstanbul",
    vehicleCount: 1,
  },
  {
    id: "3",
    firstName: "Mehmet",
    lastName: "Demir",
    phone: "+90 535 987 6543",
    email: "mehmet.demir@example.com",
    address: "Çankaya, Ankara",
    vehicleCount: 3,
  },
  {
    id: "4",
    firstName: "Fatma",
    lastName: "Şahin",
    phone: "+90 536 456 7890",
    email: "fatma.sahin@example.com",
    address: "Karşıyaka, İzmir",
    vehicleCount: 1,
  },
  {
    id: "5",
    firstName: "Ali",
    lastName: "Öztürk",
    phone: "+90 537 234 5678",
    email: "ali.ozturk@example.com",
    address: "Konak, İzmir",
    vehicleCount: 2,
  },
  {
    id: "6",
    firstName: "Zeynep",
    lastName: "Çelik",
    phone: "+90 538 345 6789",
    email: "zeynep.celik@example.com",
    address: "Nilüfer, Bursa",
    vehicleCount: 1,
  },
];

const Customers = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState(sampleCustomers);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) =>
    `${customer.firstName} ${customer.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCustomer = () => {
    setCurrentCustomer(null); // Set to null for adding a new customer
    setModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setModalOpen(true);
  };

  const handleViewCustomer = (customer: Customer) => {
    toast({
      title: "Müşteri Bilgileri",
      description: `${customer.firstName} ${customer.lastName} detayları görüntülendi.`,
    });
  };

  const handleSaveCustomer = (customer: Customer, isNew: boolean) => {
    if (isNew) {
      // Add new customer
      const newCustomer = { ...customer, id: Date.now().toString() };
      setCustomers([...customers, newCustomer]);
      toast({
        title: "Müşteri Eklendi",
        description: "Yeni müşteri başarıyla eklendi.",
        variant: "default",
      });
    } else {
      // Update existing customer
      setCustomers(customers.map((c) => (c.id === customer.id ? customer : c)));
      toast({
        title: "Müşteri Güncellendi",
        description: "Müşteri bilgileri başarıyla güncellendi.",
        variant: "default",
      });
    }
    setModalOpen(false);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(customers.filter((c) => c.id !== customerId));
    toast({
      title: "Müşteri Silindi",
      description: "Müşteri kaydı başarıyla silindi.",
      variant: "default",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-poppins font-bold">Müşteriler</h1>
        <p className="text-sm text-muted-foreground font-roboto">
          Tüm müşteri kayıtlarını görüntüleyin ve yönetin
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Müşteri ara..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Button 
          onClick={handleAddCustomer} 
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" /> Müşteri Ekle
        </Button>
      </div>

      {filteredCustomers.length === 0 ? (
        <Card className="p-8 flex flex-col items-center justify-center">
          <p className="text-lg font-medium mb-4">Müşteri bulunamadı</p>
          <p className="text-muted-foreground mb-6">Aramayı değiştirin veya yeni bir müşteri ekleyin</p>
          <Button onClick={handleAddCustomer}>
            <Plus className="h-4 w-4 mr-2" /> Müşteri Ekle
          </Button>
        </Card>
      ) : isMobile ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onView={() => handleViewCustomer(customer)}
              onEdit={() => handleEditCustomer(customer)}
              onDelete={() => handleDeleteCustomer(customer.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead className="font-semibold">Ad Soyad</TableHead>
                <TableHead className="font-semibold">Telefon</TableHead>
                <TableHead className="font-semibold">E-posta</TableHead>
                <TableHead className="font-semibold">Adres</TableHead>
                <TableHead className="font-semibold">Araç Sayısı</TableHead>
                <TableHead className="text-right font-semibold">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer, index) => (
                <TableRow key={customer.id} className={index % 2 === 0 ? "bg-background" : "bg-muted/20 hover:bg-muted/30"}>
                  <TableCell className="font-medium">
                    {customer.firstName} {customer.lastName}
                  </TableCell>
                  <TableCell>
                    <a href={`tel:${customer.phone}`} className="hover:text-primary">
                      {customer.phone}
                    </a>
                  </TableCell>
                  <TableCell>
                    <a href={`mailto:${customer.email}`} className="hover:text-primary">
                      {customer.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="inline-block max-w-[200px] truncate">
                            {customer.address}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{customer.address}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{customer.vehicleCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleViewCustomer(customer)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Görüntüle</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full"
                              onClick={() => handleEditCustomer(customer)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Düzenle</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
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
                                    onClick={() => handleDeleteCustomer(customer.id)}
                                  >
                                    Sil
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Sil</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Toplam {filteredCustomers.length} müşteri
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <CustomerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        customer={currentCustomer}
        onSave={handleSaveCustomer}
      />
    </div>
  );
};

export default Customers;
