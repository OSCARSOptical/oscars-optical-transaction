
export interface PrescriptionRowData {
  sphere?: number | "Plano";
  cylinder?: number;
  axis?: number;
  visualAcuity?: string;
  addPower?: number;
}

export interface PrescriptionOptions {
  sphereOptions: Array<{ value: string; label: string }>;
  cylinderOptions: Array<{ value: string; label: string }>;
  axisOptions: Array<{ value: string; label: string }>;
  visualAcuityOptions: Array<{ value: string; label: string }>;
}
