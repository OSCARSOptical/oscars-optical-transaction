
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
        ...(value || {}),
        [field]: field === 'sphere' && newValue === 'Plano' ? 'Plano' : newValue
      });
    }
  };

  const getStringValue = (val: string | number | "Plano" | undefined): string => {
    if (val === undefined) return "";
    return val.toString();
  };

  const isFieldDisabled = readOnly || disabled;
  const isAddType = type === 'add';
  const visualAcuityPlaceholder = isAddType ? 'Select Near Visual Acuity' : 'Select Visual Acuity';

  return (
    <TableRow>
      <TableCell className="w-24 min-w-[96px] font-medium">{label}</TableCell>
      <TableCell className="w-48 min-w-[192px]">
        <PrescriptionSelect
          value={getStringValue(value?.sphere)}
          onValueChange={(val) => handleValueChange("sphere", val)}
          options={sphereOptions}
          placeholder={`${placeholderPrefix}Sphere`}
          readOnly={isFieldDisabled}
          className={cn(isFieldDisabled && !useDisabled && "bg-muted cursor-default")}
        />
      </TableCell>
      <TableCell className="w-48 min-w-[192px]">
        {showAllFields && (
          <PrescriptionSelect
            value={getStringValue(value?.cylinder)}
            onValueChange={(val) => handleValueChange("cylinder", val)}
            options={cylinderOptions}
            placeholder={`${placeholderPrefix}Cylinder`}
            readOnly={isFieldDisabled}
            className={cn(isFieldDisabled && !useDisabled && "bg-muted cursor-default")}
          />
        )}
      </TableCell>
      <TableCell className="w-48 min-w-[192px]">
        {showAllFields && (
          <PrescriptionSelect
            value={getStringValue(value?.axis)}
            onValueChange={(val) => handleValueChange("axis", val)}
            options={axisOptions}
            placeholder={`${placeholderPrefix}Axis`}
            readOnly={isFieldDisabled}
            className={cn(isFieldDisabled && !useDisabled && "bg-muted cursor-default")}
          />
        )}
      </TableCell>
      <TableCell className="w-48 min-w-[192px]">
        <PrescriptionSelect
          value={value?.visualAcuity || ""}
          onValueChange={(val) => handleValueChange("visualAcuity", val)}
          options={visualAcuityOptions}
          placeholder={visualAcuityPlaceholder}
          readOnly={isFieldDisabled}
          className={cn(isFieldDisabled && !useDisabled && "bg-muted cursor-default")}
        />
      </TableCell>
    </TableRow>
  );
};
