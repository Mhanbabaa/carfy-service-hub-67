
import { CarFront } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const LandingFooter = () => {
  return (
    <footer className="bg-muted py-8 sm:py-12 border-t">
      <div className="container px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-6 sm:mb-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center text-primary mb-3 sm:mb-4">
              <CarFront className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="ml-2 text-lg sm:text-xl font-bold font-poppins">Carfy</span>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              Araç servis yönetimi için eksiksiz dijital çözüm.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Ürün</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Özellikler</a></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Fiyatlandırma</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Güncellemeler</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">SSS</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Şirket</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Hakkımızda</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Kariyer</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Blog</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-foreground text-sm transition-colors">İletişim</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Yasal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Kullanım Şartları</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Gizlilik Politikası</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">KVKK</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-6 sm:pt-8 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
          <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            © 2025 Carfy. Tüm hakları saklıdır.
          </div>
          <div className="flex items-center">
            <Select defaultValue="tr">
              <SelectTrigger className="w-28 h-8 text-xs border-muted-foreground/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tr">Türkçe</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </footer>
  );
};
