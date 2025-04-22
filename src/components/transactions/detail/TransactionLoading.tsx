
import React from 'react';

export const TransactionLoading: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading transaction details...</p>
      </div>
    </div>
  );
};
