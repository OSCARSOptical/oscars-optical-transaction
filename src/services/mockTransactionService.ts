
import { Transaction } from '@/types';

export const createMockTransaction = (transactionCode: string | undefined, patientCode: string | undefined): Transaction => {
  return {
    id: "1",
    code: transactionCode || "TX25-04-00001",
    date: "2025-04-10",
    patientCode: patientCode || "PX-JD-0000001",
    patientName: "",
    firstName: "",
    lastName: "",
    type: "Complete",
    grossAmount: 7500.00,
    deposit: 2500.00,
    balance: 5000.00,
    lensCapital: 1200.00,
    edgingPrice: 150.00,
    otherExpenses: 50.00,
    totalExpenses: 1400.00,
    claimed: false,
    dateClaimed: null,
    refractiveIndex: "1.56",
    lensType: "SV",
    lensCoating: "UC",
    tint: "N/A",
    color: "",
    interpupillaryDistance: 62,
    orderNotes: "Sample order notes",
    previousRx: undefined,
    fullRx: undefined,
    prescribedPower: undefined,
    doctorId: undefined,
    doctorRemarks: undefined
  };
};

