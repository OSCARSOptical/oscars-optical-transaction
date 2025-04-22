
import { useState } from 'react';
import { usePatientTransactions } from '@/hooks/usePatientTransactions';
import { TransactionReport } from '@/components/reports/TransactionReport';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const Reports = () => {
  // Use a patient ID that we know exists (Oscar Santos)
  const { transactions, loading } = usePatientTransactions('PX-OS-0000001');

  // Calculate totals from all transactions
  const totalTransactions = transactions?.length || 0;
  const totalAmount = transactions?.reduce((sum, tx) => sum + tx.totalExpenses, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Reports</h2>
          <p className="text-muted-foreground">Generate and print transaction reports</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              All recorded transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading transactions...</div>
      ) : (
        <TransactionReport transactions={transactions} />
      )}
    </div>
  );
};

export default Reports;
