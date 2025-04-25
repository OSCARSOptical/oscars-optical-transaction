
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  transactionCode?: string;
}

export function ErrorState({ transactionCode }: ErrorStateProps) {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Transaction not found</AlertTitle>
        <AlertDescription>
          The transaction with code {transactionCode} could not be found.
        </AlertDescription>
      </Alert>
    </div>
  );
}
