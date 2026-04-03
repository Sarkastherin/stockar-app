import { Navigate } from "react-router";
import { useAuth } from "~/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}
export default function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {

  const { user, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }
  if (!user.active) {
    return <Navigate to="/inactive" replace />;
  }
  if (user.force_password_change) {
    return <Navigate to="/change-password" replace />;
  }

  return <>{children}</>;
}
