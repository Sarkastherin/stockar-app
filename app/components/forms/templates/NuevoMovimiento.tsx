import {
  FiDownload,
  FiTrendingDown,
  FiTrendingUp,
  FiUpload,
} from "react-icons/fi";
import type { MovimientoConDetalles } from "~/types/movimientos";
import { useDataContext } from "~/context/DataContext";
import type { UseFormReturn } from "node_modules/react-hook-form/dist/types/form";
import { useEffect } from "react";
import { Spinner } from "flowbite-react";
import { HelperText } from "flowbite-react";
import { useFormState } from "react-hook-form";
import {
  Input,
  Textarea,
  SelectWithSearch,
} from "~/components/forms/InputsForm";
export default function TemplateNuevoMovimiento({
  form,
}: {
  form: UseFormReturn<MovimientoConDetalles>;
}) {
  const { register, control, watch, setValue } = form;
  const movementType = watch("type");
  const { errors } = useFormState({ control });
  const { productos, getProductos } = useDataContext();
  const idProducto = {
    ...register("id_product", { required: "El producto es requerido" }),
  };

  useEffect(() => {
    if (!productos) getProductos();
  }, [productos, getProductos]);

  if (!productos) {
    return (
      <div className="flex justify-center items-center">
        <Spinner aria-label="Cargando productos..." />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <fieldset className="space-y-2">
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
          Tipo de movimiento
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setValue("type", "ENTRY", { shouldValidate: true })}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
              movementType === "ENTRY"
                ? "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
            aria-pressed={movementType === "ENTRY"}
          >
            <FiDownload
              className={`mx-auto text-3xl mb-2 ${
                movementType === "ENTRY"
                  ? "text-green-600 dark:text-green-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            <p
              className={`text-sm font-medium ${
                movementType === "ENTRY"
                  ? "text-green-700 dark:text-green-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Entrada
            </p>
          </button>

          <button
            type="button"
            onClick={() => setValue("type", "EXIT", { shouldValidate: true })}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
              movementType === "EXIT"
                ? "border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-600"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
            aria-pressed={movementType === "EXIT"}
          >
            <FiUpload
              className={`mx-auto text-3xl mb-2 ${
                movementType === "EXIT"
                  ? "text-red-600 dark:text-red-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            <p
              className={`text-sm font-medium ${
                movementType === "EXIT"
                  ? "text-red-700 dark:text-red-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Salida
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setValue("type", "ADJUST_POS", { shouldValidate: true })
            }
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
              movementType === "ADJUST_POS"
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
            aria-pressed={movementType === "ADJUST_POS"}
          >
            <FiTrendingUp
              className={`mx-auto text-3xl mb-2 ${
                movementType === "ADJUST_POS"
                  ? "text-blue-600 dark:text-blue-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            <p
              className={`text-sm font-medium ${
                movementType === "ADJUST_POS"
                  ? "text-blue-700 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Ajt. Positivo
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setValue("type", "ADJUST_NEG", { shouldValidate: true })
            }
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
              movementType === "ADJUST_NEG"
                ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-600"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
            aria-pressed={movementType === "ADJUST_NEG"}
          >
            <FiTrendingDown
              className={`mx-auto text-3xl mb-2 ${
                movementType === "ADJUST_NEG"
                  ? "text-orange-600 dark:text-orange-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            />
            <p
              className={`text-sm font-medium ${
                movementType === "ADJUST_NEG"
                  ? "text-orange-700 dark:text-orange-400"
                  : "text-gray-700 dark:text-gray-300"
              }`}
            >
              Ajt. Negativo
            </p>
          </button>
        </div>
      </fieldset>
      {!movementType && (
        <HelperText>
          Selecciona el tipo de movimiento para continuar con el registro.
        </HelperText>
      )}
      <fieldset disabled={!movementType} className="space-y-4">
        <SelectWithSearch
          input={{
            label: "Producto",
            placeholder: "Buscar producto",
            value: watch("name_product") || "",
          }}
          search={{
            placeholder: "Buscar producto",
          }}
          data={{
            items: productos,
            onSelect: (producto) => {
              setValue("id_product", producto.id);
              setValue("name_product", producto.name);
            },
          }}
          error={errors.id_product?.message || ""}
          requiredField
        />
        <div className="space-y-2">
          <div className="flex flex-col gap-2 md:flex-row">
            <Input
              label="Cantidad"
              type="number"
              {...register("qty", {
                required: "La cantidad es requerida",
                valueAsNumber: true,
                validate: (value) =>
                  value > 0 || "La cantidad debe ser mayor a cero",
              })}
              error={errors.qty?.message}
              requiredField
            />
            <Input label="Referencia" type="text" {...register("reference")} />
          </div>
          <Textarea label="Nota" {...register("note")} />
        </div>
      </fieldset>
    </div>
  );
}
