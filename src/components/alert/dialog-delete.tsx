"use client";
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface DeleteConfirmationConfig {
  onDelete: () => void | Promise<void>;
  title?: string;
  description?: string;
}

interface DeleteConfirmationContextType {
  confirmationDelete: (
    onDelete: () => void | Promise<void>,
    title?: string,
    description?: string,
  ) => void;
}

const DeleteConfirmationContext =
  createContext<DeleteConfirmationContextType | null>(null);

export function DeleteConfirmationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [config, setConfig] = useState<DeleteConfirmationConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const confirmationDelete = (
    onDelete: () => void | Promise<void>,
    title?: string,
    description?: string,
  ) => {
    setConfig({ onDelete, title, description });
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    if (config?.onDelete) {
      await config.onDelete();
    }
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setConfig(null);
  };

  return (
    <DeleteConfirmationContext.Provider value={{ confirmationDelete }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{config?.title ?? "Hapus Item"}</AlertDialogTitle>
            <AlertDialogDescription>
              {config?.description ??
                `Apakah Anda yakin ingin menghapus? Tindakan ini tidak dapat dibatalkan.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose}>Batal</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirm}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DeleteConfirmationContext.Provider>
  );
}

export function useDeleteConfirmation() {
  const context = useContext(DeleteConfirmationContext);
  if (!context) {
    throw new Error(
      "useDeleteConfirmation must be used within DeleteConfirmationProvider",
    );
  }
  return context;
}
