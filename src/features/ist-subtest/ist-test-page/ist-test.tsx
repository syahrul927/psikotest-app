"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { testData } from "@/lib/test-data";
import { AlertCircle, ArrowLeft, Brain } from "lucide-react";
import { Timer } from "@/components/timer";
import {
  NumberSelectionQuestion,
  RadioQuestion,
  TextQuestion,
} from "../ist-question-type";
import Image from "next/image";
import { useGetQuestionAndOptions } from "@/hooks/api/ist-test/use-ist-test";
import { LoaderSpinner } from "@/components/ui/loading-spinner";

export function IstSelectedTest({ slug }: { slug: string; type: string }) {
  const params = useParams();
  const router = useRouter();
  const subtestId = Number.parseInt(params.type as string);
  const [answers, setAnswers] = useState<Record<string, any>>(() => {
    // Initialize answers from localStorage if available
    if (typeof window !== "undefined") {
      const savedAnswers = localStorage.getItem(`ist-answers-${subtestId}`);
      return savedAnswers ? JSON.parse(savedAnswers) : {};
    }
    return {};
  });
  const [timerActive, setTimerActive] = useState(true);
  const [timeExpired, setTimeExpired] = useState(false);
  const [remainingTime, setRemainingTime] = useState(() => {
    // Initialize remaining time from localStorage if available
    if (typeof window !== "undefined") {
      const savedTime = localStorage.getItem(`ist-time-${subtestId}`);
      return savedTime ? parseInt(savedTime) : null;
    }
    return null;
  });

  const { data: question } = useGetQuestionAndOptions(params.type as string);

  console.log("ini pertanyaan: ", question?.questions);

  const SUBTEST_TIME = question?.timeLimit ? question.timeLimit * 60 : 300; // Convert minutes to seconds, default to 5 minutes (300 seconds)

  // Save answers to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      localStorage.setItem(`ist-answers-${subtestId}`, JSON.stringify(answers));
    }
  }, [answers, subtestId]);

  // Save remaining time when component unmounts or page unloads
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (remainingTime !== null) {
        localStorage.setItem(`ist-time-${subtestId}`, remainingTime.toString());
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      handleBeforeUnload(); // Save one last time when component unmounts
    };
  }, [remainingTime, subtestId]);

  // Validate subtest ID
  if (isNaN(subtestId) || subtestId < 0 || subtestId > 9) {
    router.push("/subtests");
    return null;
  }

  const currentSubtestData = testData[subtestId];
  const totalQuestions = question?.questions.length ?? 0;

  const handleAnswer = (questionIndex: number, answer: any) => {
    setAnswers({
      ...answers,
      [`${subtestId}-${questionIndex}`]: answer,
    });
  };

  const handleBackToSelection = () => {
    router.back();
  };

  const handleCompleteSubtest = () => {
    localStorage.removeItem(`ist-answers-${subtestId}`);
    localStorage.removeItem(`ist-time-${subtestId}`);
    console.log("Subtest completed:", answers);
    router.push(`/guest/ist/${slug}/subtest`);
  };

  const handleTimeUp = () => {
    setTimeExpired(true);
    setTimerActive(false);
  };

  const handleContinueAfterTimeUp = () => {
    router.push("/subtests");
  };

  const handleTimeUpdate = (timeLeft: number) => {
    setRemainingTime(timeLeft);
  };

  const isSubtestCompleted = () => {
    // Check if all questions in the current subtest have been answered
    for (let i = 0; i < totalQuestions; i++) {
      const currentAnswer = answers[`${subtestId}-${i}`];

      if (currentSubtestData?.type === "radio") {
        if (currentAnswer === undefined) return false;
      } else if (currentSubtestData?.type === "text") {
        if (!currentAnswer || currentAnswer.trim() === "") return false;
      } else if (currentSubtestData?.type === "number-selection") {
        if (!currentAnswer || currentAnswer.length === 0) return false;
      }
    }
    return true;
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

  return (
    <div className="min-h-screen">
      {question ? (
        <>
          {/* Sticky Header with Timer */}
          <div className="bg-background/80 sticky top-0 z-50 border-b shadow-sm backdrop-blur-lg">
            <div className="mx-auto max-w-4xl px-4 py-3 sm:py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBackToSelection}
                    className=""
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg p-1.5 sm:p-2">
                      <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div>
                      <h1 className="text-lg leading-tight font-bold sm:text-xl">
                        {question?.description}
                      </h1>
                      <p className="text-xs sm:text-sm">
                        {question?.questions?.length} Pertanyaan
                      </p>
                    </div>
                  </div>
                </div>
                <div className="self-end sm:ml-auto sm:self-auto">
                  <Timer
                    seconds={remainingTime ?? SUBTEST_TIME}
                    onTimeUp={handleTimeUp}
                    isActive={timerActive}
                    onTimeUpdate={handleTimeUpdate}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mx-auto max-w-4xl px-4 py-4 sm:py-6">
            <Card className="border shadow-md">
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="mb-6 space-y-8 sm:mb-8 sm:space-y-10">
                  <Image
                    src={`/contoh_soal/${params.type as string}.webp`}
                    alt="Contoh Soal"
                    width={500}
                    height={300}
                    className="mb-6 h-auto w-full rounded-lg"
                  />
                  {question?.questions.map((questionData: any, index) => (
                    <div
                      key={questionData.id}
                      className="border-b pb-6 last:border-b-0 last:pb-0 sm:pb-8"
                    >
                      {/* Question Number - Only show for non-number-selection types and not for subtest 5 & 6 */}
                      {subtestId !== 5 && subtestId !== 6 && (
                        <div className="mb-3 flex items-center gap-3 sm:mb-4">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold sm:h-8 sm:w-8">
                            {index + 1}
                          </div>
                          <h3 className="text-base font-semibold sm:text-lg">
                            Pertanyaan {index + 1} dari{" "}
                            {question?.questions.length}
                          </h3>
                        </div>
                      )}

                      {/* Question Text - Hide for number-selection type */}
                      {subtestId !== 5 && subtestId !== 6 && (
                        <p className="mb-4 text-lg leading-relaxed font-medium sm:mb-6 sm:text-xl">
                          {questionData?.text}
                        </p>
                      )}

                      {questionData?.text === "" && questionData?.imageUrl && (
                        <div className="flex w-full justify-center">
                          <Image
                            src={`/api/images/${questionData?.imageUrl}`}
                            alt={`Question ${index + 1}`}
                            width={250}
                            height={250}
                            className="mb-6 rounded-lg border-2 dark:invert"
                          />
                        </div>
                      )}

                      {/* Question Components */}
                      {(subtestId >= 1 && subtestId <= 3) ||
                      subtestId === 9 ||
                      subtestId === 7 ||
                      subtestId === 8 ? (
                        <RadioQuestion
                          question={questionData}
                          value={answers[`${subtestId}-${index}`]}
                          onChange={(value) => handleAnswer(index, value)}
                        />
                      ) : subtestId === 4 ? (
                        <TextQuestion
                          question={questionData}
                          value={answers[`${subtestId}-${index}`] || ""}
                          onChange={(value) => handleAnswer(index, value)}
                        />
                      ) : subtestId === 5 || subtestId === 6 ? (
                        <NumberSelectionQuestion
                          question={questionData}
                          value={answers[`${subtestId}-${index}`] || []}
                          onChange={(value: any) => handleAnswer(index, value)}
                          questionNumber={index + 1}
                          totalQuestions={totalQuestions}
                        />
                      ) : null}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:justify-between sm:gap-0 sm:pt-6">
                  <Button
                    variant="outline"
                    onClick={handleBackToSelection}
                    className="order-2 w-full px-4 sm:order-1 sm:w-auto sm:px-8"
                  >
                    Kembali ke Pilihan Subtes
                  </Button>
                  <Button
                    onClick={handleCompleteSubtest}
                    disabled={!isSubtestCompleted()}
                    className="order-1 w-full px-4 sm:order-2 sm:w-auto sm:px-8"
                  >
                    Selesaikan Subtes
                  </Button>
                </div>
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
