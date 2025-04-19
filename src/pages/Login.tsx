
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [navigate]);

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
      <LoginForm />
    </div>
  );
};

export default Login;
