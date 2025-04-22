
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface TransactionListHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function TransactionListHeader({
  searchQuery,
  onSearchChange
}: TransactionListHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-end items-center">
      <Button 
        onClick={() => navigate('/transactions/new')}
        className="bg-[#9E0214] hover:bg-[#9E0214]/90"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Transaction
      </Button>
    </div>
  );
}
