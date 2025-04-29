
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SaveTransactionButtonProps {
  isLoading: boolean;
  onSave: () => void;
}

const SaveTransactionButton = ({ isLoading, onSave }: SaveTransactionButtonProps) => {
  return (
    <div className="flex justify-end">
      <Button 
        onClick={onSave} 
        className="w-full md:w-auto"
        disabled={isLoading}
      >
        <Save className="mr-2" />
        {isLoading ? 'Saving...' : 'Save Transaction'}
      </Button>
    </div>
  );
};

export default SaveTransactionButton;
