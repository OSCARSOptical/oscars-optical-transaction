
import { useNavigate } from 'react-router-dom';
import { TableCell, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal, Copy } from "lucide-react";
import { Transaction } from '@/types';
import { formatDate, formatCurrency, getTypeColor } from '@/utils/formatters';
import { useState } from "react";

interface TransactionTableRowProps {
  transaction: Transaction;
  onClaimedToggle: (id: string, currentValue: boolean) => void;
  onCopyNumber?: (number: string) => void; // For individual copy
}

export function TransactionTableRow({
  transaction,
  onClaimedToggle,
  onCopyNumber
}: TransactionTableRowProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Format for "Claimed On" column per rules
  const claimedOnDisplay = transaction.claimed && transaction.dateClaimed
    ? formatDate(transaction.dateClaimed)
    : <span className="text-[#8E9196]">Unclaimed</span>;

  const handleCopy = (number: string) => {
    if (onCopyNumber) {
      onCopyNumber(number);
    } else {
      navigator.clipboard.writeText(number);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <TableRow>
      <TableCell>{formatDate(transaction.date)}</TableCell>
      <TableCell>
        <span 
          className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80"
          onClick={() => navigate(`/patients/${transaction.patientCode}/transactions/${transaction.code}`)}
        >
          {transaction.code}
        </span>
      </TableCell>
      <TableCell>{transaction.patientName}</TableCell>
      <TableCell>{transaction.patientCode}</TableCell>
      <TableCell>
        {/* Contact Number with copy icon */}
        <div className="flex items-center space-x-2">
          <span>{transaction.phone || "--"}</span>
          {transaction.phone && (
            <Button 
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0"
              aria-label="Copy Contact Number"
              onClick={() => handleCopy(transaction.phone!)}
              type="button"
            >
              <Copy className={`w-4 h-4 ${copied ? "text-green-500" : "text-gray-400"}`} />
            </Button>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge 
          variant="outline" 
          className={getTypeColor(transaction.type)}
        >
          {transaction.type}
        </Badge>
      </TableCell>
      <TableCell className="text-right">{formatCurrency(transaction.grossAmount)}</TableCell>
      <TableCell className="text-right">{formatCurrency(transaction.deposit)}</TableCell>
      <TableCell className="text-right">{formatCurrency(transaction.balance)}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          <Checkbox 
            checked={transaction.claimed} 
            onCheckedChange={() => onClaimedToggle(transaction.id, transaction.claimed)}
            id={`claimed-${transaction.id}`}
            className={`border-2 !border-[#8E9196] bg-white ${
              transaction.claimed
                ? "!border-[#ea384c] !bg-[#ea384c]/10 !text-[#ea384c]"
                : "!text-[#8E9196]"
            }`}
            style={{
              color: transaction.claimed ? "#ea384c" : "#8E9196",
            }}
          />
        </div>
      </TableCell>
      <TableCell>{claimedOnDisplay}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => navigate(`/patients/${transaction.patientCode}/transactions/${transaction.code}`)}
              className="cursor-pointer"
            >
              View Full Transaction
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
