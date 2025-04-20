
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  generateSphereOptions, 
  generateCylinderOptions, 
  generateAxisOptions, 
  generateAddOptions 
} from "./utils/refractionOptions";
import { visualAcuityOptions } from "./constants/visualAcuityOptions";
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
          sphereOptions={sphereOptions}
          cylinderOptions={cylinderOptions}
          axisOptions={axisOptions}
          visualAcuityOptions={visualAcuityOptions}
        />
        <PrescriptionRow
          label="OS"
          sphereOptions={sphereOptions}
          cylinderOptions={cylinderOptions}
          axisOptions={axisOptions}
          visualAcuityOptions={visualAcuityOptions}
        />
        <PrescriptionRow
          label="ADD"
          sphereOptions={addOptions}
          cylinderOptions={cylinderOptions}
          axisOptions={axisOptions}
          visualAcuityOptions={visualAcuityOptions}
          showAllFields={false}
        />
      </TableBody>
    </Table>
  );
};
