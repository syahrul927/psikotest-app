"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface Option {
  id: string
  text: string
  imageUrl?: string | null
}

interface QuestionProps {
  question: {
    id: string
    question: string
    subtestTemplateId : string
    options: Option[]
  }
  value: string
  onChange: (value: string) => void
}

export function RadioQuestion({ question, value, onChange }: QuestionProps) {
  console.log("ques", question)
  const isImage = ["7","8"].includes(question.subtestTemplateId)
  return (
    <RadioGroup value={value} onValueChange={onChange} className={cn("space-y-2 sm:space-y-3 flex flex-col p-3", isImage && "flex-row" )}>
      {question.options.map((option) => (
        <div key={option.id} className={cn(
          "rounded-md border p-3",
          isImage && "w-48 h-48 flex-col justify-center dark:bg-black",
          "cursor-pointer"
        )}>
          <Label 
            htmlFor={option.id} 
            className="flex flex-col items-center w-full h-full cursor-pointer justify-center"
          >
            {option.imageUrl && (
              <Image 
                src={option.imageUrl}
                alt={`Question ${question.id + 1}`}
                width={200}
                height={200}
                className={cn('rounded-lg object-contain dark:invert aspect-square hidden m-4', isImage && "flex")}
              />
            )}
            <div className={cn("flex items-center gap-4 w-full", isImage && "gap-0")}>
              <div className={cn("w-fit flex items-center justify-start", isImage && 'flex w-full items-center justify-center')}><RadioGroupItem value={option.id} id={option.id}/></div>
              <span className={`flex-grow text-sm sm:text-base ${question.subtestTemplateId === "7" || question.subtestTemplateId === "8" && 'hidden'}`}>
                {option.text.charAt(0).toUpperCase() + option.text.slice(1)}
              </span>
            </div>
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}
