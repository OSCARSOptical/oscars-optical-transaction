
import { useReactToPrint } from "react-to-print";
import { Transaction } from "@/types";
import { AdditionalItem } from "@/components/reports/AdditionalItemsDialog";

interface UseJobOrdersPrintParams {
  printRef: React.RefObject<HTMLDivElement>;
  printedTransactions: string[];
  setPrintedTransactions: (ids: string[]) => void;
  selectedRows: string[];
  setAdditionalItems: (items: AdditionalItem[]) => void;
}

export function useJobOrdersPrint({
  printRef,
  printedTransactions,
  setPrintedTransactions,
  selectedRows,
  setAdditionalItems
}: UseJobOrdersPrintParams) {
  return useReactToPrint({
    documentTitle: "Job Orders Report",
    onBeforePrint: () => {
      console.log("Preparing to print...");
      return Promise.resolve();
    },
    onAfterPrint: () => {
      console.log("Print completed or canceled");
      const newPrintedTransactions = [...printedTransactions, ...selectedRows];
      setPrintedTransactions(newPrintedTransactions);
      localStorage.setItem('printedTransactions', JSON.stringify(newPrintedTransactions));
      setAdditionalItems([]);
      return Promise.resolve();
    },
    contentRef: printRef,
    pageStyle: `
      @page {
        size: landscape;
        margin: 10mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        table { page-break-inside: auto; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        tr:nth-child(25n) { page-break-after: always; }
        thead { display: table-header-group; }
      }
    `,
  });
}
