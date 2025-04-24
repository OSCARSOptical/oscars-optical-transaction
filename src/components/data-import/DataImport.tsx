
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileText, Upload } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCSVImport } from './hooks/useCSVImport';
import { EditPatientDialog } from './components/EditPatientDialog';
import { ImportPreviewTable } from './components/ImportPreviewTable';
import { Patient } from '@/types';

export function DataImport() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const {
    file,
    editableData,
    setEditableData,
    isLoading,
    errorMessage,
    csvHeaders,
    handleFileChange,
    handleUpload,
    handleImport
  } = useCSVImport();

  const handleEdit = (index: number) => {
    setCurrentPatient({...editableData[index]});
    setCurrentIndex(index);
    setEditDialogOpen(true);
  };

  const handlePatientChange = (field: keyof Patient, value: string | number) => {
    if (currentPatient) {
      setCurrentPatient({
        ...currentPatient,
        [field]: value
      });
    }
  };

  const saveEdit = () => {
    if (currentPatient && currentIndex >= 0) {
      const updatedData = [...editableData];
      updatedData[currentIndex] = currentPatient;
      setEditableData(updatedData);
      setEditDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Patient Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Choose CSV File</label>
          <Input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="max-w-sm"
          />
          <p className="text-sm text-muted-foreground">
            Your CSV should contain at least patient name and patient ID columns
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleUpload} 
            disabled={!file || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? "Processing..." : 
              <>
                <FileText className="h-4 w-4" />
                Preview Data
              </>
            }
          </Button>
          
          <Button 
            onClick={handleImport} 
            disabled={editableData.length === 0}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import Data
          </Button>
        </div>
        
        {csvHeaders.length > 0 && (
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm font-medium mb-2">Detected columns:</p>
            <div className="flex flex-wrap gap-2">
              {csvHeaders.map(header => (
                <Badge key={header} variant="outline">{header}</Badge>
              ))}
            </div>
          </div>
        )}

        {errorMessage && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {editableData.length > 0 && (
          <ImportPreviewTable 
            data={editableData}
            onEdit={handleEdit}
          />
        )}
        
        <EditPatientDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          patient={currentPatient}
          onSave={saveEdit}
          onPatientChange={handlePatientChange}
        />
      </CardContent>
    </Card>
  );
}
