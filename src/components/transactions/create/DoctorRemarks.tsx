
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DoctorRemarks = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Doctor & Remarks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doctor">Attending Doctor</Label>
            <Select defaultValue="dr-smith">
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
            <Textarea
              id="remarks"
              placeholder="Enter any remarks or medical notes from the doctor"
              className="min-h-[100px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorRemarks;
