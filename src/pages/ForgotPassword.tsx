
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-crimson-700 mb-2">Crimson Ledger</h1>
        <p className="text-gray-600">Patient & Financial Management System</p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;
