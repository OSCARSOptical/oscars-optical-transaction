
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

// Add a new patient
export const addPatient = (patient: Patient): void => {
  const patients = getPatients();
  patients.push(patient);
  localStorage.setItem("patients", JSON.stringify(patients));
};

// Add a new transaction
export const addTransaction = (transaction: Transaction): void => {
  const transactions = getTransactions();
  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

// Save multiple patients at once (for bulk imports)
export const savePatients = (patients: Patient[]): void => {
  localStorage.setItem("patients", JSON.stringify(patients));
};

// Save multiple transactions at once (for bulk imports)
export const saveTransactions = (transactions: Transaction[]): void => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};
