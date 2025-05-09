
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import ReportCard from '@/components/reports/ReportCard';

const Reports = () => {
  const [transactionCount, setTransactionCount] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard 
          title="Job Orders"
          count={transactionCount.toString()}
          subtitle="All recorded job orders"
          icon={FileText}
          onClick={() => navigate('/reports/job-orders')}
        />
      </div>
    </div>
  );
};

export default Reports;
