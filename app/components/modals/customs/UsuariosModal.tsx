import { type UsuarioDB, optionsRoles } from "~/types/usuarios";
import { Input, Select } from "~/components/forms/InputsForm";
import { Button } from "flowbite-react";
import { useFormState, type UseFormReturn } from "react-hook-form";
import { useState } from "react";
import InfoFormCommons from "~/components/forms/InfoFormCommons";

export function UsuariosModal({
  props,
}: {
  props: {
    title: string;
    form: UseFormReturn<UsuarioDB>;
    onDelete?: () => void;
    onReactivate?: () => void;
  };
}) {
  const { register, control, watch, setValue } = props.form;
  const { errors } = useFormState({ control });
  const createdAt = watch("created_at");
  const updatedAt = watch("updated_at");
  const createdBy = watch("creator");
  const updatedBy = watch("updater");
  const active = watch("active");
  // Estado para mostrar campos de cambio de contraseña en edición
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Input
          {...register("name", {
            required: "El nombre del usuario es obligatorio",
          })}
          label="Nombre"
          error={errors.name?.message}
        />
        <Input
          {...register("last_name", {
            required: "El apellido del usuario es obligatorio",
          })}
          label="Apellido"
          error={errors.last_name?.message}
        />
        <Select
          {...register("role", {
            required: "El rol del usuario es obligatorio",
          })}
          label="Rol"
          error={errors.role?.message}
          options={optionsRoles.map((option) => ({
            value: option.value,
            label: option.label,
          }))}
          disabledEmptyOption={true}
        />
        <Input
          {...register("email", {
            required: "El email del usuario es obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "El email no es válido",
            },
          })}
          type="email"
          label="Email"
          error={errors.email?.message}
        />

        {/* Contraseña y Confirmar contraseña */}
        {/* Si no existe createdAt, es creación: muestra los campos */}
        {!createdAt && (
          <>
            <Input
              {...register("password", {
                required: "La contraseña del usuario es obligatoria",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres",
                },
              })}
              type="password"
              label="Contraseña"
              error={errors.password?.message}
            />
            <Input
              {...register("confirm_password", {
                required: "La confirmación de contraseña es obligatoria",
                validate: (value) =>
                  value === watch("password") || "Las contraseñas no coinciden",
              })}
              type="password"
              label="Confirmar contraseña"
              error={errors.confirm_password?.message}
            />
          </>
        )}

        {createdAt && showPasswordFields && (
          <>
            <Input
              {...register("password", {
                required: "La nueva contraseña es obligatoria",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
              type="password"
              label="Nueva contraseña"
              error={errors.password?.message}
            />
            <Input
              {...register("confirm_password", {
                required: "La confirmación de contraseña es obligatoria",
                validate: (value) =>
                  value === watch("password") || "Las contraseñas no coinciden",
              })}
              type="password"
              label="Confirmar nueva contraseña"
              error={errors.confirm_password?.message}
            />
          </>
        )}
      </div>

      {/* Sección de información de solo lectura */}
      {(createdAt || updatedAt) && (
        <InfoFormCommons
          createdAt={createdAt}
          updatedAt={updatedAt}
          active={active}
          createdBy={createdBy}
          updatedBy={updatedBy}
        />
      )}

      {/* Botón de dar de baja/reactivar */}
      {props.onDelete && createdAt && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex gap-4">
          {createdAt && !showPasswordFields && (
            <Button
              color="gray"
              type="button"
              onClick={() => {
                setValue("force_password_change", true, { shouldDirty: true });
                setShowPasswordFields(true);
              }}
              className="w-full"
              outline={true}
            >
              Cambiar contraseña
            </Button>
          )}
          <Button
            color={active ? "red" : "green"}
            onClick={active ? props.onDelete : props.onReactivate}
            fullSized
            outline={true}
          >
            {active ? "Dar de baja usuario" : "Reactivar usuario"}
          </Button>
        </div>
      )}
    </div>
  );
}
