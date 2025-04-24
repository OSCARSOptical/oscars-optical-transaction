
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { processPatientData, processTransactionData } from "@/utils/dataImport";
import { Patient, Transaction } from "@/types";
import { CheckCircle, AlertCircle, FileSpreadsheet, Upload, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function DataImport() {
  const { toast } = useToast();
  const [patientCsv, setPatientCsv] = useState<string>("");
  const [transactionCsv, setTransactionCsv] = useState<string>("");
  const [patientMappings, setPatientMappings] = useState("");
  const [transactionMappings, setTransactionMappings] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [step, setStep] = useState<'upload' | 'mapping' | 'preview' | 'done'>('upload');
  const [activeTab, setActiveTab] = useState<'patients' | 'transactions'>('patients');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Default column mappings as examples
  const defaultPatientMappings = `{
  "firstName": "First Name",
  "lastName": "Last Name",
  "age": "Age",
  "sex": "Gender",
  "email": "Email",
  "phone": "Phone Number",
  "address": "Address",
  "code": "Patient ID",
  "createdDate": "Registration Date"
}`;

  const defaultTransactionMappings = `{
  "code": "Transaction ID",
  "date": "Transaction Date",
  "patientCode": "Patient ID",
  "patientName": "Patient Name",
  "firstName": "First Name",
  "lastName": "Last Name",
  "type": "Transaction Type",
  "grossAmount": "Gross Amount",
  "deposit": "Deposit",
  "balance": "Balance",
  "lensCapital": "Lens Capital",
  "edgingPrice": "Edging Price",
  "otherExpenses": "Other Expenses",
  "totalExpenses": "Total Expenses",
  "claimed": "Claimed",
  "dateClaimed": "Date Claimed",
  "refractiveIndex": "Refractive Index",
  "lensType": "Lens Type",
  "lensCoating": "Lens Coating",
  "tint": "Tint",
  "color": "Color",
  "interpupillaryDistance": "IPD",
  "orderNotes": "Order Notes",
  "fullRxODSphere": "OD Sphere",
  "fullRxODCylinder": "OD Cylinder",
  "fullRxODAxis": "OD Axis",
  "fullRxODVisualAcuity": "OD VA",
  "fullRxOSSphere": "OS Sphere",
  "fullRxOSCylinder": "OS Cylinder",
  "fullRxOSAxis": "OS Axis",
  "fullRxOSVisualAcuity": "OS VA",
  "fullRxAddPower": "ADD Power"
}`;

  // Initialize with default mappings
  React.useEffect(() => {
    if (!patientMappings) setPatientMappings(defaultPatientMappings);
    if (!transactionMappings) setTransactionMappings(defaultTransactionMappings);
  }, []);

  const handlePatientFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setPatientCsv(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleTransactionFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setTransactionCsv(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const processData = () => {
    try {
      setIsProcessing(true);
      setProgress(0);
      
      // Process patient data
      const patientColumnMapping = JSON.parse(patientMappings);
      const processedPatients = processPatientData(patientCsv, patientColumnMapping);
      setPatients(processedPatients);
      setProgress(50);
      
      // Create a map of patient codes for transaction processing
      const patientMap = new Map<string, Patient>();
      processedPatients.forEach(patient => {
        patientMap.set(patient.code, patient);
      });
      
      // Process transaction data if available
      if (transactionCsv) {
        const transactionColumnMapping = JSON.parse(transactionMappings);
        const processedTransactions = processTransactionData(transactionCsv, transactionColumnMapping, patientMap);
        setTransactions(processedTransactions);
      }
      
      setProgress(100);
      setStep('preview');
      
      toast({
        title: "Data processed successfully",
        description: `${processedPatients.length} patients and ${transactions.length} transactions processed.`,
      });
    } catch (error) {
      console.error("Error processing data:", error);
      toast({
        variant: "destructive",
        title: "Error processing data",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const saveData = () => {
    try {
      // Save patients to localStorage
      if (patients.length > 0) {
        localStorage.setItem('patients', JSON.stringify(patients));
      }
      
      // Save transactions to localStorage
      if (transactions.length > 0) {
        localStorage.setItem('transactions', JSON.stringify(transactions));
      }
      
      setStep('done');
      
      toast({
        title: "Data imported successfully",
        description: "Your patient and transaction records have been imported.",
      });
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        variant: "destructive",
        title: "Error saving data",
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Data Import</h1>
        <p className="text-muted-foreground">Import your patient and transaction records from CSV files</p>
      </div>

      {step === 'upload' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Patient Records
              </CardTitle>
              <CardDescription>Upload a CSV file containing patient data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Input
                    id="patient-file"
                    type="file"
                    accept=".csv"
                    onChange={handlePatientFileUpload}
                  />
                </div>
                {patientCsv && (
                  <Alert variant="success" className="bg-green-50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Patient file ready</AlertTitle>
                    <AlertDescription>
                      Your patient data has been loaded successfully.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                Transaction Records
              </CardTitle>
              <CardDescription>Upload a CSV file containing transaction data (optional)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Input
                    id="transaction-file"
                    type="file"
                    accept=".csv"
                    onChange={handleTransactionFileUpload}
                  />
                </div>
                {transactionCsv && (
                  <Alert variant="success" className="bg-green-50">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Transaction file ready</AlertTitle>
                    <AlertDescription>
                      Your transaction data has been loaded successfully.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="md:col-span-2">
            <Button 
              onClick={() => setStep('mapping')} 
              disabled={!patientCsv}
              className="w-full md:w-auto"
            >
              Next: Configure Column Mappings
            </Button>
          </div>
        </div>
      )}

      {step === 'mapping' && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Configure Column Mappings</CardTitle>
              <CardDescription>
                Match columns from your CSV to the application's data model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'patients' | 'transactions')}>
                <TabsList className="mb-4">
                  <TabsTrigger value="patients">Patient Mappings</TabsTrigger>
                  <TabsTrigger value="transactions">Transaction Mappings</TabsTrigger>
                </TabsList>
                <TabsContent value="patients">
                  <div className="grid gap-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Patient Column Mappings</AlertTitle>
                      <AlertDescription>
                        Edit the JSON object to match your CSV column names with our data model.
                      </AlertDescription>
                    </Alert>
                    <Textarea 
                      value={patientMappings} 
                      onChange={(e) => setPatientMappings(e.target.value)} 
                      rows={15}
                      className="font-mono text-sm"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="transactions">
                  <div className="grid gap-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Transaction Column Mappings</AlertTitle>
                      <AlertDescription>
                        Edit the JSON object to match your CSV column names with our data model.
                      </AlertDescription>
                    </Alert>
                    <Textarea 
                      value={transactionMappings} 
                      onChange={(e) => setTransactionMappings(e.target.value)} 
                      rows={15}
                      className="font-mono text-sm"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('upload')}>
                Back
              </Button>
              <Button onClick={processData} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Process Data"}
              </Button>
            </CardFooter>
          </Card>
          
          {isProcessing && (
            <div className="grid gap-2">
              <Progress value={progress} />
              <p className="text-center text-sm text-muted-foreground">
                Processing data... {progress}%
              </p>
            </div>
          )}
        </div>
      )}

      {step === 'preview' && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Preview</CardTitle>
              <CardDescription>
                Review the processed data before importing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="patients">
                <TabsList>
                  <TabsTrigger value="patients">Patients ({patients.length})</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions ({transactions.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="patients" className="mt-4">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-muted sticky top-0">
                        <tr>
                          <th className="p-2 text-left">ID</th>
                          <th className="p-2 text-left">Name</th>
                          <th className="p-2 text-left">Code</th>
                          <th className="p-2 text-left">Age</th>
                          <th className="p-2 text-left">Sex</th>
                          <th className="p-2 text-left">Email</th>
                          <th className="p-2 text-left">Phone</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patients.slice(0, 10).map((patient, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{patient.id.substring(0, 8)}...</td>
                            <td className="p-2">{patient.firstName} {patient.lastName}</td>
                            <td className="p-2">{patient.code}</td>
                            <td className="p-2">{patient.age}</td>
                            <td className="p-2">{patient.sex}</td>
                            <td className="p-2">{patient.email}</td>
                            <td className="p-2">{patient.phone}</td>
                          </tr>
                        ))}
                        {patients.length > 10 && (
                          <tr>
                            <td colSpan={7} className="p-2 text-center text-muted-foreground">
                              ... and {patients.length - 10} more patients
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                <TabsContent value="transactions" className="mt-4">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-muted sticky top-0">
                        <tr>
                          <th className="p-2 text-left">ID</th>
                          <th className="p-2 text-left">Code</th>
                          <th className="p-2 text-left">Date</th>
                          <th className="p-2 text-left">Patient</th>
                          <th className="p-2 text-left">Type</th>
                          <th className="p-2 text-left">Amount</th>
                          <th className="p-2 text-left">Balance</th>
                          <th className="p-2 text-left">Claimed</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.slice(0, 10).map((transaction, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{transaction.id.substring(0, 8)}...</td>
                            <td className="p-2">{transaction.code}</td>
                            <td className="p-2">{transaction.date}</td>
                            <td className="p-2">{transaction.patientName}</td>
                            <td className="p-2">{transaction.type}</td>
                            <td className="p-2">₱{transaction.grossAmount.toLocaleString()}</td>
                            <td className="p-2">₱{transaction.balance.toLocaleString()}</td>
                            <td className="p-2">{transaction.claimed ? 'Yes' : 'No'}</td>
                          </tr>
                        ))}
                        {transactions.length > 10 && (
                          <tr>
                            <td colSpan={8} className="p-2 text-center text-muted-foreground">
                              ... and {transactions.length - 10} more transactions
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setStep('mapping')}>
                Back
              </Button>
              <Button onClick={saveData}>
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {step === 'done' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              Import Completed
            </CardTitle>
            <CardDescription>
              Your data has been successfully imported into the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="success" className="bg-green-50">
              <AlertTitle>Summary</AlertTitle>
              <AlertDescription>
                <ul className="list-disc pl-5 space-y-1">
                  <li>{patients.length} patients imported</li>
                  <li>{transactions.length} transactions imported</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button onClick={() => window.location.href = "/patients"}>
              Go to Patients
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
