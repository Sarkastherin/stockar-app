import type { Route } from "../+types/home";
import Table from "~/components/Table";
import type { PaginationMeta } from "~/services/crudFactory";
import type { TableColumn } from "react-data-table-component";
import { useDataContext } from "~/context/DataContext";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Spinner } from "flowbite-react";
import { SubTitles } from "~/components/SubTitles";
import { LuArrowUpDown } from "react-icons/lu";
import { useModal } from "~/context/ModalContext";
import { MovimientoModal } from "~/components/modals/customs/ShowMovimientoModal";
import { useMovimientos } from "~/hooks/useMovimientos";
import { tiposMovimiento, type MovimientoDB } from "~/types/movimientos";
import { Badge } from "flowbite-react";
import { useMovementsServices } from "~/services/useCrud";
import { useNavigate } from "react-router";

const MOVEMENTS_PER_PAGE = 15;
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Movimientos" },
    { name: "description", content: "Gestión de movimientos de productos" },
  ];
}
const columns: TableColumn<MovimientoDB>[] = [
  {
    name: "Fecha",
    selector: (row) =>
      new Date(row.created_at).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    sortable: true,
    width: "180px",
  },
  { name: "Nombre", selector: (row) => row.product_name || "-", sortable: true },
  {
    name: "Tipo",
    cell: (row) => (
      <Badge
        color={
          tiposMovimiento.find((tipo) => tipo.value === row.type)?.type ||
          "gray"
        }
      >
        {tiposMovimiento.find((tipo) => tipo.value === row.type)?.label || "-"}
      </Badge>
    ),
    sortable: true,
    width: "150px",
  },
  {
    name: "Cantidad",
    selector: (row) => row.qty,
    sortable: true,
    width: "120px",
  },
  {
    name: "Nota",
    selector: (row) => row.note || "-",
    sortable: false,
    width: "200px",
  },
  {
    name: "Referencia",
    selector: (row) => row.reference || "-",
    sortable: false,
    width: "200px",
  },
  {
    name: "Estado",
    selector: (row) => (row.voided_at ? "Anulado" : "Activo"),
    sortable: true,
    width: "120px",
  },
];

export default function Movimientos() {
  const navigate = useNavigate();
  const { openModal } = useModal();
  const movementsServices = useMovementsServices();

  const { form, onUpdate, onDelete, onReactivate } = useMovimientos();
  const { productos, getProductos } = useDataContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [movimientosPage, setMovimientosPage] = useState<MovimientoDB[] | null>(
    null,
  );
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const productosOptions = useMemo(
    () =>
      (productos ?? []).map((producto) => ({
        value: producto.id,
        label: producto.name,
      })),
    [productos],
  );

  useEffect(() => {
    if (!productos) {
      getProductos();
    }
  }, [productos, getProductos]);

  const loadMovimientosPage = useCallback(async () => {
    setIsLoading(true);
    const offset = (currentPage - 1) * MOVEMENTS_PER_PAGE;
    const result = await movementsServices.read({
      limit: MOVEMENTS_PER_PAGE,
      offset,
      query: filters,
    });

    if (result.error) {
      console.error("Error paginating movements:", result.error);
      setMovimientosPage([]);
      setPagination(null);
      setIsLoading(false);
      return;
    }

    setMovimientosPage(result.data ?? []);
    setPagination(result.pagination);
    setIsLoading(false);
  }, [currentPage, filters, movementsServices]);

  useEffect(() => {
    loadMovimientosPage();
  }, [loadMovimientosPage]);

  const handleUpdate = async (data: MovimientoDB) => {
    await onUpdate(data);
    await loadMovimientosPage();
  };

  const handleDelete = async (id: string) => {
    await onDelete(id);
    await loadMovimientosPage();
  };

  const handleReactivate = async (id: string) => {
    await onReactivate(id);
    await loadMovimientosPage();
  };

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
      totalRows: pagination?.total ?? movimientosPage?.length ?? 0,
      currentPage,
      rowsPerPage: pagination?.limit ?? MOVEMENTS_PER_PAGE,
      onPageChange: setCurrentPage,
    }),
    [
      pagination?.total,
      pagination?.limit,
      movimientosPage?.length,
      currentPage,
    ],
  );

  const serverFiltering = useMemo(
    () => ({
      onFilterChange: handleServerFilterChange,
    }),
    [handleServerFilterChange],
  );

  function handleRowClick(row: MovimientoDB) {
    const newForm = form;
    newForm.reset(row);
    openModal("form", {
      component: MovimientoModal,
      props: {
        form: newForm,
        title: "Consultar movimiento: " + row.product_name,
        onDelete: () => handleDelete(row.id),
        onReactivate: () => handleReactivate(row.id),
      },
      onSubmit: form.handleSubmit(handleUpdate),
    });
  }
  const isInitialLoading = isLoading && !movimientosPage;
  const tableData = movimientosPage ?? [];

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner aria-label="Cargando movimientos..." />
      </div>
    );
  }
  return (
    <div>
      <SubTitles
        title="Movimientos"
        back_path="/"
        icon={{
          component: LuArrowUpDown,
          color: "text-cyan-600 dark:text-cyan-400",
        }}
      />
      <Table
        columns={columns}
        data={tableData}
        onRowClick={handleRowClick}
        inactiveField="active"
        btnOnClick={{
          title: "Nuevo movimiento",
          onClick: () => navigate("/movimientos/nuevo"),
          color: "indigo",
        }}
        serverPagination={serverPagination}
        serverFiltering={serverFiltering}
        scrollHeightOffset={410}
        filterFields={[
          {
            key: "id_product",
            label: "Producto",
            type: "select",
            options: productosOptions,
            emptyOption: "Todos",
          },
          {
            key: "type",
            label: "Tipo",
            type: "select",
            options: tiposMovimiento.map((tipo) => ({
              label: tipo.label,
              value: tipo.value,
            })),
            emptyOption: "Todos",
          },
          { key: "created_at", label: "Fecha", type: "dateRange" },
        ]}
      />
    </div>
  );
}
