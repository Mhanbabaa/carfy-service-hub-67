
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
  ChevronRight
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

// Mock data for the vehicles
const vehicles = [
  {
    id: 1,
    plate: "34 AB 1234",
    brand: "BMW",
    model: "320i",
    year: 2021,
    customer: "Ali Yılmaz",
    lastService: "15 May 2023",
    status: "active",
  },
  {
    id: 2,
    plate: "34 CD 5678",
    brand: "Mercedes",
    model: "C200",
    year: 2020,
    customer: "Ayşe Demir",
    lastService: "22 Nis 2023",
    status: "inService",
  },
  {
    id: 3,
    plate: "34 EF 9012",
    brand: "Audi",
    model: "A3",
    year: 2022,
    customer: "Mehmet Kaya",
    lastService: "08 Haz 2023",
    status: "waiting",
  },
  {
    id: 4,
    plate: "34 GH 3456",
    brand: "Volkswagen",
    model: "Passat",
    year: 2019,
    customer: "Zeynep Çelik",
    lastService: "30 Mar 2023",
    status: "active",
  },
  {
    id: 5,
    plate: "34 IJ 7890",
    brand: "Ford",
    model: "Focus",
    year: 2021,
    customer: "Hakan Şahin",
    lastService: "12 Şub 2023",
    status: "inService",
  },
  {
    id: 6,
    plate: "34 KL 1234",
    brand: "Toyota",
    model: "Corolla",
    year: 2020,
    customer: "Selin Yıldız",
    lastService: "05 Oca 2023",
    status: "waiting",
  },
  {
    id: 7,
    plate: "34 MN 5678",
    brand: "Honda",
    model: "Civic",
    year: 2021,
    customer: "Burak Öztürk",
    lastService: "18 Tem 2023",
    status: "active",
  },
  {
    id: 8,
    plate: "34 OP 9012",
    brand: "Renault",
    model: "Megane",
    year: 2019,
    customer: "Deniz Acar",
    lastService: "24 Ağu 2023",
    status: "inService",
  },
  {
    id: 9,
    plate: "34 RS 3456",
    brand: "Opel",
    model: "Astra",
    year: 2020,
    customer: "Emre Koç",
    lastService: "09 Eyl 2023",
    status: "waiting",
  },
  {
    id: 10,
    plate: "34 TU 7890",
    brand: "Hyundai",
    model: "i20",
    year: 2022,
    customer: "Gül Aksoy",
    lastService: "14 Eki 2023",
    status: "active",
  },
];

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

  // Filter vehicles based on search query
  const filteredVehicles = vehicles.filter((vehicle) => {
    const searchString = searchQuery.toLowerCase();
    return (
      vehicle.plate.toLowerCase().includes(searchString) ||
      vehicle.brand.toLowerCase().includes(searchString) ||
      vehicle.model.toLowerCase().includes(searchString) ||
      vehicle.customer.toLowerCase().includes(searchString)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Toggle filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Apply filter
  const applyFilter = (key: string, value: string) => {
    setActiveFilters({ ...activeFilters, [key]: value });
  };

  // Remove filter
  const removeFilter = (key: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    setActiveFilters(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({});
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Araçlar</h1>
        <p className="text-muted-foreground">
          Müşterilere ait tüm araçları görüntüleyin ve yönetin
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Araç veya müşteri ara..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "relative",
              Object.keys(activeFilters).length > 0 && "bg-primary/10"
            )}
            onClick={toggleFilters}
          >
            <Filter className="h-4 w-4" />
            {Object.keys(activeFilters).length > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {Object.keys(activeFilters).length}
              </span>
            )}
          </Button>
          <Button className="flex gap-2 items-center">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Araç Ekle</span>
          </Button>
        </div>
      </div>

      {/* Active filters */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Aktif filtreler:</span>
          {Object.entries(activeFilters).map(([key, value]) => (
            <Badge
              key={key}
              variant="outline"
              className="flex items-center gap-1 pl-3 pr-2 py-1 bg-background"
            >
              <span>
                {key}: {value}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                onClick={() => removeFilter(key)}
              >
                <FilterX className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-muted-foreground hover:text-foreground"
            onClick={clearFilters}
          >
            Temizle
          </Button>
        </div>
      )}

      {/* Desktop Table */}
      <div className="rounded-md border overflow-hidden shadow-sm hidden sm:block">
        <Table>
          <TableHeader className="bg-accent/50">
            <TableRow>
              <TableHead className="font-medium">Plaka</TableHead>
              <TableHead className="font-medium">Marka/Model</TableHead>
              <TableHead className="font-medium">Yıl</TableHead>
              <TableHead className="font-medium">Müşteri</TableHead>
              <TableHead className="font-medium">Son Servis</TableHead>
              <TableHead className="font-medium">Durum</TableHead>
              <TableHead className="font-medium text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedVehicles.length > 0 ? (
              paginatedVehicles.map((vehicle) => (
                <TableRow
                  key={vehicle.id}
                  className="hover:bg-accent/30 transition-colors"
                >
                  <TableCell className="font-medium">{vehicle.plate}</TableCell>
                  <TableCell>
                    {vehicle.brand} {vehicle.model}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {vehicle.year}
                  </TableCell>
                  <TableCell>{vehicle.customer}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {vehicle.lastService}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={vehicle.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Araç bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-4">
        {paginatedVehicles.length > 0 ? (
          paginatedVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="border rounded-lg p-4 bg-card shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-lg">{vehicle.plate}</span>
                <StatusBadge status={vehicle.status} />
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Marka/Model:</span>
                  <span>
                    {vehicle.brand} {vehicle.model} ({vehicle.year})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Müşteri:</span>
                  <span>{vehicle.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Son Servis:</span>
                  <span>{vehicle.lastService}</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 border rounded-lg">
            Araç bulunamadı.
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredVehicles.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-sm text-muted-foreground order-2 sm:order-1">
            Toplam {filteredVehicles.length} araç
          </div>
          <Pagination className="order-1 sm:order-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={cn(
                    currentPage === 1 && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={cn(
                    currentPage === totalPages && "pointer-events-none opacity-50"
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="flex items-center gap-2 order-3 sm:order-3">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Sayfa başına:
            </span>
            <select
              className="h-8 rounded-md border border-input bg-background px-2 text-sm"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
