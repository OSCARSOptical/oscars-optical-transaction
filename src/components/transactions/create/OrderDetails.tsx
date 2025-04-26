import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { NA_TRANSACTION_TYPES } from "./order-details/constants";
import { getPricesForCombination } from "./constants/priceMappings";
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
    frameType?: string;
    orderNotes?: string;
  };
  onPricesChange?: (prices: { lensCapital: number; edgingPrice: number; otherExpenses: number }) => void;
}

const OrderDetails = ({ 
  initialType, 
  onTypeChange, 
  readOnly = false,
  initialData = {},
  onPricesChange
}: OrderDetailsProps) => {
  const [transactionType, setTransactionType] = useState(initialData.transactionType || "");
  const [transactionDate, setTransactionDate] = useState(
    initialData.transactionDate ? new Date(initialData.transactionDate) : new Date()
  );
  const [refractiveIndex, setRefractiveIndex] = useState(initialData.refractiveIndex || "");
  const [lensType, setLensType] = useState(initialData.lensType || "");
  const [lensCoating, setLensCoating] = useState(initialData.lensCoating || "");
  const [tint, setTint] = useState(initialData.tint || "");
  const [frameType, setFrameType] = useState(initialData.frameType || "");
  const [color, setColor] = useState(initialData.color || "");
  const [notes, setNotes] = useState(initialData.orderNotes || "");

  const shouldDisableFields = NA_TRANSACTION_TYPES.includes(transactionType);
  const showColorField = tint === "One-Tone" || tint === "Two-Tone";

  useEffect(() => {
    if (shouldDisableFields) {
      setRefractiveIndex("N/A");
      setLensType("N/A");
      setLensCoating("N/A");
      setTint("N/A");
      setFrameType("N/A");
    } else {
      if (refractiveIndex === "N/A") setRefractiveIndex("");
      if (lensType === "N/A") setLensType("");
      if (lensCoating === "N/A") setLensCoating("");
      if (tint === "N/A") setTint("");
      if (frameType === "N/A") setFrameType("");
    }
  }, [transactionType]);

  useEffect(() => {
    if (!shouldDisableFields && refractiveIndex && lensType && lensCoating && tint && frameType) {
      const prices = getPricesForCombination(
        refractiveIndex,
        lensType,
        lensCoating,
        tint,
        frameType
      );
      onPricesChange?.(prices);
    }
  }, [refractiveIndex, lensType, lensCoating, tint, frameType, shouldDisableFields]);

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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <DateSelector 
                date={transactionDate} 
                onDateChange={setTransactionDate} 
                readOnly={readOnly} 
                label="Transaction Date"
              />
            </div>
            <div className="w-full md:w-1/2">
              <TransactionTypeSelector 
                transactionType={transactionType} 
                onTypeChange={handleTypeChange} 
                readOnly={readOnly} 
              />
            </div>
          </div>

          <LensSpecifications
            refractiveIndex={refractiveIndex}
            lensType={lensType}
            lensCoating={lensCoating}
            tint={tint}
            frameType={frameType}
            onRefractiveIndexChange={setRefractiveIndex}
            onLensTypeChange={setLensType}
            onLensCoatingChange={setLensCoating}
            onTintChange={setTint}
            onFrameTypeChange={setFrameType}
            disabled={shouldDisableFields}
            readOnly={readOnly}
            showFrameType={!showColorField}
          />

          {showColorField && (
            <div className="w-full">
              <ColorInput 
                color={color} 
                onColorChange={setColor} 
                readOnly={readOnly} 
              />
            </div>
          )}
          
          {showColorField && (
            <div className="w-full">
              <LensSpecifications
                frameTypeOnly={true}
                frameType={frameType}
                onFrameTypeChange={setFrameType}
                disabled={shouldDisableFields}
                readOnly={readOnly}
                showFrameType={true}
              />
            </div>
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
