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
            <Textarea
              className="bg-background"
              defaultValue={props.userAnswer}
            />
            <div className="flex space-x-1">
              <Button size="sm" variant={"outline"} className={`h-7 text-xs`}>
                <ThumbsUp className="mr-1 h-3 w-3" />
                Benar
              </Button>
              <Button size="sm" variant={"ghost"} className="h-7 text-xs">
                <ThumbsDown className="mr-1 h-3 w-3" />
                Salah
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
                  {item.data.map((d) => {
                    const isMatch =
                      d.toLowerCase() === props.userAnswer?.toLowerCase();
                    return (
                      <Badge variant={isMatch ? "positive" : "outline"} key={d}>
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
