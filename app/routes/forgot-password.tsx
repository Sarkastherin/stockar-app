import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Button, Card, Spinner } from "flowbite-react";
import { Logo } from "~/components/Logo";
import type { Route } from "./+types/home";
import { Link, useNavigate } from "react-router";
import { Input } from "~/components/forms/InputsForm";
import { useAuth } from "~/context/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Forgot Password - StockAR" },
    { name: "description", content: "Reset your password in StockAR" },
  ];
}

export default function ForgotPassword() {
  const { user, loading, forgotPassword } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

  const onSubmit = async (data: { email: string }) => {
    const { email } = data;
    setSubmitError(null);
    try {
      const result = await forgotPassword(email);
      if (result.token) {
        navigate("/reset-password", { state: { token: result.token } });
      } else {
        setSubmitError("No se pudo generar el token.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
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
        <h2  className="text-xl text-center font-bold text-indigo-600 dark:text-indigo-400">Recuperar contraseña</h2>
        <form
          className="flex max-w-md flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Input
            label="Tu correo electrónico"
            {...register("email", {
              required: "El correo es requerido",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Correo inválido",
              },
            })}
            error={errors.email?.message}
          />

          <Button className="mt-2" color="indigo" type="submit">
            Resetear contraseña
          </Button>
          {submitError && (
            <p className="text-sm text-red-600 dark:text-red-400">
              {submitError}
            </p>
          )}
        </form>
        {/* Footer */}
        <div className="mt-6 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            ¿No tienes cuenta?{" "}
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
              Comunícate con el administrador
            </span>
          </p>
        </div>
      </Card>
    </div>
  );
}
