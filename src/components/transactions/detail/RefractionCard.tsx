
import { Transaction, RefractionData } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RefractionCardProps {
  transaction: Transaction;
}

export function RefractionCard({ transaction }: RefractionCardProps) {
  // Helper function to display a refraction data table
  const renderRefractionTable = (data?: RefractionData) => {
    if (!data) return <p className="text-muted-foreground">No refraction data available.</p>;
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Eye</TableHead>
            <TableHead>Sphere</TableHead>
            <TableHead>Cylinder</TableHead>
            <TableHead>Axis</TableHead>
            <TableHead>Visual Acuity</TableHead>
            <TableHead>Add Power</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">OD (Right)</TableCell>
            <TableCell>{data.OD.sphere === 0 ? "Plano" : data.OD.sphere}</TableCell>
            <TableCell>{data.OD.cylinder}</TableCell>
            <TableCell>{data.OD.axis}</TableCell>
            <TableCell>{data.OD.visualAcuity}</TableCell>
            <TableCell>—</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">OS (Left)</TableCell>
            <TableCell>{data.OS.sphere === 0 ? "Plano" : data.OS.sphere}</TableCell>
            <TableCell>{data.OS.cylinder}</TableCell>
            <TableCell>{data.OS.axis}</TableCell>
            <TableCell>{data.OS.visualAcuity}</TableCell>
            <TableCell>—</TableCell>
          </TableRow>
          {data.ADD && (
            <TableRow>
              <TableCell className="font-medium">ADD</TableCell>
              <TableCell>{data.ADD.sphere === 0 ? "Plano" : data.ADD.sphere || "—"}</TableCell>
              <TableCell>{data.ADD.cylinder || "—"}</TableCell>
              <TableCell>{data.ADD.axis || "—"}</TableCell>
              <TableCell>{data.ADD.visualAcuity || "—"}</TableCell>
              <TableCell>{data.ADD.addPower || "—"}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  return (
    <Tabs defaultValue="prescribed">
      <TabsList className="mb-4">
        <TabsTrigger value="prescribed">Prescribed Power</TabsTrigger>
        <TabsTrigger value="full">Full Rx</TabsTrigger>
        <TabsTrigger value="previous">Previous Rx</TabsTrigger>
      </TabsList>
      <TabsContent value="prescribed">
        {renderRefractionTable(transaction.prescribedPower)}
      </TabsContent>
      <TabsContent value="full">
        {renderRefractionTable(transaction.fullRx)}
      </TabsContent>
      <TabsContent value="previous">
        {renderRefractionTable(transaction.previousRx)}
      </TabsContent>
    </Tabs>
  );
}
