import type { ProductoConDetalles } from "~/types/productos";
import { useForm } from "react-hook-form";
export const useProductos = () => {
  const form = useForm<ProductoConDetalles>({
    defaultValues: {},
  });
  const onSubmit = async (data: ProductoConDetalles) => {
    const {
      id, name, id_subcategory, id_unit
    } = data;
    const mode = id === "" ? "create" : "edit";
    console.log("Datos a enviar:", { id, name, id_subcategory, id_unit });
  };
  return {
    form,
    onSubmit,
  };
};
