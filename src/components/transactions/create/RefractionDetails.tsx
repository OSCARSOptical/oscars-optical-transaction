
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefractionTable } from "./RefractionTable";
import { RefractionData } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RefractionDetailsProps {
  readOnly?: boolean;
  initialData?: {
    previousRx?: RefractionData;
    fullRx?: RefractionData;
    prescribedPower?: RefractionData;
    interpupillaryDistance?: number;
  };
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

  const handleIpdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!readOnly) {
      const value = Number(e.target.value);
      setIpd(isNaN(value) ? undefined : value);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Refraction Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label htmlFor="interpupillaryDistance" className="text-xs text-muted-foreground">
            Interpupillary Distance (mm)
          </Label>
          <Input
            id="interpupillaryDistance"
            type="number"
            value={ipd !== undefined ? ipd : ""}
            onChange={handleIpdChange}
            className="mt-1 max-w-xs"
            placeholder="Enter IPD value"
            readOnly={readOnly}
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="previous">Previous Rx</TabsTrigger>
            <TabsTrigger value="full">Full Rx</TabsTrigger>
            <TabsTrigger value="prescribed">Prescribed Power</TabsTrigger>
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
