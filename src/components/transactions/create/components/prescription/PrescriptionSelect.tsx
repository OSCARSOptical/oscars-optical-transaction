
import { cn } from "@/lib/utils";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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
  const handleSelect = (newValue: string) => {
    if (!readOnly) {
      onValueChange(newValue);
    }
  };

  return (
    <Select
      value={value}
      onValueChange={handleSelect}
      disabled={readOnly}
    >
      <SelectTrigger 
        className={cn(
          "w-full bg-background", 
          readOnly && "bg-muted cursor-not-allowed",
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem 
            key={option.value} 
            value={option.value || "N/A"}
            className="cursor-pointer"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
