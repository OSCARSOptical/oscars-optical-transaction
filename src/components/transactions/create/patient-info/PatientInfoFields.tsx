
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Patient } from "@/types";
import { Ban } from "lucide-react";

interface PatientInfoFieldsProps {
  patient: Patient;
  isEditing: boolean;
  onFieldChange: (field: string, value: string | number) => void;
}

// Reusable wrapper to apply overlay and greying-out
const FieldWrapper = ({
  disabled,
  children,
}: {
  disabled: boolean;
  children: React.ReactNode;
}) => (
  <div className={`relative group`}>
    {children}
    {disabled && (
      <div
        className="pointer-events-auto absolute inset-0 z-10 flex items-center justify-center bg-white/80 dark:bg-background/70 rounded-md"
        style={{ cursor: "not-allowed" }}
      >
        <Ban className="text-muted-foreground opacity-70 w-6 h-6" />
      </div>
    )}
  </div>
);

const PatientInfoFields = ({ patient, isEditing, onFieldChange }: PatientInfoFieldsProps) => {
  const disabled = !isEditing;

  // Shared props for easily disabling input focus/hover, etc.
  const inputClassName = disabled
    ? "bg-muted cursor-not-allowed opacity-70"
    : "";

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">First Name</label>
          <FieldWrapper disabled={disabled}>
            <Input
              value={patient.firstName}
              onChange={(e) => onFieldChange('firstName', e.target.value)}
              readOnly={disabled}
              tabIndex={disabled ? -1 : 0}
              className={inputClassName}
            />
          </FieldWrapper>
        </div>
        <div>
          <label className="text-sm font-medium">Last Name</label>
          <FieldWrapper disabled={disabled}>
            <Input
              value={patient.lastName}
              onChange={(e) => onFieldChange('lastName', e.target.value)}
              readOnly={disabled}
              tabIndex={disabled ? -1 : 0}
              className={inputClassName}
            />
          </FieldWrapper>
        </div>
        <div>
          <label className="text-sm font-medium">Age</label>
          <FieldWrapper disabled={disabled}>
            <Input
              type="number"
              value={patient.age}
              onChange={(e) => onFieldChange('age', parseInt(e.target.value) || 0)}
              readOnly={disabled}
              tabIndex={disabled ? -1 : 0}
              className={inputClassName}
            />
          </FieldWrapper>
        </div>
        <div>
          <label className="text-sm font-medium">Sex</label>
          <FieldWrapper disabled={disabled}>
            <Select 
              value={patient.sex || 'Male'} 
              onValueChange={(value) => onFieldChange('sex', value)}
              disabled={disabled}
            >
              <SelectTrigger
                tabIndex={disabled ? -1 : 0}
                className={inputClassName}
              >
                <SelectValue placeholder="Select sex" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </FieldWrapper>
        </div>
        <div>
          <label className="text-sm font-medium">Contact Number</label>
          <FieldWrapper disabled={disabled}>
            <Input
              value={patient.phone}
              onChange={(e) => onFieldChange('phone', e.target.value)}
              readOnly={disabled}
              tabIndex={disabled ? -1 : 0}
              className={inputClassName}
            />
          </FieldWrapper>
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <FieldWrapper disabled={disabled}>
            <Input
              type="email"
              value={patient.email}
              onChange={(e) => onFieldChange('email', e.target.value)}
              readOnly={disabled}
              tabIndex={disabled ? -1 : 0}
              className={inputClassName}
            />
          </FieldWrapper>
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium">Address</label>
          <FieldWrapper disabled={disabled}>
            <Input
              value={patient.address}
              onChange={(e) => onFieldChange('address', e.target.value)}
              readOnly={disabled}
              tabIndex={disabled ? -1 : 0}
              className={inputClassName}
            />
          </FieldWrapper>
        </div>
      </div>
    </div>
  );
};

export default PatientInfoFields;

