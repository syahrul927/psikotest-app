// form-dialog-context.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type KraeplinInvFormDialogContextType = {
  open: boolean;
  setOpen: (value: boolean) => void;
  kraeplinInvitationId?: string;
  openDialog: (id?: string) => void;
};

const KraeplinInvFormDialogContext = createContext<
  KraeplinInvFormDialogContextType | undefined
>(undefined);

export function KraeplinInvFormDialogProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [kraeplinInvitationId, setKraeplinInvitationId] = useState<
    string | undefined
  >(undefined);

  const openDialog = (id: string | undefined) => {
    setKraeplinInvitationId(id);
    setOpen(true);
  };
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setKraeplinInvitationId(undefined);
      }, 1000);
    }
  }, [open]);

  return (
    <KraeplinInvFormDialogContext.Provider
      value={{ open, setOpen, kraeplinInvitationId, openDialog }}
    >
      {children}
    </KraeplinInvFormDialogContext.Provider>
  );
}

export function useKraeplinInvFormDialogController() {
  const context = useContext(KraeplinInvFormDialogContext);
  if (!context) {
    throw new Error("useFormDialog must be used within a FormDialogProvider");
  }
  return context;
}
