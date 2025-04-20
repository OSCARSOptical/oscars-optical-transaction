
// Utility functions to generate refraction options
export const generateSphereOptions = () => Array.from({ length: 161 }, (_, i) => {
  const value = ((i - 80) * 0.25).toFixed(2);
  const formattedValue = value.startsWith('-') ? value : `+${value}`;
  return { 
    value: formattedValue, 
    label: formattedValue === "+0.00" ? "Plano" : formattedValue 
  };
});

export const generateCylinderOptions = () => Array.from({ length: 24 }, (_, i) => {
  const value = (-(i + 1) * 0.25).toFixed(2);
  return { value, label: value };
});

export const generateAxisOptions = () => Array.from({ length: 180 }, (_, i) => {
  const value = (i + 1).toString();
  return { value, label: value };
});

export const generateAddOptions = () => Array.from({ length: 9 }, (_, i) => {
  const value = ((i + 4) * 0.25).toFixed(2);
  const formattedValue = value.startsWith('-') ? value : `+${value}`;
  return { value: formattedValue, label: formattedValue };
});

