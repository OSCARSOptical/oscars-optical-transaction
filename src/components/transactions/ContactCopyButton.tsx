
import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Transaction } from "@/types";

interface ContactCopyButtonProps {
  transactions: Transaction[];
}

export function ContactCopyButton({ transactions }: ContactCopyButtonProps) {
  const [copyAllStatus, setCopyAllStatus] = useState(false);

  const allVisibleNumbers = transactions
    .map((x) => x.phone)
    .filter(Boolean)
    .join(', ');

  const handleCopyAll = () => {
    if (allVisibleNumbers.length === 0) return;
    navigator.clipboard.writeText(allVisibleNumbers);
    setCopyAllStatus(true);
    setTimeout(() => setCopyAllStatus(false), 1000);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center space-x-1">
            <span>Contact Number</span>
            {allVisibleNumbers.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-1 p-1 h-6 w-6 rounded hover:bg-gray-100 focus:outline-none"
                title="Copy all contact numbers"
                onClick={handleCopyAll}
                type="button"
              >
                <Copy className={`w-4 h-4 ${copyAllStatus ? "text-green-500" : "text-gray-400"}`} />
              </Button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy all contact numbers</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
