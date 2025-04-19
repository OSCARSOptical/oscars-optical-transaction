
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit } from "lucide-react";
import { Patient } from '@/types';

export function PatientDetail() {
  const { patientCode } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [patient, setPatient] = useState<Patient>({
    id: '12345',
    code: patientCode || '',
    firstName: 'John',
    lastName: 'Doe',
    age: 35,
    email: 'john@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, City, State'
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold tracking-tight">
              {patient.firstName} {patient.lastName}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-muted-foreground">{patient.code}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">First Name</label>
              <Input
                value={patient.firstName}
                onChange={(e) => setPatient({ ...patient, firstName: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Last Name</label>
              <Input
                value={patient.lastName}
                onChange={(e) => setPatient({ ...patient, lastName: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Age</label>
              <Input
                type="number"
                value={patient.age}
                onChange={(e) => setPatient({ ...patient, age: parseInt(e.target.value) })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Contact Number</label>
              <Input
                value={patient.phone}
                onChange={(e) => setPatient({ ...patient, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={patient.address}
                onChange={(e) => setPatient({ ...patient, address: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={patient.email}
                onChange={(e) => setPatient({ ...patient, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PatientDetail;
