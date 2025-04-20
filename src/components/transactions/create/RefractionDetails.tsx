
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RefractionTable } from "./RefractionTable";

const RefractionDetails = () => {
  const [activeTab, setActiveTab] = useState("previous");

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Refraction Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="interpupillaryDistance">Interpupillary Distance</Label>
          <Select defaultValue="62.0">
            <SelectTrigger id="interpupillaryDistance">
              <SelectValue placeholder="Select IPD" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 51 }, (_, i) => (50 + i * 0.5).toFixed(1)).map(value => (
                <SelectItem key={value} value={value}>{value} mm</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="previous" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="previous">Previous Rx</TabsTrigger>
            <TabsTrigger value="full">Full Rx</TabsTrigger>
            <TabsTrigger value="prescribed">Prescribed Power</TabsTrigger>
          </TabsList>
          <TabsContent value="previous" className="mt-4">
            <RefractionTable />
          </TabsContent>
          <TabsContent value="full" className="mt-4">
            <RefractionTable />
          </TabsContent>
          <TabsContent value="prescribed" className="mt-4">
            <RefractionTable />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RefractionDetails;

