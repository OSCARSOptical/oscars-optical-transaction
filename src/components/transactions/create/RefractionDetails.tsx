
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const RefractionDetails = () => {
  const [activeTab, setActiveTab] = useState("previous");

  // Generate sphere options (-20.00 to +10.00)
  const sphereOptions = Array.from({ length: 601 }, (_, i) => {
    const value = (i / 4 - 20).toFixed(2);
    return { value, label: value === "0.00" ? "Plano" : value };
  });

  // Generate cylinder options (-0.25 to -6.00)
  const cylinderOptions = Array.from({ length: 24 }, (_, i) => {
    const value = (-(i + 1) * 0.25).toFixed(2);
    return { value, label: value };
  });

  // Generate axis options (1 to 180)
  const axisOptions = Array.from({ length: 180 }, (_, i) => {
    const value = (i + 1).toString();
    return { value, label: value };
  });

  // Generate ADD options (+1.00 to +3.00)
  const addOptions = Array.from({ length: 9 }, (_, i) => {
    const value = ((i + 4) * 0.25).toFixed(2);
    return { value, label: value };
  });

  // Generate visual acuity options
  const visualAcuityOptions = [
    "20/200", "20/100", "20/70", "20/50", "20/40", "20/30", "20/25", "20/20",
    "CF", "LP", "NLP"
  ].map(value => ({ value, label: value }));

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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Refraction Details</CardTitle>
      </CardHeader>
      <CardContent>
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

export default RefractionDetails;
