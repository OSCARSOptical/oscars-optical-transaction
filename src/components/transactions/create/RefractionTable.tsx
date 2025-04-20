
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  generateSphereOptions, 
  generateCylinderOptions, 
  generateAxisOptions, 
  generateAddOptions 
} from "./utils/refractionOptions";
import { visualAcuityOptions } from "./constants/visualAcuityOptions";

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
        <TableRow>
          <TableCell>OD</TableCell>
          <TableCell>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Sphere" className="text-gray-400" />
              </SelectTrigger>
              <SelectContent>
                {sphereOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Cylinder" className="text-gray-400" />
              </SelectTrigger>
              <SelectContent>
                {cylinderOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Axis" className="text-gray-400" />
              </SelectTrigger>
              <SelectContent>
                {axisOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select VA" className="text-gray-400" />
              </SelectTrigger>
              <SelectContent>
                {visualAcuityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>OS</TableCell>
          <TableCell>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Sphere" className="text-gray-400" />
              </SelectTrigger>
              <SelectContent>
                {sphereOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Cylinder" className="text-gray-400" />
              </SelectTrigger>
              <SelectContent>
                {cylinderOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Axis" className="text-gray-400" />
              </SelectTrigger>
              <SelectContent>
                {axisOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select VA" className="text-gray-400" />
              </SelectTrigger>
              <SelectContent>
                {visualAcuityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>ADD</TableCell>
          <TableCell>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select ADD" className="text-gray-400" />
              </SelectTrigger>
              <SelectContent>
                {addOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

