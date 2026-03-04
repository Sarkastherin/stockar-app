import type { ProductoConDetalles } from "~/types/productos";
import { Input, Select } from "~/components/forms/InputsForm";
import { InfoField } from "~/components/forms/InfoField";
import { Spinner } from "flowbite-react";
import { useFormState, type UseFormReturn } from "react-hook-form";
import { useDataContext } from "~/context/DataContext";
import { useEffect, useState } from "react";

export function ProductosModal({
  props,
}: {
  props: {
    data?: ProductoConDetalles;
    title: string;
    form: UseFormReturn<ProductoConDetalles>;
  };
}) {
  const [loading, setLoading] = useState(true);
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
  }, []);
  const { register, control, watch, setValue } = props.form;
  const { errors } = useFormState({ control });
  const familiaId = watch("family.id") || "";
  const categoriaId = watch("category.id") || "";

  const changeFamily = (id_family: string) => {
    const selectedFamily = familias?.find((fam) => fam.id === id_family);
    setValue("family.id", id_family, { shouldDirty: true, shouldValidate: true });
    setValue("family", selectedFamily as any, { shouldDirty: true, shouldValidate: true });
    setValue("category.id", "", { shouldDirty: true, shouldValidate: true });
    setValue("category", undefined as any, { shouldDirty: true, shouldValidate: true });
    setValue("id_subcategory", "", { shouldDirty: true, shouldValidate: true });
  };

  const changeCategory = (id_category: string) => {
    const selectedCategory = categorias?.find((cat) => cat.id === id_category);
    setValue("category.id", id_category, { shouldDirty: true, shouldValidate: true });
    setValue("category", selectedCategory as any, { shouldDirty: true, shouldValidate: true });
    setValue("id_subcategory", "", { shouldDirty: true, shouldValidate: true });
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner aria-label="Cargando productos..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Input
        {...register("name", {
          required: "El nombre del producto es obligatorio",
        })}
        label="Nombre del producto"
        error={errors.name?.message}
      />
      <Select
        label="Familia"
        options={
          familias?.map((fam) => ({
            value: fam.id,
            label: fam.name,
          })) || []
        }
        required
        {...register("family.id", {
          required: "La familia es obligatoria",
          onChange: (e) => {
            const id_family = e.target.value;
            changeFamily(id_family);
          },
        })}
        value={familiaId}
        error={errors.family?.id?.message}
      />

      <Select
        label="Categoria"
        disabled={!familiaId}
        options={
          categorias
            ?.filter((cat) => cat.id_family === familiaId)
            ?.map((cat) => ({
              value: cat.id,
              label: cat.name,
            })) || []
        }
        {...register("category.id", {
          required: "La categoria es obligatoria",
          onChange: (e) => {
            const id_category = e.target.value;
            changeCategory(id_category);
          },
        })}
        value={categoriaId}
        error={errors.category?.id?.message}
      />
      <Select
        disabled={!categoriaId}
        label="Subcategoria"
        emptyOption={`Seleccione una subcategoria${!categoriaId ? " (Seleccione una categoria primero)" : ""}`}
        options={
          subcategorias
            ?.filter((sub) => sub.id_categoria === categoriaId)
            ?.map((sub) => ({
              value: sub.id,
              label: sub.name,
            })) || []
        }
        {...register("id_subcategory", {required: "La subcategoria es obligatoria"})}
        error={errors.id_subcategory?.message}
      />
      <Select
        label="Unidad"
        options={
          unidades?.map((unit) => ({
            value: unit.id,
            label: unit.name,
          })) || []
        }
        {...register("id_unit", {required: "La unidad es obligatoria"})}
        error={errors.id_unit?.message}
      />
      
      {/* Sección de información de solo lectura */}
      {(props.form.watch("create_at") || props.form.watch("update_at")) && (
        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Información del registro
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <InfoField 
              label="Fecha de creación" 
              value={props.form.watch("create_at") ? new Date(props.form.watch("create_at")).toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }) : undefined}
            />
            <InfoField 
              label="Última actualización" 
              value={props.form.watch("update_at") ? new Date(props.form.watch("update_at")).toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              }) : undefined}
            />
            <InfoField 
              label="Estado" 
              value={props.form.watch("active")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
