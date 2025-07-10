"use client"

import { Textarea } from "@/components/ui/textarea"

interface QuestionProps {
  question: {
    id: string
    question: string
  }
  value: string
  onChange: (value: string) => void
  isTraining?: boolean
}

export function TextQuestion({ question, value, onChange, isTraining = false }: QuestionProps) {
  return (
    <div className="space-y-4">
      {/* Display the question text only in training mode */}
      {isTraining && (
        <div>
          <p>{question.question}</p>
        </div>
      )}
      
      <div className="space-y-2">
        <Textarea
          id={question.id}
          placeholder="Ketik jawaban Anda di sini..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[100px] sm:min-h-[120px]"
        />
        <p className="text-xs sm:text-sm text-gray-600">Silakan berikan jawaban yang detail untuk pertanyaan di atas.</p>
      </div>
    </div>
  )
}
