export interface Patient {
  id: string;
  code: string; // Now will be formatted as PX-[FirstInitial][LastInitial]-[7-digit sequence]
  firstName: string;
  lastName: string;
  age: number;
  sex?: 'Male' | 'Female';
  email: string;
  phone: string;
  address: string;
  createdDate?: string;
}

export interface RefractionData {
  OD: {
    sphere: number | "Plano";
    cylinder: number;
    axis: number;
    visualAcuity: string;
  };
  OS: {
    sphere: number | "Plano";
    cylinder: number;
    axis: number;
    visualAcuity: string;
  };
  ADD?: {
    sphere?: number | "Plano";
    cylinder?: number;
    axis?: number;
    visualAcuity?: string;
    addPower?: number;
  };
}

export interface Transaction {
  id: string;
  code: string; // Now will be formatted as TX[YY]-[MM]-[5-digit sequence]
  date: string;
  patientCode: string;
  patientName: string;
  firstName: string;
  lastName: string;
  type: 'Complete' | 'Frame Replacement' | 'Lens Replacement' | 'Eye Exam' | 'Medical Certificate' | 'Contact Lens' | 'Repair' | 'Return' | 'Balance Payment';
  
  // Order Details
  refractiveIndex?: '1.56' | '1.61' | '1.67' | '1.74';
  lensType?: 'SV' | 'KK' | 'Prog' | 'N/A';
  lensCoating?: 'UC' | 'MC' | 'BB' | 'TRG' | 'BB TRG';
  tint?: 'N/A' | 'One-Tone' | 'Two-Tone';  // Added tint property
  color?: string;  // Added color property
  interpupillaryDistance?: number;

  // Refraction
  previousRx?: RefractionData;
  fullRx?: RefractionData;
  prescribedPower?: RefractionData;

  // Financials
  grossAmount: number;
  deposit: number;
  balance: number;
  lensCapital: number;
  edgingPrice: number;
  otherExpenses: number;
  totalExpenses: number;
  netIncome?: number;
  
  // Doctor & Notes
  doctorId?: string;
  doctorRemarks?: string;
  orderNotes?: string;
  
  // Claiming
  claimed: boolean;
  dateClaimed: string | null;
  isBalancePayment?: boolean;
  
  // Contact information
  phone?: string;
}

export interface DailyTransaction {
  date: string;
  transactions: Transaction[];
  dailyGross: number;
  dailyExpenses: number;
  dailyNet: number;
}
