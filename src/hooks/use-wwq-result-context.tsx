"use client";
import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useGetResultWwqInvitation } from "./api/wwq-invitation/use-get-result-wwq-invitation";
import { useGetAnswersWwq } from "./api/wwq-invitation/use-get-answers-wwq";

// Define your type
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

// Context type
interface WwqContextType {
  results: WwqAspectResultType[];
  overall: WwqOverallResultType | null;
  answers: WwqAnswersResultType[];
  isLoading: boolean;
  invitationId: string;
}

// Create context
const WwqContext = createContext<WwqContextType | undefined>(undefined);

// Provider component
export const WwqResultProvider: React.FC<{
  children: ReactNode;
  slug: string;
}> = ({ children, slug }) => {
  const { data, isLoading: isLoadingResult } = useGetResultWwqInvitation(slug);
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

  return (
    <WwqContext.Provider
      value={{
        results,
        overall,
        answers,
        isLoading,
        invitationId: slug,
      }}
    >
      {children}
    </WwqContext.Provider>
  );
};

// Custom hook
export const useWwqResult = () => {
  const context = useContext(WwqContext);
  if (!context) {
    throw new Error("useWwqResult must be used within a WwqResultProvider");
  }
  return context;
};
