
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
          <TableCell className="font-medium">Refractive Index</TableCell>
          <TableCell>{transaction.refractiveIndex || "—"}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Lens Type</TableCell>
          <TableCell>{transaction.lensType || "—"}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Lens Coating</TableCell>
          <TableCell>{transaction.lensCoating || "—"}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Interpupillary Distance</TableCell>
          <TableCell>{transaction.interpupillaryDistance ? `${transaction.interpupillaryDistance} mm` : "—"}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
