
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TransactionDetailsProps {
  onTypeChange: (type: string) => void;
}

const TransactionDetails = ({ onTypeChange }: TransactionDetailsProps) => {
  const [transactionType, setTransactionType] = useState("Complete");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().substring(0, 10)
  );

  const handleTypeChange = (value: string) => {
    setTransactionType(value);
    onTypeChange(value);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Transaction Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="transactionType">Transaction Type</Label>
            <Select 
              value={transactionType} 
              onValueChange={handleTypeChange}
            >
              <SelectTrigger id="transactionType">
                <SelectValue placeholder="Select Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Complete">Complete</SelectItem>
                <SelectItem value="Frame Replacement">Frame Replacement</SelectItem>
                <SelectItem value="Lens Replacement">Lens Replacement</SelectItem>
                <SelectItem value="Eye Exam">Eye Examination</SelectItem>
                <SelectItem value="Medical Certificate">Medical Certificate</SelectItem>
                <SelectItem value="Contact Lens">Contact Lens</SelectItem>
                <SelectItem value="Repair">Repair</SelectItem>
                <SelectItem value="Return">Return</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="transactionDate">Date</Label>
            <Input
              id="transactionDate"
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDetails;
