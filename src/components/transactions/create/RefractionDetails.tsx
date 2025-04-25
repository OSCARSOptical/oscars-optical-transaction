import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefractionTable } from "./RefractionTable";
import { RefractionData } from "@/types";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RefractionDetailsProps {
  readOnly?: boolean;
  initialData?: {
    previousRx?: RefractionData;
    fullRx?: RefractionData;
    prescribedPower?: RefractionData;
    interpupillaryDistance?: number;
    previousRxLensType?: string;
    previousRxDate?: string;
  };
}

function generateIpdDropdownOptions() {
  const options = [];
  for (let i = 50.0; i <= 75.0; i += 0.5) {
    options.push(i.toFixed(1));
  }
  return options;
}

const RefractionDetails = ({ readOnly = false, initialData }: RefractionDetailsProps) => {
  const [activeTab, setActiveTab] = useState("previous");
  const [previousRx, setPreviousRx] = useState<RefractionData | undefined>(
    initialData?.previousRx
  );
  const [fullRx, setFullRx] = useState<RefractionData | undefined>(
    initialData?.fullRx
  );
  const [prescribedPower, setPrescribedPower] = useState<RefractionData | undefined>(
    initialData?.prescribedPower
  );
  const [ipd, setIpd] = useState<number | undefined>(initialData?.interpupillaryDistance);
  
  const [previousRxLensType, setPreviousRxLensType] = useState<string>(
    initialData?.previousRxLensType || ""
  );
  const [previousRxDate, setPreviousRxDate] = useState<Date | undefined>(
    initialData?.previousRxDate ? new Date(initialData.previousRxDate) : undefined
  );

  const [copyEnabled, setCopyEnabled] = useState(false);

  const handlePreviousRxChange = (data: RefractionData) => {
    if (!readOnly) {
      setPreviousRx(data);
    }
  };

  const handleFullRxChange = (data: RefractionData) => {
    if (!readOnly) {
      setFullRx(data);
    }
  };

  const handlePrescribedPowerChange = (data: RefractionData) => {
    if (!readOnly) {
      setPrescribedPower(data);
    }
  };

  const handleIpdChange = (value: string) => {
    if (!readOnly) {
      const parsedValue = parseFloat(value);
      setIpd(isNaN(parsedValue) ? undefined : parsedValue);
    }
  };

  const ipdOptions = generateIpdDropdownOptions();

  const handleCopyCheckbox = (checked: boolean) => {
    setCopyEnabled(checked);
    if (checked && fullRx) {
      setPrescribedPower({ ...fullRx });
    }
  };

  const formattedPreviousRxDate = previousRxDate ? format(previousRxDate, "yyyy-MM-dd") : "";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Refraction Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 w-full">
          <Label htmlFor="interpupillaryDistance" className="text-xs text-muted-foreground">
            Interpupillary Distance (mm)
          </Label>
          <Select
            value={ipd !== undefined ? ipd.toFixed(1) : ""}
            onValueChange={handleIpdChange}
            disabled={readOnly}
          >
            <SelectTrigger
              id="interpupillaryDistance"
              className="mt-1"
            >
              <SelectValue placeholder="Select IPD" />
            </SelectTrigger>
            <SelectContent>
              {ipdOptions.map(opt => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full flex">
            <TabsTrigger value="previous" className="flex-1">Previous Rx</TabsTrigger>
            <TabsTrigger value="full" className="flex-1">Full Rx</TabsTrigger>
            <TabsTrigger value="prescribed" className="flex-1">Prescribed Power</TabsTrigger>
          </TabsList>
          <TabsContent value="previous">
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="previousRxLensType" className="text-xs text-muted-foreground">
                  Lens Type
                </Label>
                <Select
                  value={previousRxLensType}
                  onValueChange={setPreviousRxLensType}
                  disabled={readOnly}
                >
                  <SelectTrigger id="previousRxLensType" className="mt-1">
                    <SelectValue placeholder="Select Lens Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single Vision">Single Vision</SelectItem>
                    <SelectItem value="Bifocal">Bifocal</SelectItem>
                    <SelectItem value="Progressive">Progressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="previousRxDate" className="text-xs text-muted-foreground">
                  Date Prescribed
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="previousRxDate"
                    type="text"
                    value={formattedPreviousRxDate}
                    readOnly
                    className="w-full pr-10"
                  />
                  {!readOnly && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="absolute right-0 top-0 h-full px-3 hover:text-muted-foreground"
                        >
                          <CalendarIcon className="h-4 w-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={previousRxDate}
                          onSelect={(date) => date && setPreviousRxDate(date)}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            </div>
            <RefractionTable
              data={previousRx}
              onChange={handlePreviousRxChange}
              showAddPower={true}
              readOnly={readOnly}
            />
          </TabsContent>
          <TabsContent value="full">
            <RefractionTable
              data={fullRx}
              onChange={handleFullRxChange}
              showAddPower={true}
              readOnly={readOnly}
            />
          </TabsContent>
          <TabsContent value="prescribed">
            <RefractionTable
              data={prescribedPower}
              onChange={handlePrescribedPowerChange}
              showAddPower={true}
              readOnly={readOnly}
            />
            {!readOnly && (
              <div className="flex items-center gap-2 mt-4 px-4">
                <Checkbox
                  id="copy-fullrx"
                  checked={copyEnabled}
                  onCheckedChange={handleCopyCheckbox}
                />
                <Label htmlFor="copy-fullrx" className="text-xs text-muted-foreground mb-0">Copy from Full Rx</Label>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RefractionDetails;
