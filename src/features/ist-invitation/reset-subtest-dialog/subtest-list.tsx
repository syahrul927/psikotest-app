"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Clock, CheckCircle } from "lucide-react";
import { localDate } from "@/lib/date-utils";
import { useResetConfirmation } from "@/components/alert/dialog-reset";
import { type SubtestInfo } from "./types";

interface SubtestListProps {
  subtests: SubtestInfo[];
  onResetSubtest: (subtestId: number) => void;
}

export function SubtestList({ subtests, onResetSubtest }: SubtestListProps) {
  const { confirmationReset } = useResetConfirmation();

  const handleResetClick = (subtest: SubtestInfo) => {
    confirmationReset(
      onResetSubtest,
      subtest.id,
      subtest.name,
      `Reset Subtest ${subtest.name}`,
      `Apakah Anda yakin ingin mereset Subtest ${subtest.name}? Semua jawaban peserta untuk subtest ini akan dihapus dan tidak dapat dikembalikan.`
    );
  };

  return (
    <div className="space-y-3">
      {subtests.map((subtest) => (
        <Card key={subtest.id} className="p-4">
          <CardContent className="p-0">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">Subtest {subtest.id}</h4>
                  <span className="text-sm text-muted-foreground">
                    - {subtest.name}
                  </span>
                  {subtest.finishedAt && (
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Selesai
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1 text-sm text-muted-foreground">
                  {subtest.startedAt && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Dimulai: {localDate(subtest.startedAt)}</span>
                    </div>
                  )}
                  {subtest.finishedAt && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
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
                  onClick={() => handleResetClick(subtest)}
                  disabled={!subtest.canReset}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}