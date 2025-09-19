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

interface ResetConfirmationConfig {
  onReset: (subtestId: number) => void | Promise<void>;
  subtestId: number;
  subtestName: string;
  title?: string;
  description?: string;
}

interface ResetConfirmationContextType {
  confirmationReset: (
    onReset: (subtestId: number) => void | Promise<void>,
    subtestId: number,
    subtestName: string,
    title?: string,
    description?: string,
  ) => void;
}

const ResetConfirmationContext =
  createContext<ResetConfirmationContextType | null>(null);

export function ResetConfirmationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [config, setConfig] = useState<ResetConfirmationConfig | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const confirmationReset = (
    onReset: (subtestId: number) => void | Promise<void>,
    subtestId: number,
    subtestName: string,
    title?: string,
    description?: string,
  ) => {
    setConfig({ onReset, subtestId, subtestName, title, description });
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    if (config?.onReset) {
      await config.onReset(config.subtestId);
    }
    handleClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    setConfig(null);
  };

  return (
    <ResetConfirmationContext.Provider value={{ confirmationReset }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {config?.title ?? `Reset Subtest ${config?.subtestName}`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {config?.description ??
                `Apakah Anda yakin ingin mereset Subtest ${config?.subtestName}? Semua jawaban peserta untuk subtest ini akan dihapus dan tidak dapat dikembalikan.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleClose}>Batal</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirm}>
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ResetConfirmationContext.Provider>
  );
}

export function useResetConfirmation() {
  const context = useContext(ResetConfirmationContext);
  if (!context) {
    throw new Error(
      "useResetConfirmation must be used within ResetConfirmationProvider",
    );
  }
  return context;
}