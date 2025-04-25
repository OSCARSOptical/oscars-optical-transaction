
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Patient } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  // Update patient code whenever first or last name changes
  useEffect(() => {
    const updatePatientCode = async () => {
      if (firstName && lastName) {
        const code = await generatePatientCode(firstName, lastName);
        setPatientCode(code);
      } else {
        setPatientCode("");
      }
    };
    
    updatePatientCode();
  }, [firstName, lastName]);

  const generatePatientCode = async (first: string, last: string) => {
    if (!first || !last) return "";
    
    const prefix = "PX";
    // Handle compound last names - only use the first part
    const lastParts = last.split(' ');
    const initials = `${first[0]}${lastParts[0][0]}`.toUpperCase();
    
    try {
      // First check Supabase for existing patient codes with same initials
      const { data, error } = await supabase
        .from('patients')
        .select('patient_code')
        .like('patient_code', `${prefix}-${initials}-%`);
        
      if (error) {
        console.error("Error fetching patient codes:", error);
        throw error;
      }
      
      // Also check localStorage for any unsaved codes
      const existingCodes: string[] = [];
      if (data) {
        existingCodes.push(...data.map(p => p.patient_code));
      }
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`patient_`) && key.endsWith('_code')) {
          const code = localStorage.getItem(key);
          if (code && code.startsWith(`${prefix}-${initials}-`)) {
            existingCodes.push(code);
          }
        }
      }
      
      let maxSequence = 0;
      existingCodes.forEach(code => {
        const sequencePart = code.split('-')[2];
        if (sequencePart) {
          const sequence = parseInt(sequencePart);
          if (!isNaN(sequence) && sequence > maxSequence) {
            maxSequence = sequence;
          }
        }
      });
      
      // Start with 0000001 if no existing codes or increment from the highest
      const nextSequence = (maxSequence + 1).toString().padStart(7, "0");
      
      return `${prefix}-${initials}-${nextSequence}`;
    } catch (error) {
      console.error("Error generating patient code:", error);
      // Fallback to simple code generation if there's an error
      return `${prefix}-${initials}-0000001`;
    }
  };

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
      const finalPatientCode = patientCode;
      
      // Save patient to Supabase
      const { data, error } = await supabase
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
        ])
        .select();
        
      if (error) {
        console.error("Error saving patient to Supabase:", error);
        toast({
          title: "Error",
          description: "Failed to save patient to database",
          variant: "destructive"
        });
        throw error;
      }
      
      console.log("Patient saved successfully:", data);
      
      // Get the newly created patient with the generated ID
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
      
      onSave(newPatient);
      
    } catch (error) {
      console.error("Error in form submission:", error);
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
