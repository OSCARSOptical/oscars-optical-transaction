
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PrescriptionSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  readOnly?: boolean;
}

export const PrescriptionSelect = ({
  value,
  onValueChange,
  options,
  placeholder,
  readOnly = false
}: PrescriptionSelectProps) => {
  return (
    <Select
      disabled={readOnly}
      value={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} className="text-gray-400" />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
