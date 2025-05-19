
import { useState, useEffect } from "react";
import { Personnel } from "@/types/personnel";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { v4 as uuidv4 } from 'uuid';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface PersonnelModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  personnel: Personnel | null;
  onSave: (personnel: Personnel) => void;
}

const formSchema = z.object({
  firstName: z.string().min(1, "Ad gereklidir"),
  lastName: z.string().min(1, "Soyad gereklidir"),
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalıdır"),
  email: z.string().email("Geçerli bir e-posta adresi girin"),
  phone: z.string().min(1, "Telefon gereklidir"),
  role: z.enum(["admin", "technician", "consultant", "accountant"], { 
    required_error: "Rol seçimi gereklidir" 
  }),
  status: z.enum(["active", "inactive"], { 
    required_error: "Durum seçimi gereklidir" 
  }),
  password: z.string().optional().refine((val) => {
    // If adding new personnel, password is required
    // If editing existing personnel, password is optional
    return true;
  }, {
    message: "Şifre gereklidir",
    path: ["password"]
  })
});

export const PersonnelModal = ({ open, onOpenChange, personnel, onSave }: PersonnelModalProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      role: "technician",
      status: "active",
      password: ""
    }
  });

  // Update form values when personnel changes
  useEffect(() => {
    if (personnel) {
      form.reset({
        firstName: personnel.firstName,
        lastName: personnel.lastName,
        username: personnel.username,
        email: personnel.email,
        phone: personnel.phone,
        role: personnel.role,
        status: personnel.status,
        password: ""
      });
    } else {
      form.reset({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phone: "",
        role: "technician",
        status: "active",
        password: ""
      });
    }
  }, [personnel, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const updatedPersonnel: Personnel = {
      id: personnel?.id || uuidv4(),
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      email: data.email,
      phone: data.phone,
      role: data.role,
      status: data.status,
      createdAt: personnel?.createdAt || new Date()
    };
    
    onSave(updatedPersonnel);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {personnel ? "Personel Düzenle" : "Yeni Personel Ekle"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Ad" {...field} />
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
                    <FormLabel>Soyad <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Soyad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kullanıcı Adı <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Kullanıcı adı" {...field} />
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
                  <FormLabel>E-posta <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="E-posta" {...field} />
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
                  <FormLabel>Telefon <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="Telefon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Şifre {!personnel && <span className="text-destructive">*</span>}
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder={personnel ? "Boş bırakılırsa şifre değişmez" : "Şifre"} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol <span className="text-destructive">*</span></FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Rol seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Yönetici</SelectItem>
                        <SelectItem value="technician">Teknisyen</SelectItem>
                        <SelectItem value="consultant">Danışman</SelectItem>
                        <SelectItem value="accountant">Muhasebe</SelectItem>
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
                  <FormItem className="flex flex-col">
                    <FormLabel>Durum</FormLabel>
                    <div className="flex items-center gap-2 h-10 pt-2">
                      <FormControl>
                        <Switch 
                          checked={field.value === "active"} 
                          onCheckedChange={(checked) => 
                            field.onChange(checked ? "active" : "inactive")
                          } 
                        />
                      </FormControl>
                      <span>{field.value === "active" ? "Aktif" : "Pasif"}</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
