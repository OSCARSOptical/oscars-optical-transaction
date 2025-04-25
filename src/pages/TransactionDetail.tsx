
import { useParams } from 'react-router-dom';
import { TransactionView } from '@/components/transactions/detail/TransactionView';
import { LoadingState } from '@/components/transactions/detail/LoadingState';
import { ErrorState } from '@/components/transactions/detail/ErrorState';
import { useTransactionDetail } from '@/hooks/useTransactionDetail';

const TransactionDetail = () => {
  const { transactionCode, patientCode } = useParams<{ transactionCode: string; patientCode: string }>();
  const { transaction, patient, loading, handleClaimedToggle } = useTransactionDetail(transactionCode, patientCode);

  if (loading) {
    return <LoadingState />;
  }

  if (!transaction) {
    return <ErrorState transactionCode={transactionCode} />;
  }

  const breadcrumbItems = [
    { label: 'Patients', href: '/patients' },
    { label: patient ? `${patient.firstName} ${patient.lastName}` : patientCode || '', href: `/patients/${patientCode || transaction.patientCode}` },
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
