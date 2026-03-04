import type { ProductoConDetalles } from "~/types/productos";
import { Input, Select } from "~/components/forms/InputsForm";
import { InfoField } from "~/components/forms/InfoField";
import { Spinner } from "flowbite-react";
import { useFormState, type UseFormReturn } from "react-hook-form";
import { useDataContext } from "~/context/DataContext";
import { useCallback, useEffect, useMemo } from "react";
import { useConfigItemsProd } from "~/hooks/useConfigItemsProd";

const formatDateTime = (value?: string) => {
  if (!value) return undefined;
  return new Date(value).toLocaleString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function ProductosModal({
  props,
}: {
  props: {
    title: string;
    form: UseFormReturn<ProductoConDetalles>;
  };
}) {
  const { register, control, watch, setValue } = props.form;
  const { errors } = useFormState({ control });
  const familiaId = watch("id_family") || "";
  const categoriaId = watch("id_category") || "";
  const createdAt = watch("created_at");
  const updatedAt = watch("updated_at");
  const active = watch("active");
  const {
    subcategorias,
    categorias,
    familias,
    unidades,
    familiasOptions,
    unidadesOptions,
    getCategoriasFiltradasOptions,
    getSubcategoriasFiltradasOptions,
  } = useConfigItemsProd();

  const isLoading = !subcategorias || !categorias || !familias || !unidades;

  const changeFamily = useCallback(
    (id_family: string) => {
      const selectedFamily = familias?.find((fam) => fam.id === id_family);
      setValue("id_family", id_family, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("name_family", selectedFamily?.name || "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("id_category", "", { shouldDirty: true, shouldValidate: true });
      setValue("name_category", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("id_subcategory", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [familias, setValue],
  );

  const changeCategory = useCallback(
    (id_category: string) => {
      const selectedCategory = categorias?.find(
        (cat) => cat.id === id_category,
      );
      setValue("id_category", id_category, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("name_category", selectedCategory?.name || "", {
        shouldDirty: true,
        shouldValidate: true,
      });
      setValue("id_subcategory", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [categorias, setValue],
  );

  if (isLoading) {
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
        options={familiasOptions}
        required
        {...register("id_family", {
          required: "La familia es obligatoria",
          onChange: (e) => {
            const id_family = e.target.value;
            changeFamily(id_family);
          },
        })}
        value={familiaId}
        error={errors.id_family?.message}
      />

      <Select
        label="Categoria"
        disabled={!familiaId}
        options={getCategoriasFiltradasOptions(familiaId)}
        {...register("id_category", {
          required: "La categoria es obligatoria",
          onChange: (e) => {
            const id_category = e.target.value;
            changeCategory(id_category);
          },
        })}
        value={categoriaId}
        error={errors.id_category?.message}
      />
      <Select
        disabled={!categoriaId}
        label="Subcategoria"
        emptyOption={`Seleccione una subcategoria${!categoriaId ? " (Seleccione una categoria primero)" : ""}`}
        options={getSubcategoriasFiltradasOptions(categoriaId)}
        {...register("id_subcategory", {
          required: "La subcategoria es obligatoria",
        })}
        error={errors.id_subcategory?.message}
      />
      <Select
        label="Unidad"
        options={unidadesOptions}
        {...register("id_unit", { required: "La unidad es obligatoria" })}
        error={errors.id_unit?.message}
      />

      {/* Sección de información de solo lectura */}
      {(createdAt || updatedAt) && (
        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Información del registro
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <InfoField
              label="Fecha de creación"
              value={formatDateTime(createdAt)}
            />
            <InfoField
              label="Última actualización"
              value={formatDateTime(updatedAt)}
            />
            <InfoField label="Estado" value={active} />
          </div>
        </div>
      )}
    </div>
  );
}
