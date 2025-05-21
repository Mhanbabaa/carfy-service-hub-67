import React, { useEffect } from "react";
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
import { Customer } from "@/types/database.types";
import { useIsMobile } from "@/hooks/use-mobile";

interface CustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
  onSave: (customer: Customer, isNew: boolean) => void;
}

// Mock car brands and models data
const carBrands = [
  { value: "toyota", label: "Toyota" },
  { value: "ford", label: "Ford" },
  { value: "honda", label: "Honda" },
  { value: "bmw", label: "BMW" },
  { value: "mercedes", label: "Mercedes" },
  { value: "audi", label: "Audi" },
  { value: "volkswagen", label: "Volkswagen" },
];

const carModelsByBrand: Record<string, { value: string; label: string }[]> = {
  toyota: [
    { value: "corolla", label: "Corolla" },
    { value: "camry", label: "Camry" },
    { value: "rav4", label: "RAV4" },
  ],
  ford: [
    { value: "focus", label: "Focus" },
    { value: "fiesta", label: "Fiesta" },
    { value: "mustang", label: "Mustang" },
  ],
  honda: [
    { value: "civic", label: "Civic" },
    { value: "accord", label: "Accord" },
    { value: "crv", label: "CR-V" },
  ],
  bmw: [
    { value: "3-series", label: "3 Series" },
    { value: "5-series", label: "5 Series" },
    { value: "x5", label: "X5" },
  ],
  mercedes: [
    { value: "c-class", label: "C-Class" },
    { value: "e-class", label: "E-Class" },
    { value: "s-class", label: "S-Class" },
  ],
  audi: [
    { value: "a3", label: "A3" },
    { value: "a4", label: "A4" },
    { value: "q5", label: "Q5" },
  ],
  volkswagen: [
    { value: "golf", label: "Golf" },
    { value: "passat", label: "Passat" },
    { value: "tiguan", label: "Tiguan" },
  ],
};

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

export const CustomerModal = ({ open, onOpenChange, customer, onSave }: CustomerModalProps) => {
  const isMobile = useIsMobile();
  const isNewCustomer = !customer;
  
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
  
  // Update form values when customer changes
  useEffect(() => {
    if (customer) {
      form.reset({
        firstName: customer.first_name,
        lastName: customer.last_name,
        phone: customer.phone,
        email: customer.email || "",
        address: customer.address || "",
        // In a real app, you would fetch vehicle details for this customer
        licensePlate: "34ABC123",
        chassisNumber: "WVWZZZ1KZAW123456",
        brand: "volkswagen",
        model: "golf",
        year: "2020",
        mileage: "45000",
        underWarranty: true,
      });
    } else {
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
    }
  }, [customer, form]);
  
  // Handle form submission
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const savedCustomer: Customer = {
      id: customer?.id || "temp-id",
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      email: data.email || "",
      address: data.address || "",
      tenant_id: customer?.tenant_id || "",
      created_at: customer?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    onSave(savedCustomer, isNewCustomer);
  };
  
  // Selected brand to filter models
  const selectedBrand = form.watch("brand");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0">
        <DialogHeader className="p-6 border-b">
          <DialogTitle className="text-xl font-poppins">
            {isNewCustomer ? "Yeni Müşteri Ekle" : "Müşteri Düzenle"}
          </DialogTitle>
        </DialogHeader>
        
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
                            {carBrands.map((brand) => (
                              <option key={brand.value} value={brand.value}>
                                {brand.label}
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
                            disabled={!selectedBrand}
                          >
                            <option value="" disabled>Seçiniz</option>
                            {selectedBrand &&
                              carModelsByBrand[selectedBrand]?.map((model) => (
                                <option key={model.value} value={model.value}>
                                  {model.label}
                                </option>
                              ))}
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
                            {...field}
                            type="number"
                            placeholder="45000"
                            min="0"
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
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Garanti Kapsamında</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Araç halen üretici garantisi altında mı?
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
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
      </DialogContent>
    </Dialog>
  );
};
