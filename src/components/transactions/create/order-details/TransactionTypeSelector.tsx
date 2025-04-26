
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
      <Label htmlFor="transactionType" className="text-xs text-muted-foreground">
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
          <SelectItem value="Frame Only">Frame only</SelectItem>
          <SelectItem value="Lens Only">Lens only</SelectItem>
          <SelectItem value="Contact Lens">Contact lens</SelectItem>
          <SelectItem value="Others">Others</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TransactionTypeSelector;
