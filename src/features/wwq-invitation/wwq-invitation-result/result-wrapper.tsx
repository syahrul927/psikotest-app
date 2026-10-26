"use client";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWwqResult } from "@/hooks/use-wwq-result-context";
import { localDate } from "@/lib/date-utils";
import { WwqParticipantInfoCard } from "./participant-info-card";
import { WwqRadarChart } from "./radar-chart";
import { WwqCategoryBadge } from "./category-badge";
import { WwqResultTable } from "./table-card";
import { WwqDetailAnswerCard } from "./detail-answer-card";

function WwqOverallResultCard() {
  const { overall, isLoading } = useWwqResult();
  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }
  if (!overall) {
    return null;
  }
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Hasil Keseluruhan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            Total Tertimbang
          </span>
          <span className="font-mono text-xl font-bold">
            {overall.totalWeighted}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Nilai Overall</span>
          <span className="font-mono text-xl font-bold">
            {overall.overallValue.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Kategori</span>
          <WwqCategoryBadge category={overall.category} />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Tanggal Selesai</span>
          <span className="text-sm font-medium">
            {localDate(overall.completedAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export const WwqInvitationResultWrapper = () => {
  const {
    invitationId,
    results,
    overall,
    answers,
    isLoading,
    isError,
    error,
  } = useWwqResult();

  const chartData = useMemo(
    () =>
      results.map((r) => ({
        aspect: r.aspect,
        percent: Number(r.percent.toFixed(2)),
        score: r.rawScore,
        category: r.category,
      })),
    [results],
  );

  // getResult throws for invitations without a saved result (non-DONE); render
  // one empty state instead of a half-populated page when it fails for any
  // reason (error, or data missing with the query settled).
  if (!isLoading && !overall) {
    return (
      <Card className="border-0">
        <CardContent className="p-0">
          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <CardHeader className="items-center border-b bg-gray-50 text-center dark:bg-gray-800">
              <CardTitle className="text-gray-900 dark:text-gray-100">
                Hasil tes belum tersedia
              </CardTitle>
              <CardDescription className="text-center">
                {isError && error
                  ? error
                  : "Hasil hanya dapat ditampilkan setelah peserta menyelesaikan tes."}
              </CardDescription>
            </CardHeader>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <WwqParticipantInfoCard slug={invitationId} />
      <WwqRadarChart chartData={chartData} isLoading={isLoading} />
      <div className="md:col-span-2">
        <WwqOverallResultCard />
      </div>
      <div className="md:col-span-2">
        <WwqResultTable
          data={results}
          overall={overall}
          isLoading={isLoading}
        />
      </div>
      <div className="md:col-span-2">
        <WwqDetailAnswerCard answers={answers} isLoading={isLoading} />
      </div>
    </div>
  );
};
