
type VisualAcuityOption = {
  value: string;
  label: string;
};

export interface PrescriptionRowProps {
  label: string;
  type: "od" | "os" | "add";
  value?: {
    sphere?: string | number | "Plano";
    cylinder?: string | number;
    axis?: string | number;
    visualAcuity?: string;
  };
  onChange?: (data: any) => void;
  sphereOptions: Array<{ value: string; label: string }>;
  cylinderOptions: Array<{ value: string; label: string }>;
  axisOptions: Array<{ value: string; label: string }>;
  visualAcuityOptions: Array<VisualAcuityOption>;
  showAllFields?: boolean;
  readOnly?: boolean;
  useDisabled?: boolean;
}
