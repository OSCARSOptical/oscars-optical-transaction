
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/chart";

// Import the shared patients data
const samplePatients = [
  {
    id: '12345',
    firstName: 'John',
    lastName: 'Doe',
    age: 35,
    email: 'john@example.com',
    phone: '555-123-4567',
    address: '123 Main St, City, State',
    code: 'PX-JD-0000001'
  }, 
  {
    id: '67890',
    firstName: 'Jane',
    lastName: 'Smith',
    age: 28,
    email: 'jane@example.com',
    phone: '555-987-6543',
    address: '456 Oak St, City, State',
    code: 'PX-JS-0000001'
  },
  {
    id: '54321',
    firstName: 'Oscar',
    lastName: 'Santos',
    age: 40,
    email: 'oscar@example.com',
    phone: '555-555-1111',
    address: '789 Pine St, City, State',
    code: 'PX-OS-0000001'
  }
];

const PatientTrends = () => {
  // Use actual patient count from the collection
  const totalPatients = samplePatients.length;
  
  // Create monthly patient data based on real patient count
  const patientData = [
    { name: "Jan", patients: totalPatients - 3 },
    { name: "Feb", patients: totalPatients - 2 },
    { name: "Mar", patients: totalPatients - 1 },
    { name: "Apr", patients: totalPatients },
    { name: "May", patients: 0 },
    { name: "Jun", patients: 0 }
  ];

  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle>Patients</CardTitle>
        <CardDescription>Total patients per month</CardDescription>
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
