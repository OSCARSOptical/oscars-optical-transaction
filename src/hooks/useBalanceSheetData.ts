
import { useState, useEffect } from "react";
import { format, parse } from "date-fns";
import { Transaction } from "@/types";
import { getAllBalanceSheetEntries } from "@/utils/balanceSheetUtils";
import { getAllPayments, Payment } from "@/utils/paymentsUtils";

interface GroupedData {
  transactions: Transaction[];
  date: string;
}

export function useBalanceSheetData(selectedMonth: Date, transactions: Transaction[]) {
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
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = parse(transaction.date, 'yyyy-MM-dd', new Date());
    return format(transactionDate, 'MM-yyyy') === format(selectedMonth, 'MM-yyyy');
  });

  // Get balance sheet entries and payments
  const balanceSheetEntries = getAllBalanceSheetEntries();
  const allPayments = getAllPayments();

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

  // Create a record of processed transactions to avoid duplicates
  const processedBalancePayments = new Set<string>();
  
  // First, add any in-memory balance sheet entries
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
          // Create a composite key to track this balance payment
          const paymentKey = `${entry.transactionId}-balance-${date}`;
          processedBalancePayments.add(paymentKey);
          
          // Find original transaction to get patient information
          const originalTransaction = transactions.find(t => t.code === entry.transactionId);
          
          if (originalTransaction || entry.patientCode) {
            const patientCode = entry.patientCode || originalTransaction?.patientCode;
            const patientName = originalTransaction?.patientName || "Patient";
            const firstName = originalTransaction?.firstName || "";
            const lastName = originalTransaction?.lastName || "";
            
            groupedData[date].transactions.push({
              id: `balance-${entry.transactionId}-${Date.now()}`,
              code: `${entry.transactionId} - Balance`,
              date: date,
              patientCode: patientCode,
              patientName: patientName,
              firstName: firstName,
              lastName: lastName,
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
        }
      });
    }
  });
  
  // Next, add all persisted payments (those that haven't been processed yet)
  allPayments.forEach((payment: Payment) => {
    const { paymentDate, transactionCode, patientCode, amount } = payment;
    
    // Only process if it's for the selected month
    const paymentMonth = paymentDate.substring(0, 7);
    const selectedMonthStr = format(selectedMonth, 'yyyy-MM');
    
    if (paymentMonth === selectedMonthStr) {
      // Create a composite key to check if we've already processed this payment
      const paymentKey = `${transactionCode}-balance-${paymentDate}`;
      
      // Only add if not already processed (avoid duplicates)
      if (!processedBalancePayments.has(paymentKey)) {
        processedBalancePayments.add(paymentKey);
        
        // Find original transaction to get additional info
        const originalTransaction = transactions.find(t => t.code === transactionCode);
        
        if (!groupedData[paymentDate]) {
          groupedData[paymentDate] = {
            transactions: [],
            date: paymentDate
          };
        }
        
        const patientName = originalTransaction?.patientName || "Patient";
        const firstName = originalTransaction?.firstName || "";
        const lastName = originalTransaction?.lastName || "";
        
        groupedData[paymentDate].transactions.push({
          id: `balance-${transactionCode}-${Date.now()}`,
          code: `${transactionCode} - Balance`,
          date: paymentDate,
          patientCode: patientCode,
          patientName: patientName,
          firstName: firstName,
          lastName: lastName,
          type: "Balance Payment",
          grossAmount: 0,
          deposit: amount,
          balance: 0,
          lensCapital: 0,
          edgingPrice: 0,
          otherExpenses: 0,
          totalExpenses: 0,
          claimed: true,
          dateClaimed: paymentDate,
          isBalancePayment: true
        });
      }
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
