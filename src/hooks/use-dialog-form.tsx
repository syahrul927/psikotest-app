import { createContext, useContext, useState, type ReactNode } from "react";

type FormDialogContextType = {
  open: boolean;
  handleOpenDialog: (id?: string) => void;
  handleCloseDialog: () => void;
  id?: string;
};

const FormDialogContext = createContext<FormDialogContextType | undefined>(
  undefined,
);

export const FormDialogProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [id, setId] = useState<string>();

  const handleOpenDialog = (id?: string) => {
    setId(id);
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setId(undefined);
    setOpen(false);
  };

  return (
    <FormDialogContext.Provider
      value={{
        open,
        handleOpenDialog,
        handleCloseDialog,
        id,
      }}
    >
      {children}
    </FormDialogContext.Provider>
  );
};

export const useFormDialog = () => {
  const context = useContext(FormDialogContext);
  if (!context) {
    throw new Error("useFormDialog must be used within a FormDialogProvider");
  }
  return context;
};
