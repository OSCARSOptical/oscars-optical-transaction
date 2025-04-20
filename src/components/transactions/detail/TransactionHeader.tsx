
import { Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";
import { formatDate, getTypeColor } from '@/utils/formatters';

interface TransactionHeaderProps {
  transaction: Transaction;
  onClaimedToggle: () => void;
}

export function TransactionHeader({ transaction, onClaimedToggle }: TransactionHeaderProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">Transaction {transaction.code}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Transaction Date</h3>
            <p className="text-lg font-medium">{formatDate(transaction.date)}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Transaction Type</h3>
            <Badge variant="outline" className={getTypeColor(transaction.type)}>
              {transaction.type}
            </Badge>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Claimed Status</h3>
            <div className="flex items-center space-x-2 mt-1">
              <Checkbox 
                checked={transaction.claimed} 
                onCheckedChange={onClaimedToggle}
                id="claimed"
              />
              <label htmlFor="claimed" className="text-sm cursor-pointer">
                {transaction.claimed ? 'Claimed' : 'Not Claimed'}
              </label>
              {transaction.claimed && (
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-500">Claimed on {formatDate(transaction.dateClaimed)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
