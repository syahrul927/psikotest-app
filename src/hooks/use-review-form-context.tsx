"use client";
import type {
  IstReviewFormWrapperDataProps,
  IstReviewFormWrapperProps,
} from "@/features/ist-review/";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useGetAnswerReviewIst } from "./api/ist-review/use-get-answer-review-ist";
import { useSubmitCorrection } from "./api/ist-review/use-submit-correction";

interface ReviewFormContextType {
  reviewData: IstReviewFormWrapperProps[];
  unTouchedFourthForm: boolean;
  isLoadingGetAll?: boolean;
  isLoadingCorrection?: {
    id?: string;
    isLoading?: boolean;
  };
  updateData: (
    id: string,
    updates: Pick<IstReviewFormWrapperDataProps, "isCorrect" | "score">,
  ) => void;
}

const ReviewFormContext = createContext<ReviewFormContextType | undefined>(
  undefined,
);

export const useReviewForm = () => {
  const context = useContext(ReviewFormContext);
  if (!context)
    throw new Error("useReviewForm must be used within a ReviewFormProvider");
  return context;
};

export const ReviewFormProvider: React.FC<{
  children: React.ReactNode;
  slug: string;
}> = ({ children, slug }) => {
  const { data, isLoading: isLoadingGetAll } = useGetAnswerReviewIst(slug);
  const { mutate, isPending: isLoadingSubmitCorrection } =
    useSubmitCorrection();
  const [currentCorrectionId, setCurrentCorrectionId] = useState<string>();
  const [reviewData, setReviewData] = useState<IstReviewFormWrapperProps[]>([]);
  const unTouchedFourthForm = useMemo(() => {
    const fourthForm = reviewData.find((item) => item.type === "4");
    if (fourthForm) {
      return fourthForm.data.every((data) => data.isCorrect === null);
    }
    return false;
  }, [reviewData]);

  const isLoadingCorrection = useMemo(
    () => ({
      id: currentCorrectionId,
      isLoading: isLoadingSubmitCorrection,
    }),
    [isLoadingSubmitCorrection],
  );

  useEffect(() => {
    if (data) {
      setReviewData(data);
    }
  }, [data]);

  const updateData = (
    id: string,
    updates: Pick<IstReviewFormWrapperDataProps, "isCorrect" | "score">,
  ) => {
    setCurrentCorrectionId(id);
    setReviewData((prev) =>
      prev.map((form) => {
        const updatedItems = form.data.map((item) => {
          if (item.id === id) {
            const updatedItem = { ...item, ...updates };

            return updatedItem;
          }
          return item;
        });

        const totalCorrect = updatedItems.filter(
          (item) => item.isCorrect === true,
        ).length;

        return {
          ...form,
          data: updatedItems,
          totalCorrect,
        };
      }),
    );

    mutate({
      id,
      score: updates.score,
      isCorrect: updates.isCorrect,
    });
  };

  return (
    <ReviewFormContext.Provider
      value={{
        reviewData,
        updateData,
        isLoadingGetAll,
        isLoadingCorrection,
        unTouchedFourthForm,
      }}
    >
      {children}
    </ReviewFormContext.Provider>
  );
};
