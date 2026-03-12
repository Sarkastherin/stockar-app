import type { ChangeEvent } from "react";
import { Badge } from "flowbite-react";
import { useMemo, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { MovimientoConDetalles } from "~/types/movimientos";
import { Input } from "~/components/forms/InputsForm";
import { InfoField } from "~/components/forms/InfoField";

export function AjusteStockModal({
  props,
}: {
  props: {
    title: string;
    form: UseFormReturn<MovimientoConDetalles>;
    stockActual: number;
  };
}) {
  const { form, stockActual } = props;
  const movementType = form.watch("type");
  const [stockReal, setStockReal] = useState<string>("");
  const [showResumen, setShowResumen] = useState(false);

  const qtyAjuste = useMemo(() => {
    if (stockReal === "") return null;
    const newStock = Number(stockReal);
    if (Number.isNaN(newStock)) return null;
    return newStock - stockActual;
  }, [stockReal, stockActual]);

  const movimientoLabel = useMemo(() => {
    if (movementType === "ADJUST_POS") return "Ajuste positivo";
    if (movementType === "ADJUST_NEG") return "Ajuste negativo";
    return "Sin ajuste";
  }, [movementType]);

  const handleChangeStock = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStockReal(value);

    if (value === "") {
      form.setValue("qty", 0);
      form.setValue("type", "");
      setShowResumen(false);
      return;
    }

    const newStock = Number(value);
    if (Number.isNaN(newStock)) {
      form.setValue("qty", 0);
      form.setValue("type", "");
      setShowResumen(false);
      return;
    }

    const diferencia = newStock - stockActual;
    if (diferencia === 0) {
      form.setValue("qty", 0);
      form.setValue("type", "");
      setShowResumen(true);
      return;
    }

    form.setValue("qty", Math.abs(diferencia));
    form.setValue("type", diferencia > 0 ? "ADJUST_POS" : "ADJUST_NEG");
    form.setValue("note", "Ajuste desde STOCK");
    setShowResumen(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <div className="md:col-span-2">
          <InfoField label="Producto" value={form.watch("name_product")} />
        </div>
        <InfoField label="Stock actual" value={stockActual.toString()} />
      </div>

      <div className="rounded-xl border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-900/20 p-3">
        <Input
          label="Stock real"
          type="number"
          min={0}
          value={stockReal}
          onChange={handleChangeStock}
          placeholder="Ingresa el stock real"
          className="h-14 text-2xl font-bold text-center tracking-wide"
        />
      </div>

      {/* Información sobre el movimiento que se creará */}
      {showResumen && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Resumen del ajuste
            </span>
            {qtyAjuste === 0 ? (
              <Badge color="gray">Sin cambios</Badge>
            ) : (
              <Badge
                color={movementType === "ADJUST_POS" ? "success" : "warning"}
              >
                {movimientoLabel}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <InfoField label="Tipo de movimiento" value={movimientoLabel} />
            <InfoField
              label="Cantidad a ajustar"
              value={String(form.watch("qty") ?? 0)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
