
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "./theme-provider";

// Sample data - in a real app this would come from an API
const data = [
  { name: "Ocak", revenue: 5800 },
  { name: "Şubat", revenue: 7200 },
  { name: "Mart", revenue: 8100 },
  { name: "Nisan", revenue: 9000 },
  { name: "Mayıs", revenue: 9800 },
  { name: "Haziran", revenue: 12000 },
  { name: "Temmuz", revenue: 14000 },
];

export function RevenueChart() {
  const { theme } = useTheme();
  
  // Set colors based on the current theme
  const textColor = theme === "dark" ? "#e5e5e5" : "#333333";
  const gridColor = theme === "dark" ? "#333333" : "#e5e5e5";
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gelir Analizi</CardTitle>
        <CardDescription>Son 7 ay için toplam gelir analizi</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="name"
                stroke={gridColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={gridColor}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₺${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === "dark" ? "#1E1E1E" : "#FFFFFF",
                  borderColor: gridColor,
                  color: textColor
                }}
                formatter={(value) => [`₺${value}`, "Gelir"]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#7C3AED"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
