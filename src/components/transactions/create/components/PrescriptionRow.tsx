
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";

interface PrescriptionRowProps {
  label: string;
  type?: 'od' | 'os' | 'add';
  sphereOptions: Array<{ value: string; label: string }>;
  cylinderOptions: Array<{ value: string; label: string }>;
  axisOptions: Array<{ value: string; label: string }>;
  visualAcuityOptions: Array<{ value: string; label: string }>;
  showAllFields?: boolean;
}

export const PrescriptionRow = ({
  label,
  type = 'od',
  sphereOptions,
  cylinderOptions,
  axisOptions,
  visualAcuityOptions,
  showAllFields = true
}: PrescriptionRowProps) => {
  const getSpherePlaceholder = () => {
    switch(type) {
      case 'add': return 'Select ADD';
      default: return 'Select Sphere';
    }
  };

  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={getSpherePlaceholder()} className="text-gray-400" />
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
      {showAllFields && (
        <>
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
                <SelectValue placeholder={type === 'add' ? "Select Near VA" : "Select VA"} className="text-gray-400" />
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
        </>
      )}
      {!showAllFields && <TableCell colSpan={3} />}
    </TableRow>
  );
};
