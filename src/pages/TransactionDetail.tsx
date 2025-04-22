
import { useParams } from 'react-router-dom';
import { TransactionView } from '@/components/transactions/detail/TransactionView';
import { TransactionLoading } from '@/components/transactions/detail/TransactionLoading';
import { TransactionError } from '@/components/transactions/detail/TransactionError';
import { useTransactionData } from '@/hooks/useTransactionData';
import { usePatientData } from '@/hooks/usePatientData';

const TransactionDetail = () => {
  const { transactionCode, patientCode } = useParams<{ transactionCode: string; patientCode: string }>();
  const { transaction, loading, handleClaimedToggle } = useTransactionData(transactionCode, patientCode);
  const { patient } = usePatientData(patientCode);

  if (loading) {
    return <TransactionLoading />;
  }

  if (!transaction) {
    return <TransactionError transactionCode={transactionCode} />;
  }

  // Define breadcrumb items based on whether we have a patient code or not
  const breadcrumbItems = patientCode 
    ? [
        { label: 'Patients', href: '/patients' },
        { label: patient ? `${patient.firstName} ${patient.lastName}` : patientCode || '', href: `/patients/${patientCode}` },
        { label: transaction.code }
      ]
    : [
        { label: 'Transactions', href: '/transactions' },
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
