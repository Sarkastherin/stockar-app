import type { CommonPropsDB } from "./commonsTypes";
export const tiposMovimiento: { value: MovimientoType; label: string, type: string }[] = [
  {
    value: "ENTRY",
    label: "Entrada",
    type: "success",
  },
  {
    value: "EXIT",
    label: "Salida",
    type: "failure",
  },
  {
    value: "ADJUST_POS",
    label: "Ajuste positivo",
    type: "info",
  },
  {
    value: "ADJUST_NEG",
    label: "Ajuste negativo",
    type: "warning",
  },
];
export type MovimientoType = "ENTRY" | "EXIT" | "ADJUST_POS" | "ADJUST_NEG";

export type MovimientoDB = CommonPropsDB & {
  type: MovimientoType;
  id_product: string;
  qty: number;
  note?: string;
  reference?: string;
  voided_at?: string;
  voided_by?: string;
  void_reason?: string;
};
export type MovimientoConDetalles = MovimientoDB & {
  name_product: string;
};
