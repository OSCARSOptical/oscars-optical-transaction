
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import AppHeader from './AppHeader';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  // For auth pages, render without layout
  if (
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password'
  ) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} />
      <main
        className={cn(
          "transition-all duration-300 ease-in-out pt-6 pb-16 px-4 md:px-6",
          isSidebarOpen ? "ml-64" : "ml-0"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
