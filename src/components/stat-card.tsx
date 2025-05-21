
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  prefix?: string;
  suffix?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  prefix = "",
  suffix = "",
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
        </div>
        <div className="mt-2">
          <p className="text-2xl font-bold">
            {prefix}
            {typeof value === 'number' 
              ? Number(value).toLocaleString('tr-TR')
              : value}
            {suffix}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {trend && (
          <div className="mt-2 flex items-center text-xs">
            <span
              className={cn(
                "inline-flex items-center mr-1",
                trend.isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              {trend.isPositive ? (
                <ArrowUpIcon className="h-3 w-3 mr-0.5" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 mr-0.5" />
              )}
              {trend.value}%
            </span>
            {trend.label && (
              <span className="text-muted-foreground">{trend.label}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
