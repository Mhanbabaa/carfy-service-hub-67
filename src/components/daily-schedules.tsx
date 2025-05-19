
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

// Sample data - in a real app this would come from an API
const schedules = [
  {
    id: 1,
    time: "09:00",
    customer: "Ali Vural",
    service: "Yağ Değişimi",
    vehicle: "BMW 320i - 34 AB 1234",
    assigned: "Mehmet Teknisyen",
  },
  {
    id: 2,
    time: "10:30",
    customer: "Ayşe Kaya",
    service: "Fren Bakımı",
    vehicle: "Ford Focus - 34 CD 5678",
    assigned: "Ahmet Teknisyen",
  },
  {
    id: 3,
    time: "13:15",
    customer: "Mustafa Şahin",
    service: "Periyodik Bakım",
    vehicle: "Mercedes C180 - 34 EF 9012",
    assigned: "Hasan Teknisyen",
  },
  {
    id: 4,
    time: "15:45",
    customer: "Zeynep Demir",
    service: "Lastik Değişimi",
    vehicle: "Audi A3 - 34 GH 3456",
    assigned: "Ali Teknisyen",
  },
];

export function DailySchedules() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Günlük Randevular</CardTitle>
        <CardDescription>{formattedDate} için planlanmış randevular</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {schedules.map((schedule) => (
          <div 
            key={schedule.id} 
            className="flex items-start space-x-3 p-3 rounded-md bg-accent/50"
          >
            <div className="flex flex-col items-center justify-center">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary font-medium">
                {schedule.time}
              </Badge>
              <Clock className="h-3 w-3 mt-1 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <div className="font-medium">{schedule.service}</div>
              <div className="text-sm text-muted-foreground">
                {schedule.customer} · {schedule.vehicle}
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
