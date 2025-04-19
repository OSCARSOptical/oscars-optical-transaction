
import { useParams } from 'react-router-dom';

const TransactionDetail = () => {
  const { transactionCode } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">Transaction Details</h2>
        <p className="text-muted-foreground">Viewing transaction {transactionCode}</p>
      </div>
    </div>
  );
};

export default TransactionDetail;
