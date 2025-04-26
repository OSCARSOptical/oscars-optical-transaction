
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TransactionTypeSelectorProps {
  transactionType: string;
  onTypeChange: (value: string) => void;
  readOnly?: boolean;
}

const TransactionTypeSelector = ({ 
  transactionType, 
  onTypeChange, 
  readOnly = false 
}: TransactionTypeSelectorProps) => {
  return (
    <div>
      <Label htmlFor="transactionType" className="text-xs text-muted-foreground capitalize">
        Transaction type
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
          <SelectValue placeholder="Select transaction type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Complete">Complete</SelectItem>
          <SelectItem value="Lens Replacement">Lens replacement</SelectItem>
          <SelectItem value="Frame Replacement">Frame replacement</SelectItem>
          <SelectItem value="Medical Certificate">Medical certificate</SelectItem>
          <SelectItem value="Eye Examination">Eye examination</SelectItem>
          <SelectItem value="Contact Lens">Contact lens</SelectItem>
          <SelectItem value="Repair">Repair</SelectItem>
          <SelectItem value="Return">Return</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TransactionTypeSelector;
