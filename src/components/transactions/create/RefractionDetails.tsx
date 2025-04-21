
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefractionTable } from "./RefractionTable";
import { RefractionData } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface RefractionDetailsProps {
  readOnly?: boolean;
  initialData?: {
    previousRx?: RefractionData;
    fullRx?: RefractionData;
    prescribedPower?: RefractionData;
    interpupillaryDistance?: number;
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

  // Checkbox for copy fullRx to prescribed
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

  const handleIpdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!readOnly) {
      const value = parseFloat(e.target.value);
      setIpd(isNaN(value) ? undefined : value);
    }
  };

  const ipdOptions = generateIpdDropdownOptions();

  // Effect for copy fullRx → prescribedPower when checkbox checked
  const handleCopyCheckbox = (checked: boolean) => {
    setCopyEnabled(checked);
    if (checked && fullRx) {
      setPrescribedPower({ ...fullRx });
    }
  };

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
          <select
            id="interpupillaryDistance"
            value={ipd !== undefined ? ipd.toFixed(1) : ""}
            onChange={handleIpdChange}
            className="mt-1 block w-full max-w-full rounded-md border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={readOnly}
          >
            <option value="">Select IPD</option>
            {ipdOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full flex">
            <TabsTrigger value="previous" className="flex-1">Previous Rx</TabsTrigger>
            <TabsTrigger value="full" className="flex-1">Full Rx</TabsTrigger>
            <TabsTrigger value="prescribed" className="flex-1">Prescribed Power</TabsTrigger>
          </TabsList>
          <TabsContent value="previous">
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
            <div className="flex items-center gap-2 mb-4">
              {!readOnly && (
                <>
                  <Checkbox
                    id="copy-fullrx"
                    checked={copyEnabled}
                    onCheckedChange={handleCopyCheckbox}
                  />
                  <Label htmlFor="copy-fullrx" className="text-xs text-muted-foreground mb-0">Copy from Full Rx</Label>
                </>
              )}
            </div>
            <RefractionTable
              data={prescribedPower}
              onChange={handlePrescribedPowerChange}
              showAddPower={true}
              readOnly={readOnly}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RefractionDetails;

