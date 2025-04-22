import { useParams, useSearchParams } from 'react-router-dom';
import { TransactionView } from '@/components/transactions/detail/TransactionView';
import { TransactionLoading } from '@/components/transactions/detail/TransactionLoading';
import { TransactionError } from '@/components/transactions/detail/TransactionError';
import { useTransactionData } from '@/hooks/useTransactionData';
import { usePatientData } from '@/hooks/usePatientData';

const TransactionDetail = () => {
  const { transactionCode } = useParams<{ transactionCode: string }>();
  const [searchParams] = useSearchParams();
  const patientCode = searchParams.get('patientCode') || undefined;
  
  const { transaction, loading, handleClaimedToggle } = useTransactionData(transactionCode, patientCode);
  const { patient } = usePatientData(transaction?.patientCode);

  if (loading) {
    return <TransactionLoading />;
  }

  if (!transaction) {
    return <TransactionError transactionCode={transactionCode} />;
  }

  const breadcrumbItems = [
    { label: 'Patients', href: '/patients' },
    { label: `${transaction.firstName} ${transaction.lastName}`, href: `/patients/${transaction.patientCode}` },
    { label: transaction.code }
  ];

  return (
    <TransactionView
      transaction={transaction}
      patientData={patient}
      onClaimedToggle={handleClaimedToggle}
      pageTitle="Transaction Details"
      breadcrumbItems={breadcrumbItems}
    />
  );
};

export default TransactionDetail;
