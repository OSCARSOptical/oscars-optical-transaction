import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Patient } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePatientCode } from "@/hooks/usePatientCode";

interface NewPatientFormProps {
  onSave: (patient: Omit<Patient, "id">) => void;
  onBack: () => void;
}

const NewPatientForm = ({ onSave, onBack }: NewPatientFormProps) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<'Male' | 'Female'>('Male');
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientCode, setPatientCode] = useState("");
  const { toast } = useToast();
  const { generatePatientCode } = usePatientCode();

  // Update patient code whenever first or last name changes
  useEffect(() => {
    const updatePatientCode = async () => {
      if (firstName && lastName) {
        try {
          const code = await generatePatientCode(firstName, lastName);
          setPatientCode(code);
        } catch (error) {
          console.error("Error generating patient code:", error);
          setPatientCode("");
        }
      } else {
        setPatientCode("");
      }
    };
    
    updatePatientCode();
  }, [firstName, lastName, generatePatientCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName) {
      toast({
        title: "Missing information",
        description: "First name and last name are required",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Use the already generated patient code
      const finalPatientCode = patientCode || await generatePatientCode(firstName, lastName);
      
      // First create a patient object with the data we have
      const newPatient: Omit<Patient, "id"> = {
        code: finalPatientCode,
        firstName,
        lastName,
        email,
        phone,
        address,
        age: parseInt(age) || 0,
        sex
      };
      
      // Pass the patient to the onSave callback without waiting for Supabase
      onSave(newPatient);
      
      // Then try to save to Supabase (this won't block the user flow)
      const { error } = await supabase
        .from('patients')
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            age: parseInt(age) || null,
            sex: sex,
            email: email || null,
            contact_number: phone || null,
            address: address || null,
            patient_code: finalPatientCode
          }
        ]);
        
      if (error) {
        console.error("Error saving patient to Supabase:", error);
        // Don't show error toast to the user as we've already proceeded with the patient creation
        // We'll just use localStorage as a fallback
      }
      
    } catch (error) {
      console.error("Error in form submission:", error);
      // Even if there's an error with Supabase, we don't block the user flow
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4 space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="col-span-4 space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
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
            value={patientCode || "Enter first and last name"}
            disabled
            className="bg-gray-100"
          />
        </div>

        <div className="col-span-4 space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="col-span-4 space-y-2">
          <Label htmlFor="sex">Sex</Label>
          <Select 
            value={sex} 
            onValueChange={(value) => setSex(value as 'Male' | 'Female')}
          >
            <SelectTrigger id="sex">
              <SelectValue placeholder="Select sex" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-4 space-y-2">
          <Label htmlFor="phone">Contact Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="col-span-12 space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="col-span-12 space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Patient"}
        </Button>
      </div>
    </form>
  );
};

export default NewPatientForm;
