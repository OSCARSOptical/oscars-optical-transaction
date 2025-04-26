
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefractionTable } from "../../RefractionTable";
import { RefractionData } from "@/types";
import { CopyFromFullRxCheckbox } from "./CopyFromFullRxCheckbox";
import { PreviousRxOptions } from "./PreviousRxOptions";

interface RefractionTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  previousRx?: RefractionData;
  setPreviousRx: (data: RefractionData | undefined) => void;
  fullRx?: RefractionData;
  setFullRx: (data: RefractionData | undefined) => void;
  prescribedPower?: RefractionData;
  setPrescribedPower: (data: RefractionData | undefined) => void;
  previousRxLensType: string;
  setPreviousRxLensType: (value: string) => void;
  previousRxDate?: Date;
  setPreviousRxDate: (date: Date | undefined) => void;
  noPreviousRx: boolean;
  readOnly?: boolean;
}

export const RefractionTabs = ({ 
  activeTab,
  setActiveTab,
  previousRx,
  setPreviousRx,
  fullRx,
  setFullRx,
  prescribedPower,
  setPrescribedPower,
  previousRxLensType,
  setPreviousRxLensType,
  previousRxDate,
  setPreviousRxDate,
  noPreviousRx,
  readOnly = false
}: RefractionTabsProps) => {
  const [copyEnabled, setCopyEnabled] = useState(false);
  
  const handlePreviousRxChange = (data: RefractionData) => {
    if (!readOnly && !noPreviousRx) {
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

  const handleCopyCheckbox = (checked: boolean) => {
    setCopyEnabled(checked);
    if (checked && fullRx) {
      setPrescribedPower({ ...fullRx });
    }
  };

  // Effect to disable Previous Rx fields when noPreviousRx is checked
  useEffect(() => {
    if (noPreviousRx && activeTab === "previous") {
      // Switch to another tab if we're on previous and it gets disabled
      setActiveTab("full");
    }
  }, [noPreviousRx, activeTab, setActiveTab]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4 w-full flex">
        <TabsTrigger 
          value="previous" 
          className="flex-1"
          disabled={noPreviousRx}
        >
          Previous Rx
        </TabsTrigger>
        <TabsTrigger value="full" className="flex-1">Full Rx</TabsTrigger>
        <TabsTrigger value="prescribed" className="flex-1">Prescribed Power</TabsTrigger>
      </TabsList>
      
      <TabsContent value="previous">
        <PreviousRxOptions
          lensType={previousRxLensType}
          onLensTypeChange={setPreviousRxLensType}
          rxDate={previousRxDate}
          onRxDateChange={setPreviousRxDate}
          readOnly={readOnly}
          disabled={noPreviousRx}
        />
        <RefractionTable
          data={previousRx}
          onChange={handlePreviousRxChange}
          showAddPower={true}
          readOnly={readOnly}
          disabled={noPreviousRx}
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
          <CopyFromFullRxCheckbox
            checked={copyEnabled}
            onCheckedChange={handleCopyCheckbox}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};
