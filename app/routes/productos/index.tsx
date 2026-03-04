import type { Route } from "../+types/home";
import Table from "~/components/Table";
import type { ProductoConDetalles } from "~/types/productos";
import type { TableColumn } from "react-data-table-component";
import { useDataContext } from "~/context/DataContext";
import { use, useEffect } from "react";
import { Spinner } from "flowbite-react";
import { SubTitles } from "~/components/SubTitles";
import { AiOutlineProduct } from "react-icons/ai";
import { useModal } from "~/context/ModalContext";
import { ProductosModal } from "~/components/modals/customs/ProductosModal";
import { useProductos } from "~/hooks/useProductos";
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
    selector: (row) => row.subcategory.name,
    sortable: true,
  },
  { name: "Categoria", selector: (row) => row.category.name, sortable: true },

  { name: "Familia", selector: (row) => row.family.name, sortable: true },
  { name: "Unidad", selector: (row) => row.unit.name, sortable: true },
];

export default function Productos() {
  const { openModal } = useModal();

  const { form, onSubmit } = useProductos();
  const { productosConDetalles, getProductosConDetalles } = useDataContext();
  useEffect(() => {
    if (!productosConDetalles) getProductosConDetalles();
  }, []);
  function handleRowClick(row: ProductoConDetalles) {
    // Crear un nuevo formulario para este producto
    const newForm = form;
    newForm.reset(row);
    openModal("form", {
      component: ProductosModal,
      props: {
        form: newForm,
        title: "Editar producto: " + row.name,
      },
      onSubmit: form.handleSubmit(onSubmit),
    });
  }
  function handleNewProduct() {
    const newForm = form;
    newForm.reset({
      name: "",
      id_subcategory: "",
      family: { id: "", name: "" },
      category: { id: "", name: "" },
      unit: { id: "", name: "" }, 
      create_at: "",
      update_at: "",
      id: "",
    } as ProductoConDetalles);
    newForm.clearErrors();
    openModal("form", {
      component: ProductosModal,
      props: {
        form: newForm,
        title: "Nuevo producto",
      },
      onSubmit: form.handleSubmit(onSubmit),
    });
  }
  if (!productosConDetalles) {
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
        data={productosConDetalles}
        onRowClick={handleRowClick}
        btnOnClick={{ title: "Nuevo producto", onClick: handleNewProduct }}
      />
    </div>
  );
}
