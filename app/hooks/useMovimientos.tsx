import type { MovimientoConDetalles } from "~/types/movimientos";
import { useForm } from "react-hook-form";
import { useDataContext } from "~/context/DataContext";
import { useModal } from "~/context/ModalContext";
import { prepareUpdatePayload } from "~/utils/functions";
export const useMovimientos = () => {
  const {
    createMovimiento,
    updateMovimiento,
    deleteMovimiento,
    reactivateMovimiento,
  } = useDataContext();
  const { setMessageForm, setStepForm } = useModal();
  const form = useForm<MovimientoConDetalles>({
    defaultValues: {},
  });
  const onCreate = async (data: MovimientoConDetalles) => {
    const { id_product, qty, type, note, reference } = data;
    const result = await createMovimiento({
      id_product,
      qty,
      type,
      note,
      reference,
    });
    if (result.error) {
      setMessageForm(result.error.message || "Error al crear el movimiento");
      setStepForm("error");
      return;
    }
    setMessageForm("Movimiento creado exitosamente");
    setStepForm("success");
  };
  const onUpdate = async (data: MovimientoConDetalles) => {
    const { reference, note } = data;
    const payload = prepareUpdatePayload({
      dirtyFields: form.formState.dirtyFields,
      formData: { reference, note } as MovimientoConDetalles,
    });
    const result = await updateMovimiento(data.id, payload);
    if (result.error) {
      setMessageForm(
        result.error.message || "Error al actualizar el movimiento",
      );
      setStepForm("error");
      return;
    }
    setMessageForm("Movimiento actualizado exitosamente");
    setStepForm("success");
  };
  const onDelete = async (id: string) => {
    const result = await deleteMovimiento(id);
    if (result.error) {
      setMessageForm(
        result.error.message || "Error al dar de baja el movimiento",
      );
      setStepForm("error");
      return;
    }
    setMessageForm("Movimiento dado de baja exitosamente");
    setStepForm("success");
  };
  const onReactivate = async (id: string) => {
    const result = await reactivateMovimiento(id);
    if (result.error) {
      setMessageForm(
        result.error.message || "Error al reactivar el movimiento",
      );
      setStepForm("error");
      return;
    }
    setMessageForm("Movimiento reactivado exitosamente");
    setStepForm("success");
  };
  return {
    form,
    onUpdate,
    onCreate,
    onDelete,
    onReactivate,
  };
};
