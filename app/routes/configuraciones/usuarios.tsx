import type { Route } from "../+types/home";
import Table from "~/components/Table";
import type { TableColumn } from "react-data-table-component";
import { useDataContext } from "~/context/DataContext";
import { useEffect } from "react";
import { Spinner } from "flowbite-react";
import { SubTitles } from "~/components/SubTitles";
import { AiOutlineUser } from "react-icons/ai";
import { useModal } from "~/context/ModalContext";
import { UsuariosModal } from "~/components/modals/customs/UsuariosModal";
import { useProductos } from "~/hooks/useProductos";
import { type UsuarioDB, optionsRoles } from "~/types/usuarios";
import { Badge } from "flowbite-react";
import { MdOutlineEmail } from "react-icons/md";
import { useUsuarios } from "~/hooks/useUsuarios";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Usuarios" },
    { name: "description", content: "Gestión de usuarios en StockAR" },
  ];
}
const columns: TableColumn<UsuarioDB>[] = [
  { name: "Nombre", selector: (row) => row.name, sortable: true },
  {
    name: "Apellido",
    selector: (row) => row.last_name,
    sortable: true,
  },
  {
    name: "Email",
    cell: (row) => (
      <Badge color="indigo">
        <div className="flex items-center gap-1">
          <MdOutlineEmail />
          {row.email}
        </div>
      </Badge>
    ),
    sortable: true,
  },

  {
    name: "Rol",
    cell: (row) => {
      const role = optionsRoles.find((option) => option.value === row.role);
      return role ? <Badge color={role.color}>{role.label}</Badge> : row.role;
    },
    sortable: true,
    width: "200px",
  },
  {
    name: "Fecha de creación",
    selector: (row) =>
      new Date(row.created_at).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
    sortable: true,
    width: "200px",
  },
  {
    name: "Última actualización",
    selector: (row) =>
      new Date(row.updated_at).toLocaleDateString("es-AR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
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

export default function UsuariosSettings() {
  const { openModal } = useModal();
  const { form, onCreate, onUpdate, onDelete, onReactivate } = useUsuarios();
  const { usuarios, getUsuarios } = useDataContext();
  useEffect(() => {
    if (!usuarios) getUsuarios();
  }, [usuarios, getUsuarios]);
  function handleRowClick(row: UsuarioDB) {
    // Crear un nuevo formulario para este usuario
    const newForm = form;
    newForm.reset(row);
    openModal("form", {
      component: UsuariosModal,
      props: {
        form: newForm,
        title: "Editar usuario: " + row.name,
        onDelete: () => onDelete(row.id),
        onReactivate: () => onReactivate(row.id),
      },
      onSubmit: form.handleSubmit(onUpdate),
    });
  }
  function handleNewUser() {
    const newForm = form;
    newForm.reset({
      name: "",
      last_name: "",
      email: "",
      role: "USER",
      created_at: "",
      updated_at: "",
      id: "",
      active: true,
      created_by: "",
      updated_by: "",
    });
    newForm.clearErrors();
    openModal("form", {
      component: UsuariosModal,
      props: {
        form: newForm,
        title: "Nuevo usuario",
      },
      onSubmit: form.handleSubmit(onCreate),
    });
  }
  if (!usuarios) {
    return (
      <div className="flex justify-center items-center">
        <Spinner aria-label="Cargando productos..." />
      </div>
    );
  }
  return (
    <div>
      <SubTitles
        title="Usuarios"
        back_path="/"
        icon={{
          component: AiOutlineUser,
          color: "text-blue-600 dark:text-blue-400",
        }}
      />
      <Table
        columns={columns}
        data={usuarios}
        inactiveField="active"
        onRowClick={handleRowClick}
        btnOnClick={{
          title: "Nuevo usuario",
          onClick: handleNewUser,
          color: "indigo",
        }}
        scrollHeightOffset={410}
        filterFields={[
          { key: "name", label: "Usuario" },
          {
            key: "role",
            label: "Rol",
            type: "select",
            options: optionsRoles,
            emptyOption: "Todas",
          },
          {
            key: "email",
            label: "Email",
            type: "text",
          },
        ]}
      />
    </div>
  );
}
