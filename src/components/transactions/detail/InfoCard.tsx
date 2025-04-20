
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InfoCardProps {
  title: string;
  children?: React.ReactNode;
}

export function InfoCard({ title, children }: InfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children ? (
          children
        ) : (
          <p className="text-muted-foreground">No information available.</p>
        )}
      </CardContent>
    </Card>
  );
}
