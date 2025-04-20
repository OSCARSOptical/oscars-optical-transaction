
import { Transaction } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from "lucide-react";
import { formatDate, getTypeColor, formatCurrency } from '@/utils/formatters';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { addBalanceSheetEntry, removeBalanceSheetEntry } from '@/utils/balanceSheetUtils';
import { UnclaimConfirmDialog } from '../UnclaimConfirmDialog';
import { addPayment, removePayment, findPayment } from '@/utils/paymentsUtils';

interface TransactionHeaderProps {
  transaction: Transaction;
  onClaimedToggle: () => void;
}

export function TransactionHeader({ transaction, onClaimedToggle }: TransactionHeaderProps) {
  const { toast } = useToast();
  const [showUnclaimDialog, setShowUnclaimDialog] = useState(false);
  const [localTransaction, setLocalTransaction] = useState<Transaction>(transaction);
  
  const handleClaimedChange = (checked: boolean | string) => {
    if (localTransaction.claimed) {
      // Show confirmation dialog for unclaiming
      setShowUnclaimDialog(true);
      return;
    }
    
    // Process claiming
    const balancePaid = localTransaction.balance;
    const today = new Date().toISOString().split('T')[0];
    
    // Add balance sheet entry with patient code for navigation
    addBalanceSheetEntry({
      date: today,
      transactionId: localTransaction.code,
      balancePaid: balancePaid,
      patientCode: localTransaction.patientCode
    });
    
    // Update local state
    setLocalTransaction({
      ...localTransaction,
      claimed: true,
      dateClaimed: today,
      balance: 0,
      deposit: localTransaction.deposit + balancePaid // Optionally update deposit (total collected)
    });
    
    // Call parent handler to update parent state
    onClaimedToggle();
    
    toast({
      title: "✓ Payment Claimed!",
      description: `Balance of ${formatCurrency(balancePaid)} has been collected and recorded.`,
      className: "bg-[#FFC42B] text-[#241715] rounded-lg",
      duration: 3000,
    });
  };
  
  const handleUnclaimConfirm = () => {
    if (!localTransaction.dateClaimed) return;
    
    // Remove balance sheet entry
    removeBalanceSheetEntry({
      date: localTransaction.dateClaimed,
      transactionId: localTransaction.code
    });
    
    // Find the payment amount to restore (should be the same as was paid)
    const payment = findPayment(localTransaction.code, 'balance');
    const amountToRestore = payment?.amount || 
      (localTransaction.grossAmount - localTransaction.deposit + localTransaction.balance);
    
    // Update local state
    setLocalTransaction({
      ...localTransaction,
      claimed: false,
      dateClaimed: null,
      balance: amountToRestore,
      deposit: localTransaction.deposit - amountToRestore // Restore original deposit
    });
    
    // Call parent handler to update parent state
    onClaimedToggle();
    
    setShowUnclaimDialog(false);
    
    toast({
      title: "Claim Removed",
      description: "Transaction restored to unclaimed status and balance sheet entry removed.",
      variant: "default"
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold">Transaction {localTransaction.code}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Transaction Date</h3>
              <p className="text-lg font-medium">{formatDate(localTransaction.date)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Transaction Type</h3>
              <Badge variant="outline" className={getTypeColor(localTransaction.type)}>
                {localTransaction.type}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Claimed Status</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Checkbox 
                  checked={localTransaction.claimed} 
                  onCheckedChange={handleClaimedChange}
                  id="claimed"
                />
                <label htmlFor="claimed" className="text-sm cursor-pointer">
                  {localTransaction.claimed ? 'Claimed' : 'Not Claimed'}
                </label>
                {localTransaction.claimed && (
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-500">Claimed on {formatDate(localTransaction.dateClaimed)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <UnclaimConfirmDialog
        open={showUnclaimDialog}
        onOpenChange={setShowUnclaimDialog}
        onConfirm={handleUnclaimConfirm}
      />
    </>
  );
}
