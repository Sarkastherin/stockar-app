import type { Route } from "../+types/home";
import Table from "~/components/Table";
import type { PaginationMeta } from "~/services/crudFactory";
import type { StockListItem } from "~/types/productos";
import type { TableColumn } from "react-data-table-component";
import { Spinner } from "flowbite-react";
import { SubTitles } from "~/components/SubTitles";
import { useModal } from "~/context/ModalContext";
import { AjusteStockModal } from "~/components/modals/customs/AjusteStockModal";
import { useMovimientos } from "~/hooks/useMovimientos";
import { AiOutlineStock } from "react-icons/ai";
import { useConfigItemsProd } from "~/hooks/useConfigItemsProd";
import { commonProps } from "~/types/commonsTypes";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useStockServices } from "~/services/useCrud";
import type { MovimientoDB } from "~/types/movimientos";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Stock" },
    { name: "description", content: "Gestión de Stock" },
  ];
}
const STOCK_PER_PAGE = 15;

const columns: TableColumn<StockListItem>[] = [
  { name: "Nombre", selector: (row) => row.name, sortable: true },
  {
    name: "Subcategoria",
    selector: (row) => row.name_subcategory,
    sortable: true,
  },
  { name: "Categoria", selector: (row) => row.name_category, sortable: true },

  { name: "Familia", selector: (row) => row.name_family, sortable: true },
  { name: "Unidad", selector: (row) => row.name_unit, sortable: true },
  {
    name: "Stock",
    selector: (row) => Number(row.stock).toFixed(2),
    sortable: true,
    width: "120px",
    right: true,
  },
];

export default function Stock() {
  const { openModal } = useModal();
  const stockServices = useStockServices();
  const {
    categoriasOptions,
    subcategoriaOptions,
    familiasOptions,
    unidadesOptions,
    ubicaciones,
  } = useConfigItemsProd();
  const locationOptions = useMemo(
    () =>
      (ubicaciones ?? [])
        .filter((u) => u.active)
        .map((u) => ({ value: u.id, label: u.name })),
    [ubicaciones],
  );
  const { form, onCreate } = useMovimientos();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(STOCK_PER_PAGE);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [stockPage, setStockPage] = useState<StockListItem[] | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadStockPage = useCallback(async () => {
    setIsLoading(true);
    const offset = (currentPage - 1) * rowsPerPage;
    const result = await stockServices.read({
      limit: rowsPerPage,
      offset,
      query: filters,
    });

    if (result.error) {
      console.error("Error paginating stock:", result.error);
      setStockPage([]);
      setPagination(null);
      setIsLoading(false);
      return;
    }

    setStockPage(result.data ?? []);
    setPagination(result.pagination);
    setIsLoading(false);
  }, [currentPage, rowsPerPage, filters, stockServices]);

  const handleServerFilterChange = useCallback(
    (nextFilters: Record<string, string>) => {
      setCurrentPage((prevPage) => (prevPage === 1 ? prevPage : 1));
      setFilters((prevFilters) => {
        const prevSerialized = JSON.stringify(prevFilters);
        const nextSerialized = JSON.stringify(nextFilters);
        return prevSerialized === nextSerialized ? prevFilters : nextFilters;
      });
    },
    [],
  );

  const serverPagination = useMemo(
    () => ({
      totalRows: pagination?.total ?? stockPage?.length ?? 0,
      currentPage,
      rowsPerPage: pagination?.limit ?? rowsPerPage,
      onPageChange: setCurrentPage,
      onRowsPerPageChange: (newSize: number) => {
        setRowsPerPage(newSize);
        setCurrentPage(1);
      },
    }),
    [pagination?.total, pagination?.limit, stockPage?.length, currentPage, rowsPerPage],
  );

  const serverFiltering = useMemo(
    () => ({
      onFilterChange: handleServerFilterChange,
    }),
    [handleServerFilterChange],
  );

  useEffect(() => {
    void loadStockPage();
  }, [loadStockPage]);

  async function handleCreateAdjustment(data: MovimientoDB) {
    await onCreate(data);
    await loadStockPage();
  }

  const fetchAllStockForExport = useCallback(async () => {
    const pageSize = 100;
    const all: StockListItem[] = [];
    let offset = 0;

    while (true) {
      const result = await stockServices.read({
        limit: pageSize,
        offset,
        query: filters,
      });
      if (result.error || !result.data?.length) break;
      all.push(...result.data);
      if (!result.pagination?.hasNextPage) break;
      offset += pageSize;
    }

    return all;
  }, [filters, stockServices]);

  function handleRowClick(row: StockListItem) {
    // Crear un nuevo formulario para este producto
    const newForm = form;
    newForm.reset({
      ...commonProps,
      type: "",
      id_product: row.id,
      product_name: row.name,
      qty: row.stock,
      note: "",
      reference: "",
      id_origin: "",
      id_destination: "",
    });
    openModal("form", {
      component: AjusteStockModal,
      props: {
        form: newForm,
        title: "Ajustar stock de: " + row.name,
        stockActual: row.stock,
        locationOptions,
      },
      onSubmit: form.handleSubmit(handleCreateAdjustment),
    });
  }

  const isInitialLoading = isLoading && !stockPage;
  const tableData = stockPage ?? [];

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
        title="Stock"
        back_path="/"
        icon={{
          component: AiOutlineStock,
          color: "text-cyan-600 dark:text-cyan-400",
        }}
      />
      <Table
        columns={columns}
        data={tableData}
        inactiveField="active"
        onRowClick={handleRowClick}
        scrollHeightOffset={415}
        serverPagination={serverPagination}
        serverFiltering={serverFiltering}
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
          {
            key: "has_stock",
            label: "Disponibilidad",
            type: "select",
            options: [
              { value: "true", label: "Con stock" },
              { value: "false", label: "Sin stock" },
            ],
            emptyOption: "Todas",
          },
        ]}
        btnExport={{
          filename: "stock",
          fetchAllData: fetchAllStockForExport,
          headers: [
            { label: "Nombre", key: "name", type: "text" },
            { label: "Subcategoria", key: "name_subcategory", type: "text" },
            { label: "Categoria", key: "name_category", type: "text" },
            { label: "Familia", key: "name_family", type: "text" },
            { label: "Unidad", key: "name_unit", type: "text" },
            { label: "Stock", key: "stock", type: "number" },
          ],
        }}
      />
    </div>
  );
}
