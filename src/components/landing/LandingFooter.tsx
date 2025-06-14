
import { CarFront } from "lucide-react";

export const LandingFooter = () => {
  return (
    <footer className="bg-muted py-12 border-t">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center text-primary mb-4">
              <CarFront className="h-6 w-6" />
              <span className="ml-2 text-xl font-bold font-poppins">Carfy</span>
            </div>
            <p className="text-muted-foreground">
              Araç servis yönetimi için eksiksiz dijital çözüm.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Ürün</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-muted-foreground hover:text-foreground">Özellikler</a></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-foreground">Fiyatlandırma</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Güncellemeler</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">SSS</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Şirket</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Hakkımızda</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Kariyer</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
              <li><a href="#contact" className="text-muted-foreground hover:text-foreground">İletişim</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Yasal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Kullanım Şartları</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Gizlilik Politikası</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">KVKK</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row md:justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2025 Carfy. Tüm hakları saklıdır.
          </div>
          <div className="flex space-x-4">
            <select className="bg-transparent text-sm border rounded px-2 py-1">
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};
