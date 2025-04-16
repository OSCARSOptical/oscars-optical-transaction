
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  CreditCard, 
  BarChart4, 
  Settings,
  FilePlus,
  PieChart
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

const navItems = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Patients",
    icon: Users,
    href: "/patients",
  },
  {
    title: "Transactions",
    icon: CreditCard,
    href: "/transactions",
  },
  {
    title: "Balance Sheet",
    icon: BarChart4,
    href: "/balance-sheet",
  },
  {
    title: "Reports",
    icon: PieChart,
    href: "/reports",
  },
  {
    title: "New Entry",
    icon: FilePlus,
    href: "/new-entry",
  },
];

export function Sidebar({ isOpen }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-white transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center justify-center border-b px-4">
        <h2 className="text-lg font-bold text-crimson-700">Crimson Ledger</h2>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className={cn(
                "flex h-10 items-center justify-start px-4 py-2",
                location.pathname === item.href 
                  ? "bg-crimson-50 text-crimson-700 font-medium" 
                  : "text-gray-600 hover:bg-crimson-50 hover:text-crimson-700"
              )}
              onClick={() => navigate(item.href)}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.title}
            </Button>
          ))}
        </nav>
        <Separator className="my-4" />
        <nav className="grid gap-1 px-2">
          <Button
            variant="ghost"
            className="flex h-10 items-center justify-start px-4 py-2 text-gray-600 hover:bg-crimson-50 hover:text-crimson-700"
            onClick={() => navigate('/settings')}
          >
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>
        </nav>
      </ScrollArea>
    </div>
  );
}

export default Sidebar;
