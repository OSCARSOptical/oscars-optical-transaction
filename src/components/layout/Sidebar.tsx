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
  PieChart,
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Primary navigation items
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
    title: "Settings",
    icon: Settings,
    href: "/settings", // make sure this routes to /settings
  }
];

export function Sidebar({ isOpen }: { isOpen: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();

  const NavButton = ({ item }: { item: { title: string; icon: any; href: string } }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "relative flex h-10 w-full items-center justify-start px-4 py-2",
              isActive 
                ? "bg-[#f8e4e6] text-black font-medium before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#9E0214] before:content-['']" 
                : "text-gray-600 hover:bg-crimson-50 hover:text-crimson-700"
            )}
            onClick={() => navigate(item.href)}
          >
            <item.icon className="mr-2 h-5 w-5" />
            {item.title}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10} className="z-50">
          {item.title}
        </TooltipContent>
      </Tooltip>
    );
  };

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
            <NavButton key={index} item={item} />
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}

export default Sidebar;
