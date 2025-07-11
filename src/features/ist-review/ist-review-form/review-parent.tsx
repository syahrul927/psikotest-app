"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useReviewForm } from "@/hooks/use-review-form-context";
import { cn } from "@/lib/utils";
import { IstReviewFormWrapper } from "./review-form-wrapper";
import type { IstReviewFormWrapperDataProps } from "./types";

export const IstReviewFormParent = ({ slug }: { slug: string }) => {
  const {
    isLoadingGetAll: isLoading,
    reviewData: data,
    unTouchedFourthForm,
  } = useReviewForm();

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
    <Accordion type="multiple" className="flex flex-col gap-3">
      {data?.map((item) => {
        return (
          <AccordionItem key={item.id} value={item.id}>
            <Card
              className={cn(
                unTouchedFourthForm &&
                  "border-amber-600 bg-amber-200/30 dark:border-amber-400 dark:bg-amber-900/30",
              )}
            >
              <CardHeader className="relative">
                <AccordionTrigger className="cursor-pointer py-0">
                  <CardTitle className="flex-1">{item.title}</CardTitle>
                  <span>
                    <Badge variant={"outline"}>
                      {item.totalCorrect} /{" "}
                      {item.data.length * (item.type === "4" ? 2 : 1)}
                    </Badge>
                  </span>
                </AccordionTrigger>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <AccordionContent>
                <CardContent>
                  <IstReviewFormWrapper {...item} />
                </CardContent>
              </AccordionContent>
            </Card>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
