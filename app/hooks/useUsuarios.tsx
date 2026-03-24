import { useForm } from "react-hook-form";
import { useDataContext } from "~/context/DataContext";
import { useModal } from "~/context/ModalContext";
import { prepareUpdatePayload } from "~/utils/functions";
import type { UsuarioDB } from "~/types/usuarios";
export const useUsuarios = () => {
  const { createUsuario, updateUsuario, deleteUsuario, reactivateUsuario } =
    useDataContext();
  const { setMessageForm, setStepForm } = useModal();
  const form = useForm<UsuarioDB>({
    defaultValues: {},
  });
  const onCreate = async (data: UsuarioDB) => {
    const { name, last_name, email, role } = data;
    const result = await createUsuario({
      name,
      last_name,
      email,
      role,
    });
    if (result.error) {
      setMessageForm(result.error.message || "Error al crear el usuario");
      setStepForm("error");
      return;
    }
    setMessageForm("Usuario creado exitosamente");
    setStepForm("success");
  };
  const onUpdate = async (data: UsuarioDB) => {
    const { id, name, last_name, email, role } = data;
    const payload = prepareUpdatePayload({
      dirtyFields: form.formState.dirtyFields,
      formData: { name, last_name, email, role } as UsuarioDB,
    });
    const result = await updateUsuario(id, payload);
    if (result.error) {
      setMessageForm(result.error.message || "Error al actualizar el usuario");
      setStepForm("error");
      return;
    }
    setMessageForm("Usuario actualizado exitosamente");
    setStepForm("success");
  };
  const onDelete = async (id: string) => {
    const result = await deleteUsuario(id);
    if (result.error) {
      setMessageForm(
        result.error.message || "Error al dar de baja el usuario",
      );
      setStepForm("error");
      return;
    }
    setMessageForm("Usuario dado de baja exitosamente");
    setStepForm("success");
  };
  const onReactivate = async (id: string) => {
    const result = await reactivateUsuario(id);
    if (result.error) {
      setMessageForm(result.error.message || "Error al reactivar el usuario");
      setStepForm("error");
      return;
    }
    setMessageForm("Usuario reactivado exitosamente");
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
