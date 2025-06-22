"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetAnswerReviewIst } from "@/hooks/api/ist-review/use-get-answer-review-ist";
import { IstReviewFormWrapper } from "./review-form-wrapper";

export const IstReviewFormParent = ({ slug }: { slug: string }) => {
  const { data, isLoading } = useGetAnswerReviewIst(slug);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-96 w-full" />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {data?.map((item) => <IstReviewFormWrapper key={item.id} {...item} />)}
    </div>
  );
};
