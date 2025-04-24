import { Patient, Transaction } from "@/types";
import { generatePatientCode } from "@/utils/patientUtils";
import Papa from "papaparse";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

// For mapping Excel column headers to our data model fields
interface ColumnMapping {
  [key: string]: string;
}

// Helper to convert Excel date serial numbers to date strings
export const excelDateToString = (excelDate: number): string => {
  // Excel dates start from December 30, 1899
  const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
  return format(date, "yyyy-MM-dd");
};

// Function to generate a transaction code in our format
export const generateTransactionCode = (date: Date, index: number): string => {
  const year = date.getFullYear().toString().slice(2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const sequenceNumber = String(index).padStart(5, "0");
  return `TX${year}-${month}-${sequenceNumber}`;
};

// Process patient data from CSV
export const processPatientData = (csvData: string, columnMapping: ColumnMapping): Patient[] => {
  const results = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
  });
  
  if (!results.data || results.data.length === 0) {
    throw new Error("No data found in CSV");
  }

  return results.data.map((row: any, index: number) => {
    // Generate a unique ID for the patient
    const id = uuidv4();
    
    // Map fields from Excel to our data model
    const firstName = row[columnMapping.firstName] || "";
    const lastName = row[columnMapping.lastName] || "";
    const age = parseInt(row[columnMapping.age]) || 0;
    const sex = row[columnMapping.sex] || "Male";
    const email = row[columnMapping.email] || "";
    const phone = row[columnMapping.phone] || "";
    const address = row[columnMapping.address] || "";
    
    // Use the original patient code if available, otherwise generate a new one
    let code = row[columnMapping.code] || "";
    if (!code) {
      code = generatePatientCode(firstName, lastName, id);
    }
    
    const createdDate = row[columnMapping.createdDate] || format(new Date(), "yyyy-MM-dd");

    return {
      id,
      firstName,
      lastName,
      age,
      sex: sex as "Male" | "Female",
      email,
      phone,
      address,
      code,
      createdDate
    };
  });
};

// Process transaction data from CSV
export const processTransactionData = (
  csvData: string, 
  columnMapping: ColumnMapping, 
  patientMap: Map<string, Patient>
): Transaction[] => {
  const results = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
  });

  if (!results.data || results.data.length === 0) {
    throw new Error("No data found in CSV");
  }

  return results.data.map((row: any, index: number) => {
    // Generate a unique ID for the transaction
    const id = uuidv4();
    
    // Get transaction date - handle both string dates and Excel serial numbers
    let date: string;
    const rawDate = row[columnMapping.date];
    if (rawDate) {
      if (!isNaN(Number(rawDate))) {
        // Handle Excel serial date
        date = excelDateToString(Number(rawDate));
      } else {
        // Handle string date
        date = rawDate;
      }
    } else {
      date = format(new Date(), "yyyy-MM-dd");
    }
    
    // Find the patient for this transaction
    const patientCode = row[columnMapping.patientCode] || "";
    const patient = patientMap.get(patientCode);
    
    // Generate transaction code if not provided
    const code = row[columnMapping.code] || generateTransactionCode(new Date(date), index + 1);
    
    // Parse financial values
    const grossAmount = parseFloat(row[columnMapping.grossAmount]) || 0;
    const deposit = parseFloat(row[columnMapping.deposit]) || 0;
    const balance = parseFloat(row[columnMapping.balance]) || (grossAmount - deposit);
    const lensCapital = parseFloat(row[columnMapping.lensCapital]) || 0;
    const edgingPrice = parseFloat(row[columnMapping.edgingPrice]) || 0;
    const otherExpenses = parseFloat(row[columnMapping.otherExpenses]) || 0;
    const totalExpenses = parseFloat(row[columnMapping.totalExpenses]) || (lensCapital + edgingPrice + otherExpenses);

    // Other fields
    const type = row[columnMapping.type] || "Complete";
    const claimed = row[columnMapping.claimed] === "Yes" || row[columnMapping.claimed] === "true" || false;
    const dateClaimed = claimed ? (row[columnMapping.dateClaimed] || date) : null;
    
    return {
      id,
      code,
      date,
      patientCode: patient?.code || patientCode,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : row[columnMapping.patientName] || "",
      firstName: patient?.firstName || row[columnMapping.firstName] || "",
      lastName: patient?.lastName || row[columnMapping.lastName] || "",
      type: type as Transaction["type"],
      grossAmount,
      deposit,
      balance,
      lensCapital,
      edgingPrice,
      otherExpenses,
      totalExpenses,
      claimed,
      dateClaimed,
      
      // Optional fields - only add if they exist in the CSV
      refractiveIndex: row[columnMapping.refractiveIndex] as Transaction["refractiveIndex"] || undefined,
      lensType: row[columnMapping.lensType] as Transaction["lensType"] || undefined,
      lensCoating: row[columnMapping.lensCoating] as Transaction["lensCoating"] || undefined,
      tint: row[columnMapping.tint] as Transaction["tint"] || undefined,
      color: row[columnMapping.color] || "",
      interpupillaryDistance: row[columnMapping.interpupillaryDistance] ? parseInt(row[columnMapping.interpupillaryDistance]) : undefined,
      orderNotes: row[columnMapping.orderNotes] || "",
      
      // If we have refraction data, add it
      fullRx: row[columnMapping.fullRxODSphere] ? {
        OD: {
          sphere: row[columnMapping.fullRxODSphere] || "Plano",
          cylinder: parseFloat(row[columnMapping.fullRxODCylinder]) || 0,
          axis: parseInt(row[columnMapping.fullRxODAxis]) || 0,
          visualAcuity: row[columnMapping.fullRxODVisualAcuity] || "20/20"
        },
        OS: {
          sphere: row[columnMapping.fullRxOSSphere] || "Plano",
          cylinder: parseFloat(row[columnMapping.fullRxOSCylinder]) || 0,
          axis: parseInt(row[columnMapping.fullRxOSAxis]) || 0,
          visualAcuity: row[columnMapping.fullRxOSVisualAcuity] || "20/20"
        },
        ADD: row[columnMapping.fullRxAddPower] ? {
          addPower: parseFloat(row[columnMapping.fullRxAddPower])
        } : undefined
      } : undefined
    };
  });
};
