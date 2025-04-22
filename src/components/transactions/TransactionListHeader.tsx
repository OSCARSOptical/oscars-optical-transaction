
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Filter, SortAsc, SortDesc } from "lucide-react";

interface TransactionListHeaderProps {
  sortOrder: 'asc' | 'desc';
  onSortChange: (order: 'asc' | 'desc') => void;
  showUnclaimed: boolean;
  onUnclaimedToggle: (show: boolean) => void;
}

export function TransactionListHeader({
  sortOrder,
  onSortChange,
  showUnclaimed,
  onUnclaimedToggle
}: TransactionListHeaderProps) {
  return (
    <div className="flex gap-2 items-center">
      <ToggleGroup type="single" value={sortOrder} onValueChange={(value) => value && onSortChange(value as 'asc' | 'desc')}>
        <ToggleGroupItem value="asc" aria-label="Sort ascending">
          <SortAsc className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="desc" aria-label="Sort descending">
          <SortDesc className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>

      <ToggleGroup type="single" value={showUnclaimed ? "unclaimed" : "all"} onValueChange={(value) => onUnclaimedToggle(value === "unclaimed")}>
        <ToggleGroupItem value="unclaimed" aria-label="Show unclaimed only">
          <Filter className="h-4 w-4 mr-2" />
          Unclaimed
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
