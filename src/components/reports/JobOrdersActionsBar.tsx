
import { Button } from "@/components/ui/button";
import { Printer, RefreshCw } from "lucide-react";

interface JobOrdersActionsBarProps {
  printDisabled: boolean;
  onPrintClick: () => void;
  onClearHistoryClick: () => void;
  printedTransactionsCount: number;
}

export default function JobOrdersActionsBar({
  printDisabled,
  onPrintClick,
  onClearHistoryClick,
  printedTransactionsCount
}: JobOrdersActionsBarProps) {
  return (
    <div className="flex gap-2">
      {printedTransactionsCount > 0 && (
        <Button
          variant="outline"
          className="gap-2"
          onClick={onClearHistoryClick}
        >
          <RefreshCw className="h-4 w-4" />
          Clear Print History
        </Button>
      )}
      <Button
        variant="outline"
        className="gap-2"
        onClick={onPrintClick}
        disabled={printDisabled}
      >
        <Printer className="h-4 w-4" />
        Print Selected
      </Button>
    </div>
  );
}
