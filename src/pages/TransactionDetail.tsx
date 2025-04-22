
import { useParams } from 'react-router-dom';
import { TransactionView } from '@/components/transactions/detail/TransactionView';
import { TransactionLoading } from '@/components/transactions/detail/TransactionLoading';
import { TransactionError } from '@/components/transactions/detail/TransactionError';
import { useTransactionData } from '@/hooks/useTransactionData';
import { usePatientData } from '@/hooks/usePatientData';

const TransactionDetail = () => {
  const { transactionCode } = useParams<{ transactionCode: string }>();
  const { transaction, loading, handleClaimedToggle } = useTransactionData(transactionCode, undefined);
  const patientCode = transaction?.patientCode;
  const { patient } = usePatientData(patientCode);

  if (loading) {
    return <TransactionLoading />;
  }

  if (!transaction) {
    return <TransactionError transactionCode={transactionCode} />;
  }

  // Define breadcrumb items to ensure consistent navigation structure
  const breadcrumbItems = [
    { label: 'Patients', href: '/patients' },
    { label: `${transaction.firstName} ${transaction.lastName}`, href: `/patients/${patientCode}` },
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
