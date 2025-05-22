import { useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid';
import { Part } from "@/types/part";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface PartsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  part: Part | null;
  onSave: (part: Part) => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Parça adı gereklidir"),
  code: z.string().optional(),
  quantity: z.coerce.number().min(1, "Adet en az 1 olmalıdır"),
  unitPrice: z.coerce.number().min(0, "Birim fiyat 0 veya daha büyük olmalıdır"),
  serviceId: z.string().min(1, "Servis seçimi gereklidir")
});

export const PartsModal = ({ open, onOpenChange, part, onSave }: PartsModalProps) => {
  const { userProfile } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Service detaylarını yükle
  useEffect(() => {
    const fetchServices = async () => {
      if (!userProfile?.tenant_id) return;
      
      setIsLoading(true);
      try {
        // Service_details görünümünden yükle (vehicle ve customer detayları var)
        const { data, error } = await supabase
          .from('service_details')
          .select('*')
          .eq('tenant_id', userProfile.tenant_id);
          
        if (error) {
          console.error('Error fetching services:', error);
          return;
        }
        
        console.log('Services data from service_details:', data);
        setServices(data || []);
      } catch (e) {
        console.error('Error in fetchServices:', e);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, [userProfile?.tenant_id, open]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      quantity: 1,
      unitPrice: 0,
      serviceId: ""
    }
  });

  // Update form values when part changes
  useEffect(() => {
    if (part) {
      form.reset({
        name: part.name,
        code: part.code || "",
        quantity: part.quantity,
        unitPrice: part.unitPrice,
        serviceId: part.serviceId
      });
    } else {
      form.reset({
        name: "",
        code: "",
        quantity: 1,
        unitPrice: 0,
        serviceId: ""
      });
    }
  }, [part, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const service = services.find(service => service.id === data.serviceId);
    if (!service) return;
    
    const updatedPart: Part = {
      id: part?.id || uuidv4(),
      name: data.name,
      code: data.code || null,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      serviceId: data.serviceId,
      serviceReference: `${service.plate_number || 'Bilinmiyor'} - ${service.brand_name || ''} ${service.model_name || ''}`
    };
    
    onSave(updatedPart);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {part ? "Parça Düzenle" : "Yeni Parça Ekle"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parça Adı <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Parça adı" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parça Kodu</FormLabel>
                  <FormControl>
                    <Input placeholder="Parça kodu (opsiyonel)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adet <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birim Fiyat (₺) <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="number" min={0} step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Servis <span className="text-destructive">*</span></FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Servis seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoading ? (
                        <SelectItem value="loading" disabled>Yükleniyor...</SelectItem>
                      ) : services.length === 0 ? (
                        <SelectItem value="empty" disabled>Servis bulunamadı</SelectItem>
                      ) : (
                        services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.plate_number || 'Plaka Yok'} - {service.brand_name || ''} {service.model_name || ''}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-4 border rounded-md bg-muted/20">
              <div className="text-sm font-medium mb-2">Ön İzleme</div>
              <div className="grid gap-1">
                <div className="text-muted-foreground text-xs">
                  Toplam Fiyat: {formatCurrency(form.watch("quantity") * form.watch("unitPrice"))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
