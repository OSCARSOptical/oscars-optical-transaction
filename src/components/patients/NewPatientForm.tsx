
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Patient } from "@/types";

interface NewPatientFormProps {
  onSave: (patient: Omit<Patient, "id">) => void;
  onBack: () => void;
}

const NewPatientForm = ({ onSave, onBack }: NewPatientFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const generatePatientCode = (first: string, last: string) => {
    if (!first || !last) return "";
    const prefix = "PX";
    const initials = `${first[0]}${last[0]}`.toUpperCase();
    const random = Math.floor(Math.random() * 99999).toString().padStart(5, "0");
    return `${prefix}-${initials}-${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientCode = generatePatientCode(firstName, lastName);
    onSave({
      code: patientCode,
      firstName,
      lastName,
      email,
      phone,
      address,
      age: new Date().getFullYear() - new Date(dateOfBirth).getFullYear(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="patientCode">Patient Code</Label>
        <Input
          id="patientCode"
          value={generatePatientCode(firstName, lastName)}
          disabled
          className="bg-gray-100"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          required
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Contact Number</Label>
        <Input
          id="phone"
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit">Save Patient</Button>
      </div>
    </form>
  );
};

export default NewPatientForm;
