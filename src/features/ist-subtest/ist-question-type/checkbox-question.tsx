"use client"

import { Checkbox } from "@/components/ui/checkbox"
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
  value: string[]
  onChange: (value: string[]) => void
}

export function CheckboxQuestion({ question, value, onChange }: QuestionProps) {
  const handleCheckboxChange = (optionId: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionId])
    } else {
      onChange(value.filter((id) => id !== optionId))
    }
  }

  return (
    <div className="space-y-2 sm:space-y-3">
      {question.options.map((option) => (
        <div key={option.id} className="flex items-center space-x-2 rounded-md border p-3">
          <Checkbox
            id={option.id}
            checked={value.includes(option.id)}
            onCheckedChange={(checked) => handleCheckboxChange(option.id, checked as boolean)}
          />
          <Label htmlFor={option.id} className="flex-grow cursor-pointer text-sm sm:text-base">
            {option.text}
          </Label>
        </div>
      ))}
    </div>
  )
}
