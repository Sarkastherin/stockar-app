import type { Route } from "../+types/home";
import { Button, HelperText, TextInput } from "flowbite-react";
import { FiDownload, FiUpload } from "react-icons/fi";
import { useForm, useFieldArray } from "react-hook-form";
import type { MovimientoDB } from "~/types/movimientos";
import type { StockListItem } from "~/types/productos";
import { useState, useEffect, useRef, useMemo } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { commonProps } from "~/types/commonsTypes";
import { useDataContext } from "~/context/DataContext";
import { useModal } from "~/context/ModalContext";
import { SeleccionarProductoModal } from "~/components/modals/customs/SeleccionarProductoModal";
import { useSearchParams } from "react-router";
import { useConfigItemsProd } from "~/hooks/useConfigItemsProd";
import { Select } from "~/components/forms/InputsForm";
import { tiposLocations } from "~/types/productos";
import { Input } from "~/components/forms/InputsForm";
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
  movimientos: MovimientoDB[];
  id_origin?: string;
  id_destination?: string;
};

const movementTypeByQuery: Record<string, "ENTRY" | "EXIT"> = {
  entrada: "ENTRY",
  salida: "EXIT",
};
type Step = "form" | "success" | "error";
export default function NuevoMovimiento() {
  const [step, setStep] = useState<{ type: Step; message?: string }>({
    type: "form",
    message: "",
  });
  const { createManyMovimientos } = useDataContext();
  const [searchParams] = useSearchParams();
  const lastAppliedQueryType = useRef<string | null>(null);
  // Stock por índice de fila, poblado al seleccionar el producto desde el modal
  const [rowStock, setRowStock] = useState<Record<number, number>>({});
  const { openModal, closeModal } = useModal();
  const { ubicaciones } = useConfigItemsProd();
  const allLocationOptions = useMemo(
    () =>
      (ubicaciones ?? []).map((u) => ({
        value: u.id,
        label: `${u.name} (${tiposLocations.find((t) => t.value === u.type)?.label ?? u.type})`,
      })),
    [ubicaciones],
  );
  const locationOptions = useMemo(
    () =>
      (ubicaciones ?? [])
        .filter((u) => u.type === "WAREHOUSE")
        .map((u) => ({
          value: u.id,
          label: `${u.name} (${tiposLocations.find((t) => t.value === u.type)?.label ?? u.type})`,
        })),
    [ubicaciones],
  );
  const form = useForm<FormValues>({
    defaultValues: {
      movimientos: [],
      id_origin: "",
      id_destination: "",
    },
  });
  const fieldArray = useFieldArray({
    control: form.control,
    name: "movimientos",
  });
  const [movementType, setMovementType] = useState<"ENTRY" | "EXIT" | null>(
    null,
  );

  useEffect(() => {
    const typeParam = searchParams.get("type")?.toLowerCase() ?? null;
    const selectedType = typeParam
      ? (movementTypeByQuery[typeParam] ?? null)
      : null;

    if (!selectedType) {
      lastAppliedQueryType.current = null;
      return;
    }

    if (lastAppliedQueryType.current === typeParam) return;

    lastAppliedQueryType.current = typeParam;

    setMovementType(selectedType);

    if (fieldArray.fields.length === 0) {
      fieldArray.append({
        ...commonProps,
        type: selectedType,
        id_product: "",
        qty: 0,
        product_name: "",
        note: "",
        reference: "",
      });
      return;
    }

    fieldArray.fields.forEach((_, index) => {
      form.setValue(`movimientos.${index}.type`, selectedType);
    });
  }, [searchParams, fieldArray, form]);

  const onSubmit = async (data: FormValues) => {
    const movimientosToCreate = data.movimientos.map((mov) => ({
      id_product: mov.id_product,
      qty: mov.qty,
      type: mov.type,
      note: mov.note,
      reference: mov.reference,
      id_origin: data.id_origin || undefined,
      id_destination: data.id_destination || undefined,
    }));
    const result = await createManyMovimientos(movimientosToCreate);
    if (result.error) {
      setStep({
        type: "error",
        message: result.error.message || "Error desconocido",
      });
      return;
    }
    setStep({ type: "success" });
  };
  const selectType = (type: "ENTRY" | "EXIT") => {
    setMovementType(type);
    form.setValue("id_origin", "");
    form.setValue("id_destination", "");
    if (fieldArray.fields.length > 0) return;
    fieldArray.append({
      ...commonProps,
      type: type,
      id_product: "",
      qty: 0,
      product_name: "",
      note: "",
      reference: "",
    });
    // Si ya hay movimientos agregados, actualizar su tipo
    fieldArray.fields.forEach((_, index) => {
      form.setValue(`movimientos.${index}.type`, type);
    });
  };
  const handleOpenProductModal = (index: number) => {
    openModal("custom", {
      title: "Seleccionar producto",
      component: SeleccionarProductoModal,
      props: {
        onSelect: (item: StockListItem) => {
          form.setValue(`movimientos.${index}.id_product`, item.id);
          form.setValue(`movimientos.${index}.product_name`, item.name);
          setRowStock((prev) => ({ ...prev, [index]: Number(item.stock) }));
          closeModal();
        },
      },
    });
  };
  return (
    <>
      {step.type === "form" && (
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

          {movementType === "ENTRY" && (
            <fieldset className="mt-4">
              <Select
                label="Ubicación"
                id="id_destination"
                requiredField
                emptyOption="Seleccionar ubicación"
                options={allLocationOptions}
                error={form.formState.errors.id_destination?.message}
                {...form.register("id_destination", {
                  required: "Seleccione una ubicación destino",
                })}
              />
            </fieldset>
          )}

          {movementType === "EXIT" && (
            <fieldset className="mt-4 grid grid-cols-2 gap-3">
              <Select
                label="Ubicación origen"
                id="id_origin"
                requiredField
                emptyOption="Seleccionar origen"
                options={locationOptions}
                error={form.formState.errors.id_origin?.message}
                {...form.register("id_origin", {
                  required: "Seleccione una ubicación origen",
                })}
              />
              <Select
                label="Ubicación destino"
                id="id_destination"
                requiredField
                emptyOption="Seleccionar destino"
                options={allLocationOptions}
                error={form.formState.errors.id_destination?.message}
                {...form.register("id_destination", {
                  required: "Seleccione una ubicación destino",
                })}
              />
            </fieldset>
          )}
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
                      product_name: "",
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
                      <div className="col-span-12 md:col-span-7">
                        <Input
                          label="Producto"
                          type="text"
                          placeholder="Nombre del producto"
                          readOnly
                          onClick={() => handleOpenProductModal(index)}
                          value={
                            form.watch(`movimientos.${index}.product_name`) ||
                            ""
                          }
                        />
                      </div>
                      <div className="col-span-5 md:col-span-2">
                        <div className="relative">
                          <Input
                            label="Cantidad"
                            step={0.1}
                            type="number"
                            placeholder="0"
                            color={
                              form.formState.errors.movimientos?.[index]?.qty
                                ? "failure"
                                : "gray"
                            }
                            className="text-center font-semibold"
                            {...form.register(
                              `movimientos.${index}.qty` as const,
                              {
                                required: true,
                                valueAsNumber: true,
                                validate: (value) => {
                                  if (movementType === "ENTRY")
                                    return (
                                      value > 0 ||
                                      "La cantidad debe ser mayor a 0"
                                    );
                                  const stockDisponible = rowStock[index] ?? 0;
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
                              },
                            )}
                          />
                          {form.formState.errors.movimientos?.[index]?.qty && (
                            <span className="bg-red-500 rounded-full py-0.5 px-2 text-[10px] font-medium text-white absolute top-6 right-1.5 -translate-y-full">
                              {index + 1}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-span-5 md:col-span-2">
                        <Input
                          label="Stock"
                          type="text"
                          placeholder="Stock"
                          readOnly
                          value={
                            rowStock[index] !== undefined
                              ? Number(rowStock[index]).toFixed(2)
                              : "-"
                          }
                        />
                      </div>
                      <div className="col-span-2 md:col-span-1 flex items-center justify-center">
                        <Button
                          type="button"
                          color="red"
                          onClick={() => fieldArray.remove(index)}
                          className="px-3 "
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
                  onClick={() => {
                    if (!movementType) return;
                    fieldArray.append({
                      ...commonProps,
                      type: movementType,
                      id_product: "",
                      product_name: "",
                      qty: 0,
                    });
                  }}
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
      )}
      {step.type === "success" && (
        <div className="flex flex-col text-center py-12">
          <h2 className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-4">
            Movimiento registrado con éxito
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            El movimiento ha sido guardado correctamente en el sistema.
          </p>
          <Button
            className="self-center"
            type="button"
            color="green"
            onClick={() => {
              form.reset({ movimientos: [] });
              setStep({ type: "form" });
            }}
          >
            Registrar otro movimiento
          </Button>
        </div>
      )}
      {step.type === "error" && (
        <div className="flex flex-col text-center py-12">
          <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">
            Error al registrar el movimiento
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {step.message ||
              "Ha ocurrido un error al intentar guardar el movimiento. Por favor, inténtelo de nuevo."}
          </p>
          <Button
            className="self-center"
            type="button"
            color="red"
            onClick={() => {
              form.reset({ movimientos: [] });
              setStep({ type: "form" });
            }}
          >
            Intentar nuevamente
          </Button>
        </div>
      )}
    </>
  );
}
