
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AppearanceSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground p-2">
          <p>Customize theme colors, logo and branding here.</p>
          <p className="mt-2 italic text-sm">Coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
