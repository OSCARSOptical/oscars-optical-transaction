
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const OrderNotes = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Order Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="orderNotes">Notes</Label>
          <Textarea
            id="orderNotes"
            placeholder="Enter any additional notes about this order"
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderNotes;
