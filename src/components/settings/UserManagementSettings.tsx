
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UserManagementSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground p-2">
          <p>This is where user accounts, role-based permissions, and password/security settings will appear.</p>
          <p className="mt-2 italic text-sm">Coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
