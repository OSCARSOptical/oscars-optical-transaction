
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Transaction } from "@/types";
import { DayCard } from "./DayCard";
import { MonthlySummary } from "./MonthlySummary";
import { BalanceSheetHeader } from "./BalanceSheetHeader";
import { EmptyState } from "./EmptyState";
import { useBalanceSheetData } from "@/hooks/useBalanceSheetData";
import { backfillClaimedTransactionPayments } from "@/utils/balanceSheetUtils";

// This would come from a shared data source in a real app
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    code: 'TX25-04-00001',
    date: '2025-04-10',
    patientCode: 'PX-JD-0000001',
    patientName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    type: 'Complete',
    grossAmount: 7500.00,
    deposit: 2500.00,
    balance: 5000.00,
    lensCapital: 1200.00,
    edgingPrice: 150.00,
    otherExpenses: 50.00,
    totalExpenses: 1400.00,
    claimed: true,
    dateClaimed: '2025-04-15'
  },
  {
    id: '2',
    code: 'TX25-04-00002',
    date: '2025-04-08',
    patientCode: 'PX-JS-0000001',
    patientName: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    type: 'Eye Exam',
    grossAmount: 1205.00,
    deposit: 1205.00,
    balance: 0.00,
    lensCapital: 0.00,
    edgingPrice: 0.00,
    otherExpenses: 0.00,
    totalExpenses: 0.00,
    claimed: true,
    dateClaimed: '2025-04-08'
  },
  {
    id: '3',
    code: 'TX25-04-00003',
    date: '2025-04-11',
    patientCode: 'PX-OS-0000001',
    patientName: 'Oscar Santos',
    firstName: 'Oscar',
    lastName: 'Santos',
    type: 'Frame Replacement',
    grossAmount: 6800.00,
    deposit: 6800.00,
    balance: 0.00,
    lensCapital: 2800.00,
    edgingPrice: 200.00,
    otherExpenses: 100.00,
    totalExpenses: 3100.00,
    claimed: false,
    dateClaimed: null
  }
];

export function BalanceSheet() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  
  // Run the backfill once when the component mounts
  useEffect(() => {
    const backfilledCount = backfillClaimedTransactionPayments(sampleTransactions);
    if (backfilledCount > 0) {
      console.log(`Created ${backfilledCount} payment records for previously claimed transactions.`);
    }
  }, []);
  
  const { groupedData, sortedDates, monthlyTotals } = useBalanceSheetData(selectedMonth, sampleTransactions);
  
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
