
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/formatters";

const FinancialDetails = () => {
  const [grossAmount, setGrossAmount] = useState<number>(0);
  const [deposit, setDeposit] = useState<number>(0);
  const [lensCapital, setLensCapital] = useState<number>(0);
  const [edgingPrice, setEdgingPrice] = useState<number>(0);
  const [otherExpenses, setOtherExpenses] = useState<number>(0);

  const balance = grossAmount - deposit;
  const totalExpenses = lensCapital + edgingPrice + otherExpenses;
  const netIncome = deposit - totalExpenses;

  const handleNumberInput = (value: string, setter: (num: number) => void) => {
    const numValue = value === "" ? 0 : Number(value);
    if (!isNaN(numValue)) {
      setter(numValue);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Financial Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Gross Amount</TableCell>
              <TableCell className="text-right">
                <Input
                  type="number"
                  min="0"
                  value={grossAmount || ""}
                  onChange={(e) => handleNumberInput(e.target.value, setGrossAmount)}
                  className="w-32 text-right ml-auto"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Deposit</TableCell>
              <TableCell className="text-right">
                <Input
                  type="number"
                  min="0"
                  max={grossAmount}
                  value={deposit || ""}
                  onChange={(e) => handleNumberInput(e.target.value, setDeposit)}
                  className="w-32 text-right ml-auto"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Balance</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(balance)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Expenses</TableCell>
              <TableCell className="text-right"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">Lens Capital</TableCell>
              <TableCell className="text-right">
                <Input
                  type="number"
                  min="0"
                  value={lensCapital || ""}
                  onChange={(e) => handleNumberInput(e.target.value, setLensCapital)}
                  className="w-32 text-right ml-auto"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">Edging Price</TableCell>
              <TableCell className="text-right">
                <Input
                  type="number"
                  min="0"
                  value={edgingPrice || ""}
                  onChange={(e) => handleNumberInput(e.target.value, setEdgingPrice)}
                  className="w-32 text-right ml-auto"
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="pl-8">Other Expenses</TableCell>
              <TableCell className="text-right">
                <Input
                  type="number"
                  min="0"
                  value={otherExpenses || ""}
                  onChange={(e) => handleNumberInput(e.target.value, setOtherExpenses)}
                  className="w-32 text-right ml-auto"
                />
              </TableCell>
            </TableRow>
            <TableRow className="font-medium">
              <TableCell>Total Expenses</TableCell>
              <TableCell className="text-right">
                {formatCurrency(totalExpenses)}
              </TableCell>
            </TableRow>
            <TableRow className="font-bold">
              <TableCell>Net Income</TableCell>
              <TableCell className="text-right">
                {formatCurrency(netIncome)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default FinancialDetails;

