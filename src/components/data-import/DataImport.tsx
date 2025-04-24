
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { normalizePatientCode } from '@/utils/idNormalizer';
import { Input } from '@/components/ui/input';
import { Patient } from '@/types';

export function DataImport() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
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
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0];

        // Skip header row and process data
        const patients: Patient[] = rows.slice(1)
          .filter(row => row.length === headers.length)
          .map((row, index) => {
            const rawPatientCode = row[headers.indexOf('Patient ID')].trim();
            return {
              id: crypto.randomUUID(),
              code: normalizePatientCode(rawPatientCode),
              firstName: row[headers.indexOf('Patient Name')].split(' ')[0].trim(),
              lastName: row[headers.indexOf('Patient Name')].split(' ').slice(1).join(' ').trim(),
              age: parseInt(row[headers.indexOf('Age')]) || 0,
              sex: row[headers.indexOf('Sex')].trim() === 'M' ? 'Male' : 'Female',
              email: '',
              phone: row[headers.indexOf('Contact Number')].trim(),
              address: row[headers.indexOf('Address')].trim(),
              createdDate: new Date().toISOString(),
            };
          });

        setPreview(patients);
      } catch (error) {
        toast({
          title: "Error processing file",
          description: "Please check the file format and try again",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };

    reader.readAsText(file);
  };

  const handleImport = () => {
    if (preview.length === 0) return;

    // Store in localStorage for now (we'll integrate with Supabase later)
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
            Preview Data
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
