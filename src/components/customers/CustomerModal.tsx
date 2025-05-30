import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Customer, normalizeCustomer, VehicleData } from "@/types/customer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { Loader2 } from "lucide-react";

interface CustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onSave: (customer: Customer, isNew: boolean) => void;
}

// Years array for the dropdown
const years = Array.from({ length: 31 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { value: year.toString(), label: year.toString() };
});

// Form schema with validation
const formSchema = z.object({
  firstName: z.string().min(2, { message: "Ad en az 2 karakter olmalıdır." }),
  lastName: z.string().min(2, { message: "Soyad en az 2 karakter olmalıdır." }),
  phone: z.string().min(10, { message: "Geçerli bir telefon numarası giriniz." }),
  email: z
    .string()
    .email({ message: "Geçerli bir e-posta adresi giriniz." })
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  
  // Vehicle information
  licensePlate: z.string().min(5, { message: "Geçerli bir plaka giriniz." }),
  chassisNumber: z.string().optional(),
  brand: z.string().min(1, { message: "Marka seçiniz." }),
  model: z.string().min(1, { message: "Model seçiniz." }),
  year: z.string().min(4, { message: "Yıl seçiniz." }),
  mileage: z.string().min(1, { message: "Kilometre giriniz." }),
  underWarranty: z.boolean().default(false),
});

export const CustomerModal: React.FC<CustomerModalProps> = ({
  open,
  onOpenChange,
  customer,
  onSave,
}) => {
  const isMobile = useIsMobile();
  const isNewCustomer = !customer;
  const [vehicleId, setVehicleId] = useState<string | undefined>(undefined);
  
  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      address: "",
      licensePlate: "",
      chassisNumber: "",
      brand: "",
      model: "",
      year: "",
      mileage: "",
      underWarranty: false,
    },
  });
  
  // Get the selected brand for model filtering
  const selectedBrandId = form.watch("brand");
  
  // Fetch vehicle data for this customer if it exists
  const { data: vehiclesData, isLoading: isLoadingVehicles } = useSupabaseQuery(
    'vehicles',
    {
      filter: { customer_id: customer?.id },
      enabled: !!customer?.id,
      queryKey: ['vehicles', customer?.id]
    }
  );
  
  // Fetch brands from the database
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
  
  // Fetch models based on selected brand
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
  
  const models = modelsData?.data || [];
  
  // Update form values when customer or vehicle data changes
  useEffect(() => {
    if (!customer) {
      form.reset({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
        licensePlate: "",
        chassisNumber: "",
        brand: "",
        model: "",
        year: "",
        mileage: "",
        underWarranty: false,
      });
      setVehicleId(undefined);
      return;
    }

    // Set customer data
    const customerData = {
      firstName: customer.first_name || customer.firstName || "",
      lastName: customer.last_name || customer.lastName || "",
      phone: customer.phone || "",
      email: customer.email || "",
      address: customer.address || "",
      // Default empty vehicle fields
      licensePlate: "",
      chassisNumber: "",
      brand: "",
      model: "",
      year: "",
      mileage: "",
      underWarranty: false,
    };

    // If we have vehicles data, set the first vehicle
    if (vehiclesData?.data && vehiclesData.data.length > 0) {
      const vehicle = vehiclesData.data[0];
      setVehicleId(vehicle.id);
      
      // Update form with vehicle data
      customerData.licensePlate = vehicle.plate_number || "";
      customerData.chassisNumber = vehicle.chassis_number || "";
      customerData.brand = vehicle.brand_id || "";
      customerData.model = vehicle.model_id || "";
      customerData.year = vehicle.year?.toString() || "";
      customerData.mileage = vehicle.mileage?.toString() || "";
      customerData.underWarranty = vehicle.under_warranty || false;
    }

    form.reset(customerData);
  }, [customer, vehiclesData, form]);
  
  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Form submission data:", data);
    console.log("Selected brand ID:", data.brand);
    console.log("Selected model ID:", data.model);
    
    // Log brand info to verify it exists in the dropdown
    const selectedBrand = brands.find(b => b.id === data.brand);
    console.log("Selected brand object:", selectedBrand);
    
    // Log model info to verify it exists in the dropdown
    const selectedModel = models.find(m => m.id === data.model);
    console.log("Selected model object:", selectedModel);
    
    // Prepare vehicle data
    const vehicleData: VehicleData = {
      id: vehicleId,
      licensePlate: data.licensePlate,
      chassisNumber: data.chassisNumber || null,
      brand: data.brand,
      model: data.model,
      year: data.year,
      mileage: data.mileage,
      underWarranty: data.underWarranty,
    };
    
    console.log("Vehicle data being sent:", vehicleData);
    
    // Prepare customer data with vehicle information
    const savedCustomer: Customer = {
      id: customer?.id || "temp-id",
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      email: data.email || "",
      address: data.address || "",
      tenant_id: customer?.tenant_id,
      created_at: customer?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      vehicle: vehicleData
    };
    
    // Use the normalizeCustomer function to ensure consistent fields
    const normalizedCustomer = normalizeCustomer({
      ...savedCustomer
    });
    
    onSave(normalizedCustomer, !customer);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-xl font-poppins">
            {isNewCustomer ? "Yeni Müşteri Ekle" : "Müşteri Düzenle"}
          </DialogTitle>
        </DialogHeader>
        
        {isLoadingVehicles && !isNewCustomer ? (
          <div className="p-6 flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Araç bilgileri yükleniyor...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-8' : 'grid-cols-2 gap-6'}`}>
                {/* Customer Information Column */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold font-poppins mb-4">Müşteri Bilgileri</h3>
                  
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Ad <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Müşteri adı" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Soyad <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Müşteri soyadı" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Telefon <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+90 5XX XXX XX XX" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-posta</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" placeholder="ornek@email.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adres</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Müşteri adresi" rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Vehicle Information Column */}
                <div className="space-y-4">
                  <h3 className="text-base font-semibold font-poppins mb-4">Araç Bilgileri</h3>
                  
                  <FormField
                    control={form.control}
                    name="licensePlate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Plaka <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="34ABC123"
                            onChange={(e) => {
                              // Convert to uppercase
                              field.onChange(e.target.value.toUpperCase());
                            }} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="chassisNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Şase No</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="WVWZZZ1KZAW123456" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Marka <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              {...field}
                            >
                              <option value="" disabled>Seçiniz</option>
                              {isLoadingBrands ? (
                                <option value="" disabled>Yükleniyor...</option>
                              ) : brands.length === 0 ? (
                                <option value="" disabled>Marka bulunamadı</option>
                              ) : (
                                brands.map((brand) => (
                                  <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                  </option>
                                ))
                              )}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Model <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              {...field}
                              disabled={!selectedBrandId}
                            >
                              <option value="" disabled>Seçiniz</option>
                              {!selectedBrandId ? (
                                <option value="" disabled>Önce marka seçiniz</option>
                              ) : isLoadingModels ? (
                                <option value="" disabled>Yükleniyor...</option>
                              ) : models.length === 0 ? (
                                <option value="" disabled>Model bulunamadı</option>
                              ) : (
                                models.map((model) => (
                                  <option key={model.id} value={model.id}>
                                    {model.name}
                                  </option>
                                ))
                              )}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Model Yılı <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                              {...field}
                            >
                              <option value="" disabled>Seçiniz</option>
                              {years.map((year) => (
                                <option key={year.value} value={year.value}>
                                  {year.label}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="mileage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Kilometre <span className="text-destructive">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              placeholder="123456"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="underWarranty"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Garanti Kapsamında</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Araç garanti kapsamında mı?
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <DialogFooter className="border-t pt-6 mt-6">
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                  İptal
                </Button>
                <Button type="submit">
                  Kaydet
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
