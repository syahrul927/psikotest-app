"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Timer } from "@/components/timer";
import {
  NumberSelectionQuestion,
  RadioQuestion,
  TextQuestion,
} from "@/features/ist-subtest/ist-question-type";
import { LoaderSpinner } from "@/components/ui/loading-spinner";
import Header from "@/features/ist-subtest/ist-test-page/header";
import Footer from "@/features/ist-subtest/ist-test-page/footer";
import { IstTestQuestionWrapper } from "@/features/ist-subtest/ist-test-page/ist-test-question-wrapper";
import { PAGE_URLS } from "@/lib/page-url";
import { IstWrapper } from "@/features/ist-subtest";
import { trainingData, getTrainingQuestions } from "@/lib/training-data";

function TrainingPageContent() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const type = params.type as string;
  
  const subtestId = Number.parseInt(type);
  const questions = getTrainingQuestions(type);
  const SUBTEST_TIME = trainingData.timeLimit * 60; // Convert minutes to seconds
  
  const [answers, setAnswers] = useState<{ questionId: string; answer: any }[]>([]);
  const [timerActive, setTimerActive] = useState(true);
  const [timeExpired, setTimeExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Validate subtest ID
  if (isNaN(subtestId) || subtestId < 0 || subtestId > 9) {
    router.push(PAGE_URLS.IST_SUBTEST(slug));
    return null;
  }

  const totalQuestions = questions.length;

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
    router.push(PAGE_URLS.IST_SUBTEST(slug));
  };

  const handleCompleteSubtest = () => {
    setIsSubmitting(true);
    // For training, just navigate back to subtest page without submitting
    setTimeout(() => {
      router.push(PAGE_URLS.IST_SUBTEST(slug));
    }, 500); // short delay for loader effect
  };

  const handleTimeUp = () => {
    setTimeExpired(true);
    setTimerActive(false);
  };

  const handleContinueAfterTimeUp = () => {
    router.push(PAGE_URLS.IST_SUBTEST(slug));
  };

  const isSubtestCompleted = () => {
    // For training, consider it completed if at least one question has an answer
    return answers.length > 0;
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen flex-row items-center justify-center gap-x-4 text-xl">
        <LoaderSpinner /> <div>Preparing Training...</div>
      </div>
    );
  }

  if (timeExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Waktu Latihan Habis</h2>
            <p className="text-muted-foreground mb-6">
              Waktu latihan telah berakhir. Anda akan diarahkan kembali ke halaman pilihan subtes.
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
        <div className="flex items-center gap-2">
          <LoaderSpinner />
          <span>Cleaning up training session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Sticky Header with Timer */}
      <Header
        question={{ ...trainingData, questions }}
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
                {trainingData.name} - Subtes {type}
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium mb-2">📝 Mode Latihan</p>
                <p className="text-blue-700 text-sm">
                  Ini adalah halaman latihan. Anda dapat mencoba menjawab pertanyaan tanpa khawatir tentang hasil akhir. 
                  Jawaban Anda tidak akan disimpan.
                </p>
              </div>
              <div>{trainingData.description}</div>
              
              <IstTestQuestionWrapper
                type={type}
                questions={questions}
                answers={answers}
                handleAnswer={handleAnswer}
                totalQuestions={totalQuestions}
                isTraining={true}
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
    </div>
  );
}

export default function TrainingPage() {
  return (
    <IstWrapper>
      <TrainingPageContent />
    </IstWrapper>
  );
}
