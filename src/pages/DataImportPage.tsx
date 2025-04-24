
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
          <TabsTrigger value="transactions" disabled>Transaction Data</TabsTrigger>
        </TabsList>
        <TabsContent value="patients" className="mt-4">
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
