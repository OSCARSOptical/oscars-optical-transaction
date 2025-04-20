
import { Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderNotesCardProps {
  transaction: Transaction;
}

export function OrderNotesCard({ transaction }: OrderNotesCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Order Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{transaction.orderNotes || "No order notes available."}</p>
      </CardContent>
    </Card>
  );
}
