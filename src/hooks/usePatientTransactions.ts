
import { useState, useEffect } from 'react';
import { Transaction } from '@/types';

// Mock database data - replace with real DB later
const allTransactions: Transaction[] = [
  {
    id: "1",
    code: "TX25-04-00001",
    date: "2025-04-10",
    patientCode: "PX-JD-0000001",
    patientName: "John Doe",
    firstName: "John",
    lastName: "Doe",
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
    refractiveIndex: "1.61",
    lensType: "Prog",
    lensCoating: "BB TRG",
    tint: "N/A",
    color: "",
    interpupillaryDistance: 62.5,
    previousRx: {
      OD: { sphere: -2.25, cylinder: -0.75, axis: 180, visualAcuity: "20/40" },
      OS: { sphere: -2.50, cylinder: -0.50, axis: 175, visualAcuity: "20/40" }
    },
    fullRx: {
      OD: { sphere: -2.50, cylinder: -0.75, axis: 180, visualAcuity: "20/20" },
      OS: { sphere: -2.75, cylinder: -0.50, axis: 175, visualAcuity: "20/20" }
    },
    prescribedPower: {
      OD: { sphere: -2.50, cylinder: -0.75, axis: 180, visualAcuity: "20/20" },
      OS: { sphere: -2.75, cylinder: -0.50, axis: 175, visualAcuity: "20/20" },
      ADD: { addPower: 1.50 }
    },
    doctorId: "DR-JB-001",
    doctorRemarks: "Patient may need updated prescription in 6 months due to progressive myopia.",
    orderNotes: "Customer preferred titanium frame. Delivery estimate: 5-7 business days."
  },
  {
    id: "2",
    code: "TX25-04-00002",
    date: "2025-04-08",
    patientCode: "PX-JS-0000001",
    patientName: "Jane Smith",
    firstName: "Jane",
    lastName: "Smith",
    type: "Frame Replacement",
    grossAmount: 300.00,
    deposit: 150.00,
    balance: 150.00,
    lensCapital: 100,
    edgingPrice: 50,
    otherExpenses: 25,
    totalExpenses: 175,
    claimed: true,
    dateClaimed: "2025-04-10",
    refractiveIndex: "1.56",
    lensType: "SV",
    lensCoating: "MC",
    tint: "N/A",
    color: "",
    interpupillaryDistance: 64.0,
    prescribedPower: {
      OD: { sphere: -1.25, cylinder: -0.25, axis: 90, visualAcuity: "20/20" },
      OS: { sphere: -1.00, cylinder: -0.25, axis: 85, visualAcuity: "20/20" }
    },
    doctorId: "DR-MK-002",
    orderNotes: "Reusing previous lenses in new frame. Customer chose brown tortoise frame."
  },
  {
    id: "3",
    code: "TX25-04-00003",
    date: "2025-04-11",
    patientCode: "PX-OS-0000001",
    patientName: "Oscar Santos",
    firstName: "Oscar",
    lastName: "Santos",
    type: "Frame Replacement",
    grossAmount: 6800.00,
    deposit: 6800.00,
    balance: 0.00,
    lensCapital: 2800.00,
    edgingPrice: 200.00,
    otherExpenses: 100.00,
    totalExpenses: 3100.00,
    claimed: false,
    dateClaimed: null,
    refractiveIndex: "1.67",
    lensType: "Prog",
    lensCoating: "BB TRG",
    tint: "N/A",
    color: "",
    interpupillaryDistance: 66.0,
    previousRx: {
      OD: { sphere: -3.75, cylinder: -1.25, axis: 175, visualAcuity: "20/40" },
      OS: { sphere: -4.00, cylinder: -1.00, axis: 5, visualAcuity: "20/40" }
    },
    fullRx: {
      OD: { sphere: -4.00, cylinder: -1.25, axis: 175, visualAcuity: "20/20" },
      OS: { sphere: -4.25, cylinder: -1.00, axis: 5, visualAcuity: "20/20" }
    },
    prescribedPower: {
      OD: { sphere: -4.00, cylinder: -1.25, axis: 175, visualAcuity: "20/20" },
      OS: { sphere: -4.25, cylinder: -1.00, axis: 5, visualAcuity: "20/20" },
      ADD: { addPower: 2.00 }
    },
    doctorId: "DR-AL-003",
    doctorRemarks: "High myope, recommend polycarbonate lenses and annual check-ups.",
    orderNotes: "Customer preferred lightweight frame due to high prescription. Upgraded to premium anti-reflective coating."
  }
];

export function usePatientTransactions(patientCode: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        console.log("Fetching transactions for patient:", patientCode);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter transactions for this patient
        const patientTransactions = allTransactions.filter(
          transaction => transaction.patientCode === patientCode
        );
        
        console.log("Found transactions:", patientTransactions.length);
        setTransactions(patientTransactions);
        setError(null);
      } catch (err) {
        setError('Failed to fetch transactions');
        console.error('Error fetching transactions:', err);
      } finally {
        setLoading(false);
      }
    };

    if (patientCode) {
      fetchTransactions();
    } else {
      setTransactions([]);
      setLoading(false);
    }
  }, [patientCode]);

  return { transactions, loading, error };
}
