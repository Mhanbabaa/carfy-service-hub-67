
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Part } from "@/types/part";

export const usePartsData = () => {
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  // Fetch parts data from service_parts_view
  const { data: parts = [], isLoading, refetch } = useQuery({
    queryKey: ['parts', userProfile?.tenant_id],
    queryFn: async () => {
      if (!userProfile?.tenant_id) return [];
      
      console.log('Fetching parts for tenant:', userProfile.tenant_id);
      
      const { data, error } = await supabase
        .from('service_parts_view')
        .select('*')
        .eq('tenant_id', userProfile.tenant_id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching parts:', error);
        toast({
          title: "Veri alma hatası",
          description: "Parçalar yüklenirken bir hata oluştu.",
          variant: "destructive",
        });
        return [];
      }
      
      console.log('Parts data:', data);
      
      // Map service_parts_view data to Part type
      return data.map(item => ({
        id: item.id,
        name: item.part_name,
        code: item.part_code,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        serviceId: item.service_id,
        serviceReference: item.service_reference || `${item.plate_number || 'Bilinmiyor'} - ${item.vehicle_name || 'Bilinmiyor'}`,
        servicePlateNumber: item.plate_number,
        serviceVehicleName: item.vehicle_name,
        serviceStatus: item.service_status
      }));
    },
    enabled: !!userProfile?.tenant_id,
  });

  const filteredParts = parts.filter(part => 
    part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (part.code && part.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (part.serviceReference && part.serviceReference.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (part.servicePlateNumber && part.servicePlateNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleView = (part: Part) => {
    navigate(`/services/${part.serviceId}`);
  };

  const handleEdit = (part: Part) => {
    setSelectedPart(part);
    setIsModalOpen(true);
  };

  const handleDelete = async (partId: string) => {
    try {
      if (!userProfile?.tenant_id) return;
      
      console.log('Deleting part:', partId);
      
      const { error } = await supabase
        .from('service_parts')
        .delete()
        .eq('id', partId)
        .eq('tenant_id', userProfile.tenant_id);
      
      if (error) {
        console.error('Error deleting part:', error);
        throw error;
      }

      refetch();
      
      toast({
        title: "Parça silindi",
        description: "Parça başarıyla silindi.",
        variant: "default",
      });
      
    } catch (error: any) {
      console.error('Error deleting part:', error);
      toast({
        title: "Silme hatası",
        description: error.message || "Parça silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    setSelectedPart(null);
    setIsModalOpen(true);
  };

  const handleSave = async (part: Part) => {
    try {
      console.log("Saving part:", part);
      
      if (selectedPart) {
        // Update existing part - trigger otomatik olarak total_price'ı hesaplayacak
        const { error } = await supabase
          .from('service_parts')
          .update({
            part_name: part.name,
            part_code: part.code || '',
            quantity: part.quantity,
            unit_price: part.unitPrice,
            updated_at: new Date().toISOString(),
          })
          .eq('id', part.id)
          .eq('tenant_id', userProfile?.tenant_id);
        
        if (error) throw error;
        
        toast({
          title: "Parça güncellendi",
          description: "Parça başarıyla güncellendi.",
          variant: "default",
        });
      } else {
        // Add new part - trigger otomatik olarak total_price'ı hesaplayacak
        const { error } = await supabase
          .from('service_parts')
          .insert({
            id: part.id,
            service_id: part.serviceId,
            part_name: part.name,
            part_code: part.code || '',
            quantity: part.quantity,
            unit_price: part.unitPrice,
            tenant_id: userProfile?.tenant_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
        
        toast({
          title: "Parça eklendi",
          description: "Yeni parça başarıyla eklendi.",
          variant: "default",
        });
      }
      
      refetch();
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error saving part:', error);
      toast({
        title: "Kaydetme hatası",
        description: error.message || "Parça kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return {
    parts: filteredParts,
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
  };
};
