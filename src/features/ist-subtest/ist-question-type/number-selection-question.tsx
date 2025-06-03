"use client"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface QuestionProps {
  question: {
    id: string
    question: string
    pattern: string
  }
  value: number[]
  onChange: (value: number[]) => void
  questionNumber?: number
  totalQuestions?: number
}

export default function NumberSelectionQuestion({
  question,
  value,
  onChange,
  questionNumber,
  totalQuestions,
}: QuestionProps) {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

  const toggleNumber = (num: number) => {
    if (value.includes(num)) {
      onChange(value.filter((n) => n !== num))
    } else {
      onChange([...value, num])
    }
  }

  // Display the pattern with a question mark at the end
  const patternArray = question.pattern.split(",")

  return (
    <div className="space-y-6">
      {/* Question Number Header */}
      {questionNumber && totalQuestions && (
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-black text-white rounded-full text-sm font-bold">
            {questionNumber}
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-700">
            Pertanyaan {questionNumber} dari {totalQuestions}
          </h3>
        </div>
      )}

      {/* Pattern display */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
        {patternArray.map((num, index) => (
          <div
            key={index}
            className="flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-lg border-2 text-lg sm:text-xl font-medium dark:bg-gray-950 bg-gray-50"
          >
            {index === patternArray.length - 1 ? (
              <span className="text-xl sm:text-2xl font-bold dark:text-gray-100 text-gray-900">?</span>
            ) : (
              <span className="text-xl sm:text-2xl font-bold dark:text-gray-100 text-gray-900">{num}</span>
            )}
          </div>
        ))}
      </div>

      <div className="pt-4">
        {/* Mobile: Single row layout */}
        <div className="flex flex-wrap justify-center gap-2 sm:hidden">
          {numbers.map((num) => {
            const isSelected = value.includes(num)
            return (
              <motion.div
                key={num}
                onClick={() => toggleNumber(num)}
                className={cn(
                  "relative flex items-center justify-center h-12 w-12 rounded-lg border-2 text-xl font-bold cursor-pointer select-none transition-all",
                  "hover:bg-gray-50 active:scale-95 dark:hover:bg-gray-950",
                  isSelected
                    ? "dark:bg-gray-900 bg-gray-100 dark:border-gray-200 border-gray-800 dark:textgray-100 text-gray-900"
                    : "dark:bg-black bg-white dark:border-gray-800 border-gray-200 dark:text-gray-200 text-gray-800 dark:hover:border-gray-700 hover:border-gray-300",
                )}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 1 }}
                animate={{
                  scale: isSelected ? [1, 1.1, 1] : 1,
                  transition: { duration: 0.2 },
                }}
              >
                <span className={cn("transition-all duration-300", isSelected ? "opacity-60" : "opacity-100")}>
                  {num}
                </span>

                {isSelected && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center dark:text-gray-200 text-gray-800"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute h-0.5 w-full dark:bg-gray-200 bg-gray-800 rotate-45 rounded-full" />
                    <div className="absolute h-0.5 w-full dark:bg-gray-200 bg-gray-800 -rotate-45 rounded-full" />
                  </motion.div>
                )}

                <Checkbox checked={isSelected} className="sr-only" onCheckedChange={() => {}} />
              </motion.div>
            )
          })}
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden sm:grid grid-cols-5 gap-4 sm:grid-cols-10">
          {numbers.map((num) => {
            const isSelected = value.includes(num)
            return (
              <motion.div
                key={num}
                onClick={() => toggleNumber(num)}
                className={cn(
                  "relative flex items-center justify-center h-14 w-14 rounded-lg border-2 text-2xl font-bold cursor-pointer select-none transition-all",
                  "dark:hover:bg-gray-950 hover:bg-gray-50 active:scale-95",
                  isSelected
                    ? "dark:bg-gray-900 bg-gray-100 dark:bordergray-200 border-gray-800 dark:textgray-100 text-gray-900"
                    : "dark:bg-black bg-white dark:border-gray-800 border-gray-200 dark:text-gray-200 text-gray-800 dark:hover:border-gray-700 hover:border-gray-300",
                )}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 1 }}
                animate={{
                  scale: isSelected ? [1, 1.1, 1] : 1,
                  transition: { duration: 0.2 },
                }}
              >
                <span className={cn("transition-all duration-300", isSelected ? "opacity-60" : "opacity-100")}>
                  {num}
                </span>

                {isSelected && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center dark:text-gray-200 text-gray-800"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute h-0.5 w-full dark:bg-gray-200 bg-gray-800 rotate-45 rounded-full" />
                    <div className="absolute h-0.5 w-full dark:bg-gray-200 bg-gray-800 -rotate-45 rounded-full" />
                  </motion.div>
                )}

                <Checkbox checked={isSelected} className="sr-only" onCheckedChange={() => {}} />
              </motion.div>
            )
          })}
        </div>
      </div>

      {value.length > 0 && (
        <div className="flex justify-center items-center mt-6">
          <div className="dark:bg-gray-900 bg-gray-100 px-6 py-3 rounded-lg">
            <p className="text-lg font-medium">Angka yang dipilih: {value.sort((a, b) => a - b).join(", ")}</p>
          </div>
        </div>
      )}
    </div>
  )
}
