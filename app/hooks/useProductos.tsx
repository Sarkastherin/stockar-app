import type { ProductoConDetalles } from "~/types/productos";
import { useForm } from "react-hook-form";
export const useProductos = () => {
  const form = useForm<ProductoConDetalles>({
    defaultValues: {},
  });
  const onSubmit = async (data: ProductoConDetalles) => {
    const {unit, subcategory, category, family, ...rest} = data
  };
  return {
    form,
    onSubmit,
  };
};
