
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface DateSelectorProps {
  date: Date;
  onDateChange: (date: Date) => void;
  readOnly?: boolean;
}

const DateSelector = ({ date, onDateChange, readOnly = false }: DateSelectorProps) => {
  const formattedDate = format(date, "yyyy-MM-dd");

  return (
    <div>
      <Label htmlFor="transactionDate" className="text-xs text-muted-foreground">
        Transaction date
      </Label>
      <div className="relative">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              size="sm"
              className={cn(
                "w-full justify-start text-left font-normal",
                readOnly && "opacity-50 cursor-not-allowed"
              )}
              disabled={readOnly}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formattedDate}
            </Button>
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
      </div>
    </div>
  );
};

export default DateSelector;
