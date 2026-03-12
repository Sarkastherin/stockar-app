import { useForm } from "react-hook-form";
import { useDataContext } from "~/context/DataContext";
import { useModal } from "~/context/ModalContext";
export const useItemConfigForm = (create: (data: any) => Promise<any>) => {
  const {openModal, setMessageForm, setStepForm} = useModal();
  const form = useForm<any>({
    defaultValues: {},
  });
  const onSubmit = async (data: any) => {
    const { id, ...rest } = data;
    console.log("Datos a enviar:", { id, ...rest });
    const mode = id === "" ? "create" : "edit";
  };
  const onCreate = async (data: any) => {
    const result = await create(data);
    if (result.error) {
      setMessageForm(result.error.message || "Error al crear el producto");
      setStepForm("error");
      return;
    }
    setMessageForm("Producto creado exitosamente");
    setStepForm("success");
  };
  return {
    form,
    onSubmit,
    onCreate,
  };
};
