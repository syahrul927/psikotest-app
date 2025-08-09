"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { NUMBERS } from "../lib/ist-constants";
import { motion } from "framer-motion";

interface QuestionProps {
  question: {
    id: string;
    text: string;
  };
  value: number[];
  onChange: (value: number[]) => void;
  questionNumber?: number;
  totalQuestions?: number;
}

export function NumberSelectionQuestion({
  question,
  value,
  onChange,
  questionNumber,
  totalQuestions,
}: QuestionProps) {
  const numbers = NUMBERS.AVAILABLE;

  const toggleNumber = (num: number) => {
    if (value.includes(num)) {
      onChange(value.filter((n: number) => n !== num));
    } else {
      onChange([...value, num]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Question Number Header */}
      {questionNumber && totalQuestions && (
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-background flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold sm:h-8 sm:w-8">
            {questionNumber}
          </div>
          <h3 className="text-base font-semibold sm:text-lg">
            Pertanyaan {questionNumber} dari {totalQuestions}
          </h3>
        </div>
      )}

      {/* Pattern display */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <div className="flex w-full items-center justify-center rounded-lg p-4 text-lg font-medium sm:text-xl">
          <div>{question?.text}</div>
        </div>
      </div>

      <div className="pt-4">
        {/* Mobile: Single row layout */}
        <div className="flex flex-wrap justify-center gap-2 sm:hidden">
          {numbers.map((num) => {
            const isSelected = value.includes(num);
            return (
              <motion.div
                key={num}
                onClick={() => toggleNumber(num)}
                className={cn(
                  "relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border-2 text-xl font-bold transition-all select-none",
                  "active:scale-95",
                  isSelected
                    ? "bg-background border-gray-800 dark:border-gray-200"
                    : "bg-background border-2",
                )}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 1 }}
                animate={{
                  scale: isSelected ? [1, 1.1, 1] : 1,
                  transition: { duration: 0.2 },
                }}
              >
                <span
                  className={cn(
                    "transition-all duration-300",
                    isSelected ? "opacity-60" : "opacity-100",
                  )}
                >
                  {num}
                </span>

                {isSelected && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute h-0.5 w-full rotate-45 rounded-full bg-gray-800 dark:bg-gray-200" />
                    <div className="absolute h-0.5 w-full -rotate-45 rounded-full bg-gray-800 dark:bg-gray-200" />
                  </motion.div>
                )}

                <Checkbox checked={isSelected} className="sr-only" />
              </motion.div>
            );
          })}
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden grid-cols-5 gap-4 sm:grid sm:grid-cols-10">
          {numbers.map((num) => {
            const isSelected = value.includes(num);
            return (
              <motion.div
                key={num}
                onClick={() => toggleNumber(num)}
                className={cn(
                  "relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-lg border-2 text-2xl font-bold transition-all select-none",
                  "active:scale-95",
                  isSelected
                    ? "bg-background border-gray-800 dark:border-gray-200"
                    : "bg-background border-2",
                )}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 1 }}
                animate={{
                  scale: isSelected ? [1, 1.1, 1] : 1,
                  transition: { duration: 0.2 },
                }}
              >
                <span
                  className={cn(
                    "transition-all duration-300",
                    isSelected ? "opacity-60" : "opacity-100",
                  )}
                >
                  {num}
                </span>

                {isSelected && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute h-0.5 w-full rotate-45 rounded-full bg-gray-800 dark:bg-gray-200" />
                    <div className="absolute h-0.5 w-full -rotate-45 rounded-full bg-gray-800 dark:bg-gray-200" />
                  </motion.div>
                )}

                <Checkbox checked={isSelected} className="sr-only" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {value.length > 0 && (
        <div className="mt-6 flex items-center justify-center">
          <div className="bg-background rounded-lg border-2 px-6 py-3">
            <p className="text-lg font-medium">
              Angka yang dipilih:{" "}
              {value.sort((a: number, b: number) => a - b).join(", ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
