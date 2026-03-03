import { createContext, useContext, useState } from "react";
import type {
  ProductoDB,
  ProductoConDetalles,
  UnidadesDB,
  SubcategoriaDB,
  CategoriaDB,
  FamiliaDB,
} from "~/types/productos";

type DataContextType = {
  productosConDetalles: ProductoConDetalles[] | null;
  getProductosConDetalles: () => Promise<void>;
  subcategorias: SubcategoriaDB[] | null;
  categorias: CategoriaDB[] | null;
  familias: FamiliaDB[] | null;
  unidades: UnidadesDB[] | null;
  getSubcategorias: () => Promise<void>;
  getCategorias: () => Promise<void>;
  getFamilias: () => Promise<void>;
  getUnidades: () => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [productos, setProductos] = useState<ProductoDB[] | null>(null);
  const [unidades, setUnidades] = useState<UnidadesDB[] | null>(null);
  const [subcategorias, setSubcategorias] = useState<SubcategoriaDB[] | null>(null);
  const [categorias, setCategorias] = useState<CategoriaDB[] | null>(null);
  const [familias, setFamilias] = useState<FamiliaDB[] | null>(null);
  const [productosConDetalles, setProductosConDetalles] = useState<
    ProductoConDetalles[] | null
  >(null);

  const fetchAndSetData = async (
    url: string,
    setData: React.Dispatch<React.SetStateAction<any>>,
  ) => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setData(data);
      return data;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
      return null;
    }
  };

  const getProductos = async () => {
    try {
      const productosData = await fetchAndSetData(
        "/api/productos.json",
        setProductos,
      );
      if (!productosData) throw new Error("Failed to fetch productos");
      return productosData;
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };
  const getUnidades = async () => {
    try {
      const unidadesData = await fetchAndSetData("/api/unidades.json", setUnidades);
      if (!unidadesData) throw new Error("Failed to fetch unidades");
      return unidadesData;
    } catch (error) {
      console.error("Error fetching unidades:", error);
    }
  };
  const getFamilias = async () => {
    try {
      const familiasData = await fetchAndSetData("/api/familias.json", setFamilias);
      if (!familiasData) throw new Error("Failed to fetch familias");
      return familiasData;
    } catch (error) {
      console.error("Error fetching familias:", error);
    }
  };
  const getCategorias = async () => {
    try {
      const categoriasData = await fetchAndSetData(
        "/api/categorias.json",
        setCategorias,
      );
      if (!categoriasData) throw new Error("Failed to fetch categorias");
      return categoriasData;
    } catch (error) {
      console.error("Error fetching categorias:", error);
    }
  };
  const getSubcategorias = async () => {
    try {
      const subcategoriasData = await fetchAndSetData(
        "/api/subcategorias.json",
        setSubcategorias,
      );
      if (!subcategoriasData) throw new Error("Failed to fetch subcategorias");
      return subcategoriasData;
    } catch (error) {
      console.error("Error fetching subcategorias:", error);
    }
  };
  const getProductosConDetalles = async () => {
    let productosData: ProductoDB[] | null = productos;
    let unidadesData: UnidadesDB[] | null = unidades;
    let subcategoriasData: SubcategoriaDB[] | null = subcategorias;
    let categoriasData: CategoriaDB[] | null = categorias;
    let familiasData: FamiliaDB[] | null = familias;
    if (!productosData) {
      productosData = await getProductos();
    }
    if (!unidadesData) {
      unidadesData = await getUnidades();
    }
    if (!subcategoriasData) {
      subcategoriasData = await getSubcategorias();
    }
    if (!categoriasData) {
      categoriasData = await getCategorias();
    }
    if (!familiasData) {
      familiasData = await getFamilias();
    }
    if(!productosData || !unidadesData || !subcategoriasData || !categoriasData || !familiasData) {
      throw new Error("Failed to fetch all necessary data for productos con detalles");
    }
    const productosConDetallesData: ProductoConDetalles[] =
      productosData
        .map((producto) => {
          const unidad = unidadesData?.find((u) => u.id === producto.id_unit);
          const subcategoria = subcategoriasData?.find(
            (s) => s.id === producto.id_subcategory,
          );
          const categoria = subcategoria
            ? categoriasData?.find((c) => c.id === subcategoria.id_categoria)
            : undefined;
          const familia = categoria
            ? familiasData?.find((f) => f.id === categoria.id_family)
            : undefined;

          // Validación de integridad referencial
          if (!unidad || !subcategoria || !categoria || !familia) {
            console.warn(
              `⚠️ Producto "${producto.name}" (ID: ${producto.id}) tiene relaciones rotas:`,
              {
                unidad: unidad ? "✓" : `✗ (id_unit: ${producto.id_unit} no encontrado)`,
                subcategoria: subcategoria
                  ? "✓"
                  : `✗ (id_subcategory: ${producto.id_subcategory} no encontrado)`,
                categoria: categoria
                  ? "✓"
                  : `✗ (id_categoria: ${subcategoria?.id_categoria} no encontrado)`,
                familia: familia
                  ? "✓"
                  : `✗ (id_family: ${categoria?.id_family} no encontrado)`,
              },
            );
            return null;
          }

          return {
            ...producto,
            unit: unidad,
            subcategory: subcategoria,
            category: categoria,
            family: familia,
          };
        })
        .filter((p) => p !== null) as ProductoConDetalles[];

    setProductosConDetalles(productosConDetallesData);
  };

  return (
    <DataContext.Provider
      value={{
        subcategorias,
        categorias,
        familias,
        unidades,
        getSubcategorias,
        getCategorias,
        getFamilias,
        productosConDetalles,
        getProductosConDetalles,
        getUnidades
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
