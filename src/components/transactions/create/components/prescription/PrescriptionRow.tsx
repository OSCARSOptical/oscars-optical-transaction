
import { TableCell, TableRow } from "@/components/ui/table";
import { PrescriptionSelect } from "./PrescriptionSelect";
import { cn } from "@/lib/utils";
import { PrescriptionRowProps } from "./types";

export const PrescriptionRow = ({
  label,
  type,
  value,
  onChange,
  sphereOptions,
  cylinderOptions,
  axisOptions,
  visualAcuityOptions,
  showAllFields = true,
  readOnly = false,
  disabled = false,
  useDisabled = true,
  placeholderPrefix = "Select "
}: PrescriptionRowProps) => {
  const handleValueChange = (field: string, newValue: string) => {
    if (onChange && !readOnly && !disabled) {
      onChange({
        ...value,
        [field]: newValue,
      });
    }
  };

  // Convert any numeric values to strings for display in the select components
  const getStringValue = (val: string | number | "Plano" | undefined): string => {
    if (val === undefined) return "";
    return val.toString();
  };

  const isFieldDisabled = readOnly || disabled;

  return (
    <TableRow>
      <TableCell className="font-medium">{label}</TableCell>
      <TableCell>
        <PrescriptionSelect
          value={getStringValue(value?.sphere)}
          onValueChange={(val) => handleValueChange("sphere", val)}
          options={sphereOptions}
          placeholder={`${placeholderPrefix}sphere`}
          readOnly={isFieldDisabled}
          className={cn(isFieldDisabled && !useDisabled && "bg-muted cursor-default")}
        />
      </TableCell>
      {showAllFields && (
        <>
          <TableCell>
            <PrescriptionSelect
              value={getStringValue(value?.cylinder)}
              onValueChange={(val) => handleValueChange("cylinder", val)}
              options={cylinderOptions}
              placeholder={`${placeholderPrefix}cylinder`}
              readOnly={isFieldDisabled}
              className={cn(isFieldDisabled && !useDisabled && "bg-muted cursor-default")}
            />
          </TableCell>
          <TableCell>
            <PrescriptionSelect
              value={getStringValue(value?.axis)}
              onValueChange={(val) => handleValueChange("axis", val)}
              options={axisOptions}
              placeholder={`${placeholderPrefix}axis`}
              readOnly={isFieldDisabled}
              className={cn(isFieldDisabled && !useDisabled && "bg-muted cursor-default")}
            />
          </TableCell>
          <TableCell>
            <PrescriptionSelect
              value={value?.visualAcuity || ""}
              onValueChange={(val) => handleValueChange("visualAcuity", val)}
              options={visualAcuityOptions}
              placeholder={`${placeholderPrefix}VA`}
              readOnly={isFieldDisabled}
              className={cn(isFieldDisabled && !useDisabled && "bg-muted cursor-default")}
            />
          </TableCell>
        </>
      )}
    </TableRow>
  );
};
