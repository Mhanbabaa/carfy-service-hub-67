
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateRangePickerProps {
  className?: string;
  dateRange: DateRange | undefined;
  onChange: (dateRange: DateRange | undefined) => void;
}

export function DateRangePicker({
  className,
  dateRange,
  onChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleQuickSelect = (value: string) => {
    const today = new Date();
    const from = new Date();
    
    switch (value) {
      case "7days": 
        from.setDate(today.getDate() - 7);
        break;
      case "30days":
        from.setDate(today.getDate() - 30);
        break;
      case "thisMonth":
        from.setDate(1);
        break;
      case "lastMonth":
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        from.setMonth(lastMonth.getMonth());
        from.setDate(1);
        today.setMonth(lastMonth.getMonth());
        today.setDate(new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0).getDate());
        break;
      default:
        return;
    }
    
    onChange({ from, to: value === "lastMonth" ? today : new Date() });
    setIsOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <div className="flex items-center gap-2">
        <Select onValueChange={handleQuickSelect}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tarih aralığı seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Son 7 gün</SelectItem>
            <SelectItem value="30days">Son 30 gün</SelectItem>
            <SelectItem value="thisMonth">Bu ay</SelectItem>
            <SelectItem value="lastMonth">Geçen ay</SelectItem>
            <SelectItem value="custom">Özel aralık</SelectItem>
          </SelectContent>
        </Select>
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !dateRange && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "d MMMM yyyy")} -{" "}
                    {format(dateRange.to, "d MMMM yyyy")}
                  </>
                ) : (
                  format(dateRange.from, "d MMMM yyyy")
                )
              ) : (
                <span>Tarih aralığı seçin</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={(range) => {
                onChange(range);
                if (range?.to) {
                  setIsOpen(false);
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
