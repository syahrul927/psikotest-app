"use client";
import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFindAllQuestions } from "@/hooks/api/wwq-test/use-find-all-questions";
import type { WwqAnswersResultType } from "@/hooks/use-wwq-result-context";

interface WwqDetailAnswerCardProps {
  answers: WwqAnswersResultType[];
  isLoading?: boolean;
}

export function WwqDetailAnswerCard({
  answers,
  isLoading,
}: WwqDetailAnswerCardProps) {
  // Answers store the DB question id (cuid), so map it back to the question order
  const { data: questions, isLoading: isLoadingQuestions } =
    useFindAllQuestions();

  const orderedAnswers = useMemo(() => {
    const orderById = new Map(questions?.map((q) => [q.id, q.order]));
    return answers
      .map((answer) => ({
        ...answer,
        // undefined when the question can't be resolved (e.g. lookup failed);
        // keep it undefined so the UI can show a dash instead of "Pertanyaan 0"
        order: orderById.get(answer.questionId),
      }))
      .sort(
        (a, b) =>
          (a.order ?? Number.POSITIVE_INFINITY) -
          (b.order ?? Number.POSITIVE_INFINITY),
      );
  }, [answers, questions]);

  if (isLoading || isLoadingQuestions) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <Card className="w-full border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <CardHeader className="border-b border-slate-200 dark:border-slate-700">
        <CardTitle className="text-slate-900 dark:text-slate-100">
          Detail Jawaban
        </CardTitle>
        <CardDescription className="text-slate-600 dark:text-slate-400">
          Daftar Lengkap Jawaban Pertanyaan ({answers.length} Pertanyaan)
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-2 font-mono text-sm sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {orderedAnswers.map((answer) => (
            <div
              key={answer.questionId}
              className="flex items-center justify-between gap-2 rounded border border-slate-200 p-2 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <span className="text-slate-700 dark:text-slate-300">
                Pertanyaan {answer.order ?? "—"}
              </span>
              <Badge
                variant={answer.answer ? "default" : "secondary"}
                className={`flex h-5 min-w-[44px] items-center justify-center font-mono text-xs font-bold ${
                  answer.answer
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100"
                } `}
              >
                {answer.answer ? "YA" : "TIDAK"}
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
          <div className="flex justify-around text-sm">
            <div className="flex items-center space-x-2">
              <Badge className="bg-slate-900 font-mono text-xs text-white dark:bg-slate-100 dark:text-slate-900">
                YA
              </Badge>
              <span className="text-slate-600 dark:text-slate-400">
                {answers.filter((a) => a.answer).length} Terpilih
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-slate-200 font-mono text-xs text-slate-900 dark:bg-slate-700 dark:text-slate-100">
                TIDAK
              </Badge>
              <span className="text-slate-600 dark:text-slate-400">
                {answers.filter((a) => !a.answer).length} Terpilih
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
