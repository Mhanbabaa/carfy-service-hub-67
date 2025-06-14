
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { Search, Loader2, ArrowLeft, ChevronRight, Star, TrendingUp, Award } from "lucide-react";
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
  const [selectedLetter, setSelectedLetter] = useState<string>("");

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

  // Popular brands (you can make this dynamic later)
  const popularBrands = ['BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Ford', 'Toyota'];

  // Filter brands based on search term and selected letter
  const filteredBrands = brands.filter((brand: CarBrand) => {
    const matchesSearch = brand.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLetter = selectedLetter === "" || brand.name.charAt(0).toUpperCase() === selectedLetter;
    return matchesSearch && matchesLetter;
  });

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

  // Get letter groups for brands
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

  // Get all available letters for alphabet navigation
  const availableLetters = Array.from(new Set(brands.map((brand: CarBrand) => 
    brand.name.charAt(0).toUpperCase()
  ))).sort();

  // Animation variants
  const brandCardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.4,
        ease: "easeOut"
      }
    })
  };

  const modelCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.08,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  // Get brand logo placeholder (you can replace with actual logos later)
  const getBrandLogo = (brandName: string) => {
    return `https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=120&h=80&fit=crop&crop=center`;
  };

  // Get model image placeholder
  const getModelImage = (modelName: string, brandName: string) => {
    return `https://images.unsplash.com/photo-1549924231-f129b911e442?w=300&h=200&fit=crop&crop=center`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="space-y-8 max-w-7xl mx-auto px-6 py-8">
        {/* Hero Header */}
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-poppins font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent"
          >
            Premium Araç Koleksiyonu
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Dünyanın en prestijli otomobil markalarını ve modellerini keşfedin
          </motion.p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-2 h-12">
              <TabsTrigger value="brands" className="text-sm font-medium px-6">
                <Award className="mr-2 h-4 w-4" />
                Markalar
              </TabsTrigger>
              <TabsTrigger value="models" className="text-sm font-medium px-6" disabled={!selectedBrandId}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Modeller
                {selectedBrandId && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {getBrandName()}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="brands" className="space-y-8 mt-8">
            {/* Search and Filter Section */}
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Marka ara... (örn: BMW, Mercedes)"
                  className="pl-10 h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-primary/50 focus:ring-primary/20"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedLetter("");
                  }}
                />
              </div>

              {/* Alphabet Navigation */}
              <div className="flex flex-wrap gap-1 lg:gap-2">
                <Button
                  variant={selectedLetter === "" ? "default" : "outline"}
                  size="sm"
                  className="h-8 w-12 text-xs"
                  onClick={() => {
                    setSelectedLetter("");
                    setSearchTerm("");
                  }}
                >
                  Tümü
                </Button>
                {availableLetters.map((letter) => (
                  <Button
                    key={letter}
                    variant={selectedLetter === letter ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 text-xs p-0"
                    onClick={() => {
                      setSelectedLetter(letter);
                      setSearchTerm("");
                    }}
                  >
                    {letter}
                  </Button>
                ))}
              </div>
            </div>

            {isLoadingBrands ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">Premium markalar yükleniyor...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                {/* Popular Brands Section */}
                {selectedLetter === "" && searchTerm === "" && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
                      <h2 className="text-2xl font-poppins font-bold text-slate-800 dark:text-slate-100">
                        Popüler Markalar
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {brands
                        .filter((brand: CarBrand) => popularBrands.includes(brand.name))
                        .slice(0, 6)
                        .map((brand: CarBrand, index: number) => (
                          <motion.div
                            key={`popular-${brand.id}`}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={brandCardVariants}
                          >
                            <Card 
                              className="group cursor-pointer bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 h-full overflow-hidden"
                              onClick={() => handleSelectBrand(brand.id)}
                            >
                              <CardContent className="p-4 text-center space-y-3">
                                <div className="relative mx-auto w-16 h-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                  <img
                                    src={getBrandLogo(brand.name)}
                                    alt={brand.name}
                                    className="w-12 h-8 object-contain rounded"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      target.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                  <div className="hidden w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 rounded flex items-center justify-center">
                                    <span className="text-xs font-bold text-primary">{brand.name.charAt(0)}</span>
                                  </div>
                                </div>
                                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors duration-300">
                                  {brand.name}
                                </h3>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <ChevronRight className="h-4 w-4 text-primary mx-auto" />
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))
                      }
                    </div>
                  </motion.div>
                )}

                {/* All Brands Grid */}
                <div className="space-y-10">
                  {letterGroups.map(([letter, letterBrands], groupIndex) => (
                    <motion.div
                      key={letter}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: groupIndex * 0.1 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                          <span className="text-xl font-bold text-white">{letter}</span>
                        </div>
                        <Separator className="flex-1" />
                        <Badge variant="outline" className="text-sm">
                          {letterBrands.length} marka
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {letterBrands.map((brand: CarBrand, index: number) => (
                          <motion.div
                            key={brand.id}
                            custom={index}
                            initial="hidden"
                            animate="visible"
                            variants={brandCardVariants}
                          >
                            <Card 
                              className="group cursor-pointer bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 h-full overflow-hidden hover:-translate-y-1"
                              onClick={() => handleSelectBrand(brand.id)}
                            >
                              <CardContent className="p-5 text-center space-y-4">
                                <div className="relative mx-auto w-20 h-14 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm">
                                  <img
                                    src={getBrandLogo(brand.name)}
                                    alt={brand.name}
                                    className="w-16 h-10 object-contain rounded"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      target.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                  <div className="hidden w-full h-full bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center">
                                    <span className="text-lg font-bold text-primary">{brand.name.substring(0, 2)}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h3 className="font-semibold text-base group-hover:text-primary transition-colors duration-300">
                                    {brand.name}
                                  </h3>
                                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <div className="flex items-center justify-center gap-1 text-xs text-primary">
                                      <span>Modelleri Gör</span>
                                      <ChevronRight className="h-3 w-3" />
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ))}

                  {filteredBrands.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-20 text-center"
                    >
                      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                        <Search className="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Marka Bulunamadı</h3>
                      <p className="text-muted-foreground max-w-md">
                        Aramanıza uygun marka bulunamadı. Lütfen farklı bir arama terimi deneyin veya filtreleri sıfırlayın.
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="models" className="space-y-8 mt-8">
            {/* Models Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-800 dark:to-slate-900 rounded-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative px-8 py-12 text-white">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                  <Button 
                    variant="secondary" 
                    onClick={() => handleTabChange("brands")}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Markalara Dön
                  </Button>
                  <div className="space-y-2">
                    <h2 className="text-3xl lg:text-4xl font-poppins font-bold">
                      {getBrandName()} Koleksiyonu
                    </h2>
                    <p className="text-lg text-white/80">
                      Toplam {models.length} prestijli model listeleniyor
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {isLoadingModels ? (
              <div className="flex justify-center items-center py-20">
                <div className="text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">
                    {getBrandName()} modelleri yükleniyor...
                  </p>
                </div>
              </div>
            ) : (
              <div>
                {models.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {models.map((model: CarModel, index: number) => (
                      <motion.div
                        key={model.id}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={modelCardVariants}
                      >
                        <Card className="group cursor-pointer bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 overflow-hidden h-full hover:-translate-y-2">
                          <div className="relative h-48 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 overflow-hidden">
                            <img
                              src={getModelImage(model.name, getBrandName())}
                              alt={`${getBrandName()} ${model.name}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className="hidden absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                              <div className="text-center text-white">
                                <div className="text-3xl font-bold mb-2">{getBrandName().charAt(0)}</div>
                                <div className="text-sm">{model.name}</div>
                              </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-xl font-poppins group-hover:text-primary transition-colors duration-300">
                              {model.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {getBrandName()} • Premium Model
                            </p>
                          </CardHeader>
                          <CardFooter className="pt-0">
                            <Button 
                              variant="outline" 
                              className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
                            >
                              <div className="flex items-center justify-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                <span>Araçları Görüntüle</span>
                                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                              </div>
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                  >
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                      <TrendingUp className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Model Bulunamadı</h3>
                    <p className="text-muted-foreground max-w-md">
                      Bu markaya ait herhangi bir model bulunmuyor. Lütfen farklı bir marka seçin.
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
