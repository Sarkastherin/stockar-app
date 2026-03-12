import type { Route } from "../+types/home";
import Table from "~/components/Table";
import type { StockItem } from "~/types/productos";
import type { TableColumn } from "react-data-table-component";
import { useDataContext } from "~/context/DataContext";
import { useEffect } from "react";
import { Badge, Spinner } from "flowbite-react";
import { SubTitles } from "~/components/SubTitles";
import { useModal } from "~/context/ModalContext";
import { AjusteStockModal } from "~/components/modals/customs/AjusteStockModal";
import { useMovimientos } from "~/hooks/useMovimientos";
import { AiOutlineStock } from "react-icons/ai";
import { tiposMovimiento } from "~/types/movimientos";
import { useConfigItemsProd } from "~/hooks/useConfigItemsProd";
import { commonProps } from "~/types/commonsTypes";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Stock" },
    { name: "description", content: "Gestión de Stock" },
  ];
}
const columns: TableColumn<StockItem>[] = [
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
  const {
    categoriasOptions,
    subcategoriaOptions,
    familiasOptions,
    unidadesOptions,
  } = useConfigItemsProd();
  const { form, onCreate } = useMovimientos();
  const { stockItems, getStockItems } = useDataContext();
  useEffect(() => {
    if (!stockItems) getStockItems();
  }, [stockItems, getStockItems]);
  function handleRowClick(row: StockItem) {
    // Crear un nuevo formulario para este producto
    const newForm = form;
    newForm.reset({
      ...commonProps,
      type: "",
      id_product: row.id,
      name_product: row.name,
      qty: row.stock,
      note: "",
      reference: "",
    });
    openModal("form", {
      component: AjusteStockModal,
      props: {
        form: newForm,
        title: "Ajustar stock de: " + row.name,
        stockActual: row.stock,
      },
      onSubmit: form.handleSubmit(onCreate),
    });
  }
  const ExpandableComponent = ({ data }: { data: StockItem }) => {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200">
            Movimientos
          </h4>
          <Badge color="gray">{data.movimientos.length}</Badge>
        </div>
        {data.movimientos.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No hay movimientos para este producto.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="p-2.5 font-semibold">Fecha</th>
                  <th className="p-2.5 font-semibold">Tipo</th>
                  <th className="p-2.5 font-semibold">Referencia</th>
                  <th className="p-2.5 font-semibold">Nota</th>
                  <th className="p-2.5 font-semibold text-right">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {data.movimientos.map((movimiento, index) => {
                  const tipo = tiposMovimiento.find(
                    (item) => item.value === movimiento.type,
                  );
                  return (
                    <tr
                      key={movimiento.id}
                      className={`${
                        index % 2 === 0
                          ? "bg-white dark:bg-gray-900"
                          : "bg-gray-50 dark:bg-gray-800/50"
                      } hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
                    >
                      <td className="border-t border-gray-200 dark:border-gray-700 p-2.5 whitespace-nowrap">
                        {new Date(movimiento.created_at).toLocaleString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </td>
                      <td className="border-t border-gray-200 dark:border-gray-700 p-2.5">
                        <Badge color={tipo?.type || "gray"}>
                          {tipo?.label || "-"}
                        </Badge>
                      </td>
                      <td className="border-t border-gray-200 dark:border-gray-700 p-2.5 font-medium text-gray-700 dark:text-gray-200">
                        {movimiento.reference || "-"}
                      </td>
                      <td
                        className="border-t border-gray-200 dark:border-gray-700 p-2.5 max-w-xs truncate"
                        title={movimiento.note || "-"}
                      >
                        {movimiento.note || "-"}
                      </td>
                      <td className="border-t border-gray-200 dark:border-gray-700 p-2.5 text-right font-semibold text-gray-800 dark:text-gray-100">
                        {movimiento.qty}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };
  if (!stockItems) {
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
        data={stockItems.filter((item) => item.stock > 0)} // Filtrar productos sin stock calculado
        onRowClick={handleRowClick}
        scrollHeightOffset={370}
        expandableRows
        ExpandedComponent={ExpandableComponent}
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
        btnExport={{
          filename: "stock",
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
