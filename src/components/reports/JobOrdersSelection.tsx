
import { useState } from "react";
import { Transaction } from "@/types";

interface JobOrdersSelectionProps {
  transactions: Transaction[];
  onSelectionChange: (selectedRows: string[], selectAll: boolean) => void;
  initialSelectedRows?: string[];
  initialSelectAll?: boolean;
}

const JobOrdersSelection = ({
  transactions,
  onSelectionChange,
  initialSelectedRows = [],
  initialSelectAll = false
}: JobOrdersSelectionProps) => {
  const [selectedRows, setSelectedRows] = useState<string[]>(initialSelectedRows);
  const [selectAll, setSelectAll] = useState(initialSelectAll);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(transactions.map(tx => tx.id));
    }
    const nextSelectAll = !selectAll;
    setSelectAll(nextSelectAll);
    onSelectionChange(nextSelectAll ? transactions.map(tx => tx.id) : [], nextSelectAll);
  };

  const handleSelectRow = (id: string) => {
    let nextRows: string[];
    let nextSelectAll = false;
    if (selectedRows.includes(id)) {
      nextRows = selectedRows.filter(rowId => rowId !== id);
      nextSelectAll = false;
    } else {
      nextRows = [...selectedRows, id];
      if (nextRows.length === transactions.length) nextSelectAll = true;
    }
    setSelectedRows(nextRows);
    setSelectAll(nextSelectAll);
    onSelectionChange(nextRows, nextSelectAll);
  };

  return null; // This is only a logic provider, does not render anything.
};

export default JobOrdersSelection;
