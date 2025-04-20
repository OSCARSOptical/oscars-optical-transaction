
import { Transaction } from '@/types';

// In-memory storage for balance sheet entries
// In a real app, this would use a database or API calls
let balanceSheetEntries: Record<string, any[]> = {};

interface BalanceSheetEntry {
  date: string;
  transactionId: string;
  balancePaid: number;
}

interface RemoveEntryParams {
  date: string;
  transactionId: string;
}

/**
 * Adds a balance entry to the balance sheet
 */
export const addBalanceSheetEntry = ({ date, transactionId, balancePaid }: BalanceSheetEntry) => {
  // Create the day's entries if they don't exist
  if (!balanceSheetEntries[date]) {
    balanceSheetEntries[date] = [];
  }
  
  // Add a new entry for this balance payment
  balanceSheetEntries[date].push({
    description: `${transactionId} - Balance`,
    grossAmount: 0,
    deposit: balancePaid,
    balance: 0,
    expenses: 0,
    netIncome: balancePaid,
    isBalancePayment: true,
    transactionId
  });
  
  // In a real app, you'd save this to a database
  console.log(`Added balance sheet entry for ${date}:`, balanceSheetEntries[date]);
  
  // Trigger any necessary UI updates (would be handled by a state management system)
  triggerBalanceSheetUpdate();
};

/**
 * Removes a balance entry from the balance sheet
 */
export const removeBalanceSheetEntry = ({ date, transactionId }: RemoveEntryParams) => {
  // Find and remove the entry
  if (balanceSheetEntries[date]) {
    balanceSheetEntries[date] = balanceSheetEntries[date].filter(
      entry => !(entry.isBalancePayment && entry.description === `${transactionId} - Balance`)
    );
    
    // Remove the day entirely if it's empty
    if (balanceSheetEntries[date].length === 0) {
      delete balanceSheetEntries[date];
    }
  }
  
  // In a real app, you'd update this in a database
  console.log(`Removed balance sheet entry for ${date}, transaction ${transactionId}`);
  
  // Trigger any necessary UI updates
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
  // This would dispatch an action or update context
  // For now, we'll just dispatch a custom event
  const event = new CustomEvent('balanceSheetUpdated', { 
    detail: { timestamp: new Date().getTime() } 
  });
  window.dispatchEvent(event);
};
