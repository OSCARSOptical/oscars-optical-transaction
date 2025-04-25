
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Gift, Tag } from "lucide-react";
import { Patient } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useTransactionCode } from "@/hooks/useTransactionCode";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

interface ImportPreviewTableProps {
  data: Patient[];
  rawData?: Record<string, string>[];
  onEdit: (index: number) => void;
  selectedRows: Set<number>;
  onSelectRow: (index: number, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  duplicates: Set<number>;
  transactionGroups?: Record<string, number[]>;
  promotionalItems?: Set<number>;
  viewMode?: 'patient' | 'transaction';
  onTogglePromotional?: (index: number) => void;
}

export function ImportPreviewTable({ 
  data, 
  rawData, 
  onEdit, 
  selectedRows,
  onSelectRow,
  onSelectAll,
  duplicates,
  transactionGroups = {},
  promotionalItems = new Set(),
  viewMode = 'patient',
  onTogglePromotional
}: ImportPreviewTableProps) {
  const navigate = useNavigate();
  const { normalizeTransactionCode } = useTransactionCode();
  const csvHeaders = rawData && rawData.length > 0 ? Object.keys(rawData[0]) : [];
  
  // Function to check if a row is part of a transaction group
  const getTransactionGroupInfo = (index: number) => {
    for (const [txId, indices] of Object.entries(transactionGroups)) {
      if (indices.includes(index)) {
        return {
          inGroup: true,
          isFirst: indices[0] === index,
          groupSize: indices.length,
          transactionId: txId,
          groupIndices: indices
        };
      }
    }
    return { inGroup: false };
  };

  // Logic to organize rows based on view mode
  const organizedData = viewMode === 'transaction' 
    ? Object.entries(transactionGroups)
        .sort(([txIdA], [txIdB]) => txIdA.localeCompare(txIdB))
        .flatMap(([txId, indices]) => indices.map(idx => ({ index: idx, groupId: txId })))
        .concat(
          // Include rows without transaction groups at the end
          data.map((_, idx) => ({ index: idx }))
            .filter(({ index }) => !Object.values(transactionGroups)
              .some(groupIndices => groupIndices.includes(index)))
        )
    : data.map((_, idx) => ({ index: idx }));

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
              <TableHead className="w-12">
                <Checkbox 
                  checked={data.length > 0 && selectedRows.size === data.length}
                  onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                />
              </TableHead>
              <TableHead>Patient ID</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Sex</TableHead>
              <TableHead>Transactions</TableHead>
              {viewMode === 'transaction' && (
                <TableHead>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>Promotional</TooltipTrigger>
                      <TooltipContent>
                        <p>Mark as promotional item (Buy One Take One)</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
              )}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={viewMode === 'transaction' ? 9 : 8} className="text-center py-6 text-muted-foreground">
                  No patient data to display
                </TableCell>
              </TableRow>
            ) : (
              organizedData.map(({ index, groupId }) => {
                const patient = data[index];
                const isDuplicate = duplicates.has(index);
                const isPromoItem = promotionalItems.has(index);
                const groupInfo = getTransactionGroupInfo(index);
                
                // Get background color based on status
                let rowClass = "";
                if (isDuplicate) rowClass = "bg-orange-50";
                if (isPromoItem) rowClass = "bg-green-50";
                if (groupInfo.inGroup && !groupInfo.isFirst && viewMode === 'transaction') {
                  // Add a subtle indicator for grouped items when not first in group
                  rowClass = "bg-blue-50 border-l-4 border-blue-300";
                }
                
                return (
                  <TableRow 
                    key={`${patient.id}-${index}`}
                    className={rowClass}
                  >
                    <TableCell>
                      <Checkbox 
                        checked={selectedRows.has(index)}
                        onCheckedChange={(checked) => onSelectRow(index, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {patient.code}
                        {isDuplicate && (
                          <Badge variant="outline" className="bg-orange-100 text-orange-700">
                            Duplicate
                          </Badge>
                        )}
                        {isPromoItem && (
                          <Badge className="bg-green-100 text-green-700 flex items-center gap-1">
                            <Gift className="h-3 w-3" />
                            Promo
                          </Badge>
                        )}
                        {groupInfo.inGroup && groupInfo.isFirst && (
                          <Badge variant="outline" className="bg-blue-100 text-blue-700 flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {`Group (${groupInfo.groupSize})`}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
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
                              className={`hover:underline cursor-pointer hover:text-opacity-80 ${
                                groupId === transactionId ? 'text-blue-600 font-medium' : 'text-[#9E0214]'
                              }`}
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
                    
                    {viewMode === 'transaction' && (
                      <TableCell>
                        {groupInfo.inGroup && !groupInfo.isFirst && onTogglePromotional && (
                          <Switch 
                            checked={isPromoItem}
                            onCheckedChange={() => onTogglePromotional(index)}
                          />
                        )}
                      </TableCell>
                    )}
                    
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => onEdit(index)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {data.length > 0 && rawData && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Found and mapped {data.length} patients from your CSV. 
            {Object.keys(transactionGroups).length > 0 && (
              <>
                <br />
                Detected {Object.keys(transactionGroups).length} transaction groups that may contain promotional items.
                Toggle to Transaction View to manage promotional items.
              </>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
