"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { LoaderSpinner } from "@/components/ui/loading-spinner";
import { useGetQuestionAndOptions } from "@/hooks/api/ist-test/use-ist-test";
import { useSubmitIstAnswers } from "@/hooks/api/ist-test/use-submit-answer-ist";
import { PAGE_URLS } from "@/lib/page-url";
import { testData } from "@/lib/test-data";
import { AlertCircle } from "lucide-react";
import Footer from "./footer";
import Header from "./header";
import { IstTestQuestionWrapper } from "./ist-test-question-wrapper";

export function IstSelectedTest({
  slug,
  type,
}: {
  slug: string;
  type: string;
}) {
  const router = useRouter();
  const subtestId = Number.parseInt(type);
  const { data: question } = useGetQuestionAndOptions(slug, type);
  const SUBTEST_TIME = question?.timeLimit ? question.timeLimit * 60 : 300; // Convert minutes to seconds, default to 5 minutes (300 seconds)
  const [answers, setAnswers] = useState<{ questionId: string; answer: any }[]>(
    [],
  );
  const [timerActive, setTimerActive] = useState(true);
  const [timeExpired, setTimeExpired] = useState(false);
  const [remainingTime, setRemainingTime] = useState(SUBTEST_TIME);
  const submitIstAnswers = useSubmitIstAnswers();
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("ini jawaban: ", answers);

  // Validate subtest ID
  if (isNaN(subtestId) || subtestId < 0 || subtestId > 9) {
    router.push(PAGE_URLS.IST_SUBTEST(slug));
    return null;
  }

  const currentSubtestData = testData[subtestId];
  const totalQuestions = question?.questions.length ?? 0;

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => {
      const existingIndex = prev.findIndex((a) => a.questionId === questionId);
      if (existingIndex !== -1) {
        // Update existing answer
        const updated = [...prev];
        updated[existingIndex] = { questionId, answer };
        return updated;
      } else {
        // Add new answer
        return [...prev, { questionId, answer }];
      }
    });
  };

  const handleBackToSelection = () => {
    router.back();
  };

  const handleCompleteSubtest = async () => {
    if (!question?.istResultId) return;
    setIsSubmitting(true);
    try {
      await submitIstAnswers.mutateAsync({
        istResultId: question.istResultId,
        answers: answers.map((a) => ({
          questionId: a.questionId,
          answer:
            typeof a.answer === "string" ? a.answer : JSON.stringify(a.answer),
        })),
      });
      router.push(PAGE_URLS.IST_SUBTEST(slug));
    } catch (e) {
      // Optionally handle error (e.g., show toast)
      console.error("Failed to submit answers", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    setTimeExpired(true);
    setTimerActive(false);
  };

  const handleContinueAfterTimeUp = () => {
    router.push(PAGE_URLS.IST_SUBTEST(slug));
  };

  const handleTimeUpdate = (timeLeft: number) => {
    setRemainingTime(timeLeft);
  };

  const isSubtestCompleted = () => {
    if (!question?.questions) return false;
    // Return true if at least one question in the current subtest has an answer
    for (let i = 0; i < totalQuestions; i++) {
      const questionId = String(question.questions[i]?.id);
      const answerObj = answers.find((a) => a.questionId === questionId);
      const currentAnswer = answerObj?.answer;
      if (currentSubtestData?.type === "radio") {
        if (currentAnswer !== undefined) return true;
      } else if (currentSubtestData?.type === "text") {
        if (currentAnswer && currentAnswer.trim() !== "") return true;
      } else if (currentSubtestData?.type === "number-selection") {
        if (currentAnswer && currentAnswer.length > 0) return true;
      }
    }
    return false;
  };

  if (timeExpired) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-4">
        <Card className="mx-auto w-full max-w-md border shadow-md">
          <CardContent className="p-6 text-center sm:p-8">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full p-4">
                <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12" />
              </div>
            </div>
            <h2 className="mb-4 text-xl font-bold sm:text-2xl">Waktu Habis!</h2>
            <p className="mb-6">
              Waktu untuk{" "}
              <span className="font-semibold">{question?.name}</span> telah
              habis.
            </p>
            <Button onClick={handleContinueAfterTimeUp} className="w-full">
              Kembali ke Pilihan Subtes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="flex h-screen w-screen flex-row items-center justify-center gap-x-4 text-xl">
        <LoaderSpinner /> <div>Menyimpan jawaban...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {question ? (
        <>
          {/* Sticky Header with Timer */}
          <Header
            question={question}
            SUBTEST_TIME={SUBTEST_TIME}
            timerActive={timerActive}
            handleBackToSelection={handleBackToSelection}
            handleTimeUp={handleTimeUp}
          />

          {/* Main Content */}
          <div className="mx-auto max-w-4xl px-4 py-4 sm:py-6">
            <Card className="border shadow-md">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="mb-6 space-y-8 sm:mb-8 sm:space-y-10">
                  <div className="text-lg leading-tight font-bold sm:text-xl">
                    {question?.name}
                  </div>
                  <div>{question?.description}</div>
                  {/* <Image
                    src={`/contoh_soal/${type}.webp`}
                    alt="Contoh Soal"
                    width={500}
                    height={300}
                    className="mb-6 h-auto w-full rounded-lg"
                  /> */}
                  <IstTestQuestionWrapper
                    type={type}
                    questions={question?.questions ?? []}
                    answers={answers}
                    handleAnswer={handleAnswer}
                    totalQuestions={totalQuestions}
                  />
                </div>
                {/* Footer Content */}
                <Footer
                  handleBackToSelection={handleBackToSelection}
                  handleCompleteSubtest={handleCompleteSubtest}
                  isSubtestCompleted={isSubtestCompleted}
                  isSubmitted={isSubmitting}
                />
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="flex h-screen w-screen flex-row items-center justify-center gap-x-4 text-xl">
          <LoaderSpinner /> <div>Preparing Question...</div>
        </div>
      )}
    </div>
  );
}
