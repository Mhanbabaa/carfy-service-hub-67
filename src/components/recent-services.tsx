
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Sample data - in a real app this would come from an API
const recentServices = [
  {
    id: "SRV-123",
    plate: "34 ABC 123",
    customer: "Ahmet Yılmaz",
    model: "Renault Clio",
    date: "19 May 2025",
    status: "active",
    price: "₺1,850",
  },
  {
    id: "SRV-122",
    plate: "34 XYZ 456",
    customer: "Ayşe Kaya",
    model: "Ford Focus",
    date: "18 May 2025",
    status: "completed",
    price: "₺2,340",
  },
  {
    id: "SRV-121",
    plate: "06 DEF 789",
    customer: "Mehmet Demir",
    model: "Toyota Corolla",
    date: "17 May 2025",
    status: "pending",
    price: "₺3,120",
  },
  {
    id: "SRV-120",
    plate: "35 GHI 101",
    customer: "Zeynep Şahin",
    model: "Honda Civic",
    date: "17 May 2025",
    status: "cancelled",
    price: "₺950",
  },
];

export function RecentServices() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Son Servis İşlemleri</CardTitle>
        <CardDescription>Son 5 servis kaydını görüntüle</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Servis ID</TableHead>
              <TableHead>Plaka</TableHead>
              <TableHead>Müşteri</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead className="text-right">Tutar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.id}</TableCell>
                <TableCell>{service.plate}</TableCell>
                <TableCell>{service.customer}</TableCell>
                <TableCell>{service.model}</TableCell>
                <TableCell>{service.date}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      "capitalize",
                      service.status === "active" && "border-status-active text-status-active",
                      service.status === "pending" && "border-status-pending text-status-pending",
                      service.status === "cancelled" && "border-status-cancelled text-status-cancelled",
                      service.status === "completed" && "border-muted text-muted-foreground"
                    )}
                  >
                    {service.status === "active" && "Aktif"}
                    {service.status === "pending" && "Bekliyor"}
                    {service.status === "cancelled" && "İptal"}
                    {service.status === "completed" && "Tamamlandı"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{service.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
