"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { localDate } from "@/lib/date-utils";
import { AlertTriangle, CheckCircle, Clock, RotateCcw } from "lucide-react";
import { type SubtestInfo } from "./types";

interface SubtestListProps {
  subtests: SubtestInfo[];
  confirmingSubtest: number | null;
  setConfirmingSubtest: (value: number | null) => void;
  onResetSubtest: (subtestId: number) => void;
  isLoading?: boolean;
}

export function SubtestList({
  subtests,
  confirmingSubtest,
  setConfirmingSubtest,
  onResetSubtest,
  isLoading,
}: SubtestListProps) {
  return (
    <div className="space-y-3">
      {subtests.map((subtest) => (
        <Card key={subtest.id} className="p-4">
          <CardContent className="p-0">
            {confirmingSubtest === subtest.id ? (
              // Confirmation mode
              <div className="space-y-4">
                <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/20">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 dark:text-amber-200">
                    <strong>Peringatan:</strong> Anda akan mereset Subtest{" "}
                    {subtest.name}. Semua jawaban peserta untuk subtest ini akan
                    dihapus dan tidak dapat dikembalikan.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setConfirmingSubtest(null)}
                    disabled={isLoading}
                  >
                    Batal
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => onResetSubtest(subtest.id)}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="h-4 w-4" />
                        Ya, Reset
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              // Normal mode
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h4 className="font-medium">Subtest {subtest.id}</h4>
                    <span className="text-muted-foreground text-sm">
                      - {subtest.name}
                    </span>
                    {subtest.finishedAt && (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Selesai
                      </Badge>
                    )}
                  </div>

                  <div className="text-muted-foreground space-y-1 text-sm">
                    {subtest.startedAt && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Dimulai: {localDate(subtest.startedAt)}</span>
                      </div>
                    )}
                    {subtest.finishedAt && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Selesai: {localDate(subtest.finishedAt)}</span>
                      </div>
                    )}
                    {!subtest.startedAt && (
                      <div className="text-muted-foreground italic">
                        Belum dimulai
                      </div>
                    )}
                  </div>
                </div>

                <div className="ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setConfirmingSubtest(subtest.id);
                    }}
                    disabled={!subtest.canReset || isLoading}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
