
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Patient } from "@/types";

interface PatientInfoFieldsProps {
  patient: Patient;
  isEditing: boolean;
  onFieldChange: (field: string, value: string | number) => void;
}

const PatientInfoFields = ({ patient, isEditing, onFieldChange }: PatientInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">First Name</label>
          <Input
            value={patient.firstName}
            onChange={(e) => onFieldChange('firstName', e.target.value)}
            readOnly={!isEditing}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Last Name</label>
          <Input
            value={patient.lastName}
            onChange={(e) => onFieldChange('lastName', e.target.value)}
            readOnly={!isEditing}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Age</label>
          <Input
            type="number"
            value={patient.age}
            onChange={(e) => onFieldChange('age', parseInt(e.target.value) || 0)}
            readOnly={!isEditing}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Sex</label>
          <Input
            value={patient.sex}
            readOnly={true}
            className="bg-gray-50"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Contact Number</label>
          <Input
            value={patient.phone}
            onChange={(e) => onFieldChange('phone', e.target.value)}
            readOnly={!isEditing}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={patient.email}
            onChange={(e) => onFieldChange('email', e.target.value)}
            readOnly={!isEditing}
          />
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium">Address</label>
          <Input
            value={patient.address}
            onChange={(e) => onFieldChange('address', e.target.value)}
            readOnly={!isEditing}
          />
        </div>
      </div>
    </div>
  );
};

export default PatientInfoFields;
