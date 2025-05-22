import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { Search, Loader2, CarFront, ChevronRight } from "lucide-react";
import { CarBrand, CarModel } from "@/types/database.types";

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  // Fetch all brands
  const { data: brandsData, isLoading: isLoadingBrands } = useSupabaseQuery(
    'car_brands',
    {
      orderBy: 'name',
      orderDirection: 'asc',
      pageSize: 100,
      queryKey: ['car_brands']
    }
  );

  // Fetch models for selected brand
  const { data: modelsData, isLoading: isLoadingModels } = useSupabaseQuery(
    'car_models',
    {
      filter: { brand_id: selectedBrandId },
      orderBy: 'name',
      orderDirection: 'asc',
      pageSize: 500,
      enabled: !!selectedBrandId,
      queryKey: ['car_models', selectedBrandId]
    }
  );

  const brands = brandsData?.data || [];
  const models = modelsData?.data || [];

  // Filter brands based on search term
  const filteredBrands = brands.filter((brand: CarBrand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectBrand = (brandId: string) => {
    setSelectedBrandId(brandId);
  };

  const getBrandName = () => {
    if (!selectedBrandId) return "";
    const brand = brands.find((b: CarBrand) => b.id === selectedBrandId);
    return brand ? brand.name : "";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-poppins font-bold">Marka ve Modeller</h1>
        <p className="text-muted-foreground">Araç marka ve modellerini görüntüleyin</p>
      </div>

      <Tabs defaultValue="brands" className="space-y-4">
        <TabsList>
          <TabsTrigger value="brands">Markalar</TabsTrigger>
          <TabsTrigger value="models" disabled={!selectedBrandId}>Modeller</TabsTrigger>
        </TabsList>

        <TabsContent value="brands" className="space-y-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Marka ara..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoadingBrands ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Markalar yükleniyor...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredBrands.map((brand: CarBrand) => (
                <Card 
                  key={brand.id} 
                  className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedBrandId === brand.id ? 'border-primary' : ''
                  }`}
                  onClick={() => handleSelectBrand(brand.id)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <CarFront className="h-5 w-5 mr-2 text-primary" />
                      <span className="font-medium">{brand.name}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Button 
              variant="outline" 
              onClick={() => setSelectedBrandId(null)}
              className="flex items-center gap-2"
            >
              <CarFront className="h-4 w-4" />
              Tüm Markalar
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <span className="font-medium text-lg">{getBrandName()}</span>
          </div>

          {isLoadingModels ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Modeller yükleniyor...</span>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{getBrandName()} Modelleri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {models.map((model: CarModel) => (
                    <div 
                      key={model.id}
                      className="p-3 border rounded-md hover:bg-muted/50 transition-colors"
                    >
                      {model.name}
                    </div>
                  ))}
                  {models.length === 0 && (
                    <div className="col-span-full p-4 text-center text-muted-foreground">
                      Bu markaya ait model bulunamadı.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 