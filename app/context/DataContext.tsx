import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { MovimientoDB, MovimientoConDetalles } from "~/types/movimientos";
import type {
  ProductoDB,
  ProductoConDetalles,
  UnidadesDB,
  SubcategoriaDB,
  CategoriaDB,
  FamiliaDB,
  StockItem,
} from "~/types/productos";
import type { UsuarioDB } from "~/types/usuarios";
import {
  productsServices,
  categoriesServices,
  familiesServices,
  movementsServices,
  subcategoriesServices,
  unitsServices,
  userServices,
} from "~/services/cruds";
import type { CrudService, ServiceResult } from "~/services/crudFactory";

type DataContextType = {
  productosConDetalles: ProductoConDetalles[] | null;
  getProductosConDetalles: (
    forceRefresh?: boolean,
  ) => Promise<ProductoConDetalles[] | null>;
  subcategorias: SubcategoriaDB[] | null;
  categorias: CategoriaDB[] | null;
  familias: FamiliaDB[] | null;
  unidades: UnidadesDB[] | null;
  productos: ProductoDB[] | null;
  getProductos: () => Promise<ProductoDB[] | null>;
  getSubcategorias: () => Promise<SubcategoriaDB[] | null>;
  getCategorias: () => Promise<CategoriaDB[] | null>;
  getFamilias: () => Promise<FamiliaDB[] | null>;
  getUnidades: () => Promise<UnidadesDB[] | null>;
  movimientosConDetalles: MovimientoConDetalles[] | null;
  getMovimientosConDetalles: () => Promise<MovimientoConDetalles[] | null>;
  usuarios: UsuarioDB[] | null;
  getUsuarios: () => Promise<UsuarioDB[] | null>;
  stockItems: StockItem[] | null;
  getStockItems: () => Promise<StockItem[] | null>;
  createProducto: (
    data: Omit<ProductoDB, "id" | "created_at" | "updated_at" | "active">,
  ) => Promise<ServiceResult<ProductoDB>>;
  updateProducto: (
    id: string,
    data: Partial<Omit<ProductoDB, "id" | "created_at" | "updated_at">>,
  ) => Promise<ServiceResult<ProductoDB>>;
  deleteProducto: (id: string) => Promise<ServiceResult<void>>;
  reactivateProducto: (id: string) => Promise<ServiceResult<ProductoDB>>;
  createUnidades: (
    data: Omit<UnidadesDB, "id" | "created_at" | "updated_at" | "active">,
  ) => Promise<ServiceResult<UnidadesDB>>;
  updateUnidades: (
    id: string,
    data: Partial<Omit<UnidadesDB, "id" | "created_at" | "updated_at">>,
  ) => Promise<ServiceResult<UnidadesDB>>;
  createFamilias: (
    data: Omit<FamiliaDB, "id" | "created_at" | "updated_at" | "active">,
  ) => Promise<ServiceResult<FamiliaDB>>;
  updateFamilias: (
    id: string,
    data: Partial<Omit<FamiliaDB, "id" | "created_at" | "updated_at">>,
  ) => Promise<ServiceResult<FamiliaDB>>;
  createCategorias: (
    data: Omit<CategoriaDB, "id" | "created_at" | "updated_at" | "active">,
  ) => Promise<ServiceResult<CategoriaDB>>;
  updateCategorias: (
    id: string,
    data: Partial<Omit<CategoriaDB, "id" | "created_at" | "updated_at">>,
  ) => Promise<ServiceResult<CategoriaDB>>;
  createSubcategorias: (
    data: Omit<SubcategoriaDB, "id" | "created_at" | "updated_at" | "active">,
  ) => Promise<ServiceResult<SubcategoriaDB>>;
  updateSubcategorias: (
    id: string,
    data: Partial<Omit<SubcategoriaDB, "id" | "created_at" | "updated_at">>,
  ) => Promise<ServiceResult<SubcategoriaDB>>;
  deleteFamilias: (id: string) => Promise<ServiceResult<void>>;
  deleteCategorias: (id: string) => Promise<ServiceResult<void>>;
  deleteSubcategorias: (id: string) => Promise<ServiceResult<void>>;
  deleteUnidades: (id: string) => Promise<ServiceResult<void>>;
  reactivateFamilias: (id: string) => Promise<ServiceResult<FamiliaDB>>;
  reactivateCategorias: (id: string) => Promise<ServiceResult<CategoriaDB>>;
  reactivateSubcategorias: (
    id: string,
  ) => Promise<ServiceResult<SubcategoriaDB>>;
  reactivateUnidades: (id: string) => Promise<ServiceResult<UnidadesDB>>;
  createMovimiento: (
    data: Omit<
      MovimientoDB,
      "id" | "created_at" | "updated_at" | "name_product" | "active"
    >,
  ) => Promise<ServiceResult<MovimientoDB>>;
  updateMovimiento: (
    id: string,
    data: Partial<Omit<MovimientoDB, "id" | "created_at" | "updated_at">>,
  ) => Promise<ServiceResult<MovimientoDB>>;
  deleteMovimiento: (id: string) => Promise<ServiceResult<void>>;
  reactivateMovimiento: (id: string) => Promise<ServiceResult<MovimientoDB>>;
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
  /* GETS */
  const fetchAndSetData = async <T,>(
    services: CrudService<T>,
    setData: React.Dispatch<React.SetStateAction<T[] | null>>,
  ) => {
    const { data, error } = await services.read();
    if (error || !data) {
      if (error) {
        console.error("Error fetching data:", error);
      }
      return null;
    }

    setData(data);
    return data;
  };
  const getProductos = async () => {
    const productosData = await fetchAndSetData<ProductoDB>(
      productsServices,
      setProductos,
    );
    return productosData;
  };
  const getUnidades = async () => {
    const unidadesData = await fetchAndSetData<UnidadesDB>(
      unitsServices,
      setUnidades,
    );
    return unidadesData;
  };
  const getFamilias = async () => {
    const familiasData = await fetchAndSetData<FamiliaDB>(
      familiesServices,
      setFamilias,
    );
    return familiasData;
  };
  const getCategorias = async () => {
    const categoriasData = await fetchAndSetData<CategoriaDB>(
      categoriesServices,
      setCategorias,
    );
    return categoriasData;
  };
  const getSubcategorias = async () => {
    const subcategoriasData = await fetchAndSetData<SubcategoriaDB>(
      subcategoriesServices,
      setSubcategorias,
    );
    return subcategoriasData;
  };
  const getMovimientos = async () => {
    const movimientosData = await fetchAndSetData<MovimientoDB>(
      movementsServices,
      setMovimientos,
    );
    return movimientosData;
  };
  const getUsuarios = async () => {
    const usuariosData = await fetchAndSetData<UsuarioDB>(
      userServices,
      setUsuarios,
    );
    return usuariosData;
  };

  /* GETS Anidados */
  const getProductosConDetalles = useCallback(async () => {
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
      console.error(
        "Failed to fetch all necessary data for productos con detalles",
      );
      return null;
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
  }, [productos, unidades, subcategorias, categorias, familias]);
  const getMovimientosConDetalles = useCallback(async () => {
    let movimientosData: MovimientoDB[] | null = movimientos;
    let productosData: ProductoDB[] | null = productos;
    if (!movimientosData) {
      movimientosData = await getMovimientos();
    }
    if (!productosData) {
      productosData = await getProductos();
    }
    if (!movimientosData || !productosData) {
      console.error(
        "Failed to fetch all necessary data for movimientos con detalles",
      );
      return null;
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
    return movimientosConDetallesData;
  }, [movimientos, productos]);
  const getStockItems = useCallback(async () => {
    let productosConDetallesData: ProductoConDetalles[] | null =
      productosConDetalles;
    let movimientosData: MovimientoDB[] | null = movimientos;
    if (!productosConDetallesData) {
      productosConDetallesData = await getProductosConDetalles();
    }
    if (!movimientosData) {
      movimientosData = await getMovimientos();
    }
    if (!productosConDetallesData || !movimientosData) {
      console.error("Failed to fetch all necessary data for stock items");
      return null;
    }
    const stockItemsData: StockItem[] = productosConDetallesData.map(
      (producto) => {
        const movimientosProducto = movimientosData!.filter(
          (m) => m.id_product === producto.id,
        );
        const stock = movimientosProducto.reduce((acc, movimiento) => {
          const qty = movimiento.active ? Number(movimiento.qty) : 0;
          const isIn =
            movimiento.type === "ENTRY" || movimiento.type === "ADJUST_POS";
          return isIn ? acc + qty : acc - qty;
        }, 0);
        return {
          ...producto,
          stock,
          movimientos: movimientosProducto,
        };
      },
    );
    setStockItems(stockItemsData);
    return stockItemsData;
  }, [productosConDetalles, movimientos]);

  /* useEffect */
  useEffect(() => {
    getMovimientosConDetalles();
  }, [movimientos, productos]);
  useEffect(() => {
    getStockItems();
  }, [productosConDetalles, movimientos]);
  useEffect(() => {
    getProductosConDetalles();
  }, [productos, unidades, subcategorias, categorias, familias]);
  /* CREATE */
  const createProducto = async (
    data: Omit<ProductoDB, "id" | "created_at" | "updated_at" | "active">,
  ) => {
    const response = await productsServices.insert(data);
    await getProductos();
    return response;
  };
  const createUnidades = async (
    data: Omit<UnidadesDB, "id" | "created_at" | "updated_at" | "active">,
  ) => {
    const response = await unitsServices.insert(data);
    await getUnidades();
    return response;
  };
  const createFamilias = async (
    data: Omit<FamiliaDB, "id" | "created_at" | "updated_at" | "active">,
  ) => {
    const response = await familiesServices.insert(data);
    await getFamilias();
    return response;
  };
  const createCategorias = async (
    data: Omit<CategoriaDB, "id" | "created_at" | "updated_at" | "active">,
  ) => {
    const response = await categoriesServices.insert(data);
    await getCategorias();
    return response;
  };
  const createSubcategorias = async (
    data: Omit<SubcategoriaDB, "id" | "created_at" | "updated_at" | "active">,
  ) => {
    const response = await subcategoriesServices.insert(data);
    await getSubcategorias();
    return response;
  };
  const createMovimiento = async (
    data: Omit<
      MovimientoDB,
      "id" | "created_at" | "updated_at" | "name_product" | "active"
    >,
  ) => {
    const response = await movementsServices.insert(data);
    await getMovimientos();
    return response;
  };
  /* UPDATE */
  const updateProducto = async (
    id: string,
    data: Partial<Omit<ProductoDB, "id" | "created_at" | "updated_at">>,
  ) => {
    const response = await productsServices.update(id, data);
    await getProductos();
    return response;
  };
  const updateUnidades = async (
    id: string,
    data: Partial<Omit<UnidadesDB, "id" | "created_at" | "updated_at">>,
  ) => {
    const response = await unitsServices.update(id, data);
    await getUnidades();
    return response;
  };
  const updateFamilias = async (
    id: string,
    data: Partial<Omit<FamiliaDB, "id" | "created_at" | "updated_at">>,
  ) => {
    const response = await familiesServices.update(id, data);
    await getFamilias();
    return response;
  };
  const updateCategorias = async (
    id: string,
    data: Partial<Omit<CategoriaDB, "id" | "created_at" | "updated_at">>,
  ) => {
    const response = await categoriesServices.update(id, data);
    await getCategorias();
    return response;
  };
  const updateSubcategorias = async (
    id: string,
    data: Partial<Omit<SubcategoriaDB, "id" | "created_at" | "updated_at">>,
  ) => {
    const response = await subcategoriesServices.update(id, data);
    await getSubcategorias();
    return response;
  };
  const updateMovimiento = async (
    id: string,
    data: Partial<Omit<MovimientoDB, "id" | "created_at" | "updated_at">>,
  ) => {
    const response = await movementsServices.update(id, data);
    await getMovimientos();
    return response;
  };
  /* DELETE (Soft Delete) */
  const deleteProducto = async (id: string) => {
    const response = await productsServices.desactivate(id);
    await getProductos();
    return response;
  };
  const deleteFamilias = async (id: string) => {
    const response = await familiesServices.desactivate(id);
    await getFamilias();
    return response;
  };
  const deleteCategorias = async (id: string) => {
    const response = await categoriesServices.desactivate(id);
    await getCategorias();
    return response;
  };
  const deleteSubcategorias = async (id: string) => {
    const response = await subcategoriesServices.desactivate(id);
    await getSubcategorias();
    return response;
  };
  const deleteUnidades = async (id: string) => {
    const response = await unitsServices.desactivate(id);
    await getUnidades();
    return response;
  };
  const deleteMovimiento = async (id: string) => {
    const response = await movementsServices.desactivate(id);
    await getMovimientos();
    return response;
  };
  /* REACTIVATE */
  const reactivateProducto = async (id: string) => {
    const response = await productsServices.update(id, { active: true });
    await getProductos();
    return response;
  };
  const reactivateFamilias = async (id: string) => {
    const response = await familiesServices.update(id, { active: true });
    await getFamilias();
    return response;
  };
  const reactivateCategorias = async (id: string) => {
    const response = await categoriesServices.update(id, { active: true });
    await getCategorias();
    return response;
  };
  const reactivateSubcategorias = async (id: string) => {
    const response = await subcategoriesServices.update(id, { active: true });
    await getSubcategorias();
    return response;
  };
  const reactivateUnidades = async (id: string) => {
    const response = await unitsServices.update(id, { active: true });
    await getUnidades();
    return response;
  };
  const reactivateMovimiento = async (id: string) => {
    const response = await movementsServices.update(id, { active: true });
    await getMovimientos()
    return response;
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
        productosConDetalles,
        movimientosConDetalles,
        getSubcategorias,
        getCategorias,
        getFamilias,
        getProductos,
        getProductosConDetalles,
        getUnidades,
        getMovimientosConDetalles,
        getUsuarios,
        getStockItems,
        createProducto,
        updateProducto,
        deleteProducto,
        reactivateProducto,
        createUnidades,
        updateUnidades,
        createFamilias,
        updateFamilias,
        createCategorias,
        updateCategorias,
        createSubcategorias,
        updateSubcategorias,
        deleteFamilias,
        deleteCategorias,
        deleteSubcategorias,
        deleteUnidades,
        reactivateFamilias,
        reactivateCategorias,
        reactivateSubcategorias,
        reactivateUnidades,
        createMovimiento,
        updateMovimiento,
        deleteMovimiento,
        reactivateMovimiento,
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
