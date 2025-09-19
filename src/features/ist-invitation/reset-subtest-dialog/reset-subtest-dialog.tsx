"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { type SubtestInfo, type ResetSubtestDialogProps } from "./types";
import { SubtestList } from "./subtest-list";

export function ResetSubtestDialog({
  invitationId,
  open,
  onOpenChange,
}: ResetSubtestDialogProps) {
  const [subtests] = useState<SubtestInfo[]>([
    {
      id: 1,
      name: "SE",
      startedAt: new Date("2024-01-15T10:30:00"),
      finishedAt: new Date("2024-01-15T10:45:00"),
      canReset: true,
    },
    {
      id: 2,
      name: "WA",
      startedAt: new Date("2024-01-15T10:46:00"),
      finishedAt: new Date("2024-01-15T11:00:00"),
      canReset: true,
    },
    {
      id: 3,
      name: "AN",
      startedAt: new Date("2024-01-15T11:01:00"),
      canReset: true,
    },
    {
      id: 4,
      name: "GE",
      startedAt: new Date("2024-01-15T11:15:00"),
      finishedAt: new Date("2024-01-15T11:30:00"),
      canReset: true,
    },
    {
      id: 5,
      name: "RA",
      canReset: false,
    },
    {
      id: 6,
      name: "ZR",
      canReset: false,
    },
    {
      id: 7,
      name: "FA",
      canReset: false,
    },
    {
      id: 8,
      name: "WU",
      canReset: false,
    },
    {
      id: 9,
      name: "ME",
      canReset: false,
    },
  ]);

  const handleResetSubtest = (subtestId: number) => {
    // TODO: Implement actual reset logic
    console.log(`Reset subtest ${subtestId} for invitation ${invitationId}`);
    
    // For now, just show a confirmation
    alert(`Fungsionalitas reset untuk subtest ${subtestId} akan diimplementasikan di backend`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Reset Subtest
          </DialogTitle>
          <DialogDescription>
            Pilih subtest yang ingin direset. Ini akan memungkinkan peserta untuk
            mengulangi subtest tertentu. Jawaban sebelumnya akan hilang.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Peringatan:</strong> Mereset subtest tidak dapat dibatalkan dan akan 
              menghapus semua jawaban yang ada untuk subtest tersebut.
            </p>
          </div>
          
          <SubtestList 
            subtests={subtests} 
            onResetSubtest={handleResetSubtest}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}