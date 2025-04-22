
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArrowUpZA, ArrowDownAZ, Filter } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      <TooltipProvider>
        <ToggleGroup type="single" value={sortOrder} onValueChange={(value) => value && onSortChange(value as 'asc' | 'desc')}>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="asc" aria-label="Sort ascending">
                <ArrowUpZA className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sort from oldest to latest</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem value="desc" aria-label="Sort descending">
                <ArrowDownAZ className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sort from latest to oldest</p>
            </TooltipContent>
          </Tooltip>
        </ToggleGroup>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <ToggleGroup type="single" value={showUnclaimed ? "unclaimed" : "all"} onValueChange={(value) => onUnclaimedToggle(value === "unclaimed")}>
              <ToggleGroupItem value="unclaimed" aria-label="Show unclaimed only">
                <Filter className="h-4 w-4 mr-2" />
                Unclaimed
              </ToggleGroupItem>
            </ToggleGroup>
          </TooltipTrigger>
          <TooltipContent>
            <p>Show only unclaimed transactions</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
