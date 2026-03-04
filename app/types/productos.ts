import type { CommonPropsDB } from "./commonsTypes";

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
export type ProductoDB = CommonPropsDB & {
  name: string;
  id_subcategory: string;
  id_unit: string;
};
export type ProductoConDetalles = ProductoDB & {
  /* subcategory: SubcategoriaDB;
  category: CategoriaDB;
  family: FamiliaDB;
  unit: UnidadesDB; */
  name_subcategory: string;
  name_category: string;
  name_unit: string;
  name_family: string;
  id_category: string;
  id_family: string;
  
};
