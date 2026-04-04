import type { CommonPropsDB } from "./commonsTypes";
import type { MovimientoDB } from "./movimientos";

export const tiposLocations: { value: string; label: string}[] = [
  {
    value: "WAREHOUSE",
    label: "Almacén",
  },
  {
    value: "AREA",
    label: "Área",
  },
  {
    value: "PROJECT",
    label: "Proyecto",
  },
  {
    value: "OTHER",
    label: "Otro",
  }
]
export type LocationType = "WAREHOUSE" | "AREA" | "PROJECT" | "OTHER";

export type UnidadesDB = CommonPropsDB & {
  name: string;
  abbreviation: string;
};
export type SubcategoriaDB = CommonPropsDB & {
  name: string;
  id_category: string;
};
export type CategoriaDB = CommonPropsDB & {
  name: string;
  id_family: string;
};
export type FamiliaDB = CommonPropsDB & {
  name: string;
};
export type UbicacionDB = CommonPropsDB & {
  name: string;
  type: LocationType;
  description?: string;
  
}
export type ProductoDB = CommonPropsDB & {
  name: string;
  id_subcategory: string;
  id_unit: string;
};
export type ProductoConDetalles = ProductoDB & {
  name_subcategory: string;
  name_category: string;
  name_unit: string;
  name_family: string;
  id_category: string;
  id_family: string;
};
export type StockItem = ProductoConDetalles & {
  stock: number;
  movimientos: MovimientoDB[];
}

export type StockListItem = ProductoConDetalles & {
  stock: number;
};
