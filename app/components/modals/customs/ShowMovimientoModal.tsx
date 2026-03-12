import { Input } from "~/components/forms/InputsForm";
import { Spinner, Badge, Label, Button } from "flowbite-react";
import type { UseFormReturn } from "react-hook-form";
import { useDataContext } from "~/context/DataContext";
import { useCallback, useEffect } from "react";
import InfoFormCommons from "~/components/forms/InfoFormCommons";
import {
  tiposMovimiento,
  type MovimientoConDetalles,
} from "~/types/movimientos";

export function MovimientoModal({
  props,
}: {
  props: {
    title: string;
    form: UseFormReturn<MovimientoConDetalles>;
    onDelete?: () => void;
    onReactivate?: () => void;
  };
}) {
  const { getUsuarios, usuarios } = useDataContext();
  const { register, watch } = props.form;

  useEffect(() => {
    if (!usuarios) getUsuarios();
  }, [usuarios, getUsuarios]);

  const getUserById = useCallback(
    (id?: string) => {
      if (!id) return undefined;
      const user = usuarios?.find((u) => u.id === id);
      return user ? `${user.name} ${user.last_name}` : "N/A";
    },
    [usuarios],
  );
  const createdAt = watch("created_at");
  const updatedAt = watch("updated_at");
  const active = watch("active");
  const createdBy = watch("creator");
  const updatedBy = watch("updater");
  const voidedAt = watch("voided_at");
  const voidedBy = getUserById(watch("voided_by"));
  const voidReason = watch("void_reason");

  const isLoading = !usuarios;

  const productName = watch("name_product");
  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner aria-label="Cargando productos..." />
      </div>
    );
  }

  return (
    <>
      {/* Header: resumen */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                color={
                  tiposMovimiento.find((tipo) => tipo.value === watch("type"))
                    ?.type
                }
              >
                {
                  tiposMovimiento.find((tipo) => tipo.value === watch("type"))
                    ?.label
                }
              </Badge>
              {!active && <Badge color="gray">ANULADO</Badge>}
            </div>

            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {productName}
            </div>

            {createdAt && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(createdAt).toLocaleString("es-ES", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            )}
          </div>
          {/* Cantidad grande */}
          <div className="text-right">
            <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
              Cantidad
            </Label>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {watch("qty")}
            </div>
          </div>
        </div>
        {/* Detalles en grilla */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input label="Referencia" {...register("reference")} />
          <div className="col-span-2">
            <Input label="Nota" {...register("note")} />
          </div>
        </div>
      </div>
      {/* Botones de acción */}
      {active ? (
        <div className="bg-red-50 border-2 border-red-200 p-4 text-red-700 rounded-lg mt-4 hover:bg-red-100 transition-colors">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 mb-1">
                ⚠️ Anular movimiento
              </p>
              <p className="text-sm text-red-700">
                Esta acción anulará el movimiento seleccionado y no será
                considerado en los cálculos de stock.
              </p>
            </div>
            <Button
              size="sm"
              color="red"
              className="whitespace-nowrap"
              onClick={props.onDelete}
            >
              Anular movimiento
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border-2 border-green-200 p-4 text-green-700 rounded-lg mt-4 hover:bg-green-100 transition-colors">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900 mb-1">
                ⚠️ Reactivar movimiento
              </p>
              <p className="text-sm text-green-700">
                Esta acción reactivará el movimiento seleccionado y será
                considerado nuevamente en los cálculos de stock.
              </p>
            </div>
            <Button
              size="sm"
              color="green"
              className="whitespace-nowrap"
              onClick={props.onReactivate}
            >
              Reactivar movimiento
            </Button>
          </div>
        </div>
      )}
      {(createdAt || updatedAt) && (
        <InfoFormCommons
          active={active}
          createdAt={createdAt}
          createdBy={createdBy}
          updatedAt={updatedAt}
          updatedBy={updatedBy}
          voidedAt={voidedAt}
          voidedBy={voidedBy}
          voidReason={voidReason}
        />
      )}
    </>
  );
}
