
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Plus, Search, SlidersHorizontal } from "lucide-react";

interface PartsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddNew: () => void;
}

export const PartsFilters = ({ searchQuery, onSearchChange, onAddNew }: PartsFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between">
      <div className="relative w-full sm:w-auto flex-1 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Parça ara..."
          className="pl-9 w-full"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
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
            <DropdownMenuItem onClick={() => onSearchChange("")}>Tüm Parçalar</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSearchChange("fren")}>Fren Parçaları</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSearchChange("motor")}>Motor Parçaları</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSearchChange("elektrik")}>Elektrik Parçaları</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={onAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Parça Ekle
        </Button>
      </div>
    </div>
  );
};
