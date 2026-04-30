import { Button, HelperText, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import type {
  UseFormRegister,
  FieldErrors,
  ValidationRule,
  RegisterOptions,
} from "react-hook-form";
import { HiEye, HiEyeOff } from "react-icons/hi";

type InputShowPasswordProps = {
  name: string;
  label?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  validation?: RegisterOptions;
  error?: string;
};

export const InputShowPassword = ({
  name,
  label,
  placeholder,
  register,
  errors,
  validation,
  error,
  ...rest
}: InputShowPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const errorMsg =
    error ||
    (typeof errors?.[name]?.message === "string"
      ? errors[name].message
      : undefined);
  return (
    <div className="w-full">
      <div className="mb-1 block">
        <Label>{label}</Label>
      </div>
      <div className="relative">
        <TextInput
          type={showPassword ? "text" : "password"}
          color={errorMsg ? "failure" : "gray"}
          {...register(name, validation)}
          placeholder={placeholder}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          tabIndex={-1}
          aria-label={
            showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
          }
        >
          {showPassword ? (
            <HiEyeOff className="w-5 h-5" />
          ) : (
            <HiEye className="w-5 h-5" />
          )}
        </button>
      </div>
      {errorMsg && (
        <HelperText className="text-red-500 dark:text-red-400">
          {errorMsg}
        </HelperText>
      )}
    </div>
  );
};
