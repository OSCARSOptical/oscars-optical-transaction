
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefractionTable } from "../../RefractionTable";
import { RefractionData } from "@/types";
import { CopyFromFullRxCheckbox } from "./CopyFromFullRxCheckbox";
import { PreviousRxOptions } from "./PreviousRxOptions";
import { NoPreviousRxCheckbox } from "./NoPreviousRxCheckbox";

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
  setNoPreviousRx: (checked: boolean) => void;
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
  setNoPreviousRx,
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

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="mb-4 w-full flex">
        <TabsTrigger value="previous">Previous Rx</TabsTrigger>
        <TabsTrigger value="full">Full Rx</TabsTrigger>
        <TabsTrigger value="prescribed">Prescribed Power</TabsTrigger>
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
        <div className="flex items-center gap-2 mt-4 px-4">
          <NoPreviousRxCheckbox
            checked={noPreviousRx}
            onCheckedChange={setNoPreviousRx}
            readOnly={readOnly}
          />
        </div>
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
