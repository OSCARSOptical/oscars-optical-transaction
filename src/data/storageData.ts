
import { Patient, Transaction } from "@/types";
import { samplePatients } from "./samplePatients";
import { sampleTransactions } from "./sampleTransactions";

// Load patients from localStorage if available, otherwise use sample data
export const getPatients = (): Patient[] => {
  try {
    const storedPatients = localStorage.getItem("patients");
    if (storedPatients) {
      return JSON.parse(storedPatients) as Patient[];
    }
  } catch (error) {
    console.error("Error loading patients from localStorage:", error);
  }
  
  return samplePatients;
};

// Load transactions from localStorage if available, otherwise use sample data
export const getTransactions = (): Transaction[] => {
  try {
    const storedTransactions = localStorage.getItem("transactions");
    if (storedTransactions) {
      return JSON.parse(storedTransactions) as Transaction[];
    }
  } catch (error) {
    console.error("Error loading transactions from localStorage:", error);
  }
  
  return sampleTransactions;
};

// Export helper functions to update data
export const updatePatient = (patient: Patient): void => {
  const patients = getPatients();
  const index = patients.findIndex(p => p.id === patient.id);
  
  if (index !== -1) {
    patients[index] = patient;
    localStorage.setItem("patients", JSON.stringify(patients));
  }
};

export const updateTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  const index = transactions.findIndex(t => t.id === transaction.id);
  
  if (index !== -1) {
    transactions[index] = transaction;
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }
};
