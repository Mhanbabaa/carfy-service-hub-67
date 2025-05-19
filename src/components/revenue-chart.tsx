
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface RevenueChartProps {
  className?: string;
}

// Örnek veri - gerçek uygulamada API'den gelecektir
const data = [
  {
    month: "Oca",
    gelir: 35400,
  },
  {
    month: "Şub",
    gelir: 28000,
  },
  {
    month: "Mar",
    gelir: 32000,
  },
  {
    month: "Nis",
    gelir: 39000,
  },
  {
    month: "May",
    gelir: 42000,
  },
  {
    month: "Haz",
    gelir: 43543,
  },
];

// Formatters
const moneyFormatter = (value: number) => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function RevenueChart({ className }: RevenueChartProps) {
  const chartConfig = {
    gelir: {
      label: "Gelir",
      theme: {
        light: "#7C3AED",
        dark: "#8B5CF6",
      },
    },
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle>Gelir Analizi</CardTitle>
        <CardDescription>Aylık</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ChartContainer className="h-full" config={chartConfig}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tickFormatter={moneyFormatter}
              width={80}
              tickMargin={8}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  return (
                    <ChartTooltipContent
                      payload={payload}
                      labelFormatter={(label) => `${label} Ayı`}
                      formatter={(value) => moneyFormatter(value as number)}
                    />
                  );
                }
                return null;
              }}
            />
            <defs>
              <linearGradient id="colorGelir" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="gelir"
              stroke="#7C3AED"
              fillOpacity={1}
              fill="url(#colorGelir)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
