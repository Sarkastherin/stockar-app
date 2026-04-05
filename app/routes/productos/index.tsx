import type { Route } from "../+types/home";
import Table from "~/components/Table";
import type { PaginationMeta } from "~/services/crudFactory";
import type { ProductoConDetalles, ProductoDB } from "~/types/productos";
import type { TableColumn } from "react-data-table-component";
import { useMemo, useEffect, useState, useCallback } from "react";
import { Spinner } from "flowbite-react";
import { SubTitles } from "~/components/SubTitles";
import { AiOutlineProduct } from "react-icons/ai";
import { useModal } from "~/context/ModalContext";
import { ProductosModal } from "~/components/modals/customs/ProductosModal";
import { useProductos } from "~/hooks/useProductos";
import { useConfigItemsProd } from "~/hooks/useConfigItemsProd";
import { useProductsServices } from "~/services/useCrud";

const PRODUCTS_PER_PAGE = 15;
export function meta({}: Route.MetaArgs) {
  return [
    { title: "StockAR" },
    { name: "description", content: "Welcome to StockAR!" },
  ];
}
const columns: TableColumn<ProductoConDetalles>[] = [
  { name: "Nombre", selector: (row) => row.name, sortable: true },
  {
    name: "Subcategoria",
    selector: (row) => row.name_subcategory,
    sortable: true,
    width: "200px",
  },
  {
    name: "Categoria",
    selector: (row) => row.name_category,
    sortable: true,
    width: "200px",
  },

  {
    name: "Familia",
    selector: (row) => row.name_family,
    sortable: true,
    width: "200px",
  },
  {
    name: "Unidad",
    selector: (row) => row.name_unit,
    sortable: true,
    width: "200px",
  },
  {
    name: "Estado",
    selector: (row) => row.active,
    sortable: true,
    width: "120px",
  },
];

export default function Productos() {
  const { openModal } = useModal();
  const productsServices = useProductsServices();
  const {
    subcategorias,
    categorias,
    familias,
    unidades,
    categoriasOptions,
    subcategoriaOptions,
    familiasOptions,
    unidadesOptions,
  } = useConfigItemsProd();
  const { form, onCreate, onUpdate, onDelete, onReactivate } = useProductos();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(PRODUCTS_PER_PAGE);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [productosPage, setProductosPage] = useState<ProductoDB[] | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProductosPage = useCallback(async () => {
    setIsLoading(true);
    const offset = (currentPage - 1) * rowsPerPage;
    const result = await productsServices.read({
      limit: rowsPerPage,
      offset,
      query: filters,
    });

    if (result.error) {
      console.error("Error paginating products:", result.error);
      setProductosPage([]);
      setPagination(null);
      setIsLoading(false);
      return;
    }

    setProductosPage(result.data ?? []);
    setPagination(result.pagination);
    setIsLoading(false);
  }, [currentPage, rowsPerPage, filters, productsServices]);

  useEffect(() => {
    loadProductosPage();
  }, [loadProductosPage]);

  const productosConDetalles = useMemo(() => {
    if (!productosPage || !subcategorias || !categorias || !familias || !unidades) {
      return null;
    }

    return productosPage
      .map((producto) => {
        const unit = unidades.find((u) => u.id === producto.id_unit);
        const subcategory = subcategorias.find(
          (s) => s.id === producto.id_subcategory,
        );
        const category = subcategory
          ? categorias.find((c) => c.id === subcategory.id_category)
          : undefined;
        const family = category
          ? familias.find((f) => f.id === category.id_family)
          : undefined;

        if (!unit || !subcategory || !category || !family) {
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
      .filter((producto): producto is ProductoConDetalles => producto !== null);
  }, [productosPage, subcategorias, categorias, familias, unidades]);

  const handleCreate = async (data: ProductoConDetalles) => {
    await onCreate(data);
    await loadProductosPage();
  };

  const handleUpdate = async (data: ProductoConDetalles) => {
    await onUpdate(data);
    await loadProductosPage();
  };

  const handleDelete = async (id: string) => {
    await onDelete(id);
    await loadProductosPage();
  };

  const handleReactivate = async (id: string) => {
    await onReactivate(id);
    await loadProductosPage();
  };

  const handleServerFilterChange = useCallback((nextFilters: Record<string, string>) => {
    setCurrentPage((prevPage) => (prevPage === 1 ? prevPage : 1));
    setFilters((prevFilters) => {
      const prevSerialized = JSON.stringify(prevFilters);
      const nextSerialized = JSON.stringify(nextFilters);
      return prevSerialized === nextSerialized ? prevFilters : nextFilters;
    });
  }, []);

  const serverPagination = useMemo(
    () => ({
      totalRows: pagination?.total ?? productosConDetalles?.length ?? 0,
      currentPage,
      rowsPerPage: pagination?.limit ?? rowsPerPage,
      onPageChange: setCurrentPage,
      onRowsPerPageChange: (newSize: number) => {
        setRowsPerPage(newSize);
        setCurrentPage(1);
      },
    }),
    [pagination?.total, pagination?.limit, productosConDetalles?.length, currentPage, rowsPerPage],
  );

  const serverFiltering = useMemo(
    () => ({
      onFilterChange: handleServerFilterChange,
    }),
    [handleServerFilterChange],
  );

  function handleRowClick(row: ProductoConDetalles) {
    const newForm = form;
    newForm.reset(row);
    openModal("form", {
      component: ProductosModal,
      props: {
        form: newForm,
        title: "Editar producto: " + row.name,
        onDelete: () => handleDelete(row.id),
        onReactivate: () => handleReactivate(row.id),
      },
      onSubmit: form.handleSubmit(handleUpdate),
    });
  }
  function handleNewProduct() {
    const newForm = form;
    newForm.reset({
      name: "",
      id_subcategory: "",
      name_family: "",
      name_category: "",
      name_unit: "",
      created_at: "",
      updated_at: "",
      id: "",
      active: true,
      created_by: "",
      updated_by: "",
    });
    newForm.clearErrors();
    openModal("form", {
      component: ProductosModal,
      props: {
        form: newForm,
        title: "Nuevo producto",
      },
      onSubmit: form.handleSubmit(handleCreate),
    });
  }
  const isInitialLoading =
    !subcategorias ||
    !categorias ||
    !familias ||
    !unidades ||
    (isLoading && !productosConDetalles);
  const tableData = productosConDetalles ?? [];

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner aria-label="Cargando productos..." />
      </div>
    );
  }
  return (
    <div>
      <SubTitles
        title="Productos"
        back_path="/"
        icon={{
          component: AiOutlineProduct,
          color: "text-blue-600 dark:text-blue-400",
        }}
      />
      <Table
        columns={columns}
        data={tableData}
        inactiveField="active"
        onRowClick={handleRowClick}
        btnOnClick={{
          title: "Nuevo producto",
          onClick: handleNewProduct,
          color: "indigo",
        }}
        serverPagination={serverPagination}
        serverFiltering={serverFiltering}
        scrollHeightOffset={410}
        filterFields={[
          { key: "name", label: "Producto" },
          {
            key: "id_subcategory",
            label: "Subcategoria",
            type: "select",
            options: subcategoriaOptions,
            emptyOption: "Todas",
          },
          {
            key: "id_category",
            label: "Categoria",
            type: "select",
            options: categoriasOptions,
            emptyOption: "Todas",
          },
          {
            key: "id_family",
            label: "Familia",
            type: "select",
            options: familiasOptions,
            emptyOption: "Todas",
          },
          {
            key: "id_unit",
            label: "Unidad",
            type: "select",
            options: unidadesOptions,
            emptyOption: "Todas",
          },
        ]}
      />
    </div>
  );
}
