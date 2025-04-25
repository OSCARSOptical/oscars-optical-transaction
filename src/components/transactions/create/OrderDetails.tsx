
import { useState, useEffect } from "react";
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
import { CalendarIcon } from "lucide-react";

const NA_TRANSACTION_TYPES = [
  "Eye Exam",
  "Frame Replacement",
  "Medical Certificate",
  "Contact Lens",
  "Repair",
  "Return"
];

interface OrderDetailsProps {
  initialType?: string;
  onTypeChange?: (type: string) => void;
  readOnly?: boolean;
  initialData?: {
    transactionDate?: string;
    transactionType?: string;
    refractiveIndex?: string;
    lensType?: string;
    lensCoating?: string;
    tint?: string;
    color?: string;
    orderNotes?: string;
  }
}

const OrderDetails = ({ 
  initialType, 
  onTypeChange, 
  readOnly = false,
  initialData = {}
}: OrderDetailsProps) => {
  const [transactionType, setTransactionType] = useState(initialData.transactionType || "");
  const [transactionDate, setTransactionDate] = useState(
    initialData.transactionDate || new Date().toISOString().substring(0, 10)
  );
  const [refractiveIndex, setRefractiveIndex] = useState(initialData.refractiveIndex || "");
  const [lensType, setLensType] = useState(initialData.lensType || "");
  const [lensCoating, setLensCoating] = useState(initialData.lensCoating || "");
  const [tint, setTint] = useState(initialData.tint || "");
  const [color, setColor] = useState(initialData.color || "");
  const [notes, setNotes] = useState(initialData.orderNotes || "");

  const shouldDisableFields = NA_TRANSACTION_TYPES.includes(transactionType);

  useEffect(() => {
    if (shouldDisableFields) {
      setRefractiveIndex("N/A");
      setLensType("N/A");
      setLensCoating("N/A");
      setTint("N/A");
    } else {
      // Only clear if coming from a disabled state
      if (refractiveIndex === "N/A") setRefractiveIndex("");
      if (lensType === "N/A") setLensType("");
      if (lensCoating === "N/A") setLensCoating("");
      if (tint === "N/A") setTint("");
    }
  }, [transactionType]);

  const handleTypeChange = (value: string) => {
    setTransactionType(value);
    if (onTypeChange) {
      onTypeChange(value);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Order Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="transactionDate" className="text-xs text-muted-foreground">Transaction Date</Label>
              <div className="relative">
                <Input
                  id="transactionDate"
                  type="date"
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
                  disabled={readOnly}
                  className="w-full pr-10"
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
              </div>
            </div>
            <div>
              <Label htmlFor="transactionType" className="text-xs text-muted-foreground">Transaction Type</Label>
              <Select 
                value={transactionType}
                onValueChange={handleTypeChange}
                disabled={readOnly}
              >
                <SelectTrigger id="transactionType">
                  <SelectValue placeholder="Select Transaction Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Complete">Complete</SelectItem>
                  <SelectItem value="Eye Exam">Eye Exam</SelectItem>
                  <SelectItem value="Frame Replacement">Frame Replacement</SelectItem>
                  <SelectItem value="Lens Replacement">Lens Replacement</SelectItem>
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
              <Select 
                value={refractiveIndex} 
                onValueChange={setRefractiveIndex}
                disabled={readOnly || shouldDisableFields}
              >
                <SelectTrigger id="refractiveIndex">
                  <SelectValue placeholder="Select Refractive Index" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="N/A">N/A</SelectItem>
                  <SelectItem value="1.56">1.56</SelectItem>
                  <SelectItem value="1.61">1.61</SelectItem>
                  <SelectItem value="1.67">1.67</SelectItem>
                  <SelectItem value="1.74">1.74</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="lensType" className="text-xs text-muted-foreground">Lens Type</Label>
              <Select 
                value={lensType} 
                onValueChange={setLensType}
                disabled={readOnly || shouldDisableFields}
              >
                <SelectTrigger id="lensType">
                  <SelectValue placeholder="Select Lens Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="N/A">N/A</SelectItem>
                  <SelectItem value="SV">SV</SelectItem>
                  <SelectItem value="KK">KK</SelectItem>
                  <SelectItem value="Prog">Prog</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="lensCoating" className="text-xs text-muted-foreground">Lens Coating</Label>
              <Select 
                value={lensCoating} 
                onValueChange={setLensCoating}
                disabled={readOnly || shouldDisableFields}
              >
                <SelectTrigger id="lensCoating">
                  <SelectValue placeholder="Select Lens Coating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="N/A">N/A</SelectItem>
                  <SelectItem value="UC">UC</SelectItem>
                  <SelectItem value="MC">MC</SelectItem>
                  <SelectItem value="BB">BB</SelectItem>
                  <SelectItem value="TRG">TRG</SelectItem>
                  <SelectItem value="BB TRG">BB + TRG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tint" className="text-xs text-muted-foreground">Tint</Label>
              <Select 
                value={tint} 
                onValueChange={setTint}
                disabled={readOnly || shouldDisableFields}
              >
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
            {(tint === "One-Tone" || tint === "Two-Tone") && (
              <div className="md:col-span-4">
                <Label htmlFor="color" className="text-xs text-muted-foreground">Color</Label>
                <Input
                  id="color"
                  placeholder="Enter tint color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  readOnly={readOnly}
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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              readOnly={readOnly}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;
