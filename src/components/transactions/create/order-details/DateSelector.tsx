
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

interface DateSelectorProps {
  date: Date;
  onDateChange: (date: Date) => void;
  readOnly?: boolean;
  label?: string;
}

const DateSelector = ({ 
  date, 
  onDateChange, 
  readOnly = false,
  label = "Transaction date"
}: DateSelectorProps) => {
  const formattedDate = format(date, "yyyy-MM-dd");

  return (
    <div>
      <Label htmlFor="date-input" className="text-xs text-muted-foreground">
        {label}
      </Label>
      {readOnly ? (
        <Input
          id="date-input"
          type="text"
          value={formattedDate}
          readOnly
          className="mt-1"
        />
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <div className="relative mt-1">
              <Input
                id="date-input"
                type="text"
                value={formattedDate}
                readOnly
                className="w-full pr-10 cursor-pointer"
              />
              <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => onDateChange(date || new Date())}
              initialFocus
              disabled={readOnly}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default DateSelector;
