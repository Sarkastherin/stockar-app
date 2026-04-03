import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button, Card, Spinner } from "flowbite-react";
import { Logo } from "~/components/Logo";
import type { Route } from "./+types/home";
import { useNavigate } from "react-router";
import { Input } from "~/components/forms/InputsForm";
import { useAuth } from "~/context/AuthContext";
import { useDataContext } from "~/context/DataContext";
import { useLocation } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reset Password - StockAR" },
    { name: "description", content: "Reset your password in StockAR" },
  ];
}

export default function ResetPassword() {
  const { user, loading, changePassword } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string; confirm_password: string }>({
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login", { replace: true });
    }
    if (!loading && user && !user.force_password_change) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

  const onSubmit = async (data: {
    password: string;
    confirm_password: string;
  }) => {
    const { password } = data;
    setSubmitError(null);
    try {
      const result = await changePassword(user.id, password);
      console.log("Change password result:", result);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Reset password error:", error);
      setSubmitError("Error de red o servidor");
    }
  };

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
      <Card className="w-full max-w-md shadow-lg">
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
        <h2 className="text-xl text-center font-bold text-indigo-600 dark:text-indigo-400">
          Cambiar contraseña
        </h2>
        <form
          className="flex max-w-md flex-col gap-4 pb-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Nueva contraseña"
            type="password"
            {...register("password", {
              required: "La contraseña es requerida",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
            })}
            error={errors.password?.message}
          />
          <Input
            label="Confirmar nueva contraseña"
            type="password"
            {...register("confirm_password", {
              required: "La confirmación de la contraseña es requerida",
              validate: (value) =>
                value === watch("password") || "Las contraseñas no coinciden",
            })}
            error={errors.confirm_password?.message}
          />

          <Button className="mt-2" color="indigo" type="submit">
            Cambiar contraseña
          </Button>
          {submitError && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {submitError}
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}
