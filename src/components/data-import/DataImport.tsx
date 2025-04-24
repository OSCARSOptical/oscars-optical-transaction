
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { normalizePatientCode } from '@/utils/idNormalizer';
import { Input } from '@/components/ui/input';
import { Patient } from '@/types';
import Papa from 'papaparse';

export function DataImport() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
          
          // Check if required columns exist
          const requiredColumns = ['Patient ID', 'Patient Name', 'Age'];
          const firstRow = data[0];
          const missingColumns = requiredColumns.filter(col => 
            !Object.keys(firstRow).some(header => 
              header.toLowerCase().includes(col.toLowerCase())
            )
          );
          
          if (missingColumns.length > 0) {
            throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
          }
          
          // Map CSV data to Patient objects with better error handling
          const patients: Patient[] = data.map((row, index) => {
            // Find the appropriate column names (case insensitive matching)
            const findColumn = (searchTerm: string): string => {
              const key = Object.keys(row).find(k => 
                k.toLowerCase().includes(searchTerm.toLowerCase())
              );
              return key ? row[key].trim() : '';
            };
            
            const patientId = findColumn('Patient ID') || findColumn('ID');
            const patientName = findColumn('Patient Name') || findColumn('Name');
            const age = findColumn('Age');
            const sex = findColumn('Sex') || findColumn('Gender');
            const phone = findColumn('Contact') || findColumn('Phone') || findColumn('Mobile');
            const address = findColumn('Address') || findColumn('Location');
            
            if (!patientId) {
              console.warn(`Row ${index + 1}: Missing Patient ID`);
            }
            
            const nameParts = patientName.split(' ');
            const firstName = nameParts[0] || '';
            const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
            
            return {
              id: crypto.randomUUID(),
              code: normalizePatientCode(patientId.trim()),
              firstName,
              lastName,
              age: parseInt(age) || 0,
              sex: sex?.trim()?.toLowerCase().startsWith('m') ? 'Male' : 'Female',
              email: '',
              phone: phone || '',
              address: address || '',
              createdDate: new Date().toISOString(),
            };
          });

          setPreview(patients);
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

  const handleImport = () => {
    if (preview.length === 0) return;

    try {
      // Store patients in localStorage
      preview.forEach(patient => {
        localStorage.setItem(`patient_${patient.id}`, JSON.stringify(patient));
      });

      toast({
        title: "Import successful",
        description: `Imported ${preview.length} patients`,
      });

      // Reset state
      setFile(null);
      setPreview([]);
      
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
          <Button onClick={handleImport} disabled={preview.length === 0}>
            Import Data
          </Button>
        </div>

        {preview.length > 0 && (
          <Alert>
            <AlertDescription>
              Preview: {preview.length} patients ready to import
              <pre className="mt-2 text-sm">
                {JSON.stringify(preview[0], null, 2)}
              </pre>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
