import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";
import { parseISO, format, startOfYear, endOfYear, isSameYear, getMonth } from 'date-fns';
import { samplePatients } from '@/data';

const PatientTrends = () => {
  // Get current year
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  
  // Get start and end of current year
  const yearStart = startOfYear(currentDate);
  const yearEnd = endOfYear(currentDate);
  
  // Create a map of months to patient counts
  const monthsWithData = new Map();
  
  // Filter patients created this year and count by month
  samplePatients.forEach(patient => {
    const createdDate = parseISO(patient.createdDate);
    
    if (isSameYear(createdDate, currentDate)) {
      const month = getMonth(createdDate);
      monthsWithData.set(month, (monthsWithData.get(month) || 0) + 1);
    }
  });
  
  // Create chart data from the map (only including months with data)
  const patientData = Array.from(monthsWithData, ([month, count]) => ({
    name: format(new Date(currentYear, month, 1), 'MMM'),
    patients: count
  })).sort((a, b) => {
    // Sort by month (Jan, Feb, Mar, etc.)
    const monthA = new Date(currentYear, "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(a.name) / 3, 1);
    const monthB = new Date(currentYear, "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(b.name) / 3, 1);
    return monthA.getTime() - monthB.getTime();
  });

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
          colors={["#9E0214"]} // Brand deep-red
          valueFormatter={(value: number) => `${value}`} 
          yAxisWidth={48} 
          height={350}
          className="[&_.recharts-tooltip]:!bg-[#FFC42B] [&_.recharts-tooltip]:!border-[#FFC42B]" // Gold hover state
        />
      </CardContent>
    </Card>
  );
};

export default PatientTrends;
