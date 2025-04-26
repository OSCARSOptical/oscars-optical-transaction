
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefractionData } from "@/types";
import { PrescriptionRow } from "./components/prescription/PrescriptionRow";
import { generateSphereOptions, generateCylinderOptions, generateAxisOptions, generateAddOptions } from "./utils/refractionOptions";
import { distanceVisualAcuityOptions, nearVisualAcuityOptions } from "./constants/visualAcuityOptions";

interface RefractionTableProps {
  data?: RefractionData;
  onChange?: (data: RefractionData) => void;
  showAddPower?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
}

const sphereOptions = generateSphereOptions();
const cylinderOptions = generateCylinderOptions();
const axisOptions = generateAxisOptions();
const addOptions = generateAddOptions();

export const RefractionTable = ({ 
  data, 
  onChange, 
  showAddPower = false, 
  readOnly = false,
  disabled = false
}: RefractionTableProps) => {
  const handleChange = (type: "od" | "os" | "add", value: any) => {
    if (!onChange) return;

    const updatedData: RefractionData = {
      ...data,
      [type.toUpperCase()]: {
        ...(data?.[type.toUpperCase()] || {}),
        ...value
      }
    };

    onChange(updatedData);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px] font-semibold">Rx</TableHead>
          <TableHead>Sphere</TableHead>
          <TableHead>Cylinder</TableHead>
          <TableHead>Axis</TableHead>
          <TableHead>Visual Acuity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <PrescriptionRow
          label="OD"
          type="od"
          sphereOptions={sphereOptions}
          cylinderOptions={cylinderOptions}
          axisOptions={axisOptions}
          visualAcuityOptions={distanceVisualAcuityOptions}
          value={data?.OD}
          onChange={(value) => handleChange("od", value)}
          readOnly={readOnly}
          disabled={disabled}
          useDisabled={false}
          placeholderPrefix="Select "
        />
        <PrescriptionRow
          label="OS"
          type="os"
          sphereOptions={sphereOptions}
          cylinderOptions={cylinderOptions}
          axisOptions={axisOptions}
          visualAcuityOptions={distanceVisualAcuityOptions}
          value={data?.OS}
          onChange={(value) => handleChange("os", value)}
          readOnly={readOnly}
          disabled={disabled}
          useDisabled={false}
          placeholderPrefix="Select "
        />
        {(showAddPower || data?.ADD) && (
          <PrescriptionRow
            label="ADD"
            type="add"
            sphereOptions={addOptions}
            cylinderOptions={cylinderOptions}
            axisOptions={axisOptions}
            visualAcuityOptions={nearVisualAcuityOptions}
            value={data?.ADD}
            onChange={(value) => handleChange("add", value)}
            showAllFields={false}
            readOnly={readOnly}
            disabled={disabled}
            useDisabled={false}
            placeholderPrefix="Select "
          />
        )}
      </TableBody>
    </Table>
  );
};
