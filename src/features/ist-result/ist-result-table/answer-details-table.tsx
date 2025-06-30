"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useGetAnswerDetailsResult } from "@/hooks/api/ist-result/use-get-answer-details-result";
import { parseFourthAnswerTemplate } from "@/lib/ist-utils";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface SubtestAnswerDetails {
  id: string;
  name: string;
  fullName: string;
  rawScore: number;
  totalAnswered: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

interface AnswerDetailsTableProps {
  subtests: SubtestAnswerDetails[];
  slug: string;
}

export function AnswerDetailsTable({
  subtests,
  slug,
}: AnswerDetailsTableProps) {
  const { data, isLoading } = useGetAnswerDetailsResult(slug);
  const totals = subtests.reduce(
    (acc, subtest) => {
      return {
        rawScore: acc.rawScore + subtest.rawScore,
        totalAnswered: acc.totalAnswered + subtest.totalAnswered,
        correctAnswers: acc.correctAnswers + subtest.correctAnswers,
        incorrectAnswers: acc.incorrectAnswers + subtest.incorrectAnswers,
      };
    },
    { rawScore: 0, totalAnswered: 0, correctAnswers: 0, incorrectAnswers: 0 },
  );

  const [expandedSubtests, setExpandedSubtests] = React.useState<{
    [key: string]: boolean;
  }>({});
  if (isLoading) {
    return <Skeleton className="col-span-2 h-96"></Skeleton>;
  }

  return (
    <Card className="col-span-2">
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-xl font-medium">Jawaban Lengkap</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto pt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[100px]">Subtest</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead className="text-center">Total Terjawab</TableHead>
              <TableHead className="text-center">Jawaban Benar</TableHead>
              <TableHead className="text-center">Jawaban Salah</TableHead>
              <TableHead className="text-center">RW (Raw Score)</TableHead>
              <TableHead className="text-center">SW (Standard Score)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((subtest) => {
              const isExpanded = expandedSubtests[subtest.id] || false;

              // Generate sample detailed answers for demonstration
              const detailedAnswers = Array.from({ length: 20 }, (_, i) => {
                const questionNumber = i + 1;
                const isCorrect =
                  questionNumber <= (subtest.correctAnswers ?? 0);
                return {
                  questionNumber,
                  participantAnswer: isCorrect ? "B" : "A",
                  correctAnswer: "B",
                  isCorrect,
                };
              });

              return (
                <React.Fragment key={subtest.id}>
                  <TableRow
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() =>
                      setExpandedSubtests({
                        ...expandedSubtests,
                        [subtest.id]: !isExpanded,
                      })
                    }
                  >
                    <TableCell>
                      <button
                        className="hover:bg-muted rounded-full p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedSubtests({
                            ...expandedSubtests,
                            [subtest.id]: !isExpanded,
                          });
                        }}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="font-medium">
                      {subtest.name}
                    </TableCell>
                    <TableCell>{subtest.fullName}</TableCell>
                    <TableCell className="text-center">
                      {subtest.totalAnswered}
                    </TableCell>
                    <TableCell className="text-center font-medium text-green-600">
                      {subtest.correctAnswers}
                    </TableCell>
                    <TableCell className="text-center font-medium text-red-600">
                      {subtest.incorrectAnswers}
                    </TableCell>
                    <TableCell className="text-center">
                      {subtest.rawScore}
                    </TableCell>
                    <TableCell className="text-center">
                      {subtest.correctAnswers}
                    </TableCell>
                  </TableRow>

                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={8} className="border-t-0 p-0">
                        <div className="bg-muted/30 p-4">
                          {subtest.subtestTemplateId === "4" && (
                            <div className="mb-2 flex space-x-3">
                              <div className="flex items-center justify-center space-x-1 text-green-600 dark:text-green-400">
                                <div className="aspect-square h-2 rounded-xs bg-green-600 dark:bg-green-400"></div>
                                <span>Skor 2</span>
                              </div>
                              <div className="flex items-center justify-center space-x-1 text-blue-600 dark:text-blue-400">
                                <div className="aspect-square h-2 rounded-xs bg-blue-600 dark:bg-blue-400"></div>
                                <span>Skor 1</span>
                              </div>
                            </div>
                          )}
                          <div className="grid grid-cols-5 gap-2">
                            {subtest.detailAnswers
                              .sort(
                                (a, b) => a.questionNumber - b.questionNumber,
                              )
                              .map((answer) => (
                                <div
                                  key={answer.questionNumber}
                                  className={`rounded-md border p-2 ${
                                    answer.isCorrect
                                      ? "border-green-200 bg-green-50"
                                      : "border-red-200 bg-red-50"
                                  }`}
                                >
                                  <div className="text-xs font-medium">
                                    Soal {answer.questionNumber}
                                  </div>
                                  <div className="mt-1 grid grid-cols-2 gap-1">
                                    <div className="text-xs text-wrap">
                                      <p className="text-muted-foreground">
                                        Jawaban:
                                      </p>
                                      <p
                                        className={
                                          answer.isCorrect
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }
                                      >
                                        {answer.participantAnswer}
                                      </p>
                                    </div>
                                    <div className="text-xs text-wrap">
                                      <p className="text-muted-foreground">
                                        Benar:
                                      </p>
                                      {subtest.subtestTemplateId !== "4" ? (
                                        <p className="truncate text-wrap text-green-600">
                                          {answer.correctAnswers}
                                        </p>
                                      ) : (
                                        <p className="text-green-600">
                                          {renderFourthAnswer(
                                            answer.correctAnswers ?? undefined,
                                          )}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const renderFourthAnswer = (str?: string) => {
  const parsed = parseFourthAnswerTemplate(str);
  return parsed.map((p) => (
    <span
      key={p.score}
      className={cn(
        p.score === "2"
          ? "text-green-600 dark:text-green-400"
          : "text-blue-600 dark:text-blue-400",
      )}
    >
      {p.data.join(", ")}{" "}
    </span>
  ));
};
