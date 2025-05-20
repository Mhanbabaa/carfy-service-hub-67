import { useState } from "react";
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
  Loader2
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

  // Filter vehicles based on search query
  const filteredVehicles = vehiclesData?.data
    ? vehiclesData.data.filter((vehicle: any) => {
        if (!searchQuery) return true;
        
        const searchString = searchQuery.toLowerCase();
        return (
          vehicle.plate?.toLowerCase().includes(searchString) ||
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
                <option value="BMW">BMW</option>
                <option value="Mercedes">Mercedes</option>
                <option value="Audi">Audi</option>
                <option value="Volkswagen">Volkswagen</option>
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
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
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
                    <TableCell className="font-medium">{vehicle.plate}</TableCell>
                    <TableCell>
                      {vehicle.brand_name} {vehicle.model_name}
                    </TableCell>
                    <TableCell>{vehicle.year}</TableCell>
                    <TableCell>{vehicle.customer_name}</TableCell>
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
                        <Button variant="ghost" size="icon">
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
    </div>
  );
}
