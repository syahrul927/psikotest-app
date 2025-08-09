import Image from "next/image";
import {
  RadioQuestion,
  TextQuestion,
  NumberSelectionQuestion,
} from "../ist-question-type";
import { SUBTEST_IDS } from "../lib/ist-constants";

interface OptionData {
  id: string;
  text?: string | null;
  imageUrl?: string | null;
  label?: string;
}

interface QuestionData {
  id: string | number;
  text?: string | null;
  imageUrl?: string | null;
  options?: OptionData[];
  [key: string]: unknown;
}

export function getTestComponentByType(type: string) {
  if (SUBTEST_IDS.RADIO.map(String).includes(type)) return RadioQuestion;
  if (type === String(SUBTEST_IDS.TEXT[0])) return TextQuestion;
  if (SUBTEST_IDS.NUMBER_SELECTION.map(String).includes(type)) return NumberSelectionQuestion;
  const FallbackComponent = () => <div>Unknown Type: {type}</div>;
  FallbackComponent.displayName = `FallbackComponent_${type}`;
  return FallbackComponent;
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
  questions: QuestionData[];
  answers: { questionId: string; answer: string | number[] }[];
  handleAnswer: (questionId: string, answer: string | number[]) => void;
  totalQuestions: number;
  isTraining?: boolean;
}) {
  const QuestionComponent = getTestComponentByType(type);

  return (
    <>
      {questions.map((questionData, index) => {
        const questionId = String(questionData.id);
        const answerObj = answers.find((a) => a.questionId === questionId);
        const rawValue =
          answerObj?.answer ?? (["5", "6"].includes(type) ? [] : "");

        // Type-safe value conversion based on question type
        const getTypedValue = () => {
          if (["5", "6"].includes(type)) {
            // Number selection questions expect number[]
            if (Array.isArray(rawValue)) {
              return rawValue
                .map((v) => (typeof v === "number" ? v : Number(v)))
                .filter((v) => !isNaN(v));
            }
            return [];
          } else {
            // Radio and text questions expect string
            return String(rawValue);
          }
        };

        const value = getTypedValue();

        return (
          <div
            key={questionId}
            className="border-b pb-6 last:border-b-0 last:pb-0 sm:pb-8"
          >
            {/* Question Number - Only show for non-number-selection types and not for subtest 5 & 6 */}
            {!SUBTEST_IDS.NUMBER_SELECTION.map(String).includes(type) && (
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
            {!SUBTEST_IDS.NUMBER_SELECTION.map(String).includes(type) && (
              <p className="mb-4 text-lg leading-relaxed font-medium sm:mb-6 sm:text-xl">
                {questionData.text}
              </p>
            )}
            {questionData.text === "" && questionData.imageUrl && (
              <div className="flex w-full justify-center">
                <Image
                  src={`/api/images/${questionData.imageUrl}`}
                  alt={`Question ${index + 1}`}
                  width={150}
                  height={150}
                  className="mb-6 rounded-lg border-2 dark:invert"
                />
              </div>
            )}
            <QuestionComponent
              question={{
                id: String(questionData.id),
                question: questionData.text || "",
                text: questionData.text || "",
                subtestTemplateId: type,
                options: (questionData.options || []).map(
                  (option: OptionData) => ({
                    id: option.id,
                    optionLabel: `${option.label})`,
                    text: option.text || option.label || "",
                    imageUrl: option.imageUrl || undefined,
                  }),
                ),
              }}
              value={value as string & number[]}
              onChange={(val: string | number[]) =>
                handleAnswer(questionId, val)
              }
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
