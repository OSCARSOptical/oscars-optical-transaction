
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import FloatingActionButton from '../common/FloatingActionButton';
import NewTransactionModal from '../transactions/NewTransactionModal';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNewTransactionModalOpen, setIsNewTransactionModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loginStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(loginStatus === 'true');

    // Redirect to login if not logged in
    if (!loginStatus && 
        location.pathname !== '/login' && 
        location.pathname !== '/register' && 
        location.pathname !== '/forgot-password') {
      navigate('/login');
    }
  }, [location.pathname, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      
      // Check for exact Patient ID match (PX-XX-XXXXXXX format)
      if (searchQuery.match(/^PX-[A-Z]{2}-\d{7}$/)) {
        navigate(`/patients/${searchQuery}`);
        return;
      }
      
      // Check for exact Transaction ID match (TXXX-XX-XXXXX format)
      if (searchQuery.match(/^TX\d{2}-\d{2}-\d{5}$/)) {
        navigate(`/transactions/${searchQuery}`);
        return;
      }
      
      // Otherwise, go to patients with search filter
      navigate(`/patients?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const shouldShowFAB = () => {
    return (
      location.pathname === '/patients' ||
      location.pathname === '/transactions' ||
      location.pathname.startsWith('/patients/') ||
      location.pathname.startsWith('/transactions/')
    ) && !location.pathname.includes('/balance-sheet') && !location.pathname.includes('/reports');
  };

  if (
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password'
  ) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader toggleSidebar={toggleSidebar}>
        <div className="relative hidden md:block w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by patient or transaction ID, name..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </AppHeader>
      <Sidebar isOpen={isSidebarOpen} />
      <main
        className={cn(
          "transition-all duration-300 ease-in-out pt-6 pb-16 px-4 md:px-6",
          isSidebarOpen ? "ml-64" : "ml-0"
        )}
      >
        <Outlet />
      </main>
      {shouldShowFAB() && (
        <FloatingActionButton 
          onClick={() => setIsNewTransactionModalOpen(true)} 
        />
      )}
      <NewTransactionModal 
        isOpen={isNewTransactionModalOpen}
        onClose={() => setIsNewTransactionModalOpen(false)}
      />
    </div>
  );
}

export default MainLayout;
