"use client";
import { usePapiKostickResult } from "@/hooks/use-papi-kostick-result-context";
import { PapiKostickParticipantInfoCard } from "./participant-info-card";
import { PapiKostickRadarChart } from "./radar-chart";
import { PapiKostickResultTable } from "./table-card";
import { PapiKostickResultBarChart } from "./bar-chart-card";
import { PapiKostickDetailAnswerCard } from "./detail-answer-card";

export const PapiKostickInvitationResultWrapper = () => {
  const { invitationId, results, isLoading, answers } = usePapiKostickResult();
  console.log("result", results);
  return (
    <div className="grid grid-cols-2 gap-3">
      <PapiKostickParticipantInfoCard slug={invitationId} />
      <PapiKostickRadarChart
        chartData={results.map((r) => ({
          factor: r.factor ?? "",
          score: r.score ?? 0,
        }))}
        isLoading={isLoading}
      />
      <div className="col-span-2">
        <PapiKostickResultBarChart data={results} isLoading={isLoading} />
      </div>
      <div className="col-span-2">
        <PapiKostickResultTable data={results} isLoading={isLoading} />
      </div>
      <div className="col-span-2">
        <PapiKostickDetailAnswerCard isLoading={isLoading} answers={answers} />
      </div>
    </div>
  );
};
