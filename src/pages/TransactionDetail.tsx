
import { useParams, useLocation } from 'react-router-dom';
import { TransactionView } from '@/components/transactions/detail/TransactionView';
import { TransactionLoading } from '@/components/transactions/detail/TransactionLoading';
import { TransactionError } from '@/components/transactions/detail/TransactionError';
import { useTransactionData } from '@/hooks/useTransactionData';
import { usePatientData } from '@/hooks/usePatientData';

const TransactionDetail = () => {
  const { transactionCode } = useParams<{ transactionCode: string }>();
  const location = useLocation();
  
  // Get patientCode from query params if available
  const queryParams = new URLSearchParams(location.search);
  const queryPatientCode = queryParams.get('patientCode');
  
  const { transaction, loading, handleClaimedToggle } = useTransactionData(transactionCode, queryPatientCode || undefined);
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
