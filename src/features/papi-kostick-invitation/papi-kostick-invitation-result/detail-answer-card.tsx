import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AnswerDetailsProps {
  answers: { questionNumber: number; answer: string }[];
  isLoading?: boolean;
}

export function PapiKostickDetailAnswerCard({
  answers,
  isLoading,
}: AnswerDetailsProps) {
  if (isLoading) return <Skeleton className="h-96 w-full" />;
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
        <div className="grid grid-cols-9 grid-rows-10 gap-2 font-mono text-sm">
          {answers.map((answer) => (
            <div
              key={answer.questionNumber}
              className="flex items-center justify-center rounded border border-slate-200 p-2 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              <span className="mr-1 text-slate-700 dark:text-slate-300">
                {answer.questionNumber}
              </span>
              <Badge
                variant={answer.answer === "A" ? "default" : "secondary"}
                className={`flex h-4 min-w-[16px] items-center justify-center font-mono text-xs font-bold ${
                  answer.answer === "A"
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                    : "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-100"
                } `}
              >
                {answer.answer}
              </Badge>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
          <div className="flex justify-around text-sm">
            <div className="flex items-center space-x-2">
              <Badge className="bg-slate-900 font-mono text-xs text-white dark:bg-slate-100 dark:text-slate-900">
                A
              </Badge>
              <span className="text-slate-600 dark:text-slate-400">
                {answers.filter((a) => a.answer === "A").length} Terpilih
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-slate-200 font-mono text-xs text-slate-900 dark:bg-slate-700 dark:text-slate-100">
                B
              </Badge>
              <span className="text-slate-600 dark:text-slate-400">
                {answers.filter((a) => a.answer === "B").length} Terpilih
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
