import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, UserPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Eğer kullanıcı zaten giriş yapmışsa, dashboard'a yönlendir
  if (isAuthenticated() && !loading) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Form validasyonu
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      setIsSubmitting(false);
      return;
    }

    if (password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır.');
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Önce auth sistem üzerinden kullanıcı oluştur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName
          }
        }
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Kullanıcı oluşturulamadı');
      }

      // 2. Tenant oluştur
      const { data: tenantData, error: tenantError } = await supabase
        .from('tenants')
        .insert({
          name: companyName,
          phone: phone,
          email: email
        })
        .select('id')
        .single();

      if (tenantError) {
        // Kullanıcı oluştu ama tenant oluşamadı, kullanıcıyı silmek gerekebilir
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw tenantError;
      }

      // 3. Kullanıcı metadata'sını güncelle
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          tenant_id: tenantData.id,
          role: 'admin'
        }
      });

      if (metadataError) {
        throw metadataError;
      }

      // 4. users tablosuna kayıt ekle
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          tenant_id: tenantData.id,
          email: email,
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          role: 'admin'
        });

      if (userError) {
        throw userError;
      }

      // Başarılı kayıt bildirim mesajı
      toast({
        title: 'Kayıt Başarılı',
        description: 'Hesabınız oluşturuldu. Şimdi giriş yapabilirsiniz.',
      });

      // Giriş sayfasına yönlendir
      navigate('/login');
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      setError(error.message || 'Kayıt sırasında bir hata oluştu.');
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
            <CardTitle className="text-xl">Hesap Oluştur</CardTitle>
            <CardDescription>
              Servis yönetim sisteminizi kurmak için bilgilerinizi girin
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSignup} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Ad</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Soyad</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyName">Firma Adı</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Hesap Oluştur
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2 text-center text-sm text-muted-foreground">
            <p>
              Zaten hesabınız var mı?{' '}
              <a href="/login" className="text-primary hover:underline">
                Giriş Yap
              </a>
            </p>
            <p className="mt-2">
              © 2025 Carfy - Araç Servis Takip Uygulaması
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup; 