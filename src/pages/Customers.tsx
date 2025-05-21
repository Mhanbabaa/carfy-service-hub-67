import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Eye, Pencil, Plus, Search, Filter, Trash2, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { CustomerModal } from "@/components/customers/CustomerModal";
import { CustomerCard } from "@/components/customers/CustomerCard";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useSupabaseQuery, useSupabaseCreate, useSupabaseUpdate, useSupabaseDelete } from "@/hooks/use-supabase-query";
import { useAuth } from "@/contexts/AuthContext";
import { Customer, normalizeCustomer } from "@/types/customer";

// Define the Customer interface
export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  address: string;
  created_at?: string;
  updated_at?: string;
  tenant_id?: string;
  vehicle_count?: number;
  // Legacy fields for compatibility with existing components
  firstName?: string;
  lastName?: string;
  vehicleCount?: number;
}

const Customers = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch customers from Supabase
  const { data: customersData, isLoading, isError, refetch } = useSupabaseQuery('customers', {
    page: currentPage,
    pageSize,
    orderBy: 'created_at',
    orderDirection: 'desc',
    select: '*, vehicles(count)'
  });

  // Create, update, and delete mutations
  const createCustomer = useSupabaseCreate('customers');
  const updateCustomer = useSupabaseUpdate('customers');
  const deleteCustomer = useSupabaseDelete('customers');

  // Process customer data to include vehicle count
  const customers: Customer[] = customersData?.data?.map((customer: any) => 
    normalizeCustomer({
      ...customer,
      vehicle_count: customer.vehicles?.length || 0,
      // Add compatibility fields
      firstName: customer.first_name,
      lastName: customer.last_name,
      vehicleCount: customer.vehicles?.length || 0
    })
  ) || [];

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) =>
    `${customer.first_name} ${customer.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages
  const totalItems = customersData?.count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddCustomer = () => {
    setCurrentCustomer(null); // Set to null for adding a new customer
    setModalOpen(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setCurrentCustomer(normalizeCustomer(customer));
    setModalOpen(true);
  };

  const handleViewCustomer = (customer: Customer) => {
    toast({
      title: "Müşteri Bilgileri",
      description: `${customer.first_name} ${customer.last_name} detayları görüntülendi.`,
    });
  };

  const handleSaveCustomer = async (customer: Customer, isNew: boolean) => {
    try {
      if (isNew) {
        // Add new customer
        await createCustomer.mutateAsync({
          first_name: customer.firstName || customer.first_name,
          last_name: customer.lastName || customer.last_name,
          phone: customer.phone,
          email: customer.email,
          address: customer.address
        });
        toast({
          title: "Müşteri Eklendi",
          description: "Yeni müşteri başarıyla eklendi.",
          variant: "default",
        });
      } else {
        // Update existing customer
        await updateCustomer.mutateAsync({
          id: customer.id,
          data: {
            first_name: customer.firstName || customer.first_name,
            last_name: customer.lastName || customer.last_name,
            phone: customer.phone,
            email: customer.email,
            address: customer.address
          }
        });
        toast({
          title: "Müşteri Güncellendi",
          description: "Müşteri bilgileri başarıyla güncellendi.",
          variant: "default",
        });
      }
      // Refetch customers to update the list
      refetch();
      setModalOpen(false);
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "İşlem sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      await deleteCustomer.mutateAsync(customerId);
      toast({
        title: "Müşteri Silindi",
        description: "Müşteri kaydı başarıyla silindi.",
        variant: "default",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Silme işlemi sırasında bir hata oluştu.",
        variant: "destructive",
      });
    }
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

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Müşteriler yükleniyor...</span>
        </div>
      ) : isError ? (
        <Card className="p-8 flex flex-col items-center justify-center">
          <p className="text-lg font-medium mb-4">Veri yüklenirken bir hata oluştu</p>
          <Button onClick={() => refetch()}>Yeniden Dene</Button>
        </Card>
      ) : filteredCustomers.length === 0 ? (
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
              customer={{
                ...customer,
                firstName: customer.first_name,
                lastName: customer.last_name,
                vehicleCount: customer.vehicle_count || 0
              }}
              onView={() => handleViewCustomer(customer)}
              onEdit={() => handleEditCustomer(customer)}
              onDelete={() => handleDeleteCustomer(customer.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-md border shadow">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Müşteri</TableHead>
                <TableHead>İletişim</TableHead>
                <TableHead>Adres</TableHead>
                <TableHead>Araç Sayısı</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.first_name} {customer.last_name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{customer.phone}</span>
                      <span className="text-xs text-muted-foreground">{customer.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {customer.address}
                  </TableCell>
                  <TableCell>
                    {customer.vehicle_count || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => handleViewCustomer(customer)}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Müşteri Detayları</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => handleEditCustomer(customer)}
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
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
                                  className="h-8 w-8 text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Müşteriyi Sil</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {customer.first_name} {customer.last_name} isimli müşteriyi silmek 
                                    istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>İptal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteCustomer(customer.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Toplam {totalItems} müşteri
              </span>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}

      {/* Customer Modal */}
      {modalOpen && (
        <CustomerModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          customer={currentCustomer}
          onSave={handleSaveCustomer}
        />
      )}
    </div>
  );
};

export default Customers;
