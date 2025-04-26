
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CopyFromFullRxCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const CopyFromFullRxCheckbox = ({ checked, onCheckedChange }: CopyFromFullRxCheckboxProps) => {
  return (
    <div className="flex items-center gap-2 mt-4 px-4">
      <Checkbox
        id="copy-fullrx"
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label htmlFor="copy-fullrx" className="text-xs text-muted-foreground mb-0">Copy from full Rx</Label>
    </div>
  );
};
