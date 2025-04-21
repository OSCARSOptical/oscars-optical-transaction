
import { TableCell, TableRow } from "@/components/ui/table";
import { RefractionData } from "@/types";
import { useEffect, useState } from "react";
import { PrescriptionSelect } from "./PrescriptionSelect";
import { PrescriptionOptions, PrescriptionRowData } from "./types";

interface PrescriptionRowProps {
  label: string;
  type?: 'od' | 'os' | 'add';
  sphereOptions: Array<{ value: string; label: string }>;
  cylinderOptions: Array<{ value: string; label: string }>;
  axisOptions: Array<{ value: string; label: string }>;
  visualAcuityOptions: Array<{ value: string; label: string }>;
  showAllFields?: boolean;
  value?: PrescriptionRowData;
  onChange?: (data: RefractionData) => void;
  readOnly?: boolean;
}

export const PrescriptionRow = ({
  label,
  type = 'od',
  sphereOptions,
  cylinderOptions,
  axisOptions,
  visualAcuityOptions,
  showAllFields = true,
  value,
  onChange,
  readOnly = false
}: PrescriptionRowProps) => {
  const [sphere, setSphere] = useState<string>("");
  const [cylinder, setCylinder] = useState<string>("");
  const [axis, setAxis] = useState<string>("");
  const [visualAcuity, setVisualAcuity] = useState<string>("");

  useEffect(() => {
    if (value) {
      if (value.sphere) {
        const sphereValue = value.sphere === "Plano" ? "+0.00" : 
          (typeof value.sphere === 'number' ? 
            (value.sphere > 0 ? `+${value.sphere.toFixed(2)}` : value.sphere.toFixed(2)) : 
            "");
        setSphere(sphereValue);
      }
      
      if (value.cylinder) {
        setCylinder(value.cylinder.toFixed(2));
      }
      
      if (value.axis) {
        setAxis(value.axis.toString());
      }
      
      if (value.visualAcuity) {
        setVisualAcuity(value.visualAcuity);
      }
    }
  }, [value]);

  const updateRefractionData = (field: string, value: string) => {
    if (!onChange) return;
    
    const sphereValue = field === 'sphere' ? value : sphere;
    const cylinderValue = field === 'cylinder' ? value : cylinder;
    const axisValue = field === 'axis' ? value : axis;
    const vaValue = field === 'visualAcuity' ? value : visualAcuity;
    
    const parsedSphere = sphereValue === "+0.00" ? "Plano" : parseFloat(sphereValue);
    const parsedCylinder = cylinderValue ? parseFloat(cylinderValue) : 0;
    const parsedAxis = axisValue ? parseInt(axisValue) : 0;
    
    let updatedData: RefractionData = {
      OD: {
        sphere: 0,
        cylinder: 0,
        axis: 0,
        visualAcuity: ""
      },
      OS: {
        sphere: 0,
        cylinder: 0,
        axis: 0,
        visualAcuity: ""
      }
    };
    
    if (type === 'od') {
      updatedData = {
        ...updatedData,
        OD: {
          sphere: parsedSphere,
          cylinder: parsedCylinder,
          axis: parsedAxis,
          visualAcuity: vaValue
        }
      };
    } else if (type === 'os') {
      updatedData = {
        ...updatedData,
        OS: {
          sphere: parsedSphere,
          cylinder: parsedCylinder,
          axis: parsedAxis,
          visualAcuity: vaValue
        }
      };
    } else if (type === 'add') {
      updatedData = {
        ...updatedData,
        ADD: {
          sphere: parsedSphere,
          visualAcuity: vaValue
        }
      };
    }
    
    onChange(updatedData);
  };

  return (
    <TableRow>
      <TableCell>{label}</TableCell>
      <TableCell>
        <PrescriptionSelect
          readOnly={readOnly}
          value={sphere}
          onValueChange={(value) => {
            setSphere(value);
            updateRefractionData('sphere', value);
          }}
          options={sphereOptions}
          placeholder={type === 'add' ? 'Select ADD' : 'Select Sphere'}
        />
      </TableCell>
      {showAllFields && (
        <>
          <TableCell>
            <PrescriptionSelect
              readOnly={readOnly}
              value={cylinder}
              onValueChange={(value) => {
                setCylinder(value);
                updateRefractionData('cylinder', value);
              }}
              options={cylinderOptions}
              placeholder="Select Cylinder"
            />
          </TableCell>
          <TableCell>
            <PrescriptionSelect
              readOnly={readOnly}
              value={axis}
              onValueChange={(value) => {
                setAxis(value);
                updateRefractionData('axis', value);
              }}
              options={axisOptions}
              placeholder="Select Axis"
            />
          </TableCell>
        </>
      )}
      {!showAllFields && (
        <>
          <TableCell>{/* Empty Cylinder cell */}</TableCell>
          <TableCell>{/* Empty Axis cell */}</TableCell>
        </>
      )}
      <TableCell className={!showAllFields ? "w-[200px]" : undefined}>
        <PrescriptionSelect
          readOnly={readOnly}
          value={visualAcuity}
          onValueChange={(value) => {
            setVisualAcuity(value);
            updateRefractionData('visualAcuity', value);
          }}
          options={visualAcuityOptions}
          placeholder={type === 'add' ? "Select Near VA" : "Select VA"}
        />
      </TableCell>
    </TableRow>
  );
};
