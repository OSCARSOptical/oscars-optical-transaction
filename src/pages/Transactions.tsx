
import TransactionList from '@/components/transactions/TransactionList';

const Transactions = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">Transactions</h2>
        <p className="text-muted-foreground">Manage your financial records</p>
      </div>
      <TransactionList />
    </div>
  );
};

export default Transactions;
