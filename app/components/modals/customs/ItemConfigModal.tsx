import type { ProductoConDetalles } from "~/types/productos";
import { Input, Select } from "~/components/forms/InputsForm";
import { InfoField } from "~/components/forms/InfoField";
import { Spinner } from "flowbite-react";
import { useFormState, type UseFormReturn } from "react-hook-form";
import { useDataContext } from "~/context/DataContext";
import { useEffect, useState } from "react";
import type { FieldsForm } from "~/hooks/useItemsConfig";

export function ItemConfigModal({
  props,
}: {
  props: {
    title: string;
    form: UseFormReturn<any>;
    fieldsForm: FieldsForm[];
  };
}) {
  /* const [loading, setLoading] = useState(true);
  const {
    subcategorias,
    categorias,
    familias,
    unidades,
    getSubcategorias,
    getCategorias,
    getFamilias,
    getUnidades,
  } = useDataContext();
  const loadData = () => {
    if (!subcategorias) getSubcategorias();
    if (!categorias) getCategorias();
    if (!familias) getFamilias();
    if (!unidades) getUnidades();
  };
  useEffect(() => {
    loadData();
    setLoading(false);
  }, []); */
  /* const { register, control, watch, setValue } = props.form;
  const { errors } = useFormState({ control });
  const familiaId = watch("family.id") || "";
  const categoriaId = watch("category.id") || ""; */

  /* const changeFamily = (id_family: string) => {
    const selectedFamily = familias?.find((fam) => fam.id === id_family);
    setValue("family.id", id_family, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("family", selectedFamily as any, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("category.id", "", { shouldDirty: true, shouldValidate: true });
    setValue("category", undefined as any, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("id_subcategory", "", { shouldDirty: true, shouldValidate: true });
  };

  const changeCategory = (id_category: string) => {
    const selectedCategory = categorias?.find((cat) => cat.id === id_category);
    setValue("category.id", id_category, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("category", selectedCategory as any, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("id_subcategory", "", { shouldDirty: true, shouldValidate: true });
  }; */
  /*  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner aria-label="Cargando productos..." />
      </div>
    );
  } */

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
              {...props.form.register(field.key,{required: field.required, onChange: (e) => field.onChange?.(e.target.value)})}
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
              {...props.form.register(field.key,{required: field.required, onChange: (e) => field.onChange?.(e.target.value)})}
              error={props.form.formState.errors[field.key]?.message as string}
            />
          );
        }
           }
      )}
      {/* Sección de información de solo lectura */}
       {(props.form.watch("created_at") || props.form.watch("updated_at")) && (
        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Información del registro
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <InfoField
              label="Fecha de creación"
              value={
                props.form.watch("created_at")
                  ? new Date(props.form.watch("created_at")).toLocaleString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )
                  : undefined
              }
            />
            <InfoField
              label="Última actualización"
              value={
                props.form.watch("updated_at")
                  ? new Date(props.form.watch("updated_at")).toLocaleString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )
                  : undefined
              }
            />
            <InfoField label="Estado" value={props.form.watch("active")} />
          </div>
        </div>
      )}
    </div>
  );
}
