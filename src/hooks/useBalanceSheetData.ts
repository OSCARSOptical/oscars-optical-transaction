
import { useState, useEffect } from "react";
import { format, parse } from "date-fns";
import { Transaction } from "@/types";
import { getAllBalanceSheetEntries } from "@/utils/balanceSheetUtils";

interface GroupedData {
  transactions: Transaction[];
  date: string;
}

export function useBalanceSheetData(selectedMonth: Date, sampleTransactions: Transaction[]) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Add event listener for balance sheet updates
  useEffect(() => {
    const handleBalanceSheetUpdate = () => {
      setRefreshTrigger(prev => prev + 1);
    };
    
    window.addEventListener('balanceSheetUpdated', handleBalanceSheetUpdate);
    
    return () => {
      window.removeEventListener('balanceSheetUpdated', handleBalanceSheetUpdate);
    };
  }, []);

  // Filter transactions for the selected month
  const filteredTransactions = sampleTransactions.filter(transaction => {
    const transactionDate = parse(transaction.date, 'yyyy-MM-dd', new Date());
    return format(transactionDate, 'MM-yyyy') === format(selectedMonth, 'MM-yyyy');
  });

  // Get balance sheet entries
  const balanceSheetEntries = getAllBalanceSheetEntries();

  // Group transactions by date and incorporate balance sheet entries
  const groupedData: Record<string, GroupedData> = filteredTransactions.reduce((acc, transaction) => {
    if (!acc[transaction.date]) {
      acc[transaction.date] = {
        transactions: [],
        date: transaction.date
      };
    }
    acc[transaction.date].transactions.push(transaction);
    return acc;
  }, {} as Record<string, GroupedData>);

  // Add balance sheet entries to the grouped data
  Object.entries(balanceSheetEntries).forEach(([date, entries]) => {
    const dateMonth = date.substring(0, 7);
    const selectedMonthStr = format(selectedMonth, 'yyyy-MM');
    
    if (dateMonth === selectedMonthStr) {
      if (!groupedData[date]) {
        groupedData[date] = {
          transactions: [],
          date: date
        };
      }
      
      entries.forEach(entry => {
        if (entry.isBalancePayment) {
          groupedData[date].transactions.push({
            id: `balance-${entry.transactionId}-${Date.now()}`,
            code: entry.description,
            date: date,
            patientCode: "",
            patientName: "",
            firstName: "",
            lastName: "",
            type: "Balance Payment",
            grossAmount: entry.grossAmount,
            deposit: entry.deposit,
            balance: entry.balance,
            lensCapital: 0,
            edgingPrice: 0,
            otherExpenses: 0,
            totalExpenses: entry.expenses,
            claimed: true,
            dateClaimed: date,
            isBalancePayment: true
          });
        }
      });
    }
  });

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedData).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  // Calculate monthly totals
  const allTransactions = Object.values(groupedData).flatMap(group => group.transactions);
  const monthlyTotals = {
    grossSales: allTransactions.reduce((sum, tx) => sum + tx.grossAmount, 0),
    deposits: allTransactions.reduce((sum, tx) => sum + tx.deposit, 0),
    expenses: allTransactions.reduce((sum, tx) => sum + tx.totalExpenses, 0),
    netIncome: allTransactions.reduce((sum, tx) => sum + tx.deposit - tx.totalExpenses, 0)
  };

  return {
    groupedData,
    sortedDates,
    monthlyTotals,
    refreshTrigger
  };
}
