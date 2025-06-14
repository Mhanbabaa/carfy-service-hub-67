
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSupabaseQuery } from "@/hooks/use-supabase-query";
import { useAuth } from "@/contexts/AuthContext";

interface VehicleEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: any | null;
  onSave: (vehicle: any) => void;
}

const formSchema = z.object({
  plateNumber: z.string().min(1, "Plaka numarası gereklidir"),
  chassisNumber: z.string().optional(),
  brandId: z.string().min(1, "Marka seçiniz"),
  modelId: z.string().min(1, "Model seçiniz"),
  year: z.coerce.number().min(1900).max(2030),
  mileage: z.coerce.number().min(0),
  underWarranty: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export const VehicleEditModal = ({ 
  open, 
  onOpenChange, 
  vehicle, 
  onSave 
}: VehicleEditModalProps) => {
  const { userProfile } = useAuth();
  const [selectedBrandId, setSelectedBrandId] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      plateNumber: "",
      chassisNumber: "",
      brandId: "",
      modelId: "",
      year: new Date().getFullYear(),
      mileage: 0,
      underWarranty: false,
    }
  });

  // Fetch brands
  const { data: brandsData } = useSupabaseQuery('car_brands', {
    orderBy: 'name',
    orderDirection: 'asc',
    pageSize: 100,
  });

  // Fetch models for selected brand
  const { data: modelsData } = useSupabaseQuery('car_models', {
    filter: selectedBrandId ? { brand_id: selectedBrandId } : undefined,
    orderBy: 'name',
    orderDirection: 'asc',
    pageSize: 100,
    enabled: !!selectedBrandId,
  });

  const brands = brandsData?.data || [];
  const models = modelsData?.data || [];

  // Update form when vehicle changes
  useEffect(() => {
    if (vehicle) {
      form.reset({
        plateNumber: vehicle.plate_number || "",
        chassisNumber: vehicle.chassis_number || "",
        brandId: vehicle.brand_id || "",
        modelId: vehicle.model_id || "",
        year: vehicle.year || new Date().getFullYear(),
        mileage: vehicle.mileage || 0,
        underWarranty: vehicle.under_warranty || false,
      });
      setSelectedBrandId(vehicle.brand_id || "");
    } else {
      form.reset();
      setSelectedBrandId("");
    }
  }, [vehicle, form]);

  // Watch brand changes to update models
  const watchedBrandId = form.watch("brandId");
  useEffect(() => {
    if (watchedBrandId !== selectedBrandId) {
      setSelectedBrandId(watchedBrandId);
      form.setValue("modelId", ""); // Reset model when brand changes
    }
  }, [watchedBrandId, selectedBrandId, form]);

  const onSubmit = (data: FormValues) => {
    const updatedVehicle = {
      ...vehicle,
      plate_number: data.plateNumber,
      chassis_number: data.chassisNumber,
      brand_id: data.brandId,
      model_id: data.modelId,
      year: data.year,
      mileage: data.mileage,
      under_warranty: data.underWarranty,
    };
    
    onSave(updatedVehicle);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Araç Düzenle</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="plateNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plaka Numarası <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="34ABC123" {...field} />
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
                  <FormLabel>Şase Numarası</FormLabel>
                  <FormControl>
                    <Input placeholder="Şase numarası" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brandId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marka <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Marka seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands.map((brand: any) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model <span className="text-destructive">*</span></FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedBrandId}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Model seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {models.map((model: any) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yıl <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="number" min="1900" max="2030" {...field} />
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
                      <Input type="number" min="0" {...field} />
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
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Garanti kapsamında</FormLabel>
                  </div>
                </FormItem>
              )}
            />

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
