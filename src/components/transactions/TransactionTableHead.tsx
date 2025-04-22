
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { CopyAllContactsButton } from "./CopyAllContactsButton";

interface TransactionTableHeadProps {
  allVisibleNumbers: string;
}

export function TransactionTableHead({ allVisibleNumbers }: TransactionTableHeadProps) {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center justify-center space-x-1">
                  <span>Date</span>
                  <Info className="w-3 h-3 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Transaction date</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableHead>
        <TableHead>Transaction ID</TableHead>
        <TableHead>Patient Name</TableHead>
        <TableHead>Patient ID</TableHead>
        <TableHead className="relative group">
          <div className="flex items-center space-x-1">
            <span>Contact #</span>
            <CopyAllContactsButton allContactNumbers={allVisibleNumbers} />
          </div>
        </TableHead>
        <TableHead>Type</TableHead>
        <TableHead className="text-right">Gross Amount</TableHead>
        <TableHead className="text-right">Deposit</TableHead>
        <TableHead className="text-right">Balance</TableHead>
        <TableHead>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1">
                  <span>Claimed</span>
                  <Info className="w-3 h-3 text-gray-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Whether payment has been claimed</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableHead>
        <TableHead>Claimed on</TableHead>
        <TableHead className="w-[60px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
}
