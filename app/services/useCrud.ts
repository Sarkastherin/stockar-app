import { useMemo } from "react";
import { useAuth } from "~/context/AuthContext";
import { createCrud } from "./crudFactory";
import type {
  ProductoDB,
  StockListItem,
  UnidadesDB,
  FamiliaDB,
  CategoriaDB,
  SubcategoriaDB,
  UbicacionDB
} from "~/types/productos";
import type { MovimientoDB } from "~/types/movimientos";
import type { UsuarioDB } from "~/types/usuarios";

export function useUserServices() {
  const { fetchWithAuth } = useAuth();
  return useMemo(
    () => createCrud<UsuarioDB>("users", fetchWithAuth),
    [fetchWithAuth],
  );
}

export function useProductsServices() {
  const { fetchWithAuth } = useAuth();
  return useMemo(
    () => createCrud<ProductoDB>("products", fetchWithAuth),
    [fetchWithAuth],
  );
}
export function useUnitsServices() {
  const { fetchWithAuth } = useAuth();
  return useMemo(
    () => createCrud<UnidadesDB>("units", fetchWithAuth),
    [fetchWithAuth],
  );
}
export function useFamiliesServices() {
  const { fetchWithAuth } = useAuth();
  return useMemo(
    () => createCrud<FamiliaDB>("families", fetchWithAuth),
    [fetchWithAuth],
  );
}
export function useCategoriesServices() {
  const { fetchWithAuth } = useAuth();
  return useMemo(
    () => createCrud<CategoriaDB>("categories", fetchWithAuth),
    [fetchWithAuth],
  );
}
export function useSubcategoriesServices() {
  const { fetchWithAuth } = useAuth();
  return useMemo(
    () => createCrud<SubcategoriaDB>("subcategories", fetchWithAuth),
    [fetchWithAuth],
  );
}
export function useLocationsServices() {
  const { fetchWithAuth } = useAuth();
  return useMemo(
    () => createCrud<UbicacionDB>("locations", fetchWithAuth),
    [fetchWithAuth],
  );
}
export function useMovementsServices() {
  const { fetchWithAuth } = useAuth();
  return useMemo(
    () => createCrud<MovimientoDB>("movements", fetchWithAuth),
    [fetchWithAuth],
  );
}

export function useStockServices() {
  const { fetchWithAuth } = useAuth();
  return useMemo(
    () => createCrud<StockListItem>("stock", fetchWithAuth),
    [fetchWithAuth],
  );
}
