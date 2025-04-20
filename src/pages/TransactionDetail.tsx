import { useParams, useNavigate } from 'react-router-dom';
import BreadcrumbNav from '@/components/layout/Breadcrumb';
import { useEffect, useState } from 'react';
import { Transaction } from '@/types';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const TransactionDetail = () => {
  const { transactionCode } = useParams<{ transactionCode: string }>();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockTransaction: Transaction = {
        id: "1",
        code: transactionCode || "TX25-04-00001",
        date: "2025-04-10",
        patientCode: "PX-JD-0000001",
        patientName: "John Doe",
        firstName: "John",
        lastName: "Doe",
        type: "Complete",
        grossAmount: 7500.00,
        deposit: 2500.00,
        balance: 5000.00,
        lensCapital: 1200.00,
        edgingPrice: 150.00,
        otherExpenses: 50.00,
        totalExpenses: 1400.00,
        claimed: true,
        dateClaimed: "2025-04-15"
      };
      
      setTransaction(mockTransaction);
      setLoading(false);
    }, 500);
  }, [transactionCode]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit', 
      day: '2-digit', 
      year: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      currencyDisplay: 'symbol',
    }).format(amount).replace('PHP', '₱');
  };

  const handleClaimedToggle = () => {
    if (!transaction) return;
    
    const updatedTransaction = {
      ...transaction,
      claimed: !transaction.claimed,
      dateClaimed: !transaction.claimed ? new Date().toISOString() : null
    };
    
    setTransaction(updatedTransaction);
    
    toast({
      title: "✓ Saved!",
      className: "bg-[#FFC42B] text-[#241715] rounded-lg",
      duration: 2000,
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Complete':
        return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-50';
      case 'Eye Exam':
        return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50';
      case 'Frame Replacement':
        return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50';
      case 'Lens Replacement':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-50';
      case 'Medical Certificate':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-50';
      case 'Contact Lens':
        return 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-50';
      case 'Repair':
        return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-50';
      case 'Return':
        return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-50';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <BreadcrumbNav 
          items={[
            { label: 'Transactions', href: '/transactions' },
            { label: 'Loading...' }
          ]}
        />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading transaction details...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="space-y-4">
        <BreadcrumbNav 
          items={[
            { label: 'Transactions', href: '/transactions' }
          ]}
        />
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Transaction not found</AlertTitle>
          <AlertDescription>
            The transaction with code {transactionCode} could not be found.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/transactions')}>
          Return to Transactions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BreadcrumbNav 
        items={[
          { label: 'Transactions', href: '/transactions' },
          { label: transaction.patientName, href: `/patients/${transaction.patientCode}` },
          { label: transaction.code }
        ]}
      />
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-bold">Transaction {transaction.code}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Transaction Date</h3>
              <p className="text-lg font-medium">{formatDate(transaction.date)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Transaction Type</h3>
              <Badge 
                variant="outline" 
                className={getTypeColor(transaction.type)}
              >
                {transaction.type}
              </Badge>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Claimed Status</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Checkbox 
                  checked={transaction.claimed} 
                  onCheckedChange={handleClaimedToggle}
                  id="claimed"
                />
                <label htmlFor="claimed" className="text-sm cursor-pointer">
                  {transaction.claimed ? 'Claimed' : 'Not Claimed'}
                </label>
                {transaction.claimed && (
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-500">Claimed on {formatDate(transaction.dateClaimed)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Patient Name</h3>
              <p className="text-lg font-medium">{transaction.patientName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Patient ID</h3>
              <p className="text-lg font-medium text-[#9E0214] hover:underline cursor-pointer" 
                 onClick={() => navigate(`/patients/${transaction.patientCode}`)}>
                {transaction.patientCode}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                <TableCell className="text-right">{formatCurrency(transaction.grossAmount)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Deposit</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.deposit)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Balance</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.balance)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Expenses</TableCell>
                <TableCell className="text-right"></TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Lens Capital</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.lensCapital)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Edging Price</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.edgingPrice)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="pl-8">Other Expenses</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.otherExpenses)}</TableCell>
              </TableRow>
              <TableRow className="font-medium">
                <TableCell>Total Expenses</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.totalExpenses)}</TableCell>
              </TableRow>
              <TableRow className="font-bold">
                <TableCell>Net Income</TableCell>
                <TableCell className="text-right">{formatCurrency(transaction.deposit - transaction.totalExpenses)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Additional order details would go here.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Refraction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Refraction details would go here.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Doctor & Remarks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Doctor information and remarks would go here.</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Order Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Order notes would go here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionDetail;
