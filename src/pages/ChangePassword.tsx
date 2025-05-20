import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, mustChangePassword } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If not authenticated or no need to change password, redirect
  useEffect(() => {
    if (!loading && isAuthenticated() && !mustChangePassword()) {
      navigate('/dashboard');
    }
  }, [loading, isAuthenticated, mustChangePassword, navigate]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validate passwords
    if (newPassword.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır.');
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      setIsSubmitting(false);
      return;
    }
    
    try {
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

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Şifre değiştirilirken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

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
};

export default ChangePassword;
