import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getBrandById, getModelById } from '@/lib/vehicle-utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const BrandModelCheck: React.FC = () => {
  const [brands, setBrands] = useState<any[]>([]);
  const [models, setModels] = useState<any[]>([]);
  const [vehiclesInfo, setVehiclesInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  
  // Load brands on mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        
        // Use the client as any to bypass type checking
        const { data, error } = await (supabase as any)
          .from('car_brands')
          .select('*')
          .limit(10);
          
        if (error) {
          throw error;
        }
        
        setBrands(data || []);
      } catch (error: any) {
        console.error('Error fetching brands:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBrands();
  }, []);
  
  // Load models when brand is selected
  useEffect(() => {
    if (!selectedBrand) {
      setModels([]);
      return;
    }
    
    const fetchModels = async () => {
      try {
        setLoading(true);
        // Use the raw query method to bypass type checking
        const { data, error } = await (supabase as any)
          .from('car_models')
          .select('*')
          .eq('brand_id', selectedBrand)
          .limit(10);
          
        if (error) {
          throw error;
        }
        
        setModels(data || []);
      } catch (error: any) {
        console.error('Error fetching models:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchModels();
  }, [selectedBrand]);
  
  // Check vehicles table structure
  const checkVehiclesTable = async () => {
    try {
      setLoading(true);
      
      // Get vehicles table info using system tables
      const { data: tableInfo, error: tableError } = await (supabase as any)
        .rpc('get_table_info', { table_name: 'vehicles' });
      
      if (tableError) {
        throw tableError;
      }
      
      // Get a sample of the vehicles data
      const { data: vehiclesSample, error: sampleError } = await (supabase as any)
        .from('vehicles')
        .select('*')
        .limit(1);
        
      if (sampleError) {
        throw sampleError;
      }
      
      setVehiclesInfo({
        tableInfo,
        sampleData: vehiclesSample
      });
      
    } catch (error: any) {
      console.error('Error checking vehicles table:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectBrand = (brandId: string) => {
    setSelectedBrand(brandId);
    setSelectedModel(null);
  };
  
  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
  };
  
  const handleTestForeignKey = async () => {
    try {
      setLoading(true);
      setTestResult(null);
      
      if (!selectedBrand || !selectedModel) {
        setTestResult('Please select both a brand and a model');
        return;
      }
      
      // Test direct query to vehicles table with these IDs
      const { error: insertError } = await (supabase as any)
        .from('vehicles')
        .insert({
          brand_id: selectedBrand,
          model_id: selectedModel,
          plate_number: 'TEST123',
          customer_id: '00000000-0000-0000-0000-000000000000', // Dummy ID for test
          tenant_id: '00000000-0000-0000-0000-000000000000', // Dummy ID for test
          year: 2023,
          mileage: 0
        })
        .select()
        .single();
      
      if (insertError) {
        setTestResult(`Insert test failed: ${insertError.message}`);
        console.error('Insert error:', insertError);
        return;
      }
      
      // Test the getBrandById function
      const brand = await getBrandById(selectedBrand);
      const model = await getModelById(selectedModel);
      
      setTestResult(`
        Insert test: PASSED
        Brand check: ${brand ? 'PASSED' : 'FAILED'}, 
        Model check: ${model ? 'PASSED' : 'FAILED'}
      `);
      
      // Clean up test data
      await (supabase as any)
        .from('vehicles')
        .delete()
        .eq('plate_number', 'TEST123');
        
    } catch (error: any) {
      console.error('Test error:', error);
      setTestResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Foreign Key Issue Debugger</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-4 mb-4 bg-red-100 text-red-700 rounded-md">
            Error: {error}
          </div>
        )}
        
        {testResult && (
          <div className="p-4 mb-4 bg-blue-100 text-blue-700 rounded-md">
            {testResult}
          </div>
        )}
        
        <Tabs defaultValue="brands">
          <TabsList className="mb-4">
            <TabsTrigger value="brands">Brands & Models</TabsTrigger>
            <TabsTrigger value="vehicles" onClick={checkVehiclesTable}>Vehicles Table</TabsTrigger>
          </TabsList>
          
          <TabsContent value="brands">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-2">Car Brands</h3>
                {loading && !brands.length ? (
                  <p>Loading brands...</p>
                ) : brands.length === 0 ? (
                  <p className="text-red-500">No brands found!</p>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {brands.map(brand => (
                      <Button 
                        key={brand.id}
                        variant={selectedBrand === brand.id ? "default" : "outline"}
                        onClick={() => handleSelectBrand(brand.id)}
                        className="justify-start"
                      >
                        {brand.name} ({brand.id.substring(0, 8)}...)
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Car Models</h3>
                {!selectedBrand ? (
                  <p>Select a brand first</p>
                ) : loading && !models.length ? (
                  <p>Loading models...</p>
                ) : models.length === 0 ? (
                  <p className="text-red-500">No models found for selected brand!</p>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {models.map(model => (
                      <Button 
                        key={model.id}
                        variant={selectedModel === model.id ? "default" : "outline"}
                        onClick={() => handleSelectModel(model.id)}
                        className="justify-start"
                      >
                        {model.name} ({model.id.substring(0, 8)}...)
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                onClick={handleTestForeignKey}
                disabled={!selectedBrand || !selectedModel || loading}
                className="w-full"
              >
                Test Foreign Key Relationship
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="vehicles">
            <div className="space-y-4">
              <h3 className="font-medium">Vehicles Table Structure</h3>
              
              {loading ? (
                <p>Loading vehicles table info...</p>
              ) : vehiclesInfo ? (
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-md overflow-auto">
                    <pre className="text-xs">{JSON.stringify(vehiclesInfo, null, 2)}</pre>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Key fields to check:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>brand_id:</strong> Check that this field exists and has a foreign key to car_brands</li>
                      <li><strong>model_id:</strong> Check that this field exists and has a foreign key to car_models</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <Button onClick={checkVehiclesTable}>Check Vehicles Table</Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>This tool tests if the car_brands, car_models, and vehicles tables are properly set up with correct foreign key relationships.</p>
          <p>If you see "Foreign key constraint violation" errors, it means the tables aren't properly linked or there's a data inconsistency.</p>
        </div>
      </CardContent>
    </Card>
  );
}; 