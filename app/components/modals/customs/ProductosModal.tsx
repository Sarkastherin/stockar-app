import type { ProductoConDetalles } from "~/types/productos";
import { Input, Select } from "~/components/forms/InputsForm";
import { Spinner, Button } from "flowbite-react";
import { useFormState, type UseFormReturn } from "react-hook-form";
import { useCallback } from "react";
import { useConfigItemsProd } from "~/hooks/useConfigItemsProd";
import InfoFormCommons from "~/components/forms/InfoFormCommons";
import { useModal } from "~/context/ModalContext";

export function ProductosModal({
  props,
}: {
  props: {
    title: string;
    form: UseFormReturn<ProductoConDetalles>;
    onDelete?: () => void;
    onReactivate?: () => void;
  };
}) {
  const { register, control, watch, setValue } = props.form;
  const { errors } = useFormState({ control });
  const familiaId = watch("id_family") || "";
  const categoriaId = watch("id_category") || "";
  const createdAt = watch("created_at");
  const updatedAt = watch("updated_at");
  const createdBy = watch("creator");
  const updatedBy = watch("updater");
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            color={active ? "red" : "green"}
            onClick={active ? props.onDelete : props.onReactivate}
            fullSized
          >
            {active ? "Dar de baja producto" : "Reactivar producto"}
          </Button>
        </div>
      )}
    </div>
  );
}
