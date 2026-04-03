import { useAuth } from "~/context/AuthContext";
import { createCrud } from "./crudFactory";
import type {
  ProductoDB,
  UnidadesDB,
  FamiliaDB,
  CategoriaDB,
  SubcategoriaDB,
} from "~/types/productos";
import type { MovimientoDB } from "~/types/movimientos";
import type { UsuarioDB } from "~/types/usuarios";

export function useUserServices() {
  const { fetchWithAuth } = useAuth();
  return createCrud<UsuarioDB>("users", fetchWithAuth);
}

export function useProductsServices() {
  const { fetchWithAuth } = useAuth();
  return createCrud<ProductoDB>("products", fetchWithAuth);
}
export function useUnitsServices() {
  const { fetchWithAuth } = useAuth();
  return createCrud<UnidadesDB>("units", fetchWithAuth);
}
export function useFamiliesServices() {
  const { fetchWithAuth } = useAuth();
  return createCrud<FamiliaDB>("families", fetchWithAuth);
}
export function useCategoriesServices() {
  const { fetchWithAuth } = useAuth();
  return createCrud<CategoriaDB>("categories", fetchWithAuth);
}
export function useSubcategoriesServices() {
  const { fetchWithAuth } = useAuth();
  return createCrud<SubcategoriaDB>("subcategories", fetchWithAuth);
}
export function useMovementsServices() {
  const { fetchWithAuth } = useAuth();
  return createCrud<MovimientoDB>("movements", fetchWithAuth);
}
