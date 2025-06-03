"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { testData } from "@/lib/test-data"
import { AlertCircle, ArrowLeft, Brain } from "lucide-react"
import RadioQuestion from "../ist-question-type/radio-question"
import TextQuestion from "../ist-question-type/text-question"
import NumberSelectionQuestion from "../ist-question-type/number-selection-question"
import Timer from "@/components/timer"

export default function TestPage() {
  const params = useParams()
  const router = useRouter()
  const subtestId = Number.parseInt(params.type as string)

  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [timerActive, setTimerActive] = useState(true)
  const [timeExpired, setTimeExpired] = useState(false)

  const SUBTEST_TIME = 300 // 5 minutes in seconds

  // Validate subtest ID
  if (isNaN(subtestId) || subtestId < 0 || subtestId >= testData.length) {
    router.push("/subtests")
    return null
  }

  const currentSubtestData = testData[subtestId]
  const totalQuestions = currentSubtestData?.questions.length ?? 0

  const handleAnswer = (questionIndex: number, answer: any) => {
    setAnswers({
      ...answers,
      [`${subtestId}-${questionIndex}`]: answer,
    })
  }

  const handleBackToSelection = () => {
    router.back()
  }

  const handleCompleteSubtest = () => {
    // Here you would typically save the answers to a database or state management
    console.log("Subtest completed:", answers)
    router.push("/subtests")
  }

  const handleTimeUp = () => {
    setTimeExpired(true)
    setTimerActive(false)
  }

  const handleContinueAfterTimeUp = () => {
    router.push("/subtests")
  }

  const isSubtestCompleted = () => {
    // Check if all questions in the current subtest have been answered
    for (let i = 0; i < totalQuestions; i++) {
      const currentAnswer = answers[`${subtestId}-${i}`]

      if (currentSubtestData?.type === "radio") {
        if (currentAnswer === undefined) return false
      } else if (currentSubtestData?.type === "text") {
        if (!currentAnswer || currentAnswer.trim() === "") return false
      } else if (currentSubtestData?.type === "number-selection") {
        if (!currentAnswer || currentAnswer.length === 0) return false
      }
    }
    return true
  }

  if (timeExpired) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md mx-auto shadow-md border w-full">
          <CardContent className="p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gray-100 rounded-full">
                <AlertCircle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-700" />
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Waktu Habis!</h2>
            <p className="text-gray-600 mb-6">
              Waktu untuk <span className="font-semibold">{currentSubtestData?.title}</span> telah habis.
            </p>
            <Button onClick={handleContinueAfterTimeUp} className="w-full bg-white dark:bg-black hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-white">
              Kembali ke Pilihan Subtes
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen dark:bg-black bg-white">
      {/* Sticky Header with Timer */}
      <div className="sticky top-0 z-50 dark:bg-black bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleBackToSelection} className="hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-black rounded-lg">
                  <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-black dark:text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold leading-tight">{currentSubtestData?.title}</h1>
                  <p className="text-xs sm:text-sm text-gray-600">{totalQuestions} Pertanyaan</p>
                </div>
              </div>
            </div>
            <div className="self-end sm:self-auto sm:ml-auto">
              <Timer seconds={SUBTEST_TIME} onTimeUp={handleTimeUp} isActive={timerActive} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6">
        <Card className="shadow-md border">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="space-y-8 sm:space-y-10 mb-6 sm:mb-8">
              {currentSubtestData?.questions.map((questionData: any, index) => (
                <div key={questionData.id} className="pb-6 sm:pb-8 border-b last:border-b-0 last:pb-0">
                  {/* Question Number - Only show for non-number-selection types */}
                  {currentSubtestData?.type !== "number-selection" && (
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 bg-white dark:bg-black text-black dark:text-white rounded-full text-sm font-bold">
                        {index + 1}
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                        Pertanyaan {index + 1} dari {totalQuestions}
                      </h3>
                    </div>
                  )}

                  {/* Question Text - Hide for number-selection type */}
                  {currentSubtestData?.type !== "number-selection" && (
                    <p className="text-lg sm:text-xl font-medium mb-4 sm:mb-6 leading-relaxed">
                      {questionData.question}
                    </p>
                  )}

                  {/* Question Components */}
                  {currentSubtestData?.type === "radio" && (
                    <RadioQuestion
                      question={questionData}
                      value={answers[`${subtestId}-${index}`]}
                      onChange={(value) => handleAnswer(index, value)}
                    />
                  )}

                  {currentSubtestData?.type === "text" && (
                    <TextQuestion
                      question={questionData}
                      value={answers[`${subtestId}-${index}`] || ""}
                      onChange={(value) => handleAnswer(index, value)}
                    />
                  )}

                  {currentSubtestData?.type === "number-selection" && (
                    <NumberSelectionQuestion
                      question={questionData}
                      value={answers[`${subtestId}-${index}`] || []}
                      onChange={(value) => handleAnswer(index, value)}
                      questionNumber={index + 1}
                      totalQuestions={totalQuestions}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between pt-4 sm:pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBackToSelection}
                className="order-2 sm:order-1 w-full sm:w-auto px-4 sm:px-8"
              >
                Kembali ke Pilihan Subtes
              </Button>
              <Button
                onClick={handleCompleteSubtest}
                disabled={!isSubtestCompleted()}
                className="order-1 sm:order-2 w-full sm:w-auto px-4 sm:px-8 bg-black hover:bg-gray-800 text-white"
              >
                Selesaikan Subtes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
