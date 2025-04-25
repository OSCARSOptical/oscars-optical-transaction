
import TransactionList from '@/components/transactions/TransactionList';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from "react-router-dom";

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUnclaimed, setShowUnclaimed] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // If ?unclaimed=1 in URL, set showUnclaimed to true
    if (searchParams.get("unclaimed") === "1") {
      setShowUnclaimed(true);
    } else {
      setShowUnclaimed(false);
    }
  }, [location.search, searchParams]);

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
      </div>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search by Patient Name, Patient ID, or Transaction ID" 
          className="pl-9 w-full" 
          value={searchQuery} 
          onChange={e => handleSearch(e.target.value)} 
        />
      </div>
      <TransactionList searchQuery={searchQuery} showUnclaimed={showUnclaimed} />
    </div>
  );
};

export default Transactions;
