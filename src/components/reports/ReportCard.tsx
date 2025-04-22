
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportCardProps {
  title: string;
  count: string;
  subtitle: string;
  icon: LucideIcon;
  onClick: () => void;
}

const ReportCard = ({ title, count, subtitle, icon: Icon, onClick }: ReportCardProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all group border border-gray-100"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-gray-500 group-hover:text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{count}</div>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
};

export default ReportCard;
