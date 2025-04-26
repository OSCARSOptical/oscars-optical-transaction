
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefractionData } from "@/types";
import { InterPupillaryDistance } from "./components/refraction/InterPupillaryDistance";
import { NoPreviousRxCheckbox } from "./components/refraction/NoPreviousRxCheckbox";
import { RefractionTabs } from "./components/refraction/RefractionTabs";

interface RefractionDetailsProps {
  readOnly?: boolean;
  initialData?: {
    previousRx?: RefractionData;
    fullRx?: RefractionData;
    prescribedPower?: RefractionData;
    interpupillaryDistance?: number;
    previousRxLensType?: string;
    previousRxDate?: string;
    noPreviousRx?: boolean;
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
  
  // State for previous Rx lens type and date
  const [previousRxLensType, setPreviousRxLensType] = useState<string>(
    initialData?.previousRxLensType || ""
  );
  const [previousRxDate, setPreviousRxDate] = useState<Date | undefined>(
    initialData?.previousRxDate ? new Date(initialData.previousRxDate) : undefined
  );
  
  // State for No Previous Rx checkbox
  const [noPreviousRx, setNoPreviousRx] = useState<boolean>(
    initialData?.noPreviousRx || false
  );

  const handleIpdChange = (value: string) => {
    if (!readOnly) {
      const parsedValue = parseFloat(value);
      setIpd(isNaN(parsedValue) ? undefined : parsedValue);
    }
  };

  const handleNoPreviousRxChange = (checked: boolean) => {
    if (!readOnly) {
      setNoPreviousRx(checked);
      if (checked) {
        // Clear previous Rx data when checkbox is checked
        setPreviousRx(undefined);
        setPreviousRxLensType("");
        setPreviousRxDate(undefined);
      }
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Refraction Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <InterPupillaryDistance
            ipd={ipd}
            onIpdChange={handleIpdChange}
            readOnly={readOnly}
          />
        </div>
        
        <div className="mb-4">
          <NoPreviousRxCheckbox
            checked={noPreviousRx}
            onCheckedChange={handleNoPreviousRxChange}
            readOnly={readOnly}
          />
        </div>
        
        <RefractionTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          previousRx={previousRx}
          setPreviousRx={setPreviousRx}
          fullRx={fullRx}
          setFullRx={setFullRx}
          prescribedPower={prescribedPower}
          setPrescribedPower={setPrescribedPower}
          previousRxLensType={previousRxLensType}
          setPreviousRxLensType={setPreviousRxLensType}
          previousRxDate={previousRxDate}
          setPreviousRxDate={setPreviousRxDate}
          noPreviousRx={noPreviousRx}
          readOnly={readOnly}
        />
      </CardContent>
    </Card>
  );
};

export default RefractionDetails;
