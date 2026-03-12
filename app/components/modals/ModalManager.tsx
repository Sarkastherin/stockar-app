import { useModal } from "~/context/ModalContext";
import { Modal } from "./ModalBase";
import { Alert, Button } from "flowbite-react";
export type ModalType = "custom" | "form";
export default function ModalManager() {
  const { modal, messageForm, closeModal, stepForm } = useModal();
  if (!modal.type) return null;
  switch (modal.type) {
    case "custom": {
      const customProps = modal.props || {};
      const CustomComponent = customProps.component;
      if (!CustomComponent) return null;
      return (
        <Modal open={true} title={customProps.props.title}>
          <CustomComponent {...customProps} />
        </Modal>
      );
    }
    case "form": {
      const formProps = modal.props || {};
      const FormComponent = formProps.component;
      if (!FormComponent) return null;
      return (
        <Modal
          open={true}
          title={formProps.props.title}
          footer={
            <>
              {stepForm === "form" && (
                <div className="flex justify-between items-center w-full">
                  <div className="text-xs text-gray-500 dark:text-gray-300">
                    Los campos marcados con{" "}
                    <span className="text-red-600">*</span> son obligatorios
                  </div>
                  <Button color={"indigo"} onClick={formProps.onSubmit}>
                    Guardar
                  </Button>
                </div>
              )}
              {stepForm === "success" && (
                <Button className="ms-auto" color={"green"} onClick={closeModal}>
                  Aceptar
                </Button>
              )}
              {stepForm === "error" && (
                <Button className="ms-auto" color={"red"} onClick={closeModal}>
                  Cerrar
                </Button>
              )}
            </>
          }
        >
          {stepForm === "form" && (
            <form onSubmit={formProps.onSubmit} className="flex flex-col gap-4">
              <FormComponent {...formProps} />
            </form>
          )}
          <div>
            {stepForm === "success" && (
              <Alert color="success">
                <span>{messageForm || "¡Operación realizada con éxito!"}</span>
              </Alert>
            )}
            {stepForm === "error" && (
              <Alert color="failure">
                <span>
                  {messageForm || "Ha ocurrido un error. Inténtalo de nuevo."}
                </span>
              </Alert>
            )}
          </div>
        </Modal>
      );
    }
    default:
      return null;
  }
}
