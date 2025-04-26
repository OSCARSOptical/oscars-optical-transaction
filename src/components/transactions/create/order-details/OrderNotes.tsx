
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface OrderNotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  readOnly?: boolean;
}

const OrderNotes = ({ notes, onNotesChange, readOnly = false }: OrderNotesProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Notes</Label>
      <Textarea
        id="notes"
        placeholder="Enter any additional notes about this order"
        className={cn(
          "min-h-[100px]",
          readOnly && "bg-muted cursor-default"
        )}
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        readOnly={readOnly}
      />
    </div>
  );
};

export default OrderNotes;
