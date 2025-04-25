
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Patient } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useTransactionCode } from "@/hooks/useTransactionCode";

interface ImportPreviewTableProps {
  data: Patient[];
  rawData?: Record<string, string>[];
  onEdit: (index: number) => void;
}

export function ImportPreviewTable({ data, rawData, onEdit }: ImportPreviewTableProps) {
  const navigate = useNavigate();
  const { normalizeTransactionCode } = useTransactionCode();
  const csvHeaders = rawData && rawData.length > 0 ? Object.keys(rawData[0]) : [];

  return (
    <div className="space-y-4">
      {csvHeaders.length > 0 && (
        <div className="bg-muted p-3 rounded-md">
          <p className="text-sm font-medium mb-2">Original CSV columns:</p>
          <div className="flex flex-wrap gap-2">
            {csvHeaders.map(header => (
              <Badge key={header} variant="outline">{header}</Badge>
            ))}
          </div>
        </div>
      )}
      
      <div className="border rounded-md shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Sex</TableHead>
              <TableHead>Transactions</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No patient data to display
                </TableCell>
              </TableRow>
            ) : (
              data.map((patient, index) => {
                // Display transactions from patient data if available
                return (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.code}</TableCell>
                    <TableCell>{patient.firstName}</TableCell>
                    <TableCell>{patient.lastName}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.sex}</TableCell>
                    <TableCell>
                      {patient.transactions && patient.transactions.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {patient.transactions.map((transactionId, idx) => (
                            <span 
                              key={idx}
                              className="text-[#9E0214] hover:underline cursor-pointer hover:text-opacity-80"
                              onClick={() => navigate(`/patients/${patient.code}/transactions/${transactionId}`)}
                            >
                              {transactionId}{idx < patient.transactions.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No transactions</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => onEdit(index)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {data.length > 0 && rawData && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Found and mapped {data.length} patients from your CSV. If data looks incorrect,
            please check that your CSV has columns for patient ID/code, name, and age.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
