
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface TransactionListHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function TransactionListHeader({ searchQuery, onSearchChange }: TransactionListHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search transactions..."
          className="pl-9 w-[250px]"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button 
        onClick={() => navigate('/transactions/new')}
        className="bg-crimson-600 hover:bg-crimson-700"
      >
        <Plus className="mr-1 h-4 w-4" />
        Add Transaction
      </Button>
    </div>
  );
}
