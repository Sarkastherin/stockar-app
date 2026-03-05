import React, { useState, useEffect, useMemo, type JSX } from "react";
import DataTable, {
  createTheme,
  type TableColumn,
} from "react-data-table-component";
import { useLocation } from "react-router";
import { Button, useThemeMode } from "flowbite-react";
import { NavLink } from "react-router";
import { Input, Select } from "./forms/InputsForm";
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, part) => acc?.[part], obj);
}
const getCustomStyles = (isDark: boolean) => ({
  table: {
    style: {
      backgroundColor: "transparent",
    },
  },
  headRow: {
    style: {
      backgroundColor: isDark ? "#1f2937" : "#f9fafb",
      borderBottomColor: isDark ? "#374151" : "#e5e7eb",
      borderBottomWidth: "1px",
      minHeight: "44px",
    },
  },
  headCells: {
    style: {
      fontWeight: 600,
      fontSize: "12px",
      textTransform: "uppercase" as const,
      letterSpacing: "0.02em",
      color: isDark ? "#d1d5db" : "#6b7280",
      paddingTop: "12px",
      paddingBottom: "12px",
    },
  },
  rows: {
    style: {
      backgroundColor: isDark ? "#111827" : "#ffffff",
      color: isDark ? "#f3f4f6" : "#111827",
      borderBottomColor: isDark ? "#374151" : "#e5e7eb",
      borderBottomWidth: "1px",
      minHeight: "52px",
    },
    highlightOnHoverStyle: {
      backgroundColor: isDark ? "#1f2937" : "#f3f4f6",
      transitionDuration: "0.15s",
      transitionProperty: "background-color",
      outlineStyle: "none" as const,
    },
  },
  cells: {
    style: {
      fontSize: "14px",
      color: isDark ? "#f3f4f6" : "#111827",
      paddingTop: "12px",
      paddingBottom: "12px",
    },
  },
  pagination: {
    style: {
      backgroundColor: isDark ? "#111827" : "#ffffff",
      color: isDark ? "#d1d5db" : "#374151",
      borderTopColor: isDark ? "#374151" : "#e5e7eb",
      borderTopWidth: "1px",
      minHeight: "52px",
    },
    pageButtonsStyle: {
      borderRadius: "6px",
      color: isDark ? "#f9fafb" : "#374151",
      fill: isDark ? "#f9fafb" : "#374151",
      opacity: 1,
      backgroundColor: "transparent",
      "&:hover:not(:disabled)": {
        backgroundColor: isDark ? "#374151" : "#f3f4f6",
        color: isDark ? "#ffffff" : "#111827",
        fill: isDark ? "#ffffff" : "#111827",
      },
      "&:focus": {
        outline: "none",
      },
      "&:disabled": {
        color: isDark ? "#6b7280" : "#9ca3af",
        fill: isDark ? "#6b7280" : "#9ca3af",
        opacity: 0.8,
      },
    },
  },
});
createTheme("flowbite-dark", {
  background: {
    default: "transparent",
  },
});
createTheme("flowbite-light", {
  background: {
    default: "transparent",
  },
});
export type FilterField = {
  key: string;
  label: string;
  type?: "text" | "select" | "dateRange";
  options?: { value: string; label: string; disabled?: boolean }[];
  manualFilter?: boolean; // Si es true, requiere clic en botón Filtrar. Por defecto filtra automáticamente
};

type TableProps<T> = {
  data: T[];
  columns: TableColumn<T>[];
  filterFields?: FilterField[];
  onRowClick?: (row: T) => void;
  onFilteredChange?: (filtered: T[]) => void;
  noDataComponent?: JSX.Element;
  inactiveField?: string; // Campo para identificar elementos inactivos (ej: "activo")
  alternativeStorageKey?: string; // Clave alternativa para almacenamiento local
  disableRowClick?: boolean; // Deshabilita el click en filas y el cursor pointer
  btnExport?: boolean;
  btnNavigate?: {
    route: string;
    title: string;
  };
  btnOnClick?: {
    onClick: () => void;
    title: string;
    color?: "default" | "primary" | "success" | "cyan" | "indigo";
  };
  scrollHeightOffset?: number; // Offset para calcular la altura del scroll (ej: altura de header, footer, etc.)
};
type CurrentSort = {
  columnId: string | number | undefined;
  direction: "asc" | "desc";
};
const options = {
  rowsPerPageText: "Filas por página",
  rangeSeparatorText: "de",
};
export default function Table<T>({
  data,
  columns,
  filterFields = [],
  onRowClick,
  onFilteredChange,
  noDataComponent,
  inactiveField,
  alternativeStorageKey,
  disableRowClick = false,
  btnExport,
  btnNavigate,
  btnOnClick,
  scrollHeightOffset,
}: TableProps<T>) {
  const location = useLocation();
  const { computedMode } = useThemeMode();
  const isDarkMode = computedMode === "dark";
  const tableTheme = isDarkMode ? "flowbite-dark" : "flowbite-light";
  const customStyles = useMemo(() => getCustomStyles(isDarkMode), [isDarkMode]);
  const storageKey =
    alternativeStorageKey || `tableFilters_${location.pathname}`;

  // Función para crear un componente de estado con colores
  const StatusCell = ({
    row,
    originalSelector,
  }: {
    row: T;
    originalSelector: (row: T) => any;
  }) => {
    const status = originalSelector(row);
    const isActive = status === "Activo" || status === "Sí" || status === true;

    return (
      <span
        className={`font-medium text-xs px-2 py-1 rounded-full ${
          isActive
            ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30"
            : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
        }`}
      >
        {typeof status === "boolean"
          ? status
            ? "Activo"
            : "Inactivo"
          : status}
      </span>
    );
  };

  // Procesar columnas para aplicar formato especial a columnas de estado
  const processedColumns = columns.map((column) => {
    // Detectar si es una columna de estado por el nombre
    if (
      (column.name === "Activo" ||
        column.name === "Estado" ||
        column.name === "Status") &&
      column.selector
    ) {
      return {
        ...column,
        cell: (row: T) => (
          <StatusCell row={row} originalSelector={column.selector!} />
        ),
      };
    }
    return column;
  });

  const [filters, setFilters] = useState<Record<string, string>>(() => {
    // Recupera filtros guardados
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : {};
  });
  const [filteredData, setFilteredData] = useState<T[]>(data);
  const [showFilterInfo, setShowFilterInfo] = useState(false);

  // Estado para la página actual
  const [currentPage, setCurrentPage] = useState<number>(() => {
    // Recupera la página guardada
    const savedPage = localStorage.getItem(`${storageKey}_page`);
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  // Estado para el orden actual
  const [currentSort, setCurrentSort] = useState<CurrentSort>(() => {
    // Recupera el orden guardado
    const savedSort = localStorage.getItem(`${storageKey}_sort`);
    return savedSort
      ? JSON.parse(savedSort)
      : { columnId: null, direction: "asc" };
  });

  // Función para determinar si una fila está inactiva
  const isRowInactive = (row: T): boolean => {
    if (!inactiveField) return false;
    const value = getNestedValue(row, inactiveField);
    // Si el campo es booleano, verificamos que sea false
    // Si es string, verificamos valores como "No", "Inactivo", etc.
    return (
      value === false ||
      value === "No" ||
      value === "Inactivo" ||
      value === "no" ||
      value === "false"
    );
  };

  function removeAccents(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  const onFilter = (newFilters: Record<string, string>) => {
    const result = data.filter((item) =>
      filterFields.every(({ key, type }) => {
        if (type === "dateRange") {
          const from = newFilters[`${key}_from`];
          const to = newFilters[`${key}_to`];
          const itemValue = getNestedValue(item, key);

          if (!itemValue) return false;

          const itemDate = new Date(itemValue).getTime();
          const fromDate = from ? new Date(from).getTime() : null;
          const toDate = to ? new Date(to).getTime() : null;

          return (
            (!fromDate || itemDate >= fromDate) &&
            (!toDate || itemDate <= toDate)
          );
        } else {
          const value = removeAccents(newFilters[key]?.toLowerCase() ?? "");
          const itemValue = removeAccents(
            String(getNestedValue(item, key) ?? "").toLowerCase(),
          );
          return itemValue.includes(value);
        }
      }),
    );
    setFilteredData(result);
    setShowFilterInfo(Object.values(newFilters).some((v) => v));
    if (onFilteredChange) onFilteredChange(result);
  };

  const handleChange = (key: string, value: string, manual?: boolean) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated)); // Guarda filtros

    // Resetear a la primera página cuando se aplican filtros
    setCurrentPage(1);
    localStorage.setItem(`${storageKey}_page`, "1");

    // Si NO es manual (por defecto es automático), aplicar filtro inmediatamente
    if (!manual) onFilter(updated);
  };

  // Función para manejar el cambio de página
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    localStorage.setItem(`${storageKey}_page`, page.toString());
  };
  const handleSortChange = (
    column: TableColumn<T>,
    direction: "asc" | "desc",
  ) => {
    setCurrentSort({ columnId: column.id, direction });
    localStorage.setItem(
      `${storageKey}_sort`,
      JSON.stringify({ columnId: column.id, direction }),
    );
  };
  useEffect(() => {
    setFilteredData(data);
    setShowFilterInfo(Object.values(filters).some((v) => v));
    if (onFilteredChange) onFilteredChange(data);
  }, [data]);
  useEffect(() => {
    // Aplica filtros guardados al montar si existen
    if (Object.values(filters).some((v) => v)) {
      onFilter(filters);
    } else {
      setFilteredData(data);
      if (onFilteredChange) onFilteredChange(data);
    }
    setShowFilterInfo(Object.values(filters).some((v) => v));
  }, [data]); // Ejecuta cuando cambia la data
  useEffect(() => {
    const isFilter = Object.values(filters).some((v) => v);
    if (isFilter) {
      confirm(
        "Hay filtros aplicados desde tu última visita. ¿Deseas limpiar los filtros?",
      )
        ? (function () {
            setFilters({});
            setFilteredData(data);
            localStorage.removeItem(storageKey);
            localStorage.removeItem(`${storageKey}_page`);
            setShowFilterInfo(false);
          })()
        : null;
    }
  }, []);

  return (
    <>
      {showFilterInfo && filterFields.length > 0 && (
        <div className="flex justify-between text-sm font-semibold">
          <div className="text-blue-600 dark:text-blue-400 ">
            ℹ️ Filtros aplicados.
          </div>
          <div className="bg-zinc-300/50 dark:bg-zinc-700/50 text-zinc-700 dark:text-zinc-300 px-2 rounded">
            Registros encontrados: {filteredData.length}
          </div>
        </div>
      )}
      {filterFields.length > 0 && (
        <form
          className="flex gap-2 md:flex-row flex-col mb-6"
          onSubmit={(e) => {
            e.preventDefault();
            onFilter(filters);
          }}
        >
          {filterFields.map(
            ({ key, label, type = "text", options, manualFilter }) => (
              <div key={key} className="w-full">
                {type === "dateRange" ? (
                  <div className="flex gap-2 items-center">
                    <Input
                      label={`${label} desde`}
                      id={`${key}_from`}
                      type="date"
                      value={filters[`${key}_from`] ?? ""}
                      onChange={(e) =>
                        handleChange(
                          `${key}_from`,
                          e.target.value,
                          manualFilter,
                        )
                      }
                    />
                    <Input
                      label={`${label} hasta`}
                      id={`${key}_to`}
                      type="date"
                      value={filters[`${key}_to`] ?? ""}
                      onChange={(e) =>
                        handleChange(`${key}_to`, e.target.value, manualFilter)
                      }
                    />
                  </div>
                ) : type === "select" ? (
                  <>
                    <Select
                      label={label}
                      id={key}
                      value={filters[key] ?? ""}
                      onChange={(e) =>
                        handleChange(key, e.target.value, manualFilter)
                      }
                      options={
                        options?.map((op) => ({
                          value: op.value,
                          label: op.label,
                        })) || []
                      }
                    />
                  </>
                ) : (
                  <Input
                    label={label}
                    id={key}
                    type="search"
                    value={filters[key] ?? ""}
                    onChange={(e) =>
                      handleChange(key, e.target.value, manualFilter)
                    }
                  />
                )}
              </div>
            ),
          )}
          {filterFields.some((f) => f.manualFilter) && (
            <Button color="yellow" type="submit">
              Filtrar
            </Button>
          )}
        </form>
      )}
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <DataTable
          columns={processedColumns}
          data={filteredData}
          customStyles={customStyles}
          theme={tableTheme}
          pagination
          paginationPerPage={15}
          paginationDefaultPage={currentPage}
          onChangePage={handlePageChange}
          onRowClicked={!disableRowClick ? onRowClick : undefined}
          pointerOnHover={!disableRowClick}
          highlightOnHover
          paginationComponentOptions={options}
          onSort={handleSortChange}
          defaultSortFieldId={currentSort.columnId}
          defaultSortAsc={currentSort.direction === "asc"}
          fixedHeader
          {...(scrollHeightOffset && {
            fixedHeaderScrollHeight: `calc(100vh - ${scrollHeightOffset}px)`,
          })}
          noDataComponent={
            noDataComponent || (
              <div className="py-6 text-gray-500 dark:text-gray-400">
                No se encontraron registros
              </div>
            )
          }
        />
      </div>
      {(btnExport || btnNavigate || btnOnClick) && (
        <span className="fixed bottom-0 left-0 w-full">
          <div
            className={`flex justify-between w-full  py-5 px-8 hover:bg-gray-200 hover:dark:bg-gray-950`}
          >
            {btnExport && <Button color={"green"}>Exportar CSV</Button>}

            {btnNavigate && (
              <NavLink to={btnNavigate.route}>
                <Button color={"indigo"}>{btnNavigate.title}</Button>
              </NavLink>
            )}
            {btnOnClick && (
              <Button
                size="sm"
                className="ms-auto"
                color={btnOnClick.color || "default"}
                onClick={btnOnClick.onClick}
              >
                {btnOnClick.title}
              </Button>
            )}
          </div>
        </span>
      )}
    </>
  );
}
