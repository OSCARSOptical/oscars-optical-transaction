
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";
import { parseISO, format, isSameYear, getMonth } from 'date-fns';
import { Patient } from "@/types";
import { usePatientFirstTransaction } from "@/hooks/usePatientFirstTransaction";

interface PatientTrendsProps {
  patients: Patient[];
}

const PatientTrends = ({ patients }: PatientTrendsProps) => {
  // Get current year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Get the earliest transaction date for each patient
  const patientFirstDates = usePatientFirstTransaction();

  // Map of month index => patient count
  const monthsMap: { [k: number]: number } = {};

  // Filter and count patients based on their first transaction date
  patients.forEach(patient => {
    // Get first transaction date for this patient
    const firstDate = patientFirstDates[patient.code];
    
    // Skip patients without transaction history
    if (!firstDate) return;
    
    const firstTransactionDate = parseISO(firstDate);
    if (isSameYear(firstTransactionDate, currentDate)) {
      const month = getMonth(firstTransactionDate);
      monthsMap[month] = (monthsMap[month] || 0) + 1;
    }
  });

  // Prepare data for BarChart
  const patientData = Array.from({ length: 12 }, (_, m) => ({
    name: format(new Date(currentYear, m), 'MMM'),
    patients: monthsMap[m] || 0
  }));

  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle>Patients</CardTitle>
        <CardDescription>New patients per month ({currentYear})</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <BarChart
          data={patientData}
          categories={["patients"]}
          index="name"
          colors={["#9E0214"]}
          valueFormatter={(value: number) => `${value}`}
          yAxisWidth={48}
          height={350}
          className="[&_.recharts-tooltip]:!bg-[#FFC42B] [&_.recharts-tooltip]:!border-[#FFC42B]"
        />
      </CardContent>
    </Card>
  );
};

export default PatientTrends;
