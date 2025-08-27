"use client";
import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useGetResultPapiKostickInvitation } from "./api/papi-kostick-invitation/use-get-result-papi-kostick-invitation";
import { useGetAnswerDetailsResult } from "./api/ist-result/use-get-answer-details-result";
import { useGetAnswersPapiKostick } from "./api/papi-kostick-invitation/use-get-answers-papi-kostick";

// Define your type
export interface PapiKostickResultType {
  category: string | null;
  aspect: string | null;
  factor: string | null;
  score: number | null;
  interpretation: string | null;
}
export interface PapiKostickAnswersResultType {
  questionNumber: number;
  answer: string;
}

// Context type
interface PapiKostickContextType {
  results: PapiKostickResultType[];
  answers: PapiKostickAnswersResultType[];
  isLoading: boolean;
  invitationId: string;
}

// Create context
const PapiKostickContext = createContext<PapiKostickContextType | undefined>(
  undefined,
);

// Provider component
export const PapiKostickResultProvider: React.FC<{
  children: ReactNode;
  slug: string;
}> = ({ children, slug }) => {
  const { data, isLoading: isLoadingResult } =
    useGetResultPapiKostickInvitation(slug);
  const { data: answers, isLoading: isLoadingAnswer } =
    useGetAnswersPapiKostick(slug);
  const isLoading = useMemo(
    () => [isLoadingAnswer, isLoadingResult].some((d) => d),
    [isLoadingResult, isLoadingAnswer],
  );
  const results: PapiKostickResultType[] = useMemo(() => {
    return (
      data?.map((d) => ({
        category: d.category,
        aspect: d.aspect,
        factor: d.factor,
        score: d.score,
        interpretation: d.interpretation,
      })) ?? []
    );
  }, [data]);

  return (
    <PapiKostickContext.Provider
      value={{
        results,
        invitationId: slug,
        isLoading,
        answers:
          answers?.map((a) => ({
            questionNumber: Number(a.questionId),
            answer: a.answer,
          })) ?? [],
      }}
    >
      {children}
    </PapiKostickContext.Provider>
  );
};

// Custom hook
export const usePapiKostickResult = () => {
  const context = useContext(PapiKostickContext);
  if (!context) {
    throw new Error("usePapiKostick must be used within a PapiKostickProvider");
  }
  return context; // only expose the array
};
