
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Mevcut şifre gereklidir" }),
  newPassword: z.string().min(8, { message: "Yeni şifre en az 8 karakter olmalıdır" })
    .regex(/[A-Z]/, { message: "Şifre en az bir büyük harf içermelidir" })
    .regex(/[a-z]/, { message: "Şifre en az bir küçük harf içermelidir" })
    .regex(/[0-9]/, { message: "Şifre en az bir rakam içermelidir" }),
  confirmPassword: z.string().min(1, { message: "Şifre onayı gereklidir" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const ChangePassword: React.FC = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: PasswordFormValues) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Önce mevcut şifre ile oturum açabildiğini kontrol et
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: values.currentPassword,
      });

      if (signInError) {
        setError("Mevcut şifre hatalı. Lütfen tekrar deneyin.");
        return;
      }

      // Şifre değiştir
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.newPassword,
        data: {
          must_change_password: false,
        },
      });

      if (updateError) {
        throw updateError;
      }

      // Kullanıcı metadata'sını güncelle (must_change_password = false)
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          must_change_password: false,
        },
      });

      if (metadataError) {
        console.error("Kullanıcı metadata güncellenemedi:", metadataError);
      }

      setSuccess("Şifreniz başarıyla değiştirildi. Ana sayfaya yönlendiriliyorsunuz...");
      form.reset();

      // Başarılı bildirim
      toast({
        title: "Şifre Değiştirildi",
        description: "Şifreniz başarıyla değiştirildi.",
      });

      // Kısa bir gecikmeden sonra ana sayfaya yönlendir
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error: any) {
      setError(error.message || "Şifre değiştirilirken bir hata oluştu.");
      toast({
        variant: "destructive",
        title: "Hata",
        description: error.message || "Şifre değiştirilirken bir hata oluştu.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Carfy</h1>
          <p className="text-muted-foreground mt-2">Araç Servis Takip Uygulaması</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Şifre Değiştirme</CardTitle>
            <CardDescription>
              İlk girişinizde şifrenizi değiştirmeniz gerekmektedir
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 border-green-500 text-green-500">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mevcut Şifre</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Mevcut şifreniz" {...field} />
                      </FormControl>
                      <FormDescription>
                        Size verilen geçici şifreyi girin
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yeni Şifre</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Yeni şifreniz" {...field} />
                      </FormControl>
                      <FormDescription>
                        En az 8 karakter, bir büyük harf, bir küçük harf ve bir rakam içermeli
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Şifre Tekrar</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Yeni şifrenizi tekrar girin" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    "Şifremi Değiştir"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-center text-center text-sm text-muted-foreground">
            <p className="mt-2">
              © 2025 Carfy - Araç Servis Takip Uygulaması
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ChangePassword;
