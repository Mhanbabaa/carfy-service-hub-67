
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface DailySchedulesProps {
  className?: string;
}

// Sample data - in a real app this would come from an API
const schedules = [
  {
    id: 1,
    time: "09:00",
    customer: "Ali Vural",
    service: "Yağ Değişimi",
    vehicle: "BMW 320i - 34 AB 1234",
    assigned: "Mehmet Teknisyen",
    status: "bekliyor" as const,
  },
  {
    id: 2,
    time: "10:30",
    customer: "Ayşe Kaya",
    service: "Fren Bakımı",
    vehicle: "Ford Focus - 34 CD 5678",
    assigned: "Ahmet Teknisyen",
    status: "işlemde" as const,
  },
  {
    id: 3,
    time: "13:15",
    customer: "Mustafa Şahin",
    service: "Periyodik Bakım",
    vehicle: "Mercedes C180 - 34 EF 9012",
    assigned: "Hasan Teknisyen",
    status: "tamamlandı" as const,
  },
  {
    id: 4,
    time: "15:45",
    customer: "Zeynep Demir",
    service: "Lastik Değişimi",
    vehicle: "Audi A3 - 34 GH 3456",
    assigned: "Ali Teknisyen",
    status: "bekliyor" as const,
  },
];

const getStatusStyle = (status: "bekliyor" | "işlemde" | "tamamlandı") => {
  switch (status) {
    case "bekliyor":
      return "bg-amber-500/10 text-amber-500 border-amber-500";
    case "işlemde":
      return "bg-blue-500/10 text-blue-500 border-blue-500";
    case "tamamlandı":
      return "bg-green-500/10 text-green-500 border-green-500";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500";
  }
};

const getStatusText = (status: "bekliyor" | "işlemde" | "tamamlandı") => {
  switch (status) {
    case "bekliyor":
      return "Bekliyor";
    case "işlemde":
      return "İşlemde";
    case "tamamlandı":
      return "Tamamlandı";
    default:
      return "Bilinmiyor";
  }
};

export function DailySchedules({ className }: DailySchedulesProps) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle>Günlük Randevular</CardTitle>
        <CardDescription>{formattedDate} için planlanmış randevular</CardDescription>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-[400px] space-y-4">
        {schedules.map((schedule) => (
          <div 
            key={schedule.id} 
            className="flex items-start space-x-3 p-3 rounded-md bg-accent/50 transition-all duration-200 hover:bg-accent"
          >
            <div className="flex flex-col items-center justify-center">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary font-medium">
                {schedule.time}
              </Badge>
              <Clock className="h-3 w-3 mt-1 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="font-medium font-poppins">{schedule.vehicle}</div>
                <Badge variant="outline" className={cn(getStatusStyle(schedule.status))}>
                  {getStatusText(schedule.status)}
                </Badge>
              </div>
              <div className="text-sm">
                {schedule.customer} · {schedule.service}
              </div>
              <div className="text-xs text-muted-foreground">
                Teknisyen: {schedule.assigned}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
