// form-dialog-context.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type IstInvFormDialogContextType = {
  open: boolean;
  setOpen: (value: boolean) => void;
  istInvitationId?: string;
  openDialog: (id?: string) => void;
};

const IstInvFormDialogContext = createContext<
  IstInvFormDialogContextType | undefined
>(undefined);

export function IstInvFormDialogProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [istInvitationId, setIstInvitationId] = useState<string | undefined>(
    undefined,
  );

  const openDialog = (id: string | undefined) => {
    setIstInvitationId(id);
    setOpen(true);
  };
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setIstInvitationId(undefined);
      }, 1000);
    }
  }, [open]);

  return (
    <IstInvFormDialogContext.Provider
      value={{ open, setOpen, istInvitationId: istInvitationId, openDialog }}
    >
      {children}
    </IstInvFormDialogContext.Provider>
  );
}

export function useIstInvFormDialogController() {
  const context = useContext(IstInvFormDialogContext);
  if (!context) {
    throw new Error("useFormDialog must be used within a FormDialogProvider");
  }
  return context;
}
