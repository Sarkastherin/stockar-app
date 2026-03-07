import type { Route } from "../+types/home";
import { Button, HelperText, Spinner, TextInput } from "flowbite-react";
import { useMovimientos } from "~/hooks/useMovimientos";
import { FiDownload, FiUpload } from "react-icons/fi";
import { useForm, useFieldArray } from "react-hook-form";
import type { MovimientoConDetalles } from "~/types/movimientos";
import { useState, useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { commonProps } from "~/types/commonsTypes";
import { SelectWithSearch } from "~/components/forms/InputsForm";
import { useDataContext } from "~/context/DataContext";
import { useModal } from "~/context/ModalContext";
import { SeleccionarProductoModal } from "~/components/modals/customs/SeleccionarProductoModal";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nuevo Movimiento" },
    {
      name: "description",
      content: "Registro de un nuevo movimiento de productos",
    },
  ];
}
type FormValues = {
  movimientos: MovimientoConDetalles[];
};
export default function NuevoMovimiento() {
  const { stockItems, getStockItems } = useDataContext();
  useEffect(() => {
    if (!stockItems) getStockItems();
  }, [stockItems, getStockItems]);
  const { openModal, closeModal } = useModal();
  const form = useForm<FormValues>({
    defaultValues: {
      movimientos: [],
    },
  });
  const fieldArray = useFieldArray({
    control: form.control,
    name: "movimientos",
  });
  const [movementType, setMovementType] = useState<"ENTRY" | "EXIT" | null>(
    null,
  );
  const onSubmit = async (data: FormValues) => {
    console.log("Datos a enviar para nuevo movimiento:", data);
  };
  const selectType = (type: "ENTRY" | "EXIT") => {
    setMovementType(type);
    fieldArray.append({
      ...commonProps,
      type: type,
      id_product: "",
      qty: 0,
      name_product: "",
      note: "",
      reference: "",
    });
    // Si ya hay movimientos agregados, actualizar su tipo
  };
  const handleOpenProductModal = (index: number) => {
    openModal("custom", {
      component: SeleccionarProductoModal,
      props: {
        onSelect: (product: { id: string; name: string }) => {
          form.setValue(`movimientos.${index}.id_product`, product.id);
          form.setValue(`movimientos.${index}.name_product`, product.name);
          closeModal();
        },
      },
    });
  };
  if (!stockItems) {
    return (
      <div className="flex justify-center items-center">
        <Spinner aria-label="Cargando..." />
      </div>
    );
  }
  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col h-full max-w-4xl w-full mx-auto"
    >
      <fieldset className="space-y-2">
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
          Tipo de movimiento
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => selectType("ENTRY")}
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
            onClick={() => selectType("EXIT")}
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
        </div>
        <HelperText>
          Selecciona el tipo de movimiento antes de agregar artículos.
        </HelperText>
      </fieldset>
      <fieldset className="mt-6 space-y-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Artículos ({fieldArray.fields.length})
        </h3>

        {fieldArray.fields.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
              No hay artículos agregados
            </p>
            <Button
              type="button"
              size="sm"
              color="light"
              className="mx-auto"
              disabled={!movementType}
              onClick={() =>
                fieldArray.append({
                  ...commonProps,
                  type: movementType || "",
                  id_product: "",
                  name_product: "",
                  qty: 0,
                })
              }
            >
              Agregar primer artículo
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {fieldArray.fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-7">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Producto
                    </label>
                    <TextInput
                      sizing="sm"
                      type="text"
                      placeholder="Nombre del producto"
                      className="text-center font-semibold"
                      readOnly
                      onClick={() => handleOpenProductModal(index)}
                      value={
                        form.watch(`movimientos.${index}.name_product`) || ""
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Cantidad
                    </label>
                    <div className="relative">
                      <TextInput
                      step={0.1}
                        sizing="sm"
                        type="number"
                        placeholder="0"
                        color={
                          form.formState.errors.movimientos?.[index]?.qty
                            ? "failure"
                            : "gray"
                        }
                        className="text-center font-semibold"
                        {...form.register(`movimientos.${index}.qty` as const, {
                          required: true,
                          validate: (value) => {
                            const stockDisponible =
                              stockItems.find(
                                (item) =>
                                  item.id ===
                                  form.watch(`movimientos.${index}.id_product`),
                              )?.stock ?? 0;
                            return (
                              value <= stockDisponible ||
                              "Cantidad excede el stock disponible"
                            );
                          },
                          // validar que sea un número positivo
                          min: {
                            value: 0.1,
                            message: "La cantidad debe ser al menos 1",
                          },
                        })}
                      />
                      {form.formState.errors.movimientos?.[index]?.qty && (
                        <span className="bg-red-500 rounded-full py-0.5 px-2 text-[10px] font-medium text-white absolute top-6 right-1.5 -translate-y-full">
                          {index + 1}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stock
                    </label>
                    <div className="h-9 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                      {stockItems.find(
                        (item) =>
                          item.id ===
                          form.watch(`movimientos.${index}.id_product`),
                      )?.stock ?? "-"}
                    </div>
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Button
                      type="button"
                      size="sm"
                      color="red"
                      onClick={() => fieldArray.remove(index)}
                      className="px-2.5 "
                      title="Eliminar artículo"
                    >
                      <FaRegTrashAlt className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Botón agregar otro artículo al final de la lista */}
            <button
              type="button"
              disabled={!movementType}
              onClick={() =>
                fieldArray.append({
                  ...commonProps,
                  type: movementType || "",
                  id_product: "",
                  name_product: "",
                  qty: 0,
                })
              }
              className="w-full p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                + Agregar otro artículo
              </span>
            </button>
          </div>
        )}
        {Array.isArray(form.formState.errors.movimientos) &&
          form.formState.errors.movimientos.map((error, index) => {
            if (error?.qty) {
              return (
                <HelperText key={index} color="failure">
                  {`Artículo ${index + 1}: ${error.qty.message}`}
                </HelperText>
              );
            }
          })}
      </fieldset>
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Total de artículos:{" "}
          <span className="font-semibold">{fieldArray.fields.length}</span>
        </p>
        <Button
          type="submit"
          color="indigo"
          disabled={fieldArray.fields.length === 0 || !movementType}
        >
          Guardar movimiento
        </Button>
      </div>
    </form>
  );
}
