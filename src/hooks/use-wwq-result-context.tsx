"use client";
import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useGetResultWwqInvitation } from "./api/wwq-invitation/use-get-result-wwq-invitation";
import { useGetAnswersWwq } from "./api/wwq-invitation/use-get-answers-wwq";

export interface WwqAspectResultType {
  aspectNo: number;
  aspect: string;
  rawScore: number;
  acuan: number;
  weighted: number;
  percent: number;
  category: string;
}
export interface WwqOverallResultType {
  totalWeighted: number;
  overallValue: number;
  category: string;
  completedAt: Date;
}
export interface WwqAnswersResultType {
  questionId: string;
  answer: boolean;
}

interface WwqContextType {
  results: WwqAspectResultType[];
  overall: WwqOverallResultType | null;
  answers: WwqAnswersResultType[];
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  invitationId: string;
}

const WwqContext = createContext<WwqContextType | undefined>(undefined);

export const WwqResultProvider: React.FC<{
  children: ReactNode;
  slug: string;
}> = ({ children, slug }) => {
  const {
    data,
    isLoading: isLoadingResult,
    isError: isErrorResult,
    error: resultError,
  } = useGetResultWwqInvitation(slug);
  const { data: answerRows, isLoading: isLoadingAnswer } =
    useGetAnswersWwq(slug);
  const isLoading = useMemo(
    () => [isLoadingAnswer, isLoadingResult].some((d) => d),
    [isLoadingResult, isLoadingAnswer],
  );
  const results: WwqAspectResultType[] = useMemo(
    () => data?.details ?? [],
    [data],
  );
  const overall: WwqOverallResultType | null = useMemo(
    () => data?.result ?? null,
    [data],
  );

  // getDetailAnswers returns the raw WwqAnswer rows, keep only what the UI needs
  const answers: WwqAnswersResultType[] = useMemo(
    () =>
      answerRows?.map((a) => ({
        questionId: a.questionId,
        answer: a.answer,
      })) ?? [],
    [answerRows],
  );

  // getResult throws when the invitation has no saved result yet (non-DONE),
  // surface it so the page can render a single empty state instead of halves
  const isError = isErrorResult;
  const error: string | null = useMemo(
    () => resultError?.message ?? null,
    [resultError],
  );

  const value = useMemo<WwqContextType>(
    () => ({
      results,
      overall,
      answers,
      isLoading,
      isError,
      error,
      invitationId: slug,
    }),
    [results, overall, answers, isLoading, isError, error, slug],
  );

  return (
    <WwqContext.Provider value={value}>{children}</WwqContext.Provider>
  );
};

export const useWwqResult = () => {
  const context = useContext(WwqContext);
  if (!context) {
    throw new Error("useWwqResult must be used within a WwqResultProvider");
  }
  return context;
};
