import type { RouterOutputs } from "@/trpc/react";
import { createContext, useContext, type ReactNode } from "react";
import { useGetAnswerDetailsResult } from "./api/ist-result/use-get-answer-details-result";
import { useGetSummaryScore } from "./api/ist-result/use-get-summary-score";

export type IstResultDetailInfo =
  RouterOutputs["istResult"]["getAnswerDetailsResult"];

export type IstSummaryResultScore =
  RouterOutputs["istResult"]["getSummaryScoreResult"];

type IstResultDetailContextType = {
  data: IstResultDetailInfo;
  summary?: IstSummaryResultScore;
  isLoading: boolean;
};

const IstResultDetailContext = createContext<
  IstResultDetailContextType | undefined
>(undefined);

export const IstResultDetailProvider = ({
  children,
  slug,
}: {
  children: ReactNode;
  slug: string;
}) => {
  const { data, isLoading: isLoadingDetail } = useGetAnswerDetailsResult(slug);
  const { data: summary, isLoading: isLoadingSummary } =
    useGetSummaryScore(slug);
  const isLoading = [isLoadingDetail, isLoadingSummary].some((t) => t);
  return (
    <IstResultDetailContext.Provider
      value={{ data: data ?? [], summary, isLoading }}
    >
      {children}
    </IstResultDetailContext.Provider>
  );
};

// Hook
export const useIstResultDetailInfo = () => {
  const context = useContext(IstResultDetailContext);
  if (!context) {
    throw new Error(
      "useIstResultDetail must be used within an IstResultDetailProvider",
    );
  }
  return context;
};
