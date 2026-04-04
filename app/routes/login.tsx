import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Label,
  Checkbox,
  Spinner,
  TextInput,
  HelperText,
} from "flowbite-react";
import { Logo } from "~/components/Logo";
import type { Route } from "./+types/home";
import { Link, useNavigate } from "react-router";
import { Input } from "~/components/forms/InputsForm";
import { useAuth } from "~/context/AuthContext";
import { HiEye, HiEyeOff } from "react-icons/hi";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - StockAR" },
    { name: "description", content: "Inicia sesión en StockAR" },
  ];
}

interface LoginFormInputs {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function Login() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (!loading && user) {
      navigate("/", { replace: true });
    }
  }, [loading, user, navigate]);

  const onSubmit = async (data: LoginFormInputs) => {
    const { email, password } = data;
    setSubmitError(null);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (error) {
      setSubmitError("No se pudo iniciar sesión. Verifica tus credenciales.");
      console.error("Login error:", error);
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
        <div className="flex flex-col items-center mb-8">
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
        <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
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
          <div className="w-full">
            <div className="mb-1 block">
              <Label>Tu contraseña</Label>
            </div>
            <div className="relative">
              <TextInput
                type={showPassword ? "text" : "password"}
                color={errors.password ? "failure" : "gray"}
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                tabIndex={-1}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <HelperText className="text-red-500 dark:text-red-400">
                {errors.password.message}
              </HelperText>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember">Recuérdame</Label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button color="indigo" type="submit">
            Iniciar sesión
          </Button>
          {submitError && (
            <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
          )}
        </form>
        {/* Footer */}
        <div className="mt-6 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            ¿No tienes cuenta?{" "}
            <Link
              to="#"
              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
