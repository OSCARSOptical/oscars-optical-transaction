
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface InterPupillaryDistanceProps {
  ipd: number | undefined;
  onIpdChange: (value: string) => void;
  readOnly?: boolean;
}

function generateIpdDropdownOptions() {
  const options = [];
  for (let i = 50.0; i <= 75.0; i += 0.5) {
    options.push(i.toFixed(1));
  }
  return options;
}

export const InterPupillaryDistance = ({ 
  ipd, 
  onIpdChange, 
  readOnly = false 
}: InterPupillaryDistanceProps) => {
  const ipdOptions = generateIpdDropdownOptions();

  // Convert ipd to string safely by checking if it's undefined or null
  const ipdValue = ipd !== undefined && ipd !== null ? ipd.toFixed(1) : "";

  return (
    <div className="w-full">
      <Label htmlFor="interpupillaryDistance" className="text-xs text-muted-foreground">
        Interpupillary Distance (mm)
      </Label>
      <Select
        value={ipdValue}
        onValueChange={onIpdChange}
        disabled={readOnly}
      >
        <SelectTrigger
          id="interpupillaryDistance"
          className="mt-1"
        >
          <SelectValue placeholder="Select IPD" />
        </SelectTrigger>
        <SelectContent>
          {ipdOptions.map(opt => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
