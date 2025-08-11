import { AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { InformationData } from "./confirmation-dialog.types";
import React from "react";

interface ConfirmationDialogHeaderProps {
  informationData: InformationData;
}

export const ConfirmationDialogHeader = React.forwardRef<
  HTMLDivElement,
  ConfirmationDialogHeaderProps
>(({ informationData }, ref) => {
  const title = `Konfirmasi Memulai Subtes: ${informationData.name} (${informationData.description})`;

  return (
    <AlertDialogHeader className="text-left" ref={ref}>
      <AlertDialogTitle>{title}</AlertDialogTitle>
    </AlertDialogHeader>
  );
});

ConfirmationDialogHeader.displayName = "ConfirmationDialogHeader";