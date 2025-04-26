import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [doctorId, setDoctorId] = useState<string>(initialData?.doctorId || "");
  const [remarks, setRemarks] = useState<string>(initialData?.remarks || "");
  return <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Doctor's Remarks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doctor">Attending Doctor</Label>
            <Select value={doctorId} onValueChange={readOnly ? undefined : setDoctorId} disabled={readOnly}>
              <SelectTrigger id="doctor">
                <SelectValue placeholder="Select Doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dr-smith">Dr. Smith</SelectItem>
                <SelectItem value="dr-jones">Dr. Jones</SelectItem>
                <SelectItem value="dr-williams">Dr. Williams</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="remarks">Doctor's Remarks</Label>
            <Textarea id="remarks" placeholder="Enter any remarks or medical notes from the doctor" className="min-h-[100px]" value={remarks} onChange={readOnly ? undefined : e => setRemarks(e.target.value)} readOnly={readOnly} />
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default DoctorRemarks;