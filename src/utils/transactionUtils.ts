
import { Transaction } from '@/types';
import { findPayment } from './paymentsUtils';

export const updateTransactionWithPayment = (transaction: Transaction, transactionCode: string): Transaction => {
  const payment = findPayment(transactionCode, 'balance');
  
  if (payment) {
    return {
      ...transaction,
      claimed: true,
      dateClaimed: payment.paymentDate,
      balance: 0,
      deposit: transaction.deposit + payment.amount
    };
  }
  
  return transaction;
};

export const handleTransactionClaim = (transaction: Transaction): Transaction => {
  if (!transaction) return transaction;
  
  // When claiming a transaction, move the balance to deposit and mark as claimed
  if (!transaction.claimed) {
    return {
      ...transaction,
      claimed: true,
      dateClaimed: new Date().toISOString().split('T')[0],
      balance: 0,
      deposit: transaction.deposit + transaction.balance
    };
  } 
  // When unclaiming, move the amount back from deposit to balance
  else {
    const amountToRestore = transaction.balance === 0 ? 
      (transaction.grossAmount - (transaction.deposit - transaction.balance)) : 
      transaction.balance;
    
    return {
      ...transaction,
      claimed: false,
      dateClaimed: null,
      balance: amountToRestore,
      deposit: transaction.deposit - amountToRestore
    };
  }
};
