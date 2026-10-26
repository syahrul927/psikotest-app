"use client";

import { LoaderSpinner } from "@/components/ui/loading-spinner";
import { useGetProfileWwqInvitation } from "@/hooks/api/wwq-invitation/use-get-profile-wwq-invitation";
import { useFindAllQuestions } from "@/hooks/api/wwq-test/use-find-all-questions";
import { useSubmitAnswerWwqTest } from "@/hooks/api/wwq-test/use-submit-answer-wwq-test";
import { PAGE_URLS } from "@/lib/page-url";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { WwqWrapper } from "../wwq-wrapper";
import QuestionCard from "./question-card";
import type { WwqTestQuestionType } from "./schema";
import TestHeader from "./test-header";
import TestNavigation from "./test-navigation";
import { scrollToElement } from "@/lib/utils";

interface TestFormProps {
  invitationId: string;
}

const ID_TOP_WRAPPER = "top-wrapper";

const WwqTestForm = ({ invitationId }: TestFormProps) => {
  const { data, isLoading: loadingGetQuestions } = useFindAllQuestions();
  const { data: profileTester, isLoading: loadingGetProfile } =
    useGetProfileWwqInvitation(invitationId);
  const router = useRouter();

  const { mutate: submitAnswers } = useSubmitAnswerWwqTest(() =>
    router.push(PAGE_URLS.WWQ_THANKS),
  );

  const isLoading = useMemo(() => {
    return [loadingGetQuestions, loadingGetProfile].some((b) => b);
  }, [loadingGetProfile, loadingGetQuestions]);

  const questions: WwqTestQuestionType[] = useMemo(() => {
    return data ?? [];
  }, [data]);

  const participantName = profileTester?.name;
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<Map<string, boolean>>(new Map());

  const questionsPerPage = 10;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage,
  );

  const progressPercentage = (answers.size / questions.length) * 100;

  // Auto-save answers to localStorage (question id -> boolean)
  useEffect(() => {
    const savedAnswers = localStorage.getItem("wwq-responses");
    if (savedAnswers) {
      try {
        // parse with type assertion
        const parsed = JSON.parse(savedAnswers) as Record<string, boolean>;

        // validate that it's actually an object of question id -> answer
        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed) &&
          Object.values(parsed).every((v) => typeof v === "boolean")
        ) {
          setAnswers(new Map(Object.entries(parsed)));
        }
      } catch (e) {
        console.error("Failed to parse saved answers", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "wwq-responses",
      JSON.stringify(Object.fromEntries(answers)),
    );
  }, [answers]);

  const handleResponse = (questionId: string, answer: boolean) => {
    setAnswers((prev) => new Map(prev.set(questionId, answer)));
  };

  const onComplete = () => {
    submitAnswers({
      invitationId,
      data: [...answers].map(([questionId, answer]) => ({
        questionId,
        answer,
      })),
    });
  };
  const canGoNext = currentPage < totalPages - 1;
  const canGoPrevious = currentPage > 0;
  const currentPageAnswered = currentQuestions.every((q) => answers.has(q.id));

  const handleNext = () => {
    if (canGoNext) {
      setCurrentPage((prev) => prev + 1);
    } else if (answers.size === questions.length) {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  useEffect(() => {
    scrollToElement(ID_TOP_WRAPPER);
  }, [currentPage]);

  if (isLoading) {
    <div className="flex h-screen w-screen flex-row items-center justify-center gap-x-4 text-xl">
      <LoaderSpinner />
    </div>;
  }
  return (
    <WwqWrapper>
      <div className="bg-background min-h-screen" id={ID_TOP_WRAPPER}>
        <TestHeader
          participantName={participantName ?? ""}
          currentPage={currentPage}
          totalPages={totalPages}
          responsesCount={answers.size}
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
            {currentQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                selected={answers.get(question.id)}
                onSelect={(answer) => handleResponse(question.id, answer)}
                questionNumber={question.order}
              />
            ))}
          </motion.div>
        </div>

        <TestNavigation
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          currentPageAnswered={currentPageAnswered}
          currentQuestionsAnswered={
            currentQuestions.filter((q) => answers.has(q.id)).length
          }
          currentQuestionsTotal={currentQuestions.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </div>
    </WwqWrapper>
  );
};

export default WwqTestForm;
