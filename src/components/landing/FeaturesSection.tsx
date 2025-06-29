
export const FeaturesSection = () => {
  return (
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
              src="/lovable-uploads/83c3ef35-2dc7-4a38-ac01-56480c38e741.png"
              alt="Servis Yönetim Dashboard - Mobil Analitik Takibi"
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="rounded-xl overflow-hidden shadow-lg border md:order-1 order-2">
            <img
              src="/lovable-uploads/315684ae-3c8c-4737-9fea-3d6f8e250541.png"
              alt="Araç Servis Yönetimi - Tablet Kullanımı"
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
              src="/lovable-uploads/d6e1212f-e637-43de-8ef1-446e58dcd1b0.png"
              alt="Servis İşlemleri Listesi - Durum Takibi ve Teknisyen Atamaları"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
