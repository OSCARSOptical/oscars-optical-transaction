
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLocation } from "react-router-dom";

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  const location = useLocation();
  
  // Hide FAB on balance sheet page
  if (location.pathname === '/balance-sheet') {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-[#9E0214] hover:bg-[#7c0110]"
          aria-label="Add New Transaction"
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
