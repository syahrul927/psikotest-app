"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { type SubtestInfo, type ResetSubtestDialogProps } from "./types";
import { type ResetIstSubtestRouterResponseType } from "@/server/api/routers/ist-invitation-router/protected/type";
import { SubtestList } from "./subtest-list";
import { useGetSubtestStatus } from "@/hooks/api/ist-invitation/use-get-subtest-status";
import { useResetIstSubtest } from "@/hooks/api/ist-invitation/use-reset-ist-subtest";
import { useState } from "react";

export function ResetSubtestDialog({
  invitationId,
  open,
  onOpenChange,
}: ResetSubtestDialogProps) {
  const [confirmingSubtest, setConfirmingSubtest] = useState<number | null>(
    null,
  );
  const {
    data: statusData,
    isLoading: isLoadingStatus,
    refetch,
  } = useGetSubtestStatus(invitationId);

  const { mutate: resetSubtest, isPending: isResetting } = useResetIstSubtest(
    (data: ResetIstSubtestRouterResponseType) => {
      setConfirmingSubtest(null);
      void refetch();
    },
  );

  // Transform API data to SubtestInfo format and sort by ID
  const subtests: SubtestInfo[] =
    statusData?.subtests
      .map((subtest) => ({
        id: subtest.id,
        name: subtest.name,
        startedAt: subtest.startedAt || undefined,
        finishedAt: subtest.finishedAt || undefined,
        canReset: subtest.canReset,
      }))
      .sort((a, b) => a.id - b.id) || [];

  const handleResetSubtest = (subtestId: number) => {
    resetSubtest({
      invitationId,
      subtestId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Reset Subtest
          </DialogTitle>
          <DialogDescription>
            Pilih subtest yang ingin direset. Ini akan memungkinkan peserta
            untuk mengulangi subtest tertentu. Jawaban sebelumnya akan hilang.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/20">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Peringatan:</strong> Mereset subtest tidak dapat
              dibatalkan dan akan menghapus semua jawaban yang ada untuk subtest
              tersebut.
            </p>
          </div>

          <SubtestList
            subtests={subtests}
            onResetSubtest={handleResetSubtest}
            confirmingSubtest={confirmingSubtest}
            setConfirmingSubtest={setConfirmingSubtest}
            isLoading={isLoadingStatus || isResetting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
