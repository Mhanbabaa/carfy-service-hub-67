
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { CarFront, Check, ChevronRight, Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-roboto bg-background text-foreground">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center text-primary">
              <CarFront className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold font-poppins">Carfy</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Özellikler
            </a>
            <a href="#product" className="text-sm font-medium transition-colors hover:text-primary">
              Ürün
            </a>
            <a href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Fiyatlar
            </a>
            <a href="#contact" className="text-sm font-medium transition-colors hover:text-primary">
              İletişim
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button
              variant="outline"
              className="hidden md:flex"
              onClick={() => navigate("/login")}
            >
              Giriş Yap
            </Button>
            <Button
              className="hidden md:flex"
              onClick={() => navigate("/login")}
            >
              Kaydol
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed right-0 top-0 h-full w-3/4 max-w-sm bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center text-primary">
                <CarFront className="h-6 w-6" />
                <span className="ml-2 text-xl font-bold font-poppins">Carfy</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-6">
              <a 
                href="#features" 
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Özellikler
              </a>
              <a 
                href="#product" 
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ürün
              </a>
              <a 
                href="#pricing" 
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fiyatlar
              </a>
              <a 
                href="#contact" 
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                İletişim
              </a>
              <div className="flex flex-col gap-2 mt-4">
                <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
                  Giriş Yap
                </Button>
                <Button className="w-full" onClick={() => navigate("/login")}>
                  Kaydol
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 container animate-fade-in">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl font-bold font-poppins leading-tight">
                Araç Servisiniz için Eksiksiz Yönetim Çözümü
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Servis süreçlerinizi dijitalleştirin, müşteri memnuniyetini artırın ve işlerinizi daha verimli yönetin
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="text-base" onClick={() => navigate("/login")}>
                  Hemen Başlayın
                </Button>
                <Button size="lg" variant="outline" className="text-base">
                  Nasıl Çalışır
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-xl overflow-hidden shadow-2xl border">
                <img
                  src="/placeholder.svg"
                  alt="Carfy Dashboard"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-primary/10 rounded-full p-4 hidden md:block">
                <CarFront className="h-10 w-10 text-primary" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/50">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
              <div className="space-y-6">
                <h2 className="text-3xl font-semibold font-poppins">Tüm Servis Süreçlerinizi Tek Platformda Yönetin</h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
                <p className="text-muted-foreground">
                  Araç kabulünden teslime kadar tüm servis süreçlerinizi dijital ortamda takip edin. Müşteri bilgileri, araç detayları, servis geçmişi ve daha fazlası tek bir platformda.
                </p>
              </div>
              <div className="rounded-xl overflow-hidden shadow-lg border">
                <img
                  src="/placeholder.svg"
                  alt="Servis Yönetim Ekranı"
                  className="w-full h-auto"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
              <div className="rounded-xl overflow-hidden shadow-lg border md:order-1 order-2">
                <img
                  src="/placeholder.svg"
                  alt="Araç Takip Ekranı"
                  className="w-full h-auto"
                />
              </div>
              <div className="space-y-6 md:order-2 order-1">
                <h2 className="text-3xl font-semibold font-poppins">Araç ve Müşteri Takibi</h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
                <p className="text-muted-foreground">
                  Müşteri ve araç bilgilerini kolayca kaydedin, güncelleyin ve yönetin. Araç geçmişini anında görüntüleyin, müşteri iletişimini güçlendirin.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
              <div className="space-y-6">
                <h2 className="text-3xl font-semibold font-poppins">Servis İşlemleri ve Parça Yönetimi</h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
                <p className="text-muted-foreground">
                  Servis işlemlerini detaylı olarak kaydedin, parça kullanımını takip edin. Teknisyen atamaları, durum güncellemeleri ve fiyatlandırma tek bir ekranda.
                </p>
              </div>
              <div className="rounded-xl overflow-hidden shadow-lg border">
                <img
                  src="/placeholder.svg"
                  alt="Servis İşlemleri Ekranı"
                  className="w-full h-auto"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="rounded-xl overflow-hidden shadow-lg border md:order-1 order-2">
                <img
                  src="/placeholder.svg"
                  alt="Raporlar Ekranı"
                  className="w-full h-auto"
                />
              </div>
              <div className="space-y-6 md:order-2 order-1">
                <h2 className="text-3xl font-semibold font-poppins">Detaylı Raporlar ve Analizler</h2>
                <div className="h-1 w-20 bg-primary rounded-full"></div>
                <p className="text-muted-foreground">
                  İşletmenizin performansını gerçek zamanlı olarak izleyin. Gelir takibi, servis istatistikleri ve müşteri analizleri ile daha bilinçli kararlar alın.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section className="py-20">
          <div className="container text-center">
            <h2 className="text-3xl font-semibold font-poppins mb-6">Entegre Çalışan Sistemler</h2>
            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
              Carfy, kullandığınız diğer sistemlerle sorunsuz entegre olur.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-muted/30 rounded-lg p-6 flex items-center justify-center h-24">
                  <div className="text-xl font-medium text-muted-foreground">Logo {i}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold font-poppins mb-4">Size Uygun Planı Seçin</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Her büyüklükteki servis işletmesi için uygun fiyatlandırma seçenekleri
              </p>
              <div className="inline-flex items-center rounded-full border p-1 mt-8">
                <button className="rounded-full px-4 py-2 text-sm font-medium bg-primary text-primary-foreground">Aylık</button>
                <button className="rounded-full px-4 py-2 text-sm font-medium">Yıllık <span className="text-xs ml-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full px-2 py-0.5">%20 indirim</span></button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <div className="bg-background rounded-xl border shadow-md p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-semibold font-poppins mb-4">Ücretsiz Plan (Demo)</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold font-poppins">₺0</span>
                  <span className="text-muted-foreground ml-1">/ay</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {["Temel araç ve müşteri takibi", "Servis işlemleri görüntüleme", "Sınırlı raporlar", "7 günlük deneme süresi"].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
                  Ücretsiz Deneyin
                </Button>
              </div>

              {/* Standard Plan */}
              <div className="bg-background rounded-xl border shadow-md p-8 hover:shadow-lg transition-shadow relative">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-tr-xl rounded-bl-xl">
                  Önerilen
                </div>
                <h3 className="text-2xl font-semibold font-poppins mb-4">Standart Plan</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold font-poppins">₺299</span>
                  <span className="text-muted-foreground ml-1">/ay</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Tam araç ve müşteri takibi",
                    "Servis işlemleri yönetimi",
                    "Temel raporlar ve analizler",
                    "E-posta ve SMS bildirimleri",
                    "Sınırsız kullanıcı"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" onClick={() => navigate("/login")}>
                  Hemen Başlayın
                </Button>
              </div>

              {/* Premium Plan */}
              <div className="bg-background rounded-xl border shadow-md p-8 hover:shadow-lg transition-shadow">
                <h3 className="text-2xl font-semibold font-poppins mb-4">Premium Plan</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold font-poppins">₺499</span>
                  <span className="text-muted-foreground ml-1">/ay</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Standart Plan'daki tüm özellikler",
                    "Gelişmiş raporlar ve analizler",
                    "Özel dashboard",
                    "Öncelikli destek",
                    "API erişimi"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" onClick={() => navigate("/login")}>
                  Hemen Başlayın
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="container">
            <h2 className="text-3xl font-semibold font-poppins mb-12 text-center">Müşterilerimiz Ne Diyor?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Ahmet Yılmaz",
                  company: "İzmir Oto Servis",
                  comment: "Carfy sayesinde servis süreçlerimiz çok daha düzenli hale geldi. Müşterilerimiz de memnuniyetleri arttı."
                },
                {
                  name: "Ayşe Kaya",
                  company: "Kaya Otomotiv",
                  comment: "Kullanımı çok kolay bir arayüz, tüm servis işlemlerimizi tek bir platformdan yönetebiliyoruz. Kesinlikle tavsiye ederim."
                },
                {
                  name: "Mehmet Demir",
                  company: "Demir Oto",
                  comment: "Parça takibi ve servis planlaması konusunda bize çok yardımcı oluyor. Artık hiçbir işlem gözden kaçmıyor."
                }
              ].map((testimonial, i) => (
                <div key={i} className="bg-muted/30 rounded-xl p-6 shadow">
                  <div className="flex items-center mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFCA28" stroke="none">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                  <p className="italic text-muted-foreground mb-4">{testimonial.comment}</p>
                  <div className="font-medium">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-20 bg-primary/10">
          <div className="container text-center">
            <h2 className="text-3xl font-semibold font-poppins mb-6">Hemen Başlayın</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Carfy ile servis süreçlerinizi dijitalleştirin ve işletmenizi bir adım öne taşıyın.
            </p>
            <Button size="lg" className="text-base" onClick={() => navigate("/login")}>
              Ücretsiz Deneyin
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
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
    </div>
  );
}
