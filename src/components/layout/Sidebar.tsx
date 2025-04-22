import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart, 
  Users, 
  Receipt, 
  LayoutDashboard, 
  CreditCard,
  FileText,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

function Logo() {
  return (
    <div className="flex items-center h-16 px-6">
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6 text-[#9E0214]"
        >
          <path d="M3 11.75h18M3 7.75h18M3 15.75h18" />
        </svg>
        <div className="ml-2 text-lg font-bold text-[#241715]">OptWise</div>
      </div>
    </div>
  );
}

interface SidebarProps {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed = false }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();
  const [reportsOpen, setReportsOpen] = useState(false);

  const isActive = (path: string) => currentPath.startsWith(path);
  
  useEffect(() => {
    if (currentPath.startsWith('/reports')) {
      setReportsOpen(true);
    }
  }, [currentPath]);

  return (
    <div
      className={cn(
        'min-h-screen border-r bg-white',
        collapsed ? 'w-14' : 'w-64'
      )}
    >
      <div className="sticky top-0 flex flex-col h-full">
        <Logo />
        
        <nav className="flex-1 space-y-2 overflow-y-auto py-3 px-2">
          <div
            className={cn(
              "flex items-center h-10 px-3 rounded-lg hover:bg-[#9E0214]/10 cursor-pointer transition-colors text-[#241715]",
              isActive('/dashboard') ? "bg-[#9E0214]/10 text-[#9E0214] font-medium" : ""
            )}
            onClick={() => navigate('/dashboard')}
          >
            <LayoutDashboard className="w-5 h-5" />
            {!collapsed && <span className="ml-3">Dashboard</span>}
          </div>
          
          <div
            className={cn(
              "flex items-center h-10 px-3 rounded-lg hover:bg-[#9E0214]/10 cursor-pointer transition-colors text-[#241715]",
              isActive('/patients') ? "bg-[#9E0214]/10 text-[#9E0214] font-medium" : ""
            )}
            onClick={() => navigate('/patients')}
          >
            <Users className="w-5 h-5" />
            {!collapsed && <span className="ml-3">Patients</span>}
          </div>
          
          <div
            className={cn(
              "flex items-center h-10 px-3 rounded-lg hover:bg-[#9E0214]/10 cursor-pointer transition-colors text-[#241715]",
              isActive('/transactions') ? "bg-[#9E0214]/10 text-[#9E0214] font-medium" : ""
            )}
            onClick={() => navigate('/transactions')}
          >
            <Receipt className="w-5 h-5" />
            {!collapsed && <span className="ml-3">Transactions</span>}
          </div>
          
          <div
            className={cn(
              "flex items-center h-10 px-3 rounded-lg hover:bg-[#9E0214]/10 cursor-pointer transition-colors text-[#241715]",
              isActive('/balance-sheet') ? "bg-[#9E0214]/10 text-[#9E0214] font-medium" : ""
            )}
            onClick={() => navigate('/balance-sheet')}
          >
            <CreditCard className="w-5 h-5" />
            {!collapsed && <span className="ml-3">Balance Sheet</span>}
          </div>
          
          <div className="space-y-1">
            <div
              className={cn(
                "flex items-center justify-between h-10 px-3 rounded-lg cursor-pointer transition-colors",
                isActive('/reports') ? "bg-[#9E0214]/10 text-[#9E0214] font-medium" : "text-[#241715] hover:bg-[#9E0214]/10"
              )}
              onClick={() => {
                if (collapsed) {
                  navigate('/reports');
                } else {
                  setReportsOpen(!reportsOpen);
                }
              }}
            >
              <div className="flex items-center">
                <FileText className="w-5 h-5" />
                {!collapsed && <span className="ml-3">Reports</span>}
              </div>
              {!collapsed && (
                reportsOpen ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )
              )}
            </div>
            
            {!collapsed && reportsOpen && (
              <div className="pl-9 space-y-1">
                <div
                  className={cn(
                    "flex items-center h-8 rounded-lg cursor-pointer hover:bg-[#9E0214]/5 transition-colors px-3",
                    isActive('/reports/job-orders') ? "text-[#9E0214] font-medium" : "text-gray-600"
                  )}
                  onClick={() => navigate('/reports/job-orders')}
                >
                  <span>Job Orders</span>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
