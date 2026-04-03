import { useEffect } from "react";
import { Card, Spinner } from "flowbite-react";
import { Logo } from "~/components/Logo";
import type { Route } from "./+types/home";
import { useNavigate } from "react-router";
import { useAuth } from "~/context/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Inactive Account - StockAR" },
    { name: "description", content: "Your account is inactive in StockAR" },
  ];
}

export default function Inactive() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && user.active) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors px-4 sm:px-6 md:px-8">
        <Card className="w-full max-w-md shadow-lg">
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <Spinner size="xl" color="purple" aria-label="Cargando sesión" />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Verificando sesión...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors px-4 sm:px-6 md:px-8">
      <Card className="w-full max-w-md shadow-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900">
        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <div className="mb-4">
            <Logo className="h-16 sm:h-20 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center">
            Stock
            <span className="text-indigo-600 dark:text-indigo-400">AR</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mt-2 text-sm sm:text-base">
            Gestión de inventario inteligente
          </p>
        </div>
        {/* Form */}
        <h2 className="text-xl text-center font-bold text-red-600 dark:text-red-400">
          Cuenta inactiva
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mt-2 text-sm sm:text-base">
          Tu cuenta está inactiva. Por favor, contacta al administrador para
          reactivarla.
        </p>
      </Card>
    </div>
  );
}
