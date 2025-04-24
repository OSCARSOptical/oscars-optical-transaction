
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { normalizePatientCode } from '@/utils/idNormalizer';
import { Input } from '@/components/ui/input';
import { Patient } from '@/types';
import Papa from 'papaparse';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function DataImport() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Patient[]>([]);
  const [editableData, setEditableData] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && (selectedFile.type === "text/csv" || selectedFile.name.endsWith('.csv'))) {
      setFile(selectedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          if (results.errors && results.errors.length > 0) {
            throw new Error(`Parse error: ${results.errors[0].message}`);
          }
          
          const data = results.data as Record<string, string>[];
          
          if (data.length === 0) {
            throw new Error("The CSV file appears to be empty");
          }
          
          // Check if required columns exist (more flexible column name matching)
          const requiredFields = ['id', 'name', 'age'];
          const headers = Object.keys(data[0]).map(h => h.toLowerCase());
          
          const missingFields = requiredFields.filter(field => {
            const fieldExists = headers.some(header => {
              switch (field) {
                case 'id':
                  return header.includes('id') || header.includes('code');
                case 'name': 
                  return header.includes('name') || (
                    (header.includes('first') || header.includes('given')) && 
                    headers.some(h => h.includes('last') || h.includes('family') || h.includes('surname'))
                  );
                case 'age':
                  return header.includes('age') || header.includes('birth');
                default:
                  return false;
              }
            });
            return !fieldExists;
          });
          
          if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
          }
          
          // Map CSV data to Patient objects with better error handling
          const patients: Patient[] = data.map((row, index) => {
            // Find the appropriate column names (case insensitive matching)
            const findColumn = (searchTerms: string[]): string => {
              for (const term of searchTerms) {
                const key = Object.keys(row).find(k => 
                  k.toLowerCase().includes(term.toLowerCase())
                );
                if (key && row[key]?.trim()) return row[key].trim();
              }
              return '';
            };

            // For patient ID
            const patientId = findColumn(['Patient ID', 'ID', 'Code']);
            
            // For patient name - handle full name that needs splitting
            const patientName = findColumn(['Patient Name', 'Name', 'Full Name']);
            const firstName = findColumn(['First Name', 'Given Name']);
            const lastName = findColumn(['Last Name', 'Family Name', 'Surname']);
            
            // Handle name splitting depending on what's available
            let firstNameValue = '';
            let lastNameValue = '';
            
            if (firstName && lastName) {
              // If first and last name are provided separately
              firstNameValue = firstName;
              lastNameValue = lastName;
            } else if (patientName) {
              // Default split: first word is firstName, rest is lastName
              const nameParts = patientName.split(' ');
              firstNameValue = nameParts[0] || '';
              lastNameValue = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
            }
            
            const age = findColumn(['Age']);
            const sex = findColumn(['Sex', 'Gender']);
            const phone = findColumn(['Contact', 'Phone', 'Mobile', 'Telephone']);
            const address = findColumn(['Address', 'Location']);
            const email = findColumn(['Email', 'E-mail']);
            
            return {
              id: crypto.randomUUID(),
              code: normalizePatientCode(patientId.trim() || `P${index + 1}`),
              firstName: firstNameValue,
              lastName: lastNameValue,
              age: parseInt(age) || 0,
              sex: sex?.trim()?.toLowerCase().startsWith('m') ? 'Male' : 'Female',
              email: email || '',
              phone: phone || '',
              address: address || '',
              createdDate: new Date().toISOString(),
              originalFullName: patientName || `${firstNameValue} ${lastNameValue}`
            } as Patient & { originalFullName: string };
          });

          setPreview(patients);
          setEditableData([...patients]);
          setIsLoading(false);
        } catch (error: any) {
          console.error('CSV processing error:', error);
          toast({
            title: "Error processing file",
            description: error.message || "Please check the file format and try again",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      },
      error: (error) => {
        console.error('PapaParse error:', error);
        toast({
          title: "Error processing file",
          description: "Could not parse the CSV file. Please check the format and try again.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    });
  };

  const handleEdit = (index: number) => {
    setCurrentPatient({...editableData[index]});
    setCurrentIndex(index);
    setEditDialogOpen(true);
  };

  const saveEdit = () => {
    if (currentPatient && currentIndex >= 0) {
      const updatedData = [...editableData];
      updatedData[currentIndex] = currentPatient;
      setEditableData(updatedData);
      setEditDialogOpen(false);
    }
  };

  const handleNameChange = (value: string, field: 'firstName' | 'lastName') => {
    if (currentPatient) {
      setCurrentPatient({
        ...currentPatient,
        [field]: value
      });
    }
  };

  const handleImport = () => {
    if (editableData.length === 0) return;

    try {
      // Store patients in localStorage
      editableData.forEach(patient => {
        localStorage.setItem(`patient_${patient.id}`, JSON.stringify(patient));
      });

      toast({
        title: "Import successful",
        description: `Imported ${editableData.length} patients`,
      });

      // Reset state
      setFile(null);
      setPreview([]);
      setEditableData([]);
      
      // Clear the file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: "There was an error saving the patient data",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Patient Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="max-w-sm"
        />
        
        <div className="flex gap-2">
          <Button onClick={handleUpload} disabled={!file || isLoading}>
            {isLoading ? "Processing..." : "Preview Data"}
          </Button>
          <Button onClick={handleImport} disabled={editableData.length === 0}>
            Import Data
          </Button>
        </div>

        {editableData.length > 0 && (
          <div className="border rounded-md shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Sex</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {editableData.map((patient, index) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.code}</TableCell>
                    <TableCell>{patient.firstName}</TableCell>
                    <TableCell>{patient.lastName}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.sex}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(index)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Patient</DialogTitle>
              <DialogDescription>
                Make changes to patient information below. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            
            {currentPatient && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right text-sm">Original Name:</label>
                  <div className="col-span-3 font-medium text-gray-600">
                    {(currentPatient as any).originalFullName || `${currentPatient.firstName} ${currentPatient.lastName}`}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="firstName" className="text-right text-sm">First Name:</label>
                  <Input
                    id="firstName"
                    value={currentPatient.firstName}
                    onChange={(e) => handleNameChange(e.target.value, 'firstName')}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="lastName" className="text-right text-sm">Last Name:</label>
                  <Input
                    id="lastName"
                    value={currentPatient.lastName}
                    onChange={(e) => handleNameChange(e.target.value, 'lastName')}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="age" className="text-right text-sm">Age:</label>
                  <Input
                    id="age"
                    type="number"
                    value={currentPatient.age}
                    onChange={(e) => currentPatient && setCurrentPatient({
                      ...currentPatient,
                      age: parseInt(e.target.value) || 0
                    })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="sex" className="text-right text-sm">Sex:</label>
                  <select 
                    id="sex"
                    value={currentPatient.sex}
                    onChange={(e) => currentPatient && setCurrentPatient({
                      ...currentPatient,
                      sex: e.target.value as 'Male' | 'Female'
                    })}
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="phone" className="text-right text-sm">Phone:</label>
                  <Input
                    id="phone"
                    value={currentPatient.phone}
                    onChange={(e) => currentPatient && setCurrentPatient({
                      ...currentPatient,
                      phone: e.target.value
                    })}
                    className="col-span-3"
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button type="button" onClick={() => setEditDialogOpen(false)} variant="outline">Cancel</Button>
              <Button type="button" onClick={saveEdit}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
