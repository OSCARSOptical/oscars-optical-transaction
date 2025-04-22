
import { useState } from 'react';
import { usePatientTransactions } from '@/hooks/usePatientTransactions';
import { TransactionReport } from '@/components/reports/TransactionReport';

const Reports = () => {
  const { transactions } = usePatientTransactions('PX-OS-0000001');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Reports</h2>
          <p className="text-muted-foreground">Generate and print transaction reports</p>
        </div>
      </div>

      <TransactionReport transactions={transactions} />
    </div>
  );
};

export default Reports;
