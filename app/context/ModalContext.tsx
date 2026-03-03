import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ModalType } from "~/components/modals/ModalManager";

type ModalState = {
  type: ModalType | null;
  props?: any;
}

interface ModalContextType {
  modal: ModalState;
  openModal: (type: ModalType, props?: any) => void;
  closeModal: () => void;
}
const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [modal, setModal] = useState<ModalState>({ type: null });
  const openModal = (type: ModalType, props?: any) => {
    setModal({ type, props });
  };
  const closeModal = () => {
    setModal({ type: null });
  };
  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        modal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
