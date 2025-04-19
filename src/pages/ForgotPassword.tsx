
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="mb-8 text-center">
        <img 
          src="/lovable-uploads/2ebe7ecc-af2a-4e7d-bba7-c42cae035782.png" 
          alt="Oscars Optical Clinic" 
          className="mx-auto mb-6 max-h-24"
        />
        <p className="text-gray-600">Patient & Financial Management System</p>
      </div>
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;
