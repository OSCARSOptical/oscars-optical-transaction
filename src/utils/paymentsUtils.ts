
// In-memory storage for payments (in a real app, this would be a database collection)
let payments: Payment[] = [];

export interface Payment {
  id: string;
  transactionCode: string;
  patientCode: string;
  paymentType: 'balance';
  amount: number;
  paymentDate: string;
}

/**
 * Add a new payment record
 */
export const addPayment = (payment: Omit<Payment, 'id'>): Payment => {
  const newPayment = {
    ...payment,
    id: `payment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  };
  
  payments.push(newPayment);
  console.log(`Added payment:`, newPayment);
  return newPayment;
};

/**
 * Remove a payment by transaction code and payment type
 */
export const removePayment = (transactionCode: string, paymentType: 'balance'): boolean => {
  const initialLength = payments.length;
  payments = payments.filter(
    payment => !(payment.transactionCode === transactionCode && payment.paymentType === paymentType)
  );
  
  const removed = payments.length < initialLength;
  if (removed) {
    console.log(`Removed payment for transaction ${transactionCode}`);
  }
  
  return removed;
};

/**
 * Get payments for a specific date
 */
export const getPaymentsForDate = (date: string): Payment[] => {
  return payments.filter(payment => payment.paymentDate === date);
};

/**
 * Get all payments
 */
export const getAllPayments = (): Payment[] => {
  return [...payments];
};

/**
 * Find a specific payment by transaction code and type
 */
export const findPayment = (transactionCode: string, paymentType: 'balance'): Payment | undefined => {
  return payments.find(
    payment => payment.transactionCode === transactionCode && payment.paymentType === paymentType
  );
};

