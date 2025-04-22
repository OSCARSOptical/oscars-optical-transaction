
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
  PieChart,
  Settings as SettingsIcon,
  User as UserIcon,
  Users as UsersIcon,
  SlidersHorizontal,
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

// Top-level navigation items except Settings
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
  }
];

// Settings sub-pages
const settingsSubItems = [
  {
    title: "Profile",
    icon: UserIcon,
    href: "/settings/profile",
  },
  {
    title: "User Management",
    icon: UsersIcon,
    href: "/settings/users",
  },
  {
    title: "Appearance",
    icon: SlidersHorizontal,
    href: "/settings/appearance",
  }
];

export function Sidebar({ isOpen }: { isOpen: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(() => location.pathname.startsWith("/settings"));

  // Expand settings submenu if on any /settings/* route
  // Syncs open state on route changes
  if (!settingsOpen && location.pathname.startsWith("/settings")) {
    setSettingsOpen(true);
  }

  const NavButton = ({ item, activeOverride }: { item: { title: string; icon: any; href: string }, activeOverride?: boolean }) => {
    const isActive = typeof activeOverride === "boolean" ? activeOverride : location.pathname === item.href;
    
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
          {/* Settings section with sub-items */}
          <div>
            <button
              type="button"
              className={cn(
                "flex w-full items-center h-10 px-4 py-2 mt-1 rounded-md cursor-pointer transition",
                location.pathname.startsWith("/settings")
                  ? "bg-[#f8e4e6] text-black font-medium"
                  : "text-gray-600 hover:bg-crimson-50 hover:text-crimson-700"
              )}
              onClick={() => setSettingsOpen((v) => !v)}
            >
              <SettingsIcon className="mr-2 h-5 w-5" />
              Settings
              <span className={cn(
                "ml-auto transition-transform transform",
                settingsOpen ? "rotate-90" : "rotate-0"
              )}>
                {/* Simple arrow (right/chevron) */}
                <svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path d="M4.75 3.5 7.25 6l-2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </button>
            {settingsOpen && (
              <div className="ml-7 flex flex-col gap-1 mt-1">
                {settingsSubItems.map((sub) => (
                  <NavButton
                    key={sub.href}
                    item={sub}
                    activeOverride={location.pathname === sub.href}
                  />
                ))}
              </div>
            )}
          </div>
        </nav>
      </ScrollArea>
    </div>
  );
}

export default Sidebar;

