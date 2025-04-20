
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Edit2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Transaction, Patient } from '@/types';
import OrderDetails from '@/components/transactions/create/OrderDetails';

// Shared mock data store - in a real app, this would come from a backend API
const mockTransactions: Transaction[] = [
  {
    id: "1",
    code: "TX25-04-0001",
    date: "2025-04-10",
    patientCode: "PX-JD-12345",
    patientName: "John Doe",
    firstName: "John",
    lastName: "Doe",
    type: "Eye Exam",
    grossAmount: 150.00,
    deposit: 50.00,
    balance: 100.00
  },
  {
    id: "2",
    code: "TX25-04-0002",
    date: "2025-04-08",
    patientCode: "PX-JS-67890",
    patientName: "Jane Smith",
    firstName: "Jane",
    lastName: "Smith",
    type: "Frame Replacement",
    grossAmount: 300.00,
    deposit: 150.00,
    balance: 150.00
  }
];

const mockPatients: Patient[] = [
  {
    id: '12345',
    firstName: 'John',
    lastName: 'Doe',
    age: 35,
    email: 'john@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, City, State',
    code: 'PX-JD-12345'
  },
  {
    id: '67890',
    firstName: 'Jane',
    lastName: 'Smith',
    age: 28,
    email: 'jane@example.com',
    phone: '(555) 987-6543',
    address: '456 Oak St, City, State',
    code: 'PX-JS-67890'
  }
];

const TransactionDetail = () => {
  const { transactionCode } = useParams();
  const { toast } = useToast();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [activeTab, setActiveTab] = useState('previous');
  const [doctorName, setDoctorName] = useState('Dr. Sarah Johnson');
  const [doctorRemarks, setDoctorRemarks] = useState('Patient reports occasional headaches when reading for extended periods. Recommended blue light filtering lenses.');
  const [orderNotes, setOrderNotes] = useState('Rush order. Patient needs glasses before international trip next week.');

  useEffect(() => {
    // Find the transaction with the matching code
    const foundTransaction = mockTransactions.find(t => t.code === transactionCode);
    
    if (foundTransaction) {
      setTransaction(foundTransaction);
      setTransactionType(foundTransaction.type);
      
      // Find the associated patient
      const foundPatient = mockPatients.find(p => p.code === foundTransaction.patientCode);
      
      if (foundPatient) {
        setPatient(foundPatient);
        setFirstName(foundPatient.firstName);
        setLastName(foundPatient.lastName);
      } else {
        toast({
          title: "Patient Not Found",
          description: "Patient record associated with this transaction could not be found.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Transaction Not Found",
        description: `Transaction with code ${transactionCode} could not be found.`,
        variant: "destructive"
      });
    }
  }, [transactionCode, toast]);

  // Save changes when editing patient information
  const handleSaveEdit = () => {
    if (isEditing && patient) {
      // In a real app, this would update the database
      setPatient({
        ...patient,
        firstName,
        lastName
      });
      
      // Update the transaction record too
      if (transaction) {
        setTransaction({
          ...transaction,
          firstName,
          lastName,
          patientName: `${firstName} ${lastName}`
        });
      }
    }
    setIsEditing(!isEditing);
  };

  // Determine if the Refraction card should be shown based on transaction type
  const shouldShowRefraction = () => {
    return transactionType !== 'Frame Replacement' && transactionType !== 'Repair';
  };

  if (!transaction || !patient) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Transaction Details</h2>
          <p className="text-muted-foreground">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">Transaction Details</h2>
        <p className="text-muted-foreground">Viewing detailed information for transaction {transactionCode}</p>
      </div>

      {/* Header Card */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-2xl font-bold">
            {isEditing ? (
              <div className="flex gap-4">
                <Input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                />
                <Input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                />
              </div>
            ) : (
              <span>
                {patient.firstName} {patient.lastName}
              </span>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveEdit}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            {isEditing ? "Save" : "Edit"}
          </Button>
        </CardHeader>
        <CardContent className="flex justify-between items-center">
          <div>Patient Code: {patient.code}</div>
          <div>Transaction Code: {transaction.code}</div>
        </CardContent>
      </Card>

      {/* Patient Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={patient.firstName} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={patient.lastName} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" value={patient.age} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Number</Label>
              <Input id="phone" value={patient.phone} readOnly />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" value={patient.email} readOnly />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" value={patient.address} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="transactionType">Transaction Type</Label>
              <Select 
                value={transactionType} 
                onValueChange={setTransactionType}
              >
                <SelectTrigger id="transactionType">
                  <SelectValue placeholder="Select Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="Frame Replacement">Frame Replacement</SelectItem>
                  <SelectItem value="Lens Replacement">Lens Replacement</SelectItem>
                  <SelectItem value="Eye Exam">Eye Examination</SelectItem>
                  <SelectItem value="Medical Certificate">Medical Certificate</SelectItem>
                  <SelectItem value="Contact Lens">Contact Lens</SelectItem>
                  <SelectItem value="Repair">Repair</SelectItem>
                  <SelectItem value="Return">Return</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionDate">Date</Label>
              <Input
                id="transactionDate"
                type="date"
                value={transaction.date}
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Card */}
      <OrderDetails />

      {/* Refraction Card - conditionally rendered based on transaction type */}
      {shouldShowRefraction() && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Refraction</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="previous">Previous Rx</TabsTrigger>
                <TabsTrigger value="full">Full Rx</TabsTrigger>
                <TabsTrigger value="prescribed">Prescribed Power</TabsTrigger>
              </TabsList>
              
              {['previous', 'full', 'prescribed'].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-left">Rx</th>
                          <th className="py-2 px-4 text-left">Sphere</th>
                          <th className="py-2 px-4 text-left">Cylinder</th>
                          <th className="py-2 px-4 text-left">Axis</th>
                          <th className="py-2 px-4 text-left">Visual Acuity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-2 px-4">OD</td>
                          <td className="py-2 px-4">
                            <Select defaultValue="-0.50">
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 61 }, (_, i) => (i - 20).toFixed(2)).map(value => (
                                  <SelectItem key={value} value={value === "0.00" ? "Plano" : value}>
                                    {value === "0.00" ? "Plano" : value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-2 px-4">
                            <Select defaultValue="-0.75">
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 24 }, (_, i) => (-0.25 * (i + 1)).toFixed(2)).map(value => (
                                  <SelectItem key={value} value={value}>{value}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-2 px-4">
                            <Select defaultValue="90">
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 180 }, (_, i) => i + 1).map(value => (
                                  <SelectItem key={value} value={value.toString()}>{value}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-2 px-4">
                            <Select defaultValue="20/20">
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="20/200">20/200</SelectItem>
                                <SelectItem value="20/100">20/100</SelectItem>
                                <SelectItem value="20/80">20/80</SelectItem>
                                <SelectItem value="20/60">20/60</SelectItem>
                                <SelectItem value="20/40">20/40</SelectItem>
                                <SelectItem value="20/30">20/30</SelectItem>
                                <SelectItem value="20/25">20/25</SelectItem>
                                <SelectItem value="20/20">20/20</SelectItem>
                                <SelectItem value="CF">CF</SelectItem>
                                <SelectItem value="LP">LP</SelectItem>
                                <SelectItem value="NLP">NLP</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">OS</td>
                          <td className="py-2 px-4">
                            <Select defaultValue="-0.75">
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 61 }, (_, i) => (i - 20).toFixed(2)).map(value => (
                                  <SelectItem key={value} value={value === "0.00" ? "Plano" : value}>
                                    {value === "0.00" ? "Plano" : value}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-2 px-4">
                            <Select defaultValue="-0.50">
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 24 }, (_, i) => (-0.25 * (i + 1)).toFixed(2)).map(value => (
                                  <SelectItem key={value} value={value}>{value}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-2 px-4">
                            <Select defaultValue="85">
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 180 }, (_, i) => i + 1).map(value => (
                                  <SelectItem key={value} value={value.toString()}>{value}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-2 px-4">
                            <Select defaultValue="20/20">
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="20/200">20/200</SelectItem>
                                <SelectItem value="20/100">20/100</SelectItem>
                                <SelectItem value="20/80">20/80</SelectItem>
                                <SelectItem value="20/60">20/60</SelectItem>
                                <SelectItem value="20/40">20/40</SelectItem>
                                <SelectItem value="20/30">20/30</SelectItem>
                                <SelectItem value="20/25">20/25</SelectItem>
                                <SelectItem value="20/20">20/20</SelectItem>
                                <SelectItem value="CF">CF</SelectItem>
                                <SelectItem value="LP">LP</SelectItem>
                                <SelectItem value="NLP">NLP</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4">ADD</td>
                          <td className="py-2 px-4">
                            <Select defaultValue="2.00">
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 9 }, (_, i) => (1 + i * 0.25).toFixed(2)).map(value => (
                                  <SelectItem key={value} value={value}>{value}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-2 px-4"></td>
                          <td className="py-2 px-4"></td>
                          <td className="py-2 px-4"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Doctor & Remarks Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Doctor & Remarks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctor">Attending Doctor</Label>
              <Input 
                id="doctor" 
                value={doctorName} 
                onChange={(e) => setDoctorName(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="remarks">Doctor's Remarks</Label>
              <Textarea 
                id="remarks" 
                value={doctorRemarks} 
                onChange={(e) => setDoctorRemarks(e.target.value)} 
                rows={4} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Notes Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Order Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Textarea 
              id="orderNotes" 
              value={orderNotes} 
              onChange={(e) => setOrderNotes(e.target.value)} 
              rows={4} 
              placeholder="Enter any additional notes or instructions for this order..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionDetail;
