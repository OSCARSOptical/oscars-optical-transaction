
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DayCard } from "./DayCard";
import { MonthlySummary } from "./MonthlySummary";
import { BalanceSheetHeader } from "./BalanceSheetHeader";
import { EmptyState } from "./EmptyState";
import { useBalanceSheetData } from "@/hooks/useBalanceSheetData";
import { backfillClaimedTransactionPayments } from "@/utils/balanceSheetUtils";

export function BalanceSheet() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  
  // Run the backfill once when the component mounts
  useEffect(() => {
    const backfilledCount = backfillClaimedTransactionPayments([]);
    if (backfilledCount > 0) {
      console.log(`Created ${backfilledCount} payment records for previously claimed transactions.`);
    }
  }, []);
  
  const { groupedData, sortedDates, monthlyTotals } = useBalanceSheetData(selectedMonth, []);
  
  const currentMonth = format(selectedMonth, 'MMMM');
  const currentYear = format(selectedMonth, 'yyyy');

  return (
    <div className="space-y-6">
      <BalanceSheetHeader 
        selectedMonth={selectedMonth} 
        onMonthChange={setSelectedMonth} 
      />
      
      <MonthlySummary totals={monthlyTotals} />
      
      {sortedDates.length > 0 ? (
        sortedDates.map((date) => (
          <DayCard
            key={date}
            date={date}
            transactions={groupedData[date].transactions}
          />
        ))
      ) : (
        <EmptyState month={currentMonth} year={currentYear} />
      )}
    </div>
  );
}

export default BalanceSheet;
