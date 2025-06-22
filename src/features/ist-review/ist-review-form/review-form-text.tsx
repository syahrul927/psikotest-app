import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { IstReviewFormWrapperDataProps } from "./types";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";

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
            <Textarea className="bg-background" value={props.userAnswer} />
            <div className="flex space-x-1">
              <Button size="sm" className={`h-7 text-xs`}>
                <ThumbsUp className="mr-1 h-3 w-3" />
                Setuju
              </Button>
              <Button size="sm" className="h-7 text-xs">
                <ThumbsDown className="mr-1 h-3 w-3" />
                Tolak
              </Button>
            </div>
          </div>
        </div>

        <Table className="w-full rounded-t-md">
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
                  {item.data.map((d) => (
                    <Badge
                      className={cn(
                        item.score === "2" ? "bg-amber-600" : "bg-indigo-600",
                        "text-white",
                      )}
                    >
                      {d}
                    </Badge>
                  ))}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
