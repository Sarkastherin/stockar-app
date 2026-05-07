import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Label,
  Checkbox,
  Spinner,
} from "flowbite-react";
import { Logo } from "~/components/Logo";
import type { Route } from "./+types/home";
import { Link, useNavigate } from "react-router";
import { Input } from "~/components/forms/InputsForm";
import { useAuth } from "~/context/AuthContext";
import { InputShowPassword } from "~/components/forms/InputShowPassword";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Register - StockAR" },
    { name: "description", content: "Crea una cuenta en StockAR" },
  ];
}

export interface RegisterFormInputs {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function Register() {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: RegisterFormInputs) => {
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
          <InputShowPassword
            name="password"
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            register={register}
            errors={errors}
            validation={{
              required: "La contraseña es obligatoria",
              minLength: { value: 8, message: "Mínimo 8 caracteres" },
            }}
          />
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
            <p className="text-sm text-red-600 dark:text-red-400">
              {submitError}
            </p>
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
