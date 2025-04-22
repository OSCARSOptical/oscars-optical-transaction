
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/formatters';

export interface AdditionalItem {
  description: string;
  amount: number;
}

interface AdditionalItemsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (items: AdditionalItem[]) => void;
  transactionTotal: number;
}

const AdditionalItemsDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  transactionTotal 
}: AdditionalItemsDialogProps) => {
  const [items, setItems] = useState<AdditionalItem[]>([
    { description: '', amount: 0 }
  ]);

  const handleAddItem = () => {
    setItems([...items, { description: '', amount: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof AdditionalItem, value: string) => {
    const newItems = [...items];
    if (field === 'amount') {
      newItems[index][field] = Number(value) || 0;
    } else {
      newItems[index][field] = value;
    }
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.amount, transactionTotal);
  };

  const handleConfirm = () => {
    const validItems = items.filter(item => item.description && item.amount > 0);
    onConfirm(validItems);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Additional Items</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 font-semibold">
            <div className="col-span-2">Description</div>
            <div>Amount</div>
          </div>

          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 items-center">
              <Input
                className="col-span-2"
                placeholder="Item description"
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="0"
                  value={item.amount || ''}
                  onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                />
                {index > 0 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveItem(index)}
                    className="flex-shrink-0"
                  >
                    ×
                  </Button>
                )}
              </div>
            </div>
          ))}

          <Button variant="outline" onClick={handleAddItem} className="w-full">
            Add Item
          </Button>

          <div className="flex justify-between pt-4 border-t">
            <div className="font-semibold">Transaction Total:</div>
            <div>{formatCurrency(transactionTotal)}</div>
          </div>

          {items.map((item, index) => (
            item.amount > 0 && (
              <div key={`total-${index}`} className="flex justify-between">
                <div>{item.description || 'Untitled Item'}:</div>
                <div>{formatCurrency(item.amount)}</div>
              </div>
            )
          ))}

          <div className="flex justify-between font-bold">
            <div>Grand Total:</div>
            <div>{formatCurrency(calculateTotal())}</div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>Proceed to Print</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdditionalItemsDialog;
