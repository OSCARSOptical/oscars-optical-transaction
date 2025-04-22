
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function TransactionTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px] print:hidden">Select</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Transaction ID</TableHead>
        <TableHead>Patient Name</TableHead>
        <TableHead>Transaction Type</TableHead>
        <TableHead>RI</TableHead>
        <TableHead>Frame Type</TableHead>
        <TableHead>Lens Type</TableHead>
        <TableHead>Lens Coating</TableHead>
        <TableHead className="text-right">Lens Capital</TableHead>
        <TableHead className="text-right">Edging Price</TableHead>
        <TableHead className="text-right">Other Expenses</TableHead>
        <TableHead className="text-right">Total</TableHead>
        <TableHead>Notes</TableHead>
      </TableRow>
    </TableHeader>
  );
}
