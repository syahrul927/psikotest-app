// form-dialog-context.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type KraepelinInvFormDialogContextType = {
  open: boolean;
  setOpen: (value: boolean) => void;
  kraepelinInvitationId?: string;
  openDialog: (id?: string) => void;
};

const KraepelinInvFormDialogContext = createContext<
  KraepelinInvFormDialogContextType | undefined
>(undefined);

export function KraepelinInvFormDialogProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [kraepelinInvitationId, setKraepelinInvitationId] = useState<
    string | undefined
  >(undefined);

  const openDialog = (id: string | undefined) => {
    setKraepelinInvitationId(id);
    setOpen(true);
  };
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setKraepelinInvitationId(undefined);
      }, 1000);
    }
  }, [open]);

  return (
    <KraepelinInvFormDialogContext.Provider
      value={{
        open,
        setOpen,
        kraepelinInvitationId,
        openDialog,
      }}
    >
      {children}
    </KraepelinInvFormDialogContext.Provider>
  );
}

export function useKraepelinInvFormDialogController() {
  const context = useContext(KraepelinInvFormDialogContext);
  if (!context) {
    throw new Error("useFormDialog must be used within a FormDialogProvider");
  }
  return context;
}
