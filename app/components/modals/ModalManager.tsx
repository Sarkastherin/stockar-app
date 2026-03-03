import { useModal } from "~/context/ModalContext";
import { Modal } from "./ModalBase";
import { Button } from "flowbite-react";
export type ModalType = "custom" | "form";
export default function ModalManager() {
  const { modal } = useModal();
  if (!modal.type) return null;
  switch (modal.type) {
    case "custom": {
      const customProps = modal.props || {};
      const CustomComponent = customProps.component;
      if (!CustomComponent) return null;
      return <CustomComponent open={true} props={customProps} />;
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
            <div className="flex justify-between items-center w-full">
              <div className="text-xs text-gray-500 dark:text-gray-300">
              Los campos marcados con <span className="text-red-600">*</span>{" "}
              son obligatorios
            </div>
              <Button
              color={"cyan"}
              onClick={formProps.onSubmit}
            >
              Guardar
            </Button>
            </div>
          }
        >
          <form onSubmit={formProps.onSubmit} className="flex flex-col gap-4">

            <FormComponent {...formProps} />
          </form>
        </Modal>
      );
    }
    default:
      return null;
  }
}
