import { createContext, useContext, useState } from "react";
import type { MovimientoDB, MovimientoConDetalles } from "~/types/movimientos";
import type {
  ProductoDB,
  ProductoConDetalles,
  UnidadesDB,
  SubcategoriaDB,
  CategoriaDB,
  FamiliaDB,
  StockItem
} from "~/types/productos";
import type { UsuarioDB } from "~/types/usuarios";

type DataContextType = {
  productosConDetalles: ProductoConDetalles[] | null;
  getProductosConDetalles: () => Promise<ProductoConDetalles[] | null>;
  subcategorias: SubcategoriaDB[] | null;
  categorias: CategoriaDB[] | null;
  familias: FamiliaDB[] | null;
  unidades: UnidadesDB[] | null;
  productos: ProductoDB[] | null;
  getProductos: () => Promise<void>;
  getSubcategorias: () => Promise<void>;
  getCategorias: () => Promise<void>;
  getFamilias: () => Promise<void>;
  getUnidades: () => Promise<void>;
  movimientosConDetalles: MovimientoConDetalles[] | null;
  getMovimientosConDetalles: () => Promise<void>;
  usuarios: UsuarioDB[] | null;
  getUsuarios: () => Promise<void>;
  stockItems: StockItem[] | null;
  getStockItems: () => Promise<StockItem[] | null>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [productos, setProductos] = useState<ProductoDB[] | null>(null);
  const [unidades, setUnidades] = useState<UnidadesDB[] | null>(null);
  const [subcategorias, setSubcategorias] = useState<SubcategoriaDB[] | null>(
    null,
  );
  const [categorias, setCategorias] = useState<CategoriaDB[] | null>(null);
  const [familias, setFamilias] = useState<FamiliaDB[] | null>(null);
  const [productosConDetalles, setProductosConDetalles] = useState<
    ProductoConDetalles[] | null
  >(null);
  const [movimientos, setMovimientos] = useState<MovimientoDB[] | null>(null);
  const [movimientosConDetalles, setMovimientosConDetalles] = useState<
    MovimientoConDetalles[] | null
  >(null);
  const [usuarios, setUsuarios] = useState<UsuarioDB[] | null>(null);

  const [stockItems, setStockItems] = useState<StockItem[] | null>(null);

  const fetchAndSetData = async <T,>(
    url: string,
    setData: React.Dispatch<React.SetStateAction<T[] | null>>,
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
      const productosData = await fetchAndSetData<ProductoDB>(
        "/api/products.json",
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
      const unidadesData = await fetchAndSetData<UnidadesDB>(
        "/api/units.json",
        setUnidades,
      );
      if (!unidadesData) throw new Error("Failed to fetch unidades");
      return unidadesData;
    } catch (error) {
      console.error("Error fetching unidades:", error);
    }
  };
  const getFamilias = async () => {
    try {
      const familiasData = await fetchAndSetData<FamiliaDB>(
        "/api/families.json",
        setFamilias,
      );
      if (!familiasData) throw new Error("Failed to fetch familias");
      return familiasData;
    } catch (error) {
      console.error("Error fetching familias:", error);
    }
  };
  const getCategorias = async () => {
    try {
      const categoriasData = await fetchAndSetData<CategoriaDB>(
        "/api/categories.json",
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
      const subcategoriasData = await fetchAndSetData<SubcategoriaDB>(
        "/api/subcategories.json",
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
    if (
      !productosData ||
      !unidadesData ||
      !subcategoriasData ||
      !categoriasData ||
      !familiasData
    ) {
      throw new Error(
        "Failed to fetch all necessary data for productos con detalles",
      );
    }
    const productosConDetallesData: ProductoConDetalles[] = productosData
      .map((producto) => {
        const unit = unidadesData?.find((u) => u.id === producto.id_unit);
        const subcategory = subcategoriasData?.find(
          (s) => s.id === producto.id_subcategory,
        );
        const category = subcategory
          ? categoriasData?.find((c) => c.id === subcategory.id_category)
          : undefined;
        const family = category
          ? familiasData?.find((f) => f.id === category.id_family)
          : undefined;

        // Validación de integridad referencial
        if (!unit || !subcategory || !category || !family) {
          console.warn(
            `⚠️ Producto "${producto.name}" (ID: ${producto.id}) tiene relaciones rotas:`,
            {
              unit: unit
                ? "✓"
                : `✗ (id_unit: ${producto.id_unit} no encontrado)`,
              subcategory: subcategory
                ? "✓"
                : `✗ (id_subcategory: ${producto.id_subcategory} no encontrado)`,
              category: category
                ? "✓"
                : `✗ (id_category: ${subcategory?.id_category} no encontrado)`,
              family: family
                ? "✓"
                : `✗ (id_family: ${category?.id_family} no encontrado)`,
            },
          );
          return null;
        }

        return {
          ...producto,
          name_unit: unit.name,
          name_subcategory: subcategory.name,
          name_category: category.name,
          name_family: family.name,
          id_category: category.id,
          id_family: family.id,
        };
      })
      .filter((p) => p !== null) as ProductoConDetalles[];

    setProductosConDetalles(productosConDetallesData);
    return productosConDetallesData;
  };
  const getMovimientos = async () => {
    try {
      const movimientosData = await fetchAndSetData<MovimientoDB>(
        "/api/movements.json",
        setMovimientos,
      );
      if (!movimientosData) throw new Error("Failed to fetch movimientos");
      return movimientosData;
    } catch (error) {
      console.error("Error fetching movimientos:", error);
    }
  };
  const getMovimientosConDetalles = async () => {
    let movimientosData: MovimientoDB[] | null = movimientos;
    let productosData: ProductoDB[] | null = productos;
    if (!movimientosData) {
      movimientosData = await getMovimientos();
    }
    if (!productosData) {
      productosData = await getProductos();
    }
    if (!movimientosData || !productosData) {
      throw new Error(
        "Failed to fetch all necessary data for movimientos con detalles",
      );
    }
    const movimientosConDetallesData = movimientosData
      .map((movimiento) => {
        const producto = productosData?.find(
          (p) => p.id === movimiento.id_product,
        );
        if (!producto) {
          console.warn(
            `⚠️ Movimiento ID: ${movimiento.id} tiene un producto relacionado que no existe (id_product: ${movimiento.id_product})`,
          );
          return null;
        }
        return {
          ...movimiento,
          name_product: producto.name,
        };
      })
      .filter((m) => m !== null) as MovimientoConDetalles[];
    setMovimientosConDetalles(movimientosConDetallesData);
  };
  const getUsuarios = async () => {
    try {
      const response = await fetch("/api/users.json");
      const data = await response.json();
      setUsuarios(data);
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const getStockItems = async () => {
    let productosConDetallesData: ProductoConDetalles[] | null = productosConDetalles;
    let movimientosData: MovimientoDB[] | null = movimientos;
    if (!productosConDetallesData) {
      productosConDetallesData = await getProductosConDetalles();
    }
    if (!movimientosData) {
      movimientosData = await getMovimientos();
    }
    if (!productosConDetallesData || !movimientosData) {
      throw new Error("Failed to fetch all necessary data for stock items");
    }
    const stockItemsData: StockItem[] = productosConDetallesData.map((producto) => {
      const movimientosProducto = movimientosData!.filter(
        (m) => m.id_product === producto.id,
      );
      const stock = movimientosProducto.reduce((acc, movimiento) => {
        return (movimiento.type === "ENTRY" || movimiento.type === "ADJUST_POS")
          ? acc + movimiento.qty
          : acc - movimiento.qty;
      }, 0);
      return {
        ...producto,
        stock,
        movimientos: movimientosProducto,
      };
    });
    setStockItems(stockItemsData);
    return stockItemsData;
   
  };
  return (
    <DataContext.Provider
      value={{
        subcategorias,
        categorias,
        familias,
        unidades,
        usuarios,
        productos,
        stockItems,
        getSubcategorias,
        getCategorias,
        getFamilias,
        getProductos,
        productosConDetalles,
        getProductosConDetalles,
        getUnidades,
        movimientosConDetalles,
        getMovimientosConDetalles,
        getUsuarios,
        getStockItems,
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
