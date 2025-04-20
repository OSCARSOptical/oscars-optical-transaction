
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
import { Textarea } from "@/components/ui/textarea";

interface OrderDetailsProps {
  initialType: string;
  onTypeChange: (type: string) => void;
}

const OrderDetails = ({ initialType, onTypeChange }: OrderDetailsProps) => {
  const [transactionType, setTransactionType] = useState(initialType);
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().substring(0, 10)
  );
  const [tint, setTint] = useState("N/A");
  const [color, setColor] = useState("");

  const handleTypeChange = (value: string) => {
    setTransactionType(value);
    onTypeChange(value);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Order Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Transaction Type</Label>
              <Select value={transactionType} onValueChange={handleTypeChange}>
                <SelectTrigger>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="refractiveIndex" className="text-xs text-muted-foreground">Refractive Index</Label>
              <Select defaultValue="1.56">
                <SelectTrigger id="refractiveIndex">
                  <SelectValue placeholder="Select Refractive Index" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.56">1.56</SelectItem>
                  <SelectItem value="1.61">1.61</SelectItem>
                  <SelectItem value="1.67">1.67</SelectItem>
                  <SelectItem value="1.74">1.74</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="lensType" className="text-xs text-muted-foreground">Lens Type</Label>
              <Select defaultValue="SV">
                <SelectTrigger id="lensType">
                  <SelectValue placeholder="Select Lens Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SV">SV</SelectItem>
                  <SelectItem value="KK">KK</SelectItem>
                  <SelectItem value="Prog">Prog</SelectItem>
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="lensCoating" className="text-xs text-muted-foreground">Lens Coating</Label>
              <Select defaultValue="UC">
                <SelectTrigger id="lensCoating">
                  <SelectValue placeholder="Select Lens Coating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UC">UC</SelectItem>
                  <SelectItem value="MC">MC</SelectItem>
                  <SelectItem value="BB">BB</SelectItem>
                  <SelectItem value="TRG">TRG</SelectItem>
                  <SelectItem value="BB + TRG">BB + TRG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tint" className="text-xs text-muted-foreground">Tint</Label>
              <Select value={tint} onValueChange={setTint}>
                <SelectTrigger id="tint">
                  <SelectValue placeholder="Select Tint" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="N/A">N/A</SelectItem>
                  <SelectItem value="One-Tone">One-Tone</SelectItem>
                  <SelectItem value="Two-Tone">Two-Tone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {tint !== "N/A" && (
              <div className="md:col-span-4">
                <Label htmlFor="color" className="text-xs text-muted-foreground">Color</Label>
                <Input
                  id="color"
                  placeholder="Enter tint color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter any additional notes about this order"
              className="min-h-[100px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;
