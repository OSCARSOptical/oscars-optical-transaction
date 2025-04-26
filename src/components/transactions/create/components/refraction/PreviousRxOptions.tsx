
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PreviousRxOptionsProps {
  lensType: string;
  onLensTypeChange: (value: string) => void;
  rxDate: Date | undefined;
  onRxDateChange: (date: Date | undefined) => void;
  readOnly?: boolean;
  disabled?: boolean;
}

export const PreviousRxOptions = ({ 
  lensType, 
  onLensTypeChange, 
  rxDate, 
  onRxDateChange, 
  readOnly = false,
  disabled = false 
}: PreviousRxOptionsProps) => {
  return (
    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="previousRxLensType" className="text-xs text-muted-foreground">
          Lens Type
        </Label>
        <Select
          value={lensType}
          onValueChange={onLensTypeChange}
          disabled={readOnly || disabled}
        >
          <SelectTrigger id="previousRxLensType" className="mt-1">
            <SelectValue placeholder="Select Lens Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Single Vision">Single vision</SelectItem>
            <SelectItem value="Bifocal">Bifocal</SelectItem>
            <SelectItem value="Progressive">Progressive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="previousRxDate" className="text-xs text-muted-foreground">
          Date Prescribed
        </Label>
        {readOnly || disabled ? (
          <Input
            id="previousRxDate"
            type="text"
            value={rxDate ? format(rxDate, "yyyy-MM-dd") : ""}
            readOnly
            className="mt-1"
            disabled={disabled}
          />
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative mt-1">
                <Input
                  id="previousRxDate"
                  type="text"
                  value={rxDate ? format(rxDate, "yyyy-MM-dd") : ""}
                  readOnly
                  className="w-full pr-10 cursor-pointer"
                  disabled={disabled}
                />
                <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={rxDate}
                onSelect={onRxDateChange}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};
