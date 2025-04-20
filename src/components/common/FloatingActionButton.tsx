
import { useLocation } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  const location = useLocation();
  const path = location.pathname;
  
  // Only show the FAB on Patients and Transactions pages
  const showFAB = path === '/patients' || 
                 path.startsWith('/patients/') || 
                 path === '/transactions' || 
                 path.startsWith('/transactions/');
  
  if (!showFAB) return null;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-[#9E0214] hover:bg-[#7c0110]"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add New Transaction</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default FloatingActionButton;
