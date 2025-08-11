"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Play } from "lucide-react";
import React from "react";
import { ConfirmationDialogHeader } from "./confirmation-dialog-header";
import { ConfirmationDialogInfo } from "./confirmation-dialog-info";
import { ConfirmationDialogWarning } from "./confirmation-dialog-warning";
import { InstructionContent } from "./instruction-content";
import { Subtest9MemorizationFeature } from "./subtest9-memorization-feature";
import type { ConfirmationDialogProps } from "./confirmation-dialog.types";

const ConfirmationDialog = React.forwardRef<
  HTMLDivElement,
  ConfirmationDialogProps
>(
  (
    {
      instruction = `No instruction available for this subtest`,
      informationData,
      subtestType,
      onConfirm,
      istInvitationId,
      children,
    },
    ref,
  ) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent
          ref={ref}
          className={
            "max-h-[100dvh] overflow-scroll sm:max-w-7xl md:max-h-[90dvh]"
          }
        >
          <ConfirmationDialogHeader informationData={informationData} />

          <div className="space-y-4">
            <ConfirmationDialogInfo informationData={informationData} />

            <Subtest9MemorizationFeature
              subtestType={subtestType}
              istInvitationId={istInvitationId}
            />

            {instruction && <InstructionContent instruction={instruction} />}

            <ConfirmationDialogWarning />
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => onConfirm()}>
              <Play className="mr-2 h-4 w-4" /> Mulai Test
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  },
);

ConfirmationDialog.displayName = "ConfirmationDialog";

export default ConfirmationDialog;