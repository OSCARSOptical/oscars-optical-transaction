
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface DoctorRemarksProps {
  readOnly?: boolean;
  initialData?: {
    doctorId?: string;
    remarks?: string;
  };
  onDataChange?: (data: { doctorId?: string; remarks?: string }) => void;
}

const DoctorRemarks = ({ 
  readOnly = false, 
  initialData = {},
  onDataChange
}: DoctorRemarksProps) => {
  const [remarks, setRemarks] = useState(initialData?.remarks || "");

  useEffect(() => {
    if (onDataChange) {
      onDataChange({
        doctorId: initialData?.doctorId,
        remarks
      });
    }
  }, [remarks, initialData?.doctorId, onDataChange]);

  const handleRemarksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!readOnly) {
      setRemarks(e.target.value);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Doctor Remarks</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Enter any remarks or notes from the doctor..."
          value={remarks}
          onChange={handleRemarksChange}
          disabled={readOnly}
          className="min-h-[100px]"
        />
      </CardContent>
    </Card>
  );
};

export default DoctorRemarks;
