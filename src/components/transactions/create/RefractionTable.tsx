import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefractionData } from "@/types";
import { PrescriptionRow } from "./components/prescription/PrescriptionRow";
import { generateSphereOptions, generateCylinderOptions, generateAxisOptions, generateAddOptions } from "./utils/refractionOptions";

interface RefractionTableProps {
  data?: RefractionData;
  onChange?: (data: RefractionData) => void;
  showAddPower?: boolean;
  readOnly?: boolean;
}

const sphereOptions = generateSphereOptions();
const cylinderOptions = generateCylinderOptions();
const axisOptions = generateAxisOptions();
const addOptions = generateAddOptions();

export const RefractionTable = ({ 
  data, 
  onChange, 
  showAddPower = false, 
  readOnly = false 
}: RefractionTableProps) => {
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
          onChange={onChange}
          readOnly={readOnly}
        />
        <PrescriptionRow
          label="OS"
          type="os"
          sphereOptions={sphereOptions}
          cylinderOptions={cylinderOptions}
          axisOptions={axisOptions}
          visualAcuityOptions={distanceVisualAcuityOptions}
          value={data?.OS}
          onChange={onChange}
          readOnly={readOnly}
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
            onChange={onChange}
            showAllFields={false}
            readOnly={readOnly}
          />
        )}
      </TableBody>
    </Table>
  );
};
