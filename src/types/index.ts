
export interface Patient {
  id: string;
  code: string; // Now will be formatted as PX-[FirstInitial][LastInitial]-[7-digit sequence]
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
  address: string;
}

export interface Transaction {
  id: string;
  code: string; // Now will be formatted as TX[YY]-[MM]-[5-digit sequence]
  date: string; // orderDate
  patientCode: string;
  patientName: string;
  firstName: string;
  lastName: string;
  type: 'Complete' | 'Frame Replacement' | 'Lens Replacement' | 'Eye Exam' | 'Medical Certificate' | 'Contact Lens' | 'Repair' | 'Return';
  grossAmount: number;
  deposit: number;
  depositDate: string; // New field for when the payment is logged
  balance: number;
  lensCapital: number;
  edgingPrice: number;
  otherExpenses: number;
  totalExpenses: number;
  claimed: boolean;
  dateClaimed: string | null;
  sameDay?: boolean; // Computed flag
}
