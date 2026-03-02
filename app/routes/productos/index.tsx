import type { Route } from "../+types/home";
import Table from "~/components/Table";
import type { ProductoConDetalles } from "~/types/productos";
import type { TableColumn } from "react-data-table-component";
import { useDataContext } from "~/context/DataContext";
import { useEffect } from "react";
import { Spinner } from "flowbite-react";
import { SubTitles } from "~/components/SubTitles";
import { AiOutlineProduct } from "react-icons/ai";
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
const data: ProductoConDetalles[] = [];
export default function Productos() {
  const { productosConDetalles, getProductosConDetalles } = useDataContext();
  useEffect(() => {
    if (!productosConDetalles) getProductosConDetalles();
  }, []);
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
      <Table columns={columns} data={productosConDetalles} />
    </div>
  );
}
