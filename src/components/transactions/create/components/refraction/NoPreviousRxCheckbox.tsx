
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface NoPreviousRxCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  readOnly?: boolean;
}

export const NoPreviousRxCheckbox = ({ 
  checked, 
  onCheckedChange, 
  readOnly = false 
}: NoPreviousRxCheckboxProps) => {
  return (
    <div className="flex items-center gap-2">
      <Checkbox 
        id="noPreviousRx" 
        checked={checked} 
        onCheckedChange={onCheckedChange}
        disabled={readOnly}
      />
      <Label 
        htmlFor="noPreviousRx" 
        className="text-xs text-muted-foreground mb-0"
      >
        No Previous Rx
      </Label>
    </div>
  );
};
