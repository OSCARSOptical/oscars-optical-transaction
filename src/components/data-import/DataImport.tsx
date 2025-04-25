
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileText, Upload } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { useCSVImport } from './hooks/useCSVImport';
import { EditPatientDialog } from './components/EditPatientDialog';
import { ImportPreviewTable } from './components/ImportPreviewTable';
import { Patient } from '@/types';

export function DataImport() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [duplicates, setDuplicates] = useState<Set<number>>(new Set());

  const {
    file,
    editableData,
    setEditableData,
    isLoading,
    errorMessage,
    csvHeaders,
    rawData,
    duplicates: detectedDuplicates,
    handleFileChange,
    handleUpload,
    handleImport
  } = useCSVImport();

  // Update the duplicates state when detected duplicates change
  useEffect(() => {
    if (detectedDuplicates) {
      setDuplicates(detectedDuplicates);
    }
  }, [detectedDuplicates]);

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

  const handleSelectRow = (index: number, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(index);
    } else {
      newSelected.delete(index);
    }
    setSelectedRows(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIndexes = new Set(editableData.map((_, index) => index));
      setSelectedRows(allIndexes);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleImportSelected = () => {
    const selectedData = Array.from(selectedRows).map(index => editableData[index]);
    handleImport(selectedData);
    setSelectedRows(new Set());
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
            onClick={handleImportSelected}
            disabled={selectedRows.size === 0}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Import Selected ({selectedRows.size})
          </Button>
        </div>
        
        {errorMessage && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {editableData.length > 0 && (
          <ImportPreviewTable 
            data={editableData}
            rawData={rawData}
            onEdit={handleEdit}
            selectedRows={selectedRows}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
            duplicates={duplicates}
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
