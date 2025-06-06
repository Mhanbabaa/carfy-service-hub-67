
import { useEffect, useState } from "react";
import { Service, ServicePart, ServiceStatus, getStatusLabel } from "@/types/service";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { v4 as uuidv4 } from 'uuid';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { useAuth } from "@/contexts/AuthContext";
import { Combobox } from "@/components/ui/combobox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  onSave: (service: Service) => void;
}

const formSchema = z.object({
  vehicleId: z.string().min(1, "Araç seçiniz"),
  technician: z.string().min(1, "Teknisyen gereklidir"),
  status: z.string().min(1, "Durum gereklidir"),
  laborCost: z.coerce.number().min(0),
  complaint: z.string(),
  servicePerformed: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export const ServiceModal = ({ 
  open, 
  onOpenChange, 
  service, 
  onSave 
}: ServiceModalProps) => {
  const [activeTab, setActiveTab] = useState("vehicle");
  const [parts, setParts] = useState<ServicePart[]>([]);
  const [newPart, setNewPart] = useState({
    name: "",
    code: "",
    quantity: 1,
    unitPrice: 0
  });
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleId: "",
      technician: "",
      status: "waiting",
      laborCost: 0,
      complaint: "",
      servicePerformed: "",
    }
  });
  
  // Fetch vehicles for dropdown
  const { data: vehiclesData, isLoading: isLoadingVehicles } = useSupabaseQuery(
    'vehicle_details',
    {
      filter: { tenant_id: userProfile?.tenant_id },
      enabled: !!userProfile?.tenant_id,
      queryKey: ['vehicles_dropdown', userProfile?.tenant_id]
    }
  );
  
  const vehicles = vehiclesData?.data || [];
  
  // Get selected vehicle information
  const selectedVehicleId = form.watch("vehicleId");
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);

  // Load parts when editing a service
  const loadServiceParts = async (serviceId: string) => {
    try {
      const { data, error } = await supabase
        .from('service_parts')
        .select('*')
        .eq('service_id', serviceId)
        .eq('tenant_id', userProfile?.tenant_id);
      
      if (error) {
        console.error('Error loading service parts:', error);
        return;
      }
      
      const serviceParts = data.map(part => ({
        id: part.id,
        name: part.part_name,
        code: part.part_code,
        quantity: part.quantity,
        unitPrice: part.unit_price
      }));
      
      setParts(serviceParts);
    } catch (error) {
      console.error('Error in loadServiceParts:', error);
    }
  };

  // Update form values when service changes
  useEffect(() => {
    if (service) {
      // Find the vehicle ID that corresponds to the plate number
      const vehicleId = vehicles.find(v => v.plate_number === service.plateNumber)?.id || "";
      
      form.reset({
        vehicleId,
        technician: service.technician,
        status: service.status,
        laborCost: service.laborCost,
        complaint: service.complaint,
        servicePerformed: service.servicePerformed,
      });
      
      // Load existing parts for this service
      if (service.id) {
        loadServiceParts(service.id);
      } else {
        setParts(service.parts || []);
      }
    } else {
      form.reset({
        vehicleId: "",
        technician: "",
        status: "waiting",
        laborCost: 0,
        complaint: "",
        servicePerformed: "",
      });
      setParts([]);
    }
    setActiveTab("vehicle");
  }, [service, form, vehicles]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  const calculatePartsCost = () => {
    return parts.reduce((total, part) => total + (part.quantity * part.unitPrice), 0);
  };

  const handleAddPart = () => {
    if (newPart.name && newPart.quantity > 0 && newPart.unitPrice > 0) {
      const part: ServicePart = {
        id: uuidv4(),
        name: newPart.name,
        code: newPart.code || undefined,
        quantity: newPart.quantity,
        unitPrice: newPart.unitPrice
      };
      
      // Local state'e ekle
      setParts([...parts, part]);
      setNewPart({
        name: "",
        code: "",
        quantity: 1,
        unitPrice: 0
      });
    }
  };

  const handleRemovePart = (partId: string) => {
    setParts(parts.filter(part => part.id !== partId));
  };

  const onSubmit = async (data: FormValues) => {
    const selectedVehicle = vehicles.find(v => v.id === data.vehicleId);
    if (!selectedVehicle) {
      return;
    }
    
    const partsCost = calculatePartsCost();
    const totalCost = data.laborCost + partsCost;
    
    try {
      let serviceId = service?.id || uuidv4();
      
      // Önce servisi kaydet
      const serviceData = {
        id: serviceId,
        tenant_id: userProfile?.tenant_id,
        vehicle_id: data.vehicleId,
        status: data.status as ServiceStatus,
        labor_cost: data.laborCost,
        parts_cost: partsCost,
        complaint: data.complaint,
        work_done: data.servicePerformed,
        technician_id: null,
        arrival_date: service?.arrivalDate?.toISOString() || new Date().toISOString(),
        delivery_date: service?.deliveryDate?.toISOString() || null,
        created_at: service?.arrivalDate?.toISOString() || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (service) {
        // Mevcut servisi güncelle
        const { error: serviceError } = await supabase
          .from('services')
          .update({
            status: data.status,
            labor_cost: data.laborCost,
            parts_cost: partsCost,
            complaint: data.complaint,
            work_done: data.servicePerformed,
            updated_at: new Date().toISOString(),
          })
          .eq('id', serviceId)
          .eq('tenant_id', userProfile?.tenant_id);
        
        if (serviceError) {
          console.error('Service update error:', serviceError);
          throw serviceError;
        }
      } else {
        // Yeni servis oluştur
        const { error: serviceError } = await supabase
          .from('services')
          .insert(serviceData);
        
        if (serviceError) {
          console.error('Service insert error:', serviceError);
          throw serviceError;
        }
      }

      // Mevcut parçaları sil ve yenilerini ekle
      if (service?.id) {
        const { error: deleteError } = await supabase
          .from('service_parts')
          .delete()
          .eq('service_id', serviceId)
          .eq('tenant_id', userProfile?.tenant_id);
        
        if (deleteError) {
          console.error('Error deleting existing parts:', deleteError);
        }
      }
      
      // Parçaları kaydet
      if (parts.length > 0) {
        const partsToInsert = parts.map(part => ({
          id: part.id,
          service_id: serviceId,
          part_name: part.name,
          part_code: part.code || '',
          quantity: part.quantity,
          unit_price: part.unitPrice,
          total_price: part.quantity * part.unitPrice,
          tenant_id: userProfile?.tenant_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        const { error: partsError } = await supabase
          .from('service_parts')
          .insert(partsToInsert);
        
        if (partsError) {
          console.error('Error saving parts:', partsError);
          throw partsError;
        }
      }

      // Service objesini oluştur ve parent'a gönder
      const newService: Service = {
        id: serviceId,
        vehicleId: data.vehicleId,
        plateNumber: selectedVehicle.plate_number,
        make: selectedVehicle.brand_name,
        model: selectedVehicle.model_name,
        year: selectedVehicle.year,
        mileage: selectedVehicle.mileage,
        customerName: selectedVehicle.customer_name,
        status: data.status as ServiceStatus,
        laborCost: data.laborCost,
        partsCost,
        totalCost,
        technician: data.technician,
        complaint: data.complaint,
        servicePerformed: data.servicePerformed,
        parts,
        history: service?.history || [{
          id: uuidv4(),
          date: new Date(),
          action: "Servis Kaydı Oluşturuldu",
          user: "Sistem Kullanıcısı",
          description: "Araç servise kabul edildi."
        }],
        arrivalDate: service?.arrivalDate || new Date(),
        deliveryDate: service?.deliveryDate
      };
      
      onSave(newService);
      
      toast({
        title: service ? "Servis güncellendi" : "Servis oluşturuldu",
        description: service ? "Servis işlemi başarıyla güncellendi." : "Yeni servis işlemi başarıyla oluşturuldu.",
        variant: "default",
      });
      
    } catch (error: any) {
      console.error('Error saving service:', error);
      toast({
        title: "Kaydetme hatası",
        description: error.message || "Servis işlemi kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  // Mock data for selects
  const technicians = ["Ahmet Yılmaz", "Mehmet Kaya", "Ali Öztürk", "Mustafa Demir", "Hüseyin Çelik"];
  const statuses: { value: ServiceStatus; label: string }[] = [
    { value: "waiting", label: "Bekliyor" },
    { value: "in_progress", label: "Devam Ediyor" },
    { value: "completed", label: "Tamamlandı" },
    { value: "delivered", label: "Teslim Edildi" },
    { value: "cancelled", label: "İptal Edildi" }
  ];

  // Total calculation
  const currentLaborCost = form.watch("laborCost") || 0;
  const currentPartsCost = calculatePartsCost();
  const totalCost = Number(currentLaborCost) + Number(currentPartsCost);

  // Create vehicle options for combobox
  const vehicleOptions = vehicles.map(vehicle => ({
    value: vehicle.id,
    label: `${vehicle.plate_number} - ${vehicle.brand_name} ${vehicle.model_name} (${vehicle.customer_name})`
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {service ? "Servis İşlemi Düzenle" : "Yeni Servis İşlemi Ekle"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="vehicle">Araç ve Müşteri</TabsTrigger>
                <TabsTrigger value="service">Servis Detayları</TabsTrigger>
                <TabsTrigger value="parts">Parçalar ve Ücret</TabsTrigger>
              </TabsList>
              
              <TabsContent value="vehicle" className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-poppins font-medium">Araç ve Müşteri Bilgileri</h3>
                  <p className="text-sm text-muted-foreground">Servis işlemi yapılacak araç ve müşteri bilgilerini seçin.</p>
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="vehicleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Araç Seçimi <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Combobox
                            options={vehicleOptions}
                            {...field}
                            placeholder="Plaka, marka veya müşteriye göre ara..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedVehicle && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/40 rounded-md">
                      <div>
                        <h4 className="font-medium mb-2">Araç Bilgileri</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Plaka:</span>
                            <span className="font-medium">{selectedVehicle.plate_number}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Marka/Model:</span>
                            <span className="font-medium">{selectedVehicle.brand_name} {selectedVehicle.model_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Yıl:</span>
                            <span className="font-medium">{selectedVehicle.year}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Kilometre:</span>
                            <span className="font-medium">{selectedVehicle.mileage?.toLocaleString() || 0} km</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Müşteri Bilgileri</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Müşteri:</span>
                            <span className="font-medium">{selectedVehicle.customer_name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Telefon:</span>
                            <span className="font-medium">{selectedVehicle.customer_phone || '-'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="service" className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-poppins font-medium">Servis Detayları</h3>
                  <p className="text-sm text-muted-foreground">Servis işlemi ile ilgili detayları girin.</p>
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="complaint"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Şikayet/Talep</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Müşterinin şikayeti veya talebi" 
                            className="min-h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="servicePerformed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Yapılan/Yapılacak İşlem</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Yapılan veya yapılacak olan işlemler" 
                            className="min-h-24"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="technician"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teknisyen <span className="text-destructive">*</span></FormLabel>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Teknisyen seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {technicians.map((tech) => (
                                <SelectItem key={tech} value={tech}>{tech}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Durum <span className="text-destructive">*</span></FormLabel>
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Durum seçin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {statuses.map((status) => (
                                <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="parts" className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-poppins font-medium">Parçalar ve Ücret Bilgileri</h3>
                  <p className="text-sm text-muted-foreground">Servis işleminde kullanılan parçaları ve ücret bilgilerini girin.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <Label htmlFor="partName">Parça Adı <span className="text-destructive">*</span></Label>
                      <Input 
                        id="partName"
                        placeholder="Fren balatası"
                        value={newPart.name}
                        onChange={(e) => setNewPart({...newPart, name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="partCode">Parça Kodu</Label>
                      <Input 
                        id="partCode"
                        placeholder="FB-1234"
                        value={newPart.code}
                        onChange={(e) => setNewPart({...newPart, code: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="quantity">Adet <span className="text-destructive">*</span></Label>
                        <Input 
                          id="quantity"
                          type="number"
                          min="1"
                          value={newPart.quantity}
                          onChange={(e) => setNewPart({...newPart, quantity: parseInt(e.target.value) || 1})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="unitPrice">Birim Fiyat <span className="text-destructive">*</span></Label>
                        <Input 
                          id="unitPrice"
                          type="number"
                          min="0"
                          value={newPart.unitPrice}
                          onChange={(e) => setNewPart({...newPart, unitPrice: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={handleAddPart}
                      disabled={!newPart.name || newPart.quantity < 1 || newPart.unitPrice <= 0}
                    >
                      Parça Ekle
                    </Button>
                  </div>
                  
                  <div className="border rounded-md">
                    {parts.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Parça Adı</TableHead>
                            <TableHead>Parça Kodu</TableHead>
                            <TableHead className="text-right">Adet</TableHead>
                            <TableHead className="text-right">Birim Fiyat</TableHead>
                            <TableHead className="text-right">Toplam</TableHead>
                            <TableHead className="text-right">İşlemler</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {parts.map((part) => (
                            <TableRow key={part.id}>
                              <TableCell className="font-medium">{part.name}</TableCell>
                              <TableCell className="text-muted-foreground">{part.code || "-"}</TableCell>
                              <TableCell className="text-right">{part.quantity}</TableCell>
                              <TableCell className="text-right">{formatCurrency(part.unitPrice)}</TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(part.quantity * part.unitPrice)}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemovePart(part.id)}
                                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Parçayı sil</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        Henüz parça eklenmedi.
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <FormField
                    control={form.control}
                    name="laborCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>İşçilik Ücreti (₺)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            placeholder="0.00"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="p-4 border rounded-md bg-muted/20">
                    <div className="text-sm font-medium mb-2">Maliyet Özeti</div>
                    <div className="grid gap-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">İşçilik:</span>
                        <span>{formatCurrency(currentLaborCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Parçalar:</span>
                        <span>{formatCurrency(currentPartsCost)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Toplam:</span>
                        <span>{formatCurrency(totalCost)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* Total Cost Summary - Always visible at the bottom */}
            <div className="mt-6 bg-primary/10 p-6 rounded-lg border border-primary/20">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-sm text-muted-foreground">İşçilik Ücreti</span>
                  <span className="text-lg font-semibold">{formatCurrency(Number(currentLaborCost))}</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <span className="text-sm text-muted-foreground">Parça Ücreti</span>
                  <span className="text-lg font-semibold">{formatCurrency(Number(currentPartsCost))}</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-primary/10 p-2 rounded-md">
                  <span className="text-sm font-medium">TOPLAM</span>
                  <span className="text-xl font-bold">{formatCurrency(Number(currentLaborCost) + Number(currentPartsCost))}</span>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                İptal
              </Button>
              <Button type="submit">
                {service ? "Güncelle" : "Kaydet"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
