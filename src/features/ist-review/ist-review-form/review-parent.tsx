"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAnswerReviewIst } from "@/hooks/api/ist-review/use-get-answer-review-ist";
import { IstReviewFormWrapper } from "./review-form-wrapper";
import { Badge } from "@/components/ui/badge";

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
    <Accordion type="multiple" className="flex flex-col gap-3">
      {data?.map((item) => {
        return (
          <AccordionItem key={item.id} value={item.id}>
            <Card>
              <CardHeader className="relative">
                <AccordionTrigger className="cursor-pointer py-0">
                  <CardTitle className="flex-1">{item.title}</CardTitle>
                  <span>
                    <Badge variant={"outline"}>
                      {item.totalCorrect} / {item.data.length}
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
