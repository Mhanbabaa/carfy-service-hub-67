
import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, KeyRound, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, mustChangePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // İlk girişte zorunlu şifre değiştirme kontrolü
  const isForceChange = mustChangePassword();

  // Eğer authentication yüklenmiyorsa ve giriş yapmış ama zorunlu şifre değiştirme gerektirmiyorsa dashboard'a yönlendir
  useEffect(() => {
    if (!loading && isAuthenticated() && !isForceChange && location.pathname === '/change-password') {
      // Eğer kullanıcı normal şekilde bu sayfaya geldiyse, geri dönüş butonunu göster
    }
  }, [loading, isAuthenticated, isForceChange, navigate]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Şifre doğrulamaları
    if (!isForceChange && !currentPassword) {
      setError('Mevcut şifrenizi girmeniz gerekiyor.');
      setIsSubmitting(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('Yeni şifre en az 8 karakter olmalıdır.');
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Yeni şifreler eşleşmiyor.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Eğer zorunlu değişim değilse, önce mevcut şifreyi kontrol et
      if (!isForceChange) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user?.email || '',
          password: currentPassword
        });

        if (signInError) {
          setError('Mevcut şifreniz yanlış.');
          setIsSubmitting(false);
          return;
        }
      }

      // Şifreyi güncelle
      const { error } = await supabase.auth.updateUser({ 
        password: newPassword 
      });

      if (error) {
        throw error;
      }

      toast({
        title: 'Şifre değiştirildi',
        description: 'Şifreniz başarıyla güncellendi.',
      });

      // Dashboard'a yönlendir
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Şifre değiştirilirken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading durumu
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Giriş yapmamışsa login'e yönlendir
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Zorunlu şifre değiştirme sayfası (ilk giriş)
  if (isForceChange) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/30">
        <div className="w-full max-w-md px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Carfy</h1>
            <p className="text-muted-foreground mt-2">Araç Servis Takip Uygulaması</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Şifre Değiştirme</CardTitle>
              <CardDescription>
                İlk girişinizde şifrenizi değiştirmeniz gerekmektedir.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleChangePassword} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Yeni Şifre</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="En az 8 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Şifrenizi tekrar girin"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    <>
                      <KeyRound className="mr-2 h-4 w-4" />
                      Şifremi Değiştir
                    </>
                  )}
                </Button>
              </form>
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
  }

  // Normal şifre değiştirme sayfası
  return (
    <div className="container mx-auto max-w-2xl py-6">
      <div className="mb-6 flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Şifre Değiştir</h1>
          <p className="text-muted-foreground">Hesap güvenliğiniz için şifrenizi değiştirin.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Şifre Güncelleme
          </CardTitle>
          <CardDescription>
            Güvenliğiniz için mevcut şifrenizi girin ve yeni şifrenizi belirleyin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mevcut Şifre</Label>
              <Input
                id="currentPassword"
                type="password"
                placeholder="Mevcut şifrenizi girin"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Yeni Şifre</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="En az 8 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Yeni Şifre Tekrar</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Yeni şifrenizi tekrar girin"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            onClick={handleChangePassword}
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Güncelleniyor...
              </>
            ) : (
              <>
                <KeyRound className="mr-2 h-4 w-4" />
                Şifreyi Güncelle
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChangePassword;
