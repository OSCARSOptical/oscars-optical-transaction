
export interface Patient {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phone: string;
  address: string;
}

export interface Transaction {
  id: string;
  code: string;
  date: string;
  patientCode: string;
  patientName: string;
  type: 'Complete' | 'Frame Replacement' | 'Lens Replacement' | 'Eye Exam' | 'Medical Certificate' | 'Contact Lens' | 'Repair' | 'Return';
  grossAmount: number;
  deposit: number;
  balance: number;
}
