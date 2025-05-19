
import { useState } from "react";
import { Car, Check, CreditCard, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { RevenueChart } from "@/components/revenue-chart";
import { DailySchedules } from "@/components/daily-schedules";
import { RecentServices } from "@/components/recent-services";
import { DateRangePicker } from "@/components/date-range-picker";

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-poppins">Servis Paneli</h1>
          <p className="text-muted-foreground">
            Servis işlemlerinizin güncel durumunu görüntüleyin
          </p>
        </div>
        <DateRangePicker dateRange={dateRange} onChange={setDateRange} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Aktif Araçlar"
          value="24"
          icon={<Car className="h-4 w-4" />}
          description="Şu anda serviste bulunan araçlar"
          trend={{ value: 12, isPositive: true, label: "dünden" }}
        />
        <StatCard
          title="Bu Ay Teslim Edilen"
          value="128"
          icon={<Check className="h-4 w-4" />}
          description="Toplam teslim edilen araç sayısı"
          trend={{ value: 8, isPositive: true, label: "geçen aya göre" }}
        />
        <StatCard
          title="Aylık Gelir"
          value="₺43,543"
          icon={<CreditCard className="h-4 w-4" />}
          description="Toplam tamamlanan işlemler"
          trend={{ value: 8, isPositive: true, label: "geçen aya göre" }}
        />
        <StatCard
          title="Toplam Gelir"
          value="₺679,530"
          icon={<TrendingUp className="h-4 w-4" />}
          description="Yıl başından bu yana"
          trend={{ value: 15, isPositive: true, label: "geçen yıla göre" }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <RevenueChart className="md:col-span-4" />
        <DailySchedules className="md:col-span-3" />
      </div>

      <RecentServices />
    </div>
  );
}
