
import { useState } from 'react';
import { usePatientTransactions } from '@/hooks/usePatientTransactions';
import { TransactionReport } from '@/components/reports/TransactionReport';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const Reports = () => {
  const [showJobOrders, setShowJobOrders] = useState(false);
  // Use a patient ID that we know exists (Oscar Santos)
  const { transactions, loading } = usePatientTransactions('PX-OS-0000001');

  // Calculate totals from all transactions
  const totalTransactions = transactions?.length || 0;

  // Sort transactions by date in descending order (latest first)
  const sortedTransactions = [...(transactions || [])].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Reports</h2>
          <p className="text-muted-foreground">Generate and print transaction reports</p>
        </div>
      </div>

      <div>
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setShowJobOrders(!showJobOrders)}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Job Orders</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              All recorded job orders
            </p>
          </CardContent>
        </Card>
      </div>

      {showJobOrders && (
        loading ? (
          <div className="text-center py-10">Loading transactions...</div>
        ) : (
          <TransactionReport transactions={sortedTransactions} />
        )
      )}
    </div>
  );
};

export default Reports;
