"use client";
/* eslint-disable @typescript-eslint/no-empty-function */
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface QuestionProps {
  question: {
    id: string;
    question: string;
    pattern: string;
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
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  const toggleNumber = (num: number) => {
    if (value.includes(num)) {
      onChange(value.filter((n) => n !== num));
    } else {
      onChange([...value, num]);
    }
  };

  // Display the pattern with a question mark at the end
  const patternArray = question.pattern.split(",");

  return (
    <div className="space-y-6">
      {/* Question Number Header */}
      {questionNumber && totalQuestions && (
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm font-bold text-white sm:h-8 sm:w-8">
            {questionNumber}
          </div>
          <h3 className="text-base font-semibold text-gray-700 sm:text-lg">
            Pertanyaan {questionNumber} dari {totalQuestions}
          </h3>
        </div>
      )}

      {/* Pattern display */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {patternArray.map((num, index) => (
          <div
            key={index}
            className="flex h-10 w-10 items-center justify-center rounded-lg border-2 bg-gray-50 text-lg font-medium sm:h-12 sm:w-12 sm:text-xl dark:bg-gray-950"
          >
            {index === patternArray.length - 1 ? (
              <span className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">
                ?
              </span>
            ) : (
              <span className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">
                {num}
              </span>
            )}
          </div>
        ))}
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
                  "hover:bg-gray-50 active:scale-95 dark:hover:bg-gray-950",
                  isSelected
                    ? "dark:textgray-100 border-gray-800 bg-gray-100 text-gray-900 dark:border-gray-200 dark:bg-gray-900"
                    : "border-gray-200 bg-white text-gray-800 hover:border-gray-300 dark:border-gray-800 dark:bg-black dark:text-gray-200 dark:hover:border-gray-700",
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
                    className="absolute inset-0 flex items-center justify-center text-gray-800 dark:text-gray-200"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute h-0.5 w-full rotate-45 rounded-full bg-gray-800 dark:bg-gray-200" />
                    <div className="absolute h-0.5 w-full -rotate-45 rounded-full bg-gray-800 dark:bg-gray-200" />
                  </motion.div>
                )}

                <Checkbox
                  checked={isSelected}
                  className="sr-only"
                  onCheckedChange={() => { }}
                />
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
                  "hover:bg-gray-50 active:scale-95 dark:hover:bg-gray-950",
                  isSelected
                    ? "dark:bordergray-200 dark:textgray-100 border-gray-800 bg-gray-100 text-gray-900 dark:bg-gray-900"
                    : "border-gray-200 bg-white text-gray-800 hover:border-gray-300 dark:border-gray-800 dark:bg-black dark:text-gray-200 dark:hover:border-gray-700",
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
                    className="absolute inset-0 flex items-center justify-center text-gray-800 dark:text-gray-200"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute h-0.5 w-full rotate-45 rounded-full bg-gray-800 dark:bg-gray-200" />
                    <div className="absolute h-0.5 w-full -rotate-45 rounded-full bg-gray-800 dark:bg-gray-200" />
                  </motion.div>
                )}

                <Checkbox
                  checked={isSelected}
                  className="sr-only"
                  onCheckedChange={() => { }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {value.length > 0 && (
        <div className="mt-6 flex items-center justify-center">
          <div className="rounded-lg bg-gray-100 px-6 py-3 dark:bg-gray-900">
            <p className="text-lg font-medium">
              Angka yang dipilih: {value.sort((a, b) => a - b).join(", ")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
