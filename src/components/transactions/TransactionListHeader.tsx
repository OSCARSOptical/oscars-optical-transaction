
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
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
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input 
        placeholder="Search by patient name, Patient ID, or Transaction ID..." 
        className="pl-9 w-[400px]" 
        value={searchQuery} 
        onChange={e => onSearchChange(e.target.value)} 
      />
    </div>
  );
}
