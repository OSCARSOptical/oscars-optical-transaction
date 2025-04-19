
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
}

const MetricCard = ({
  title,
  value,
  description,
  icon: Icon,
  iconColor,
}: MetricCardProps) => {
  return (
    <Card className="shadow-sm border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
