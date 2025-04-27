
import { Transaction } from "@/types";
import DateSelector from "../DateSelector";
import TransactionTypeSelector from "../TransactionTypeSelector";

interface TransactionFieldsProps {
  transactionType: string;
  transactionDate: Date;
  onTypeChange: (type: Transaction['type']) => void;
  onDateChange: (date: Date) => void;
  readOnly?: boolean;
}

const TransactionFields = ({
  transactionType,
  transactionDate,
  onTypeChange,
  onDateChange,
  readOnly = false
}: TransactionFieldsProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="w-full md:w-1/2">
        <DateSelector 
          date={transactionDate} 
          onDateChange={onDateChange} 
          readOnly={readOnly} 
          label="Transaction Date"
        />
      </div>
      <div className="w-full md:w-1/2">
        <TransactionTypeSelector 
          transactionType={transactionType} 
          onTypeChange={onTypeChange} 
          readOnly={readOnly} 
        />
      </div>
    </div>
  );
};

export default TransactionFields;
