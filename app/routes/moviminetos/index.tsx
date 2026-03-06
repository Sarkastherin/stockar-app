import type { Route } from "../+types/home";
import Table from "~/components/Table";
import type { TableColumn } from "react-data-table-component";
import { useDataContext } from "~/context/DataContext";
import { useEffect } from "react";
import { Spinner } from "flowbite-react";
import { SubTitles } from "~/components/SubTitles";
import { LuArrowUpDown } from "react-icons/lu";
import { useModal } from "~/context/ModalContext";
import { MovimientoModal } from "~/components/modals/customs/ShowMovimientoModal";
import { useMovimientos } from "~/hooks/useMovimientos";
import {
  tiposMovimiento,
  type MovimientoConDetalles,
} from "~/types/movimientos";
import { NewMovimientoModal } from "~/components/modals/customs/NewMovimientoModal";
import { commonProps } from "~/types/commonsTypes";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Movimientos" },
    { name: "description", content: "Gestión de movimientos de productos" },
  ];
}
const columns: TableColumn<MovimientoConDetalles>[] = [
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
  },
  { name: "Nombre", selector: (row) => row.name_product, sortable: true },
  { name: "Tipo", selector: (row) => tiposMovimiento.find((tipo) => tipo.value === row.type)?.label || "-", sortable: true },
  {
    name: "Cantidad",
    selector: (row) => row.qty,
    sortable: true,
    width: "120px",
  },
  { name: "Nota", selector: (row) => row.note || "-", sortable: false },
  {
    name: "Referencia",
    selector: (row) => row.reference || "-",
    sortable: false,
  },
  {
    name: "Estado",
    selector: (row) => (row.voided_at ? "Anulado" : "Activo"),
    sortable: true,
    width: "120px",
  },
];

export default function Movimientos() {
  const { openModal } = useModal();

  const { form, onSubmitEdit, onSubmitNew, onError } = useMovimientos();
  const { movimientosConDetalles, getMovimientosConDetalles } =
    useDataContext();
  useEffect(() => {
    if (!movimientosConDetalles) getMovimientosConDetalles();
  }, [movimientosConDetalles, getMovimientosConDetalles]);

  function handleRowClick(row: MovimientoConDetalles) {
    const newForm = form;
    newForm.reset(row);
    openModal("form", {
      component: MovimientoModal,
      props: {
        form: newForm,
        title: "Consultar movimiento: " + row.name_product,
      },
      onSubmit: form.handleSubmit(onSubmitEdit),
    });
  }
  function handleNewMovement() {
    const newForm = form;
    newForm.reset({
      ...commonProps,
      active: true,
      type: "",
      id_product: "",
      qty: 0,
      note: "",
      reference: "",
      name_product: "",
      voided_at: "",
      voided_by: "",
      void_reason: "",
    });
    openModal("form", {
      component: NewMovimientoModal,
      props: {
        form: newForm,
        title: "Nuevo movimiento",
      },
      onSubmit: form.handleSubmit(onSubmitNew, onError),
    });

    // Crear un nuevo formulario vacío para un nuevo movimiento
  }
  if (!movimientosConDetalles) {
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
        data={movimientosConDetalles}
        onRowClick={handleRowClick}
        btnOnClick={{
          title: "Nuevo movimiento",
          onClick: handleNewMovement,
          color: "indigo",
        }}
        scrollHeightOffset={300}
      />
    </div>
  );
}
