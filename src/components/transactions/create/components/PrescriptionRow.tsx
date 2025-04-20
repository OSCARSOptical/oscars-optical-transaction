
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { RefractionData } from "@/types";
import { useEffect, useState } from "react";

interface PrescriptionRowProps {
  label: string;
  type?: 'od' | 'os' | 'add';
  sphereOptions: Array<{ value: string; label: string }>;
  cylinderOptions: Array<{ value: string; label: string }>;
  axisOptions: Array<{ value: string; label: string }>;
  visualAcuityOptions: Array<{ value: string; label: string }>;
  showAllFields?: boolean;
  value?: {
    sphere?: number | "Plano";
    cylinder?: number;
    axis?: number;
    visualAcuity?: string;
    addPower?: number;
  };
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

  const handleSphereChange = (value: string) => {
    if (readOnly) return;
    
    setSphere(value);
    updateRefractionData('sphere', value);
  };

  const handleCylinderChange = (value: string) => {
    if (readOnly) return;
    
    setCylinder(value);
    updateRefractionData('cylinder', value);
  };

  const handleAxisChange = (value: string) => {
    if (readOnly) return;
    
    setAxis(value);
    updateRefractionData('axis', value);
  };

  const handleVAChange = (value: string) => {
    if (readOnly) return;
    
    setVisualAcuity(value);
    updateRefractionData('visualAcuity', value);
  };

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
        <Select 
          disabled={readOnly}
          value={sphere} 
          onValueChange={handleSphereChange}
        >
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
            <Select 
              disabled={readOnly}
              value={cylinder} 
              onValueChange={handleCylinderChange}
            >
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
            <Select 
              disabled={readOnly}
              value={axis} 
              onValueChange={handleAxisChange}
            >
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
            <Select 
              disabled={readOnly}
              value={visualAcuity} 
              onValueChange={handleVAChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue 
                  placeholder={type === 'add' ? "Select Near VA" : "Select VA"} 
                  className="text-gray-400" 
                />
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
      {!showAllFields && (
        <>
          <TableCell>{/* Empty Cylinder cell */}</TableCell>
          <TableCell>{/* Empty Axis cell */}</TableCell>
          <TableCell className="w-[200px]">
            <Select 
              disabled={readOnly}
              value={visualAcuity} 
              onValueChange={handleVAChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Near VA" className="text-gray-400" />
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
    </TableRow>
  );
};
