import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
            {renderRefractionTable()}
          </TabsContent>
          <TabsContent value="full" className="mt-4">
            {renderRefractionTable()}
          </TabsContent>
          <TabsContent value="prescribed" className="mt-4">
            {renderRefractionTable()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const renderRefractionTable = () => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Rx</TableHead>
        <TableHead>Sphere</TableHead>
        <TableHead>Cylinder</TableHead>
        <TableHead>Axis</TableHead>
        <TableHead>Visual Acuity</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>OD</TableCell>
        <TableCell>
          <Select defaultValue="0.00">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sphere" />
            </SelectTrigger>
            <SelectContent>
              {sphereOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Cylinder" />
            </SelectTrigger>
            <SelectContent>
              {cylinderOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Axis" />
            </SelectTrigger>
            <SelectContent>
              {axisOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="VA" />
            </SelectTrigger>
            <SelectContent>
              {visualAcuityOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>OS</TableCell>
        <TableCell>
          <Select defaultValue="0.00">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sphere" />
            </SelectTrigger>
            <SelectContent>
              {sphereOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Cylinder" />
            </SelectTrigger>
            <SelectContent>
              {cylinderOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Axis" />
            </SelectTrigger>
            <SelectContent>
              {axisOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="VA" />
            </SelectTrigger>
            <SelectContent>
              {visualAcuityOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>ADD</TableCell>
        <TableCell>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="ADD" />
            </SelectTrigger>
            <SelectContent>
              {addOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
      </TableRow>
    </TableBody>
  </Table>
);

const sphereOptions = Array.from({ length: 601 }, (_, i) => {
  const value = (i / 4 - 20).toFixed(2);
  return { value, label: value === "0.00" ? "Plano" : value };
});

const cylinderOptions = Array.from({ length: 24 }, (_, i) => {
  const value = (-(i + 1) * 0.25).toFixed(2);
  return { value, label: value };
});

const axisOptions = Array.from({ length: 180 }, (_, i) => {
  const value = (i + 1).toString();
  return { value, label: value };
});

const addOptions = Array.from({ length: 9 }, (_, i) => {
  const value = ((i + 4) * 0.25).toFixed(2);
  return { value, label: value };
});

const visualAcuityOptions = [
  "20/200", "20/100", "20/70", "20/50", "20/40", "20/30", "20/25", "20/20",
  "CF", "LP", "NLP"
].map(value => ({ value, label: value }));

export default RefractionDetails;
