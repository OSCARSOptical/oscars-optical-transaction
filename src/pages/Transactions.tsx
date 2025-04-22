
import TransactionList from '@/components/transactions/TransactionList';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from 'react';

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">Transactions</h2>
        <p className="text-muted-foreground">Manage your financial records</p>
      </div>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search by patient name, Patient ID, or Transaction ID..." 
          className="pl-9 w-full" 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
        />
      </div>
      <TransactionList initialSearchQuery={searchQuery} />
    </div>
  );
};

export default Transactions;
