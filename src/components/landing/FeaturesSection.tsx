export const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container">
        {/* First Feature Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          {/* Left: Text */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold font-poppins">Tüm Servis Süreçlerinizi Tek Platformda Yönetin</h2>
            <div className="h-1 w-20 bg-primary rounded-full"></div>
            <p className="text-muted-foreground">
              Araç kabulünden teslime kadar tüm servis süreçlerinizi dijital ortamda takip edin. Müşteri bilgileri, araç detayları, servis geçmişi ve daha fazlası tek bir platformda.
            </p>
          </div>
          {/* Right: New First Image (changed) */}
          <div className="rounded-xl overflow-hidden shadow-lg border">
            <img
              src="/lovable-uploads/ea0d6a96-4fc1-461e-ab51-dd602ed578e4.png"
              alt="Tüm Servis Süreçleri Tek Platformda"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Second Feature Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          {/* Left: Image (Araç ve Müşteri Takibi) */}
          <div className="rounded-xl overflow-hidden shadow-lg border md:order-1 order-2">
            <img
              src="/lovable-uploads/315684ae-3c8c-4737-9fea-3d6f8e250541.png"
              alt="Araç Servis Yönetimi - Tablet Kullanımı"
              className="w-full h-auto"
            />
          </div>
          {/* Right: Text */}
          <div className="space-y-6 md:order-2 order-1">
            <h2 className="text-3xl font-semibold font-poppins">Araç ve Müşteri Takibi</h2>
            <div className="h-1 w-20 bg-primary rounded-full"></div>
            <p className="text-muted-foreground">
              Müşteri ve araç bilgilerini kolayca kaydedin, güncelleyin ve yönetin. Araç geçmişini anında görüntüleyin, müşteri iletişimini güçlendirin.
            </p>
          </div>
        </div>

        {/* Third Feature Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          {/* Left: Text */}
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold font-poppins">Servis İşlemleri ve Parça Yönetimi</h2>
            <div className="h-1 w-20 bg-primary rounded-full"></div>
            <p className="text-muted-foreground">
              Servis işlemlerini detaylı olarak kaydedin, parça kullanımını takip edin. Teknisyen atamaları, durum güncellemeleri ve fiyatlandırma tek bir ekranda.
            </p>
          </div>
          {/* Right: Mobile Analytics image */}
          <div className="rounded-xl overflow-hidden shadow-lg border">
            <img
              src="/lovable-uploads/798dc57e-8d0e-482a-bb63-7a932a2e2fbc.png"
              alt="Servis Analitikleri - Mobil Dashboard Görünümü"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
