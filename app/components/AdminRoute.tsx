import { Navigate, Outlet } from "react-router";
import { useAuth } from "~/context/AuthContext";

export default function AdminRoute() {
  const { user } = useAuth();

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
