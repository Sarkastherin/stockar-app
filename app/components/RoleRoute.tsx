import { Navigate, Outlet } from "react-router";
import { useAuth } from "~/context/AuthContext";
import type { UsuarioDB } from "~/types/usuarios";

interface RoleRouteProps {
  allowedRoles: UsuarioDB["role"][];
  redirectTo?: string;
}

export default function RoleRoute({
  allowedRoles,
  redirectTo = "/",
}: RoleRouteProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
