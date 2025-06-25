import { RadioQuestion, TextQuestion, NumberSelectionQuestion } from "../ist-question-type";

export function getTestComponentByType(type: string) {
  if (["1", "2", "3", "7", "8", "9"].includes(type)) return RadioQuestion;
  if (type === "4") return TextQuestion;
  if (["5", "6"].includes(type)) return NumberSelectionQuestion;
  return () => <div>Unknown Type: {type}</div>;
}

export function IstTestQuestionWrapper({
  type,
  questions,
  answers,
  handleAnswer,
  totalQuestions,
  isTraining = false,
}: {
  type: string;
  questions: any[];
  answers: { questionId: string; answer: any }[];
  handleAnswer: (questionId: string, answer: any) => void;
  totalQuestions: number;
  isTraining?: boolean;
}) {
  const QuestionComponent = getTestComponentByType(type);

  return (
    <>
      {questions.map((questionData, index) => {
        const questionId = String(questionData.id);
        const answerObj = answers.find((a) => a.questionId === questionId);
        const value =
          answerObj?.answer ?? (["5", "6"].includes(type) ? [] : "");
        return (
          <div key={questionId} className="border-b pb-6 last:border-b-0 last:pb-0 sm:pb-8">
            {/* Question Number - Only show for non-number-selection types and not for subtest 5 & 6 */}
            {!(type === "5" || type === "6") && (
              <div className="mb-3 flex items-center gap-3 sm:mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold sm:h-8 sm:w-8">
                  {index + 1}
                </div>
                <h3 className="text-base font-semibold sm:text-lg">
                  Pertanyaan {index + 1} dari {questions.length}
                </h3>
              </div>
            )}
            {/* Question Text - Hide for number-selection type */}
            {!(type === "5" || type === "6") && (
              <p className="mb-4 text-lg leading-relaxed font-medium sm:mb-6 sm:text-xl">
                {questionData?.text}
              </p>
            )}
            {questionData?.text === "" && questionData?.imageUrl && (
              <div className="flex w-full justify-center">
                <img
                  src={`/api/images/${questionData?.imageUrl}`}
                  alt={`Question ${index + 1}`}
                  width={250}
                  height={250}
                  className="mb-6 rounded-lg border-2 dark:invert"
                />
              </div>
            )}
            <QuestionComponent
              question={questionData}
              value={value}
              onChange={(val: any) => handleAnswer(questionId, val)}
              isTraining={isTraining}
              {...(["5", "6"].includes(type)
                ? { questionNumber: index + 1, totalQuestions }
                : {})}
            />
          </div>
        );
      })}
    </>
  );
} 