
import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { format, subMonths, startOfMonth, endOfMonth, isSameMonth, isAfter, isBefore, parseISO } from 'date-fns';
import { getAllPayments } from '@/utils/paymentsUtils';

export const useMetricsData = (sampleTransactions: Transaction[], samplePatients: any[]) => {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [pendingPayments, setPendingPayments] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [monthlyRevenueComparison, setMonthlyRevenueComparison] = useState<string>('');
  const [newPatientsThisMonth, setNewPatientsThisMonth] = useState(0);

  useEffect(() => {
    const handleBalanceSheetUpdate = () => {
      setRefreshTrigger(prev => prev + 1);
    };
    
    window.addEventListener('balanceSheetUpdated', handleBalanceSheetUpdate);
    
    return () => {
      window.removeEventListener('balanceSheetUpdated', handleBalanceSheetUpdate);
    };
  }, []);

  useEffect(() => {
    const pending = transactions
      .filter(tx => !tx.claimed)
      .reduce((sum, tx) => sum + tx.balance, 0);
    
    const count = transactions.filter(tx => !tx.claimed && tx.balance > 0).length;
    
    setPendingPayments(pending);
    setPendingCount(count);
  }, [transactions, refreshTrigger]);

  useEffect(() => {
    const currentDate = new Date();
    const currentMonthStart = startOfMonth(currentDate);
    const currentMonthEnd = endOfMonth(currentDate);
    const lastMonthStart = startOfMonth(subMonths(currentDate, 1));
    const lastMonthEnd = endOfMonth(subMonths(currentDate, 1));
    
    const allPayments = getAllPayments();

    const currentMonthDeposits = transactions
      .filter(tx => {
        const txDate = parseISO(tx.date);
        return isAfter(txDate, currentMonthStart) && isBefore(txDate, currentMonthEnd);
      })
      .reduce((sum, tx) => sum + tx.deposit, 0);
    
    const currentMonthBalancePayments = allPayments
      .filter(payment => {
        const paymentDate = parseISO(payment.paymentDate);
        return isAfter(paymentDate, currentMonthStart) && isBefore(paymentDate, currentMonthEnd);
      })
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    const currentMonthTotal = currentMonthDeposits + currentMonthBalancePayments;
    
    const lastMonthDeposits = transactions
      .filter(tx => {
        const txDate = parseISO(tx.date);
        return isAfter(txDate, lastMonthStart) && isBefore(txDate, lastMonthEnd);
      })
      .reduce((sum, tx) => sum + tx.deposit, 0);
    
    const lastMonthBalancePayments = allPayments
      .filter(payment => {
        const paymentDate = parseISO(payment.paymentDate);
        return isAfter(paymentDate, lastMonthStart) && isBefore(paymentDate, lastMonthEnd);
      })
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    const lastMonthTotal = lastMonthDeposits + lastMonthBalancePayments;
    
    setMonthlyRevenue(currentMonthTotal);
    
    if (lastMonthTotal > 0) {
      const percentageChange = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
      setMonthlyRevenueComparison(`${percentageChange >= 0 ? '+' : ''}${percentageChange.toFixed(0)}% from last month`);
    } else {
      setMonthlyRevenueComparison('—');
    }
    
    const newPatients = samplePatients.filter(patient => {
      const createdDate = parseISO(patient.createdDate);
      return isSameMonth(createdDate, currentDate);
    }).length;
    
    setNewPatientsThisMonth(newPatients);
  }, [transactions, refreshTrigger, samplePatients]);

  return {
    transactions,
    pendingPayments,
    pendingCount,
    monthlyRevenue,
    monthlyRevenueComparison,
    newPatientsThisMonth
  };
};
