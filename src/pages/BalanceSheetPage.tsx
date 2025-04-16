
import BalanceSheet from '@/components/balanceSheet/BalanceSheet';

const BalanceSheetPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">Balance Sheet</h2>
        <p className="text-muted-foreground">Financial overview and analytics</p>
      </div>
      <BalanceSheet />
    </div>
  );
};

export default BalanceSheetPage;
