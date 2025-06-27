"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { z } from "zod";
import type { IstReviewFormWrapperDataProps } from "./types";
import { useSubmitCorrection } from "@/hooks/api/ist-review/use-submit-correction";
import { useReviewForm } from "@/hooks/use-review-form-context";
import { useMemo } from "react";

const answerSchema = z.array(
  z.object({
    score: z.string(),
    data: z.array(z.string()),
  }),
);
export const ReviewFormText = (props: IstReviewFormWrapperDataProps) => {
  const answersJson = props.correctAnswer
    ? answerSchema.parse(JSON.parse(props.correctAnswer))
    : [];
  const { isLoadingCorrection, updateData } = useReviewForm();
  const onClickCorrection = (isCorrect: boolean, score: number | null) => {
    updateData(props.id, { score, isCorrect });
  };
  const isLoading = useMemo(
    () => isLoadingCorrection?.id === props.id && isLoadingCorrection.isLoading,
    [isLoadingCorrection],
  );
  const selectColor = (isMatch: boolean, index: number) => {
    if (isMatch) {
      return index === 0 ? "positive" : "positiveBlue";
    }
    return "outline";
  };
  return (
    <div key={props.id} className="bg-muted rounded-lg border p-3">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-xs font-bold text-white">
            {props.order}
          </div>
          <span className="max-w-lg truncate text-sm font-medium">
            {props.text ? props.text : "-"}
          </span>
        </div>
      </div>
      <div className="flex w-full gap-4 text-sm">
        <div className="flex w-full gap-2">
          <span className="text-muted-foreground">Jawaban:</span>
          <div className="flex w-full flex-col space-y-2">
            <Textarea
              className="bg-background"
              defaultValue={props.userAnswer}
            />
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant={
                  props.isCorrect === true && props.score === 2
                    ? "default"
                    : "outline"
                }
                isLoading={isLoading}
                onClick={() => onClickCorrection(true, 2)}
                className={`h-7 text-xs`}
              >
                <ThumbsUp className="mr-1 h-3 w-3" />
                Benar Score 2
              </Button>
              <Button
                size="sm"
                variant={
                  props.isCorrect === true && props.score === 1
                    ? "default"
                    : "outline"
                }
                isLoading={isLoading}
                onClick={() => onClickCorrection(true, 1)}
                className={`h-7 text-xs`}
              >
                <ThumbsUp className="mr-1 h-3 w-3" />
                Benar Score 1
              </Button>
              <Button
                size="sm"
                variant={props.isCorrect === false ? "default" : "outline"}
                isLoading={isLoading}
                onClick={() => onClickCorrection(false, null)}
                className="h-7 text-xs"
              >
                <ThumbsDown className="mr-1 h-3 w-3" />
                Salah
              </Button>
            </div>
          </div>
        </div>

        <p>Opsi: </p>
        <Table className="w-full rounded-t-md border">
          <TableHeader>
            <TableRow>
              {answersJson.map((item, index) => (
                <TableHead key={index}>Skor {item.score}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              {answersJson.map((item, index) => (
                <TableCell key={index} className="space-x-1">
                  {item.data.map((d) => {
                    const isMatch =
                      d.toLowerCase() === props.userAnswer?.toLowerCase();
                    return (
                      <Badge variant={selectColor(isMatch, index)} key={d}>
                        {d}
                      </Badge>
                    );
                  })}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
