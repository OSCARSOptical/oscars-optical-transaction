
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { DayCard } from "./DayCard";
import { MonthlySummary } from "./MonthlySummary";
import { BalanceSheetHeader } from "./BalanceSheetHeader";
import { EmptyState } from "./EmptyState";
import { useBalanceSheetData } from "@/hooks/useBalanceSheetData";
import { backfillClaimedTransactionPayments } from "@/utils/balanceSheetUtils";
import { Transaction } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export function BalanceSheet() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch transactions from Supabase
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('transactions')
          .select('*, patients!inner(first_name, last_name, patient_code)');
          
        if (error) {
          console.error('Error fetching transactions:', error);
          return;
        }
        
        // Transform the data to match the Transaction type
        const formattedTransactions: Transaction[] = data.map(tx => ({
          id: tx.id,
          code: tx.transaction_code || '',
          patientCode: tx.patients?.patient_code || '',
          patientName: `${tx.patients?.first_name || ''} ${tx.patients?.last_name || ''}`,
          firstName: tx.patients?.first_name || '',
          lastName: tx.patients?.last_name || '',
          date: tx.transaction_date || new Date().toISOString().split('T')[0],
          type: tx.transaction_type as Transaction['type'],
          grossAmount: tx.gross_amount || 0,
          deposit: tx.deposit || 0,
          balance: tx.balance || 0,
          lensCapital: tx.lens_capital || 0,
          edgingPrice: tx.edging_price || 0,
          otherExpenses: tx.other_expenses || 0,
          totalExpenses: tx.total_expenses || 0,
          claimed: tx.claimed || false,
          dateClaimed: tx.claimed_on || null
        }));
        
        setTransactions(formattedTransactions);
        
        // Run the backfill once transactions are loaded
        const backfilledCount = backfillClaimedTransactionPayments(formattedTransactions);
        if (backfilledCount > 0) {
          console.log(`Created ${backfilledCount} payment records for previously claimed transactions.`);
        }
      } catch (err) {
        console.error('Error in fetchTransactions:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  // Run the backfill once when the component mounts
  useEffect(() => {
    const backfilledCount = backfillClaimedTransactionPayments(transactions);
    if (backfilledCount > 0) {
      console.log(`Created ${backfilledCount} payment records for previously claimed transactions.`);
    }
  }, []);
  
  const { groupedData, sortedDates, monthlyTotals } = useBalanceSheetData(selectedMonth, transactions);
  
  const currentMonth = format(selectedMonth, 'MMMM');
  const currentYear = format(selectedMonth, 'yyyy');

  return (
    <div className="space-y-6">
      <BalanceSheetHeader 
        selectedMonth={selectedMonth} 
        onMonthChange={setSelectedMonth} 
      />
      
      {loading ? (
        <div className="flex justify-center py-8">
          <p>Loading financial data...</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default BalanceSheet;
