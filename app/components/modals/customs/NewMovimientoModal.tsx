import { type UseFormReturn } from "react-hook-form";
import type { MovimientoConDetalles } from "~/types/movimientos";
import TemplateNuevoMovimiento from "~/components/forms/templates/NuevoMovimiento";

export function NewMovimientoModal({
  props,
}: {
  props: {
    title: string;
    form: UseFormReturn<MovimientoConDetalles>;
  };
}) {
  return <TemplateNuevoMovimiento form={props.form} />;
}
