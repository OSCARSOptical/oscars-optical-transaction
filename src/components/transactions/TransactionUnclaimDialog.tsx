
import { UnclaimConfirmDialog } from './UnclaimConfirmDialog';

interface TransactionUnclaimDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function TransactionUnclaimDialog({
  open,
  onOpenChange,
  onConfirm,
}: TransactionUnclaimDialogProps) {
  return (
    <UnclaimConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
    />
  );
}
