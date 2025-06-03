"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Option {
  id: string
  text: string
}

interface QuestionProps {
  question: {
    id: string
    question: string
    options: Option[]
  }
  value: string
  onChange: (value: string) => void
}

export default function RadioQuestion({ question, value, onChange }: QuestionProps) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="space-y-2 sm:space-y-3">
      {question.options.map((option) => (
        <div key={option.id} className="flex items-center space-x-2 rounded-md border p-3 dark:hover:bg-gray-950 hover:bg-gray-50">
          <RadioGroupItem value={option.id} id={option.id} />
          <Label htmlFor={option.id} className="flex-grow cursor-pointer text-sm sm:text-base">
            {option.text}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}
