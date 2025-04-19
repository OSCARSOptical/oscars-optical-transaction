
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";

const PatientTrends = () => {
  const patientData = [
    { name: "Jan", patients: 130, newPatients: 20 },
    { name: "Feb", patients: 135, newPatients: 15 },
    { name: "Mar", patients: 142, newPatients: 12 },
    { name: "Apr", patients: 148, newPatients: 18 },
    { name: "May", patients: 152, newPatients: 11 },
    { name: "Jun", patients: 156, newPatients: 9 },
  ];

  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle>Patient Trends</CardTitle>
        <CardDescription>Total patients and new patient acquisitions</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <BarChart
          data={patientData}
          categories={["patients", "newPatients"]}
          index="name"
          colors={["#dc2626", "#0ea5e9"]}
          valueFormatter={(value: number) => `${value}`}
          yAxisWidth={48}
          height={350}
        />
      </CardContent>
    </Card>
  );
};

export default PatientTrends;
