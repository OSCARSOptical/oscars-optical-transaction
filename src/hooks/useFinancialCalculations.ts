
import { useState, useEffect } from "react";

interface FinancialData {
  grossAmount: number;
  deposit: number;
  lensCapital: number;
  edgingPrice: number;
  otherExpenses: number;
}

interface CalculatedValues {
  balance: number;
  totalExpenses: number;
  netIncome: number;
}

/**
 * Hook for handling financial calculations related to transactions
 * Calculates balance, total expenses and net income based on provided data
 */
export const useFinancialCalculations = (
  initialData: FinancialData
): [CalculatedValues, (data: Partial<FinancialData>) => void] => {
  const [financialData, setFinancialData] = useState<FinancialData>({
    grossAmount: initialData.grossAmount || 0,
    deposit: initialData.deposit || 0,
    lensCapital: initialData.lensCapital || 0,
    edgingPrice: initialData.edgingPrice || 0,
    otherExpenses: initialData.otherExpenses || 0,
  });

  const [calculatedValues, setCalculatedValues] = useState<CalculatedValues>({
    balance: 0,
    totalExpenses: 0,
    netIncome: 0,
  });

  // Recalculate derived values whenever financial data changes
  useEffect(() => {
    const { grossAmount, deposit, lensCapital, edgingPrice, otherExpenses } = financialData;
    
    // Calculate balance
    const balance = Math.max(0, grossAmount - deposit);
    
    // Calculate total expenses
    const totalExpenses = lensCapital + edgingPrice + otherExpenses;
    
    // Calculate net income (deposit minus expenses)
    const netIncome = deposit - totalExpenses;

    setCalculatedValues({
      balance,
      totalExpenses,
      netIncome,
    });
  }, [financialData]);

  // Update financial data
  const updateFinancialData = (newData: Partial<FinancialData>) => {
    setFinancialData(prev => ({
      ...prev,
      ...newData,
    }));
  };

  return [calculatedValues, updateFinancialData];
};
