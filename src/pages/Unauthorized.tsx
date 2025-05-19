
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/30 px-4">
      <div className="flex flex-col items-center text-center max-w-md">
        <div className="mb-6 p-6 bg-red-100 dark:bg-red-900/20 rounded-full">
          <ShieldAlert className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Yetkisiz Erişim</h1>
        <p className="text-muted-foreground mb-6">
          Bu sayfaya erişim yetkiniz bulunmamaktadır. Bu bir hata olduğunu düşünüyorsanız lütfen sistem yöneticinizle iletişime geçin.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => navigate(-1)}>Geri Dön</Button>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Ana Sayfaya Git
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
