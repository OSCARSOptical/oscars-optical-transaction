
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Patient } from '@/types';

interface PatientInformationFormProps {
  patient: Patient;
  isEditing: boolean;
  onPatientChange: (updatedPatient: Patient) => void;
}

export function PatientInformationForm({ patient, isEditing, onPatientChange }: PatientInformationFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">First Name</label>
          <Input
            value={patient.firstName}
            onChange={(e) => onPatientChange({ ...patient, firstName: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Last Name</label>
          <Input
            value={patient.lastName}
            onChange={(e) => onPatientChange({ ...patient, lastName: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Age</label>
          <Input
            type="number"
            value={patient.age}
            onChange={(e) => onPatientChange({ ...patient, age: parseInt(e.target.value) })}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Sex</label>
          <Select 
            value={patient.sex || 'Other'} 
            onValueChange={(value) => onPatientChange({ ...patient, sex: value as 'Male' | 'Female' | 'Other' })}
            disabled={!isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">Contact Number</label>
          <Input
            value={patient.phone}
            onChange={(e) => onPatientChange({ ...patient, phone: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={patient.email}
            onChange={(e) => onPatientChange({ ...patient, email: e.target.value })}
            disabled={!isEditing}
          />
        </div>
        <div className="col-span-2">
          <label className="text-sm font-medium">Address</label>
          <Input
            value={patient.address}
            onChange={(e) => onPatientChange({ ...patient, address: e.target.value })}
            disabled={!isEditing}
          />
        </div>
      </div>
    </div>
  );
}
