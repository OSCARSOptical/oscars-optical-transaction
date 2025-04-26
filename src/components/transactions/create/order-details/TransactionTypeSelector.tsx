
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Transaction } from "@/types";

interface TransactionTypeSelectorProps {
  transactionType: string;
  onTypeChange: (value: Transaction['type']) => void;
  readOnly?: boolean;
}

const TransactionTypeSelector = ({ 
  transactionType, 
  onTypeChange, 
  readOnly = false 
}: TransactionTypeSelectorProps) => {
  return (
    <div>
      <Label htmlFor="transactionType" className="text-xs text-muted-foreground">
        Transaction Type
      </Label>
      <Select 
        value={transactionType} 
        onValueChange={onTypeChange}
        disabled={readOnly}
      >
        <SelectTrigger 
          id="transactionType"
          className={cn(readOnly && "bg-muted cursor-default")}
        >
          <SelectValue placeholder="Select Transaction Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Complete">Complete</SelectItem>
          <SelectItem value="Lens Replacement">Lens Replacement</SelectItem>
          <SelectItem value="Frame Replacement">Frame Replacement</SelectItem>
          <SelectItem value="Medical Certificate">Medical Certificate</SelectItem>
          <SelectItem value="Eye Examination">Eye Examination</SelectItem>
          <SelectItem value="Contact Lens">Contact Lens</SelectItem>
          <SelectItem value="Repair">Repair</SelectItem>
          <SelectItem value="Return">Return</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TransactionTypeSelector;
