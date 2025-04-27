
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
import { Transaction } from "@/types";

interface OrderDetailsProps {
  initialType?: Transaction['type'];
  onTypeChange?: (type: Transaction['type']) => void;
  onDateChange?: (date: Date) => void;
  readOnly?: boolean;
  initialData?: {
    transactionDate?: string;
    transactionType?: Transaction['type'];
    refractiveIndex?: string;
    lensType?: string;
    lensCoating?: string;
    tint?: string;
    color?: string;
    frameType?: string;
    orderNotes?: string;
  };
  onPricesChange?: (prices: { lensCapital: number; edgingPrice: number; otherExpenses: number }) => void;
  onOrderDataChange?: (data: {
    refractiveIndex?: string;
    lensType?: string;
    lensCoating?: string;
    tint?: string;
    color?: string;
    frameType?: string;
    orderNotes?: string;
  }) => void;
}

const OrderDetails = ({ 
  initialType, 
  onTypeChange, 
  onDateChange,
  readOnly = false,
  initialData = {},
  onPricesChange,
  onOrderDataChange
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
  }, [transactionType, shouldDisableFields]);

  useEffect(() => {
    if (!shouldDisableFields && refractiveIndex && lensType && lensCoating && tint && frameType) {
      const prices = getPricesForCombination(
        refractiveIndex,
        lensType,
        lensCoating,
        tint,
        frameType
      );
      if (onPricesChange) {
        onPricesChange(prices);
      }
    }
  }, [refractiveIndex, lensType, lensCoating, tint, frameType, shouldDisableFields, onPricesChange]);

  // Send data changes to parent component
  useEffect(() => {
    if (onOrderDataChange) {
      onOrderDataChange({
        refractiveIndex,
        lensType,
        lensCoating,
        tint,
        color,
        frameType,
        orderNotes: notes
      });
    }
  }, [refractiveIndex, lensType, lensCoating, tint, color, frameType, notes, onOrderDataChange]);

  const handleTypeChange = (value: Transaction['type']) => {
    setTransactionType(value);
    if (onTypeChange) {
      onTypeChange(value);
    }
  };

  const handleDateChange = (date: Date) => {
    setTransactionDate(date);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  const handleRefractiveIndexChange = (value: string) => {
    setRefractiveIndex(value);
  };

  const handleLensTypeChange = (value: string) => {
    setLensType(value);
  };

  const handleLensCoatingChange = (value: string) => {
    setLensCoating(value);
  };

  const handleTintChange = (value: string) => {
    setTint(value);
  };

  const handleFrameTypeChange = (value: string) => {
    setFrameType(value);
  };

  const handleColorChange = (value: string) => {
    setColor(value);
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
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
                onDateChange={handleDateChange} 
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
            onRefractiveIndexChange={handleRefractiveIndexChange}
            onLensTypeChange={handleLensTypeChange}
            onLensCoatingChange={handleLensCoatingChange}
            onTintChange={handleTintChange}
            onFrameTypeChange={handleFrameTypeChange}
            disabled={shouldDisableFields}
            readOnly={readOnly}
            showFrameType={!showColorField}
          />

          {showColorField && (
            <div className="w-full">
              <ColorInput 
                color={color} 
                onColorChange={handleColorChange} 
                readOnly={readOnly} 
              />
            </div>
          )}
          
          {showColorField && (
            <div className="w-full">
              <LensSpecifications
                frameTypeOnly={true}
                frameType={frameType}
                onFrameTypeChange={handleFrameTypeChange}
                disabled={shouldDisableFields}
                readOnly={readOnly}
                showFrameType={true}
              />
            </div>
          )}

          <OrderNotes 
            notes={notes} 
            onNotesChange={handleNotesChange} 
            readOnly={readOnly} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;
