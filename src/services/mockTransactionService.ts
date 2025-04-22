
import { Transaction } from '@/types';

export const createMockTransaction = (transactionCode: string | undefined, patientCode: string | undefined): Transaction => {
  // Default transaction data
  const baseTransaction: Transaction = {
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

  // Customize based on transaction code (for specific mocked data)
  if (transactionCode === "TX25-04-00002") {
    return {
      ...baseTransaction,
      id: "2",
      code: "TX25-04-00002",
      patientCode: "PX-JS-0000001",
      patientName: "Jane Smith",
      firstName: "Jane",
      lastName: "Smith",
      date: "2025-04-08",
      type: "Frame Replacement",
      grossAmount: 300.00,
      deposit: 150.00,
      balance: 150.00,
      claimed: true,
      dateClaimed: "2025-04-10"
    };
  } else if (transactionCode === "TX25-04-00003") {
    return {
      ...baseTransaction,
      id: "3",
      code: "TX25-04-00003",
      patientCode: "PX-OS-0000001",
      patientName: "Oscar Santos",
      firstName: "Oscar",
      lastName: "Santos",
      date: "2025-04-11",
      type: "Frame Replacement",
      grossAmount: 6800.00,
      deposit: 6800.00,
      balance: 0.00,
      claimed: false,
      dateClaimed: null
    };
  }

  return baseTransaction;
};
