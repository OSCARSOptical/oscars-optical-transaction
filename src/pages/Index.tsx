
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-3xl mb-8">
        <img 
          src="/lovable-uploads/2ebe7ecc-af2a-4e7d-bba7-c42cae035782.png" 
          alt="Oscars Optical Clinic" 
          className="mx-auto mb-6 max-h-24"
        />
        <p className="text-xl text-gray-600 mb-8">
          The modern solution for healthcare professionals to manage patients, 
          track transactions, and optimize financial performance.
        </p>
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => navigate('/login')}
            className="bg-crimson-600 hover:bg-crimson-700 px-8 py-6 text-lg"
          >
            Login
          </Button>
          <Button 
            onClick={() => navigate('/register')}
            variant="outline"
            className="px-8 py-6 text-lg border-crimson-600 text-crimson-600 hover:bg-crimson-50"
          >
            Register
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
