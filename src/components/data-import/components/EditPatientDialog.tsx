
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Patient } from "@/types";

interface EditPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient & { originalFullName?: string } | null;
  onSave: () => void;
  onPatientChange: (field: keyof Patient, value: string | number) => void;
}

export function EditPatientDialog({
  open,
  onOpenChange,
  patient,
  onSave,
  onPatientChange
}: EditPatientDialogProps) {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Patient</DialogTitle>
          <DialogDescription>
            Make changes to patient information below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right text-sm">Original Name:</label>
            <div className="col-span-3 font-medium text-gray-600">
              {patient.originalFullName || `${patient.firstName} ${patient.lastName}`}
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="firstName" className="text-right text-sm">First Name:</label>
            <Input
              id="firstName"
              value={patient.firstName}
              onChange={(e) => onPatientChange('firstName', e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="lastName" className="text-right text-sm">Last Name:</label>
            <Input
              id="lastName"
              value={patient.lastName}
              onChange={(e) => onPatientChange('lastName', e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="patientCode" className="text-right text-sm">Patient Code:</label>
            <Input
              id="patientCode"
              value={patient.code}
              onChange={(e) => onPatientChange('code', e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="age" className="text-right text-sm">Age:</label>
            <Input
              id="age"
              type="number"
              value={patient.age}
              onChange={(e) => onPatientChange('age', parseInt(e.target.value) || 0)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="sex" className="text-right text-sm">Sex:</label>
            <select 
              id="sex"
              value={patient.sex}
              onChange={(e) => onPatientChange('sex', e.target.value)}
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="phone" className="text-right text-sm">Phone:</label>
            <Input
              id="phone"
              value={patient.phone}
              onChange={(e) => onPatientChange('phone', e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="email" className="text-right text-sm">Email:</label>
            <Input
              id="email"
              value={patient.email}
              onChange={(e) => onPatientChange('email', e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="address" className="text-right text-sm">Address:</label>
            <Input
              id="address"
              value={patient.address}
              onChange={(e) => onPatientChange('address', e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" onClick={() => onOpenChange(false)} variant="outline">Cancel</Button>
          <Button type="button" onClick={onSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
