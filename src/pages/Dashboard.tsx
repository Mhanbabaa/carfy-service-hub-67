
import { Car, CreditCard, Users, Wrench } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { RevenueChart } from "@/components/revenue-chart";
import { DailySchedules } from "@/components/daily-schedules";
import { RecentServices } from "@/components/recent-services";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Servis Paneli</h1>
        <p className="text-muted-foreground">
          Servis işlemlerinizi ve istatistiklerinizi görüntüleyin
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Aktif Araçlar"
          value="24"
          icon={<Car className="h-4 w-4" />}
          description="Şu anda serviste bulunan araçlar"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Bu Ayki Araç Sayısı"
          value="128"
          icon={<Wrench className="h-4 w-4" />}
          description="Bu ay servise gelen araç sayısı"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Müşteriler"
          value="543"
          icon={<Users className="h-4 w-4" />}
          description="Toplam kayıtlı müşteri sayısı"
          trend={{ value: 4, isPositive: true }}
        />
        <StatCard
          title="Toplam Gelir"
          value="₺79,530"
          icon={<CreditCard className="h-4 w-4" />}
          description="Bu ayki toplam gelir"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <RevenueChart />
        <DailySchedules />
      </div>

      <RecentServices />
    </div>
  );
}
