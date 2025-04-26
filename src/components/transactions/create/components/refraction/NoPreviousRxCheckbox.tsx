
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
    <div className="flex items-center space-x-2">
      <Checkbox 
        id="noPreviousRx" 
        checked={checked} 
        onCheckedChange={onCheckedChange}
        disabled={readOnly}
      />
      <Label 
        htmlFor="noPreviousRx" 
        className="font-normal text-sm cursor-pointer"
      >
        No previous Rx
      </Label>
    </div>
  );
};
