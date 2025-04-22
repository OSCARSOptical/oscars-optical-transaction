
import { useParams } from 'react-router-dom';
import { TransactionView } from '@/components/transactions/detail/TransactionView';
import { TransactionLoading } from '@/components/transactions/detail/TransactionLoading';
import { TransactionError } from '@/components/transactions/detail/TransactionError';
import { useTransactionData } from '@/hooks/useTransactionData';
import { usePatientData } from '@/hooks/usePatientData';

const TransactionDetail = () => {
  const { transactionCode, patientCode } = useParams<{ transactionCode: string, patientCode: string }>();
  const { transaction, loading, handleClaimedToggle } = useTransactionData(transactionCode, patientCode);
  const { patient } = usePatientData(transaction?.patientCode);

  if (loading) {
    return <TransactionLoading />;
  }

  if (!transaction) {
    return <TransactionError transactionCode={transactionCode} />;
  }

  // Define breadcrumb items to ensure consistent navigation structure
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
