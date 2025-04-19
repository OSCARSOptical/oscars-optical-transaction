
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const OrderDetails = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Order Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="interpupillaryDistance">Interpupillary Distance</Label>
            <Select defaultValue="62.0">
              <SelectTrigger id="interpupillaryDistance">
                <SelectValue placeholder="Select IPD" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 51 }, (_, i) => (50 + i * 0.5).toFixed(1)).map(value => (
                  <SelectItem key={value} value={value}>{value} mm</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="refractiveIndex">Refractive Index</Label>
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
          <div className="space-y-2">
            <Label htmlFor="lensType">Lens Type</Label>
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
          <div className="space-y-2">
            <Label htmlFor="lensCoating">Lens Coating</Label>
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
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;
