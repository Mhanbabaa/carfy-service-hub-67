
export const Footer = () => {
  return (
    <footer className="border-t bg-background py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-primary">CARFY</h3>
            <p className="text-sm text-muted-foreground">
              Otomotiv Servis Yönetim Sistemi
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} CARFY Otomotiv. Tüm hakları saklıdır.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Güvenilir ve profesyonel servis hizmetleri
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
