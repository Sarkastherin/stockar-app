import type { ProductoConDetalles, ProductoDB } from "~/types/productos";
import { useForm } from "react-hook-form";
import { useDataContext } from "~/context/DataContext";
import { useModal } from "~/context/ModalContext";
import { prepareUpdatePayload } from "~/utils/functions";
export const useProductos = () => {
  const { createProducto, updateProducto, deleteProducto, reactivateProducto } =
    useDataContext();
  const { setMessageForm, setStepForm } = useModal();
  const form = useForm<ProductoConDetalles>({
    defaultValues: {},
  });
  const onCreate = async (data: ProductoConDetalles) => {
    const { name, id_subcategory, id_unit } = data;
    const result = await createProducto({
      name,
      id_subcategory,
      id_unit,
    });
    if (result.error) {
      setMessageForm(result.error.message || "Error al crear el producto");
      setStepForm("error");
      return;
    }
    setMessageForm("Producto creado exitosamente");
    setStepForm("success");
  };
  const onUpdate = async (data: ProductoConDetalles) => {
    const { id, name, id_subcategory, id_unit } = data;
    const payload = prepareUpdatePayload({
      dirtyFields: form.formState.dirtyFields,
      formData: { name, id_subcategory, id_unit } as ProductoConDetalles,
    });
    const result = await updateProducto(id, payload);
    if (result.error) {
      setMessageForm(result.error.message || "Error al actualizar el producto");
      setStepForm("error");
      return;
    }
    setMessageForm("Producto actualizado exitosamente");
    setStepForm("success");
  };
  const onDelete = async (id: string) => {
    const result = await deleteProducto(id);
    if (result.error) {
      setMessageForm(
        result.error.message || "Error al dar de baja el producto",
      );
      setStepForm("error");
      return;
    }
    setMessageForm("Producto dado de baja exitosamente");
    setStepForm("success");
  };
  const onReactivate = async (id: string) => {
    const result = await reactivateProducto(id);
    if (result.error) {
      setMessageForm(result.error.message || "Error al reactivar el producto");
      setStepForm("error");
      return;
    }
    setMessageForm("Producto reactivado exitosamente");
    setStepForm("success");
  };
  return {
    form,
    onCreate,
    onUpdate,
    onDelete,
    onReactivate,
  };
};
