import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, isAuthenticated, loading, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await signIn(email, password);
      
      // Navigation will be handled by AuthRedirect component
      // If the user must change password, they'll be redirected to /change-password
      // Otherwise, they'll go to /dashboard
    } catch (error: any) {
      setError(error.message || 'Giriş yaparken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already authenticated, redirect based on password change requirement
  if (isAuthenticated() && !loading) {
    if (user?.user_metadata?.must_change_password === true) {
      return <Navigate to="/change-password" replace />;
    }
    return <Navigate to="/dashboard" replace />;
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
            <CardTitle className="text-xl">Hoş geldiniz</CardTitle>
            <CardDescription>
              Hesabınıza giriş yapın
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="login">Giriş</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ornek@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Şifre</Label>
                      <a href="#" className="text-sm text-primary hover:underline">
                        Şifremi Unuttum
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
                    {isSubmitting || loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Giriş Yapılıyor...
                      </>
                    ) : (
                      'Giriş Yap'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
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

export default Login;
