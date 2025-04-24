
import { DataImport } from "@/components/data-import/DataImport";

export default function DataImportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Data Import</h2>
        <p className="text-muted-foreground">Import your patient and transaction records</p>
      </div>
      <DataImport />
    </div>
  );
}
