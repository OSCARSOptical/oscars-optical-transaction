
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
  
  return {
    ...transaction,
    claimed: !transaction.claimed,
    dateClaimed: !transaction.claimed ? new Date().toISOString().split('T')[0] : null,
    balance: !transaction.claimed ? 0 : transaction.grossAmount - transaction.deposit,
    deposit: !transaction.claimed ?
      transaction.deposit + transaction.balance :
      transaction.deposit - transaction.balance
  };
};

