
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

interface ServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service | null;
  onSave: (service: Service) => void;
}

const formSchema = z.object({
  plateNumber: z.string().min(1, "Plaka no gereklidir"),
  make: z.string().min(1, "Marka gereklidir"),
  model: z.string().min(1, "Model gereklidir"),
  year: z.coerce.number().int().min(1900).max(new Date().getFullYear()),
  mileage: z.coerce.number().int().min(0),
  customerName: z.string().min(1, "Müşteri adı gereklidir"),
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plateNumber: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      mileage: 0,
      customerName: "",
      technician: "",
      status: "waiting",
      laborCost: 0,
      complaint: "",
      servicePerformed: "",
    }
  });

  // Update form values when service changes
  useEffect(() => {
    if (service) {
      form.reset({
        plateNumber: service.plateNumber,
        make: service.make,
        model: service.model,
        year: service.year,
        mileage: service.mileage,
        customerName: service.customerName,
        technician: service.technician,
        status: service.status,
        laborCost: service.laborCost,
        complaint: service.complaint,
        servicePerformed: service.servicePerformed,
      });
      setParts(service.parts);
    } else {
      form.reset({
        plateNumber: "",
        make: "",
        model: "",
        year: new Date().getFullYear(),
        mileage: 0,
        customerName: "",
        technician: "",
        status: "waiting",
        laborCost: 0,
        complaint: "",
        servicePerformed: "",
      });
      setParts([]);
    }
    setActiveTab("vehicle");
  }, [service, form]);

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

  const onSubmit = (data: FormValues) => {
    const partsCost = calculatePartsCost();
    const totalCost = data.laborCost + partsCost;
    
    const newService: Service = {
      id: service?.id || uuidv4(),
      plateNumber: data.plateNumber,
      make: data.make,
      model: data.model,
      year: data.year,
      mileage: data.mileage,
      customerName: data.customerName,
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
  const vehicles = [
    { plate: "34 AB 123", make: "Toyota", model: "Corolla", year: 2020, customer: "Ayşe Yıldız" },
    { plate: "06 CD 456", make: "Honda", model: "Civic", year: 2019, customer: "Fatma Çetin" },
    { plate: "35 EF 789", make: "Ford", model: "Focus", year: 2021, customer: "Zeynep Koç" }
  ];

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
                  <p className="text-sm text-muted-foreground">Servis işlemi yapılacak araç ve müşteri bilgilerini girin.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="plateNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Plaka No <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="34 ABC 123" 
                              {...field} 
                              onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="make"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marka <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Toyota" {...field} />
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
                          <FormLabel>Model <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Corolla" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Yıl <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="2020" 
                              {...field}
                            />
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
                          <FormLabel>Kilometre <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="50000" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Müşteri <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Ahmet Yılmaz" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {parts.map((part) => (
                            <TableRow key={part.id}>
                              <TableCell>{part.name}</TableCell>
                              <TableCell>{part.code || "-"}</TableCell>
                              <TableCell className="text-right">{part.quantity}</TableCell>
                              <TableCell className="text-right">{formatCurrency(part.unitPrice)}</TableCell>
                              <TableCell className="text-right">{formatCurrency(part.quantity * part.unitPrice)}</TableCell>
                              <TableCell>
                                <Button 
                                  type="button"
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleRemovePart(part.id)}
                                  className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                >
                                  <X className="h-4 w-4" />
                                  <span className="sr-only">Sil</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="py-6 text-center text-sm text-muted-foreground">
                        Henüz parça eklenmedi.
                      </div>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="laborCost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>İşçilik Ücreti <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              placeholder="500" 
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>TL cinsinden işçilik ücreti.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-2">
                      <Label>Parça Ücreti</Label>
                      <Input 
                        value={calculatePartsCost().toString()}
                        readOnly
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">Parça toplamı otomatik hesaplanır.</p>
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Toplam Tutar:</span>
                      <span className="text-lg font-semibold">{formatCurrency(form.getValues("laborCost") + calculatePartsCost())}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
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
