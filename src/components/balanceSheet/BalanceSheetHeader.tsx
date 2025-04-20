
import { format } from "date-fns";
import { MonthlySelector } from "./MonthlySelector";

interface BalanceSheetHeaderProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

export function BalanceSheetHeader({ selectedMonth, onMonthChange }: BalanceSheetHeaderProps) {
  const currentMonth = format(selectedMonth, 'MMMM');
  const currentYear = format(selectedMonth, 'yyyy');

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">
          Balance Sheet
          <span className="ml-2 text-xl font-normal text-muted-foreground">
            {currentMonth} {currentYear}
          </span>
        </h2>
      </div>
      <MonthlySelector 
        selectedMonth={selectedMonth} 
        onMonthChange={onMonthChange} 
      />
    </div>
  );
}
