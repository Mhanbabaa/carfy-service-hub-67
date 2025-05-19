
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CarFront } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenant, setTenant] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Very basic validation
    if (!email || !password || !tenant) {
      toast({
        title: "Hata",
        description: "Lütfen tüm alanları doldurunuz",
        variant: "destructive",
      });
      return;
    }
    
    // For demo purposes, we'll just navigate to dashboard
    // In a real app, we would authenticate with an API
    toast({
      title: "Giriş başarılı",
      description: "Servis paneline yönlendiriliyorsunuz",
    });
    
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary">
              <CarFront className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Carfy</CardTitle>
          <p className="text-sm text-muted-foreground">
            Servis yönetim sistemine giriş yapın
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tenant">Servis</Label>
              <Select onValueChange={setTenant}>
                <SelectTrigger id="tenant">
                  <SelectValue placeholder="Servis seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="izmir-servis">İzmir Oto Servis</SelectItem>
                  <SelectItem value="istanbul-servis">İstanbul Oto Servis</SelectItem>
                  <SelectItem value="ankara-servis">Ankara Oto Servis</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="ornek@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Şifre</Label>
                <Button type="button" variant="link" size="sm" className="text-xs text-primary">
                  Şifremi Unuttum
                </Button>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="********" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Giriş Yap
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
