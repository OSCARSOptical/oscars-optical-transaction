
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { NA_TRANSACTION_TYPES } from "./order-details/constants";
import OrderDetailsHeader from "./order-details/OrderDetailsHeader";
import DateSelector from "./order-details/DateSelector";
import TransactionTypeSelector from "./order-details/TransactionTypeSelector";
import LensSpecifications from "./order-details/LensSpecifications";
import ColorInput from "./order-details/ColorInput";
import OrderNotes from "./order-details/OrderNotes";

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
    initialData.transactionDate ? new Date(initialData.transactionDate) : new Date()
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
      <OrderDetailsHeader />
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <DateSelector 
              date={transactionDate} 
              onDateChange={setTransactionDate} 
              readOnly={readOnly} 
            />
            
            <TransactionTypeSelector 
              transactionType={transactionType} 
              onTypeChange={handleTypeChange} 
              readOnly={readOnly} 
            />
          </div>

          <LensSpecifications
            refractiveIndex={refractiveIndex}
            lensType={lensType}
            lensCoating={lensCoating}
            tint={tint}
            onRefractiveIndexChange={setRefractiveIndex}
            onLensTypeChange={setLensType}
            onLensCoatingChange={setLensCoating}
            onTintChange={setTint}
            disabled={shouldDisableFields}
            readOnly={readOnly}
          />

          {(tint === "One-Tone" || tint === "Two-Tone") && (
            <ColorInput 
              color={color} 
              onColorChange={setColor} 
              readOnly={readOnly} 
            />
          )}

          <OrderNotes 
            notes={notes} 
            onNotesChange={setNotes} 
            readOnly={readOnly} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;
