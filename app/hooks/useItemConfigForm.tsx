import type { ProductoConDetalles } from "~/types/productos";
import { useForm } from "react-hook-form";
export const useItemConfigForm = () => {
  const form = useForm<any>({
    defaultValues: {},
  });
  const onSubmit = async (data: any) => {
    const { id, ...rest } = data;
    console.log("Datos a enviar:", { id, ...rest });
    const mode = id === "" ? "create" : "edit";
  };
  return {
    form,
    onSubmit,
  };
};
