
import { useState } from "react";
import { format, addMonths, subMonths, setMonth, setYear } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";

interface MonthYearPickerProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

export function MonthYearPicker({ selectedMonth, onMonthChange }: MonthYearPickerProps) {
  const [open, setOpen] = useState(false);
  
  const currentYear = format(selectedMonth, 'yyyy');
  const currentMonth = format(selectedMonth, 'MMMM');
  
  const handlePreviousMonth = () => {
    onMonthChange(subMonths(selectedMonth, 1));
  };

  const handleNextMonth = () => {
    onMonthChange(addMonths(selectedMonth, 1));
  };

  const handleMonthChange = (monthName: string) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = months.indexOf(monthName);
    const newDate = setMonth(selectedMonth, monthIndex);
    onMonthChange(newDate);
  };
  
  const handleYearChange = (yearStr: string) => {
    const year = parseInt(yearStr, 10);
    const newDate = setYear(selectedMonth, year);
    onMonthChange(newDate);
  };
  
  // Generate array of years (from 5 years ago to 5 years ahead)
  const currentYearNum = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => (currentYearNum - 5 + i).toString());

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePreviousMonth}
      >
        Previous
      </Button>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="min-w-[180px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {format(selectedMonth, "MMMM yyyy")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="end">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Month</h4>
              <Select 
                value={currentMonth} 
                onValueChange={handleMonthChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="January">January</SelectItem>
                  <SelectItem value="February">February</SelectItem>
                  <SelectItem value="March">March</SelectItem>
                  <SelectItem value="April">April</SelectItem>
                  <SelectItem value="May">May</SelectItem>
                  <SelectItem value="June">June</SelectItem>
                  <SelectItem value="July">July</SelectItem>
                  <SelectItem value="August">August</SelectItem>
                  <SelectItem value="September">September</SelectItem>
                  <SelectItem value="October">October</SelectItem>
                  <SelectItem value="November">November</SelectItem>
                  <SelectItem value="December">December</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Year</h4>
              <Select 
                value={currentYear} 
                onValueChange={handleYearChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleNextMonth}
      >
        Next
      </Button>
    </div>
  );
}
