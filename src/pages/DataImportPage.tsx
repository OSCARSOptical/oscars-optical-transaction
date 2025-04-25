
import { DataImport } from "@/components/data-import/DataImport";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DataImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Data Import</h2>
        <p className="text-muted-foreground">Import your patient and transaction records</p>
      </div>
      <Tabs defaultValue="patients" className="w-full">
        <TabsList>
          <TabsTrigger value="patients">Patient Data</TabsTrigger>
          <TabsTrigger value="transactions">Transaction Data</TabsTrigger>
        </TabsList>
        <TabsContent value="patients" className="mt-4">
          <div className="mb-6 p-4 bg-muted/50 rounded-md border border-muted">
            <h3 className="text-lg font-medium mb-2">CSV Import Format Guide</h3>
            <p className="text-sm text-muted-foreground mb-2">Your CSV file should include the following columns:</p>
            <ul className="list-disc pl-6 text-sm space-y-1 text-muted-foreground">
              <li><strong>Patient ID/Code</strong> - Will be normalized to format PX-XX-0000000</li>
              <li><strong>Patient Name</strong> - Full name will be split into first and last name</li>
              <li><strong>Age</strong> - Patient's age</li>
              <li><strong>Sex/Gender</strong> - Will be mapped to Male/Female</li>
              <li><strong>Address</strong> - Patient's address information</li>
              <li><strong>Contact/Phone</strong> - Patient's contact number</li>
              <li><strong>Email</strong> - Optional email address</li>
            </ul>
          </div>
          <DataImport />
        </TabsContent>
        <TabsContent value="transactions" className="mt-4">
          <div className="p-4 text-muted-foreground border rounded-md">
            Transaction import functionality coming soon.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
