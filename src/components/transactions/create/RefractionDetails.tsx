
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RefractionTable from "./RefractionTable";
import { RefractionData } from "@/types";

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
  const [activeTab, setActiveTab] = useState("prescribed");
  const [previousRx, setPreviousRx] = useState<RefractionData | undefined>(
    initialData?.previousRx
  );
  const [fullRx, setFullRx] = useState<RefractionData | undefined>(
    initialData?.fullRx
  );
  const [prescribedPower, setPrescribedPower] = useState<RefractionData | undefined>(
    initialData?.prescribedPower
  );
  const [ipd, setIPD] = useState<number | undefined>(
    initialData?.interpupillaryDistance
  );

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

  const handleIPDChange = (value: number) => {
    if (!readOnly) {
      setIPD(value);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Refraction Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="prescribed">Prescribed Power</TabsTrigger>
            <TabsTrigger value="full">Full Rx</TabsTrigger>
            <TabsTrigger value="previous">Previous Rx</TabsTrigger>
          </TabsList>
          <TabsContent value="prescribed">
            <RefractionTable
              data={prescribedPower}
              onChange={handlePrescribedPowerChange}
              showAddPower={true}
              readOnly={readOnly}
            />
          </TabsContent>
          <TabsContent value="full">
            <RefractionTable
              data={fullRx}
              onChange={handleFullRxChange}
              readOnly={readOnly}
            />
          </TabsContent>
          <TabsContent value="previous">
            <RefractionTable
              data={previousRx}
              onChange={handlePreviousRxChange}
              readOnly={readOnly}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RefractionDetails;
