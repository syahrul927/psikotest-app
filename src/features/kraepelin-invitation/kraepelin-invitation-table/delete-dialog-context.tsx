"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface DeleteDialogContextType {
  isOpen: boolean;
  itemToDelete: { id: string; name: string; onDelete: (id: string) => void } | null;
  openDeleteDialog: (item: { id: string; name: string; onDelete: (id: string) => void }) => void;
  closeDeleteDialog: () => void;
  handleDelete: () => void;
}

const DeleteDialogContext = createContext<DeleteDialogContextType | undefined>(undefined);

export const useDeleteDialog = () => {
  const context = useContext(DeleteDialogContext);
  if (!context) {
    throw new Error("useDeleteDialog must be used within a DeleteDialogProvider");
  }
  return context;
};

// Force cleanup function to remove pointer-events: none from body
const forceCleanupBodyStyles = () => {
  if (typeof window !== "undefined") {
    document.body.style.removeProperty("pointer-events");
    // Also remove any data attributes that might be causing issues
    document.body.removeAttribute("data-scroll-locked");
  }
};

export const DeleteDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string; onDelete: (id: string) => void } | null>(null);

  const openDeleteDialog = (item: { id: string; name: string; onDelete: (id: string) => void }) => {
    setItemToDelete(item);
    setIsOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsOpen(false);
    setItemToDelete(null);
    // Force cleanup after a short delay to ensure Radix has finished
    setTimeout(forceCleanupBodyStyles, 100);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      itemToDelete.onDelete(itemToDelete.id);
      closeDeleteDialog();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      forceCleanupBodyStyles();
    };
  }, []);

  return (
    <DeleteDialogContext.Provider
      value={{
        isOpen,
        itemToDelete,
        openDeleteDialog,
        closeDeleteDialog,
        handleDelete,
      }}
    >
      {children}
    </DeleteDialogContext.Provider>
  );
};