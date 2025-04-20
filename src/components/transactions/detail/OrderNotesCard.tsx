
import { Transaction } from '@/types';

interface OrderNotesCardProps {
  transaction: Transaction;
}

export function OrderNotesCard({ transaction }: OrderNotesCardProps) {
  return (
    <div className="space-y-2">
      <p className="whitespace-pre-line">{transaction.orderNotes || "No order notes available."}</p>
    </div>
  );
}
