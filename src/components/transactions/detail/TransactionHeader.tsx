
import { Transaction } from '@/types';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { addBalanceSheetEntry, removeBalanceSheetEntry } from '@/utils/balanceSheetUtils';
import { UnclaimConfirmDialog } from '../UnclaimConfirmDialog';
import { findPayment } from '@/utils/paymentsUtils';

interface TransactionHeaderProps {
  transaction: Transaction;
  onClaimedToggle: () => void;
  readOnly?: boolean;
  pageTitle?: string; // "Transaction Details" or "New Transaction"
  patientName?: string;
  patientCode?: string;
}

function formatDateLong(dateString: string | null) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function TransactionHeader({
  transaction,
  onClaimedToggle,
  readOnly = false,
  pageTitle = "Transaction Details",
  patientName = "",
  patientCode = ""
}: TransactionHeaderProps) {
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
      {/* CARD 1: Title + Transaction ID (left) and Patient Name/ID (right) */}
      <Card className="mb-4 bg-white border border-gray-200 shadow-sm rounded-xl">
        <CardContent className="py-6 px-6">
          <div className="flex flex-col md:flex-row justify-between md:items-start">
            {/* Left: Page title and transaction ID */}
            <div>
              <div className="text-2xl md:text-2xl font-bold text-[#1A1F2C] mb-0" style={{ letterSpacing: ".02em" }}>
                {pageTitle}
              </div>
              <div className="text-base font-normal text-[#8E9196] mt-1">
                {localTransaction.code}
              </div>
            </div>
            {/* Right: Patient name and code */}
            {(patientName || patientCode) && (
              <div className="flex flex-col items-end mt-4 md:mt-0">
                <span className="text-xl font-bold text-[#1A1F2C]">{patientName}</span>
                <span className="font-normal text-[#8E9196] text-base">{patientCode}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* CARD 2: Modern minimalist Transaction Details */}
      <Card className="mb-2 border-2 border-[#E2E4EB] rounded-2xl shadow-xs bg-white/80">
        <CardContent className="py-3 px-6">
          <div className="flex flex-col space-y-4">
            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-0">
              {/* Transaction Date */}
              <div className="flex flex-col items-center px-2">
                <span className="text-sm font-medium text-[#8E9196] mb-1">
                  Transaction Date
                </span>
                <span className="text-lg md:text-xl font-semibold text-[#1A1F2C] leading-snug text-center">
                  {formatDateLong(localTransaction.date)}
                </span>
              </div>
              {/* Claimed Status */}
              <div className="flex flex-col items-center px-2">
                <span className="text-sm font-medium text-[#8E9196] mb-1">
                  Claimed Status
                </span>
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={localTransaction.claimed}
                    onCheckedChange={handleClaimedChange}
                    id="claimed"
                    disabled={readOnly}
                    className={`h-6 w-6 border-2 !border-[#8E9196] bg-white mx-auto
                      ${localTransaction.claimed
                        ? "!border-[#ea384c] !bg-[#ea384c]/10 !text-[#ea384c]"
                        : "!text-[#8E9196]"
                    }`}
                    style={{
                      color: localTransaction.claimed ? "#ea384c" : "#8E9196",
                    }}
                  />
                </div>
              </div>
              {/* Claimed On */}
              <div className="flex flex-col items-center px-2">
                <span className="text-sm font-medium text-[#8E9196] mb-1">
                  Claimed On
                </span>
                <span className="text-lg md:text-xl font-semibold text-[#1A1F2C] leading-snug text-center">
                  {localTransaction.claimed && localTransaction.dateClaimed
                    ? formatDateLong(localTransaction.dateClaimed)
                    : <span className="text-[#8E9196]">Unclaimed</span>}
                </span>
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

