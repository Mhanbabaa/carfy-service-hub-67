
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const PricingSection = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-20 bg-muted/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold font-poppins mb-4">Size Uygun Planı Seçin</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Her büyüklükteki servis işletmesi için uygun fiyatlandırma seçenekleri
          </p>
          <div className="inline-flex items-center rounded-full border p-1 mt-8">
            <button 
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !isYearly ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
              onClick={() => setIsYearly(false)}
            >
              Aylık
            </button>
            <button 
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isYearly ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
              onClick={() => setIsYearly(true)}
            >
              Yıllık <span className="text-xs ml-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full px-2 py-0.5">%20 indirim</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-background rounded-xl border shadow-md p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-2xl font-semibold font-poppins mb-4">Ücretsiz Plan</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-bold font-poppins">₺0</span>
              <span className="text-muted-foreground ml-1">/{isYearly ? 'yıl' : 'ay'}</span>
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
              <span className="text-4xl font-bold font-poppins">
                ₺{isYearly ? '4,799' : '499'}
              </span>
              <span className="text-muted-foreground ml-1">/{isYearly ? 'yıl' : 'ay'}</span>
              {isYearly && (
                <span className="ml-2 text-sm text-green-600 dark:text-green-400 font-medium">
                  (%20 indirim)
                </span>
              )}
            </div>
            {isYearly && (
              <div className="mb-4 text-sm text-muted-foreground">
                <span className="line-through">₺5,988</span>
                <span className="ml-2 text-green-600 dark:text-green-400">₺1,189 tasarruf</span>
              </div>
            )}
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
        </div>
      </div>
    </section>
  );
};
