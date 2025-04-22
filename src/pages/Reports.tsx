
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

const Reports = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Reports</h2>
          <p className="text-muted-foreground">View and manage your reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-md transition-all"
          onClick={() => navigate('/reports/job-orders')}
        >
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Job Orders</CardTitle>
            <FileText className="h-5 w-5 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">All Records</div>
            <p className="text-xs text-muted-foreground">
              All recorded job orders
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
