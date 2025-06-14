
import { useIsMobile } from "@/hooks/use-mobile";
import { PartsHeader } from "@/components/parts/PartsHeader";
import { PartsFilters } from "@/components/parts/PartsFilters";
import { PartsTable } from "@/components/parts/PartsTable";
import { PartsGrid } from "@/components/parts/PartsGrid";
import { PartsModal } from "@/components/parts/PartsModal";
import { usePartsData } from "@/hooks/usePartsData";

const Parts = () => {
  const isMobile = useIsMobile();
  const {
    parts,
    isLoading,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    selectedPart,
    handleView,
    handleEdit,
    handleDelete,
    handleAddNew,
    handleSave
  } = usePartsData();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PartsHeader />

      <PartsFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAddNew={handleAddNew}
      />

      {parts.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Parça bulunamadı.</p>
        </div>
      ) : isMobile ? (
        <PartsGrid
          parts={parts}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <PartsTable
          parts={parts}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <PartsModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        part={selectedPart}
        onSave={handleSave}
      />
    </div>
  );
};

export default Parts;
