
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ColorInputProps {
  color: string;
  onColorChange: (color: string) => void;
  readOnly?: boolean;
}

const ColorInput = ({ color, onColorChange, readOnly = false }: ColorInputProps) => {
  return (
    <div className="md:col-span-4">
      <Label htmlFor="color" className="text-xs text-muted-foreground">Color</Label>
      <Input
        id="color"
        placeholder="Enter tint color"
        value={color}
        onChange={(e) => onColorChange(e.target.value)}
        readOnly={readOnly}
        className={cn(readOnly && "bg-muted cursor-default")}
      />
    </div>
  );
};

export default ColorInput;
