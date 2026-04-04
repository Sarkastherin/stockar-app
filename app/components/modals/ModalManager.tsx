import { useModal } from "~/context/ModalContext";
import { Modal } from "./ModalBase";
import { Alert, Button, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
export type ModalType = "custom" | "form" | "confirmation";
export default function ModalManager() {
  const { modal, messageForm, closeModal, stepForm } = useModal();
  if (!modal.type) return null;
  switch (modal.type) {
    case "custom": {
      const customProps = modal.props || {};
      const CustomComponent = customProps.component;
      if (!CustomComponent) return null;
      return (
        <Modal open={true} title={customProps.title}>
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
                <Button
                  className="ms-auto"
                  color={"green"}
                  onClick={closeModal}
                >
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
    case "confirmation": {
      const confirmationProps = modal.props || {};
      return (
        <>
          <Modal open={true} size="md">
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                {confirmationProps.props.message}
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="yellow" onClick={confirmationProps.props.onConfirm}>
                  {confirmationProps.props.confirmText || "Sí, estoy seguro"}
                </Button>
                <Button color="alternative" onClick={closeModal}>
                  {confirmationProps.props.cancelText || "No, cancelar"}
                </Button>
              </div>
            </div>
          </Modal>
        </>
      );
    }
    default:
      return null;
  }
}
