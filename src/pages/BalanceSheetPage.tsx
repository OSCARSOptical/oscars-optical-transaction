
import BalanceSheet from '@/components/balanceSheet/BalanceSheet';
import BreadcrumbNav from '@/components/layout/Breadcrumb';

const BalanceSheetPage = () => {
  return (
    <div className="space-y-6">
      <BreadcrumbNav 
        items={[
          { label: 'Balance Sheet' }
        ]}
      />
      <BalanceSheet />
    </div>
  );
};

export default BalanceSheetPage;
