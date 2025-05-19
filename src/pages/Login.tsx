
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CarFront, Building, Eye, EyeOff, Lock, User } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenant, setTenant] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  
  const handleSubmit = async (e: React.FormEvent) => {
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
    
    // Simulate loading
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just navigate to dashboard
      toast({
        title: "Giriş başarılı",
        description: "Servis paneline yönlendiriliyorsunuz",
      });
      
      navigate("/");
    } catch (error) {
      toast({
        title: "Giriş başarısız",
        description: "Kullanıcı adı, şifre veya servis seçimi hatalı",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      {/* Left side - Branding and Preview */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center bg-muted/30 p-10">
        <div className="w-full max-w-xl">
          <div className="flex items-center text-primary mb-8">
            <CarFront className="h-12 w-12" />
            <span className="ml-3 text-3xl font-bold font-poppins">Carfy</span>
          </div>
          
          <h1 className="text-3xl font-bold font-poppins mb-4">
            Araç Servis Yönetimi
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Servis süreçlerinizi dijitalleştirin, müşteri memnuniyetini artırın
          </p>
          
          <div className="relative rounded-xl overflow-hidden shadow-2xl border">
            <img
              src="/placeholder.svg"
              alt="Carfy dashboard"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-black/5"></div>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <User className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm">Kolay Kullanım</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm">Güvenli Erişim</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Building className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm">Çoklu Servis</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="lg:hidden flex items-center text-primary mb-8">
          <CarFront className="h-10 w-10" />
          <span className="ml-2 text-2xl font-bold font-poppins">Carfy</span>
        </div>
        
        <div className="w-full max-w-md">
          <div className="bg-card rounded-xl shadow-lg border p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold font-poppins">Giriş Yap</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Hesabınıza erişmek için giriş yapın
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="tenant">Servis Seçin</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Select onValueChange={setTenant} value={tenant}>
                    <SelectTrigger id="tenant" className="pl-10">
                      <SelectValue placeholder="Servis seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="izmir-servis">İzmir Oto Servis</SelectItem>
                      <SelectItem value="istanbul-servis">İstanbul Oto Servis</SelectItem>
                      <SelectItem value="ankara-servis">Ankara Oto Servis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Kullanıcı Adı veya E-posta</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="kullaniciadi@ornek.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Şifre</Label>
                  <Button type="button" variant="link" size="sm" className="text-xs">
                    Şifremi Unuttum
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <label
                  htmlFor="remember"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Beni Hatırla
                </label>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Giriş Yapılıyor...
                  </div>
                ) : (
                  "Giriş Yap"
                )}
              </Button>
            </form>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Carfy. Tüm hakları saklıdır.</p>
            <div className="flex justify-center space-x-4 mt-2">
              <a href="#" className="hover:text-foreground">Yardım</a>
              <a href="#" className="hover:text-foreground">Gizlilik Politikası</a>
              <a href="#" className="hover:text-foreground">Kullanım Şartları</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
