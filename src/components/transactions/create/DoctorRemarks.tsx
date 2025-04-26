
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

interface DoctorRemarksProps {
  readOnly?: boolean;
  initialData?: {
    doctorId?: string;
    remarks?: string;
  };
}

const DoctorRemarks = ({
  readOnly = false,
  initialData
}: DoctorRemarksProps) => {
  const [remarks, setRemarks] = useState<string>(initialData?.remarks || "");
  const [doctorName, setDoctorName] = useState<string>("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          setDoctorName(`Dr. ${profile.first_name} ${profile.last_name}`);
        }
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Remarks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doctor">Attending Doctor</Label>
            <Input 
              id="doctor"
              value={doctorName}
              readOnly
              className="bg-muted cursor-default"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea 
              id="remarks" 
              placeholder="Enter any remarks or medical notes" 
              className="min-h-[100px]" 
              value={remarks} 
              onChange={readOnly ? undefined : e => setRemarks(e.target.value)} 
              readOnly={readOnly} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorRemarks;
