
import { useState, useEffect, useMemo } from "react";
import { Transaction } from "@/types";
import { supabase } from "@/integrations/supabase/client";

export function useFilteredTransactions(searchQuery = "", showUnclaimed = false) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showUnclaimedState, setShowUnclaimedState] = useState(showUnclaimed);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setShowUnclaimedState(showUnclaimed);
  }, [showUnclaimed]);

  // Fetch transactions from Supabase
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('transactions')
          .select('*, patients!inner(first_name, last_name, patient_code, contact_number)');
          
        if (error) {
          console.error('Error fetching transactions:', error);
          return;
        }
        
        console.log('Fetched transactions from Supabase:', data);
        
        // Transform the data to match the Transaction type
        const formattedTransactions: Transaction[] = data.map(tx => ({
          id: tx.id,
          code: tx.transaction_code || '',
          patientCode: tx.patients?.patient_code || '',
          patientName: `${tx.patients?.first_name || ''} ${tx.patients?.last_name || ''}`,
          firstName: tx.patients?.first_name || '',
          lastName: tx.patients?.last_name || '',
          date: tx.transaction_date || new Date().toISOString().split('T')[0],
          type: tx.transaction_type as Transaction['type'],
          grossAmount: tx.gross_amount || 0,
          deposit: tx.deposit || 0,
          balance: tx.balance || 0,
          lensCapital: tx.lens_capital || 0,
          edgingPrice: tx.edging_price || 0,
          otherExpenses: tx.other_expenses || 0,
          totalExpenses: tx.total_expenses || 0,
          claimed: tx.claimed || false,
          dateClaimed: tx.claimed_on || null,
          phone: tx.patients?.contact_number || ''
        }));
        
        setTransactions(formattedTransactions);
      } catch (err) {
        console.error('Error in fetchTransactions:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        const matchesSearch = (
          transaction.patientName.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
          transaction.patientCode.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
          transaction.code.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
          transaction.firstName.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
          transaction.lastName.toLowerCase().includes(localSearchQuery.toLowerCase())
        );

        if (showUnclaimedState) {
          return matchesSearch && !transaction.claimed;
        }
        
        return matchesSearch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [transactions, localSearchQuery, sortOrder, showUnclaimedState]);

  return {
    transactions,
    setTransactions,
    localSearchQuery,
    setLocalSearchQuery,
    sortOrder,
    setSortOrder,
    showUnclaimedState,
    setShowUnclaimedState,
    filteredTransactions,
    loading
  }
}
