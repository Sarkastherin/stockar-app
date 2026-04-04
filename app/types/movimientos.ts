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
export type MovimientoType = "ENTRY" | "EXIT" | "ADJUST_POS" | "ADJUST_NEG" | "";

export type MovimientoDB = CommonPropsDB & {
  type: MovimientoType;
  id_product: string;
  qty: number;
  note?: string;
  reference?: string;
  voided_at?: string;
  voided_by?: string;
  void_reason?: string;
  id_origin?: string | null;
  id_destination?: string | null;
  product_name?: string;
  origin_name?: string | null;
  origin_type?: string | null;
  destination_name?: string | null;
  destination_type?: string | null;
};
