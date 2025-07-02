"use client";
import { useInitIstResultCalculation } from "@/hooks/api/ist-result/use-init-result-calculation";
import {
  CriteriaInfoCard,
  ParticipantInfoCard,
  SummaryScoreCard,
} from "../ist-result-info";
import { AnswerDetailsTable } from "../ist-result-table";
import { LoaderSpinner } from "@/components/ui/loading-spinner";
import { IstResultDetailProvider } from "@/hooks/use-ist-result-detail";

export const IstResultWrapper = ({ slug }: { slug: string }) => {
  const { isLoading } = useInitIstResultCalculation(slug);
  if (isLoading) {
    return (
      <div className="flex min-h-[100vh] w-full items-center justify-center gap-x-4 text-xl">
        <LoaderSpinner />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-4">
      <IstResultDetailProvider slug={slug}>
        <ParticipantInfoCard slug={slug} />
        <SummaryScoreCard slug={slug} />
        {/* From ISTResult */}
        <CriteriaInfoCard slug={slug} />
        {/* From ISTResultClassification */}
        <AnswerDetailsTable slug={slug} />
      </IstResultDetailProvider>
      {/* From ISTResult */}
    </div>
  );
};
