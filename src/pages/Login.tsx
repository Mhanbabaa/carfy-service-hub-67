
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
      console.log("Attempting to sign in with:", email);
      const result = await signIn(email, password);
      console.log("Sign in result:", result);
      
      // Navigation will be handled by AuthRedirect component
      // If the user must change password, they'll be redirected to /change-password
      // Otherwise, they'll go to /dashboard
    } catch (error: any) {
      console.error("Login error details:", error);
      
      // Handle the specific error for "supabase_auth schema does not exist" 
      if (error.message && error.message.includes("supabase_auth")) {
        setError("Sistem bakım aşamasındadır. Lütfen daha sonra tekrar deneyin veya yöneticinize başvurun.");
      } else {
        setError(error.message || 'Giriş yaparken bir hata oluştu.');
      }
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
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Carfy</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">Araç Servis Takip Uygulaması</p>
        </div>
        
        <Card className="border-0 sm:border shadow-none sm:shadow-lg">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-lg sm:text-xl">Hoş geldiniz</CardTitle>
            <CardDescription className="text-sm">
              Hesabınıza giriş yapın
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-1 h-10">
                <TabsTrigger value="login" className="text-sm">Giriş</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">{error}</AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm">E-posta</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ornek@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm">Şifre</Label>
                      <a href="#" className="text-xs sm:text-sm text-primary hover:underline">
                        Şifremi Unuttum
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-11" disabled={isSubmitting || loading}>
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
            <div className="mt-4 text-center">
              <p className="text-sm">
                Hesabınız yok mu?{' '}
                <a href="/signup" className="text-primary hover:underline">
                  Hemen Kaydolun
                </a>
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center text-center text-xs sm:text-sm text-muted-foreground px-4 sm:px-6">
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
