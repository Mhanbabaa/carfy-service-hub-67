
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface DataPoint {
  name: string;
  total: number;
  [key: string]: any;
}

export interface RevenueChartProps {
  className?: string;
  data: DataPoint[];
}

// Formatters
const moneyFormatter = (value: number) => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function RevenueChart({ className, data }: RevenueChartProps) {
  const chartConfig = {
    total: {
      label: "Gelir",
      theme: {
        light: "#7C3AED",
        dark: "#8B5CF6",
      },
    },
  };

  return (
    <Card className={cn("h-full w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle>Gelir Analizi</CardTitle>
        <CardDescription>Aylık</CardDescription>
      </CardHeader>
      <CardContent className="h-[280px] w-full p-0 pr-6">
        <ChartContainer className="h-full w-full" config={chartConfig}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickFormatter={moneyFormatter}
                width={70}
                tickMargin={8}
                fontSize={12}
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
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="total"
                stroke="#7C3AED"
                fillOpacity={1}
                fill="url(#colorTotal)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
