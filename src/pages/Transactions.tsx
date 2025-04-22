
import TransactionList from '@/components/transactions/TransactionList';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Transactions</h2>
          <p className="text-muted-foreground">Manage your financial records</p>
        </div>
        <Button 
          onClick={() => navigate('/transactions/new')}
          className="bg-[#9E0214] hover:bg-[#9E0214]/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Transaction
        </Button>
      </div>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search by patient name, Patient ID, or Transaction ID..." 
          className="pl-9 w-full" 
          value={searchQuery} 
          onChange={e => handleSearch(e.target.value)} 
        />
      </div>
      <TransactionList searchQuery={searchQuery} />
    </div>
  );
};

export default Transactions;
