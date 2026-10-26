"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWwqResult } from "@/hooks/use-wwq-result-context";
import { localDate } from "@/lib/date-utils";
import { WwqParticipantInfoCard } from "./participant-info-card";
import { WwqRadarChart } from "./radar-chart";
import { WwqCategoryBadge, WwqResultTable } from "./table-card";
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
  const { invitationId, results, overall, answers, isLoading } = useWwqResult();

  const chartData = results.map((r) => ({
    aspect: r.aspect,
    percent: Number(r.percent.toFixed(2)),
    score: r.rawScore,
    category: r.category,
  }));

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-3">
        <WwqParticipantInfoCard slug={invitationId} />
        <WwqOverallResultCard />
      </div>
      <WwqRadarChart chartData={chartData} isLoading={isLoading} />
      <div className="col-span-2">
        <WwqResultTable
          data={results}
          overall={overall}
          isLoading={isLoading}
        />
      </div>
      <div className="col-span-2">
        <WwqDetailAnswerCard answers={answers} isLoading={isLoading} />
      </div>
    </div>
  );
};
