
import { Transaction } from '@/types';
import { addPayment, removePayment, findPayment } from './paymentsUtils';

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
 * Back-fill payment records for transactions that are already claimed
 * but don't have corresponding payment records
 */
export const backfillClaimedTransactionPayments = (transactions: Transaction[]) => {
  console.log("Running backfill for claimed transactions without payment records...");
  
  if (!transactions || transactions.length === 0) {
    console.log("No transactions to process for backfill.");
    return 0;
  }
  
  const claimedTransactions = transactions.filter(
    tx => tx.claimed && tx.dateClaimed && !tx.isBalancePayment
  );
  
  let backfillCount = 0;
  
  claimedTransactions.forEach(tx => {
    // Check if a payment record already exists
    const existingPayment = findPayment(tx.code, 'balance');
    
    if (!existingPayment && tx.dateClaimed) {
      // Calculate what the balance payment amount would have been
      // This is typically the original balance before claiming
      const balancePaid = tx.grossAmount - tx.deposit;
      
      // Add the payment record
      addPayment({
        transactionCode: tx.code,
        patientCode: tx.patientCode,
        paymentType: 'balance',
        amount: balancePaid > 0 ? balancePaid : 0, // Ensure we don't add negative amounts
        paymentDate: tx.dateClaimed
      });
      
      backfillCount++;
    }
  });
  
  console.log(`Backfill complete. Added ${backfillCount} missing payment records.`);
  
  if (backfillCount > 0) {
    triggerBalanceSheetUpdate();
  }
  
  return backfillCount;
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
