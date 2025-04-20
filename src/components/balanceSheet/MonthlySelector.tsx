
import { useState } from "react";
import { format, addYears, subYears } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";

interface MonthlySelectorProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

export function MonthlySelector({ selectedMonth, onMonthChange }: MonthlySelectorProps) {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = selectedMonth.getFullYear();
  const yearRange = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(parseInt(monthIndex));
    onMonthChange(newDate);
  };

  const handleYearChange = (year: string) => {
    const newDate = new Date(selectedMonth);
    newDate.setFullYear(parseInt(year));
    onMonthChange(newDate);
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedMonth.getMonth().toString()}
        onValueChange={handleMonthChange}
      >
        <SelectTrigger className="w-[140px]">
          <CalendarIcon className="mr-2 h-4 w-4" />
          <SelectValue>{format(selectedMonth, "MMMM")}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {months.map((month, index) => (
            <SelectItem key={index} value={index.toString()}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedMonth.getFullYear().toString()}
        onValueChange={handleYearChange}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue>{format(selectedMonth, "yyyy")}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {yearRange.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
