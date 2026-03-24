import { Navigate } from "react-router";
import { useAuth } from "~/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}
/**
 * ProtectedRoute: muestra un spinner mientras se valida (loading),
 * redirige a login si no hay usuario, o renderiza children si está autenticado.
 */
export default function ProtectedRoute({
  children,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    // Puedes reemplazar por tu spinner / skeleton component
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
