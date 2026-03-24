import { type UsuarioDB, optionsRoles } from "~/types/usuarios";
import { Input, Select } from "~/components/forms/InputsForm";
import { Spinner, Button } from "flowbite-react";
import { useFormState, type UseFormReturn } from "react-hook-form";
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
  const name = watch("name") || "";
  const lastName = watch("last_name") || "";
  const email = watch("email") || "";
  const role = watch("role") || "";
  const createdAt = watch("created_at");
  const updatedAt = watch("updated_at");
  const createdBy = watch("creator");
  const updatedBy = watch("updater");
  const active = watch("active");

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
      /></div>
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
      />

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
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            color={active ? "red" : "green"}
            onClick={active ? props.onDelete : props.onReactivate}
            fullSized
          >
            {active ? "Dar de baja usuario" : "Reactivar usuario"}
          </Button>
        </div>
      )}
    </div>
  );
}
