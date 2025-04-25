
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, CaptionProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [month, setMonth] = React.useState<Date>();

  // Custom caption component with month/year selection
  function CustomCaption({ displayMonth, goToMonth }: CaptionProps) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const years = Array.from({ length: 10 }, (_, i) => displayMonth.getFullYear() - 5 + i);
    
    return (
      <div className="flex justify-center pt-1 relative items-center gap-1">
        <Select
          value={months[displayMonth.getMonth()]}
          onValueChange={(newMonth) => {
            const newDate = new Date(displayMonth);
            newDate.setMonth(months.indexOf(newMonth));
            goToMonth(newDate);
          }}
        >
          <SelectTrigger className="h-7 w-[100px] border-none bg-transparent text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            {months[displayMonth.getMonth()]}
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={displayMonth.getFullYear().toString()}
          onValueChange={(newYear) => {
            const newDate = new Date(displayMonth);
            newDate.setFullYear(parseInt(newYear));
            goToMonth(newDate);
          }}
        >
          <SelectTrigger className="h-7 w-[70px] border-none bg-transparent text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            {displayMonth.getFullYear()}
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="space-x-1 flex items-center">
          <button
            onClick={() => {
              const prevMonth = new Date(displayMonth);
              prevMonth.setMonth(prevMonth.getMonth() - 1);
              goToMonth(prevMonth);
            }}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              const nextMonth = new Date(displayMonth);
              nextMonth.setMonth(nextMonth.getMonth() + 1);
              goToMonth(nextMonth);
            }}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium hidden", // Hide default caption
        nav: "hidden", // Hide default navigation
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        Caption: CustomCaption
      }}
      month={month}
      onMonthChange={setMonth}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
