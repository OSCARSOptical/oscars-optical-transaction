
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
  useDisabled = true
}: PrescriptionRowProps) => {
  const handleValueChange = (field: string, newValue: string) => {
    if (onChange && !readOnly) {
      onChange({
        ...value,
        [field]: newValue,
      });
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">{label}</TableCell>
      <TableCell>
        <PrescriptionSelect
          value={value?.sphere || ""}
          onValueChange={(val) => handleValueChange("sphere", val)}
          options={sphereOptions}
          placeholder="Select sphere"
          readOnly={readOnly}
          className={cn(readOnly && !useDisabled && "bg-muted cursor-default")}
        />
      </TableCell>
      {showAllFields && (
        <>
          <TableCell>
            <PrescriptionSelect
              value={value?.cylinder || ""}
              onValueChange={(val) => handleValueChange("cylinder", val)}
              options={cylinderOptions}
              placeholder="Select cylinder"
              readOnly={readOnly}
              className={cn(readOnly && !useDisabled && "bg-muted cursor-default")}
            />
          </TableCell>
          <TableCell>
            <PrescriptionSelect
              value={value?.axis || ""}
              onValueChange={(val) => handleValueChange("axis", val)}
              options={axisOptions}
              placeholder="Select axis"
              readOnly={readOnly}
              className={cn(readOnly && !useDisabled && "bg-muted cursor-default")}
            />
          </TableCell>
          <TableCell>
            <PrescriptionSelect
              value={value?.visualAcuity || ""}
              onValueChange={(val) => handleValueChange("visualAcuity", val)}
              options={visualAcuityOptions}
              placeholder="Select VA"
              readOnly={readOnly}
              className={cn(readOnly && !useDisabled && "bg-muted cursor-default")}
            />
          </TableCell>
        </>
      )}
    </TableRow>
  );
};
