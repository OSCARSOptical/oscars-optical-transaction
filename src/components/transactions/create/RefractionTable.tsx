
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  generateSphereOptions, 
  generateCylinderOptions, 
  generateAxisOptions, 
  generateAddOptions 
} from "./utils/refractionOptions";
import { distanceVisualAcuityOptions, nearVisualAcuityOptions } from "./constants/visualAcuityOptions";
import { PrescriptionRow } from "./components/PrescriptionRow";

const sphereOptions = generateSphereOptions();
const cylinderOptions = generateCylinderOptions();
const axisOptions = generateAxisOptions();
const addOptions = generateAddOptions();

export const RefractionTable = () => {
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
        />
        <PrescriptionRow
          label="OS"
          type="os"
          sphereOptions={sphereOptions}
          cylinderOptions={cylinderOptions}
          axisOptions={axisOptions}
          visualAcuityOptions={distanceVisualAcuityOptions}
        />
        <PrescriptionRow
          label="ADD"
          type="add"
          sphereOptions={addOptions}
          cylinderOptions={cylinderOptions}
          axisOptions={axisOptions}
          visualAcuityOptions={nearVisualAcuityOptions}
          showAllFields={false}
        />
      </TableBody>
    </Table>
  );
};
