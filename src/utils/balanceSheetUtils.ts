
import { Transaction } from '@/types';
import { addPayment, removePayment } from './paymentsUtils';

// In-memory storage for balance sheet entries
// In a real app, this would use a database or API calls
let balanceSheetEntries: Record<string, any[]> = {};

interface BalanceSheetEntry {
  date: string;
  transactionId: string;
  balancePaid: number;
  patientCode: string;  // Added patientCode for navigation
}

interface RemoveEntryParams {
  date: string;
  transactionId: string;
}

/**
 * Adds a balance entry to the balance sheet and creates a payment record
 */
export const addBalanceSheetEntry = ({ date, transactionId, balancePaid, patientCode }: BalanceSheetEntry) => {
  if (!balanceSheetEntries[date]) {
    balanceSheetEntries[date] = [];
  }
  
  balanceSheetEntries[date].push({
    description: `${transactionId} - Balance`,
    grossAmount: 0,
    deposit: balancePaid,
    balance: 0,
    expenses: 0,
    netIncome: balancePaid,
    isBalancePayment: true,
    transactionId,
    patientCode, // Store patientCode for navigation
  });
  
  // Persist the payment
  addPayment({
    transactionCode: transactionId,
    patientCode,
    paymentType: 'balance',
    amount: balancePaid,
    paymentDate: date
  });
  
  console.log(`Added balance sheet entry for ${date}:`, balanceSheetEntries[date]);
  triggerBalanceSheetUpdate();
};

/**
 * Removes a balance entry from the balance sheet and deletes the payment record
 */
export const removeBalanceSheetEntry = ({ date, transactionId }: RemoveEntryParams) => {
  if (balanceSheetEntries[date]) {
    balanceSheetEntries[date] = balanceSheetEntries[date].filter(
      entry => !(entry.isBalancePayment && entry.description === `${transactionId} - Balance`)
    );
    
    if (balanceSheetEntries[date].length === 0) {
      delete balanceSheetEntries[date];
    }
  }
  
  // Remove the payment record
  removePayment(transactionId, 'balance');
  
  console.log(`Removed balance sheet entry for ${date}, transaction ${transactionId}`);
  triggerBalanceSheetUpdate();
};

/**
 * Gets all balance sheet entries for a specific date
 */
export const getBalanceSheetEntriesForDate = (date: string) => {
  return balanceSheetEntries[date] || [];
};

/**
 * Gets all balance sheet entries
 */
export const getAllBalanceSheetEntries = () => {
  return balanceSheetEntries;
};

/**
 * Trigger a balance sheet update (for UI refresh)
 * In a real app, this would use state management or context
 */
const triggerBalanceSheetUpdate = () => {
  const event = new CustomEvent('balanceSheetUpdated', { 
    detail: { timestamp: new Date().getTime() } 
  });
  window.dispatchEvent(event);
};

