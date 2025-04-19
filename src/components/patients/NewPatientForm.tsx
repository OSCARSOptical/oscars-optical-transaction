
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Patient } from "@/types";

interface NewPatientFormProps {
  onSave: (patient: Omit<Patient, "id">) => void;
  onBack: () => void;
}

const NewPatientForm = ({ onSave, onBack }: NewPatientFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

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
      age: parseInt(age) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Row 1: First Name, Last Name, Patient Code */}
        <div className="col-span-4 space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="col-span-4 space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div className="col-span-4 space-y-2">
          <Label htmlFor="patientCode">Patient Code</Label>
          <Input
            id="patientCode"
            value={generatePatientCode(firstName, lastName)}
            disabled
            className="bg-gray-100"
          />
        </div>

        {/* Row 2: Age and Contact Number */}
        <div className="col-span-6 space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            required
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="col-span-6 space-y-2">
          <Label htmlFor="phone">Contact Number</Label>
          <Input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Row 3: Email Address */}
        <div className="col-span-12 space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Row 4: Address */}
        <div className="col-span-12 space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
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
