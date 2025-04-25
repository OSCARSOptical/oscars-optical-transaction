
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PrescriptionSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  readOnly?: boolean;
  className?: string;
}

export const PrescriptionSelect = ({
  value,
  onValueChange,
  options,
  placeholder,
  readOnly = false,
  className
}: PrescriptionSelectProps) => {
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={readOnly}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value || "N/A"}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
