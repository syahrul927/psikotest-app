"use client";

import { LoaderSpinner } from "@/components/ui/loading-spinner";
import { useGetProfilePapiKostickInvitation } from "@/hooks/api/papi-kostick-invitation/use-get-profile-papi-kostick-invitation";
import { useFindAllQuestions } from "@/hooks/api/papi-kostick-test/use-find-all-questions";
import { useSubmitAnswerPapiKostickTest } from "@/hooks/api/papi-kostick-test/use-submit-answer-papi-kostick-test";
import { PAGE_URLS } from "@/lib/page-url";
import type { AnswersPapiKostickRequest } from "@/server/api/routers/papi-kostick-test-router/schema";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { z } from "zod";
import { PapiKostickWrapper } from "../papi-kostick-wrapper";
import QuestionCard from "./question-card";
import type { PapiKostickTestQuestionType } from "./schema";
import TestHeader from "./test-header";
import TestNavigation from "./test-navigation";

interface TestFormProps {
  invitationId: string;
}

const PapiKostickTestForm = ({ invitationId }: TestFormProps) => {
  const { data, isLoading: loadingGetQuestions } = useFindAllQuestions();
  const { data: profileTester, isLoading: loadingGetProfile } =
    useGetProfilePapiKostickInvitation(invitationId);
  const router = useRouter();

  const { mutate: submitAnswers } = useSubmitAnswerPapiKostickTest(() =>
    router.push(PAGE_URLS.PAPI_KOSTICK_THANKS),
  );

  const isLoading = useMemo(() => {
    return [loadingGetQuestions, loadingGetProfile].every((b) => b);
  }, [loadingGetProfile, loadingGetQuestions]);

  const questions: PapiKostickTestQuestionType[] = useMemo(() => {
    return data ?? [];
  }, [data?.length]);

  const participantName = profileTester?.name;
  const [currentPage, setCurrentPage] = useState(0);
  const [responses, setResponses] = useState<Map<string, "A" | "B">>(new Map());

  const questionsPerPage = 10;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage,
  );

  const progressPercentage = (responses.size / questions.length) * 100;

  // Auto-save responses to localStorage
  useEffect(() => {
    const savedResponses = localStorage.getItem("papi-kostick-responses");
    if (savedResponses) {
      setResponses(new Map(JSON.parse(savedResponses)));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "papi-kostick-responses",
      JSON.stringify(Array.from(responses.entries())),
    );
  }, [responses]);

  const handleResponse = (questionId: string, option: "A" | "B") => {
    setResponses((prev) => new Map(prev.set(questionId, option)));
  };

  const onComplete = () => {
    const answers: z.infer<typeof AnswersPapiKostickRequest> = [];
    responses.forEach((answer, questionId) => {
      answers.push({
        questionId,
        answer,
      });
    });
    submitAnswers({ invitationId, data: answers });
  };
  const canGoNext = currentPage < totalPages - 1;
  const canGoPrevious = currentPage > 0;
  const currentPageAnswered = currentQuestions.every((q) =>
    responses.has(q.id),
  );

  const handleNext = () => {
    if (canGoNext) {
      setCurrentPage((prev) => prev + 1);
    } else if (responses.size === questions.length) {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (isLoading) {
    <div className="flex h-screen w-screen flex-row items-center justify-center gap-x-4 text-xl">
      <LoaderSpinner />
    </div>;
  }
  return (
    <PapiKostickWrapper>
      <div className="bg-background min-h-screen">
        <TestHeader
          participantName={participantName ?? ""}
          currentPage={currentPage}
          totalPages={totalPages}
          responsesCount={responses.size}
          totalQuestions={questions.length}
          progressPercentage={progressPercentage}
        />

        {/* Main Content */}
        <div className="mx-auto max-w-4xl p-4">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {currentQuestions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                selectedOption={responses.get(question.id)}
                onSelect={(option) => handleResponse(question.id, option)}
                questionNumber={currentPage * questionsPerPage + index + 1}
              />
            ))}
          </motion.div>
        </div>

        <TestNavigation
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          currentPageAnswered={currentPageAnswered}
          currentQuestionsAnswered={
            currentQuestions.filter((q) => responses.has(q.id)).length
          }
          currentQuestionsTotal={currentQuestions.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </div>
    </PapiKostickWrapper>
  );
};

export default PapiKostickTestForm;
