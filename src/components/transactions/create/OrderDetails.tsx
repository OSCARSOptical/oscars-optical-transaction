
import { Card, CardContent } from "@/components/ui/card";
import { Transaction } from "@/types";
import { useOrderDetails } from "./order-details/hooks/useOrderDetails";
import OrderDetailsHeader from "./order-details/OrderDetailsHeader";
import TransactionFields from "./order-details/components/TransactionFields";
import LensSpecifications from "./order-details/LensSpecifications";
import ColorInput from "./order-details/ColorInput";
import OrderNotes from "./order-details/OrderNotes";

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
  const {
    transactionType,
    transactionDate,
    refractiveIndex,
    lensType,
    lensCoating,
    tint,
    frameType,
    color,
    notes,
    shouldDisableFields,
    showColorField,
    handleTypeChange,
    handleDateChange,
    setRefractiveIndex,
    setLensType,
    setLensCoating,
    setTint,
    setFrameType,
    setColor,
    setNotes
  } = useOrderDetails({
    initialType,
    onTypeChange,
    onDateChange,
    initialData,
    onPricesChange,
    onOrderDataChange
  });

  return (
    <Card>
      <OrderDetailsHeader />
      <CardContent>
        <div className="space-y-6">
          <TransactionFields
            transactionType={transactionType}
            transactionDate={transactionDate}
            onTypeChange={handleTypeChange}
            onDateChange={handleDateChange}
            readOnly={readOnly}
          />

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
