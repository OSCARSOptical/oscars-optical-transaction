
import { Transaction } from '@/types';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit } from "lucide-react";
import { formatDate, getTypeColor } from '@/utils/formatters';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { addBalanceSheetEntry, removeBalanceSheetEntry } from '@/utils/balanceSheetUtils';
import { UnclaimConfirmDialog } from '../UnclaimConfirmDialog';
import { findPayment } from '@/utils/paymentsUtils';
import { Button } from "@/components/ui/button";

interface TransactionHeaderProps {
  transaction: Transaction;
  onClaimedToggle: () => void;
  onEdit?: () => void;
  readOnly?: boolean;
}

export function TransactionHeader({ transaction, onClaimedToggle, onEdit, readOnly = false }: TransactionHeaderProps) {
  const { toast } = useToast();
  const [showUnclaimDialog, setShowUnclaimDialog] = useState(false);
  const [localTransaction, setLocalTransaction] = useState<Transaction>(transaction);

  const handleClaimedChange = (checked: boolean | string) => {
    if (readOnly) return;

    if (localTransaction.claimed) {
      setShowUnclaimDialog(true);
      return;
    }

    const balancePaid = localTransaction.balance;
    const today = new Date().toISOString().split('T')[0];

    addBalanceSheetEntry({
      date: today,
      transactionId: localTransaction.code,
      balancePaid: balancePaid,
      patientCode: localTransaction.patientCode
    });

    setLocalTransaction({
      ...localTransaction,
      claimed: true,
      dateClaimed: today,
      balance: 0,
      deposit: localTransaction.deposit + balancePaid
    });

    onClaimedToggle();

    toast({
      title: "✓ Payment Claimed!",
      description: `Balance of ${balancePaid.toLocaleString('en-US', { style: 'currency', currency: 'PHP' })} has been collected and recorded.`,
      className: "bg-[#FFC42B] text-[#241715] rounded-lg",
      duration: 3000,
    });
  };

  const handleUnclaimConfirm = () => {
    if (!localTransaction.dateClaimed) return;

    removeBalanceSheetEntry({
      date: localTransaction.dateClaimed,
      transactionId: localTransaction.code
    });

    const payment = findPayment(localTransaction.code, 'balance');
    const amountToRestore = payment?.amount ||
      (localTransaction.grossAmount - localTransaction.deposit + localTransaction.balance);

    setLocalTransaction({
      ...localTransaction,
      claimed: false,
      dateClaimed: null,
      balance: amountToRestore,
      deposit: localTransaction.deposit - amountToRestore
    });

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
      <Card className="mb-2 bg-white border border-gray-200 shadow-sm">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <span
            className="text-2xl font-bold text-[#1A1F2C]"
            style={{ letterSpacing: ".02em" }}
          >
            {localTransaction.code}
          </span>
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="gap-1"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Transaction Date</h3>
              <p className="text-base font-semibold text-[#1A1F2C] text-center">
                {formatDate(localTransaction.date)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Transaction Type</h3>
              <Badge
                variant="outline"
                className={`border-green-200 text-green-800 bg-green-50 font-normal text-base px-4 py-1 rounded-full min-w-[90px] flex items-center justify-center mx-auto ${getTypeColor(localTransaction.type)}`}
              >
                {localTransaction.type}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Claimed Status</h3>
              <div className="flex items-center justify-center gap-2">
                <Checkbox
                  checked={localTransaction.claimed}
                  onCheckedChange={handleClaimedChange}
                  id="claimed"
                  disabled={readOnly}
                  className={`border-2 ${localTransaction.claimed
                    ? "border-green-700 bg-green-100"
                    : "border-red-400 bg-white"
                  }`}
                />
                <label
                  htmlFor="claimed"
                  className={`text-base font-medium ${localTransaction.claimed
                    ? "text-green-700"
                    : "text-red-600"
                  }`}
                >
                  {localTransaction.claimed ? 'Claimed' : 'Not Claimed'}
                </label>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Claimed On</h3>
              <p className="text-base font-semibold text-[#1A1F2C] text-center">
                {localTransaction.claimed && localTransaction.dateClaimed
                  ? formatDate(localTransaction.dateClaimed)
                  : "—"}
              </p>
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
