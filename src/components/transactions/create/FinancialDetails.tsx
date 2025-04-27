
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FinancialDetailsProps {
  readOnly?: boolean;
  initialData?: {
    grossAmount?: number;
    deposit?: number;
    lensCapital?: number;
    edgingPrice?: number;
    otherExpenses?: number;
  };
  autofillPrices?: {
    lensCapital: number;
    edgingPrice: number;
    otherExpenses: number;
  };
  onDataChange?: (data: {
    grossAmount: number;
    deposit: number;
    lensCapital: number;
    edgingPrice: number;
    otherExpenses: number;
  }) => void;
}

const FinancialDetails = ({ 
  readOnly = false, 
  initialData = {},
  autofillPrices,
  onDataChange
}: FinancialDetailsProps) => {
  const [grossAmount, setGrossAmount] = useState<number>(initialData?.grossAmount || 0);
  const [deposit, setDeposit] = useState<number>(initialData?.deposit || 0);
  const [balance, setBalance] = useState<number>(0);
  const [lensCapital, setLensCapital] = useState<number>(initialData?.lensCapital || 0);
  const [edgingPrice, setEdgingPrice] = useState<number>(initialData?.edgingPrice || 0);
  const [otherExpenses, setOtherExpenses] = useState<number>(initialData?.otherExpenses || 0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [netIncome, setNetIncome] = useState<number>(0);
  const [isManuallyEdited, setIsManuallyEdited] = useState({
    lensCapital: false,
    edgingPrice: false,
    otherExpenses: false
  });

  useEffect(() => {
    // Update prices from autofill only if not manually edited
    if (autofillPrices) {
      if (!isManuallyEdited.lensCapital) setLensCapital(autofillPrices.lensCapital);
      if (!isManuallyEdited.edgingPrice) setEdgingPrice(autofillPrices.edgingPrice);
      if (!isManuallyEdited.otherExpenses) setOtherExpenses(autofillPrices.otherExpenses);
    }
  }, [autofillPrices, isManuallyEdited.lensCapital, isManuallyEdited.edgingPrice, isManuallyEdited.otherExpenses]);

  useEffect(() => {
    // Calculate balance
    const calculatedBalance = grossAmount - deposit;
    setBalance(calculatedBalance);
    
    // Calculate total expenses
    const calculatedTotalExpenses = lensCapital + edgingPrice + otherExpenses;
    setTotalExpenses(calculatedTotalExpenses);
    
    // Calculate net income
    const calculatedNetIncome = deposit - calculatedTotalExpenses;
    setNetIncome(calculatedNetIncome);

    // Send data to parent component
    if (onDataChange) {
      onDataChange({
        grossAmount,
        deposit,
        lensCapital,
        edgingPrice,
        otherExpenses
      });
    }
  }, [grossAmount, deposit, lensCapital, edgingPrice, otherExpenses, onDataChange]);

  const handleManualEdit = (field: keyof typeof isManuallyEdited) => {
    setIsManuallyEdited(prev => ({
      ...prev,
      [field]: true
    }));
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Financial Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grossAmount">Gross Amount</Label>
              <Input
                id="grossAmount"
                type="number"
                step="0.01"
                value={grossAmount}
                onChange={readOnly ? undefined : (e) => setGrossAmount(parseFloat(e.target.value) || 0)}
                readOnly={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deposit">Deposit</Label>
              <Input
                id="deposit"
                type="number"
                step="0.01"
                value={deposit}
                onChange={readOnly ? undefined : (e) => setDeposit(parseFloat(e.target.value) || 0)}
                readOnly={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="balance">Balance</Label>
              <Input
                id="balance"
                type="number"
                value={balance}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">Expenses</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lensCapital">Lens Capital</Label>
                <Input
                  id="lensCapital"
                  type="number"
                  step="0.01"
                  value={lensCapital}
                  onChange={readOnly ? undefined : (e) => {
                    setLensCapital(parseFloat(e.target.value) || 0);
                    handleManualEdit('lensCapital');
                  }}
                  readOnly={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edgingPrice">Edging Price</Label>
                <Input
                  id="edgingPrice"
                  type="number"
                  step="0.01"
                  value={edgingPrice}
                  onChange={readOnly ? undefined : (e) => {
                    setEdgingPrice(parseFloat(e.target.value) || 0);
                    handleManualEdit('edgingPrice');
                  }}
                  readOnly={readOnly}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="otherExpenses">Other Expenses</Label>
                <Input
                  id="otherExpenses"
                  type="number"
                  step="0.01"
                  value={otherExpenses}
                  onChange={readOnly ? undefined : (e) => {
                    setOtherExpenses(parseFloat(e.target.value) || 0);
                    handleManualEdit('otherExpenses');
                  }}
                  readOnly={readOnly}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label htmlFor="totalExpenses">Total Expenses</Label>
              <Input
                id="totalExpenses"
                type="number"
                value={totalExpenses}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="netIncome">Net Income</Label>
              <Input
                id="netIncome"
                type="number"
                value={netIncome}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialDetails;
