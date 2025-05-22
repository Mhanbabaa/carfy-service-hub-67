
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { Search, Loader2, ArrowLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

interface CarBrand {
  id: string;
  name: string;
}

interface CarModel {
  id: string;
  brand_id: string;
  name: string;
}

export default function BrandsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("brands");

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

  // Handle brand selection and automatically switch to models tab
  const handleSelectBrand = (brandId: string) => {
    setSelectedBrandId(brandId);
    setActiveTab("models");
  };

  const getBrandName = () => {
    if (!selectedBrandId) return "";
    const brand = brands.find((b: CarBrand) => b.id === selectedBrandId);
    return brand ? brand.name : "";
  };

  // When switching back to brands tab, clear selected brand
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "brands") {
      setSelectedBrandId(null);
    }
  };

  // Get letter groups for brands (for the alphabetic grouping)
  const getLetterGroups = () => {
    const groups: { [key: string]: CarBrand[] } = {};
    
    filteredBrands.forEach((brand: CarBrand) => {
      const firstLetter = brand.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(brand);
    });
    
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  };

  const letterGroups = getLetterGroups();

  // Animation variants for cards
  const brandCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3
      }
    })
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-poppins font-bold">Marka ve Modeller</h1>
        <p className="text-muted-foreground">Araç marka ve modellerini görüntüleyin</p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="brands" className="flex-1 sm:flex-initial">Markalar</TabsTrigger>
          <TabsTrigger value="models" className="flex-1 sm:flex-initial" disabled={!selectedBrandId}>
            Modeller {selectedBrandId && <Badge variant="secondary" className="ml-2">{getBrandName()}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brands" className="space-y-6">
          <div className="relative w-full max-w-md">
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
            <div className="space-y-10">
              {letterGroups.map(([letter, letterBrands], groupIndex) => (
                <div key={letter} className="space-y-4">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-primary">{letter}</span>
                    <Separator className="ml-4 flex-1" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {letterBrands.map((brand: CarBrand, index: number) => (
                      <motion.div
                        key={brand.id}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={brandCardVariants}
                      >
                        <Card 
                          className="cursor-pointer hover:bg-muted/50 transition-colors hover:shadow-md overflow-hidden h-full"
                          onClick={() => handleSelectBrand(brand.id)}
                        >
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="bg-primary/10 rounded-full p-2 flex-shrink-0">
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  width="24" 
                                  height="24" 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round" 
                                  className="h-5 w-5 text-primary"
                                >
                                  <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                  <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                                  <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6"></path>
                                  <path d="M15 6h-4l2 5"></path>
                                </svg>
                              </div>
                              <span className="font-medium">{brand.name}</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-primary" />
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}

              {filteredBrands.length === 0 && (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="bg-muted rounded-full p-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Marka Bulunamadı</h3>
                  <p className="mt-2 text-muted-foreground">
                    Aramanıza uygun marka bulunamadı. Lütfen farklı bir arama terimi deneyin.
                  </p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={() => handleTabChange("brands")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Markalara Dön
            </Button>
            <div>
              <h2 className="font-medium text-lg">{getBrandName()} Modelleri</h2>
              <p className="text-sm text-muted-foreground">Toplam {models.length} model listeleniyor</p>
            </div>
          </div>

          {isLoadingModels ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Modeller yükleniyor...</span>
            </div>
          ) : (
            <div>
              {models.length > 0 ? (
                <ScrollArea className="h-[calc(100vh-300px)] pr-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {models.map((model: CarModel, index: number) => (
                      <motion.div
                        key={model.id}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={brandCardVariants}
                      >
                        <Card className="overflow-hidden h-full">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{model.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <p className="text-sm text-muted-foreground">
                              {getBrandName()} {model.name}
                            </p>
                          </CardContent>
                          <CardFooter>
                            <Button variant="ghost" className="w-full justify-start px-2">
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="mr-2 h-4 w-4"
                              >
                                <path d="M19 17h2c.6 0 1-.4 1-1v-5c0-.6-.4-1-1-1h-2"></path>
                                <path d="M4 17h2"></path>
                                <path d="M10 17h4"></path>
                                <path d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v1h1c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1h-1v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1H8v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2c-.6 0-1-.4-1-1v-5c0-.6.4-1 1-1h1V8z"></path>
                              </svg>
                              Araçları Görüntüle
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <div className="bg-muted rounded-full p-4">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="h-8 w-8 text-muted-foreground"
                    >
                      <path d="M19 17h2c.6 0 1-.4 1-1v-5c0-.6-.4-1-1-1h-2"></path>
                      <path d="M4 17h2"></path>
                      <path d="M10 17h4"></path>
                      <path d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v1h1c.6 0 1 .4 1 1v5c0 .6-.4 1-1 1h-1v1a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-1H8v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2c-.6 0-1-.4-1-1v-5c0-.6.4-1 1-1h1V8z"></path>
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">Model Bulunamadı</h3>
                  <p className="mt-2 text-muted-foreground">
                    Bu markaya ait herhangi bir model bulunmuyor.
                  </p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
