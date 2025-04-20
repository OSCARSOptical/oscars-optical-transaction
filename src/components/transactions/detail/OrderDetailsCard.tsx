
import { Transaction } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OrderDetailsCardProps {
  transaction: Transaction;
}

export function OrderDetailsCard({ transaction }: OrderDetailsCardProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Parameter</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Lens Specifications</TableCell>
          <TableCell>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                RI: {transaction.refractiveIndex || "—"}
              </span>
              <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                Type: {transaction.lensType || "—"}
              </span>
              <span className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                Coating: {transaction.lensCoating || "—"}
              </span>
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Interpupillary Distance</TableCell>
          <TableCell>{transaction.interpupillaryDistance ? `${transaction.interpupillaryDistance} mm` : "—"}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
