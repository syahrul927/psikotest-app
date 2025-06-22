import { CheckCircle2, XCircle } from "lucide-react";
import type { IstReviewFormWrapperDataProps } from "./types";
import { Badge } from "@/components/ui/badge";

export const ReviewFormNumber = (props: IstReviewFormWrapperDataProps) => {
  const sortedCorrectAnswer = props.correctAnswer?.split("").sort().join("");
  const isCorrect = props.userAnswer == sortedCorrectAnswer;
  return (
    <div key={props.id} className="bg-muted rounded-lg border p-3">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-600 text-xs font-bold text-white">
            {props.order}
          </div>
          <span className="text-sm font-medium">
            {props.text ? props.text : "-"}
          </span>
        </div>
      </div>
      <div className="ml-7 flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Jawaban:</span>
          <div className="flex gap-1">{props.userAnswer}</div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Benar:</span>
          <div className="flex gap-1">{sortedCorrectAnswer}</div>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Benar (terurut):</span>
          <div className="flex gap-1">{props.correctAnswer}</div>
        </div>
        {isCorrect ? (
          <Badge variant="positive">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Benar
          </Badge>
        ) : (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Salah
          </Badge>
        )}
      </div>
    </div>
  );
};
