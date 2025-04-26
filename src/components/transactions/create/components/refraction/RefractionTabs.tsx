
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
      <TabsList className="mb-4 w-full grid grid-cols-3">
        <TabsTrigger value="previous" className="flex-1">Previous Rx</TabsTrigger>
        <TabsTrigger value="full" className="flex-1">Full Rx</TabsTrigger>
        <TabsTrigger value="prescribed" className="flex-1">Prescribed Power</TabsTrigger>
      </TabsList>
      
      <TabsContent value="previous">
        <div className="space-y-4">
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
          <div className="mt-4 flex justify-end">
            <NoPreviousRxCheckbox
              checked={noPreviousRx}
              onCheckedChange={setNoPreviousRx}
              readOnly={readOnly}
            />
          </div>
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
          <div className="mt-4 flex justify-end">
            <CopyFromFullRxCheckbox
              checked={copyEnabled}
              onCheckedChange={handleCopyCheckbox}
            />
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
