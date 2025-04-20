
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface EmptyStateProps {
  month: string;
  year: string;
}

export function EmptyState({ month, year }: EmptyStateProps) {
  return (
    <Card className="shadow-sm border border-gray-100">
      <CardContent className="flex flex-col items-center justify-center p-12">
        <Calendar className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-xl font-medium text-gray-500 mb-2">No Transactions</h3>
        <p className="text-muted-foreground text-center">
          There are no transactions recorded for {month} {year}.
        </p>
      </CardContent>
    </Card>
  );
}
