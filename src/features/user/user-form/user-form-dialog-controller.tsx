// form-dialog-context.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type UserFormDialogContextType = {
  open: boolean;
  setOpen: (value: boolean) => void;
  selectedUserId?: string;
  openDialog: (id?: string) => void;
};

const UserFormDialogContext = createContext<
  UserFormDialogContextType | undefined
>(undefined);

export function UserFormDialogProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(
    undefined,
  );

  const openDialog = (id: string | undefined) => {
    setSelectedUserId(id);
    setOpen(true);
  };
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSelectedUserId(undefined);
      }, 1000);
    }
  }, [open]);

  return (
    <UserFormDialogContext.Provider
      value={{ open, setOpen, selectedUserId, openDialog }}
    >
      {children}
    </UserFormDialogContext.Provider>
  );
}

export function useUserFormDialogController() {
  const context = useContext(UserFormDialogContext);
  if (!context) {
    throw new Error("useFormDialog must be used within a FormDialogProvider");
  }
  return context;
}
