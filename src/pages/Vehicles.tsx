import { useState, useEffect } from "react";
import { 
  Car, 
  Search, 
  FilterX, 
  Filter, 
  ChevronDown, 
  Eye, 
  Edit, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { format } from 'date-fns';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog";

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    active: {
      label: "Aktif",
      className: "bg-status-active text-white",
    },
    inService: {
      label: "Serviste",
      className: "bg-primary text-white",
    },
    waiting: {
      label: "Beklemede",
      className: "bg-status-pending text-white",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;

  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
};

export default function Vehicles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string }>({});
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Fetch vehicles from Supabase
  const { data: vehiclesData, isLoading, isError } = useSupabaseQuery(
    'vehicle_details', // Using a view that joins vehicles with customers and other related data
    {
      pageSize: itemsPerPage,
      page: currentPage,
      orderBy: 'created_at',
      orderDirection: 'desc',
    }
  );

  // Fetch car brands for filter
  const { data: brandsData, isLoading: isLoadingBrands } = useSupabaseQuery(
    'car_brands',
    {
      orderBy: 'name',
      orderDirection: 'asc',
      pageSize: 100,
      queryKey: ['car_brands']
    }
  );
  
  const brands = brandsData?.data || [];

  // Filter vehicles based on search query
  const filteredVehicles = vehiclesData?.data
    ? vehiclesData.data.filter((vehicle: any) => {
        if (!searchQuery) return true;
        
        const searchString = searchQuery.toLowerCase();
        return (
          vehicle.plate_number?.toLowerCase().includes(searchString) ||
          vehicle.brand_name?.toLowerCase().includes(searchString) ||
          vehicle.model_name?.toLowerCase().includes(searchString) ||
          vehicle.customer_name?.toLowerCase().includes(searchString)
        );
      })
    : [];

  // Calculate pagination
  const totalItems = vehiclesData?.count || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Toggle filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const applyFilter = (key: string, value: string) => {
    setActiveFilters({ ...activeFilters, [key]: value });
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    setActiveFilters(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
  };

  const openDetails = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setDetailsOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center">
          <Car className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Araçlar</h1>
        </div>
        <Button className="mt-4 sm:mt-0">
          <Plus className="mr-2 h-4 w-4" /> Yeni Araç Ekle
        </Button>
      </div>

      <div className="bg-card shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Araç, müşteri veya plaka ara..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {Object.keys(activeFilters).length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-3"
                onClick={clearFilters}
              >
                <FilterX className="mr-2 h-4 w-4" />
                Filtreleri Temizle
              </Button>
            )}
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              className="h-10 px-3"
              onClick={toggleFilters}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filtrele
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-muted/40 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Status filter */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Durum
              </label>
              <select
                className="w-full rounded-md border border-input px-3 py-2 bg-background"
                value={activeFilters.status || ""}
                onChange={(e) => applyFilter("status", e.target.value)}
              >
                <option value="">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="inService">Serviste</option>
                <option value="waiting">Beklemede</option>
              </select>
            </div>

            {/* Brand filter */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Marka
              </label>
              <select
                className="w-full rounded-md border border-input px-3 py-2 bg-background"
                value={activeFilters.brand || ""}
                onChange={(e) => applyFilter("brand", e.target.value)}
              >
                <option value="">Tüm Markalar</option>
                {isLoadingBrands ? (
                  <option value="" disabled>Yükleniyor...</option>
                ) : (
                  brands.map((brand: any) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Year filter */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Yıl
              </label>
              <select
                className="w-full rounded-md border border-input px-3 py-2 bg-background"
                value={activeFilters.year || ""}
                onChange={(e) => applyFilter("year", e.target.value)}
              >
                <option value="">Tüm Yıllar</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Last service filter */}
            <div>
              <label className="text-sm font-medium mb-1 block">
                Son Servis
              </label>
              <select
                className="w-full rounded-md border border-input px-3 py-2 bg-background"
                value={activeFilters.lastService || ""}
                onChange={(e) => applyFilter("lastService", e.target.value)}
              >
                <option value="">Tüm Zamanlar</option>
                <option value="lastMonth">Son 1 Ay</option>
                <option value="last3Months">Son 3 Ay</option>
                <option value="last6Months">Son 6 Ay</option>
                <option value="lastYear">Son 1 Yıl</option>
              </select>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Veri yükleniyor...</span>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-destructive">
            Araç verileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            Araç bulunamadı. Lütfen filtrelerinizi değiştirin veya yeni bir araç ekleyin.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plaka</TableHead>
                  <TableHead>Marka/Model</TableHead>
                  <TableHead>Yıl</TableHead>
                  <TableHead>Müşteri</TableHead>
                  <TableHead>Son Servis</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle: any) => (
                  <TableRow key={vehicle.id}>
                    <TableCell className="font-medium">{vehicle.plate_number}</TableCell>
                    <TableCell>
                      {vehicle.brand_name} {vehicle.model_name}
                    </TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        {vehicle.customer_name}
                      </div>
                    </TableCell>
                    <TableCell>
                      {vehicle.last_service_date 
                        ? format(new Date(vehicle.last_service_date), 'dd MMM yyyy')
                        : 'Yok'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={vehicle.status || 'active'} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openDetails(vehicle)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="p-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(i + 1);
                    }}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                  }}
                  className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>

      {/* Vehicle Details Dialog */}
      {selectedVehicle && (
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold flex items-center">
                <Car className="h-5 w-5 mr-2 text-primary" />
                {selectedVehicle.plate_number}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              {/* Vehicle Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Araç Bilgileri</h3>
                
                <div className="space-y-2">
                  <div className="grid grid-cols-3">
                    <span className="font-medium text-muted-foreground">Marka:</span>
                    <span className="col-span-2">{selectedVehicle.brand_name}</span>
                  </div>
                  
                  <div className="grid grid-cols-3">
                    <span className="font-medium text-muted-foreground">Model:</span>
                    <span className="col-span-2">{selectedVehicle.model_name}</span>
                  </div>
                  
                  <div className="grid grid-cols-3">
                    <span className="font-medium text-muted-foreground">Yıl:</span>
                    <span className="col-span-2">{selectedVehicle.year}</span>
                  </div>
                  
                  <div className="grid grid-cols-3">
                    <span className="font-medium text-muted-foreground">Şase No:</span>
                    <span className="col-span-2">{selectedVehicle.chassis_number || 'Belirtilmemiş'}</span>
                  </div>
                  
                  <div className="grid grid-cols-3">
                    <span className="font-medium text-muted-foreground">Kilometre:</span>
                    <span className="col-span-2">{selectedVehicle.mileage || 'Belirtilmemiş'}</span>
                  </div>
                  
                  <div className="grid grid-cols-3">
                    <span className="font-medium text-muted-foreground">Garanti:</span>
                    <span className="col-span-2">{selectedVehicle.under_warranty ? 'Evet' : 'Hayır'}</span>
                  </div>
                </div>
              </div>
              
              {/* Customer Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-lg">Müşteri Bilgileri</h3>
                
                <div className="space-y-2">
                  <div className="grid grid-cols-3">
                    <span className="font-medium text-muted-foreground">İsim:</span>
                    <span className="col-span-2">{selectedVehicle.customer_name}</span>
                  </div>
                  
                  <div className="grid grid-cols-3">
                    <span className="font-medium text-muted-foreground">Telefon:</span>
                    <span className="col-span-2">{selectedVehicle.customer_phone || 'Belirtilmemiş'}</span>
                  </div>
                  
                  <div className="grid grid-cols-3">
                    <span className="font-medium text-muted-foreground">E-posta:</span>
                    <span className="col-span-2">{selectedVehicle.customer_email || 'Belirtilmemiş'}</span>
                  </div>
                </div>
                
                <h3 className="font-medium text-lg mt-6">Servis Geçmişi</h3>
                {selectedVehicle.service_count > 0 ? (
                  <div>
                    <p>Toplam {selectedVehicle.service_count} servis kaydı</p>
                    <p>Son servis: {selectedVehicle.last_service_date 
                      ? format(new Date(selectedVehicle.last_service_date), 'dd MMM yyyy')
                      : 'Yok'}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Servis kaydı bulunmamaktadır.</p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                Kapat
              </Button>
              <Button variant="default">
                <Edit className="h-4 w-4 mr-2" /> Düzenle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
