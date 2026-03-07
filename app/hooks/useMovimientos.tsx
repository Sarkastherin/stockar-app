import type { MovimientoConDetalles } from "~/types/movimientos";
import { useForm, useFieldArray } from "react-hook-form";
export const useMovimientos = () => {
  const form = useForm<MovimientoConDetalles>({
    defaultValues: {},
  });
  const onSubmitEdit = async (data: MovimientoConDetalles) => {
    const { reference, note } = data;
    console.log("Datos a enviar:", { reference, note });
  };
  const onSubmitNew = async (data: MovimientoConDetalles) => {
    console.log("Datos a enviar para nuevo movimiento:", data);
  };
  const onSubmitAjuste = async (data: MovimientoConDetalles) => {
    const { type, id_product, qty, note, reference } = data;
    console.log("Datos a enviar para ajuste de stock:", { type, qty });
  };
  const onError = (errors: any) => {
    console.log("Errores de validación:", errors);
  };
  return {
    form,
    onSubmitEdit,
    onSubmitNew,
    onSubmitAjuste,
    onError,
  };
};
