
import { useState, useEffect } from 'react';
import { Transaction } from '@/types';
import { format, subMonths, startOfMonth, endOfMonth, isSameMonth, isAfter, isBefore, parseISO } from 'date-fns';
import { getAllPayments } from '@/utils/paymentsUtils';

export const useMetricsData = (transactions: Transaction[] = [], patients: any[] = []) => {
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
        try {
          const txDate = parseISO(tx.date);
          return isAfter(txDate, currentMonthStart) && isBefore(txDate, currentMonthEnd);
        } catch (e) {
          return false;
        }
      })
      .reduce((sum, tx) => sum + tx.deposit, 0);
    
    const currentMonthBalancePayments = allPayments
      .filter(payment => {
        try {
          const paymentDate = parseISO(payment.paymentDate);
          return isAfter(paymentDate, currentMonthStart) && isBefore(paymentDate, currentMonthEnd);
        } catch (e) {
          return false;
        }
      })
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    const currentMonthTotal = currentMonthDeposits + currentMonthBalancePayments;
    
    const lastMonthDeposits = transactions
      .filter(tx => {
        try {
          const txDate = parseISO(tx.date);
          return isAfter(txDate, lastMonthStart) && isBefore(txDate, lastMonthEnd);
        } catch (e) {
          return false;
        }
      })
      .reduce((sum, tx) => sum + tx.deposit, 0);
    
    const lastMonthBalancePayments = allPayments
      .filter(payment => {
        try {
          const paymentDate = parseISO(payment.paymentDate);
          return isAfter(paymentDate, lastMonthStart) && isBefore(paymentDate, lastMonthEnd);
        } catch (e) {
          return false;
        }
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
    
    const newPatients = patients.filter(patient => {
      if (!patient.createdDate) return false;
      try {
        const createdDate = parseISO(patient.createdDate);
        return isSameMonth(createdDate, currentDate);
      } catch (e) {
        return false;
      }
    }).length;
    
    setNewPatientsThisMonth(newPatients);
  }, [transactions, refreshTrigger, patients]);

  return {
    transactions,
    pendingPayments,
    pendingCount,
    monthlyRevenue,
    monthlyRevenueComparison,
    newPatientsThisMonth
  };
};
