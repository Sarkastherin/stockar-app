import { Input, Select } from "~/components/forms/InputsForm";
import { type UseFormReturn } from "react-hook-form";
import type { FieldsForm } from "~/hooks/useItemsConfig";
import InfoFormCommons from "~/components/forms/InfoFormCommons";
import { Button } from "flowbite-react";

export function ItemConfigModal({
  props,
}: {
  props: {
    title: string;
    form: UseFormReturn<any>;
    fieldsForm: FieldsForm[];
    onDelete?: () => void;
    onReactivate?: () => void;
  };
}) {
  return (
    <div className="space-y-4">
      {props.fieldsForm.map((field) => {
        if (field.type === "text") {
          return (
            <Input
              key={field.key}
              label={field.label
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
              {...props.form.register(field.key, {
                required: field.required,
                onChange: (e) => field.onChange?.(e.target.value),
              })}
              error={props.form.formState.errors[field.key]?.message as string}
            />
          );
        } else if (field.type === "select" && field.options) {
          return (
            <Select
              key={field.key}
              label={field.label
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
              options={field.options}
              {...props.form.register(field.key, {
                required: field.required,
                onChange: (e) => field.onChange?.(e.target.value),
              })}
              error={props.form.formState.errors[field.key]?.message as string}
            />
          );
        }
      })}
      {/* Sección de información de solo lectura */}
      {(props.form.watch("created_at") || props.form.watch("updated_at")) && (
        <InfoFormCommons
          createdAt={props.form.watch("created_at")}
          updatedAt={props.form.watch("updated_at")}
          active={props.form.watch("active")}
          createdBy={props.form.watch("creator")}
          updatedBy={props.form.watch("updater")}
        />
      )}
      {/* Botón de dar de baja/reactivar */}
      {props.onDelete && props.form.watch("created_at") && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            color={props.form.watch("active") ? "red" : "green"}
            onClick={props.form.watch("active") ? props.onDelete : props.onReactivate}
            fullSized
          >
            {props.form.watch("active") ? "Dar de baja producto" : "Reactivar producto"}
          </Button>
        </div>
      )}
    </div>
  );
}
