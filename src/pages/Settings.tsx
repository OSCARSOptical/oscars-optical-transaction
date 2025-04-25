
import { Outlet, useLocation, Navigate } from "react-router-dom";

export default function Settings() {
  const location = useLocation();
  
  // Redirect to profile settings if no sub-route is specified
  if (location.pathname === '/settings') {
    return <Navigate to="/settings/profile" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Outlet />
    </div>
  );
}
